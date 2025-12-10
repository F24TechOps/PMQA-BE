import express, { json } from "express";
import cors from "cors";
import "dotenv/config";
import getRunById from "./firebase/getRunById.js";
import postRun from "./firebase/postRun.js";
import postUpload from "./firebase/postUpload.js";
import getRuns from "./firebase/getRuns.js";
import getUploadById from "./firebase/getUploadById.js";
import postResults from "./firebase/postResults.js";
import { getOrCreateQueue } from "./queue/queueRegister.js";
import runProcessor from "./clients/processing/index.js";
import getAccounts from "./clients/cyclr/accounts.js";
import getWorkflows from "./clients/cyclr/workflows.js";
import getTransactionByID from "./clients/cyclr/transactions.js";
import getResultsById from "./firebase/getResultsById.js";
import deleteRun from "./firebase/deleteRun.js";
import fs from "fs";

const app = express();
app.use(cors());
app.use(json());

let api;

fs.readFile("./apiSpec.json", (err, data) => {
  api = JSON.parse(data);
});

app.get("/", (req, res) => {
  res.json({ api });
});

//GET RUN BY ID
app.get("/api/qa/runs/:id", async (req, res) => {
  const runId = req.params.id;
  const data = await getRunById(runId);
  //Returns data of specified run
  return res.json(data);
});

//GET UPLOAD BY ID
app.get("/api/qa/upload/:id", async (req, res) => {
  const uploadId = req.params.id;
  const data = await getUploadById(uploadId);
  //Returns data of specified upload
  return res.json(data);
});

//Get Account
app.get("/api/qa/accounts", async (req, res) => {
  try {
    const data = await getAccounts();
    return res.json(data);
  } catch (err) {
    return res.status(500).json({ error: "Failed to fetch accounts" });
  }
});

//Get Workflow
app.get("/api/qa/:accountId/cycles", async (req, res) => {
  const { accountId } = req.params;
  try {
    const data = await getWorkflows(accountId);
    return res.json(data);
  } catch (err) {
    return res.status(500).json({ error: "Failed to fetch cycles" });
  }
});

//Get Transactions By ID
app.get(
  "/api/qa/transactions/:accountId/:cycleId/:transactionId",
  async (req, res) => {
    const { accountId, cycleId, transactionId } = req.params;
    try {
      const data = await getTransactionByID(accountId, cycleId, transactionId);
      return res.json(data);
    } catch (err) {
      return res.status(500).json({ error: "Failed to fetch transaction" });
    }
  }
);

//GET ALL RUNS
app.get("/api/qa/runs", async (req, res) => {
  const data = await getRuns();
  return res.json({ data: data });
});

//Get run result
app.get("/api/qa/runs/:runId/result/:resultId", async (req, res) => {
  const { runId, resultId } = req.params;

  const results = await getResultsById(runId, resultId);

  if (!results) {
    return res.status(404).json({ error: "Run result not found" });
  }

  res.json({ results: results });
});

//POST UPLOAD
app.post("/api/qa/uploads", async (req, res) => {
  const expectedFields = req.body;
  const uploadID = await postUpload(expectedFields);
  return res.send({ uploadID: uploadID });
});

//POST RUN
app.post("/api/qa/runs", async (req, res) => {
  const { expectedFields, actualOutput, transactionContext, uploadId } =
    req.body;

  const runId = await postRun(transactionContext, uploadId);

  const resultData = await runProcessor(
    expectedFields,
    actualOutput,
    transactionContext
  );

  const resultId = await postResults(runId, resultData);

  return res.send({ runId: runId, resultId: resultId });
});

app.delete("/api/qa/run/:runId", async (req, res) => {
  const { runId } = req.params;
  try {
    await deleteRun(runId);
  } catch (err) {
    console.error("The run was unable to be deleted: ", err);
  }
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
