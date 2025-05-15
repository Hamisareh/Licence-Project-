const jwt = require('jsonwebtoken');

exports.verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  console.log('Header Authorization reçu :', authHeader);

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    console.log('Token manquant ou invalide');
    return res.status(401).json({ error: 'Token manquant ou invalide' });
  
  }
console.log('Headers reçus:', req.headers);
console.log('Méthode HTTP:', req.method);
  const token = authHeader.split(' ')[1];
  console.log('Token extrait :', token);

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    console.error('Erreur lors de la vérification du token :', err);
    return res.status(403).json({ error: 'Token invalide ou expiré' });
  }
};

exports.requireRole = (role) => {
  return (req, res, next) => {
    if (req.user.role !== role) {
      return res.status(403).json({ error: 'Accès refusé : rôle requis = ' + role });
    }
    next();
  };
};