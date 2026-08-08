import type { ReactNode } from 'react';

export function AcademicPanel({ tone, title, children }: { tone: 'definition' | 'theorem' | 'warning' | 'pro'; title: string; children: ReactNode }) {
  return <aside className={`academic-panel panel-${tone}`}><div className="panel-kicker">{tone === 'definition' ? 'Definition' : tone === 'theorem' ? 'Theorem / invariant' : tone === 'warning' ? 'Common trap' : 'Pro tip'}</div><h2>{title}</h2><div className="panel-copy">{children}</div></aside>;
}
