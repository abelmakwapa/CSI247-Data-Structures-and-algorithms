'use client';

import { useEffect, useState } from 'react';

export function StudyToolbar() {
  const [focus, setFocus] = useState(false);

  useEffect(() => {
    const sync = () => {
      const saved = window.localStorage.getItem('algo-atlas-focus') === 'true';
      setFocus(saved);
      document.body.classList.toggle('atlas-focus', saved);
    };
    sync();
  }, []);

  function toggleFocus() {
    const next = !focus;
    setFocus(next);
    document.body.classList.toggle('atlas-focus', next);
    window.localStorage.setItem('algo-atlas-focus', String(next));
  }

  return (
    <div className="study-toolbar" aria-label="Study tools">
      <button type="button" className="toolbar-button" onClick={toggleFocus} aria-pressed={focus}>
        {focus ? 'Exit focus' : 'Focus mode'}
      </button>
      <button type="button" className="toolbar-button" onClick={() => window.print()}>Print / PDF</button>
    </div>
  );
}
