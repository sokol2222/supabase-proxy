const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());

const SUPABASE_URL = 'https://wxawzuyxnydzbuklaald.supabase.co';
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY;

// Простой тестовый маршрут
app.get('/', (req, res) => {
  res.json({ message: 'Proxy is working!' });
});

// Прокси для всех запросов
app.use(async (req, res) => {
  try {
    const targetUrl = SUPABASE_URL + req.url;
    console.log('Proxying to:', targetUrl);
    
    const response = await fetch(targetUrl, {
      headers: {
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
      },
    });
    
    const data = await response.json();
    res.json(data);
  } catch (err) {
    console.error('Error:', err.message);
    res.status(500).json({ error: err.message });
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Proxy running on port ${port}`);
});
