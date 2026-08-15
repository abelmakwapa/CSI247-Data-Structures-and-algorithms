import type * as PageTree from 'fumadocs-core/page-tree';
import { source } from './source';

export interface SearchPageTreeEntry {
  title: string;
  url: string;
  breadcrumbs: string[];
  description: string;
}

function text(value: unknown): string {
  return typeof value === 'string' ? value : '';
}

function collectNodes(nodes: PageTree.Node[], breadcrumbs: string[], entries: SearchPageTreeEntry[]): void {
  nodes.forEach((node) => {
    if (node.type === 'page') {
      entries.push({
        title: text(node.name),
        url: node.url,
        breadcrumbs,
        description: text(node.description),
      });
      return;
    }

    if (node.type !== 'folder') return;

    const nextBreadcrumbs = node.name ? [...breadcrumbs, text(node.name)] : breadcrumbs;
    if (node.index) {
      entries.push({
        title: text(node.index.name),
        url: node.index.url,
        breadcrumbs: nextBreadcrumbs,
        description: text(node.index.description),
      });
    }
    collectNodes(node.children, nextBreadcrumbs, entries);
  });
}

export function getSearchPageTreeEntries(): SearchPageTreeEntry[] {
  const entries: SearchPageTreeEntry[] = [];
  collectNodes(source.getPageTree().children, [], entries);

  return entries.filter((entry, index, all) => all.findIndex((candidate) => candidate.url === entry.url) === index);
}
