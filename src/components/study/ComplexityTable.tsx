import type { TopicId } from '@/lib/topics';
import { getTopic } from '@/lib/topics';

export function ComplexityTable({ topicId }: { topicId: TopicId }) {
  const topic = getTopic(topicId);
  return (
    <div className="academic-panel panel-theorem">
      <div className="panel-kicker">Complexity at a glance</div>
      <div className="table-wrap">
        <table className="complexity-table">
          <caption className="sr-only">{topic.title} complexity table</caption>
          <thead><tr><th scope="col">Operation / idea</th><th scope="col">Typical cost</th><th scope="col">Interview note</th></tr></thead>
          <tbody>{topic.complexity.map((entry) => <tr key={entry.operation}><th scope="row">{entry.operation}</th><td><code>{entry.average}</code></td><td>{entry.note ?? 'State the assumption that makes this bound true.'}</td></tr>)}</tbody>
        </table>
      </div>
    </div>
  );
}
