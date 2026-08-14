import type { CodeExampleConfig } from './types';

export const sortingCodeExample = {
  testCases: [{ id: 'default', label: 'Sort the values', expectedOutput: { javascript: '2 → 3 → 5 → 6 → 7', python: '2 → 3 → 5 → 6 → 7' } }],
} satisfies CodeExampleConfig;
