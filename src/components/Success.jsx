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
        We also strongly encourage you to share this KA Community Census request
        with your married children and other KNR families living in Singapore.
        Your support helps us maintain a comprehensive, accurate, and up-to-date
        community database while strengthening connections within our growing
        community.
      </p>
      <p>
        Your participation and support are greatly appreciated as we work
        together to strengthen our community connections.
      </p>
      <legend>Thank you for your cooperation and support</legend>
      <p>KA Community Census Team</p>
    </div>
  );
}
