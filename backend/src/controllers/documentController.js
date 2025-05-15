const Document = require('../models/document');
const Notification = require('../models/notification');
const fs = require('fs');
const db = require('../config/db');
exports.uploadRapport = async (req, res) => {
  try {
  const { stageId } = req.body;
    const file = req.file;

    // Log 1: Vérifiez les données reçues
    console.log('=== DONNÉES REÇUES ===');
    console.log('Stage ID (type):', stageId, typeof stageId);
    console.log('Fichier reçu:', file ? {
      name: file.originalname,
      size: file.size,
      type: file.mimetype 
    } : 'Aucun fichier');
    console.log('User ID:', req.user.id, typeof req.user.id);

    if (!file || !stageId) {
      if (file) fs.unlinkSync(file.path);
      return res.status(400).json({ success: false, message: "Données manquantes" });
    }

    // Log 2: Avant la requête SQL
    console.log('=== REQUÊTE SQL ===');
    console.log('Exécution requête avec:', {
      stageId: stageId,
      userId: req.user.id
    });

    const [[stage]] = await db.query(
      `SELECT c.etat_sta, o.entr, c.offre, c.candidat 
       FROM Candidature c
       JOIN offrestage o ON c.offre = o.id_offre
       WHERE c.offre = ? AND c.candidat = ?`,
      [stageId, req.user.id]
    );

    // Log 3: Résultats de la requête
    console.log('=== RÉSULTATS REQUÊTE ===');
    console.log('Stage trouvé:', stage);
    console.log('État du stage:', stage?.etat_sta);
    console.log('Type de etat_sta:', typeof stage?.etat_sta);
    console.log('Comparaison exacte (en cours):', stage?.etat_sta === 'en cours');

    // Log 4: Vérification des types
    if (stage) {
      console.log('Types des IDs:');
      console.log('offre (DB):', stage.offre, typeof stage.offre);
      console.log('candidat (DB):', stage.candidat, typeof stage.candidat);
    }

    if (!stage || stage.etat_sta !== 'en cours') {
      // Log 5: Raison de l'échec
      console.log('=== ÉCHEC VÉRIFICATION ===');
      console.log('Raison:', !stage ? 'Stage non trouvé' : `Mauvais état: ${stage.etat_sta}`);
      
      fs.unlinkSync(file.path);
      return res.status(400).json({ 
        success: false, 
        message: "Seuls les stages en cours peuvent recevoir des rapports" 
      });
    }

    // Récupérer infos étudiant
    const [[etudiant]] = await db.query(
      `SELECT u.nom, u.prenom, e.departement 
       FROM Utilisateur u
       JOIN Etudiant e ON u.id = e.id_etud
       WHERE u.id = ?`,
      [req.user.id]
    );

    // Récupérer chef de département
    const chefDeptId = await Document.getChefDepartement(req.user.id);

    if (!chefDeptId) {
      fs.unlinkSync(file.path);
      return res.status(400).json({ 
        success: false, 
        message: "Chef de département introuvable" 
      });
    }

    // Enregistrement pour l'entreprise et le chef
    const destinataires = [stage.entr, chefDeptId];

    await Promise.all(destinataires.map(async dest => {
      // Enregistrer document
      await Document.create({
        exped_doc: req.user.id,
        destin_doc: dest,
        nom: file.originalname,
        type: file.mimetype,
        chemin: file.path,
         date_envoi: new Date()
      });

      // Envoyer notification
      await Notification.create({
        expediteur: req.user.id,
        destinataire: dest,
        msg: `${etudiant.prenom} ${etudiant.nom} a envoyé un rapport de stage`,
        type_notif: 'rapport_stage'
      });
    }));

    res.json({ 
      success: true, 
      message: "Rapport envoyé à l'entreprise et au chef de département" 
    });

  } catch (err) {
    console.error(err);
    if (req.file?.path) fs.unlinkSync(req.file.path);
    res.status(500).json({ 
      success: false,
      message: "Erreur lors de l'envoi du rapport" 
    });
  }

};