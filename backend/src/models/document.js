const db = require('../config/db');

const Document = {
  create: async (docData) => {
    const [result] = await db.query(
      `INSERT INTO Document SET ?`,
      [docData]
    );
    return result;
  },

  getByStage: async (stageId, userId) => {
    const [rows] = await db.query(
      `SELECT d.*, u.nom AS expediteur_nom 
       FROM Document d
       JOIN Utilisateur u ON d.exped_doc = u.id
       WHERE d.id_objet = ? AND d.destin_doc = ?
       ORDER BY d.date_envoi DESC`,
      [stageId, userId]
    );
    return rows;
  },

  getChefDepartement: async (etudiantId) => {
    const [rows] = await db.query(
      `SELECT cd.id_chef 
       FROM ChefDepartement cd
       JOIN Etudiant e ON cd.departement = e.departement
       WHERE e.id_etud = ?`,
      [etudiantId]
    );
    return rows[0]?.id_chef;
  }
};

module.exports = Document;