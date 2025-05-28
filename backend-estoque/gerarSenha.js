const bcrypt = require('bcryptjs'); // 🔧 Certifique-se que está instalado

bcrypt.hash('123456', 10, (err, hash) => {
if (err) throw err;
  console.log('Hash gerado:', hash);
});

