import { useEffect } from "react";
import { useFieldArray, useFormContext, useWatch } from "react-hook-form";
import { Field } from "./Field.jsx";
import { GenderSelect } from "./MainStep.jsx";
import StepHeading from "./StepHeading.jsx";
import { isAdultYear } from "../form.js";
import { MARITAL_STATUSES } from "../shared/schema.js";

const cap = (s) => s.charAt(0) + s.slice(1).toLowerCase();

function ChildRow({ index }) {
  const { control, setValue, clearErrors } = useFormContext();
  const p = `children.${index}`;
  const yob = useWatch({ control, name: `${p}.yearOfBirth` });
  const adult = isAdultYear(yob);

  // Under 18 (or year not yet valid): these fields are disabled and emptied (stored as NULL by the API).
  useEffect(() => {
    if (!adult) {
      setValue(`${p}.maritalStatus`, "");
      setValue(`${p}.mobile`, "");
      setValue(`${p}.email`, "");
      clearErrors([`${p}.maritalStatus`, `${p}.mobile`, `${p}.email`]);
    }
  }, [adult, p, setValue, clearErrors]);

  const hint = adult ? undefined : "Only for children aged 18 or over";
  return (
    <div
      className="child-row"
      role="group"
      aria-labelledby={`child-title-${index}`}
    >
      <h3 id={`child-title-${index}`} className="child-title">
        Child {index + 1}
      </h3>
      <Field
        name={`${p}.fullName`}
        label="Name"
        autoComplete="off"
        maxLength={100}
      />
      <Field
        name={`${p}.yearOfBirth`}
        label="Year of birth"
        inputMode="numeric"
        autoComplete="off"
        maxLength={4}
      />
      <GenderSelect name={`${p}.gender`} />
      <Field
        as="select"
        name={`${p}.maritalStatus`}
        label="Marital status"
        disabled={!adult}
        hint={hint}
      >
        <option value="">Select…</option>
        {MARITAL_STATUSES.map((m) => (
          <option key={m} value={m}>
            {cap(m)}
          </option>
        ))}
      </Field>
      <Field
        name={`${p}.mobile`}
        label="Mobile"
        type="tel"
        inputMode="tel"
        autoComplete="off"
        maxLength={16}
        disabled={!adult}
        hint={hint}
      />
      <Field
        name={`${p}.email`}
        label="Email"
        type="email"
        inputMode="email"
        autoComplete="off"
        autoCapitalize="none"
        spellCheck={false}
        maxLength={254}
        disabled={!adult}
        hint={hint}
      />
    </div>
  );
}

export default function ChildrenStep() {
  const { control } = useFormContext();
  const { fields } = useFieldArray({ control, name: "children" });

  return (
    <>
      <StepHeading>Children ({fields.length})</StepHeading>
      <p className="lead">
        Marital status, mobile and email are only needed for children aged 18 or
        over (current year minus year of birth).
      </p>
      <div className="children">
        <div className="child-head" aria-hidden="true">
          <span>Name</span>
          <span>Year of birth</span>
          <span>Gender</span>
          <span>Marital status</span>
          <span>Mobile</span>
          <span>Email</span>
        </div>
        {fields.map((f, i) => (
          <ChildRow key={f.id} index={i} />
        ))}
      </div>
    </>
  );
}
