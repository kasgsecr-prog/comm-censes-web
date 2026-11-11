import { useId } from "react";
import { useFormContext } from "react-hook-form";
import { getError } from "./Field.jsx";
import StepHeading from "./StepHeading.jsx";
import { CONSENT_ACCURACY, CONSENT_SHARE, CONTACT_EMAIL } from "../config.js";

const cap = (s) => (s ? s.charAt(0) + s.slice(1).toLowerCase() : "");
const Row = ({ k, v }) => (
  <>
    <dt>{k}</dt>
    <dd>{v || "—"}</dd>
  </>
);

function Section({ title, note, onEdit, children }) {
  return (
    <section className="summary">
      <div className="summary-head">
        <h3>{title}</h3>
        <button type="button" className="link" onClick={onEdit}>
          Edit<span className="sr"> {title}</span>
        </button>
      </div>
      {note ? <p className="hint">{note}</p> : null}
      <dl>{children}</dl>
    </section>
  );
}

const adultRows = (p) => (
  <>
    <Row k="Full name" v={p.fullName} />
    <Row k="Family name" v={p.familyName} />
    <Row k="Father's name" v={p.fatherName} />
    <Row k="Mother's name" v={p.motherName} />
    <Row k="Year of birth" v={p.yearOfBirth} />
    <Row k="Gender" v={cap(p.gender)} />
    <Row k="Mobile" v={p.mobile} />
    <Row k="Email" v={p.email} />
  </>
);

function Check({ name, children }) {
  const {
    register,
    formState: { errors },
  } = useFormContext();
  const id = useId();
  const err = getError(errors, name);
  return (
    <div className="field">
      <label className="choice check" htmlFor={id}>
        <input
          id={id}
          type="checkbox"
          {...register(name)}
          aria-required="true"
          aria-invalid={err ? "true" : "false"}
          aria-describedby={err ? `${id}-err` : undefined}
        />
        <span>{children}</span>
      </label>
      {err ? (
        <p id={`${id}-err`} className="error" role="alert">
          {err.message}
        </p>
      ) : null}
    </div>
  );
}

export default function ReviewStep({ onEdit }) {
  const { getValues } = useFormContext();
  const v = getValues();
  const married = v.main.maritalStatus === "MARRIED";
  const kids = married ? Number(v.spouse.numberOfChildren) || 0 : 0;

  return (
    <>
      <StepHeading>Review and submit</StepHeading>
      <p className="lead">
        Please check your answers. Use Edit to change anything.
      </p>

      <Section
        title="Main member"
        onEdit={() => onEdit("main")}
        note="Your name, address and contact details are the only details shared with KA members (wedding invitations only)."
      >
        {adultRows(v.main)}
        <Row k="Marital status" v={cap(v.main.maritalStatus)} />
        <Row
          k="Address"
          v={`Blk ${v.address.block}, ${v.address.street}, ${v.address.unitNo}, Singapore ${v.address.postalCode}`}
        />
      </Section>

      {married ? (
        <Section title="Spouse" onEdit={() => onEdit("spouse")}>
          {adultRows(v.spouse)}
          <Row
            k="From Koothanallur"
            v={v.spouse.isFromKoothanallur ? "Yes" : "No"}
          />
          {v.spouse.isFromKoothanallur === false ? (
            <Row k="Native place" v={v.spouse.nativePlace} />
          ) : null}
          <Row k="Number of children" v={String(kids)} />
        </Section>
      ) : null}

      {kids > 0
        ? v.children.slice(0, kids).map((c, i) => (
            <Section
              key={i}
              title={`Child ${i + 1}`}
              onEdit={() => onEdit("children")}
            >
              <Row k="Name" v={c.fullName} />
              <Row k="Year of birth" v={c.yearOfBirth} />
              <Row k="Gender" v={cap(c.gender)} />
              {c.maritalStatus ? (
                <Row k="Marital status" v={cap(c.maritalStatus)} />
              ) : null}
              {c.mobile ? <Row k="Mobile" v={c.mobile} /> : null}
              {c.email ? <Row k="Email" v={c.email} /> : null}
            </Section>
          ))
        : null}

      <fieldset>
        <legend>Confirmation and consent</legend>
        <Check name="consent.accuracyConfirmed">{CONSENT_ACCURACY}</Check>
        <Check name="consent.shareConsent">{CONSENT_SHARE}</Check>
        <p className="hint">
          You can withdraw consent at any time by emailing{" "}
          <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a> with your
          reference number.
        </p>
      </fieldset>
    </>
  );
}
