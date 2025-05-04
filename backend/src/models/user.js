const db = require('../config/db');

exports.getUserById = async (id) => {
  const [rows] = await db.query('SELECT id, nom, prenom, email, role FROM Utilisateur WHERE id = ?', [id]);
  return rows[0];
};