const express = require('express');
const https = require('https');
const app = express();
const PORT = process.env.PORT || 3000;
const API_TOKEN = '42525aa12c0d4f478c1627432b66b0d0';

app.get('/api/football/:league', (req, res) => {
  const league = req.params.league;
  const url = `https://api.football-data.org/v4/competitions/${league}/matches?status=SCHEDULED,TIMED,POSTPONED`;
  
  const options = {
    headers: { 'X-Auth-Token': API_TOKEN }
  };

  https.get(url, options, (apiRes) => {
    let data = '';

    apiRes.on('data', (chunk) => {
      data += chunk;
    });

    apiRes.on('end', () => {
      res.set('Access-Control-Allow-Origin', '*');
      res.set('Content-Type', 'application/json');
      res.send(data);
    });
  }).on('error', (err) => {
    console.error('API Error:', err);
    res.status(500).json({ error: 'API request failed' });
  });
});

app.get('/', (req, res) => {
  res.json({ 
    status: 'Football Proxy Server is running', 
    endpoints: ['/api/football/PL', '/api/football/BL1', '/api/football/PD', '/api/football/SA', '/api/football/FL1'] 
  });
});

app.listen(PORT, () => console.log(`Proxy running on port ${PORT}`));
