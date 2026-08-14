import type { QuizQuestion } from '../topics';

export const dynamicProgrammingQuiz = [
  { kind: 'choice', id: 'dp-signal', prompt: 'What signals a dynamic-programming candidate?', options: ['Overlapping subproblems and optimal substructure', 'Only sorted input', 'A single loop with no state'], answer: 0, explanation: 'DP stores answers when a recursive search would repeat the same state.' },
  { kind: 'true-false', id: 'reuse-state', prompt: 'Dynamic programming avoids recomputing a repeated state by storing its answer.', answer: true, explanation: 'Memoization or tabulation turns repeated work into a table lookup.' },
  { kind: 'short-answer', id: 'state-meaning', prompt: 'What should you define before writing a DP transition?', answer: 'The meaning of one state or table cell.', acceptedAnswers: ['the meaning of a state', 'what each cell means', 'state definition'], explanation: 'A clear state makes transitions and base cases checkable.' },
  { kind: 'output', id: 'fib-output', prompt: 'Predict the output.', code: "const dp = [0, 1, 1, 2, 3, 5];\nconsole.log(dp[5]);", answer: '5', explanation: 'The table stores Fibonacci values, so dp[5] is 5.' },
] satisfies QuizQuestion[];
