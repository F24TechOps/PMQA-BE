import express, { json } from "express";
import "dotenv/config";
import Queue from "./queue/queue";

const app = express();
app.use(json());

app.get("/", (req, res) => {
  res.json({ status: "ok", APIKey: process.env.CYCLR_API_KEY });
});

app.get("/api/qa/runs/:id/queue", (req, res) => {
  const { id } = req.params;
  if (Queue.name) {
    const tasks = new Queue();
  }
  tasks.enqueue(id);
  res.json({ queued: true });
});

app.get("/api/qa/runs", (req, res) => {
  //get's historic runs from db
  res.json({ data: [] });
});


app.get("/api/qa/runs/:runId/result", (req, res) => {
  const { runId } = req.params;

  // getRunResult is example function- function does not exist yet.
  // const result = getRunResult(runId);
const results = {
  fields: {
    emailaddress: {
      status: "Correct",
      value: "glyn.hurll@thetrainingroom.com"
    },
    mobilephone: {
      status: "Missing",
      reason: "Not mapped in Cyclr"
    },
    birthdate: {
      status: "Missing",
      reason: "Not mapped in Cyclr"
    }
  },
  summary: {
    correct: 1,
    null: 0,
    missing: 2,
    warning: 0,
    extra: 0
  }
}


  if (!results) {
    return res.status(404).json({ error: "Run result not found" });
  }

  res.json({ results });
});

// app.post("/api/upload", (req, res) => {
//   res.json({ uploadId: "Jji2XpCSvHT0jyyOHtLc" });
// });

app.post("/api/qa/run", (req, res) => {
  const { expectedFields, actualOutput, transactionContext } = req.body;
  const { accountId, cycleId, transactionId } = transactionContext;

  //send expected fields to db

  //send run record to db (just an id or similar)

  //put run into queue
  res.send(`runID: ${runID}`);
});

const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});

export default server;
