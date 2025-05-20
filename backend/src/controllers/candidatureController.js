const path = require('path');
const fs = require('fs');
const Candidature = require('../models/candidature');
const Notification = require('../models/notification');
const db = require('../config/db');

// Ajouter cette nouvelle route
exports.getActiveApplications = async (req, res) => {
    try {
      const activeApplications = await Candidature.getActiveApplications(req.user.id);
      res.json({ 
        success: true, 
        hasActiveStage: activeApplications.length > 0 
      });
    } catch (err) {
      console.error("Erreur:", err);
      res.status(500).json({ 
        success: false,
        message: "Erreur serveur" 
      });
    }
  };
  
  // Modifier la fonction postuler pour gérer les cas d'erreur
exports.postuler = async (req, res) => {
  try {
    // Validation
    if (!req.file || !req.body.offre_id) {
      return res.status(400).json({ 
        success: false,
        message: "Offre et CV requis" 
      });
    }

    // Vérifier si l'étudiant a déjà un stage en cours
    const activeApplications = await Candidature.getActiveApplications(req.user.id);
    if (activeApplications.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Vous êtes déjà en stage",
        hasActiveStage: true
      });
    }

    // Vérifier si l'étudiant a déjà postulé à cette offre
    const alreadyApplied = await Candidature.exists(req.user.id, req.body.offre_id);
    if (alreadyApplied) {
      return res.status(400).json({ 
        success: false,
        message: "Vous avez déjà postulé à cette offre" 
      });
    }

    // Gestion fichier
    const ext = path.extname(req.file.originalname);
    const cvPath = `/uploads/cvs/cv_${req.user.id}_${Date.now()}${ext}`;
    fs.renameSync(req.file.path, path.join(__dirname, '../public', cvPath));

    // Création de la candidature
    await Candidature.create({
      candidat: req.user.id,
      offre: req.body.offre_id,
      cv: cvPath
    });

    // Récupérer les infos de l'étudiant
    const [[etudiant]] = await db.query(
      `SELECT u.nom, u.prenom FROM Utilisateur u WHERE u.id = ?`,
      [req.user.id]
    );

    // Récupérer les infos de l'offre
    const [[offre]] = await db.query(
      `SELECT o.id_offre, o.titre, o.entr FROM offrestage o WHERE o.id_offre = ?`,
      [req.body.offre_id]
    );

    // Envoyer notification à l'entreprise
    await Notification.create({
      expediteur: req.user.id,
      destinataire: offre.entr,
      msg: `${etudiant.prenom} ${etudiant.nom} a postulé à votre offre "${offre.titre}"`,
      type_notif: 'nouvelle_candidature',
      date_creation: new Date()
    });

    res.status(201).json({
      success: true,
      message: "Candidature enregistrée",
      cvPath
    });

  } catch (err) {
    console.error("Erreur:", err);
    if (req.file?.path) fs.unlinkSync(req.file.path);
    res.status(500).json({ 
      success: false,
      message: "Erreur serveur" 
    });
  }
};

// Dans candidatureController.js
exports.mesCandidatures = async (req, res) => {
    try {
      const candidatures = await Candidature.getStudentApplications(req.user.id);
      
      // Correction: Vérifier que les champs existent avant de les utiliser
      const result = candidatures.map(c => ({
        id: c.offre,
        titre: c.titre,
        entreprise: c.entreprise_nom,
        date: c.date_cand ? new Date(c.date_cand).toISOString() : null,
        etat: c.etat_cand || 'en attente',
        accepte: c.etat_sta === 'en cours',
        cvUrl: c.cv ? `${process.env.BASE_URL || ''}${c.cv}` : null,
        details: {
          domaine: c.domaine ,
          periode: (c.date_debut && c.date_fin)
  ? `${new Date(c.date_debut).toLocaleDateString('fr-FR')} au ${new Date(c.date_fin).toLocaleDateString('fr-FR')}`
  : 'Non spécifié',
          contact: c.entreprise_email || 'Non spécifié'
        }
      }));
  
      res.json({ success: true, data: result });
    } catch (err) {
      console.error("Erreur:", err);
      res.status(500).json({ 
        success: false,
        message: "Erreur serveur lors de la récupération des candidatures" 
      });
    }
  };
  exports.verifierStage = async (req, res) => {
    try {
      const [stageEnCours] = await db.query(
        `SELECT 1 FROM Candidature 
         WHERE candidat = ? AND etat_sta = 'en cours' 
         LIMIT 1`,
        [req.user.id]
      );
      
      res.json({ enStage: stageEnCours.length > 0 });
      
    } catch (err) {
      res.status(500).json({ error: "Erreur de vérification" });
    }
  };

  // Nouvelle méthode pour annuler une candidature
