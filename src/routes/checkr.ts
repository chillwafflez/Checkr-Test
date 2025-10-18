import express from "express";
import type { CheckrEvent, CheckrReport } from "../utils/checkr.ts";
import sendEmail from "../utils/send-email.js";
import { verifyCheckrSignature } from "../utils/verify-signature.js";

const router = express.Router();
const CHECKR_SECRET = process.env.CHECKR_KEY!;


const firstName = "yippee";
const lastName = "bruh";
const email = "skibidiyuh@gmail.com"

router.get("/", async(req, res) => {
  console.log("base / in checkr routes called");
  res.json({ "bruh": "yippee" });
})

// called by Checkr when a report has been updated to complete
router.post("/webhook",
  express.raw({ type: "application/json" }),  // app.use(express.json()) parses all incoming JSON, but for verification we want the raw bytes
  async (req, res) => {

  console.log("CHECKR WEBHOOK CALLED");
  try {
    // verify signature
    const signature = req.header("X-Checkr-Signature") || "";
    const verified = verifyCheckrSignature(CHECKR_SECRET, req.body as Buffer, signature)
    if (!verified) throw new Error("Checkr signature doesn't match");

    console.log("SIGNATURE VERIFIED");
    console.log(req.body);

    // const event = req.body as CheckrEvent<CheckrReport>;
    // if (event.type === "report.created") {
    //   const candidateID = event.data.object.candidate_id;
    //   const reportID = event.data.object.id;
    //   console.log("report created for candidateID = " + candidateID);
    //   console.log("new report ID = " + reportID);

    // } else if (event.type === "report.completed") {
    //   const status = event.data.object.result === "clear" ? "success" : "error";
    //   const reportID = event.data.object.id;
    //   const candidateID = event.data.object.candidate_id;
    //   console.log("event id " + event.id)
    //   console.log("report id (the one that was completed) = " + reportID);
    //   console.log("report status = " + status);
    //   console.log("candidate id = " + candidateID);

    //   // await notifyUser(status);
    //   // await notifyAdmins(status);

    // } else {
    //   throw new Error(`Unhandled event type ${event.type}.`);
    // }

    // ALWAYS send back 200 status code regardless of success or failure
    res.sendStatus(200);
  } catch (err) {
    console.error("checkr webhook uh oh: ", err);
    res.sendStatus(200);
  }
});

export default router;

const notifyUser = async (status: "error" | "success") => {
  const subject = "Your Background Check Report is Complete";
  const statusText =
    status === "success" ? "cleared successfully" : "not cleared";
  const html = `
    <h1>Background Check Report Complete</h1>
    <p>Hello ${firstName ?? ""} ${lastName ?? ""},</p>
    <p>Your background check report has been completed and has ${statusText}.</p>
    <p>Status: <strong>${status}</strong></p>
    <p>If you have any questions about your report, please contact our support team.</p>
  `;

  await sendEmail(email, subject, html);
};

const notifyAdmins = async (status: "error" | "success") => {
  const name = `${firstName ?? ""} ${lastName ?? ""}`;
  const to = process.env.FEEDBACK_EMAILS ? process.env.FEEDBACK_EMAILS.split(",").map(email => email.trim()) : [];

  const subject = `Background Check Report is Complete for ${name}`;
  const html = `
    <p>Background check for ${name} is complete.</p>
    <p>Status: <strong>${status}</strong></p>
  `;

  await sendEmail(to, subject, html);
};
