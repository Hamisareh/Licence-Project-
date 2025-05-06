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