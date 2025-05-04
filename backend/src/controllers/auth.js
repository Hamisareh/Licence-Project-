const db = require('../config/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { sendVerificationEmail } = require('../utils/mailer');

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

exports.register = async (req, res) => {
  try {
    const {
      nom, prenom, email, mdps,
      role = 'etudiant',
      universite, specialite, niveau, departement,
      adr, tel, secteur
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
        'INSERT INTO Etudiant (id_etud, universite, specialite, niveau, departement) VALUES (?, ?, ?, ?, ?)',
        [id, universite, specialite, niveau, departement]
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
    } else if (role === 'admin') {
      await db.query('INSERT INTO Administrateur (id_adm) VALUES (?)', [id]);
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
      { expiresIn: '2h' }
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
      const [rows] = await db.query('SELECT universite, specialite, niveau, departement FROM Etudiant WHERE id_etud = ?', [user.id]);
      Object.assign(user, rows[0]);
    } else if (user.role === 'entreprise') {
      const [rows] = await db.query('SELECT adr, tel, secteur FROM Entreprise WHERE id_entr = ?', [user.id]);
      Object.assign(user, rows[0]);
    } else if (user.role === 'chef_dept') {
      const [rows] = await db.query('SELECT universite, departement FROM ChefDepartement WHERE id_chef = ?', [user.id]);
      Object.assign(user, rows[0]);
    }
    // admin : pas d’info spécifique

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
    mdps,
    universite,
    specialite,
    niveau,
    departement,
    adr,
    tel,
    secteur
  } = req.body;

  try {
    // Mise à jour des données communes dans la table Utilisateur
    await db.query(
      'UPDATE Utilisateur SET nom = ?, prenom = ?, email = ? WHERE id = ?',
      [nom, prenom, email, req.user.id]
    );

    // Mise à jour du mot de passe si fourni
    if (mdps && mdps.length < 8) {
      return res.status(400).json({ error: 'Le mot de passe doit contenir au moins 8 caractères' });
    }
    
    if (mdps && mdps.length >= 8) {
      const hashed = await bcrypt.hash(mdps, 10);
      await db.query('UPDATE Utilisateur SET mdps = ? WHERE id = ?', [hashed, req.user.id]);
    }
    

    // Mise à jour selon le rôle
    if (req.user.role === 'etudiant') {
      await db.query(
        'UPDATE Etudiant SET universite = ?, specialite = ?, niveau = ?, departement = ? WHERE id_etud = ?',
        [universite, specialite, niveau, departement, req.user.id]
      );
    } else if (req.user.role === 'entreprise') {
      await db.query(
        'UPDATE Entreprise SET adr = ?, tel = ?, secteur = ? WHERE id_entr = ?',
        [adr, tel, secteur, req.user.id]
      );
    } else if (req.user.role === 'chef_dept') {
      await db.query(
        'UPDATE Chef_dept SET universite = ?, departement = ? WHERE id_chef = ?',
        [universite, departement, req.user.id]
      );
    }

    res.json({ message: 'Profil mis à jour avec succès' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur lors de la mise à jour' });
  }
};
