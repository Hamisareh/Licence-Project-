const Notification = require('../models/notification');

exports.getUserNotifications = async (req, res) => {
  try {
    const userId = req.user.id;
    const notifications = await Notification.getByDestinataire(userId);
    
    res.status(200).json({
      success: true,
      data: notifications.map(notif => ({
        id: notif.id_notif, // Utilisez id_notif au lieu de id
        type: notif.type,
        message: notif.message,
        date: notif.date,
        lu: notif.lu,
       expediteur: notif.expediteur_prenom || notif.expediteur_nom 
  ? `${notif.expediteur_prenom || ''} ${notif.expediteur_nom || ''}`.trim()
  : 'Système'
      }))
    });
  } catch (error) {
    console.error('Erreur:', error);
    res.status(500).json({ 
      success: false,
      message: "Erreur serveur" 
    });
  }
};

exports.markAsRead = async (req, res) => {
  console.log("💡 Requête reçue pour notif ID:", req.params.id);
  try {
    const result = await Notification.markAsRead(req.params.id);
    console.log("📝 Résultat BDD:", result);
    res.json({ success: true });
  } catch (error) {
    console.error("🔥 Erreur:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};