export const STEP_LABELS = {
  main: "Your details",
  spouse: "Spouse",
  children: "Children",
  review: "Review & submit",
};

export default function Progress({ steps, current }) {
  const idx = steps.indexOf(current);
  return (
    <nav aria-label="Progress" className="progress-wrap">
      <p className="step-count" aria-live="polite">
        Step {idx + 1} of {steps.length}: {STEP_LABELS[current]}
      </p>
      <ol className="progress">
        {steps.map((s, i) => (
          <li
            key={s}
            className={i < idx ? "done" : i === idx ? "current" : ""}
            aria-current={i === idx ? "step" : undefined}
          >
            <span className="dot" aria-hidden="true">
              {i < idx ? "✓" : i + 1}
            </span>
            <span className="lbl">
              {STEP_LABELS[s]}
              {i < idx ? <span className="sr"> (completed)</span> : null}
            </span>
          </li>
        ))}
      </ol>
    </nav>
  );
}
