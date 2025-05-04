const express = require('express');
const router = express.Router();
const controller = require('../controllers/auth');
const { verifyToken, requireRole } = require('../middlewares/authMiddleware');
const { getUserById } = require('../models/user');

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

module.exports = router;
