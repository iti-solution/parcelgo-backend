// index.js
const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { Pool } = require('pg');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Konfiguracja połączenia z bazą danych
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

// Sprawdzenie połączenia z bazą danych
pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('Błąd połączenia z bazą danych:', err);
  } else {
    console.log('Połączenie z bazą danych ustanowione:', res.rows[0]);
  }
});

// Podstawowa trasa
app.get('/', (req, res) => {
  res.json({ message: 'Witaj w API ParcelGO!' });
});

// Przykładowa trasa API
app.get('/api/status', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW()');
    res.json({
      status: 'online',
      timestamp: result.rows[0].now
    });
  } catch (error) {
    console.error('Błąd API:', error);
    res.status(500).json({ error: 'Błąd serwera' });
  }
});

// Uruchomienie serwera
app.listen(PORT, () => {
  console.log(`Serwer działa na porcie ${PORT}`);
});