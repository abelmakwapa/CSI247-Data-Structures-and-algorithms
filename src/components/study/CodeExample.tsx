'use client';

import { useState } from 'react';
import type { KeyboardEvent } from 'react';
import { getCodeExampleConfig } from '@/lib/code-example-data';
import type { CodeInputField, CodeLanguage } from '@/lib/code-example-data/types';
import { runJavaScriptInWorker } from '@/lib/code-runner';
import type { TopicId } from '@/lib/topics';
import { getTopic } from '@/lib/topics';

type RunStatus = 'idle' | 'running' | 'complete' | 'error';

interface RunState {
  status: RunStatus;
  output: string;
  error?: string;
  matchesExpected?: boolean;
  durationMs?: number;
}

const EMPTY_RUN: RunState = { status: 'idle', output: '' };

function getInputValues(fields: readonly CodeInputField[], overrides: Readonly<Record<string, string>> = {}): Record<string, string> {
  return Object.fromEntries(fields.map((field) => [field.id, overrides[field.id] ?? field.defaultValue]));
}

function normalizeOutput(value: string): string {
  return value.trim().replace(/\r\n/g, '\n');
}

async function copyText(value: string): Promise<void> {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(value);
    return;
  }
  const input = document.createElement('textarea');
  input.value = value;
  input.setAttribute('readonly', 'true');
  input.style.position = 'fixed';
  input.style.opacity = '0';
  document.body.appendChild(input);
  input.select();
  const copied = document.execCommand('copy');
  input.remove();
  if (!copied) throw new Error('Copy is unavailable in this browser. Select the code manually.');
}

