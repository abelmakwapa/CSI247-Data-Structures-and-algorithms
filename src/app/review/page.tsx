import Link from 'next/link';
import { StudyDashboard } from '@/components/study/StudyDashboard';

export default function ReviewPage() {
  return <div className="atlas-home"><header className="site-header"><div className="dept-label">Algo Atlas · active recall workspace</div><h1>Review mode</h1><p>Turn study signals into a focused, spaced review session.</p><div className="header-badges"><span>22 topics</span><span>Local progress</span><span>Active recall</span></div></header><nav className="academic-nav" aria-label="Review navigation"><Link href="/">← Back to atlas</Link><a href="#review-session">Review session</a><a href="#review-history-title">History</a><a href="#study-dashboard-title">Study dashboard</a></nav><main className="home-content"><StudyDashboard /></main></div>;
}
