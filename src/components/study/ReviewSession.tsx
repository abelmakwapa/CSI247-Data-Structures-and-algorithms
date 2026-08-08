'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { buildReviewQueue, makeReviewId, scheduleReview } from '@/lib/review-queue';
import { EMPTY_PROGRESS, readProgress, writeProgress, type ConfidenceRating, type ReviewOutcome, type StudyProgress } from '@/lib/study-progress';
import { topicMap } from '@/lib/topics';
import { PROGRESS_EVENT } from './ProgressTracker';
import { ReviewCard } from './ReviewCard';

export function ReviewSession() {
  const [progress, setProgress] = useState<StudyProgress | null>(null);
  const [confidenceByTopic, setConfidenceByTopic] = useState<Partial<Record<string, ConfidenceRating>>>({});
  const [explanationTopic, setExplanationTopic] = useState<string | null>(null);
  const [reviewedCount, setReviewedCount] = useState(0);
  const [announcement, setAnnouncement] = useState('');

  useEffect(() => {
    const sync = () => setProgress(readProgress());
    sync();
    window.addEventListener(PROGRESS_EVENT, sync);
    window.addEventListener('storage', sync);
    return () => { window.removeEventListener(PROGRESS_EVENT, sync); window.removeEventListener('storage', sync); };
  }, []);

  const currentProgress = progress ?? EMPTY_PROGRESS;
  const queue = useMemo(() => buildReviewQueue(currentProgress), [currentProgress]);
  const current = queue[0];
  const confidence = current ? confidenceByTopic[current.topic.id] ?? current.confidence ?? 3 : 3;
  const explanationVisible = current?.topic.id === explanationTopic;

  const answer = useCallback((outcome: ReviewOutcome) => {
    if (!current || !progress) return;
    const reviewedAt = new Date().toISOString();
    const nextReviewAt = scheduleReview(outcome, confidence, new Date(reviewedAt));
    const entry = { id: makeReviewId(current.topic.id, reviewedAt), topicId: current.topic.id, outcome, confidence, reviewedAt, nextReviewAt };
    const next: StudyProgress = {
      ...progress,
      review: outcome === 'knew' ? progress.review.filter((id) => id !== current.topic.id) : progress.review,
      reviewProgress: {
        topics: { ...progress.reviewProgress.topics, [current.topic.id]: { confidence, lastReviewedAt: reviewedAt, nextReviewAt } },
        history: [entry, ...progress.reviewProgress.history].slice(0, 100),
      },
    };
    writeProgress(next);
    setProgress(next);
    setReviewedCount((count) => count + 1);
    const label = outcome === 'knew' ? 'Known' : outcome === 'practice' ? 'Marked for more practice' : 'Skipped';
    setAnnouncement(`${label}: ${current.topic.title}. Next topic loaded.`);
    window.dispatchEvent(new Event(PROGRESS_EVENT));
  }, [confidence, current, progress]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      if (target?.matches('input, textarea, select') || event.metaKey || event.ctrlKey || event.altKey) return;
      if (/^[1-5]$/.test(event.key) && current) setConfidenceByTopic((ratings) => ({ ...ratings, [current.topic.id]: Number(event.key) as ConfidenceRating }));
      else if (event.key.toLowerCase() === 'e' && current) setExplanationTopic((id) => id === current.topic.id ? null : current.topic.id);
      else if (event.key.toLowerCase() === 'k') answer('knew');
      else if (event.key.toLowerCase() === 'p') answer('practice');
      else if (event.key.toLowerCase() === 's') answer('skipped');
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [answer, current]);

  return (
    <section id="review-session" className="review-session" aria-labelledby="review-session-title">
      <div className="review-session-head"><div><p className="eyebrow">Structured review queue</p><h1 id="review-session-title">Review what needs retrieval.</h1><p>The queue prioritizes mistakes, review flags, low confidence, study recency, and bookmarks.</p></div><div className="review-queue-count" aria-label={`${queue.length} topics ready for review`}><strong>{queue.length}</strong><span>ready now</span></div></div>
      <p className="sr-only" aria-live="polite" aria-atomic="true">{announcement}</p>
      {current ? <div className="review-session-grid"><ReviewCard item={current} confidence={confidence} explanationVisible={explanationVisible} onConfidenceChange={(rating) => setConfidenceByTopic((ratings) => ({ ...ratings, [current.topic.id]: rating }))} onExplanationToggle={() => setExplanationTopic((id) => id === current.topic.id ? null : current.topic.id)} onAnswer={answer} /><QueuePreview queue={queue.slice(1, 5)} /></div> : <CompletionSummary reviewedCount={reviewedCount} history={currentProgress.reviewProgress.history} />}
      <ReviewHistory progress={currentProgress} />
    </section>
  );
}

function QueuePreview({ queue }: { queue: ReturnType<typeof buildReviewQueue> }) {
  return <aside className="review-queue-preview" aria-labelledby="up-next-title"><h2 id="up-next-title">Up next</h2>{queue.length ? <ol>{queue.map((item) => <li key={item.topic.id}><span>{item.topic.title}</span><small>{item.reasons[0]}</small></li>)}</ol> : <p>This is the final card in the current queue.</p>}<p className="keyboard-hint">Keyboard: <kbd>1–5</kbd> confidence · <kbd>K</kbd> knew · <kbd>P</kbd> practice · <kbd>E</kbd> explanation · <kbd>S</kbd> skip</p></aside>;
}

function CompletionSummary({ reviewedCount, history }: { reviewedCount: number; history: StudyProgress['reviewProgress']['history'] }) {
  const latest = history.slice(0, reviewedCount);
  const known = latest.filter((entry) => entry.outcome === 'knew').length;
  const practice = latest.filter((entry) => entry.outcome === 'practice').length;
  return <div className="review-complete" role="status"><span aria-hidden="true">✓</span><p className="eyebrow">Session complete</p><h2>Your review queue is clear.</h2><p>{reviewedCount ? `${reviewedCount} topics reviewed · ${known} known · ${practice} need more practice.` : 'Nothing is due right now. Your next scheduled topics will appear here automatically.'}</p></div>;
}

function ReviewHistory({ progress }: { progress: StudyProgress }) {
  const history = progress.reviewProgress.history.slice(0, 8);
  return <section className="review-history" aria-labelledby="review-history-title"><div className="review-history-heading"><div><p className="eyebrow">Local record</p><h2 id="review-history-title">Review history</h2></div><span>{progress.reviewProgress.history.length} entries</span></div>{history.length ? <ul>{history.map((entry) => <li key={entry.id}><div><strong>{topicMap.get(entry.topicId)?.title ?? entry.topicId}</strong><span>{entry.outcome === 'knew' ? 'I knew this' : entry.outcome === 'practice' ? 'Needs more practice' : 'Skipped'} · Confidence {entry.confidence}/5</span></div><time dateTime={entry.reviewedAt}>{new Date(entry.reviewedAt).toLocaleDateString()}</time><small>Next: {new Date(entry.nextReviewAt).toLocaleDateString()}</small></li>)}</ul> : <div className="review-history-empty"><strong>No review history yet.</strong><p>Complete a card and its confidence and next-review date will appear here.</p></div>}</section>;
}
