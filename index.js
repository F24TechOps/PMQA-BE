import express, { json } from "express";
import "dotenv/config";
import Queue from "./queue/queue";
import getRunById from "./firebase/getRunById";
import postRun from "./firebase/postRun";
import postUpload from "./firebase/postUpload";
import getRuns from "./firebase/getRuns";
import getUploadById from "./firebase/getUploadById";
import postResults from "./firebase/postResults";

const app = express();
app.use(json());

app.get("/", (req, res) => {
  res.json({ status: "ok", APIKey: process.env.CYCLR_API_KEY });
});

//GET RUN BY ID
app.get("/api/qa/runs/:id", async (req, res) => {
  const runId  = req.params.id
  const data = await getRunById(runId)
  //Returns data of specified run
  return res.json(data)
})

//GET UPLOAD BY ID
app.get("/api/qa/runs/:id", async (req, res) => {
  const uploadId  = req.params.id
  const data = await getUploadById(uploadId)
  //Returns data of specified upload
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

//GET ALL RUNS
app.get("/api/qa/runs", async (req, res) => {
  const data = await getRuns()
  return res.json({data: data});
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

//POST UPLOAD
app.post("/api/uploads", async (req, res) => {
  const { expectedFields } = req.body
  const uploadID = await postUpload(expectedFields)
  return res.send({ uploadID: uploadID });
});

//POST RUN
app.post("/api/qa/runs", async (req, res) => {
  const { accountId, cycleId, transactionId } = req.body;
  const transactionContext = { accountId, cycleId, transactionId }
  //Send expected fields to db
  const runId = await postRun(transactionContext)
  return res.send({ runId: runId});
});

//POST RESULTS
app.get("/api/qa/runs/:id/results", async (req, res) => {
  const runId  = req.params.id
  const { resultData } = req.body
  const resultId = await postResults(runId, resultData)
  //Returns id of posted results
  return res.send({resultId : resultId})
})


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
