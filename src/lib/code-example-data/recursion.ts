import type { CodeExampleConfig } from './types';

export const recursionCodeExample = {
  inputs: [{ id: 'n', label: 'Factorial input', defaultValue: '4', type: 'number', min: 0, max: 8 }],
  prepareJavaScript: (code, inputs) => code.replace('factorial(4)', 'factorial(' + Math.min(8, Math.max(0, Number(inputs.n) || 0)) + ')'),
  testCases: [
    { id: 'four', label: 'Compute 4!', inputs: { n: '4' }, expectedOutput: { javascript: '24', python: '24' } },
    { id: 'five', label: 'Compute 5!', inputs: { n: '5' }, expectedOutput: { javascript: '120', python: '24' } },
    { id: 'one', label: 'Compute 1!', inputs: { n: '1' }, expectedOutput: { javascript: '1', python: '24' } },
  ],
} satisfies CodeExampleConfig;
