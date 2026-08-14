export interface CodeRunResult {
  output: string;
  error?: string;
  durationMs: number;
  timedOut?: boolean;
}

export const CODE_RUNNER_LIMITS = {
  maxCodeLength: 20_000,
  maxInputLength: 1_000,
  maxOutputLength: 4_000,
  timeoutMs: 1_200,
} as const;

const blockedGlobals = /\b(?:fetch|XMLHttpRequest|WebSocket|importScripts|document|localStorage|sessionStorage|indexedDB|navigator|location|self|globalThis|eval|Function)\b/;

function validateInput(input: Readonly<Record<string, string>>): void {
  if (Object.keys(input).length > 8 || Object.values(input).some((value) => value.length > CODE_RUNNER_LIMITS.maxInputLength)) {
    throw new Error('This example input is too large for the local runner.');
  }
}

export function runJavaScriptInWorker(code: string, input: Readonly<Record<string, string>>): Promise<CodeRunResult> {
  const startedAt = performance.now();
  if (typeof window === 'undefined' || typeof Worker === 'undefined' || typeof Blob === 'undefined' || typeof URL.createObjectURL !== 'function') {
    return Promise.resolve({ output: '', error: 'JavaScript execution is unavailable here. The static code remains available to copy.', durationMs: 0 });
  }
  if (code.length > CODE_RUNNER_LIMITS.maxCodeLength) {
    return Promise.resolve({ output: '', error: 'This example is too large for the local runner.', durationMs: 0 });
  }
  if (blockedGlobals.test(code)) {
    return Promise.resolve({ output: '', error: 'This example uses a browser or network API that the safe runner blocks.', durationMs: 0 });
  }
  try {
    validateInput(input);
  } catch (error) {
    return Promise.resolve({ output: '', error: error instanceof Error ? error.message : String(error), durationMs: 0 });
  }

  const workerSource = [
    'const MAX_OUTPUT_LENGTH = ' + CODE_RUNNER_LIMITS.maxOutputLength + ';',
    'const format = (value) => {',
    "  if (typeof value === 'string') return value;",
    "  if (typeof value === 'undefined') return 'undefined';",
    '  try { return JSON.stringify(value); } catch { return String(value); }',
    '};',
    'self.onmessage = ({ data }) => {',
    "  let output = '';",
    '  const append = (value) => {',
    "    output += value + '\\n';",
    "    if (output.length > MAX_OUTPUT_LENGTH) throw new Error('Output exceeded the local runner limit.');",
    '  };',
    '  const consoleProxy = {',
    "    log: (...values) => append(values.map(format).join(' ')),",
    "    info: (...values) => append(values.map(format).join(' ')),",
    "    warn: (...values) => append(values.map(format).join(' ')),",
    '  };',
    '  try {',
    "    const run = new Function('console', 'input', 'fetch', 'XMLHttpRequest', 'WebSocket', 'importScripts', 'document', 'localStorage', 'sessionStorage', 'navigator', 'location', 'self', 'globalThis', '\"use strict\";\\n' + data.code);",
    '    run(consoleProxy, data.input, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined);',
    "    self.postMessage({ type: 'result', output: output.trim() || 'No console output.' });",
    '  } catch (error) {',
    "    self.postMessage({ type: 'error', error: error instanceof Error ? error.message : String(error) });",
    '  }',
    '};',
  ].join('\n');
  const workerUrl = URL.createObjectURL(new Blob([workerSource], { type: 'text/javascript' }));
  const worker = new Worker(workerUrl);

  return new Promise((resolve) => {
    let settled = false;
    const finish = (result: CodeRunResult) => {
      if (settled) return;
      settled = true;
      worker.terminate();
      URL.revokeObjectURL(workerUrl);
      resolve({ ...result, durationMs: Math.round(performance.now() - startedAt) });
    };
    const timer = window.setTimeout(() => finish({ output: '', error: 'Execution timed out after 1.2 seconds. The worker was stopped.', timedOut: true, durationMs: 0 }), CODE_RUNNER_LIMITS.timeoutMs);
    worker.onmessage = (event: MessageEvent<{ type: 'result' | 'error'; output?: string; error?: string }>) => {
      window.clearTimeout(timer);
      if (event.data.type === 'result') finish({ output: event.data.output ?? 'No console output.', durationMs: 0 });
      else finish({ output: '', error: event.data.error ?? 'The example could not run.', durationMs: 0 });
    };
    worker.onerror = (event) => {
      window.clearTimeout(timer);
      finish({ output: '', error: event.message || 'The example could not run.', durationMs: 0 });
    };
    worker.postMessage({ code, input });
  });
}
