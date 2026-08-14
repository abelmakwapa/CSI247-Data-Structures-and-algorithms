import type { QuizQuestion } from '../topics';

export const triesQuiz = [
  { kind: 'choice', id: 'character-edges', prompt: 'What does a trie edge usually represent?', options: ['One character of a key or prefix', 'A hash bucket', 'A sorted array block'], answer: 0, explanation: 'Trie traversal follows one edge for each character.' },
  { kind: 'true-false', id: 'prefix-matches', prompt: 'A prefix query can return multiple complete words.', answer: true, explanation: 'After reaching the prefix node, traversal can enumerate its terminal descendants.' },
  { kind: 'short-answer', id: 'key-length', prompt: 'What does k represent in trie complexity?', answer: 'The key or prefix length.', acceptedAnswers: ['key length', 'prefix length', 'number of characters'], explanation: 'Trie work follows one edge per character in the key or prefix.' },
  { kind: 'output', id: 'prefix-output', prompt: 'Predict the output.', code: "const words = ['app', 'bat'];\nconsole.log(words.filter(word => word.startsWith('ap')).join(','));", answer: 'app', explanation: 'Only app begins with the prefix ap.' },
] satisfies QuizQuestion[];
