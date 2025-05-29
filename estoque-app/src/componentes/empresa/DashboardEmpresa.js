import { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import CardDeposito from './CardDeposito';
import TelaDeposito from './TelaDeposito';
import ModalDeposito from './ModalDeposito';
import api from '../../axiosConfig';

export default function DashboardEmpresa() {
  const [depositos, setDepositos] = useState([]);
  const [depositoAtivo, setDepositoAtivo] = useState(null);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [depositoEditar, setDepositoEditar] = useState(null);

  function aoDeslogar() {
    localStorage.removeItem('token');
    localStorage.removeItem('tipo');
    localStorage.removeItem('empresa_id');
    window.location.href = '/login';
  }

  useEffect(() => {
    atualizarDepositos();
  }, []);

  function atualizarDepositos() {
    api.get('/depositos')
      .then(res => {
        console.log("📦 Dados recebidos do backend:", res.data);
        setDepositos(Array.isArray(res.data) ? res.data : []);
      })
      .catch(err => console.error('Erro ao atualizar depósitos:', err));
  }

  async function excluirDeposito(id) {
    try {
      await api.delete(`/depositos/${id}`);
      atualizarDepositos();
    } catch (erro) {
      console.error('Erro ao excluir depósito:', erro);
    }
  }

  return (
    <div className="min-h-screen bg-[#91592A] text-white p-6 relative">
      <Sidebar onLogout={aoDeslogar} />

      {!depositoAtivo ? (
        <div className="flex flex-col items-center justify-center mt-20">
          <h1 className="text-3xl font-bold mb-6">Área da Empresa</h1>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 w-full max-w-5xl">
            {depositos.map(deposito => (
              <CardDeposito
                key={deposito.id}
                nome={deposito.nome}
                onEntrar={() => setDepositoAtivo(deposito.id)}
                onEditar={() => {
                  setDepositoEditar(deposito);
                  setMostrarModal(true);
                }}
                onExcluir={() => excluirDeposito(deposito.id)} // ✅ NOVO
              />
            ))}

            <div
              className="bg-white text-[#91592A] flex items-center justify-center text-4xl rounded-lg cursor-pointer hover:bg-gray-100 h-28"
              onClick={() => {
                setDepositoEditar(null);
                setMostrarModal(true);
              }}
            >
              +
            </div>
          </div>
        </div>
      ) : (
        <TelaDeposito depositoId={depositoAtivo} onVoltar={() => setDepositoAtivo(null)} />
      )}

      <ModalDeposito
        aberto={mostrarModal}
        onFechar={() => setMostrarModal(false)}
        editar={!!depositoEditar}
        depositoEditar={depositoEditar}
        onSucesso={atualizarDepositos}
      />
    </div>
  );
}
