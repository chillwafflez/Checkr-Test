import express from "express";
import cors from "cors";
// import CheckrRoute from "./routes/checkr.js";
import UserModel from "./models/user.js";
import sendEmail from "./utils/send-email.js";
import { CheckrEvent, CheckrInvitation, CheckrReport, createCandidate, createInvitation, verifyCheckrSignature } from "./utils/checkr.js";
import dotenv from "dotenv";
dotenv.config();


const app = express();
const port = process.env.PORT || 8080 

app.use(cors());

app.get("/", (_req, res) => {
  console.log("base / called");
  res.json({ hi: "skibidi" });
});

const notifyUser = async (user: UserModel, status: "error" | "success") => {
  const subject = "Background Check Update";
  const statusText =
    status === "success" ? "cleared successfully" : "not cleared";
  const html = `
  <div style="font-family: Arial, sans-serif; color: #333333; background-color: #f9f9f9; padding: 20px;">
    <div style="max-width: 600px; margin: auto; background: #ffffff; padding: 30px; border-radius: 8px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.05);">
      
      <h2 style="color: #1f2937; font-weight: 600; text-align: center; margin-bottom: 32px;">
        Your Background Check is Complete
      </h2>

      <p style="font-size: 16px; line-height: 1.6;">
        Dear Justin Nguyen,
      </p>

      <p style="font-size: 16px; line-height: 1.6;">
        Your background check report has been completed and has <strong>${statusText}</strong>. 
        ${status === "success" 
          ? "We will now continue with purchasing and activating your Scroll membership" : ""}
      </p>
    
      <p style="font-size: 16px; line-height: 1.6;">
        If you have any questions or wish to discuss your account status, 
        please contact our support team at 
        <a href="mailto:support@scroll.care" style="color: #1d4ed8; text-decoration: underline;">support@scroll.care</a>.
      </p>

      ${status === "success" ? `
        <p style="font-size: 16px; line-height: 1.6;">
          Thank you for being part of the Scroll community.
        </p>
      ` : ""}

      <p style="font-size: 16px; line-height: 1.6; margin-top: 24px;">
        Sincerely,<br>
        <strong>The Scroll Team</strong>
      </p>

      <hr style="margin: 40px 0; border: none; border-top: 1px solid #e5e7eb;">
    </div>
  </div>
  `;

  await sendEmail(user.email, subject, html);
};

const notifyAdmins = async (user: UserModel, status: "error" | "success") => {
  const name = `${user.first_name ?? ""} ${user.last_name ?? ""}`;

  const to = process.env.FEEDBACK_EMAILS ? process.env.FEEDBACK_EMAILS.split(",").map(email => email.trim()) : [];

  const subject = `Background Check Report is Complete for ${name}`;
  const html = `
  <div style="font-family: Arial, sans-serif; color: #333333; background-color: #f9f9f9; padding: 20px;">
    <div style="max-width: 600px; margin: auto; background: #ffffff; padding: 30px; border-radius: 8px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.05);">
      
      <h2 style="color: #1f2937; font-weight: 600; text-align: center; margin-bottom: 32px;">
        Background Check for ${name} has Completed
      </h2>

      <p style="font-size: 16px; line-height: 1.6;">
        Background Check Status: <strong>${status}</strong>
      </p>
    </div>
  </div>
  `;

  await sendEmail(to, subject, html);
};

// ------------ FOR TESTING ----------------- //
app.post("/create-test-candidate", async (req, res) => {
  const candidate = await createCandidate(
    "Yuta",
    "Zenin",
    "skibidiyuh1738@gmail.com",
    "California",
    "US"
  );

  const checkr_candidate_id = candidate.id;
  console.log("Created Checkr candidate's ID: " + checkr_candidate_id);
  res.json({ createdCandidate: checkr_candidate_id});
})


app.post("/create-test-invitation", async (req, res) => {
  try {
    const invitation = await createInvitation(
      process.env.BUD_RICHMAN_CANDIDATE_ID!,
      "essential",
      "New York",
      "US"
    );

    res.json(invitation);
  } catch (err) {
    console.error("Invitation failed:", err);
    res.status(400).json({ error: err instanceof Error ? err.message : err });
  }
})


// app.use("/v1/checkr", CheckrRoute);
app.post(
  "/v1/checkr/webhook",
  express.raw({ type: "application/json" }),
  async (req, res) => {
    const CHECKR_SECRET = process.env.CHECKR_KEY!;
    try {
      // verify signature
      const signature = req.header("X-Checkr-Signature") || "";
      const verified = verifyCheckrSignature(CHECKR_SECRET, req.body as Buffer, signature)
      if (!verified) throw new Error("Checkr signature doesn't match");
      res.sendStatus(200);

      console.log("WEBHOOK CALLED");

      
      const raw = req.body as Buffer;
      const event = JSON.parse(raw.toString("utf8")) as 
        | CheckrEvent<CheckrReport>
        | CheckrEvent<CheckrInvitation>;

      if (
        event.type === "invitation.created" ||
        event.type === "invitation.completed" ||
        event.type === "invitation.expired" ||
        event.type === "invitation.deleted"
      ) {
        const invitation = event.data.object as CheckrInvitation;
        const invitationID = invitation.id;
        const candidateID = invitation.candidate_id;

        console.log(
          `invitation webhook: ${event.type} (invitationID=${invitation.id}, candidateID=${candidateID})`
        );

        let status: string | null = null;
        if (event.type === "invitation.created") {
          console.log(`invitation created for candidateID = ${candidateID} | invitation ID = ${invitationID}`);
          status = "invitation_created";
        } else if (event.type === "invitation.completed") {
          console.log(`invitation completed for candidateID = ${candidateID}`);
          status = "invitation_completed";
        } else if (event.type === "invitation.expired") {
          console.log(`invitation expired for candidateID = ${candidateID}`);
          status = "invitation_expired";
        } else if (event.type === "invitation.deleted") {
          console.log(`invitation deleted for candidateID = ${candidateID}`);
          status = "invitation_deleted";
        }

        if (status) {
          // await db.query(
          //   "UPDATE users SET checkr_status = $1 WHERE checkr_candidate = $2",
          //   [status, candidateID]
          // );
        }

        return;
      }

      if (event.type === "report.created") {
        const report = event.data.object as CheckrReport;
        const candidateID = report.candidate_id;
        const reportID = report.id;
        console.log(`new report (reportID = ${reportID}) created for candidateID = ${candidateID}`)
      } else if (event.type === "report.completed") {
        const report = event.data.object as CheckrReport;
        const status = report.result === "clear" ? "success" : "error";
        const reportID = report.id;
        const candidateID = report.candidate_id;
        console.log(`report completed (id = ${reportID}) = candidateID = ${candidateID} | status = ${status}`);

        // await db.query(
        //   "UPDATE users SET checkr_status = $1 WHERE checkr_candidate = $2",
        //   [status, candidateID]
        // );

        // // notify user and admins
        // const result = await db.query<UserModel>(
        //   "SELECT email, first_name, last_name FROM users WHERE checkr_candidate = $1",
        //   [candidateID]
        // );
        // const [user] = result.rows;
        // if (!user) {
        //   throw new Error();
        // }

        // await notifyUser(user, status);
        // await notifyAdmins(user, status);
      } else {
        console.log(`Ignoring unhandled event type: ${event.type}`);
      }
    } catch (err) {
      console.error("checkr webhook uh oh: ", err);
      res.sendStatus(200);
    } 
  }
);
app.use(express.json());

// app.use("/v1/checkr", CheckrRoute);

app.listen(port, () => {
  console.log(`Listening on port ${port.toString()}`);
});

