// Importa a biblioteca JWT para verificar os tokens
const jwt = require("jsonwebtoken");

// Middleware responsável por proteger as rotas usando o token JWT
function verificaToken(req, res, next) {
  // Pega o token enviado no cabeçalho da requisição
const token = req.headers["authorization"];

  // Se o token não for enviado, retorna erro
if (!token) {
    return res.status(401).json({ erro: "Token não fornecido." });
}

  // Verifica se o token é válido
jwt.verify(token, "seu_segredo_jwt", (err, decoded) => {
    if (err) {
    return res.status(403).json({ erro: "Token inválido ou expirado." });
    }

    // Se estiver tudo certo, salva os dados do usuário no request
    req.usuario = decoded;
    next(); // chama o próximo passo da rota
});
}

// Exporta o middleware para poder ser usado em outras partes do sistema
module.exports = verificaToken;

