console.log("Début du serveur...");

const express = require('express');
const cors = require('cors');
const path = require('path');
const app = express();
const routes = require('./src/routes/auth');
require('dotenv').config();

console.log("Express chargé...");

const PORT = process.env.PORT || 5000;

// ✅ CORS configuré pour accepter frontend web + mobile (via IP + ngrok)
const corsOptions = {
  origin: [
    'http://localhost:5173',                 // React en local
    'http://192.168.219.93:5173',            // React sur réseau local
    'https://eff8-105-235-130-105.ngrok-free.app', // ton frontend via ngrok si tu l'utilises
    'http://localhost:19006',                // Expo mobile (optionnel)
  ],
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  credentials: true,
};

app.use('/uploads', express.static(path.join(__dirname, 'tmp', 'uploads'), {
  setHeaders: (res, filePath) => {
    if (filePath.endsWith('.pdf')) {
      res.set('Content-Type', 'application/pdf');
      res.set('Content-Disposition', 'inline');
    }
  }
}));

app.use(cors(corsOptions));
app.use(express.json());

// Routes d'authentification
app.use('/api/auth', routes);

app.listen(PORT, () => {
  console.log(`✅ Serveur Express démarré sur le port ${PORT}`);
});

module.exports = app;



