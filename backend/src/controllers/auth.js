const db = require('../config/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const User = require('../models/user');
const { sendVerificationEmail, sendResetPasswordEmail, sendChefAccountEmail } = require('../utils/mailer');

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

exports.register = async (req, res) => {
  try {
    const {
      nom, prenom, email, mdps,
      role = 'etudiant',
      universite, specialite, niveau, departement,
      adr, tel, secteur,
      matricule
    } = req.body;

    // Validation
    if (!EMAIL_REGEX.test(email)) {
      return res.status(400).json({ error: 'Email invalide' });
    }
    if (!mdps || mdps.length < 8) {
      return res.status(400).json({ error: 'Mot de passe trop court (min 8 caractères)' });
    }

    // Vérifie si l'email est déjà utilisé
    const [existing] = await db.query('SELECT * FROM Utilisateur WHERE email = ?', [email]);
    if (existing.length > 0) return res.status(400).json({ error: 'Email déjà utilisé' });

    const hashed = await bcrypt.hash(mdps, 10);
    const token = crypto.randomBytes(32).toString('hex');

    // Insertion utilisateur
    const [userRes] = await db.query(
      'INSERT INTO Utilisateur (nom, prenom, email, mdps, role, token_confirmation, email_verifie) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [nom, prenom, email, hashed, role, token, false]
    );

    const id = userRes.insertId;

    // Insertion selon le rôle
 
if (role === 'etudiant') {
  await db.query(
    'INSERT INTO Etudiant (id_etud, universite, specialite, niveau, departement, matricule) VALUES (?, ?, ?, ?, ?, ?)',
    [id, universite, specialite, niveau, departement, req.body.matricule] 
  );
} else if (role === 'entreprise') {
      await db.query(
        'INSERT INTO Entreprise (id_entr, adr, tel, secteur) VALUES (?, ?, ?, ?)',
        [id, adr, tel, secteur]
      );
    } else if (role === 'chef_dept') {
      await db.query(
        'INSERT INTO ChefDepartement (id_chef, universite, departement) VALUES (?, ?, ?)',
        [id, universite, departement]
      );
    } 
    // Envoi de l'email de confirmation
    await sendVerificationEmail(email, token, prenom);

    res.status(201).json({ message: 'Compte créé. Vérifie ton email pour confirmer.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

exports.confirmEmail = async (req, res) => {
  const { token } = req.params;

  try {
    const [result] = await db.query(
      'SELECT * FROM Utilisateur WHERE token_confirmation = ?',
      [token]
    );

    if (result.length === 0) {
      return res.status(400).send('Token invalide ou expiré.');
    }

    await db.query(
      'UPDATE Utilisateur SET email_verifie = ?, token_confirmation = NULL WHERE token_confirmation = ?',
      [true, token]
    );

    res.send('✅ Ton compte est vérifié ! Tu peux maintenant te connecter.');
  } catch (err) {
    console.error(err);
    res.status(500).send('Erreur lors de la confirmation.');
  }
};

exports.login = async (req, res) => {
  const { email, mdps } = req.body;

  try {
    // Vérifie si l'utilisateur existe
    const [rows] = await db.query('SELECT * FROM Utilisateur WHERE email = ?', [email]);
    console.log('Utilisateur trouvé :', rows);
    
    if (rows.length === 0) return res.status(401).json({ error: 'Email incorrect' });

    const user = rows[0];

    // Vérifie si l'email est vérifié
    console.log('Email vérifié :', user.email_verifie);
    if (!user.email_verifie) {
      return res.status(403).json({ error: 'Compte non vérifié. Vérifie ton email.' });
    }

    // Vérifie le mot de passe
    const match = await bcrypt.compare(mdps, user.mdps);
    console.log('Mot de passe vérifié :', match);
    if (!match) return res.status(401).json({ error: 'Mot de passe incorrect' });

    // Génère un token
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
     
    );

    res.json({ token, role: user.role });
  } catch (err) {
    console.error('Erreur serveur:', err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
};
exports.getCurrentUser = async (req, res) => {
  try {
    const [userRows] = await db.query('SELECT id, nom, prenom, email, role FROM Utilisateur WHERE id = ?', [req.user.id]);
    if (userRows.length === 0) return res.status(404).json({ error: 'Utilisateur non trouvé' });

    const user = userRows[0];

    if (user.role === 'etudiant') {
      const [rows] = await db.query('SELECT universite, specialite, niveau, departement ,matricule FROM Etudiant WHERE id_etud = ?', [user.id]);
      Object.assign(user, rows[0]);
    } else if (user.role === 'entreprise') {
      const [rows] = await db.query('SELECT adr, tel, secteur FROM Entreprise WHERE id_entr = ?', [user.id]);
      Object.assign(user, rows[0]);
    } else if (user.role === 'chef_dept') {
      const [rows] = await db.query('SELECT universite, departement FROM ChefDepartement WHERE id_chef = ?', [user.id]);
      Object.assign(user, rows[0]);
     } else if (user.role === 'admin') {
      const [rows] = await db.query('SELECT universite FROM Administrateur WHERE id_adm = ?', [user.id]);
      Object.assign(user, rows[0]);
      // Pour les admins, on peut définir un département par défaut ou le laisser vide
      user.departement = "Administration centrale";
    }

    res.json({ user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
};
exports.updateCurrentUser = async (req, res) => {
  const {
    nom,
    prenom,
    email,
    universite,
    specialite,
    niveau,
    departement,
    matricule,
    adr,
    tel,
    secteur  
  } = req.body;

  try {
    // 1. Mise à jour des données communes
    await db.query(
      'UPDATE Utilisateur SET nom = ?, prenom = ?, email = ? WHERE id = ?',
      [nom, prenom, email, req.user.id]
    );

    // 2. Mise à jour selon le rôle
    if (req.user.role === 'etudiant') {
      await db.query(
        'UPDATE Etudiant SET universite = ?, specialite = ?, niveau = ?, departement = ?, matricule = ? WHERE id_etud = ?',
        [universite, specialite, niveau, departement, matricule, req.user.id]
      );
    } else if (req.user.role === 'entreprise') {
      await db.query(
        'UPDATE Entreprise SET adr = ?, tel = ?, secteur = ? WHERE id_entr = ?',
        [adr, tel, secteur, req.user.id]
      );
    } else if (req.user.role === 'chef_dept') {
      await db.query(
        'UPDATE ChefDepartement SET universite = ?, departement = ? WHERE id_chef = ?',
        [universite, departement, req.user.id]
      );
    } else if (req.user.role === 'admin') {
      await db.query(
        'UPDATE Administrateur SET universite = ? WHERE id_adm = ?',
        [universite, req.user.id]
      );
    }

    res.json({ 
      success: true,
      message: 'Profil mis à jour avec succès'
    });
  } catch (err) {
    console.error('Erreur lors de la mise à jour du profil:', err);
    res.status(500).json({ 
      success: false,
      error: 'Erreur lors de la mise à jour' 
    });
  }
};
exports.changePassword = async (req, res) => {
  const { currentPassword, newPassword, confirmPassword } = req.body;
  const userId = req.user.id;

  try {
    // 1. Validation des données
    if (newPassword !== confirmPassword) {
      return res.status(400).json({ error: "Les mots de passe ne correspondent pas" });
    }
    if (newPassword.length < 8) {
      return res.status(400).json({ error: "Le mot de passe doit contenir au moins 8 caractères" });
    }

    // 2. Récupérer l'utilisateur
    const [userRows] = await db.query('SELECT mdps FROM Utilisateur WHERE id = ?', [userId]);
    if (userRows.length === 0) {
      return res.status(404).json({ error: "Utilisateur non trouvé" });
    }

    // 3. Vérifier l'ancien mot de passe
    const passwordMatch = await bcrypt.compare(currentPassword, userRows[0].mdps);
    if (!passwordMatch) {
      return res.status(401).json({ error: "Mot de passe actuel incorrect" });
    }

    // 4. Hacher et sauvegarder le nouveau mot de passe
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await db.query('UPDATE Utilisateur SET mdps = ? WHERE id = ?', [hashedPassword, userId]);

    res.json({ success: true, message: "Mot de passe changé avec succès" });
  } catch (error) {
    console.error('Erreur changement mot de passe:', error);
    res.status(500).json({ error: "Erreur serveur" });
  }
};
exports.logout = async (req, res) => {
  try {
    res.json({ 
      success: true,
      message: "Déconnexion réussie" 
    });
  } catch (error) {
    console.error('Erreur déconnexion:', error);
    res.status(500).json({ 
      success: false,
      error: "Erreur lors de la déconnexion" 
    });
  }
};



// Étape 1 — Envoyer un code de vérification par email
exports.sendResetCode = async (req, res) => {
  const { email } = req.body;

  try {
    // Vérifier d'abord si l'email existe
    const [users] = await db.query('SELECT * FROM Utilisateur WHERE email = ?', [email]);
    if (users.length === 0) {
      return res.status(404).json({ error: 'Email non trouvé' });
    }

    const resetToken = Math.floor(100000 + Math.random() * 900000).toString(); // Génère un code à 6 chiffres
    const expireTime = new Date(Date.now() + 3600000); // 1 heure

    await db.query(
      'UPDATE Utilisateur SET reset_token = ?, reset_token_expire = ? WHERE email = ?',
      [resetToken, expireTime, email]
    );

    // Utiliser la fonction existante de mailer.js
    await sendResetPasswordEmail(email, resetToken, users[0].prenom);

    res.status(200).json({ message: 'Code envoyé avec succès' });
  } catch (err) {
    console.error('Erreur sendResetCode:', err);
    res.status(500).json({ error: 'Impossible d\'envoyer le code' });
  }
};

// Étape 2 — Vérifier le code
exports.verifyResetCode = async (req, res) => {
  const { email, code } = req.body;

  try {
    const [users] = await db.query(
      'SELECT * FROM Utilisateur WHERE email = ? AND reset_token = ? AND reset_token_expire > NOW()',
      [email, code]
    );
    
    if (users.length === 0) {
      return res.status(400).json({ error: 'Code invalide ou expiré' });
    }
    

    res.status(200).json({ message: 'Code vérifié avec succès' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
};


// Étape 3 — Changer le mot de passe
exports.setNewPassword = async (req, res) => {
  const { email, newPassword } = req.body;

  // Debug: Log des données reçues
  console.log("Données reçues:", { email, newPassword });

  try {
    // 1. Validation basique
    if (!email || !newPassword) {
      return res.status(400).json({ 
        error: 'Email et mot de passe requis' 
      });
    }

    // 2. Vérification de l'utilisateur
    const [user] = await db.query(
      'SELECT * FROM Utilisateur WHERE email = ?', 
      [email]
    );

    if (!user.length) {
      return res.status(404).json({ 
        error: 'Utilisateur non trouvé' 
      });
    }

    // 3. Mise à jour du mot de passe
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    
    await db.query(
      `UPDATE Utilisateur 
       SET mdps = ?, reset_token = NULL, reset_token_expire = NULL 
       WHERE email = ?`,
      [hashedPassword, email]
    );

    // Debug: Confirmation
    console.log("Mot de passe mis à jour pour:", email);
    
    return res.status(200).json({ 
      success: true,
      message: 'Mot de passe mis à jour avec succès' 
    });

  } catch (err) {
    // Debug: Erreur complète
    console.error("Erreur dans setNewPassword:", err);
    
    return res.status(500).json({ 
      error: 'Erreur serveur',
      details: err.message 
    });
  }
};
