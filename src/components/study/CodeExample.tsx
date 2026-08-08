'use client';

import { useState } from 'react';
import type { TopicId } from '@/lib/topics';
import { getTopic } from '@/lib/topics';

function copyText(value: string) {
  if (navigator.clipboard) return navigator.clipboard.writeText(value);
  const input = document.createElement('textarea');
  input.value = value;
  document.body.appendChild(input);
  input.select();
  document.execCommand('copy');
  input.remove();
  return Promise.resolve();
}

export function CodeExample({ topicId }: { topicId: TopicId }) {
  const topic = getTopic(topicId);
  const [language, setLanguage] = useState<'javascript' | 'python'>('javascript');
  const [message, setMessage] = useState('');
  const code = topic.examples[language];

  function run() {
    if (language === 'python') {
      setMessage('Run is available for JavaScript examples. Copy the Python tab into your interpreter.');
      return;
    }
    const output: string[] = [];
    try {
      const consoleProxy = { log: (...args: unknown[]) => output.push(args.map(String).join(' ')) };
      new Function('console', code)(consoleProxy);
      setMessage(output.length ? output.join('\n') : 'Ran successfully with no console output.');
    } catch (error) {
      setMessage(`Could not run this example: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  return (
    <section className="academic-panel code-panel" aria-labelledby={`${topicId}-code-title`}>
      <div className="code-panel-head"><div><div className="panel-kicker">Code you should recognize</div><h2 id={`${topicId}-code-title`}>Small enough to trace by hand</h2></div><div className="code-actions"><div className="code-tabs" role="tablist" aria-label="Code language"><button type="button" className={language === 'javascript' ? 'active' : ''} onClick={() => setLanguage('javascript')}>JavaScript</button><button type="button" className={language === 'python' ? 'active' : ''} onClick={() => setLanguage('python')}>Python</button></div><button type="button" onClick={() => void copyText(code).then(() => setMessage(`${language === 'javascript' ? 'JavaScript' : 'Python'} copied to clipboard.`))}>Copy</button><button type="button" onClick={run}>Run JS</button></div></div>
      <pre><code>{code}</code></pre>
      <output className="code-output" aria-live="polite">{message}</output>
    </section>
  );
}
