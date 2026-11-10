import { useEffect, useRef, useState } from "react";
import { FormProvider, useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Landing from "./components/Landing.jsx";
import Progress from "./components/Progress.jsx";
import MainStep from "./components/MainStep.jsx";
import SpouseStep from "./components/SpouseStep.jsx";
import ChildrenStep from "./components/ChildrenStep.jsx";
import ReviewStep from "./components/ReviewStep.jsx";
import Success from "./components/Success.jsx";
import { ApiError, newToken, submitCensus } from "./api.js";
import {
  buildPayload,
  defaultValues,
  emptyChild,
  extraErrors,
  STEP_SCHEMAS,
  stepForPath,
} from "./form.js";
import { CONTACT_EMAIL, RETENTION_NOTE } from "./config.js";

export default function App() {
  const [phase, setPhase] = useState("landing"); // landing | form | done
  const [step, setStep] = useState("main");
  const [reference, setReference] = useState("");
  const [banner, setBanner] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [token] = useState(newToken); // one idempotency key per page load
  const stepRef = useRef(step);
  stepRef.current = step;

  const methods = useForm({
    defaultValues,
    mode: "onTouched",
    // Validate only the current step's schema.
    resolver: (values, context, options) =>
      zodResolver(STEP_SCHEMAS[stepRef.current])(values, context, options),
  });

  // Conditional routing
  const marital = useWatch({
    control: methods.control,
    name: "main.maritalStatus",
  });
  const kids =
    Number(
      useWatch({ control: methods.control, name: "spouse.numberOfChildren" }),
    ) || 0;
  const married = marital === "MARRIED";
  const steps = [
    "main",
    ...(married ? ["spouse"] : []),
    ...(married && kids >= 1 ? ["children"] : []),
    "review",
  ];
  const idx = steps.indexOf(step);

  // Warn before accidentally leaving with unsaved data (ignored by iOS Safari, harmless).
  useEffect(() => {
    if (phase !== "form") return undefined;
    const handler = (e) => {
      e.preventDefault();
      e.returnValue = "";
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [phase]);

  async function validateStep() {
    let ok = await methods.trigger(undefined, { shouldFocus: true });
    const extras = extraErrors(step, methods.getValues());
    extras.forEach((e) =>
      methods.setError(e.name, { type: "manual", message: e.message }),
    );
    if (extras.length) {
      ok = false;
      methods.setFocus(extras[0].name);
    }
    return ok;
  }

  /** Make the children array exactly as long as the number entered, keeping existing rows. */
  function syncChildren() {
    const n = Number(methods.getValues("spouse.numberOfChildren")) || 0;
    const cur = methods.getValues("children") || [];
    methods.setValue(
      "children",
      Array.from({ length: n }, (_, i) => cur[i] ?? { ...emptyChild }),
    );
  }

  async function next() {
    setBanner("");
    if (!(await validateStep())) return;
    if (step === "spouse") syncChildren();
    setStep(steps[idx + 1]);
  }

  function back() {
    setBanner("");
    setStep(steps[idx - 1]);
  }

  async function submit() {
    setBanner("");
    if (!(await validateStep())) return;
    setSubmitting(true);
    try {
      const data = await submitCensus(buildPayload(methods.getValues(), token));
      setReference(data.referenceNo);
      setPhase("done");
      methods.reset(defaultValues); // clear personal data from memory
    } catch (e) {
      if (e instanceof ApiError && e.status === 422 && e.details.length) {
        let target = null;
        e.details.forEach((d) => {
          methods.setError(d.path, { type: "server", message: d.message });
          const s = stepForPath(d.path);
          if (
            steps.includes(s) &&
            (!target || steps.indexOf(s) < steps.indexOf(target))
          )
            target = s;
        });
        if (target) setStep(target);
        setBanner(
          "Some answers need correcting. Please fix the highlighted fields and continue.",
        );
      } else if (e instanceof ApiError && e.status === 429) {
        setBanner(
          "Too many attempts from this network. Please wait a few minutes and try again.",
        );
      } else {
        setBanner(e.message || "Something went wrong. Please try again.");
      }
    } finally {
      setSubmitting(false);
    }
  }

  const stepEl = {
    main: <MainStep />,
    spouse: <SpouseStep />,
    children: <ChildrenStep />,
    review: <ReviewStep onEdit={setStep} />,
  }[step];

  return (
    <>
      <a className="skip" href="#main">
        Skip to main content
      </a>
      <header className="top">
        <div className="shell">
          <p className="brand">KA Community Census</p>
        </div>
      </header>

      <main id="main" className="shell" tabIndex={-1}>
        {phase === "landing" && <Landing onStart={() => setPhase("form")} />}

        {phase === "form" && (
          <FormProvider {...methods}>
            <Progress steps={steps} current={step} />
            <form
              noValidate
              onSubmit={(e) => {
                e.preventDefault();
                if (submitting) return;
                if (step === "review") submit();
                else next();
              }}
            >
              {/* Honeypot: invisible to people, tempting to bots */}
              <div className="hp" aria-hidden="true">
                <label>
                  Website
                  <input
                    type="text"
                    tabIndex={-1}
                    autoComplete="off"
                    {...methods.register("website")}
                  />
                </label>
              </div>

              <div className="card">{stepEl}</div>

              {banner ? (
                <div className="banner" role="alert">
                  {banner}
                </div>
              ) : null}

              <div className="actions">
                {idx > 0 ? (
                  <button
                    type="button"
                    className="btn secondary"
                    onClick={back}
                    disabled={submitting}
                  >
                    Back
                  </button>
                ) : (
                  <span />
                )}
                <button
                  type="submit"
                  className="btn primary"
                  disabled={submitting}
                >
                  {step === "review"
                    ? submitting
                      ? "Submitting…"
                      : "Submit census"
                    : "Next"}
                </button>
              </div>
            </form>
          </FormProvider>
        )}

        {phase === "done" && <Success reference={reference} />}
      </main>

      <footer className="shell foot">
        <p>
          {RETENTION_NOTE} Access or withdrawal requests:{" "}
          <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.
        </p>
      </footer>
    </>
  );
}
