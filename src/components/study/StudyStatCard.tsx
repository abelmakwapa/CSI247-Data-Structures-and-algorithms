interface StudyStatCardProps {
  label: string;
  value: string;
  detail: string;
  tone?: 'green' | 'red' | 'gold' | 'blue';
}

export function StudyStatCard({ label, value, detail, tone = 'blue' }: StudyStatCardProps) {
  return (
    <article className={`study-stat-card study-stat-card-${tone}`}>
      <p className="study-stat-label">{label}</p>
      <p className="study-stat-value">{value}</p>
      <p className="study-stat-detail">{detail}</p>
    </article>
  );
}
