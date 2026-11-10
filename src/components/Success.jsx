import StepHeading from "./StepHeading.jsx";
import { CONTACT_EMAIL } from "../config.js";

export default function Success({ reference }) {
  return (
    <div className="card" role="status">
      <StepHeading>Thank you!</StepHeading>
      <p>Your census response has been submitted. Your reference number is:</p>
      <p className="reference">{reference}</p>
      <p>
        Please save this number. Quote it if you need to ask for access,
        correction or withdrawal of your data:{" "}
        <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>. You can now
        close this page.
      </p>
    </div>
  );
}
