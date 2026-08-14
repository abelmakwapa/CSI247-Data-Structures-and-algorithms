import type { QuizQuestion } from '../topics';

export const linkedListsQuiz = [
  { kind: 'choice', id: 'splice-reference', prompt: 'What makes a linked-list insertion constant time once the position is known?', options: ['Having a reference to the insertion node', 'Random indexing', 'Sorting the list first'], answer: 0, explanation: 'The pointer updates are constant-time; finding the node may still cost O(n).' },
  { kind: 'true-false', id: 'contiguous-nodes', prompt: 'Linked-list nodes must live next to one another in memory.', answer: false, explanation: 'Nodes can be scattered; next pointers preserve the logical order.' },
  { kind: 'short-answer', id: 'index-cost', prompt: 'Why does indexing a linked list usually take linear time?', answer: 'You must follow pointers from a known end.', acceptedAnswers: ['follow pointers', 'walk the list', 'traverse from the head'], explanation: 'There is no direct address formula for a node at an arbitrary index.' },
  { kind: 'output', id: 'pointer-order', prompt: 'Predict the output after linking the middle node.', code: "const values = ['A', 'C'];\nvalues.splice(1, 0, 'B');\nconsole.log(values.join('→'));", answer: 'A→B→C', acceptedAnswers: ['a -> b -> c', 'a→b→c', 'a b c'], explanation: 'The logical chain now visits A, then B, then C.' },
] satisfies QuizQuestion[];
