import express from "express";
import cors from "cors";
import CheckrRoute from "./routes/checkr.ts";

const app = express();
const port = 8080;

app.use(cors());

app.get("/", (_req, res) => {
  res.json({ ok: true, uptime: process.uptime() });
});

app.use("/v1/checkr", CheckrRoute);

app.listen(port, () => {
  console.log(`Listening on port ${port.toString()}`);
});

