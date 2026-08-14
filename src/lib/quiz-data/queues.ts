import type { QuizQuestion } from '../topics';

export const queuesQuiz = [
  { kind: 'choice', id: 'fifo', prompt: 'Which item leaves a queue first?', options: ['The oldest item', 'The newest item', 'The highest-priority item'], answer: 0, explanation: 'FIFO means first in, first out.' },
  { kind: 'true-false', id: 'rear-enqueue', prompt: 'A normal queue adds new items at the rear.', answer: true, explanation: 'The rear accepts arrivals while the front serves the oldest item.' },
  { kind: 'short-answer', id: 'shift-trap', prompt: 'Why can array.shift() be an expensive queue operation?', answer: 'It may shift every remaining element.', acceptedAnswers: ['it shifts the remaining elements', 'shifts all later elements', 'o(n) shifting'], explanation: 'A head index, circular buffer, or deque avoids repeatedly moving the tail.' },
  { kind: 'output', id: 'dequeue-output', prompt: 'Predict the output.', code: "const queue = ['A', 'B'];\nqueue.push('C');\nconsole.log(queue.shift());", answer: 'A', explanation: 'A is the oldest item, so it leaves before B and C.' },
] satisfies QuizQuestion[];
