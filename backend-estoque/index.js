const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const autenticar = require('./middlewares/autenticar');
const rotaProdutos = require('./routes/produto');
const conexao = require('./db'); // no index.js

const app = express();
app.use(express.json());
app.use(cors());
app.use('/produtos', rotaProdutos);


const saltRounds = 10;
const chaveSecreta = 'minha_chave_super_secreta';




// LOGIN
app.post("/login", async (req, res) => {
  console.log("🔍 Dados recebidos no login:", req.body);

  const { usuario, senha, tipo } = req.body;

  if (!tipo || (tipo !== "empresa" && tipo !== "funcionario")) {
    console.log("Tipo inválido:", tipo);
    return res.status(400).json({ erro: "Tipo de usuário inválido." });
  }

  const tabela = tipo === "empresa" ? "empresas" : "usuarios";
  const campoUsuario = "usuario";

  const sql = `SELECT * FROM ${tabela} WHERE ${campoUsuario} = ?`;
  console.log("🧪 SQL:", sql);

  conexao.query(sql, [usuario], async (err, resultado) => {
    if (err) {
      console.error("Erro MySQL:", err);
      return res.status(500).json({ erro: "Erro interno" });
    }

    if (resultado.length === 0) {
      return res.status(401).json({ erro: "Usuário não encontrado" });
    }

    const user = resultado[0];
    const bcrypt = require('bcryptjs');
    const senhaValida = await bcrypt.compare(senha, user.senha_hash);

    if (!senhaValida) {
      return res.status(401).json({ erro: "Senha incorreta" });
    }
const token = jwt.sign({ id: user.id, tipo, empresa_id: user.id }, chaveSecreta, { expiresIn: '1d' });

return res.json({
  token,
  tipo,
  usuario: user.usuario,
  empresa_id: user.id // 🔧 novo campo retornado
});

  });
});


// CADASTRO DE USUÁRIOS (empresa ou funcionário)
app.post('/cadastrar', async (req, res) => {
  const { usuario, senha, tipo, empresa_id } = req.body;

  if (!usuario || !senha || !tipo) {
    return res.status(400).json({ erro: 'Usuário, senha e tipo são obrigatórios' });
  }

  try {
    const senhaHash = await bcrypt.hash(senha, saltRounds);
    const sql = 'INSERT INTO usuarios (usuario, senha_hash, tipo, empresa_id) VALUES (?, ?, ?, ?)';

    conexao.query(sql, [usuario, senhaHash, tipo, empresa_id || null], (err, result) => {
      if (err) {
        if (err.code === 'ER_DUP_ENTRY') {
          return res.status(409).json({ erro: 'Usuário já existe' });
        }
        return res.status(500).json({ erro: 'Erro ao cadastrar usuário' });
      }
      res.status(201).json({ mensagem: 'Usuário cadastrado com sucesso' });
    });
  } catch (err) {
    res.status(500).json({ erro: 'Erro interno no servidor' });
  }
});

// GET /produtos (somente os da empresa logada)
app.get('/produtos', autenticar, (req, res) => {
  const empresa_id = req.empresa_id;
  const sql = `
    SELECT p.*
    FROM produtos p
    JOIN depositos d ON p.deposito_id = d.id
    WHERE d.empresa_id = ?
  `;
  conexao.query(sql, [empresa_id], (err, resultado) => {
    if (err) return res.status(500).json({ erro: 'Erro ao buscar produtos' });
    res.json(resultado);
  });
});

