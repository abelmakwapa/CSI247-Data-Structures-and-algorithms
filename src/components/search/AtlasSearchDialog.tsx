'use client';

import { useDocsSearch } from 'fumadocs-core/search/client';
import { fetchClient } from 'fumadocs-core/search/client/fetch';
import {
  SearchDialog,
  SearchDialogClose,
  SearchDialogContent,
  SearchDialogHeader,
  SearchDialogIcon,
  SearchDialogInput,
  SearchDialogList,
  SearchDialogListItem,
  SearchDialogOverlay,
  type SearchItemType,
  type SharedProps,
} from 'fumadocs-ui/components/dialog/search';
import { useEffect, useMemo, useState } from 'react';
import { PROGRESS_EVENT } from '@/components/study/ProgressTracker';
import { EMPTY_PROGRESS, readProgress, type StudyProgress } from '@/lib/study-progress';
import {
  complexityClasses,
  getComplexityClasses,
  topicMap,
  topicUrl,
  topics,
  type ComplexityClass,
  type TopicCategory,
  type TopicId,
  type TopicMetadata,
} from '@/lib/topics';
import type { TopicDifficulty } from '@/lib/topic-taxonomy';
import { getTopicIdFromUrl } from '@/lib/search';
import type { SearchPageTreeEntry } from '@/lib/search-page-tree';
import { useSearchPageTree } from './SearchPageTreeProvider';

const searchClient = fetchClient({ api: '/api/search' });
const DEFAULT_FILTERS: SearchFilters = {
  category: 'all',
  difficulty: 'all',
  status: 'all',
  complexity: 'all',
  bookmarked: false,
  review: false,
  recentlyStudied: false,
};

type SearchStatus = 'all' | 'understood' | 'review' | 'in-progress' | 'not-started';

interface SearchFilters {
  category: 'all' | TopicCategory;
  difficulty: 'all' | TopicDifficulty;
  status: SearchStatus;
  complexity: 'all' | ComplexityClass;
  bookmarked: boolean;
  review: boolean;
  recentlyStudied: boolean;
}

type SearchPageItem = Exclude<SearchItemType, { type: 'action' }>;

interface AtlasSearchItem extends SearchPageItem {
  topicId: TopicId;
  topic: TopicMetadata;
  groupLabel: TopicCategory;
  showGroup: boolean;
  matchingSection: string;
  matchingText: string;
}

export function AtlasSearchDialog(props: SharedProps) {
  const pages = useSearchPageTree();
  const [filters, setFilters] = useState<SearchFilters>(DEFAULT_FILTERS);
  const [progress, setProgress] = useState<StudyProgress>(EMPTY_PROGRESS);
  const { search, setSearch, query } = useDocsSearch({ client: searchClient, delayMs: 120 });

  useEffect(() => {
    const sync = () => setProgress(readProgress());
    sync();
    window.addEventListener(PROGRESS_EVENT, sync);
    window.addEventListener('storage', sync);
    return () => {
      window.removeEventListener(PROGRESS_EVENT, sync);
      window.removeEventListener('storage', sync);
    };
  }, []);

  const pageByUrl = useMemo(() => new Map(pages.map((page) => [page.url.replace(/\/$/, ''), page])), [pages]);
  const defaultItems = useMemo(() => topics
    .map((topic) => makeTopicPageItem(topic, pageByUrl.get(topicUrl(topic.id)), 'Topic overview'))
    .filter((item): item is AtlasSearchItem => Boolean(item)), [pageByUrl]);

  const remoteItems = useMemo(() => {
    if (!Array.isArray(query.data)) return [];
    return query.data
      .map((result) => makeSearchItem(result, pageByUrl))
      .filter((item): item is AtlasSearchItem => Boolean(item));
  }, [pageByUrl, query.data]);

  const fallbackItems = useMemo(() => {
    const normalized = search.trim().toLowerCase();
    return defaultItems.filter((item) => `${item.topic.title} ${item.topic.description} ${item.topic.category} ${item.topic.difficulty}`.toLowerCase().includes(normalized));
  }, [defaultItems, search]);

  const sourceItems = search.trim().length === 0
    ? defaultItems
    : query.error
      ? fallbackItems
      : remoteItems;
  const items = useMemo(() => applyFilters(sourceItems, filters, progress), [filters, progress, sourceItems]);
  const groupedItems = useMemo(() => addGroupMarkers(items), [items]);
  const topicCount = useMemo(() => new Set(items.map((item) => item.topicId)).size, [items]);
  const isUsingFallback = Boolean(search.trim() && query.error);
  const hasActiveFilters = hasSearchFilters(filters);

  function updateFilter<Key extends keyof SearchFilters>(key: Key, value: SearchFilters[Key]): void {
    setFilters((current) => ({ ...current, [key]: value }));
  }

  return (
    <SearchDialog {...props} search={search} onSearchChange={setSearch} isLoading={query.isLoading}>
      <SearchDialogOverlay />
      <SearchDialogContent className="atlas-search-content">
        <SearchDialogHeader className="atlas-search-header">
          <SearchDialogIcon />
          <SearchDialogInput aria-label="Search topics and sections" aria-describedby="atlas-search-result-count" />
          <SearchDialogClose />
        </SearchDialogHeader>
        <SearchFiltersBar filters={filters} onChange={updateFilter} onClear={() => setFilters(DEFAULT_FILTERS)} hasActiveFilters={hasActiveFilters} />
        <div id="atlas-search-result-count" className="atlas-search-result-count" role="status" aria-live="polite" aria-atomic="true">
          {query.isLoading && search.trim() ? 'Searching topics…' : `${topicCount} ${topicCount === 1 ? 'topic' : 'topics'} · ${items.length} ${items.length === 1 ? 'match' : 'matches'}${isUsingFallback ? ' · using cached topic metadata' : ''}`}
        </div>
        <SearchDialogList
          className="atlas-search-list"
          items={groupedItems}
          Item={AtlasSearchListItem}
          Empty={() => <SearchEmptyState hasQuery={Boolean(search.trim())} hasFilters={hasActiveFilters} />}
        />
      </SearchDialogContent>
    </SearchDialog>
  );
}

