import express, { json } from "express";
import "dotenv/config";
import Queue from "./queue/queue";

const app = express();
app.use(json());

app.get("/", (req, res) => {
  res.json({ status: "ok", APIKey: process.env.CYCLR_API_KEY });
});

app.get("/api/qa/runs/:id/state", async (req, res) => {
  const { runId } = req.params
  const data = await getRunState(runId)
  //Returns state of specified run
  res.json({
    updatedAt: "2001-03-11T10:47:54+00:00",
    createdAt: "2025-10-07T10:47:54+00:00",
    input: [{firstName: "Jackie", lastName: "Brown"}, {firstName: "Kibbles", lastName: "Pickle"}],
    state: "In Progress"
  })
})

app.get("/api/qa/runs/:id/state", async (req, res) => {
  const { runId } = req.params
  const data = await getRunState(runId)
  //Returns state of specified run
  res.json({
    updatedAt: "2001-03-11T10:47:54+00:00",
    createdAt: "2025-10-07T10:47:54+00:00",
    input: [{firstName: "Jackie", lastName: "Brown"}, {firstName: "Kibbles", lastName: "Pickle"}],
    state: "In Progress"
  })
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
