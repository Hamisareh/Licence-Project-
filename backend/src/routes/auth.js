const express = require('express');
const router = express.Router();
const controller = require('../controllers/auth');
const { verifyToken, requireRole } = require('../middlewares/authMiddleware');
const upload = require('../middlewares/upload');
const { getUserById } = require('../models/user');
const offreCtrl = require('../controllers/offreController');
const favoriController = require('../controllers/favoriController');
const candidatureController = require('../controllers/candidatureController');
const evaluationCtrl = require('../controllers/evaluationController');
const documentCtrl = require('../controllers/documentController');
const notificationController = require('../controllers/notificationController');
const offreController = require('../controllers/offreController');
const documentController = require('../controllers/documentController'); // Ajoutez cette ligne
const statsController = require('../controllers/statsController');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const db = require('../config/db');
const adminController = require('../controllers/adminController');

// 🔐 Authentification
router.post('/register', controller.register);
router.get('/confirm/:token', controller.confirmEmail);
router.post('/login', controller.login);

// Réinitialisation de mot de passe
router.post('/send-reset-code', controller.sendResetCode);  // Envoi du code de réinitialisation
router.post('/verify-reset-code', controller.verifyResetCode);  // Vérification du code
router.post('/set-new-password', controller.setNewPassword);  // Mise à jour du mot de passe


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


//candidature
router.get('/candidatures/active', verifyToken, requireRole('etudiant'), candidatureController.getActiveApplications);
router.post('/candidatures', verifyToken, requireRole('etudiant'), upload.single('cv'), candidatureController.postuler);// Ajoutez cette route avec les autres routes de candidature
router.delete('/candidatures/:idOffre', verifyToken, requireRole('etudiant'), candidatureController.annulerCandidature);
router.get('/candidatures',  verifyToken, requireRole('etudiant'),candidatureController.mesCandidatures);
router.post('/candidatures/check',  verifyToken, requireRole('etudiant'), candidatureController.checkApplication);
//stage 
router.get('/etudiant/stages', verifyToken, requireRole('etudiant'), candidatureController.getStudentStages);

//logout
router.post('/logout', verifyToken, controller.logout);

//changer passe ,dans l'espace
router.put('/change-password', verifyToken, controller.changePassword);

// evaluation 
router.get('/etudiant/evaluations',verifyToken,requireRole('etudiant'),evaluationCtrl.getStudentEvaluations);

// Envoyer un rapport
router.post('/rapport', verifyToken,requireRole('etudiant'),upload.single('rapport'),documentCtrl.uploadRapport);

//notification
router.get('/notification', verifyToken, notificationController.getUserNotifications);
router.patch('/notification/:id/read', verifyToken, notificationController.markAsRead);



// Routes Candidatures pour Chef de Département
router.get('/candidatures/chef', verifyToken, requireRole('chef_dept'), candidatureController.getCandidaturesForChef);


// Route pour l'upload de convention (UNE SEULE DÉCLARATION)
router.post('/conventions/upload',verifyToken,requireRole('chef_dept'),upload.single('convention'), documentController.uploadConvention);
// Routes des offres
router.get('/offres', offreController.getOffresLight);
router.get('/offres/:id', offreController.getOffreById);

//  stagechef
router.get('/stagiaires/chef', verifyToken, requireRole('chef_dept'), candidatureController.getStagiairesForChef);

router.get('/chef/stats', verifyToken, requireRole('chef_dept'), statsController.getChefStats);


// Routes Admin
router.get('/admin/chefs', verifyToken, requireRole('admin'), adminController.listChefs);
router.post('/admin/create-chef', verifyToken, requireRole('admin'), adminController.createChef);
router.put('/me', verifyToken, controller.updateCurrentUser);
router.get('/admin/stats', verifyToken, requireRole('admin'), statsController.getAdminStats);
module.exports = router;