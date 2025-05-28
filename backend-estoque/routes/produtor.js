// Importa o Express e cria um roteador
const express = require("express");
const router = express.Router();

// Importa a conexão com o banco de dados que vem do index.js
const conexao = require("../index").conexao;

// Importa o middleware que protege com JWT
const verificaToken = require("../middlewares/verificaToken");

// ROTA GET: lista todos os produtos (apenas com token válido)
router.get("/", verificaToken, (req, res) => {
  const sql = "SELECT * FROM produtos";
conexao.query(sql, (err, resultado) => {
    if (err) return res.status(500).json({ erro: err });
    res.json(resultado); // retorna todos os produtos em JSON
});
});

// ROTA POST: adiciona um novo produto ao banco (apenas com token válido)
router.post("/", verificaToken, (req, res) => {
const { nome, quantidade, preco, validade, estoque_min } = req.body;

const sql = `
    INSERT INTO produtos (nome, quantidade, preco, validade, estoque_min)
    VALUES (?, ?, ?, ?, ?)`;

conexao.query(sql, [nome, quantidade, preco, validade, estoque_min], (err, resultado) => {
    if (err) return res.status(500).json({ erro: err });

    res.status(201).json({
    mensagem: "Produto inserido com sucesso!",
    id: resultado.insertId,
    });
});
});

// Exporta o roteador para usar no arquivo principal
module.exports = router;
