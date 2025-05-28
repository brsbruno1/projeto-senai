import { useState } from 'react';
import api from '../axiosConfig';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';

export default function Login({ aoLogar }) {
  const [usuario, setUsuario] = useState('');
  const [senha, setSenha] = useState('');
  const [tipo, setTipo] = useState('empresa'); // ✅ empresa ou funcionario
  const [erro, setErro] = useState('');
  const navigate = useNavigate();

  async function handleLogin(e) {
    e.preventDefault();

    try {
      const resposta = await api.post('/login', {
        usuario,
        senha,
        tipo,
      });

      const token = resposta.data.token || resposta.data?.token;
      localStorage.setItem('token', token);
      localStorage.setItem('tipo', tipo); // ✅ salva o tipo para redirecionamento
      
      if (tipo === 'empresa') {
      localStorage.setItem('empresa_id', resposta.data.empresa_id); // ✅ só se for empresa
      } else {
      localStorage.removeItem('empresa_id'); // ❌ remove se for funcionário
      }

      aoLogar?.(); // Chama função externa (opcional)

      // Redireciona com base no tipo
      if (tipo === 'empresa') {
        navigate('/dashboard-empresa');
      } else {
        navigate('/dashboard-funcionario');
      }

    } catch (err) {
      const msg = err.response?.data?.erro || 'Erro ao fazer login';
      setErro(msg);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-100">
      <form
        onSubmit={handleLogin}
        className="bg-white p-8 rounded shadow-md w-full max-w-sm"
      >
        <h2 className="text-2xl font-bold mb-6 text-center text-[#91592A]">Login</h2>

        {erro && <p className="text-red-500 text-sm mb-4 text-center">{erro}</p>}

        <input
          type="text"
          value={usuario}
          onChange={e => setUsuario(e.target.value)}
          placeholder="Usuário"
          className="w-full p-2 mb-4 border rounded"
          required
        />

        <input
          type="password"
          value={senha}
          onChange={e => setSenha(e.target.value)}
          placeholder="Senha"
          className="w-full p-2 mb-4 border rounded"
          required
        />

        {/* Seleção de tipo de login */}
        <div className="flex justify-between items-center mb-4">
          <label className="flex items-center space-x-2">
            <input
              type="radio"
              name="tipo"
              value="empresa"
              checked={tipo === 'empresa'}
              onChange={() => setTipo('empresa')}
            />
            <span>Empresa</span>
          </label>

          <label className="flex items-center space-x-2">
            <input
              type="radio"
              name="tipo"
              value="funcionario"
              checked={tipo === 'funcionario'}
              onChange={() => setTipo('funcionario')}
            />
            <span>Funcionário</span>
          </label>
        </div>

        <button
          type="submit"
          className="bg-[#91592A] text-white w-full p-2 rounded hover:bg-[#7a4723]"
        >
          Entrar
        </button>

        <Link
          to="/cadastro"
          className="mt-3 w-full inline-block bg-gray-300 text-center text-black p-2 rounded hover:bg-gray-400"
        >
          Cadastrar novo usuário
        </Link>

        <Link
          to="/esqueci-senha"
          className="text-sm text-blue-500 hover:underline block text-center mt-2"
        >
          Esqueci minha senha
        </Link>
      </form>
    </div>
  );
}
