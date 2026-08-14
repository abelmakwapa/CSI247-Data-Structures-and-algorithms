import type { QuizQuestion } from '../topics';

export const sortingQuiz = [
  { kind: 'choice', id: 'sort-before-search', prompt: 'Why can sorting make later search easier?', options: ['Order lets algorithms discard or compare fewer candidates', 'Sorting removes the input', 'Sorting makes every operation O(1)'], answer: 0, explanation: 'Order exposes structure that binary search and neighboring comparisons can use.' },
  { kind: 'true-false', id: 'ordered-prefix', prompt: 'An ordered prefix can help place the next value during insertion-style sorting.', answer: true, explanation: 'The next value only needs to find its position among the already ordered values.' },
  { kind: 'short-answer', id: 'comparison-bound', prompt: 'What is the comparison-sorting lower bound in the general case?', answer: 'Ω(n log n)', acceptedAnswers: ['omega(n log n)', 'n log n', 'omega n log n'], explanation: 'Comparison sorting has an Ω(n log n) lower bound for arbitrary inputs.' },
  { kind: 'output', id: 'sort-output', prompt: 'Predict the output.', code: "const values = [7, 3, 6];\nvalues.sort((a, b) => a - b);\nconsole.log(values.join(','));", answer: '3,6,7', explanation: 'The numeric comparator places the values in ascending order.' },
] satisfies QuizQuestion[];
