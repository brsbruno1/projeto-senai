// Importa o Express e cria um roteador
const express = require("express");
const router = express.Router();
const autenticar = require("../middlewares/autenticar");
// Importa a conexão com o banco de dados que vem do index.js
const conexao = require("../db");
// Importa o middleware que protege com JWT
const verificaToken = require("../middlewares/verificaToken");

// ROTA GET: lista todos os produtos (apenas com token válido)
router.get("/", autenticar, (req, res) => {
  const sql = "SELECT * FROM produtos";
  conexao.query(sql, (err, resultado) => {
    if (err) return res.status(500).json({ erro: err });
    res.json(resultado); // retorna todos os produtos em JSON
  });
});

// ROTA POST: adiciona um novo produto ao banco (apenas com token válido)
router.post("/", autenticar, (req, res) => {
  const { nome, quantidade, preco, validade, estoque_min, deposito_id } = req.body;
  const empresa_id = req.empresa_id; // vem do token

  const sql = `
    INSERT INTO produtos (nome, quantidade, preco, validade, estoque_min, deposito_id, empresa_id)
    VALUES (?, ?, ?, ?, ?, ?, ?)`;

  console.log("🟢 Recebido no backend:", nome, quantidade, preco, validade, estoque_min, deposito_id);

  conexao.query(
    sql,
    [nome, quantidade, preco, validade, estoque_min, deposito_id, empresa_id],
    (err, resultado) => {
      if (err) {
        console.error("❌ ERRO MYSQL:", err.message);           // aparece no terminal
        return res.status(500).json({ erro: err.message });     // aparece no alert do frontend
      }

      res.status(201).json({
        mensagem: "Produto inserido com sucesso!",
        id: resultado.insertId,
      });
    }
  );
});
module.exports = router;

