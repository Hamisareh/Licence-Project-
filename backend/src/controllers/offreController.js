const Offre = require('../models/offre');

exports.getAllOffres = async (req, res) => {
  try {
    const offres = await Offre.getAll();
    res.json(offres);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erreur lors de la récupération des offres' });
  }
};


exports.getOffreById = async (req, res) => {
  try {
    const offre = await Offre.getById(req.params.id);
    if (!offre) return res.status(404).json({ error: 'Offre non trouvée' });
    res.json(offre);
  } catch (error) {
    console.error('Erreur getOffreById:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
};
