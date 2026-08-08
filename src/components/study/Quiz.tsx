'use client';

import { useEffect, useState } from 'react';
import type { TopicId } from '@/lib/topics';
import { getTopic } from '@/lib/topics';
import { notifyProgress } from './ProgressTracker';
import { readProgress, writeProgress, type QuizProgress } from '@/lib/study-progress';

function emptyQuiz(): QuizProgress {
  return { answered: [], revealed: [], selected: {}, recallRatings: {} };
}

export function Quiz({ topicId }: { topicId: TopicId }) {
  const topic = getTopic(topicId);
  const [progress, setProgress] = useState<QuizProgress>(emptyQuiz());
  const [recall, setRecall] = useState<Record<number, string>>({});

  useEffect(() => {
    const sync = () => setProgress(readProgress().quizzes[topicId] ?? emptyQuiz());
    sync();
  }, [topicId]);

  function update(next: QuizProgress) {
    setProgress(next);
    const current = readProgress();
    writeProgress({ ...current, quizzes: { ...current.quizzes, [topicId]: next } });
    notifyProgress();
  }

  function choose(questionIndex: number, option: number) {
    update({ ...progress, answered: progress.answered.includes(questionIndex) ? progress.answered : [...progress.answered, questionIndex], selected: { ...progress.selected, [questionIndex]: option } });
  }

  function reveal(questionIndex: number) {
    update({ ...progress, revealed: progress.revealed.includes(questionIndex) ? progress.revealed : [...progress.revealed, questionIndex] });
  }

  const answered = progress.answered.length + Object.keys(progress.recallRatings).length;

  return <section className="academic-panel panel-theorem quiz-panel" aria-labelledby={`${topicId}-quiz-title`}><div className="quiz-head"><div><div className="panel-kicker">Active recall</div><h2 id={`${topicId}-quiz-title`}>Can you retrieve it without looking?</h2></div><span className="quiz-score" aria-live="polite">{Math.min(answered, topic.quiz.length)} / {topic.quiz.length} attempted</span></div><div className="quiz-list">{topic.quiz.map((question, index) => <article className="quiz-card" key={`${topicId}-${index}`}><p className="quiz-number">Q0{index + 1}</p><h3>{question.prompt}</h3>{question.kind === 'choice' ? <div className="quiz-options" role="group" aria-label={`Answers for question ${index + 1}`}>{question.options.map((option, optionIndex) => { const selected = progress.selected[index] === optionIndex; const answeredQuestion = progress.answered.includes(index); return <button key={option} type="button" className={`quiz-option${selected ? optionIndex === question.answer ? ' correct' : ' incorrect' : ''}`} onClick={() => choose(index, optionIndex)} aria-pressed={selected}>{option}{answeredQuestion && selected ? optionIndex === question.answer ? ' ✓' : ' ✕' : ''}</button>; })}</div> : <div className="recall-box"><label htmlFor={`${topicId}-recall-${index}`}>Say it in your own words</label><textarea id={`${topicId}-recall-${index}`} value={recall[index] ?? ''} onChange={(event) => setRecall({ ...recall, [index]: event.target.value })} placeholder="Type your answer before revealing the key point…" />{progress.revealed.includes(index) && <div className="recall-answer"><strong>Key point:</strong> {question.answer}</div>}<div className="recall-actions"><button type="button" onClick={() => reveal(index)}>{progress.revealed.includes(index) ? 'Answer revealed' : 'Reveal key point'}</button>{progress.revealed.includes(index) && <><button type="button" className={progress.recallRatings[index] === 'got-it' ? 'selected' : ''} onClick={() => update({ ...progress, revealed: progress.revealed, recallRatings: { ...progress.recallRatings, [index]: 'got-it' } })}>I got it</button><button type="button" className={progress.recallRatings[index] === 'review' ? 'selected warning' : ''} onClick={() => update({ ...progress, revealed: progress.revealed, recallRatings: { ...progress.recallRatings, [index]: 'review' } })}>Review again</button></>}</div></div>}{question.kind === 'choice' && progress.answered.includes(index) && <p className="quiz-explanation">{question.explanation}</p>}{question.kind === 'recall' && progress.revealed.includes(index) && <p className="quiz-explanation">{question.explanation}</p>}</article>)}</div></section>;
}
