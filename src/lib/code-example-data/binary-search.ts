import type { CodeExampleConfig } from './types';

export const binarySearchCodeExample = {
  inputs: [{ id: 'target', label: 'Target value', defaultValue: '22', type: 'number', min: -1000, max: 1000 }],
  prepareJavaScript: (code, inputs) => code.replace('search([4, 9, 15, 22, 31], 22)', 'search([4, 9, 15, 22, 31], ' + (Number(inputs.target) || 0) + ')'),
  testCases: [
    { id: 'middle', label: 'Find a middle value', inputs: { target: '22' }, expectedOutput: { javascript: '3', python: '3' } },
    { id: 'last', label: 'Find the final value', inputs: { target: '31' }, expectedOutput: { javascript: '4', python: '3' } },
    { id: 'missing', label: 'Search for a missing value', inputs: { target: '20' }, expectedOutput: { javascript: '-1', python: '3' } },
  ],
} satisfies CodeExampleConfig;