exports.annulerCandidature = async (req, res) => {
    try {
      const { idOffre } = req.params;
      
      // Vérifier que la candidature appartient à l'utilisateur
      const [candidature] = await db.query(
        `SELECT * FROM Candidature 
         WHERE candidat = ? AND offre = ? AND etat_cand = 'en attente'`,
        [req.user.id, idOffre]
      );
  
      if (candidature.length === 0) {
        return res.status(404).json({
          success: false,
          message: "Candidature non trouvée ou non annulable"
        });
      }
  
      // Supprimer la candidature
      await db.query(
        `DELETE FROM Candidature 
         WHERE candidat = ? AND offre = ?`,
        [req.user.id, idOffre]
      );
  
      // Supprimer le fichier CV si nécessaire
      if (candidature[0].cv) {
        fs.unlinkSync(path.join(__dirname, '../public', candidature[0].cv));
      }
  
      res.json({
        success: true,
        message: "Candidature annulée avec succès"
      });
  
    } catch (err) {
      console.error("Erreur:", err);
      res.status(500).json({ 
        success: false,
        message: "Erreur serveur" 
      });
    }
  };
  exports.getStudentStages = async (req, res) => {
  try {
    const stages = await Candidature.getStudentStages(req.user.id);
    
    const result = stages.map(s => ({
      id: s.offre,
      titre: s.titre,
      entreprise: s.entreprise_nom,
      domaine: s.domaine,
      date_debut: s.date_debut,
      date_fin: s.date_fin,
      etat: s.etat_sta, // 'en cours', 'terminée' ou 'abandonnée'
      details: {
        contact: s.entreprise_email,
        periode: `${new Date(s.date_debut).toLocaleDateString()} - ${new Date(s.date_fin).toLocaleDateString()}`,
        validation_chef: s.statut_validation_chef
      }
    }));

    res.json({ success: true, data: result });
  } catch (err) {
    console.error("Erreur:", err);
    res.status(500).json({ 
      success: false,
      message: "Erreur serveur" 
    });
  }
};
// Nouvelle route de vérification
exports.checkApplication = async (req, res) => {
  try {
    // Vérifier si l'étudiant a déjà un stage en cours
    const activeApplications = await Candidature.getActiveApplications(req.user.id);
    if (activeApplications.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Vous êtes déjà en stage",
        errorType: "active_stage"
      });
    }

    // Vérifier si l'étudiant a déjà postulé à cette offre
    const alreadyApplied = await Candidature.exists(req.user.id, req.body.offre_id);
    if (alreadyApplied) {
      return res.status(400).json({ 
        success: false,
        message: "Vous avez déjà postulé à cette offre",
        errorType: "already_applied"
      });
    }

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ 
      success: false,
      message: "Erreur serveur" 
    });
  }
};


