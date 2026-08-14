import type { QuizQuestion } from '../topics';

export const disjointSetUnionQuiz = [
  { kind: 'choice', id: 'find-leader', prompt: 'What does find(x) return in a disjoint set union?', options: ['The set representative', 'The shortest path', 'The tree height'], answer: 0, explanation: 'DSU identifies the component leader.' },
  { kind: 'true-false', id: 'union-merge', prompt: 'Union can merge two previously separate components.', answer: true, explanation: 'Union links their representatives so both items share one component.' },
  { kind: 'short-answer', id: 'path-compression', prompt: 'What does path compression improve?', answer: 'It flattens used parent paths for faster future finds.', acceptedAnswers: ['flattens parent paths', 'makes future finds faster', 'shortens paths'], explanation: 'Together with union by rank or size, operations are nearly constant amortized.' },
  { kind: 'output', id: 'same-component-output', prompt: 'Predict the output after parent[1] points to 0.', code: "const parent = [0, 0, 2];\nconsole.log(parent[1] === parent[0]);", answer: 'true', acceptedAnswers: ['true'], explanation: 'Both entries point to representative 0, so they are in the same component.' },
] satisfies QuizQuestion[];
