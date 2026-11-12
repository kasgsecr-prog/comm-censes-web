import { useId } from "react";
import { useFormContext } from "react-hook-form";
import { Field, getError } from "./Field.jsx";
import StepHeading from "./StepHeading.jsx";
import { GENDERS, MARITAL_STATUSES } from "../shared/schema.js";

const cap = (s) => s.charAt(0) + s.slice(1).toLowerCase();

/**
 * Gender as segmented radio buttons (used for main member, spouse and each child).
 * Real radio inputs: keyboard arrow keys, screen readers and autofill all work natively.
 * Layout (full-size card vs compact table cell) is handled in CSS only.
 */
export function GenderSelect({ name, label = "Gender" }) {
  const {
    register,
    formState: { errors },
  } = useFormContext();
  const id = useId();
  const err = getError(errors, name);
  const errId = err ? `${id}-err` : undefined;

  return (
    <fieldset className="field seg-field">
      <legend className="seg-legend">
        {label}
        <span className="req" aria-hidden="true">
          {" "}
          *
        </span>
      </legend>
      <div className="seg">
        {GENDERS.map((g) => (
          <label key={g} className="seg-opt">
            <input
              type="radio"
              value={g}
              aria-required="true"
              aria-invalid={err ? "true" : "false"}
              aria-describedby={errId}
              {...register(name)}
            />
            <span>{cap(g)}</span>
          </label>
        ))}
      </div>
      {err ? (
        <p id={errId} className="error" role="alert">
          {err.message}
        </p>
      ) : null}
    </fieldset>
  );
}

/** Shared by main member and spouse. `auto` enables browser autofill (main member only). */
export function AdultFields({ prefix, auto }) {
  const a = (token) => (auto ? token : "off");
  return (
    <>
      <Field
        name={`${prefix}.fullName`}
        label="Full name"
        autoComplete={a("name")}
        maxLength={100}
      />
      <Field
        name={`${prefix}.familyName`}
        label="Family name"
        autoComplete={a("family-name")}
        maxLength={100}
      />
      <Field
        name={`${prefix}.fatherName`}
        label="Father's name"
        autoComplete="off"
        maxLength={100}
      />
      <Field
        name={`${prefix}.motherName`}
        label="Mother's name"
        autoComplete="off"
        maxLength={100}
      />
      <Field
        name={`${prefix}.yearOfBirth`}
        label="Year of birth"
        hint="4 digits, e.g. 1985"
        inputMode="numeric"
        autoComplete={a("bday-year")}
        maxLength={4}
      />
      <GenderSelect name={`${prefix}.gender`} />
      <Field
        name={`${prefix}.mobile`}
        label="Mobile number"
        hint="Singapore number, e.g. 9123 4567"
        type="tel"
        inputMode="tel"
        autoComplete={a("tel")}
        maxLength={16}
      />
      <Field
        name={`${prefix}.email`}
        label="Email"
        type="email"
        inputMode="email"
        autoComplete={a("email")}
        autoCapitalize="none"
        spellCheck={false}
        maxLength={254}
      />
    </>
  );
}

export default function MainStep() {
  return (
    <>
      <StepHeading>Your details (main member)</StepHeading>
      <p className="lead">
        Fields marked{" "}
        <span className="req" aria-hidden="true">
          *
        </span>
        <span className="sr">with an asterisk</span> are required.
      </p>

      <fieldset>
        <legend>Personal details</legend>
        <div className="grid">
          <AdultFields prefix="main" auto />
          <Field
            as="select"
            name="main.maritalStatus"
            label="Marital status"
            className="full"
          >
            <option value="">Select…</option>
            {MARITAL_STATUSES.map((m) => (
              <option key={m} value={m}>
                {cap(m)}
              </option>
            ))}
          </Field>
        </div>
      </fieldset>

      <fieldset>
        <legend>Home address</legend>
        <div className="grid">
          <Field
            name="address.block"
            label="Block"
            hint="e.g. 123A"
            autoComplete="off"
            maxLength={10}
            autoCapitalize="characters"
          />
          <Field
            name="address.unitNo"
            label="Unit number"
            hint="e.g. #05-123"
            autoComplete="address-line2"
            maxLength={15}
          />
          <Field
            name="address.street"
            label="Street"
            className="full"
            autoComplete="address-line1"
            maxLength={100}
          />
          <Field
            name="address.postalCode"
            label="Postal code"
            hint="6 digits"
            inputMode="numeric"
            autoComplete="postal-code"
            maxLength={6}
          />
        </div>
      </fieldset>
    </>
  );
}
