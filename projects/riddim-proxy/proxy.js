import express from 'express';
import fetch from 'node-fetch';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json());

app.post('/riddim', async (req, res) => {
  const { query, url } = req.body;
  console.log(`Received request: ${query ? 'query=' + query : 'url=' + url}`);

  try {
    if (url) {
        // Handle detail page fetch
        const response = await fetch(url, {
            headers: { 'User-Agent': 'Mozilla/5.0' }
        });
        if (!response.ok) {
            console.error(`Detail fetch failed: ${response.status} ${response.statusText}`);
            throw new Error(`Detail fetch failed: ${response.status}`);
        }
        const html = await response.text();
        res.json({ html });
    } else if (query) {
        // Handle search
        const fetchWithUA = (url: string) => fetch(url, {
          headers: { 'User-Agent': 'Mozilla/5.0' }
        }).then(r => {
            if (!r.ok) throw new Error(`Upstream fetch failed: ${r.status}`);
            return r.text();
        });

        const yt = await fetchWithUA(`https://www.youtube.com/results?search_query=${encodeURIComponent(query + " riddim")}`);
        const rg = await fetchWithUA(`https://www.riddimguide.com/tunes?q=${encodeURIComponent(query)}&c=`);
        const rid = await fetchWithUA(`https://www.riddim-id.org/search?q=${encodeURIComponent(query)}`);

        res.json({
          youtube: yt,
          riddimGuide: rg,
          riddimId: rid
        });
    } else {
        res.status(400).json({ error: 'Missing query or url' });
    }

  } catch (err) {
    console.error('Proxy Error:', err);
    res.status(500).json({ error: err.message });
  }
});

app.listen(process.env.PORT || 3000, () => {
  console.log('Proxy running');
});
