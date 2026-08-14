import type { QuizQuestion } from '../topics';

export const binarySearchTreesQuiz = [
  { kind: 'choice', id: 'inorder-sorted', prompt: 'What does in-order traversal of a BST produce?', options: ['Sorted order', 'Insertion order', 'Random order'], answer: 0, explanation: 'Visit left, node, right to emit increasing keys.' },
  { kind: 'true-false', id: 'always-balanced', prompt: 'Every binary search tree guarantees O(log n) search.', answer: false, explanation: 'Sorted insertion can create a one-sided chain with O(n) height.' },
  { kind: 'short-answer', id: 'discard-subtree', prompt: 'What does a balanced BST comparison let search discard?', answer: 'One entire subtree.', acceptedAnswers: ['a subtree', 'half the tree', 'one side'], explanation: 'The ordering rule tells search which side cannot contain the target.' },
  { kind: 'output', id: 'inorder-output', prompt: 'Predict the in-order output.', code: "const values = [2, 1, 3];\nvalues.sort((a, b) => a - b);\nconsole.log(values.join(','));", answer: '1,2,3', explanation: 'The sorted order is the same sequence an in-order BST walk would emit.' },
] satisfies QuizQuestion[];
