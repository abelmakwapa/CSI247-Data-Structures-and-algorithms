import type { CodeExampleConfig } from './types';

export const queuesCodeExample = {
  testCases: [{ id: 'default', label: 'Dequeue the oldest request', expectedOutput: { javascript: 'request A', python: 'request A' } }],
} satisfies CodeExampleConfig;
