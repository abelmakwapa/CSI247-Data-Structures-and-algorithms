import type { CodeExampleConfig } from './types';

export const heapsCodeExample = {
  testCases: [{ id: 'default', label: 'Read the highest priority', expectedOutput: { javascript: 'deploy', python: "(1, 'deploy')" } }],
} satisfies CodeExampleConfig;
