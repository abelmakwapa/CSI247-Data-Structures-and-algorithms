import type { CodeExampleConfig } from './types';

export const bigOCodeExample = {
  testCases: [{ id: 'default', label: 'Detect the duplicate', expectedOutput: { javascript: 'true', python: 'True' } }],
} satisfies CodeExampleConfig;
