const db = require('../config/db');
// controllers/statsController.js
exports.getChefStats = async (req, res) => {
  try {
    // 1. Récupérer les infos du chef
    const [chef] = await db.query(
      `SELECT c.departement, u.nom, u.prenom 
       FROM ChefDepartement c
       JOIN Utilisateur u ON c.id_chef = u.id
       WHERE c.id_chef = ?`, 
      [req.user.id]
    );

    if (!chef || !chef[0]) {
      return res.status(403).json({ success: false, message: "Chef non trouvé" });
    }

    const departement = chef[0].departement;

    // 2. Statistique 1: Étudiants par niveau (version corrigée)
    const [niveaux] = await db.query(
      `SELECT 
        CASE 
          WHEN niveau = 'L1' THEN 'Licence 1'
          WHEN niveau = 'L2' THEN 'Licence 2'
          WHEN niveau = 'L3' THEN 'Licence 3'
          WHEN niveau = 'M1' THEN 'Master 1'
          WHEN niveau = 'M2' THEN 'Master 2'
          ELSE niveau
        END as label,
        niveau as niveau_key, 
        COUNT(*) as value
       FROM Etudiant 
       WHERE departement = ?
       GROUP BY niveau`,
      [departement]
    );

    // 3. Statistique 2: Candidatures par état
    const [candidatures] = await db.query(
      `SELECT 
        etat_cand as etat,
        COUNT(*) as count
       FROM Candidature c
       JOIN Etudiant e ON c.candidat = e.id_etud
       WHERE e.departement = ?
       GROUP BY etat_cand`,
      [departement]
    );

    // 4. Statistique 3: Stages par état
    const [stages] = await db.query(
      `SELECT 
        etat_sta as etat,
        COUNT(*) as count
       FROM Candidature c
       JOIN Etudiant e ON c.candidat = e.id_etud
       WHERE e.departement = ? AND etat_sta IS NOT NULL
       GROUP BY etat_sta`,
      [departement]
    );

    // 5. Total étudiants
    const [[totalEtudiants]] = await db.query(
      `SELECT COUNT(*) as total 
       FROM Etudiant 
       WHERE departement = ?`,
      [departement]
    );

    // Formater les données pour le frontend
    const formattedNiveaux = niveaux.map(niv => ({
      label: niv.label,
      key: niv.niveau_key,  // Utilisation du nouveau nom de colonne
      value: niv.value
    }));

    res.json({
      success: true,
      data: {
        chef: {
          nom: chef[0].nom,
          prenom: chef[0].prenom,
          departement
        },
        niveaux: formattedNiveaux,
        candidatures,
        stages,
        totalEtudiants: totalEtudiants.total
      }
    });

  } catch (error) {
    console.error("Erreur:", error);
    res.status(500).json({ 
      success: false,
      message: "Erreur serveur",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

exports.getAdminStats = async (req, res) => {
  console.log("Début getAdminStats"); // Ajoutez ce log
  try {
    console.log("User ID:", req.user.id); // Vérifiez l'ID de l'admin
    
    const [admin] = await db.query(
      `SELECT a.universite 
       FROM Administrateur a
       WHERE a.id_adm = ?`, 
      [req.user.id]
    );
    console.log("Admin trouvé:", admin); // Vérifiez les données admin

    if (!admin || !admin[0]) {
      console.log("Admin non trouvé");
      return res.status(403).json({ success: false, message: "Admin non trouvé" });
    }

    const universite = admin[0].universite;
    console.log("Université:", universite);

    // 2. Statistiques par département
    const [departements] = await db.query(
  `SELECT 
    e.departement,
    COUNT(DISTINCT e.id_etud) as etudiants,
    COUNT(DISTINCT CONCAT(c.candidat, '-', c.offre)) as candidatures,
    COUNT(DISTINCT CASE WHEN c.etat_sta = 'en cours' THEN CONCAT(c.candidat, '-', c.offre) END) as stagiaires
   FROM Etudiant e
   LEFT JOIN Candidature c ON c.candidat = e.id_etud
   WHERE e.universite = ?
   GROUP BY e.departement`,
  [universite]
);

    // 3. Totaux globaux
    const [[totaux]] = await db.query(
      `SELECT 
        COUNT(DISTINCT e.id_etud) as total_etudiants,
        COUNT(DISTINCT c.id_cand) as total_candidatures,
        COUNT(DISTINCT CASE WHEN c.etat_sta = 'en cours' THEN c.id_cand END) as total_stagiaires
       FROM Etudiant e
       LEFT JOIN Candidature c ON c.candidat = e.id_etud
       WHERE e.universite = ?`,
      [universite]
    );

     console.log("Données préparées:", { // Ajoutez ce log
      universite,
      departements,
      totaux
    });

    res.json({
      success: true,
      data: {
        universite,
        departements,
        totaux
      }
    });

  } catch (error) {
    console.error("Erreur complète:", error); // Log complet
    res.status(500).json({ 
      success: false,
      message: "Erreur serveur",
      error: error.message // Renvoyez le message d'erreur
    });
  }
};