function SearchFiltersBar({
  filters,
  onChange,
  onClear,
  hasActiveFilters,
}: {
  filters: SearchFilters;
  onChange: <Key extends keyof SearchFilters>(key: Key, value: SearchFilters[Key]) => void;
  onClear: () => void;
  hasActiveFilters: boolean;
}) {
  return (
    <fieldset className="atlas-search-filters">
      <legend>Filter topics</legend>
      <div className="atlas-search-filter-grid">
        <label>
          <span>Category</span>
          <select value={filters.category} onChange={(event) => onChange('category', event.target.value as SearchFilters['category'])}>
            <option value="all">All categories</option>
            <option value="Data structures">Data structures</option>
            <option value="Algorithms">Algorithms</option>
          </select>
        </label>
        <label>
          <span>Difficulty</span>
          <select value={filters.difficulty} onChange={(event) => onChange('difficulty', event.target.value as SearchFilters['difficulty'])}>
            <option value="all">All levels</option>
            <option value="Beginner">Beginner</option>
            <option value="Intermediate">Intermediate</option>
            <option value="Advanced">Advanced</option>
          </select>
        </label>
        <label>
          <span>Topic status</span>
          <select value={filters.status} onChange={(event) => onChange('status', event.target.value as SearchStatus)}>
            <option value="all">Any status</option>
            <option value="understood">Understood</option>
            <option value="in-progress">In progress</option>
            <option value="not-started">Not started</option>
            <option value="review">Marked for review</option>
          </select>
        </label>
        <label>
          <span>Complexity class</span>
          <select value={filters.complexity} onChange={(event) => onChange('complexity', event.target.value as SearchFilters['complexity'])}>
            <option value="all">Any complexity</option>
            {complexityClasses.map((complexityClass) => <option key={complexityClass} value={complexityClass}>{complexityClass}</option>)}
          </select>
        </label>
      </div>
      <div className="atlas-search-filter-toggles">
        <label className="atlas-search-checkbox"><input type="checkbox" checked={filters.bookmarked} onChange={(event) => onChange('bookmarked', event.target.checked)} /><span>Bookmarked</span></label>
        <label className="atlas-search-checkbox"><input type="checkbox" checked={filters.review} onChange={(event) => onChange('review', event.target.checked)} /><span>Review topics</span></label>
        <label className="atlas-search-checkbox"><input type="checkbox" checked={filters.recentlyStudied} onChange={(event) => onChange('recentlyStudied', event.target.checked)} /><span>Recently studied</span></label>
        <button type="button" className="atlas-search-clear" onClick={onClear} disabled={!hasActiveFilters}>Clear filters</button>
      </div>
    </fieldset>
  );
}

function AtlasSearchListItem({ item, onClick }: { item: SearchItemType; onClick: () => void }) {
  const result = item as AtlasSearchItem;
  return (
    <div className="atlas-search-result-group">
      {result.showGroup && <h3 className="atlas-search-group-title">{result.groupLabel}</h3>}
      <SearchDialogListItem item={item} onClick={onClick} className="atlas-search-result-item">
        <div className="atlas-search-result-copy">
          <div className="atlas-search-result-heading"><strong>{result.topic.title}</strong><span>{result.topic.category} · {result.topic.difficulty}</span></div>
          <p>{result.topic.description}</p>
          <div className="atlas-search-result-match"><span>Matching section</span><strong>{result.matchingSection}</strong>{result.matchingText && <small>{result.matchingText}</small>}</div>
        </div>
      </SearchDialogListItem>
    </div>
  );
}

