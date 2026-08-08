import Link from 'next/link';
import { ReviewDashboard } from '@/components/study/ReviewDashboard';

export default function ReviewPage() {
  return <div className="atlas-home"><header className="site-header"><div className="dept-label">Algo Atlas · active recall workspace</div><h1>Review mode</h1><p>Short, local, deliberate revision for the topics that still need another pass.</p></header><nav className="academic-nav" aria-label="Review navigation"><Link href="/">← Back to atlas</Link><Link href="/docs/data-structures/arrays">Open a topic</Link></nav><main className="home-content"><ReviewDashboard /></main></div>;
}
