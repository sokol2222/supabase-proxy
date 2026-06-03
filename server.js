const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const SUPABASE_URL = 'https://wxawzuyxnydzbuklaald.supabase.co';
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY;

// Прокси для всех запросов
app.all('*', async (req, res) => {
  try {
    const path = req.originalUrl;
    console.log(`Proxying: ${req.method} ${path}`);
    
    // Формируем URL к Supabase
    const targetUrl = `${SUPABASE_URL}${path}`;
    
    const options = {
      method: req.method,
      headers: {
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json',
      },
    };
    
    if (req.method !== 'GET' && req.method !== 'DELETE') {
      options.body = JSON.stringify(req.body);
    }
    
    const response = await fetch(targetUrl, options);
    const data = await response.json();
    
    console.log(`Response status: ${response.status}`);
    
    res.status(response.status).json(data);
  } catch (error) {
    console.error('Proxy error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Корневой маршрут для проверки
app.get('/', (req, res) => {
  res.json({ status: 'Proxy is running', supabase: SUPABASE_URL });
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`✅ Supabase proxy running on port ${port}`);
});
