import type { TopicId } from './topics';

export interface QuizProgress {
  answered: number[];
  revealed: number[];
  selected: Record<number, number>;
  recallRatings: Record<number, 'got-it' | 'review'>;
}

export interface StudyProgress {
  understood: TopicId[];
  bookmarks: TopicId[];
  review: TopicId[];
  notes: Partial<Record<TopicId, string>>;
  quizzes: Partial<Record<TopicId, QuizProgress>>;
}

export const EMPTY_PROGRESS: StudyProgress = {
  understood: [],
  bookmarks: [],
  review: [],
  notes: {},
  quizzes: {},
};

const STORAGE_KEY = 'algo-atlas-study-progress-v2';

function isTopicId(value: unknown): value is TopicId {
  return typeof value === 'string' && value.length > 0;
}

export function readProgress(): StudyProgress {
  if (typeof window === 'undefined') return EMPTY_PROGRESS;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return EMPTY_PROGRESS;
    const parsed = JSON.parse(raw) as Partial<StudyProgress>;
    return {
      understood: Array.isArray(parsed.understood) ? parsed.understood.filter(isTopicId) : [],
      bookmarks: Array.isArray(parsed.bookmarks) ? parsed.bookmarks.filter(isTopicId) : [],
      review: Array.isArray(parsed.review) ? parsed.review.filter(isTopicId) : [],
      notes: parsed.notes ?? {},
      quizzes: parsed.quizzes ?? {},
    };
  } catch {
    return EMPTY_PROGRESS;
  }
}

export function writeProgress(progress: StudyProgress): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  } catch {
    // Private browsing or a disabled storage area should not break study tools.
  }
}

export function toggleTopic(values: TopicId[], id: TopicId): TopicId[] {
  return values.includes(id) ? values.filter((value) => value !== id) : [...values, id];
}
