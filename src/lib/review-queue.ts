import type { StudyProgress, ConfidenceRating, ReviewOutcome } from './study-progress';
import { topics, type TopicId, type TopicMetadata } from './topics';

export type ReviewReason = 'Marked for review' | 'Not studied recently' | 'Incorrect quiz answer' | 'Bookmarked' | 'Low confidence';

export interface ReviewQueueItem {
  topic: TopicMetadata;
  reasons: ReviewReason[];
  priority: number;
  confidence: ConfidenceRating | null;
  nextReviewAt?: string;
}

const reasonScores: Record<ReviewReason, number> = {
  'Incorrect quiz answer': 50,
  'Marked for review': 40,
  'Low confidence': 30,
  'Not studied recently': 20,
  Bookmarked: 10,
};

export function buildReviewQueue(progress: StudyProgress, now = new Date()): ReviewQueueItem[] {
  return topics.flatMap((topic) => {
    const state = progress.reviewProgress.topics[topic.id];
    if (state?.nextReviewAt && new Date(state.nextReviewAt) > now) return [];
    const reasons = getReasons(topic, progress);
    if (!reasons.length) return [];
    return [{ topic, reasons, priority: reasons.reduce((sum, reason) => sum + reasonScores[reason], 0), confidence: state?.confidence ?? null, nextReviewAt: state?.nextReviewAt }];
  }).sort((a, b) => b.priority - a.priority || a.topic.title.localeCompare(b.topic.title));
}

function getReasons(topic: TopicMetadata, progress: StudyProgress): ReviewReason[] {
  const reasons: ReviewReason[] = [];
  if (progress.review.includes(topic.id)) reasons.push('Marked for review');
  if (!progress.recentlyStudied.includes(topic.id)) reasons.push('Not studied recently');
  if (hasIncorrectQuizAnswer(topic, progress)) reasons.push('Incorrect quiz answer');
  if (progress.bookmarks.includes(topic.id)) reasons.push('Bookmarked');
  const confidence = progress.reviewProgress.topics[topic.id]?.confidence;
  if (confidence !== undefined && confidence <= 2) reasons.push('Low confidence');
  return reasons;
}

function hasIncorrectQuizAnswer(topic: TopicMetadata, progress: StudyProgress): boolean {
  const quiz = progress.quizzes[topic.id];
  return topic.quiz.some((question) => quiz?.answered.includes(question.id) && quiz.results[question.id] === false);
}

export function scheduleReview(outcome: ReviewOutcome, confidence: ConfidenceRating, from = new Date()): string {
  const days = outcome === 'practice' ? 1 : outcome === 'skipped' ? 0 : confidence >= 5 ? 14 : confidence >= 4 ? 7 : confidence >= 3 ? 3 : 1;
  const next = new Date(from);
  if (days === 0) next.setMinutes(next.getMinutes() + 10);
  else next.setDate(next.getDate() + days);
  return next.toISOString();
}

export function makeReviewId(topicId: TopicId, reviewedAt: string): string {
  return `${topicId}-${reviewedAt}`;
}
