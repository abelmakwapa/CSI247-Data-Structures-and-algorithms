import type { QuizQuestion } from '../topics';

export const dequesQuiz = [
  { kind: 'choice', id: 'two-ended', prompt: 'What makes a deque different from a queue?', options: ['Both ends support insertion and removal', 'It always sorts items', 'It stores only priorities'], answer: 0, explanation: 'A deque exposes both the front and the back as actionable boundaries.' },
  { kind: 'true-false', id: 'stack-queue', prompt: 'A deque can be used to model both a stack and a queue.', answer: true, explanation: 'Restricting operations to one end gives stack behavior; using opposite ends gives queue behavior.' },
  { kind: 'short-answer', id: 'sliding-window', prompt: 'Why is a deque useful for a sliding window?', answer: 'Candidates enter and leave from opposite ends.', acceptedAnswers: ['items enter and leave both ends', 'old and new candidates use opposite ends', 'both ends'], explanation: 'A deque can discard expired items at one end while adding new candidates at the other.' },
  { kind: 'output', id: 'ends-output', prompt: 'Predict the output.', code: "const window = ['B', 'C'];\nwindow.unshift('A');\nconsole.log(window.pop());", answer: 'C', explanation: 'A enters at the front, while C is the item at the back.' },
] satisfies QuizQuestion[];
