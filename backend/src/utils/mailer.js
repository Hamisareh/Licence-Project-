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
    const link = `https://4cfc-105-235-130-115.ngrok-free.app/api/auth/confirm/${token}`;


  return transporter.sendMail({
    from: process.env.EMAIL_USER,
    to,
    subject: 'Vérifie ton email',
    html: `<p>Clique ici pour vérifier ton compte : <a href="${link}">Confirmer</a></p>`
  });
};
