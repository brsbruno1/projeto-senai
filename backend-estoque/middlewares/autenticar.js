const jwt = require('jsonwebtoken');
const chaveSecreta = 'minha_chave_super_secreta';

function autenticar(req, res, next) {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ erro: 'Token não fornecido' });
  }

  try {
    const payload = jwt.verify(token.replace('Bearer ', ''), chaveSecreta);

    req.empresa_id = payload.empresa_id; // ✅ ESSA LINHA É ESSENCIAL
    req.tipo = payload.tipo;
    req.user_id = payload.id;

    next();
  } catch (err) {
    return res.status(401).json({ erro: 'Token inválido' });
  }
}

module.exports = autenticar;
