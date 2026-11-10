import { Controller, useFormContext, useWatch } from "react-hook-form";
import { Field } from "./Field.jsx";
import { AdultFields } from "./MainStep.jsx";
import StepHeading from "./StepHeading.jsx";
import { MAX_CHILDREN } from "../shared/schema.js";

export default function SpouseStep() {
  const { control } = useFormContext();
  const fromKoothanallur = useWatch({
    control,
    name: "spouse.isFromKoothanallur",
  });

  return (
    <>
      <StepHeading>Spouse details</StepHeading>
      <div className="grid">
        <AdultFields prefix="spouse" auto={false} />
      </div>

      <Controller
        name="spouse.isFromKoothanallur"
        control={control}
        render={({ field, fieldState }) => (
          <fieldset aria-describedby={fieldState.error ? "koo-err" : undefined}>
            <legend>
              Is the spouse from Koothanallur?{" "}
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
              <p id="koo-err" className="error" role="alert">
                {fieldState.error.message}
              </p>
            ) : null}
          </fieldset>
        )}
      />

      <div className="grid">
        {fromKoothanallur === false ? (
          <Field
            name="spouse.nativePlace"
            label="Native place"
            hint="Town or village"
            autoComplete="off"
            maxLength={100}
          />
        ) : null}
        <Field
          as="select"
          name="spouse.numberOfChildren"
          label="Number of children"
          hint="If 0, you will go straight to the final page."
        >
          <option value="">Select…</option>
          {Array.from({ length: MAX_CHILDREN + 1 }, (_, i) => (
            <option key={i} value={i}>
              {i}
            </option>
          ))}
        </Field>
      </div>
    </>
  );
}
