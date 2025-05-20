const app = require('../index');
require('dotenv').config();
z
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`✅ Serveur démarré sur le port ${PORT}`);
  });;
