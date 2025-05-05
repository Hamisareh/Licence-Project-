const db = require('../config/db');

const Favori = {
  getFavorisByEtudiant: (etudiantId, callback) => {
    const sql = 'SELECT offre_fav FROM favoris WHERE etudiant = ?';
    db.query(sql, [etudiantId], callback);
  },

  addFavori: (etudiantId, offreId, callback) => {
    const sql = 'INSERT INTO favoris (etudiant, offre_fav) VALUES (?, ?)';
    db.query(sql, [etudiantId, offreId], callback);
  },

  removeFavori: (etudiantId, offreId, callback) => {
    const sql = 'DELETE FROM favoris WHERE etudiant = ? AND offre_fav = ?';
    db.query(sql, [etudiantId, offreId], callback);
  }
};

module.exports = Favori;
