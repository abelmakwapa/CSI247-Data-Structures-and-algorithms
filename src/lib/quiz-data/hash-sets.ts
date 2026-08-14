import type { QuizQuestion } from '../topics';

export const hashSetsQuiz = [
  { kind: 'choice', id: 'membership', prompt: 'What is a hash set best at answering?', options: ['Is this item present?', 'What value belongs to this key?', 'What is the sorted median?'], answer: 0, explanation: 'Sets focus on membership and uniqueness.' },
  { kind: 'true-false', id: 'unique-values', prompt: 'Adding the same value twice leaves one logical value in a set.', answer: true, explanation: 'Set membership is unique; repeated adds do not create duplicate entries.' },
  { kind: 'short-answer', id: 'first-duplicate', prompt: 'How can a set find the first duplicate in one pass?', answer: 'Track seen values and stop when one is already present.', acceptedAnswers: ['track seen values', 'use a seen set', 'check membership before adding'], explanation: 'The set turns each repeated membership check into average O(1) work.' },
  { kind: 'output', id: 'set-size-output', prompt: 'Predict the output.', code: "const seen = new Set([3, 1, 3]);\nconsole.log(seen.size);", answer: '2', explanation: 'The duplicate 3 is stored once, leaving 3 and 1.' },
] satisfies QuizQuestion[];
