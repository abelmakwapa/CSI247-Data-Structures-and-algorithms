import type { CodeExampleConfig } from './types';

export const graphsCodeExample = {
  testCases: [{ id: 'default', label: 'Read A’s neighbors', expectedOutput: { javascript: '["B","C"]', python: "['B', 'C']" } }],
} satisfies CodeExampleConfig;
