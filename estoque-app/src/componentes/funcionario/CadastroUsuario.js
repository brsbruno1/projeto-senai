import { useState } from 'react';
import api from '../../axiosConfig';

export default function CadastroUsuario() {
  const [usuario, setUsuario] = useState('');
  const [senha, setSenha] = useState('');
  const [mensagem, setMensagem] = useState('');
  const [erro, setErro] = useState('');

  async function handleCadastro(e) {
    e.preventDefault();

    try {
      const resposta = await api.post('/cadastrar', {
        usuario,
        senha
      });

      setMensagem(resposta.data.mensagem || 'Usuário cadastrado com sucesso!');
      setErro('');
      setUsuario('');
      setSenha('');
    } catch (err) {
      const msg = err.response?.data?.erro || 'Erro ao cadastrar usuário';
      setErro(msg);
    }
  }

  return (
    <div className="max-w-md mx-auto mt-10 bg-white p-6 rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Cadastro de Usuário</h2>
      {mensagem && <div className="text-green-600 mb-4">{mensagem}</div>}
      {erro && <div className="text-red-600 mb-4">{erro}</div>}

      <form onSubmit={handleCadastro}>
        <input
          type="text"
          placeholder="Usuário"
          value={usuario}
          onChange={e => setUsuario(e.target.value)}
          className="w-full p-2 mb-4 border rounded"
          required
        />
        <input
          type="password"
          placeholder="Senha"
          value={senha}
          onChange={e => setSenha(e.target.value)}
          className="w-full p-2 mb-4 border rounded"
          required
        />
        <button
          type="submit"
          className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
        >
          Cadastrar
        </button>
      </form>
    </div>
  );
}
