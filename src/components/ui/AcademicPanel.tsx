import type { ReactNode } from 'react';

export function AcademicPanel({ tone, title, children }: { tone: 'definition' | 'theorem' | 'warning' | 'pro'; title: string; children: ReactNode }) {
  const titleId = `academic-panel-${title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;
  return <section className={`academic-panel panel-${tone}`} aria-labelledby={titleId}><div className="panel-kicker">{tone === 'definition' ? 'Definition' : tone === 'theorem' ? 'Theorem / invariant' : tone === 'warning' ? 'Common trap' : 'Pro tip'}</div><h2 id={titleId}>{title}</h2><div className="panel-copy">{children}</div></section>;
}
