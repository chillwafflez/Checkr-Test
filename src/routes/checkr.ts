import express from "express";
import type { CheckrEvent, CheckrReport } from "../utils/checkr.ts";
import sendEmail from "../utils/send-email.js";

const router = express.Router();

const firstName = "yippee";
const lastName = "bruh";
const email = "skibidiyuh@gmail.com"

router.get("/", async(req, res) => {
  res.json({ "bruh": "yippee" });
})

// called by Checkr when a report has been updated to complete
router.post("/webhook", async (req, res) => {
  const event = req.body as CheckrEvent<CheckrReport>;

  if (event.type === "report.completed") {
    const status = event.data.object.result === "clear" ? "success" : "error";
    const id = event.data.object.candidate_id;
    console.log("event id " + event.id)
    console.log("id of report that was completed = " + id);


    // await notifyUser(status);
    // await notifyAdmins(status);
  } else {
    throw new Error(`Unhandled event type ${event.type}.`);
  }

  res.send();
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
