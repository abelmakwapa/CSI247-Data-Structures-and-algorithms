import type { QuizQuestion } from '../topics';

export const hashMapsQuiz = [
  { kind: 'choice', id: 'bucket-lookup', prompt: 'Why is hash-map lookup average O(1)?', options: ['The key selects a near-direct bucket', 'The map scans sorted values', 'The map uses recursion'], answer: 0, explanation: 'Hashing avoids scanning unrelated keys on average.' },
  { kind: 'true-false', id: 'collision-cost', prompt: 'Many keys in one bucket can make a hash-map lookup degrade to O(n).', answer: true, explanation: 'A collision-heavy bucket may require a linear scan or long probe sequence.' },
  { kind: 'short-answer', id: 'collision-definition', prompt: 'What is a hash collision?', answer: 'Two keys map to the same bucket.', acceptedAnswers: ['two keys map to the same bucket', 'same bucket', 'same hash location'], explanation: 'Collision handling is part of the map implementation.' },
  { kind: 'output', id: 'map-get-output', prompt: 'Predict the output.', code: "const phone = new Map([['Mom', '+267']]);\nconsole.log(phone.get('Mom'));", answer: '+267', explanation: 'The key Mom selects the stored value +267.' },
] satisfies QuizQuestion[];
