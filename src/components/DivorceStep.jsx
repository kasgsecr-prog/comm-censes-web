import { useEffect } from "react";
import { Controller, useFormContext, useWatch } from "react-hook-form";
import { Field } from "./Field.jsx";
import StepHeading from "./StepHeading.jsx";
import { MAX_CHILDREN } from "../shared/schema.js";

export default function DivorceStep() {
  const { control, setValue, clearErrors } = useFormContext();
  const custody = useWatch({ control, name: "divorce.hasChildrenInCustody" });
  const count = useWatch({ control, name: "divorce.numberOfChildren" });

  // No custody -> count is 0. Yes -> the person must pick 1 or more (clear a leftover 0).
  useEffect(() => {
    if (custody === false && String(count) !== "0") {
      setValue("divorce.numberOfChildren", "0");
      clearErrors("divorce.numberOfChildren");
    } else if (custody === true && String(count) === "0") {
      setValue("divorce.numberOfChildren", "");
    }
  }, [custody, count, setValue, clearErrors]);

  return (
    <>
      <StepHeading>Children in your custody</StepHeading>

      <Controller
        name="divorce.hasChildrenInCustody"
        control={control}
        render={({ field, fieldState }) => (
          <fieldset
            aria-describedby={fieldState.error ? "cust-err" : undefined}
          >
            <legend>
              Do you have any children under your custody?{" "}
              <span className="req" aria-hidden="true">
                *
              </span>
            </legend>
            <div className="choices">
              {[
                [true, "Yes"],
                [false, "No"],
              ].map(([val, text]) => (
                <label key={text} className="choice">
                  <input
                    type="radio"
                    name={field.name}
                    checked={field.value === val}
                    onChange={() => field.onChange(val)}
                    onBlur={field.onBlur}
                    ref={val ? field.ref : undefined}
                    aria-required="true"
                  />
                  <span>{text}</span>
                </label>
              ))}
            </div>
            {fieldState.error ? (
              <p id="cust-err" className="error" role="alert">
                {fieldState.error.message}
              </p>
            ) : null}
          </fieldset>
        )}
      />

      {custody === true ? (
        <div className="grid">
          <Field
            as="select"
            name="divorce.numberOfChildren"
            label="Number of children under your custody"
            hint="You will fill in each child's details on the next page."
          >
            <option value="">Select…</option>
            {Array.from({ length: MAX_CHILDREN }, (_, i) => (
              <option key={i + 1} value={i + 1}>
                {i + 1}
              </option>
            ))}
          </Field>
        </div>
      ) : null}
    </>
  );
}
