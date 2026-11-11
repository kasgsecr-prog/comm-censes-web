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
          It takes about 3 minutes to complete this form with your basic family
          details..
        </li>
        <li>{RETENTION_NOTE}</li>
        <li>
          To update your data, email{" "}
          <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a> with your new
          details.
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
