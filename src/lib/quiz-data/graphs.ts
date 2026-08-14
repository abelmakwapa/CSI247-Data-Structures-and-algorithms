import type { QuizQuestion } from '../topics';

export const graphsQuiz = [
  { kind: 'choice', id: 'traversal-cost', prompt: 'What usually determines adjacency-list traversal cost?', options: ['Vertices plus edges', 'Only the root', 'The number of array indices'], answer: 0, explanation: 'A traversal visits vertices and inspects their edges.' },
  { kind: 'true-false', id: 'cycles-normal', prompt: 'Cycles are normal in general graphs.', answer: true, explanation: 'Unlike trees, graphs may connect back to an earlier vertex.' },
  { kind: 'short-answer', id: 'visited-state', prompt: 'Why must graph traversal track visited nodes?', answer: 'To prevent cycles and duplicate work.', acceptedAnswers: ['prevent cycles', 'avoid infinite loops', 'prevent duplicate visits'], explanation: 'Visited state stops traversal from revisiting the same vertex forever.' },
  { kind: 'output', id: 'adjacency-output', prompt: 'Predict the output.', code: "const graph = new Map([['A', ['B', 'C']]]);\nconsole.log(graph.get('A').length);", answer: '2', explanation: 'A has two adjacent vertices: B and C.' },
] satisfies QuizQuestion[];
