import type { QuizQuestion } from '../topics';

export const treesQuiz = [
  { kind: 'choice', id: 'hierarchy', prompt: 'What distinguishes a tree from a general graph?', options: ['A parent-child hierarchy without cycles', 'It must be sorted', 'It has no edges'], answer: 0, explanation: 'A rooted tree is connected and acyclic with a parent-child hierarchy.' },
  { kind: 'true-false', id: 'acyclic', prompt: 'A tree may contain a cycle and still be a tree.', answer: false, explanation: 'A cycle violates the tree invariant.' },
  { kind: 'short-answer', id: 'full-traversal', prompt: 'What is the time complexity of visiting every node in a tree?', answer: 'O(n)', acceptedAnswers: ['o(n)', 'linear time', 'linear'], explanation: 'A complete traversal touches each of the n nodes once.' },
  { kind: 'output', id: 'child-output', prompt: 'Predict the output.', code: "const folder = { children: [{ name: 'notes' }] };\nconsole.log(folder.children[0].name);", answer: 'notes', explanation: 'The child at index 0 has the name notes.' },
] satisfies QuizQuestion[];