function SearchEmptyState({ hasQuery, hasFilters }: { hasQuery: boolean; hasFilters: boolean }) {
  return <div className="atlas-search-empty"><strong>{hasQuery ? 'No topics match that search.' : 'No topics match these filters.'}</strong><p>{hasFilters ? 'Clear a filter or try a broader combination.' : 'Try a title, concept, or section name.'}</p></div>;
}

function makeTopicPageItem(topic: TopicMetadata, page: SearchPageTreeEntry | undefined, matchingSection: string): AtlasSearchItem | null {
  if (!page) return null;
  return {
    type: 'page',
    id: `topic-${topic.id}`,
    url: page.url,
    content: topic.description,
    breadcrumbs: page.breadcrumbs,
    topicId: topic.id,
    topic,
    groupLabel: topic.category,
    showGroup: false,
    matchingSection,
    matchingText: '',
  };
}

function makeSearchItem(result: SearchPageItem, pages: Map<string, SearchPageTreeEntry>): AtlasSearchItem | null {
  const topicId = getTopicIdFromUrl(result.url);
  if (!topicId) return null;
  const topic = topicMap.get(topicId);
  if (!topic) return null;
  const page = pages.get(result.url.split('#', 1)[0].replace(/\/$/, ''));
  const breadcrumbs = result.breadcrumbs?.map((breadcrumb) => plainText(breadcrumb)).filter(Boolean) ?? page?.breadcrumbs ?? [];
  const matchingSection = result.type === 'page' ? 'Topic overview' : sectionLabelFromUrl(result.url);
  return {
    ...result,
    breadcrumbs,
    topicId,
    topic,
    groupLabel: topic.category,
    showGroup: false,
    matchingSection,
    matchingText: result.type === 'page' ? '' : plainText(result.content).slice(0, 150),
  };
}

function applyFilters(items: AtlasSearchItem[], filters: SearchFilters, progress: StudyProgress): AtlasSearchItem[] {
  return items.filter((item) => {
    const { topic } = item;
    if (filters.category !== 'all' && topic.category !== filters.category) return false;
    if (filters.difficulty !== 'all' && topic.difficulty !== filters.difficulty) return false;
    if (filters.complexity !== 'all' && !getComplexityClasses(topic).includes(filters.complexity)) return false;
    if (filters.bookmarked && !progress.bookmarks.includes(topic.id)) return false;
    if (filters.review && !progress.review.includes(topic.id)) return false;
    if (filters.recentlyStudied && !progress.recentlyStudied.includes(topic.id)) return false;
    if (!matchesStatus(topic.id, filters.status, progress)) return false;
    return true;
  });
}

function matchesStatus(topicId: TopicId, status: SearchStatus, progress: StudyProgress): boolean {
  if (status === 'all') return true;
  if (status === 'understood') return progress.understood.includes(topicId);
  if (status === 'review') return progress.review.includes(topicId);
  const hasActivity = progress.recentlyStudied.includes(topicId)
    || Boolean(progress.notes[topicId]?.trim())
    || Boolean(progress.quizzes[topicId]?.answered.length)
    || Boolean(progress.reviewProgress.topics[topicId]);
  return status === 'in-progress' ? hasActivity && !progress.understood.includes(topicId) : !hasActivity;
}

function addGroupMarkers(items: AtlasSearchItem[]): AtlasSearchItem[] {
  const sorted = [...items].sort((left, right) => left.groupLabel.localeCompare(right.groupLabel) || left.topic.title.localeCompare(right.topic.title) || left.matchingSection.localeCompare(right.matchingSection));
  let previousGroup = '';
  return sorted.map((item) => {
    const showGroup = item.groupLabel !== previousGroup;
    previousGroup = item.groupLabel;
    return { ...item, showGroup };
  });
}

function hasSearchFilters(filters: SearchFilters): boolean {
  return filters.category !== 'all'
    || filters.difficulty !== 'all'
    || filters.status !== 'all'
    || filters.complexity !== 'all'
    || filters.bookmarked
    || filters.review
    || filters.recentlyStudied;
}

function plainText(value: unknown): string {
  return typeof value === 'string'
    ? value.replace(/<\/?mark>/g, '').replace(/[\n\r]+/g, ' ').replace(/[*_`#]/g, '').trim()
    : '';
}

function sectionLabelFromUrl(url: string): string {
  const hash = url.split('#', 2)[1];
  if (!hash) return 'Topic overview';
  return hash
    .split('-')
    .map((word) => word ? `${word[0].toUpperCase()}${word.slice(1)}` : word)
    .join(' ');
}
