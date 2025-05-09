console.log("Début du serveur...");

const express = require('express');
const cors = require('cors');
const app = express();
const routes = require('./src/routes/auth');


console.log("Express chargé...");

// Si tu utilises dotenv pour charger les variables d'environnement
require('dotenv').config();

// Définir la variable PORT avec un port par défaut si ce n'est pas défini dans le fichier .env
const PORT = process.env.PORT || 5000; // Si PORT n'est pas dans .env, il prendra 5000 comme valeur par défaut.

app.use(cors());
app.use(express.json());
app.use(cors());
app.use(express.json());
app.use('/api/auth', routes); // toutes les routes commenceront par /api




app.use(cors({
  origin: 'http://192.168.246.20:5000', 
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'], // Assure-toi que l'en-tête 'Authorization' est autorisé
}));

app.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT}`);
});

module.exports = app;