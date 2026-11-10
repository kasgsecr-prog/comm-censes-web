import { useEffect, useRef } from "react";

/** Moves focus to the heading when a step appears so screen-reader and keyboard users land at the top. */
export default function StepHeading({ children }) {
  const ref = useRef(null);
  useEffect(() => {
    window.scrollTo(0, 0);
    if (ref.current) ref.current.focus();
  }, []);
  return (
    <h2 ref={ref} tabIndex={-1} className="step-title">
      {children}
    </h2>
  );
}
