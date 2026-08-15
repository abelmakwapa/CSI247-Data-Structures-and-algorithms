import type { ComplexityMeasure, TopicId } from '@/lib/topics';
import { complexityScale, getTopic } from '@/lib/topics';

function ComplexityMeasureCell({ measure }: { measure: ComplexityMeasure }) {
  return (
    <span className="complexity-measure">
      <code>{measure.value}</code>
      {measure.qualifier && <small>{measure.qualifier}</small>}
    </span>
  );
}

export function ComplexityTable({ topicId }: { topicId: TopicId }) {
  const topic = getTopic(topicId);
  const headingId = `${topic.id}-complexity-title`;
  const scaleTitleId = `${topic.id}-complexity-scale-title`;
  const scaleAlternativeId = `${topic.id}-complexity-scale-alternative`;

  return (
    <section className="academic-panel panel-theorem complexity-panel" aria-labelledby={headingId}>
      <div className="complexity-panel-heading">
        <div>
          <div className="panel-kicker">Complexity at a glance</div>
          <h2 id={headingId}>{topic.title} operation bounds</h2>
        </div>
        <span className="complexity-panel-tag">time + auxiliary space</span>
      </div>

      <figure className="complexity-scale" aria-labelledby={scaleTitleId} aria-describedby={scaleAlternativeId}>
        <figcaption id={scaleTitleId} className="complexity-scale-heading">
          <span>Growth comparison</span>
          <small>qualitative scale · slower to faster growth</small>
        </figcaption>
        <ol className="complexity-scale-list">
          {complexityScale.map((item) => (
            <li key={item.notation} className="complexity-scale-item">
              <div className="complexity-scale-label">
                <code>{item.notation}</code>
                <span>{item.label}</span>
              </div>
              <span className={`complexity-scale-track complexity-scale-track--${item.rank}`} aria-hidden="true">
                <span className="complexity-scale-bar" />
              </span>
              <small>{item.explanation}</small>
            </li>
          ))}
        </ol>
        <details className="complexity-scale-alternative">
          <summary>Text alternative</summary>
          <p id={scaleAlternativeId}>
            From slower to faster growth: O(1), O(log n), O(n), O(n log n), O(n²), then O(2ⁿ). This is an
            ordinal asymptotic comparison, not a measurement of wall-clock time.
          </p>
        </details>
      </figure>

      <div className="complexity-table-note">
        <span>Case bounds</span>
        <p>Space values describe auxiliary space unless the operation explicitly stores a structure or output.</p>
      </div>

      <div className="table-wrap">
        <table className="complexity-table">
          <caption className="sr-only">{topic.title} operation complexity by best, average, and worst case</caption>
          <thead>
            <tr>
              <th scope="col">Operation</th>
              <th scope="col">Best</th>
              <th scope="col">Average</th>
              <th scope="col">Worst</th>
              <th scope="col">Space</th>
              <th scope="col">Explanation</th>
              <th scope="col">Amortized / notes</th>
            </tr>
          </thead>
          <tbody>
            {topic.complexityProfile.map((entry) => (
              <tr key={entry.operation}>
                <th scope="row">{entry.operation}</th>
                <td data-label="Best"><ComplexityMeasureCell measure={entry.best} /></td>
                <td data-label="Average"><ComplexityMeasureCell measure={entry.average} /></td>
                <td data-label="Worst"><ComplexityMeasureCell measure={entry.worst} /></td>
                <td data-label="Space"><ComplexityMeasureCell measure={entry.space} /></td>
                <td data-label="Explanation">{entry.explanation}</td>
                <td data-label="Amortized / notes">{entry.amortized ?? <span className="complexity-no-note">—</span>}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
