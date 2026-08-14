import type { CodeExampleConfig } from './types';

export const backtrackingCodeExample = {
  testCases: [{ id: 'default', label: 'Generate the subsets', expectedOutput: { javascript: '[[],["B"],["A"],["A","B"]]', python: "[[], ['B'], ['A'], ['A', 'B']]" } }],
} satisfies CodeExampleConfig;
