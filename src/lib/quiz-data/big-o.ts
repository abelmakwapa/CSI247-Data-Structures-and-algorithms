import type { QuizQuestion } from '../topics';

export const bigOQuiz = [
  { kind: 'choice', id: 'dominant-term', prompt: 'What usually happens to sequential Big O costs?', options: ['Add them and keep the dominant term', 'Multiply every block', 'Ignore the input size'], answer: 0, explanation: 'Sequential blocks add; the fastest-growing term dominates.' },
  { kind: 'true-false', id: 'nested-loops', prompt: 'Two independent loops that each run n times can produce O(n²) work when nested.', answer: true, explanation: 'Each outer iteration triggers a full inner pass.' },
  { kind: 'short-answer', id: 'state-assumptions', prompt: 'What should you name when stating Big O?', answer: 'The input variable, resource, and case or assumptions.', acceptedAnswers: ['input variable resource and assumptions', 'input, resource, and assumptions', 'time space and input'], explanation: 'A precise bound states what grows, which resource is measured, and under what conditions.' },
  { kind: 'output', id: 'nested-output', prompt: 'Predict the number of inner-loop prints.', code: "let count = 0;\nfor (let i = 0; i < 3; i++) for (let j = 0; j < 3; j++) count++;\nconsole.log(count);", answer: '9', explanation: 'Three outer iterations each perform three inner iterations: 3 × 3 = 9.' },
] satisfies QuizQuestion[];
