'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import type { TopicId } from '@/lib/topics';
import { getTopic } from '@/lib/topics';
import { notifyProgress, ProgressTracker } from './ProgressTracker';
import { EMPTY_PROGRESS, readProgress, toggleTopic, touchTopic, writeProgress, type StudyProgress } from '@/lib/study-progress';
import { StudyToolbar } from './StudyToolbar';

export function TopicHero({ topicId, total }: { topicId: TopicId; total: number }) {
  const topic = getTopic(topicId);
  const [progress, setProgress] = useState<StudyProgress>(EMPTY_PROGRESS);

  useEffect(() => {
    const sync = () => setProgress(readProgress());
    sync();
    window.addEventListener('algo-atlas-progress', sync);
    const current = readProgress();
    const next = touchTopic(current, topicId);
    writeProgress(next);
    notifyProgress();
    return () => window.removeEventListener('algo-atlas-progress', sync);
  }, [topicId]);

  function update(next: StudyProgress) {
    setProgress(next);
    writeProgress(next);
    notifyProgress();
  }

  const understood = progress.understood.includes(topicId);
  const bookmarked = progress.bookmarks.includes(topicId);
  const needsReview = progress.review.includes(topicId);

  return (
    <header className="topic-hero">
      <div className="topic-breadcrumb"><Link href="/">Algo Atlas</Link><span>/</span><span>{topic.category}</span></div>
      <div className="topic-hero-grid">
        <div>
          <p className="eyebrow">{topic.category} · visual field guide</p>
          <h1>{topic.title}</h1>
          <p className="topic-lede">{topic.description}</p>
        </div>
        <div className="topic-hero-tools">
          <ProgressTracker total={total} />
          <StudyToolbar />
          <div className="topic-actions">
            <button type="button" className={`study-action${bookmarked ? ' is-active' : ''}`} onClick={() => update({ ...progress, bookmarks: toggleTopic(progress.bookmarks, topicId) })} aria-pressed={bookmarked}>{bookmarked ? '★ Bookmarked' : '☆ Bookmark'}</button>
            <button type="button" className={`study-action${needsReview ? ' is-warning' : ''}`} onClick={() => update({ ...progress, review: toggleTopic(progress.review, topicId) })} aria-pressed={needsReview}>{needsReview ? '↺ In review' : '↺ Mark for review'}</button>
            <button type="button" className={`study-action${understood ? ' is-success' : ''}`} onClick={() => update({ ...progress, understood: toggleTopic(progress.understood, topicId) })} aria-pressed={understood}>{understood ? '✓ Understood' : '○ Mark understood'}</button>
          </div>
        </div>
      </div>
    </header>
  );
}
