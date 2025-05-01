console.log("Début du serveur...");

const express = require('express');
const cors = require('cors');
const app = express();
console.log("Express chargé...");

// Si tu utilises dotenv pour charger les variables d'environnement
require('dotenv').config();

// Définir la variable PORT avec un port par défaut si ce n'est pas défini dans le fichier .env
const PORT = process.env.PORT || 5000; // Si PORT n'est pas dans .env, il prendra 5000 comme valeur par défaut.

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const authRoutes = require('./src/routes/auth');
app.use('/auth', authRoutes);

app.get('/', (req, res) => {
  res.send('API fonctionne ✅');
});

app.listen(PORT, () => {
  console.log(`✅ Serveur démarré sur le port ${PORT}`);
});

module.exports = app;
