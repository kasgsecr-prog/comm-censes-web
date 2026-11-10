import StepHeading from "./StepHeading.jsx";
import { PDPA_NOTICE, RETENTION_NOTE, CONTACT_EMAIL } from "../config.js";

export default function Landing({ onStart }) {
  return (
    <div className="card">
      <StepHeading>KA Community Census: KNR families in Singapore</StepHeading>
      <section className="notice" aria-labelledby="pdpa-h">
        <h3 id="pdpa-h">Personal Data Protection notice</h3>
        <p>{PDPA_NOTICE}</p>
      </section>
      <ul className="plain">
        <li>
          It takes about 5 minutes. Please have your family's details ready.
        </li>
        <li>{RETENTION_NOTE}</li>
        <li>
          To ask for access to, correction of, or withdrawal of your data, email{" "}
          <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a> with your
          reference number.
        </li>
      </ul>
      <div className="actions single">
        <button type="button" className="btn primary" onClick={onStart}>
          Start
        </button>
      </div>
    </div>
  );
}
