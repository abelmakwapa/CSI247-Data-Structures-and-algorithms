'use client';

import { useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import type { QuizAnswer, QuizProgress } from '@/lib/study-progress';
import { EMPTY_QUIZ_PROGRESS, readProgress, writeProgress } from '@/lib/study-progress';
import type { QuizQuestion, TopicId } from '@/lib/topics';
import { getTopic } from '@/lib/topics';
import { notifyProgress } from './ProgressTracker';

function shuffle<T>(values: T[]): T[] {
  const next = [...values];
  for (let index = next.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [next[index], next[swapIndex]] = [next[swapIndex], next[index]];
  }
  return next;
}

function normalizeText(value: string): string {
  return value.trim().toLowerCase().replace(/\s+/g, ' ');
}

function isTextAnswerCorrect(question: Extract<QuizQuestion, { kind: 'short-answer' | 'output' }>, answer: string): boolean {
  const accepted = question.acceptedAnswers ?? [question.answer];
  return accepted.some((candidate) => normalizeText(candidate) === normalizeText(answer));
}

function answerLabel(question: QuizQuestion): string {
  if (question.kind === 'choice') return question.options[question.answer];
  if (question.kind === 'true-false') return question.answer ? 'True' : 'False';
  return question.answer;
}

function answerIsCorrect(question: QuizQuestion, answer: QuizAnswer): boolean {
  if (question.kind === 'choice') return answer === question.answer;
  if (question.kind === 'true-false') return answer === question.answer;
  return typeof answer === 'string' && isTextAnswerCorrect(question, answer);
}

function withoutKey<T>(record: Record<string, T>, key: string): Record<string, T> {
  const next = { ...record };
  delete next[key];
  return next;
}

function quizWithOrder(progress: QuizProgress, questions: QuizQuestion[]): QuizProgress {
  const ids = questions.map((question) => question.id);
  const storedOrder = progress.order.filter((id) => ids.includes(id));
  const order = storedOrder.length === ids.length ? storedOrder : shuffle(ids);
  return storedOrder.length === ids.length ? progress : { ...progress, order };
}

export function Quiz({ topicId }: { topicId: TopicId }) {
  const topic = getTopic(topicId);
  const [progress, setProgress] = useState<QuizProgress>(EMPTY_QUIZ_PROGRESS);
  const [announcement, setAnnouncement] = useState('');

  useEffect(() => {
    const stored = readProgress().quizzes[topicId] ?? { ...EMPTY_QUIZ_PROGRESS };
    const next = quizWithOrder(stored, topic.quiz);
    const hydrationTimer = window.setTimeout(() => setProgress(next), 0);
    if (next.order !== stored.order) {
      const current = readProgress();
      writeProgress({ ...current, quizzes: { ...current.quizzes, [topicId]: next } });
    }
    return () => window.clearTimeout(hydrationTimer);
  }, [topicId, topic.quiz]);

  function update(next: QuizProgress) {
    setProgress(next);
    const current = readProgress();
    writeProgress({ ...current, quizzes: { ...current.quizzes, [topicId]: next } });
    notifyProgress();
  }

  function submit(question: QuizQuestion, answer: QuizAnswer) {
    const correct = answerIsCorrect(question, answer);
    update({
      ...progress,
      answered: progress.answered.includes(question.id) ? progress.answered : [...progress.answered, question.id],
      answers: { ...progress.answers, [question.id]: answer },
      results: { ...progress.results, [question.id]: correct },
      drafts: withoutKey(progress.drafts, question.id),
    });
    setAnnouncement(`${correct ? 'Correct.' : 'Not quite.'} Answer submitted for ${question.prompt}`);
  }

  function reveal(questionId: string) {
    update({ ...progress, revealed: progress.revealed.includes(questionId) ? progress.revealed : [...progress.revealed, questionId] });
    setAnnouncement(`Answer revealed for ${topic.quiz.find((question) => question.id === questionId)?.prompt ?? 'question'}.`);
  }

  function retry(questionId: string) {
    update({
      ...progress,
      answered: progress.answered.filter((id) => id !== questionId),
      revealed: progress.revealed.filter((id) => id !== questionId),
      answers: withoutKey(progress.answers, questionId),
      results: withoutKey(progress.results, questionId),
      drafts: withoutKey(progress.drafts, questionId),
    });
    setAnnouncement(`Question ${questionId} is ready to try again.`);
  }

  function saveDraft(questionId: string, value: string) {
    update({ ...progress, drafts: { ...progress.drafts, [questionId]: value } });
  }

  const orderedQuestions = progress.order.map((id) => topic.quiz.find((question) => question.id === id)).filter((question): question is QuizQuestion => Boolean(question));
  const questions = orderedQuestions.length === topic.quiz.length ? orderedQuestions : topic.quiz;
  const answeredCount = topic.quiz.filter((question) => progress.answered.includes(question.id)).length;
  const correctCount = topic.quiz.filter((question) => progress.results[question.id] === true).length;
  const score = topic.quiz.length ? Math.round((correctCount / topic.quiz.length) * 100) : 0;

  return <section className="academic-panel panel-theorem quiz-panel" aria-labelledby={`${topicId}-quiz-title`}><div className="quiz-head"><div><div className="panel-kicker">Active recall</div><h2 id={`${topicId}-quiz-title`}>Can you retrieve it without looking?</h2><p className="quiz-intro">Four ways to test the same idea. Questions shuffle once and your answers stay on this device.</p></div><div className="quiz-score" aria-live="polite" aria-atomic="true"><strong>{score}%</strong><span>{correctCount} correct · {answeredCount} / {topic.quiz.length} answered</span></div></div><div className="quiz-progress" role="progressbar" aria-label="Quiz answer progress" aria-valuemin={0} aria-valuemax={topic.quiz.length} aria-valuenow={answeredCount} aria-valuetext={`${answeredCount} of ${topic.quiz.length} questions answered`}><span aria-hidden="true" style={{ width: `${(answeredCount / topic.quiz.length) * 100}%` }} /></div><p className="sr-only" role="status" aria-live="polite" aria-atomic="true">{announcement}</p><div className="quiz-list" data-question-order={questions.map((question) => question.id).join(',')}>{questions.map((question, index) => <QuizQuestionCard key={question.id} question={question} number={index + 1} progress={progress} onDraftChange={saveDraft} onReveal={reveal} onRetry={retry} onSubmit={submit} />)}</div></section>;
}

interface QuizQuestionCardProps {
  number: number;
  onDraftChange: (questionId: string, value: string) => void;
  onReveal: (questionId: string) => void;
  onRetry: (questionId: string) => void;
  onSubmit: (question: QuizQuestion, answer: QuizAnswer) => void;
  progress: QuizProgress;
  question: QuizQuestion;
}

function QuizQuestionCard({ question, number, progress, onDraftChange, onReveal, onRetry, onSubmit }: QuizQuestionCardProps) {
  const answered = progress.answered.includes(question.id);
  const revealed = progress.revealed.includes(question.id);
  const result = progress.results[question.id];
  const submittedAnswer = progress.answers[question.id];
  const showFeedback = answered || revealed;
  const titleId = `quiz-question-${question.id}`;

  function submitText(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const draft = progress.drafts[question.id]?.trim();
    if (draft) onSubmit(question, draft);
  }

  return <article className="quiz-card" aria-labelledby={titleId} data-question-id={question.id}><div className="quiz-card-meta"><p className="quiz-number">Q{String(number).padStart(2, '0')}</p><span className="quiz-kind">{question.kind === 'choice' ? 'Multiple choice' : question.kind === 'true-false' ? 'True / false' : question.kind === 'short-answer' ? 'Short answer' : 'Predict the output'}</span></div><h3 id={titleId}>{question.prompt}</h3>{question.kind === 'output' && <pre className="quiz-code"><code>{question.code}</code></pre>}{question.kind === 'choice' && <ChoiceAnswer question={question} answered={answered} submittedAnswer={submittedAnswer} onSubmit={onSubmit} />}{question.kind === 'true-false' && <TrueFalseAnswer question={question} answered={answered} submittedAnswer={submittedAnswer} onSubmit={onSubmit} />}{(question.kind === 'short-answer' || question.kind === 'output') && <form className="quiz-text-answer" onSubmit={submitText}><label htmlFor={`${question.id}-answer`}>{question.kind === 'output' ? 'Your predicted output' : 'Your answer'}</label><input id={`${question.id}-answer`} type="text" value={progress.drafts[question.id] ?? (typeof submittedAnswer === 'string' ? submittedAnswer : '')} onChange={(event) => onDraftChange(question.id, event.target.value)} disabled={answered} autoComplete="off" /><button type="submit" disabled={answered || !progress.drafts[question.id]?.trim()}>Check answer</button></form>}<div className="quiz-card-actions">{!revealed && <button type="button" onClick={() => onReveal(question.id)}>Reveal answer</button>}{showFeedback && <button type="button" onClick={() => onRetry(question.id)}>Retry question</button>}</div>{showFeedback && <QuizFeedback question={question} answered={answered} correct={result} revealed={revealed} />}</article>;
}

function ChoiceAnswer({ question, answered, submittedAnswer, onSubmit }: { question: Extract<QuizQuestion, { kind: 'choice' }>; answered: boolean; submittedAnswer: QuizAnswer | undefined; onSubmit: (question: QuizQuestion, answer: QuizAnswer) => void }) {
  return <div className="quiz-options" role="group" aria-label={`Answers for ${question.prompt}`}>{question.options.map((option, optionIndex) => { const selected = submittedAnswer === optionIndex; const correct = optionIndex === question.answer; return <button key={option} type="button" className={`quiz-option${selected && correct ? ' correct' : ''}${selected && !correct ? ' incorrect' : ''}${answered && !selected && correct ? ' answer-key' : ''}`} onClick={() => onSubmit(question, optionIndex)} aria-pressed={selected} disabled={answered}>{option}{answered && selected ? correct ? ' ✓' : ' ✕' : ''}</button>; })}</div>;
}

function TrueFalseAnswer({ question, answered, submittedAnswer, onSubmit }: { question: Extract<QuizQuestion, { kind: 'true-false' }>; answered: boolean; submittedAnswer: QuizAnswer | undefined; onSubmit: (question: QuizQuestion, answer: QuizAnswer) => void }) {
  return <div className="quiz-options quiz-boolean-options" role="group" aria-label={`True or false for ${question.prompt}`}><button type="button" className={`quiz-option${submittedAnswer === true && question.answer ? ' correct' : ''}${submittedAnswer === true && !question.answer ? ' incorrect' : ''}${answered && question.answer === true && submittedAnswer !== true ? ' answer-key' : ''}`} onClick={() => onSubmit(question, true)} aria-pressed={submittedAnswer === true} disabled={answered}>True{submittedAnswer === true ? question.answer ? ' ✓' : ' ✕' : ''}</button><button type="button" className={`quiz-option${submittedAnswer === false && !question.answer ? ' correct' : ''}${submittedAnswer === false && question.answer ? ' incorrect' : ''}${answered && question.answer === false && submittedAnswer !== false ? ' answer-key' : ''}`} onClick={() => onSubmit(question, false)} aria-pressed={submittedAnswer === false} disabled={answered}>False{submittedAnswer === false ? !question.answer ? ' ✓' : ' ✕' : ''}</button></div>;
}

function QuizFeedback({ question, answered, correct, revealed }: { question: QuizQuestion; answered: boolean; correct: boolean | undefined; revealed: boolean }) {
  return <div className={`quiz-feedback${answered ? correct ? ' is-correct' : ' is-incorrect' : ' is-revealed'}`} role="status" aria-live="polite"><strong>{answered ? correct ? 'Correct' : 'Not quite' : 'Answer revealed'}</strong>{answered && <p>{correct ? 'Your answer matches the key idea.' : `Correct answer: ${answerLabel(question)}`}</p>}{revealed && !answered && <p>Correct answer: {answerLabel(question)}</p>}<p className="quiz-explanation">{question.explanation}</p></div>;
}
