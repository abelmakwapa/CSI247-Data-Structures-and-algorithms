import type { CodeExampleConfig } from './types';

export const bloomFiltersCodeExample = {
  testCases: [{ id: 'default', label: 'Check the bit positions', expectedOutput: { javascript: 'true', python: 'True' } }],
} satisfies CodeExampleConfig;
