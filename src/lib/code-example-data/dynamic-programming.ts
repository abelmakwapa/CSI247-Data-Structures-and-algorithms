import type { CodeExampleConfig } from './types';

export const dynamicProgrammingCodeExample = {
  inputs: [{ id: 'n', label: 'Fibonacci index', defaultValue: '8', type: 'number', min: 0, max: 20 }],
  prepareJavaScript: (code, inputs) => code.replace('fib(8)', 'fib(' + Math.min(20, Math.max(0, Number(inputs.n) || 0)) + ')'),
  testCases: [
    { id: 'eight', label: 'Compute fib(8)', inputs: { n: '8' }, expectedOutput: { javascript: '21', python: '21' } },
    { id: 'ten', label: 'Compute fib(10)', inputs: { n: '10' }, expectedOutput: { javascript: '55', python: '21' } },
    { id: 'one', label: 'Compute fib(1)', inputs: { n: '1' }, expectedOutput: { javascript: '1', python: '21' } },
  ],
} satisfies CodeExampleConfig;
