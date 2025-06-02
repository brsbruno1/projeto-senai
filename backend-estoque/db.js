const mysql = require('mysql');

const conexao = mysql.createConnection({
  host: '192.168.10.107',
  user: 'pocket stock',
  password: 'jqPX6kKRsdhUs@X3',
  database: 'estoque',
  port: 3306,
});

conexao.connect(err => {
  if (err) {
    console.error('Erro ao conectar no banco:', err);
  } else {
    console.log('Conectado ao banco de dados!');
  }
});

module.exports = conexao;