import express from 'express';
import fetch from 'node-fetch';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json());

app.post('/riddim', async (req, res) => {
  const { query, url } = req.body;

  try {
    if (url) {
        // Handle detail page fetch
        const response = await fetch(url, {
            headers: { 'User-Agent': 'Mozilla/5.0' }
        }).then(r => r.text());
        res.json({ html: response });
    } else if (query) {
        // Handle search
        const yt = await fetch(`https://www.youtube.com/results?search_query=${encodeURIComponent(query + " riddim")}`, {
          headers: { 'User-Agent': 'Mozilla/5.0' }
        }).then(r => r.text());

        const rg = await fetch(`https://www.riddimguide.com/tunes?q=${encodeURIComponent(query)}&c=`, {
          headers: { 'User-Agent': 'Mozilla/5.0' }
        }).then(r => r.text());

        const rid = await fetch(`https://www.riddim-id.org/search?q=${encodeURIComponent(query)}`, {
          headers: { 'User-Agent': 'Mozilla/5.0' }
        }).then(r => r.text());

        res.json({
          youtube: yt,
          riddimGuide: rg,
          riddimId: rid
        });
    } else {
        res.status(400).json({ error: 'Missing query or url' });
    }

  } catch (err) {
    res.json({ error: err.message });
  }
});

app.listen(process.env.PORT || 3000, () => {
  console.log('Proxy running');
});
