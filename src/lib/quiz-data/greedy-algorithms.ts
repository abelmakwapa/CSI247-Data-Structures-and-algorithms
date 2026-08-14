import type { QuizQuestion } from '../topics';

export const greedyAlgorithmsQuiz = [
  { kind: 'choice', id: 'greedy-proof', prompt: 'What extra responsibility does a greedy solution have?', options: ['Prove the local choice is safe', 'Avoid all sorting', 'Use recursion'], answer: 0, explanation: 'A plausible local choice is not enough without a correctness argument.' },
  { kind: 'true-false', id: 'local-always-global', prompt: 'The locally best-looking choice is always globally optimal.', answer: false, explanation: 'Greedy correctness depends on a problem-specific exchange, cut, or other proof.' },
  { kind: 'short-answer', id: 'exchange-argument', prompt: 'Name one proof idea used for greedy algorithms.', answer: 'An exchange argument.', acceptedAnswers: ['exchange argument', 'cut property', 'exchange proof'], explanation: 'These arguments show how an optimal solution can adopt the greedy choice.' },
  { kind: 'output', id: 'activity-output', prompt: 'Predict the first activity after sorting by finish time.', code: "const activities = [{ end: 5 }, { end: 3 }, { end: 4 }];\nactivities.sort((a, b) => a.end - b.end);\nconsole.log(activities[0].end);", answer: '3', explanation: 'The earliest finishing activity is the first greedy candidate.' },
] satisfies QuizQuestion[];
