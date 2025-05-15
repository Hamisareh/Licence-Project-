const Favori = require('../models/favori');

exports.getFavoris = async (req, res) => {
  try {
    const favoris = await Favori.getFavorisByEtudiant(req.user.id);
    res.json(favoris);
  } catch (error) {
    console.error('Erreur getFavoris:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

exports.toggleFavori = async (req, res) => {
  try {
    const { id } = req.user;
    const { offre_fav } = req.body;

    const exists = await Favori.checkFavoriExists(id, offre_fav);
    
    if (exists) {
      await Favori.removeFavori(id, offre_fav);
      res.json({ action: 'removed', offreId: offre_fav });
    } else {
      await Favori.addFavori(id, offre_fav);
      res.json({ action: 'added', offreId: offre_fav });
    }
  } catch (error) {
    console.error('Erreur toggleFavori:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
};