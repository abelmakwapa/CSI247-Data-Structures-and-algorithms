import Link from 'next/link';
import { ProgressTracker } from '@/components/study/ProgressTracker';
import { topics, topicUrl } from '@/lib/topics';

export default function HomePage() {
  const dataStructures = topics.filter((topic) => topic.category === 'Data structures');
  const algorithms = topics.filter((topic) => topic.category === 'Algorithms');

  return <div className="atlas-home"><header className="site-header"><div className="dept-label">Department of Computer Science · Data Structures &amp; Algorithms</div><h1>Algo Atlas</h1><p>A visual study portal for intuition, implementation, complexity, and interview reasoning.</p><div className="header-badges"><span>Fumadocs + MDX</span><span>SVG explainers</span><span>Operation labs</span><span>22 topics</span></div></header><nav className="academic-nav" aria-label="Primary navigation"><Link href="/">Home</Link><Link href="/docs/data-structures/arrays">Start with arrays</Link><Link href="/review">Review mode</Link><a href="#topic-map">Topic map</a></nav><main id="main-content" className="home-content" tabIndex={-1}><section className="home-intro"><div><p className="eyebrow">A CSI 132-inspired academic field guide</p><h2>Study the structure, trace the operation, explain the trade-off.</h2><p>Every topic is its own MDX document with a reusable diagram, operation lab, runnable example, active-recall quiz, and local study state.</p><div className="home-actions"><Link className="primary-link" href="/docs/data-structures/arrays">Open the field guide →</Link><Link className="secondary-link" href="/review">Review unfinished topics</Link></div></div><ProgressTracker total={topics.length} /></section><section id="topic-map" className="topic-map" aria-labelledby="topic-map-title"><div className="section-heading"><span>01</span><h2 id="topic-map-title">Topic map</h2></div><TopicGroup title="Data structures" items={dataStructures} /><TopicGroup title="Algorithms" items={algorithms} /></section></main></div>;
}

function TopicGroup({ title, items }: { title: string; items: typeof topics }) {
  return <section className="topic-group" aria-labelledby={`${title}-group`}><div className="group-heading"><h3 id={`${title}-group`}>{title}</h3><span>{items.length} topics</span></div><div className="topic-grid">{items.map((topic) => <Link key={topic.id} href={topicUrl(topic.id)} className="topic-card"><span className="topic-card-number">{String(topics.indexOf(topic) + 1).padStart(2, '0')}</span><span><strong>{topic.title}</strong><small>{topic.description}</small></span><span className="topic-arrow">→</span></Link>)}</div></section>;
}
