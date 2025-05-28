// EsqueciSenha.js
import { useState } from 'react';
import api from '../axiosConfig';

export default function EsqueciSenha() {
const [email, setEmail] = useState('');
const [mensagem, setMensagem] = useState('');

const handleEnviar = async (e) => {
    e.preventDefault();
    try {
    await api.post('/esqueci-senha', { email });
    setMensagem('Verifique seu e-mail para redefinir a senha.');
    } catch (error) {
    setMensagem('Erro ao enviar solicitação.');
    }
};

return (
    <div className="max-w-md mx-auto mt-10 bg-white p-6 rounded shadow">
    <h2 className="text-xl font-bold mb-4">Recuperar senha</h2>
    <form onSubmit={handleEnviar}>
        <input
        type="email"
        placeholder="Digite seu e-mail"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full p-2 mb-4 border rounded"
        required
        />
        <button
        type="submit"
        className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
        >
        Enviar link de redefinição
        </button>
    </form>
    {mensagem && <p className="mt-4 text-green-600">{mensagem}</p>}
    </div>
);
}
