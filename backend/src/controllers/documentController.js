const Document = require('../models/document');
const Notification = require('../models/notification');
const path = require('path');
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

exports.uploadConvention = async (req, res) => {
  try {
    // Validation des données
    if (!req.file || !req.body.candidatId || !req.body.offreId) {
      if (req.file) fs.unlinkSync(req.file.path);
      return res.status(400).json({ 
        success: false,
        message: "Fichier et IDs requis" 
      });
    }

    const { candidatId, offreId } = req.body;
    const file = req.file;

    // 1. Récupérer l'entreprise associée à l'offre
    const [[offre]] = await db.query(
      `SELECT entr FROM offrestage WHERE id_offre = ?`,
      [offreId]
    );

    if (!offre) {
      fs.unlinkSync(file.path);
      return res.status(404).json({ 
        success: false,
        message: "Offre non trouvée" 
      });
    }

    // 2. Préparer le stockage du fichier
    const uploadDir = path.join(__dirname, '../../tmp/uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const newFilename = `conv_${offreId}_${Date.now()}${path.extname(file.originalname)}`;
    const destPath = path.join(uploadDir, newFilename);
    fs.renameSync(file.path, destPath);

    // 3. Enregistrer dans la table Document
    await db.query(
      `INSERT INTO Document 
       (exped_doc, destin_doc, nom, type, chemin)
       VALUES (?, ?, ?, ?, ?)`,
      [
        req.user.id,    // ID du chef
        offre.entr,     // ID de l'entreprise
        file.originalname,
        'convention',
        `/uploads/${newFilename}`
      ]
    );

    // 4. Mettre à jour la candidature
   await db.query(
      `UPDATE Candidature 
       SET etat_sta = 'en cours'
       WHERE candidat = ? AND offre = ?`,
      [candidatId, offreId]
    );
    // 5. Créer une notification pour l'entreprise
    await db.query(
      `INSERT INTO Notification
       (expediteur, destinataire, msg, type_notif)
       VALUES (?, ?, ?, ?)`,
      [
        req.user.id,
        offre.entr,
        'Une nouvelle convention de stage a été validée',
        'convention_validee'
      ]
    );

    res.json({ 
      success: true,
      message: "Convention enregistrée avec succès",
      filePath: `/uploads/${newFilename}`
    });

  } catch (error) {
    console.error("Erreur complète:", error);
    if (req.file?.path) fs.unlinkSync(req.file.path);
    res.status(500).json({ 
      success: false,
      message: error.message || "Erreur serveur"
    });
  }
};