export function CodeExample({ topicId }: { topicId: TopicId }) {
  const topic = getTopic(topicId);
  const config = getCodeExampleConfig(topicId);
  const fields = config.inputs ?? [];
  const firstTestCase = config.testCases[0];
  const [language, setLanguage] = useState<CodeLanguage>('javascript');
  const [testCaseId, setTestCaseId] = useState(firstTestCase.id);
  const [inputs, setInputs] = useState(() => getInputValues(fields, firstTestCase.inputs));
  const [runState, setRunState] = useState<RunState>(EMPTY_RUN);
  const [announcement, setAnnouncement] = useState('JavaScript example ready to run.');

  const selectedTestCase = config.testCases.find((testCase) => testCase.id === testCaseId) ?? firstTestCase;
  const code = topic.examples[language];
  const expectedOutput = selectedTestCase.expectedOutput[language];
  const codePanelId = topicId + '-code-panel';

  function changeLanguage(nextLanguage: CodeLanguage) {
    setLanguage(nextLanguage);
    setRunState(EMPTY_RUN);
    setAnnouncement(nextLanguage === 'javascript' ? 'JavaScript tab selected.' : 'Python tab selected. Python remains copyable; browser execution is unavailable.');
  }

  function handleLanguageKeyDown(event: KeyboardEvent<HTMLButtonElement>, currentLanguage: CodeLanguage) {
    if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
    event.preventDefault();
    if (event.key === 'Home' || event.key === 'ArrowLeft') changeLanguage('javascript');
    if (event.key === 'End' || event.key === 'ArrowRight') changeLanguage('python');
    if (currentLanguage === 'python' && event.key === 'ArrowLeft') changeLanguage('javascript');
    if (currentLanguage === 'javascript' && event.key === 'ArrowRight') changeLanguage('python');
  }

  function selectTestCase(nextId: string) {
    const nextTestCase = config.testCases.find((testCase) => testCase.id === nextId) ?? firstTestCase;
    setTestCaseId(nextTestCase.id);
    setInputs(getInputValues(fields, nextTestCase.inputs));
    setRunState(EMPTY_RUN);
    setAnnouncement('Test case selected: ' + nextTestCase.label + '.');
  }

  function updateInput(field: CodeInputField, value: string) {
    const nextValue = field.maxLength ? value.slice(0, field.maxLength) : value;
    setInputs((current) => ({ ...current, [field.id]: nextValue }));
    setRunState(EMPTY_RUN);
    setAnnouncement(field.label + ' updated. Run the example to see the output.');
  }

  function resetExample() {
    setTestCaseId(firstTestCase.id);
    setInputs(getInputValues(fields, firstTestCase.inputs));
    setRunState(EMPTY_RUN);
    setAnnouncement('Example reset to its default test case.');
  }

  async function copyCode() {
    try {
      await copyText(code);
      setAnnouncement((language === 'javascript' ? 'JavaScript' : 'Python') + ' code copied to the clipboard.');
    } catch (error) {
      setRunState({ status: 'error', output: '', error: error instanceof Error ? error.message : String(error) });
      setAnnouncement('Code could not be copied.');
    }
  }

  async function runCode() {
    if (language === 'python') {
      const error = 'Python execution is not available in this browser. Copy the static Python code into a Python interpreter.';
      setRunState({ status: 'error', output: '', error });
      setAnnouncement(error);
      return;
    }
    setRunState({ status: 'running', output: '' });
    setAnnouncement('Running JavaScript in a limited local worker.');
    const preparedCode = config.prepareJavaScript ? config.prepareJavaScript(code, inputs) : code;
    const result = await runJavaScriptInWorker(preparedCode, inputs);
    if (result.error) {
      setRunState({ status: 'error', output: result.output, error: result.error, durationMs: result.durationMs });
      setAnnouncement('JavaScript run failed: ' + result.error);
      return;
    }
    const matchesExpected = normalizeOutput(result.output) === normalizeOutput(expectedOutput);
    setRunState({ status: 'complete', output: result.output, matchesExpected, durationMs: result.durationMs });
    setAnnouncement(matchesExpected ? 'JavaScript finished and matched the expected output.' : 'JavaScript finished, but the output did not match the expected output.');
  }

  return (
    <section className="academic-panel code-panel" aria-labelledby={topicId + '-code-title'}>
      <div className="code-panel-head">
        <div>
          <div className="panel-kicker">Code you should recognize</div>
          <h2 id={topicId + '-code-title'}>Small enough to trace by hand</h2>
        </div>
        <div className="code-actions">
          <div className="code-tabs" role="tablist" aria-label="Code language">
            <button
              type="button"
              role="tab"
              id={topicId + '-javascript-tab'}
              aria-controls={codePanelId}
              aria-selected={language === 'javascript'}
              tabIndex={language === 'javascript' ? 0 : -1}
              className={language === 'javascript' ? 'active' : ''}
              onClick={() => changeLanguage('javascript')}
              onKeyDown={(event) => handleLanguageKeyDown(event, 'javascript')}
            >
              JavaScript
            </button>
            <button
              type="button"
              role="tab"
              id={topicId + '-python-tab'}
              aria-controls={codePanelId}
              aria-selected={language === 'python'}
              tabIndex={language === 'python' ? 0 : -1}
              className={language === 'python' ? 'active' : ''}
              onClick={() => changeLanguage('python')}
              onKeyDown={(event) => handleLanguageKeyDown(event, 'python')}
            >
              Python
            </button>
          </div>
          <button type="button" onClick={() => void copyCode()}>Copy code</button>
          <button type="button" onClick={resetExample}>Reset example</button>
          <button type="button" onClick={() => void runCode()} disabled={runState.status === 'running'} aria-busy={runState.status === 'running'}>
            {runState.status === 'running' ? 'Running…' : 'Run code'}
          </button>
        </div>
      </div>

      <div className="code-test-controls">
        <label className="code-test-case">
          <span>Example test case</span>
          <select value={selectedTestCase.id} onChange={(event) => selectTestCase(event.target.value)}>
            {config.testCases.map((testCase) => <option key={testCase.id} value={testCase.id}>{testCase.label}</option>)}
          </select>
        </label>
        {fields.length > 0 && (
          <div className="code-inputs" aria-label="Example inputs">
            {fields.map((field) => (
              <label key={field.id} className="code-input">
                <span>{field.label}</span>
                <input
                  type={field.type ?? 'text'}
                  value={inputs[field.id] ?? ''}
                  min={field.min}
                  max={field.max}
                  maxLength={field.maxLength}
                  inputMode={field.type === 'number' ? 'numeric' : 'text'}
                  onChange={(event) => updateInput(field, event.target.value)}
                />
              </label>
            ))}
          </div>
        )}
      </div>

      <p className="code-input-note">{fields.length > 0 ? 'Inputs are bounded and affect the JavaScript runner only.' : 'This example runs with the values shown in the code.'}</p>

      <div id={codePanelId} role="tabpanel" aria-labelledby={topicId + '-' + language + '-tab'}>
        <pre><code>{code}</code></pre>
      </div>

      <div className="code-expected">
        <span>Expected output</span>
        <code>{expectedOutput}</code>
      </div>

      <div className={'code-output' + (runState.status === 'error' ? ' is-error' : '') + (runState.status === 'complete' && runState.matchesExpected ? ' is-success' : '')} role="status" aria-live="polite" aria-busy={runState.status === 'running'}>
        <div className="code-output-head"><strong>Output</strong>{runState.durationMs !== undefined && <span>{runState.durationMs} ms</span>}</div>
        {runState.status === 'idle' && <p>Run the JavaScript example to compare its output with the expected result.</p>}
        {runState.status === 'running' && <p>Running in a limited local worker…</p>}
        {runState.status === 'error' && <p role="alert">{runState.error}</p>}
        {runState.output && <pre><code>{runState.output}</code></pre>}
        {runState.status === 'complete' && <p className="code-result-note">{runState.matchesExpected ? 'Matches expected output.' : 'Output differs from the selected test case.'}</p>}
      </div>

      <p className="sr-only" role="status" aria-live="polite">{announcement}</p>
    </section>
  );
}
