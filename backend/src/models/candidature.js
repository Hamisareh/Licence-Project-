const db = require('../config/db');

const Candidature = {
  create: async ({ candidat, offre, cv }) => {
    const [result] = await db.query(
      `INSERT INTO Candidature (candidat, offre, date_cand, etat_cand, cv) 
       VALUES (?, ?, NOW(), 'en_attente', ?)`,
      [candidat, offre, cv]
    );
    return result;
  },

  exists: async (candidat, offre) => {
    const [rows] = await db.query(
      `SELECT 1 FROM Candidature WHERE candidat = ? AND offre = ? LIMIT 1`,
      [candidat, offre]
    );
    return rows.length > 0;
  },

  getActiveApplications: async (candidat) => {
    const [rows] = await db.query(
      `SELECT c.* 
       FROM Candidature c
       WHERE c.candidat = ? 
       AND (c.etat_cand = 'accepte' OR c.etat_sta = 'en cours')`,
      [candidat]
    );
    return rows;
  },

  getByOffre: async (offre) => {
    const [rows] = await db.query(
      `SELECT c.*, u.nom, u.prenom, e.universite, e.specialite, e.niveau
       FROM Candidature c
       JOIN Utilisateur u ON c.candidat = u.id
       JOIN Etudiant e ON c.candidat = e.id_etud
       WHERE c.offre = ?`,
      [offre]
    );
    return rows;
  },

  acceptApplication: async (candidat, offre) => {
    await db.query(
      `UPDATE Candidature 
       SET etat_sta = 'en cours', etat_cand = 'accepte' 
       WHERE candidat = ? AND offre = ?`,
      [candidat, offre]
    );
  },

  rejectOtherApplications: async (candidat, currentOffre) => {
    await db.query(
      `UPDATE Candidature 
       SET etat_cand = 'refuse' 
       WHERE candidat = ? AND offre != ?`,
      [candidat, currentOffre]
    );
  },

  // Dans candidature.js
getStudentApplications: async (candidat) => {
    try {
      const [rows] = await db.query(
        `SELECT 
          c.*, 
          o.titre, o.domaine, o.date_debut, o.date_fin,
          u.nom AS entreprise_nom,
          u.email AS entreprise_email
        FROM Candidature c
        LEFT JOIN offrestage o ON c.offre = o.id_offre
        LEFT JOIN Entreprise ent ON o.entr = ent.id_entr
        LEFT JOIN Utilisateur u ON ent.id_entr = u.id
        WHERE c.candidat = ?`,
        [candidat]
      );
      return rows;
    } catch (error) {
      console.error("Erreur dans getStudentApplications:", error);
      throw error;
    }
  }
};

getByCandidat: async (candidat) => {
    const [rows] = await db.query(
      `SELECT 
        c.*, 
        o.titre, o.domaine, o.date_debut, o.date_fin,
        u.nom AS entreprise_nom,
        u.email AS entreprise_email
       FROM Candidature c
       LEFT JOIN offrestage o ON c.offre = o.id_offre
       LEFT JOIN Entreprise ent ON o.entr = ent.id_entr
       LEFT JOIN Utilisateur u ON ent.id_entr = u.id
       WHERE c.candidat = ?`,
      [candidat]
    );
    return rows;
  }
module.exports = Candidature;