const Favori = require('../models/favori');

// GET /api/favoris : Récupérer les IDs des offres favorites de l'étudiant connecté
exports.getFavoris = (req, res) => {
  const etudiantId = req.user.id;

  Favori.getFavorisByEtudiant(etudiantId, (err, results) => {
    if (err) return res.status(500).json({ error: 'Erreur lors de la récupération des favoris' });

    const ids = results.map((row) => row.offre_fav);
    res.json(ids);
  });
};

// POST /api/favoris : Ajouter une offre aux favoris
exports.addFavori = (req, res) => {
  const etudiantId = req.user.id;
  const { offre_fav } = req.body;

  if (!offre_fav) return res.status(400).json({ error: 'Champ offre_fav requis' });

  Favori.addFavori(etudiantId, offre_fav, (err) => {
    if (err) return res.status(500).json({ error: 'Erreur lors de l\'ajout du favori' });
    res.json({ message: 'Ajouté aux favoris' });
  });
};

// DELETE /api/favoris/:offreId : Supprimer un favori
exports.removeFavori = (req, res) => {
  const etudiantId = req.user.id;
  const offreId = req.params.offreId;

  Favori.removeFavori(etudiantId, offreId, (err) => {
    if (err) return res.status(500).json({ error: 'Erreur lors de la suppression du favori' });
    res.json({ message: 'Favori supprimé' });
  });
};
