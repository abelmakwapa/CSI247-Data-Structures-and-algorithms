interface StudyStatCardProps {
  label: string;
  value: string;
  detail: string;
  tone?: 'green' | 'red' | 'gold' | 'blue';
}

export function StudyStatCard({ label, value, detail, tone = 'blue' }: StudyStatCardProps) {
  const labelId = `study-stat-${label.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;
  return (
    <article className={`study-stat-card study-stat-card-${tone}`} aria-labelledby={labelId}>
      <h3 id={labelId} className="study-stat-label">{label}</h3>
      <p className="study-stat-value">{value}</p>
      <p className="study-stat-detail">{detail}</p>
    </article>
  );
}
