require('dotenv').config();
const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

// Konfiguracja połączenia z bazą PostgreSQL
const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT
});

// Sprawdzenie połączenia z bazą
pool.connect()
    .then(() => console.log("✅ Połączono z bazą danych PostgreSQL"))
    .catch(err => console.error("❌ Błąd połączenia z bazą:", err));

// Endpoint testowy
app.get('/', (req, res) => {
    res.send('ParcelGO API działa! 🚀');
});

// Endpoint do pobierania przesyłek
app.get('/shipments', async (req, res) => {
    try {
        const result = await pool.query("SELECT * FROM shipments");
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Uruchomienie serwera
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server działa na porcie ${PORT}`));
