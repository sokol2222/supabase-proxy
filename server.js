const http = require('http');

const SUPABASE_URL = 'https://wxawzuyxnydzbuklaald.supabase.co';
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY;

const server = http.createServer(async (req, res) => {
  console.log(`📥 ${req.method} ${req.url}`);
  
  res.setHeader('Access-Control-Allow-Origin', '*');
  
  // Быстрый ответ для проверки, что сервер жив
  if (req.url === '/ping') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ pong: true, time: new Date().toISOString() }));
    return;
  }
  
  try {
    const targetUrl = `${SUPABASE_URL}${req.url}`;
    console.log(`➡️ Proxying to: ${targetUrl}`);
    
    const response = await fetch(targetUrl, {
      headers: {
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
      },
    });
    
    const data = await response.json();
    console.log(`⬅️ Response: ${response.status}`);
    
    res.writeHead(response.status, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(data));
  } catch (err) {
    console.error(`❌ Error: ${err.message}`);
    res.writeHead(500, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: err.message }));
  }
});

const port = process.env.PORT || 3000;
server.listen(port, () => {
  console.log(`🚀 Proxy running on port ${port}`);
  console.log(`📡 Supabase URL: ${SUPABASE_URL}`);
  console.log(`🔑 ANON_KEY: ${SUPABASE_ANON_KEY ? '✅ set' : '❌ MISSING'}`);
});
