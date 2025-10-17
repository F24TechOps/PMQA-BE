import express, { json } from "express";
import "dotenv/config";
import Queue from "./queue/queue";
import getRunState from "./firebase/runsState";

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

app.get("/api/qa/runs/:id/state", async (req, res) => {
  const { runId } = req.params
  const data = await getRunState(runId)
  //Returns state of specified run
  res.json(data)
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
