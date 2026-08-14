import type { CodeExampleConfig } from './types';

export const greedyAlgorithmsCodeExample = {
  testCases: [{ id: 'default', label: 'Choose the earliest finish', expectedOutput: { javascript: '{"start":1,"end":3}', python: '(1, 3)' } }],
} satisfies CodeExampleConfig;
