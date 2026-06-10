import express from 'express';
import fetch from 'node-fetch';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json());

app.post('/riddim', async (req, res) => {
  const { query } = req.body;

  try {
    const yt = await fetch(`https://www.youtube.com/results?search_query=${encodeURIComponent(query + " riddim")}`, {
      headers: { 'User-Agent': 'Mozilla/5.0' }
    }).then(r => r.text());

    const rg = await fetch(`https://www.riddimguide.com/tunes?q=${encodeURIComponent(query)}&c=`, {
      headers: { 'User-Agent': 'Mozilla/5.0' }
    }).then(r => r.text());

    const rid = await fetch(`https://www.riddim-id.com/search?term=${encodeURIComponent(query)}`, {
      headers: { 'User-Agent': 'Mozilla/5.0' }
    }).then(r => r.text());

    res.json({
      youtube: yt,
      riddimGuide: rg,
      riddimId: rid
    });

  } catch (err) {
    res.json({ error: err.message });
  }
});

app.listen(process.env.PORT || 3000, () => {
  console.log('Proxy running');
});