// controllers/candidatureController.js
exports.getCandidaturesForChef = async (req, res) => {
  try {
    // Récupérer le département du chef
    const [chef] = await db.query(
      `SELECT departement FROM ChefDepartement WHERE id_chef = ?`,
      [req.user.id]
    );

    if (!chef || !chef[0]) {
      return res.status(403).json({ 
        success: false, 
        message: "Accès refusé - département non trouvé" 
      });
    }

    // Récupérer les candidatures des étudiants du même département
    const [candidatures] = await db.query(`
  SELECT 
    c.*, 
    u.nom, u.prenom, 
    e.matricule,
    o.titre, o.domaine, o.duree, o.date_debut, o.date_fin, 
    o.missions, o.descr, o.competencesRequises,
    ent.nom AS entreprise_nom,
    ent.email AS entreprise_email,
    entp.secteur AS entreprise_secteur,
    entp.tel AS entreprise_tel,
    entp.adr AS entreprise_adr
  FROM Candidature c
  JOIN Etudiant e ON c.candidat = e.id_etud
  JOIN Utilisateur u ON e.id_etud = u.id
  JOIN offrestage o ON c.offre = o.id_offre
  JOIN Utilisateur ent ON o.entr = ent.id
  LEFT JOIN Entreprise entp ON ent.id = entp.id_entr
  WHERE e.departement = ?`,
  [chef[0].departement]
);

    res.json({ success: true, data: candidatures });
  } catch (error) {
    console.error("Erreur:", error);
    res.status(500).json({ success: false, message: "Erreur serveur" });
  }
};
// controllers/candidatureController.js
exports.getStagiairesForChef = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT 
        u.id AS candidat_id,
        u.nom, 
        u.prenom, 
        e.matricule,
        o.id_offre AS offre_id, 
        o.titre,
        o.domaine,
        o.date_debut,
        o.date_fin,
        o.missions,
        o.competencesRequises,
        c.etat_sta,
        o.entr AS entreprise_id,
        ev.note_comport,
        ev.note_adapt,
        ev.note_esprit_equipe,
        ev.note_qual_trav,
        ev.nb_absences,
        ev.nb_justification,
        ev.commentaire,
        ent.nom AS entreprise_nom,
        ent.email AS entreprise_email,
        entp.tel AS entreprise_tel,
        entp.secteur AS entreprise_secteur,
        entp.adr AS entreprise_adr
      FROM Candidature c
      JOIN Utilisateur u ON c.candidat = u.id
      JOIN Etudiant e ON u.id = e.id_etud
      JOIN offrestage o ON c.offre = o.id_offre
      LEFT JOIN Evaluation ev ON (ev.evalue = c.candidat AND ev.id_offre = c.offre)
      JOIN Utilisateur ent ON o.entr = ent.id
      LEFT JOIN Entreprise entp ON ent.id = entp.id_entr
      WHERE c.etat_sta IN ('en cours', 'termine', 'abandonne')
      ORDER BY c.etat_sta, u.nom
    `);

    const result = rows.map(row => ({
      candidat: row.candidat_id,
      nom: row.nom,
      prenom: row.prenom,
      matricule: row.matricule,
      offre: row.offre_id,
      titre: row.titre,
      domaine: row.domaine,
      date_debut: row.date_debut,
      date_fin: row.date_fin,
      missions: row.missions,
      competencesRequises: row.competencesRequises,
      etat_sta: row.etat_sta,
      entreprise_id: row.entreprise_id,
      entreprise_nom: row.entreprise_nom,
      entreprise_email: row.entreprise_email,
      entreprise_tel: row.entreprise_tel,
      entreprise_secteur: row.entreprise_secteur,
      entreprise_adr: row.entreprise_adr,
      evaluation: row.note_comport ? {
        note_comport: row.note_comport,
        note_adapt: row.note_adapt,
        note_esprit_equipe: row.note_esprit_equipe,
        note_qual_trav: row.note_qual_trav,
        nb_absences: row.nb_absences,
        nb_justification: row.nb_justification,
        commentaire: row.commentaire
      } : null
    }));

    res.json({ success: true, data: result });
  } catch (error) {
    console.error("Erreur:", error);
    res.status(500).json({ success: false, message: "Erreur serveur" });
  }
};
// ... (autres méthodes pour entreprises)