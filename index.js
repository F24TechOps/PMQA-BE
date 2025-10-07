import express, { json } from 'express';

const app = express();
app.use(json());

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.post('/api/qa/runs', (req, res) => {
const { uploadId, resultJSON, transactionID } = req.body;
res.send(`runID: ${runID}`);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});

export default app;