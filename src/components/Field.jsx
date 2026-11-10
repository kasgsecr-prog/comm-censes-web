import { useId } from "react";
import { useFormContext } from "react-hook-form";

export const getError = (errors, name) =>
  name.split(".").reduce((o, k) => (o ? o[k] : undefined), errors);

/** Accessible label + hint + input/select + error, wired with aria attributes. */
export function Field({
  name,
  label,
  hint,
  as = "input",
  required = true,
  disabled = false,
  className = "",
  children,
  ...rest
}) {
  const {
    register,
    formState: { errors },
  } = useFormContext();
  const id = useId();
  const err = getError(errors, name);
  const hintId = hint ? `${id}-hint` : undefined;
  const errId = err ? `${id}-err` : undefined;

  const props = {
    id,
    disabled,
    "aria-invalid": err ? "true" : "false",
    "aria-required": required && !disabled ? "true" : undefined,
    "aria-describedby": [hintId, errId].filter(Boolean).join(" ") || undefined,
    ...register(name),
    ...rest,
  };

  return (
    <div className={`field ${className}`.trim()}>
      <label htmlFor={id}>
        {label}
        {required && !disabled ? (
          <span className="req" aria-hidden="true">
            {" "}
            *
          </span>
        ) : null}
      </label>
      {hint ? (
        <p id={hintId} className="hint">
          {hint}
        </p>
      ) : null}
      {as === "select" ? (
        <select {...props}>{children}</select>
      ) : (
        <input {...props} />
      )}
      {err ? (
        <p id={errId} className="error" role="alert">
          {err.message}
        </p>
      ) : null}
    </div>
  );
}
