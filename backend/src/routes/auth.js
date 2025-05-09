const express = require('express');
const router = express.Router();
const controller = require('../controllers/auth');
const { verifyToken, requireRole } = require('../middlewares/authMiddleware');
const upload = require('../middlewares/upload');
const { getUserById } = require('../models/user');
const offreCtrl = require('../controllers/offreController');
const favoriController = require('../controllers/favoriController');
const candidatureController = require('../controllers/candidatureController');
// 🔐 Authentification
router.post('/register', controller.register);
router.get('/confirm/:token', controller.confirmEmail);
router.post('/login', controller.login);

// ✅ Route accessible par tous les utilisateurs connectés
router.get('/me', verifyToken, controller.getCurrentUser);

router.put('/me', verifyToken, controller.updateCurrentUser);

// ✅ Routes protégées par rôle
router.get('/etudiant/mon-espace', verifyToken, requireRole('etudiant'), (req, res) => {
  res.json({ message: 'Bienvenue étudiant', id: req.user.id });
});

router.get('/entreprise/mon-espace', verifyToken, requireRole('entreprise'), (req, res) => {
  res.json({ message: 'Bienvenue entreprise', id: req.user.id });
});

router.get('/chef/mon-espace', verifyToken, requireRole('chef_dept'), (req, res) => {
  res.json({ message: 'Bienvenue chef de département', id: req.user.id });
});

router.get('/admin/mon-espace', verifyToken, requireRole('admin'), (req, res) => {
  res.json({ message: 'Bienvenue administrateur', id: req.user.id });
});
// 🔐 Offres
router.get('/offres', offreCtrl.getOffresLight); // Pour home.jsx
router.get('/offres/:id_offre', offreCtrl.getOffreComplete); // Pour offre-details.jsx

//favori
router.get('/favoris', verifyToken, requireRole('etudiant'), favoriController.getFavoris);
router.post('/favoris/toggle', verifyToken, requireRole('etudiant'), favoriController.toggleFavori);
module.exports = router;

//candidature
router.get('/candidatures/active', verifyToken, requireRole('etudiant'), candidatureController.getActiveApplications);
router.post('/candidatures', verifyToken, requireRole('etudiant'), upload.single('cv'), candidatureController.postuler);// Ajoutez cette route avec les autres routes de candidature
router.delete('/candidatures/:idOffre', verifyToken, requireRole('etudiant'), candidatureController.annulerCandidature);
router.get('/candidatures',  verifyToken, requireRole('etudiant'),candidatureController.mesCandidatures);
