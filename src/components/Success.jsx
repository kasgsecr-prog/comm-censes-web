import StepHeading from "./StepHeading.jsx";
import { CONTACT_EMAIL } from "../config.js";

export default function Success({ reference }) {
  return (
    <div className="card" role="status">
      <StepHeading>Thank you!</StepHeading>
      <p>Your KA Community Census response has been successfully submitted</p>
      <p>
        We may contact you if any clarification or additional information is
        required regarding your submission.
      </p>
      <p>
        We also strongly encourage you to share this KA Community Census with
        other KNR families living in Singapore so that we can maintain a
        comprehensive and up-to-date community database.
      </p>
      <p>
        Your participation and support are greatly appreciated as we work
        together to strengthen our community connections.
      </p>
      <StepHeading>Thank you for your cooperation and support</StepHeading>
      <p>KA Community Census Team</p>
    </div>
  );
}
