import express, { json } from 'express';

const app = express();
app.use(json());

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Testing

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});

export default app;