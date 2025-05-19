
const Offre = require('../models/offre');

exports.getOffresLight = async (req, res) => {
  try {
    const offres = await Offre.getAllLight();
    res.json(offres);
  } catch (error) {
    console.error('Erreur getOffresLight:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

exports.getOffreComplete = async (req, res) => {
  try {
    const offre = await Offre.getCompleteById(req.params.id_offre);
    res.json(offre || {});
  } catch (error) {
    console.error('Erreur getOffreComplete:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

exports.getOffreById = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Requête révisée avec jointure correcte
    const [offre] = await db.query(`
      SELECT 
        o.*,
        u.nom AS nom_entreprise,  // Changé de entreprise_nom à nom_entreprise
        u.email AS email_entreprise,
        e.tel AS tel_entreprise,
        e.adr AS adr_entreprise,
        e.secteur AS secteur_entreprise
      FROM offrestage o
      JOIN Utilisateur u ON o.entr = u.id
      LEFT JOIN Entreprise e ON u.id = e.id_entr
      WHERE o.id_offre = ?`,
      [id]
    );

    if (!offre || offre.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Offre non trouvée"
      });
    }

    // Formatage avec vérification approfondie
    const result = {
      ...offre[0],
      nom_entreprise: offre[0].nom_entreprise || "Entreprise non renseignée",
      duree: offre[0].duree || "Durée non spécifiée",
      // Conversion des dates
      date_debut: offre[0].date_debut,
      date_fin: offre[0].date_fin
    };

console.log("Offre récupérée :", rows[0]);
return res.status(200).json(rows[0]);
// Debug

  

  } catch (error) {
    console.error("Erreur détaillée:", error);
    res.status(500).json({
      success: false,
      message: "Erreur serveur",
      error: error.message
    });
  }
};
