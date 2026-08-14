import type { QuizQuestion } from '../topics';

export const lruCacheQuiz = [
  { kind: 'choice', id: 'two-structures', prompt: 'Why does an LRU cache need two structures?', options: ['A map for lookup and a list for order', 'A queue for sorting and a tree for hashing', 'Only to increase memory'], answer: 0, explanation: 'The map answers where; the linked list answers which item is oldest.' },
  { kind: 'true-false', id: 'tail-eviction', prompt: 'The tail of the recency list represents the least recently used item.', answer: true, explanation: 'The tail is the item that has gone untouched for the longest.' },
  { kind: 'short-answer', id: 'get-touch', prompt: 'What ordering change should a cache get usually make?', answer: 'Move the accessed node to the front.', acceptedAnswers: ['move it to the front', 'promote it to mru', 'mark it most recently used'], explanation: 'A successful get makes the item recently used.' },
  { kind: 'output', id: 'recency-output', prompt: 'Predict the key order after refreshing A.', code: "const cache = new Map([['A', 1], ['B', 2]]);\ncache.delete('A');\ncache.set('A', 1);\nconsole.log([...cache.keys()].join(','));", answer: 'B,A', acceptedAnswers: ['b,a'], explanation: 'Deleting and re-adding A moves it behind B in insertion order.' },
] satisfies QuizQuestion[];
