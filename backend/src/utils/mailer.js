const nodemailer = require('nodemailer');

require('dotenv').config();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Vérification de la configuration
transporter.verify((error, success) => {
  if (error) {
    console.error('❌ Échec de la configuration du mailer:', error.message);
  } else {
    console.log('✅ Mailer configuré avec succès');
  }
});

// Version originale pour les étudiants/entreprises
exports.sendVerificationEmail = (to, token, prenom) => {
  const link = `http://192.168.90.20:5000/api/auth/confirm/${token}`;
  
  return transporter.sendMail({
    from: process.env.EMAIL_USER,
    to,
    subject: 'Vérifie ton email',
    html: `<p>Bonjour ${prenom}, clique ici pour vérifier ton compte : <a href="${link}">Confirmer</a></p>`
  });
};

// Nouvelle version pour les chefs créés par admin
exports.sendChefAccountEmail = (to, password, prenom) => {
  return transporter.sendMail({
    from: process.env.EMAIL_USER,
    to,
    subject: 'Votre compte chef de département',
    html: `
      <p>Bonjour ${prenom},</p>
      <p>Un compte chef de département a été créé pour vous.</p>
      <p>Votre mot de passe temporaire est : <strong>${password}</strong></p>
      <p>Connectez-vous ici : <a href="http://localhost:5173/connexion">Connexion</a></p>
      <p>Changez ce mot de passe après votre première connexion.</p>
    `
  });
};

// Version originale pour la réinitialisation
exports.sendResetPasswordEmail = async (to, code, prenom) => {
  const message = {
    from: process.env.EMAIL_USER,
    to,
    subject: 'Code de réinitialisation du mot de passe',
    html: `
      <p>Bonjour ${prenom},</p>
      <p>Voici ton code de réinitialisation :</p>
      <h2>${code}</h2>
      <p>Ce code est valable 1 heure.</p>
    `
  };

  try {
    await transporter.sendMail(message);
    console.log(`Email envoyé à ${to}`);
  } catch (error) {
    console.error('Erreur:', error);
    throw error;
  }
};