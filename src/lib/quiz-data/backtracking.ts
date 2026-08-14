import type { QuizQuestion } from '../topics';

export const backtrackingQuiz = [
  { kind: 'choice', id: 'undo-state', prompt: 'Why is the undo step essential in backtracking?', options: ['It prevents one branch’s state leaking into the next', 'It sorts the candidates', 'It makes every branch constant time'], answer: 0, explanation: 'Backtracking reuses mutable state while exploring sibling branches.' },
  { kind: 'true-false', id: 'safe-pruning', prompt: 'Pruning is correct only when a constraint proves the branch cannot succeed.', answer: true, explanation: 'An unsupported guess can silently remove valid solutions.' },
  { kind: 'short-answer', id: 'three-actions', prompt: 'Name the three recurring actions in backtracking.', answer: 'Choose, explore, undo.', acceptedAnswers: ['choose explore undo', 'choose, explore, undo', 'choose explore unchoose'], explanation: 'The algorithm mutates a partial solution, explores, then restores it.' },
  { kind: 'output', id: 'undo-output', prompt: 'Predict the path length after undo.', code: "const path = [];\npath.push('A');\npath.pop();\nconsole.log(path.length);", answer: '0', explanation: 'The undo removes A and restores the empty path.' },
] satisfies QuizQuestion[];
