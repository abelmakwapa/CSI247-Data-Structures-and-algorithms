import type { QuizQuestion } from '../topics';

export const binarySearchQuiz = [
  { kind: 'choice', id: 'ordered-space', prompt: 'What must be true for ordinary binary search?', options: ['The search space is ordered or monotonic', 'Every value is unique', 'The input is a linked list'], answer: 0, explanation: 'The discard decision depends on order or a monotonic predicate.' },
  { kind: 'true-false', id: 'halve-space', prompt: 'A correct binary search discards a constant fraction of candidates after each comparison.', answer: true, explanation: 'The remaining interval is halved, producing logarithmic iterations.' },
  { kind: 'short-answer', id: 'loop-invariant', prompt: 'What is the core binary-search loop invariant?', answer: 'If the target exists, it remains inside the current interval.', acceptedAnswers: ['target remains in the interval', 'target stays within the boundaries', 'target is in the search range'], explanation: 'Every boundary update must preserve that claim.' },
  { kind: 'output', id: 'search-output', prompt: 'Predict the returned index.', code: "const values = [4, 9, 15, 22, 31];\nconsole.log(values.indexOf(22));", answer: '3', explanation: 'The target 22 is at zero-based index 3.' },
] satisfies QuizQuestion[];
