import type { QuizQuestion } from '../topics';

export const stacksQuiz = [
  { kind: 'choice', id: 'lifo', prompt: 'What does LIFO mean?', options: ['Last in, first out', 'Least input, first output', 'Links in, files out'], answer: 0, explanation: 'The most recently pushed item is the next item popped.' },
  { kind: 'true-false', id: 'pop-top', prompt: 'A stack removes its newest item first.', answer: true, explanation: 'Pop operates at the same top boundary where push adds items.' },
  { kind: 'short-answer', id: 'peek-value', prompt: 'What does peek inspect without removing?', answer: 'The top item', acceptedAnswers: ['top', 'top item', 'the top'], explanation: 'Peek reads the next item that pop would remove.' },
  { kind: 'output', id: 'pop-output', prompt: 'Predict the output.', code: "const stack = ['A', 'B'];\nconsole.log(stack.pop());", answer: 'B', explanation: 'B was pushed last, so LIFO makes it the first item popped.' },
] satisfies QuizQuestion[];
