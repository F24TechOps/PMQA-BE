import express, { json } from "express";
import "dotenv/config";
import Queue from "./queue/queue";
import getRunState from "./firebase/getsRunState";
import postRun from "./firebase/makeRun";
import postUpload from "./firebase/makeUpload";

const app = express();
app.use(json());

app.get("/", (req, res) => {
  res.json({ status: "ok", APIKey: process.env.CYCLR_API_KEY });
});

app.get("/api/qa/runs/:id/state", async (req, res) => {
  const runId  = req.params.id
  const data = await getRunState(runId)
  //console.log("data in index", data)
  //Returns state of specified run
  return res.json(data)
})

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

app.get("/api/qa/runs/:id/result", (req, res) => {
  const { id } = req.params;

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


app.post("/api/uploads", async (req, res) => {
  const { expectedFields } = req.body
  const uploadID = await postUpload(expectedFields)
  return res.send({ uploadID: uploadID });
});


app.post("/api/qa/runs", async (req, res) => {
  const { accountId, cycleId, transactionId } = req.body;
  const transactionContext = { accountId, cycleId, transactionId }
  //Send expected fields to db
  const runID = await postRun(transactionContext)
  return res.send({ runID: runID});
});

app.put("/api/qa/runs/:id", (req, res) => {
  const { id } = req.params;
  const { results } = req.body

  
  res.json({ data: [] });
});

const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});


export default server;
