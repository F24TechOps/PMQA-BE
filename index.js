import express, { json } from 'express';

const app = express();
app.use(json());

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.post('/upload', (req, res) => {
  res.json({ uploadId: 'Jji2XpCSvHT0jyyOHtLc' })
})

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});

export default app;