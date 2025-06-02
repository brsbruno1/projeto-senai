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
  let sql = "SELECT * FROM produtos";
  const params = [];

  const deposito_id = req.query.deposito_id;

  if (deposito_id) {
    sql += " WHERE deposito_id = ?";
    params.push(deposito_id);
  }

  conexao.query(sql, params, (err, resultado) => {
    if (err) return res.status(500).json({ erro: err });
    res.json(resultado);
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


// ROTA PUT: atualiza um produto existente (apenas com token válido)
router.put("/:id", autenticar, (req, res) => {
  const { nome, quantidade, preco, validade, estoque_min, deposito_id } = req.body;
  const { id } = req.params;

  const sql = `
    UPDATE produtos
    SET nome = ?, quantidade = ?, preco = ?, validade = ?, estoque_min = ?, deposito_id = ?
    WHERE id = ?`;

  conexao.query(
    sql,
    [nome, quantidade, preco, validade, estoque_min, deposito_id, id],
    (err, resultado) => {
      if (err) {
        console.error("❌ Erro ao atualizar produto:", err.message);
        return res.status(500).json({ erro: err.message });
      }

      res.json({ mensagem: "Produto atualizado com sucesso!" });
    }
  );
});

router.put("/:id", autenticar, (req, res) => {
  const { nome, quantidade, preco, validade, estoque_min, deposito_id } = req.body;
  const { id } = req.params;

  const sql = `
    UPDATE produtos 
    SET nome = ?, quantidade = ?, preco = ?, validade = ?, estoque_min = ?, deposito_id = ?
    WHERE id = ?`;

  conexao.query(
    sql,
    [nome, quantidade, preco, validade, estoque_min, deposito_id, id],
    (err, resultado) => {
      if (err) {
        console.error("❌ Erro ao atualizar produto:", err.message);
        return res.status(500).json({ erro: err.message });
      }

      res.json({ mensagem: "Produto atualizado com sucesso!" });
    }
  );
});





module.exports = router;

