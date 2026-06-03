const http = require('http');

const SUPABASE_URL = 'https://wxawzuyxnydzbuklaald.supabase.co';
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY;
const PORT = process.env.PORT;

if (!PORT) {
  console.error('❌ PORT environment variable is not set!');
  process.exit(1);
}

const server = http.createServer(async (req, res) => {
  console.log(`📥 ${req.method} ${req.url}`);

  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, apikey, Authorization');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  if (req.url === '/ping') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ status: 'ok', message: 'Proxy is working!', time: new Date().toISOString() }));
    return;
  }

  if (req.url.startsWith('/rest/v1')) {
    try {
      const targetUrl = `${SUPABASE_URL}${req.url}`;
      console.log(`➡️ Proxying to: ${targetUrl}`);

      const response = await fetch(targetUrl, {
        method: req.method,
        headers: {
          'apikey': SUPABASE_ANON_KEY,
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      console.log(`⬅️ Response: ${response.status}`);

      res.writeHead(response.status, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(data));
      return;
    } catch (err) {
      console.error(`❌ Proxy Error: ${err.message}`);
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Proxy failed', details: err.message }));
      return;
    }
  }

  console.log(`⚠️ Route not found: ${req.url}`);
  res.writeHead(404, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ error: 'Not found' }));
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Supabase proxy is running on port ${PORT}`);
  console.log(`🔑 ANON_KEY is ${SUPABASE_ANON_KEY ? 'set' : 'MISSING'}`);
});
