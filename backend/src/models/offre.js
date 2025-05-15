const db = require('../config/db');

const Offre = {
  getAllLight: async () => {
    const [rows] = await db.query(`
      SELECT 
        o.id_offre,
        o.titre,
        o.domaine,
        o.duree,
        u.nom AS entreprise_nom
      FROM offrestage o
      JOIN Utilisateur u ON o.entr = u.id
      ORDER BY o.date_debut DESC
    `);
    return rows;
  },

  getCompleteById: async (id) => {
    const [rows] = await db.query(`
      SELECT 
        o.*,
        u.nom AS entreprise_nom,
        u.email AS entreprise_email,
        e.tel AS entreprise_tel,
        e.secteur AS entreprise_secteur,
         e.adr AS entreprise_adr
      FROM offrestage o
      JOIN Utilisateur u ON o.entr = u.id
      LEFT JOIN Entreprise e ON u.id = e.id_entr
      WHERE o.id_offre = ?`,
      [id]
    );
    return rows[0] || null;
  }
};

module.exports = Offre;