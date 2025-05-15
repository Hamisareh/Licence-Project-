const db = require('../config/db');

const Favori = {
  getFavorisByEtudiant: async (etudiantId) => {
    const [rows] = await db.query(`
      SELECT 
        os.id_offre, os.titre, os.domaine, os.duree,
        os.date_debut, os.date_fin, os.missions,
        u.nom AS entreprise_nom
      FROM offrestage os
      JOIN favoris f ON os.id_offre = f.offre_fav
      JOIN Utilisateur u ON os.entr = u.id
      WHERE f.etudiant = ?`,
      [etudiantId]
    );
    return rows;
  },

  checkFavoriExists: async (etudiantId, offreId) => {
    const [rows] = await db.query(
      `SELECT 1 FROM favoris 
       WHERE etudiant = ? AND offre_fav = ?`,
      [etudiantId, offreId]
    );
    return rows.length > 0;
  },

  addFavori: async (etudiantId, offreId) => {
    await db.query(
      `INSERT INTO favoris (etudiant, offre_fav)
       VALUES (?, ?)`,
      [etudiantId, offreId]
    );
  },

  removeFavori: async (etudiantId, offreId) => {
    await db.query(
      `DELETE FROM favoris 
       WHERE etudiant = ? AND offre_fav = ?`,
      [etudiantId, offreId]
    );
  }
};

module.exports = Favori;