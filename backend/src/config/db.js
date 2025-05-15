const mysql = require('mysql2/promise');

const db = mysql.createPool({
  host: 'localhost',            // ou 127.0.0.1
  user: 'root',                 // par défaut avec XAMPP
  password: '',                 // vide par défaut (ou 'root' si tu l’as modifié)
  database: 'plateforme_gestion_de_stage'             // 💡 ici tu mets le nom exact de ta base
});

module.exports = db;
