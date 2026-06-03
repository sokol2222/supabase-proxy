const http = require('http');

const SUPABASE_URL = 'https://wxawzuyxnydzbuklaald.supabase.co';
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY;

const requestListener = async (req, res) => {
  // 1. Настраиваем CORS для всех ответов
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, apikey, Authorization');

  // 2. Обрабатываем preflight-запрос (OPTIONS)
  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  // 3. Логируем входящий запрос для отладки
  console.log(`[${req.method}] Request received: ${req.url}`);

  // 4. Формируем целевой URL для Supabase
  const targetUrl = `${SUPABASE_URL}${req.url}`;
  console.log(`Proxying to: ${targetUrl}`);

  try {
    // 5. Выполняем запрос к Supabase
    const response = await fetch(targetUrl, {
      method: req.method,
      headers: {
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json',
      },
    });

    // 6. Получаем данные и отправляем их обратно клиенту
    const data = await response.json();
    console.log(`Response status: ${response.status}`);
    res.writeHead(response.status, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(data));

  } catch (error) {
    console.error('Proxy error:', error);
    res.writeHead(500, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Internal Proxy Error', details: error.message }));
  }
};

const server = http.createServer(requestListener);
const port = process.env.PORT || 3000;

server.listen(port, () => {
  console.log(`Supabase proxy is running successfully on port ${port}`);
});
