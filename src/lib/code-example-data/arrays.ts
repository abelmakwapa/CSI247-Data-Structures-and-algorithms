import type { CodeExampleConfig } from './types';

export const arraysCodeExample = {
  inputs: [{ id: 'index', label: 'Index to read', defaultValue: '2', type: 'number', min: 0, max: 3 }],
  prepareJavaScript: (code, inputs) => code.replace('seats[2]', 'seats[' + (Number(inputs.index) || 0) + ']'),
  testCases: [
    { id: 'middle', label: 'Read the middle slot', inputs: { index: '2' }, expectedOutput: { javascript: '30', python: '30' } },
    { id: 'first', label: 'Read the first slot', inputs: { index: '0' }, expectedOutput: { javascript: '10', python: '30' } },
    { id: 'last', label: 'Read the last slot', inputs: { index: '3' }, expectedOutput: { javascript: '40', python: '30' } },
  ],
} satisfies CodeExampleConfig;
