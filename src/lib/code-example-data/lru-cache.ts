import { NO_OUTPUT, type CodeExampleConfig } from './types';

export const lruCacheCodeExample = {
  testCases: [{ id: 'default', label: 'Read the cached route', expectedOutput: { javascript: 'cached result', python: NO_OUTPUT } }],
} satisfies CodeExampleConfig;
