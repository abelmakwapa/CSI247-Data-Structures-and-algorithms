import type { QuizQuestion } from '../topics';

export const arraysQuiz = [
  { kind: 'choice', id: 'access-address', prompt: 'Why is array access by index usually constant time?', options: ['The address is calculated directly', 'The array scans every value', 'The array sorts itself'], answer: 0, explanation: 'Contiguous slots let the runtime calculate base + index × slot size.' },
  { kind: 'true-false', id: 'middle-shift', prompt: 'Inserting into the middle of an array may move every later element.', answer: true, explanation: 'The tail shifts to make room, so the work grows with the number of later elements.' },
  { kind: 'short-answer', id: 'index-cost', prompt: 'What is the usual time complexity of reading an array element by index?', answer: 'O(1)', acceptedAnswers: ['o(1)', 'constant time', 'constant'], explanation: 'The index determines the element address directly.' },
  { kind: 'output', id: 'splice-output', prompt: 'Predict the output after the insertion.', code: "const values = [10, 20, 30];\nvalues.splice(1, 0, 15);\nconsole.log(values[2]);", answer: '20', explanation: 'The array becomes [10, 15, 20, 30], so index 2 now contains 20.' },
] satisfies QuizQuestion[];
