import type { QuizQuestion } from '../topics';

export const bloomFiltersQuiz = [
  { kind: 'choice', id: 'no-false-negative', prompt: 'Which error can a standard Bloom filter never make?', options: ['False negative', 'False positive', 'Hash collision'], answer: 0, explanation: 'Inserted items set every required bit; a “no” is always certain.' },
  { kind: 'true-false', id: 'maybe-positive', prompt: 'A Bloom-filter result of “maybe present” proves the item exists.', answer: false, explanation: 'Other items may have set the same bits, creating a false positive.' },
  { kind: 'short-answer', id: 'zero-bit', prompt: 'What does one zero queried bit prove?', answer: 'The item was definitely not added.', acceptedAnswers: ['definitely absent', 'not added', 'the item is absent'], explanation: 'An inserted item would have set every one of its hash-derived bits.' },
  { kind: 'output', id: 'bits-output', prompt: 'Predict the output.', code: "const bits = new Set([1, 4, 8]);\nconsole.log([1, 4].every(position => bits.has(position)));", answer: 'true', acceptedAnswers: ['true'], explanation: 'Both queried positions are set, so the filter says maybe present.' },
] satisfies QuizQuestion[];