// POST /produtos
app.post('/produtos', autenticar, (req, res) => {
  const { nome, quantidade, preco, validade, estoque_min, deposito_id } = req.body;
  const empresa_id = req.empresa_id;

  const sql = `
    INSERT INTO produtos (nome, quantidade, preco, validade, estoque_min, deposito_id, empresa_id)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;
  conexao.query(sql, [nome, quantidade, preco, validade, estoque_min, deposito_id, empresa_id], (err, resultado) => {
    if (err) {
  console.error("❌ ERRO MYSQL:", err.message); // log no terminal
  return res.status(500).json({ erro: err.message }); // agora o front vai ver isso no alert
}

    res.status(201).json({
      mensagem: 'Produto cadastrado com sucesso',
      id: resultado.insertId
    });
  });
});

// ✅ ROTA: Atualizar nome do depósito
app.put('/depositos/:id', autenticar, (req, res) => {
  const { id } = req.params;
  const { nome } = req.body;

  if (!nome) {
    return res.status(400).json({ erro: 'Nome é obrigatório.' });
  }

  const sql = 'UPDATE depositos SET nome = ? WHERE id = ?';
  conexao.query(sql, [nome, id], (err, resultado) => {
    if (err) {
      console.error('Erro ao atualizar depósito:', err);
      return res.status(500).json({ erro: 'Erro ao atualizar depósito.' });
    }

    return res.json({ mensagem: 'Depósito atualizado com sucesso.' });
  });
});

// ✅ ROTA: Deletar depósito
app.delete('/depositos/:id', autenticar, (req, res) => {
  const { id } = req.params;

  const sql = 'DELETE FROM depositos WHERE id = ?';
  conexao.query(sql, [id], (err, resultado) => {
    if (err) {
      console.error('Erro ao deletar depósito:', err);
      return res.status(500).json({ erro: 'Erro ao deletar depósito.' });
    }

    if (resultado.affectedRows === 0) {
      return res.status(404).json({ erro: 'Depósito não encontrado.' });
    }

    return res.json({ mensagem: 'Depósito deletado com sucesso.' });
  });
});





// PUT /produtos/:id
app.put('/produtos/:id', autenticar, (req, res) => {
  const id = req.params.id;
  const { nome, quantidade, preco, validade, estoque_min } = req.body;

  const sql = `
    UPDATE produtos
    SET nome = ?, quantidade = ?, preco = ?, validade = ?, estoque_min = ?
    WHERE id = ?
  `;
  conexao.query(sql, [nome, quantidade, preco, validade, estoque_min, id], (err) => {
    if (err) return res.status(500).send(err);
    res.sendStatus(200);
  });
});

// DELETE /produtos/:id
app.delete('/produtos/:id', autenticar, (req, res) => {
  const id = req.params.id;
  const sql = 'DELETE FROM produtos WHERE id = ?';
  conexao.query(sql, [id], (err) => {
    if (err) return res.status(500).send(err);
    res.sendStatus(204);
  });
});

// GET /depositos
app.get('/depositos', autenticar, (req, res) => {
  const empresa_id = req.empresa_id; // ✅ vem do token

  if (!empresa_id) {
    return res.status(400).json({ erro: 'Empresa ID não encontrado no token' });
  }

  const sql = 'SELECT * FROM depositos WHERE empresa_id = ?';
  conexao.query(sql, [empresa_id], (err, resultados) => {
    if (err) {
      console.error('Erro ao buscar depósitos:', err);
      return res.status(500).json({ erro: 'Erro ao buscar depósitos' });
    }

    return res.json(resultados); // ✅ sempre retorna um array
  });
});


// ✅ ROTA: Cadastrar novo depósito
app.post('/depositos', autenticar, (req, res) => {
  const { nome, empresa_id } = req.body;

  if (!nome || !empresa_id) {
    return res.status(400).json({ erro: 'Nome e empresa_id são obrigatórios.' });
  }

  const sql = 'INSERT INTO depositos (nome, empresa_id) VALUES (?, ?)';
  conexao.query(sql, [nome, empresa_id], (err, resultado) => {
    if (err) {
      console.error('Erro ao inserir depósito:', err);
      return res.status(500).json({ erro: 'Erro ao criar depósito.' });
    }

    return res.status(201).json({ mensagem: 'Depósito criado com sucesso', id: resultado.insertId });
  });
});


// GET /usuarios (somente funcionários da empresa logada)
app.get('/usuarios', autenticar, (req, res) => {
  const empresa_id = req.empresa_id;

  const sql = `
    SELECT id, usuario, tipo
    FROM usuarios
    WHERE empresa_id = ? AND tipo = 'funcionario'
  `;
  conexao.query(sql, [empresa_id], (err, resultado) => {
    if (err) return res.status(500).send(err);
    res.json(resultado);
  });
});

app.listen(3001, () => {
  console.log('API rodando na porta 3001');
});
