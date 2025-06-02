const mysql = require('mysql');


//comentarioo
const conexao = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'estoque'
});

conexao.connect(err => {
  if (err) {
    console.error('Erro ao conectar no banco:', err);
  } else {
    console.log('Conectado ao banco de dados!');
  }
});

module.exports = conexao;