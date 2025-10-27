import express, { json } from "express";
import cors from 'cors'
import "dotenv/config";
import { getOrCreateQueue } from "./queue/queueRegister.js";

const app = express();
app.use(cors())
app.use(json());

app.get("/", (req, res) => {
  res.json({ status: "ok", APIKey: process.env.CYCLR_API_KEY });
});


// Runs
app.get("/api/qa/runs", (req, res) => {
  //get's historic runs from db
  res.json({ data: [] });
});

app.post("/api/qa/run", (req, res) => {
  const { expectedFields, actualOutput, transactionContext } = req.body;
  const { accountId, cycleId, transactionId } = transactionContext;

  //send expected fields to db

  //send run record to db (just an id or similar)

  //put run into queue
  res.send(`runID: ${runID}`);
});


// Uploads
app.post("/api/upload", (req, res) => {
  res.json({ uploadId: "Jji2XpCSvHT0jyyOHtLc" });
});

// Queue
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

app.get("/api/qa/queue", (req, res) => {
  const queue = getOrCreateQueue("runs");
  res.json({ name: queue.name, size: queue.getSize(), items: queue.getQueue() });
});

const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});

export default server;
