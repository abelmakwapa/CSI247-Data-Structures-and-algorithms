import type { QuizQuestion } from '../topics';

export const heapsQuiz = [
  { kind: 'choice', id: 'root-priority', prompt: 'What is guaranteed at the top of a min-heap?', options: ['The smallest priority', 'Every value is sorted', 'The newest value'], answer: 0, explanation: 'Heap order is local: a parent priority beats its children.' },
  { kind: 'true-false', id: 'fully-sorted', prompt: 'A heap keeps every value in globally sorted order.', answer: false, explanation: 'Only the parent-child priority relationship is guaranteed.' },
  { kind: 'short-answer', id: 'push-repair', prompt: 'What happens to a new heap item after it is inserted at a leaf?', answer: 'It bubbles up until heap order is restored.', acceptedAnswers: ['bubble up', 'sift up', 'moves upward'], explanation: 'Each comparison with the parent repairs one level of the heap.' },
  { kind: 'output', id: 'peek-output', prompt: 'Predict the output for this min-heap representation.', code: "const heap = [2, 5, 7];\nconsole.log(heap[0]);", answer: '2', explanation: 'The minimum-priority item is stored at the root, index 0.' },
] satisfies QuizQuestion[];
