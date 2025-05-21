const db = require('../config/db');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const { sendChefAccountEmail } = require('../utils/mailer');
const adminController = require('../controllers/adminController');
exports.createChef = async (req, res) => {
  try {
    const { nom, prenom, email, departement, universite = 'UMBB' } = req.body;
    
    const [existing] = await db.query('SELECT * FROM Utilisateur WHERE email = ?', [email]);
    if (existing.length > 0) {
      return res.status(400).json({ error: 'Email déjà utilisé' });
    }

    const randomPassword = crypto.randomBytes(8).toString('hex');
    const hashedPassword = await bcrypt.hash(randomPassword, 10);
    
    const [userRes] = await db.query(
      'INSERT INTO Utilisateur (nom, prenom, email, mdps, role, email_verifie) VALUES (?, ?, ?, ?, ?, ?)',
      [nom, prenom, email, hashedPassword, 'chef_dept', true]
    );
    
    const userId = userRes.insertId;
    
    await db.query(
      'INSERT INTO ChefDepartement (id_chef, universite, departement) VALUES (?, ?, ?)',
      [userId, universite, departement]
    );
    
    // Remplacer par la nouvelle fonction
await sendChefAccountEmail(email, randomPassword, prenom);  
    res.status(201).json({ 
      success: true,
      message: 'Chef de département créé avec succès'
    });
    
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

exports.listChefs = async (req, res) => {
  try {
    const [chefs] = await db.query(`
      SELECT u.id, u.nom, u.prenom, u.email, c.departement, c.universite 
      FROM Utilisateur u
      JOIN ChefDepartement c ON u.id = c.id_chef
      WHERE u.role = 'chef_dept'
    `);
    
    res.json({ chefs });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

exports.deleteChef = async (req, res) => {
  try {
    const { id } = req.params;
    
    await db.query('DELETE FROM Utilisateur WHERE id = ? AND role = "chef_dept"', [id]);
    
    res.json({ 
      success: true,
      message: 'Chef supprimé avec succès'
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

