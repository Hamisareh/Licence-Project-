const db = require('../config/db');

const Notification = {
  create: async (notifData) => {
    const [result] = await db.query(
      `INSERT INTO Notification SET ?`,
      [notifData]
    );
    return result;
  },

  getByDestinataire: async (userId) => {
    const [rows] = await db.query(
      `SELECT 
        n.id_notif,
        n.msg AS message,
        n.type_notif AS type,
        n.date_creation AS date,
        n.lu,
        u.nom AS expediteur_nom,
        u.prenom AS expediteur_prenom
      FROM Notification n
      LEFT JOIN Utilisateur u ON n.expediteur = u.id
      WHERE n.destinataire = ?
      ORDER BY n.date_creation DESC`,
      [userId]
    );
    return rows;
  },

markAsRead: async (notificationId) => {
  console.log("🔄 Mise à jour BDD pour notif:", notificationId);
  const [result] = await db.query(
    'UPDATE Notification SET lu = 1 WHERE id_notif = ?',
    [notificationId]
  );
  console.log("✅ Résultat update:", result);
  return result;
}
};

module.exports = Notification;