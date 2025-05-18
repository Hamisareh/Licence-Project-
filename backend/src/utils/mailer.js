const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
  service: 'gmail', // ou un autre service SMTP si tu n'utilises pas Gmail
  auth: {
    user: process.env.EMAIL_USER,  // ton email
    pass: process.env.EMAIL_PASS   // ton mot de passe ou app password
  }
  
});
console.log('EMAIL_USER:', process.env.EMAIL_USER);
console.log('EMAIL_PASS:', process.env.EMAIL_PASS);

exports.sendVerificationEmail = (to, token, prenom) => {
    const link = `http://192.168.246.20:5000/api/auth/confirm/${token}`;


  return transporter.sendMail({
    from: process.env.EMAIL_USER,
    to,
    subject: 'Vérifie ton email',
    html: `<p>Clique ici pour vérifier ton compte : <a href="${link}">Confirmer</a></p>`
  });
};

// ===== AJOUTEZ CE BLOC IMMÉDIATEMENT APRÈS LA CRÉATION DU TRANSPORTER =====
transporter.verify((error, success) => {
  if (error) {
    console.error('❌ Échec de la configuration du mailer:', error.message);
    console.error('Détails techniques:', {
      service: 'gmail',
      user: process.env.EMAIL_USER || 'non-configuré',
      errorCode: error.code
    });
  } else {
    console.log('✅ Mailer configuré avec succès', {
      service: 'gmail',
      user: process.env.EMAIL_USER,
      authMethod: 'OAuth2' // Gmail utilise généralement OAuth2
    });
  }
});


exports.sendResetPasswordEmail = async (to, code, prenom) => {
  const message = {
    from: process.env.EMAIL_USER,
    to,
    subject: 'Code de réinitialisation du mot de passe',
    html: `
      <p>Bonjour ${prenom},</p>
      <p>Voici ton <strong>code de réinitialisation</strong> :</p>
      <h2>${code}</h2>
      <p>Ce code est valable pendant quelques minutes.</p>
    `,
  };

  try {
    await transporter.sendMail(message);
    console.log(`Email de réinitialisation envoyé à ${to}`);
  } catch (error) {
    console.error('Erreur lors de l\'envoi de l\'email de réinitialisation:', error);
    throw new Error('Échec de l\'envoi du mail de réinitialisation');
  }
};
