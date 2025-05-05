const db = require('../config/db');

const Offre = {
    getAll: async () => {
      const [rows] = await db.query(`
        SELECT o.*, u.nom AS entreprise_nom
        FROM offrestage o
        JOIN Utilisateur u ON o.entr = u.id
      `);
  
      // On formate pour avoir une propriété "entreprise_nom"
      return rows.map(offre => ({
        ...offre,
        entreprise_nom: offre.entreprise_nom, // déjà présent, mais pour clarté
      }));
    },
  
    getById: async (id) => {
      const [rows] = await db.query(`
        SELECT o.*, u.nom AS entreprise_nom
        FROM offrestage o
        JOIN Utilisateur u ON o.entr = u.id
        WHERE o.id_offre = ?
      `, [id]);
  
      if (rows.length === 0) return null;
  
      return {
        ...rows[0],
        entreprise_nom: rows[0].entreprise_nom
      };
    },
  
  getFavorisByUserId: async (userId) => {
    const [rows] = await db.query(`
      SELECT o.*, u.nom AS entreprise_nom
      FROM offrestage o
      JOIN Favoris f ON o.id_offre = f.id_offre
      JOIN Utilisateur u ON o.id_utilisateur = u.id
      WHERE f.id_user = ?
    `, [userId]);

    return rows.map(offre => ({
      ...offre,
      entr: {
        nom: offre.entreprise_nom
      }
    }));
  },

  addFavori: async (userId, offreId) => {
    await db.query('INSERT IGNORE INTO Favoris (id_user, id_offre) VALUES (?, ?)', [userId, offreId]);
  },

  removeFavori: async (userId, offreId) => {
    await db.query('DELETE FROM Favoris WHERE id_user = ? AND id_offre = ?', [userId, offreId]);
  },
};

module.exports = Offre;
