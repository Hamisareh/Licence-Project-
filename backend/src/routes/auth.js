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
router.get('/me', verifyToken, async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: ['id', 'nom', 'prenom', 'email', 'role'],
    });

    if (!user) {
      return res.status(404).json({ error: 'Utilisateur non trouvé' });
    }

    res.json({ user });
  } catch (error) {
    console.error('Erreur serveur /me:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});
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
