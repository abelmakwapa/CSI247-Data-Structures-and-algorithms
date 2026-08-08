import Link from 'next/link';
import { StudyDashboard } from '@/components/study/StudyDashboard';

export default function ReviewPage() {
  return <div className="atlas-home"><header className="site-header"><div className="dept-label">Algo Atlas · active recall workspace</div><h1>Study dashboard</h1><p>See what is solid, what needs another pass, and where to continue next.</p><div className="header-badges"><span>22 topics</span><span>Local progress</span><span>Active recall</span></div></header><nav className="academic-nav" aria-label="Study dashboard navigation"><Link href="/">← Back to atlas</Link><Link href="/docs/data-structures/arrays">Open a topic</Link><a href="#review-topics">Review queue</a></nav><main className="home-content"><StudyDashboard /></main></div>;
}
