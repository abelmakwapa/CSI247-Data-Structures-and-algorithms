import type { CodeExampleConfig } from './types';

export const triesCodeExample = {
  testCases: [{ id: 'default', label: 'Find the matching prefix', expectedOutput: { javascript: '["app"]', python: "['app']" } }],
} satisfies CodeExampleConfig;
