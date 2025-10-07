import express, { json } from "express";
import "dotenv/config";

const app = express();
app.use(json());

const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.json({ status: "ok", APIKey: process.env.CYCLR_API_KEY });
});

app.get("/api/qa/runs/:id/queue", () => {
  //Using redis/Bull to queue tasks
  res.json({ queued: true });
});


app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});

export default app;
