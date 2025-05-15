const db = require('../config/db');

const Evaluation = {
  getByStudent: async (studentId) => {
    const [rows] = await db.query(`
      SELECT 
        e.*,
        u.nom AS nom_entreprise, 
        off.titre AS titre_offre,
        u.email AS email_entreprise
      FROM Evaluation e
      JOIN Entreprise ent ON e.evaluateur = ent.id_entr
      JOIN Utilisateur u ON ent.id_entr = u.id 
      JOIN offrestage off ON e.id_offre = off.id_offre
      WHERE e.evalue = ?
      ORDER BY e.date_soumission DESC
    `, [studentId]);
    return rows;
  }
};

module.exports = Evaluation;