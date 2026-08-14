import { getTopic, type TopicId } from './topics';

export type QuizAnswer = string | number | boolean;

export interface QuizProgress {
  order: string[];
  answered: string[];
  revealed: string[];
  answers: Record<string, QuizAnswer>;
  results: Record<string, boolean>;
  drafts: Record<string, string>;
}

export const EMPTY_QUIZ_PROGRESS: QuizProgress = { order: [], answered: [], revealed: [], answers: {}, results: {}, drafts: {} };

export type ConfidenceRating = 1 | 2 | 3 | 4 | 5;
export type ReviewOutcome = 'knew' | 'practice' | 'skipped';

export interface ReviewHistoryEntry {
  id: string;
  topicId: TopicId;
  outcome: ReviewOutcome;
  confidence: ConfidenceRating;
  reviewedAt: string;
  nextReviewAt: string;
}

export interface TopicReviewState {
  confidence?: ConfidenceRating;
  lastReviewedAt?: string;
  nextReviewAt?: string;
}

export interface ReviewProgress {
  topics: Partial<Record<TopicId, TopicReviewState>>;
  history: ReviewHistoryEntry[];
}

export interface StudyProgress {
  understood: TopicId[];
  bookmarks: TopicId[];
  review: TopicId[];
  recentlyStudied: TopicId[];
  notes: Partial<Record<TopicId, string>>;
  quizzes: Partial<Record<TopicId, QuizProgress>>;
  reviewProgress: ReviewProgress;
}

export const EMPTY_PROGRESS: StudyProgress = {
  understood: [],
  bookmarks: [],
  review: [],
  recentlyStudied: [],
  notes: {},
  quizzes: {},
  reviewProgress: { topics: {}, history: [] },
};

const STORAGE_KEY = 'algo-atlas-study-progress-v2';
const RECENT_TOPIC_LIMIT = 5;

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
      recentlyStudied: Array.isArray(parsed.recentlyStudied) ? parsed.recentlyStudied.filter(isTopicId).slice(0, RECENT_TOPIC_LIMIT) : [],
      notes: parsed.notes ?? {},
      quizzes: normalizeQuizzes(parsed.quizzes),
      reviewProgress: normalizeReviewProgress(parsed.reviewProgress),
    };
  } catch {
    return EMPTY_PROGRESS;
  }
}

function normalizeQuizzes(value: unknown): Partial<Record<TopicId, QuizProgress>> {
  if (!value || typeof value !== 'object') return {};
  return Object.fromEntries(Object.entries(value).map(([topicId, quiz]) => [topicId, normalizeQuizProgress(topicId, quiz)])) as Partial<Record<TopicId, QuizProgress>>;
}

function normalizeQuizProgress(topicId: string, value: unknown): QuizProgress {
  let topic;
  try {
    topic = getTopic(topicId as TopicId);
  } catch {
    return { ...EMPTY_QUIZ_PROGRESS };
  }
  if (!value || typeof value !== 'object') return { ...EMPTY_QUIZ_PROGRESS };
  const raw = value as Partial<QuizProgress> & { selected?: Record<string, number>; recallRatings?: Record<string, 'got-it' | 'review'> };
  const questionId = (entry: unknown): string | null => {
    if (typeof entry === 'number') return topic.quiz[entry]?.id ?? null;
    if (typeof entry === 'string' && topic.quiz.some((question) => question.id === entry)) return entry;
    return null;
  };
  const answers: Record<string, QuizAnswer> = isRecord(raw.answers) ? { ...raw.answers } as Record<string, QuizAnswer> : {};
  const results: Record<string, boolean> = isRecord(raw.results) ? { ...raw.results } as Record<string, boolean> : {};
  const drafts: Record<string, string> = isRecord(raw.drafts) ? Object.fromEntries(Object.entries(raw.drafts).filter((entry): entry is [string, string] => typeof entry[1] === 'string')) : {};
  const answered = Array.isArray(raw.answered) ? raw.answered.map(questionId).filter((id): id is string => Boolean(id)) : [];
  const revealed = Array.isArray(raw.revealed) ? raw.revealed.map(questionId).filter((id): id is string => Boolean(id)) : [];

  if (isRecord(raw.selected)) {
    Object.entries(raw.selected).forEach(([index, answer]) => {
      const question = topic.quiz[Number(index)];
      if (question?.kind === 'choice' && typeof answer === 'number') {
        answers[question.id] = answer;
        results[question.id] = answer === question.answer;
      }
    });
  }
  if (isRecord(raw.recallRatings)) {
    Object.entries(raw.recallRatings).forEach(([index, rating]) => {
      const question = topic.quiz[Number(index)];
      if (question && (rating === 'got-it' || rating === 'review')) {
        results[question.id] = rating === 'got-it';
        if (!answered.includes(question.id)) answered.push(question.id);
      }
    });
  }
  Object.keys(answers).forEach((id) => {
    if (typeof results[id] === 'boolean' && !answered.includes(id)) answered.push(id);
  });
  const order = Array.isArray(raw.order) ? raw.order.filter((id): id is string => typeof id === 'string' && topic.quiz.some((question) => question.id === id)) : [];
  return { order: [...new Set(order)], answered: [...new Set(answered)], revealed: [...new Set(revealed)], answers, results, drafts };
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value);
}

function normalizeReviewProgress(value: unknown): ReviewProgress {
  if (!value || typeof value !== 'object') return { topics: {}, history: [] };
  const candidate = value as Partial<ReviewProgress>;
  return {
    topics: candidate.topics && typeof candidate.topics === 'object' ? candidate.topics : {},
    history: Array.isArray(candidate.history) ? candidate.history.filter(isReviewHistoryEntry).slice(0, 100) : [],
  };
}

function isReviewHistoryEntry(value: unknown): value is ReviewHistoryEntry {
  if (!value || typeof value !== 'object') return false;
  const entry = value as Partial<ReviewHistoryEntry>;
  return isTopicId(entry.topicId) && ['knew', 'practice', 'skipped'].includes(entry.outcome ?? '')
    && [1, 2, 3, 4, 5].includes(entry.confidence ?? 0)
    && typeof entry.id === 'string' && typeof entry.reviewedAt === 'string' && typeof entry.nextReviewAt === 'string';
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

export function touchTopic(progress: StudyProgress, id: TopicId): StudyProgress {
  return {
    ...progress,
    recentlyStudied: [id, ...progress.recentlyStudied.filter((value) => value !== id)].slice(0, RECENT_TOPIC_LIMIT),
  };
}

export interface StudyMetrics {
  completionPercentage: number;
  reviewPercentage: number;
  understoodCount: number;
  reviewCount: number;
  bookmarkCount: number;
  notedCount: number;
}

export function getStudyMetrics(progress: StudyProgress, total: number): StudyMetrics {
  const percentage = (count: number) => (total ? Math.round((count / total) * 100) : 0);

  return {
    completionPercentage: percentage(progress.understood.length),
    reviewPercentage: percentage(progress.review.length),
    understoodCount: progress.understood.length,
    reviewCount: progress.review.length,
    bookmarkCount: progress.bookmarks.length,
    notedCount: Object.values(progress.notes).filter((note) => Boolean(note?.trim())).length,
  };
}
