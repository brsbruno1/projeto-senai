const jwt = require('jsonwebtoken');
const chaveSecreta = 'minha_chave_super_secreta';

function autenticar(req, res, next) {
const token = req.headers['authorization'];
if (!token) return res.status(401).json({ erro: 'Token ausente' });

jwt.verify(token, chaveSecreta, (err, dados) => {
    if (err) return res.status(403).json({ erro: 'Token inválido' });

    req.usuario_id = dados.id;
    req.usuario = dados.usuario;
    req.tipo = dados.tipo;
    req.empresa_id = dados.empresa_id;
next();
});
}

module.exports = autenticar;