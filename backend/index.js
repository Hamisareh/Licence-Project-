console.log("Début du serveur...");

const express = require('express');
const cors = require('cors');
const app = express();
const routes = require('./src/routes/auth');
require('dotenv').config();

console.log("Express chargé...");

const PORT = process.env.PORT || 5000;

// ✅ CORS configuré pour accepter frontend web + mobile (via IP + ngrok)
const corsOptions = {
  origin: [
    'http://localhost:5173',                 // React en local
    'http://192.168.246.20:5173',            // React sur réseau local
    'https://9c6e-105-235-128-197.ngrok-free.app', // ton frontend via ngrok si tu l'utilises
    'http://localhost:19006',                // Expo mobile (optionnel)
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());

// Routes d'authentification
app.use('/api/auth', routes);

app.listen(PORT, () => {
  console.log(`✅ Serveur Express démarré sur le port ${PORT}`);
});

module.exports = app;



