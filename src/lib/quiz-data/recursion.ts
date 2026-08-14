import type { QuizQuestion } from '../topics';

export const recursionQuiz = [
  { kind: 'choice', id: 'base-progress', prompt: 'What two parts must a recursive function have?', options: ['A base case and progress toward it', 'A queue and a hash', 'A sorted input and a pivot'], answer: 0, explanation: 'Without a stopping case or progress, recursion can be infinite.' },
  { kind: 'true-false', id: 'call-stack', prompt: 'The call stack stores waiting recursive frames until deeper calls return.', answer: true, explanation: 'Each frame remembers local state and where execution resumes.' },
  { kind: 'short-answer', id: 'base-case', prompt: 'What is the purpose of a recursive base case?', answer: 'Return a known result and stop descending.', acceptedAnswers: ['stop recursion', 'return a known result', 'stop the recursive calls'], explanation: 'The base case prevents an infinite descent.' },
  { kind: 'output', id: 'factorial-output', prompt: 'Predict the output.', code: "function fact(n) { return n <= 1 ? 1 : n * fact(n - 1); }\nconsole.log(fact(3));", answer: '6', explanation: 'The calls multiply 3 × 2 × 1.' },
] satisfies QuizQuestion[];
