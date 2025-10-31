import express, { json } from "express";
import cors from "cors";
import "dotenv/config";
import { getOrCreateQueue } from "./queue/queueRegister.js";
import Queue from "./queue/queue.js";
import getRunState from "./firebase/runsState.js";
import runProcessor from "./clients/processing/index.js";
import getAccounts from "./clients/cyclr/accounts.js";
import getWorkflows from "./clients/cyclr/workflows.js";
const app = express();
app.use(cors());
app.use(json());

app.get("/", (req, res) => {
  res.json({ status: "ok", APIKey: process.env.CYCLR_API_KEY });
});

//Get Account
app.get("/api/qa/accounts", async (req, res) => {
 try {
    const data = await getAccounts();
    //console.log("Fetched accounts:", data);
    return res.json(data);
  } catch (err) {
    //console.error("Error fetching accounts:", err.message);
    return res.status(500).json({ error: "Failed to fetch accounts" });
  }

    //Dummy Data
    /* 
   res.json([
    { Id: "1", Name: "Personal Checking" },
    { Id: "2", Name: "Joint Savings" }
  ]); */

});

//Get Workflow
app.get("/api/qa/:accountId/cycles", async (req, res) => {
  const { accountId } = req.params;
   try {
    const data = await getWorkflows(accountId); // accountId sent as header
    //console.log("Fetched workflows:", data);
    return res.json(data);
  } catch (err) {
    //console.error("Error fetching cycles/workflows:", err.message);
    return res.status(500).json({ error: "Failed to fetch cycles" });
  } 
 /*
   if (accountId === "1") {
    res.json([
      { Id: "cycle-1a", Name: "Monthly Bills" },
      { Id: "cycle-1b", Name: "Weekly Savings" }
    ]);
  } else if (accountId === "2") {
    res.json([{ Id: "cycle-2a", Name: "Investment Cycle" }]);
  } else {
    res.json([]);
  } */
});

//Get Transactions By ID
app.get("/api/qa/transactions/:accountId/:cycleId/:transactionId", async (req, res) => {
  const { accountId, cycleId, transactionId } = req.params;
   try {
    const data = await getTransactionByID(accountId, cycleId, transactionId); 
    return res.json(data);
  } catch (err) {
    //console.error("Error fetching transaction:", err.message);
    return res.status(500).json({ error: "Failed to fetch transaction" });
  } 

  //Dummy Data
 /* res.json({
    accountId,
    cycleId,
    transactionId,
    transaction: {
      StepId: "transaction-001",
      StepName: "Validate Email",
      StepType: "Validation",
      Timestamp: "2025-10-29T12:14:11.229Z",
      Request: "Some request data",
      Response: "Some response data",
      IncidentLevel: "Error",
      ShortMessage: "Test short message",
      FullMessage: "Test full message"
    }
  }); */
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
