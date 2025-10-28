import express, { json } from "express";
import cors from "cors";
import "dotenv/config";
import { getOrCreateQueue } from "./queue/queueRegister.js";
import Queue from "./queue/queue";
import getRunState from "./firebase/runsState";
import runProcessor from "./clients/processing/index.js";

const app = express();
app.use(cors());
app.use(json());

app.get("/", (req, res) => {
  res.json({ status: "ok", APIKey: process.env.CYCLR_API_KEY });
});

// Runs
app.get("/api/qa/runs/:id/state", async (req, res) => {
  const runId = req.params.id;
  const data = await getRunState(runId);
  //console.log("data in index", data)
  //Returns state of specified run
  return res.json(data);
});

app.post("/api/qa/run", (req, res) => {
  const { expectedFields, actualOutput, transactionContext } = req.body;
  const { accountId, cycleId, transactionId } = transactionContext;

  //send expected fields to db

  //send run record to db (just an id or similar)

  runProcessor(expectedFields, actualOutput, transactionContext);
  res.send(`runID: ${runID}`);
});

app.get("/api/qa/runs/:runId/result", (req, res) => {
  const { runId } = req.params;

  // getRunResult is example function- function does not exist yet.
  // const result = getRunResult(runId);
  const results = {
    fields: {
      emailaddress: {
        status: "Correct",
        value: "glyn.hurll@thetrainingroom.com",
      },
      mobilephone: {
        status: "Missing",
        reason: "Not mapped in Cyclr",
      },
      birthdate: {
        status: "Missing",
        reason: "Not mapped in Cyclr",
      },
    },
    summary: {
      correct: 1,
      null: 0,
      missing: 2,
      warning: 0,
      extra: 0,
    },
  };

  if (!results) {
    return res.status(404).json({ error: "Run result not found" });
  }

  res.json({ results });
});

// Uploads
app.post("/api/upload", (req, res) => {
  res.json({ uploadId: "Jji2XpCSvHT0jyyOHtLc" });
});

// Queue
app.get("/api/qa/queue", (req, res) => {
  const queue = getOrCreateQueue("runs");
  res.json({
    name: queue.name,
    size: queue.getSize(),
    items: queue.getQueue(),
  });
});

app.post("/api/qa/runs/:id/queue", (req, res) => {
  const { id } = req.params;

  try {
    const q = getOrCreateQueue("runs");

    const exists = q.items?.some((t) => t.id === id);
    if (!exists) q.enqueue({ id });

    res.json({ queued: !exists, queue: q.name, size: q.getSize() });
  } catch (e) {
    console.error("error adding run to queue", e);
  }
});

const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});

export default server;
