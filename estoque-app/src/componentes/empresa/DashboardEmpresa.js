import { useState, useEffect } from 'react';
import PerfilEmpresa from './PerfilEmpresa';
import CardDeposito from './CardDeposito';
import TelaDeposito from './TelaDeposito';
import ModalDeposito from './ModalDeposito';
import api from '../../axiosConfig';

export default function DashboardEmpresa(props) {
  const [depositos, setDepositos] = useState([]);
  const [depositoAtivo, setDepositoAtivo] = useState(null);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [depositoEditar, setDepositoEditar] = useState(null);
  const [perfilAberto, setPerfilAberto] = useState(false);
  const [zoomId, setZoomId] = useState(null); // novo estado
  const [empresaImg, setEmpresaImg] = useState(null); // estado para a imagem da empresa

  // Logout handler
  function aoDeslogar() {
    localStorage.removeItem('token');
    localStorage.removeItem('tipo');
    localStorage.removeItem('empresa_id');
    window.location.href = '/login';
  }

  // Carrega depósitos ao montar
  useEffect(() => {
    atualizarDepositos();
  }, []);

  // Atualiza lista de depósitos
  function atualizarDepositos() {
    api.get('/depositos')
      .then(res => {
        setDepositos(Array.isArray(res.data) ? res.data : []);
      })
      .catch(err => console.error('Erro ao atualizar depósitos:', err));
  }

  // Exclui depósito
  async function excluirDeposito(id) {
    try {
      await api.delete(`/depositos/${id}`);
      atualizarDepositos();
    } catch (erro) {
      console.error('Erro ao excluir depósito:', erro);
    }
  }

  // Função para animar o zoom ao entrar no depósito
  function entrarNoDeposito(id) {
    setZoomId(id); // ativa o zoom no card selecionado
    setTimeout(() => {
      setDepositoAtivo(id);
      setZoomId(null);
    }, 350); // tempo da animação
  }

  // Função para voltar (com animação reversa, opcional)
  function voltarDepositos() {
    setDepositoAtivo(null);
  }

  return (
    <div className="bg-[#015D4F] text-white min-h-screen p-4 flex flex-col">
      {/* Topo */}
      <div className="flex justify-between items-center mb-8">
        <div /> {/* Espaço à esquerda */}
        {!depositoAtivo && (
          <button
            onClick={() => setPerfilAberto(true)}
            className="flex items-center gap-2 bg-white text-[#015D4F] px-2 py-2 rounded-full shadow hover:bg-[#e6f4f1] font-semibold transition border border-[#015D4F]"
            style={{ width: 48, height: 48, justifyContent: 'center' }}
          >
            {empresaImg ? (
              <img src={empresaImg} alt="Perfil" className="object-cover w-10 h-10 rounded-full" />
            ) : (
              <svg className="w-8 h-8 text-[#015D4F]" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <circle cx="12" cy="8" r="4" />
                <path d="M4 20c0-4 4-7 8-7s8 3 8 7" />
              </svg>
            )}
          </button>
        )}
      </div>

      {/* Conteúdo principal */}
      <div className="flex flex-1">
        {/* Sidebar/menu lateral */}
        {!depositoAtivo && (
          <nav className="flex flex-col gap-4 bg-black/60 text-white rounded-lg shadow p-4 min-w-[180px] h-fit backdrop-blur-md">
            {/* ...menu... */}
            <button className="flex items-center gap-2 px-3 py-2 rounded hover:bg-[#015D4F]/70 transition font-semibold border border-transparent hover:border-[#015D4F]">
              {/* Ícone de saída */}
              <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7" />
              </svg>
              Saída
            </button>
            <button className="flex items-center gap-2 px-3 py-2 rounded hover:bg-[#015D4F]/70 transition font-semibold border border-transparent hover:border-[#015D4F]">
              {/* Ícone de validade */}
              <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Validade
            </button>
            <button className="flex items-center gap-2 px-3 py-2 rounded hover:bg-[#015D4F]/70 transition font-semibold border border-transparent hover:border-[#015D4F]">
              {/* Ícone de pouco estoque */}
              <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M20 13V7a2 2 0 00-2-2H6a2 2 0 00-2 2v6m16 0v6a2 2 0 01-2 2H6a2 2 0 01-2-2v-6m16 0H4" />
              </svg>
              Pouco Estoque
            </button>
          </nav>
        )}

        {/* Área de cards ou tela de depósito com animação de zoom */}
        <div className="flex-1 ml-8 relative overflow-hidden">
          {/* Cards de depósito */}
          {!depositoAtivo && (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 w-full max-w-5xl mx-auto">
              {depositos.map(deposito => (
                <div
                  key={deposito.id}
                  className={`transition-all duration-300 ${
                    zoomId === deposito.id
                      ? 'z-50 scale-125 opacity-0 pointer-events-none'
                      : zoomId
                      ? 'opacity-50 pointer-events-none'
                      : 'scale-100 opacity-100'
                  }`}
                  style={{ transitionProperty: 'transform, opacity' }}
                >
                  <CardDeposito
                    nome={deposito.nome}
                    onEntrar={() => entrarNoDeposito(deposito.id)}
                    onEditar={() => {
                      setDepositoEditar(deposito);
                      setMostrarModal(true);
                    }}
                    onExcluir={() => excluirDeposito(deposito.id)}
                    className="bg-black/60 text-white rounded-lg shadow p-6 flex flex-col items-center justify-center border border-transparent hover:border-[#015D4F] transition cursor-pointer"
                  />
                </div>
              ))}
              {/* Botão Adicionar Depósito */}
              <button
                className="bg-black/60 text-white rounded-lg shadow p-6 flex items-center justify-center border border-transparent hover:border-[#015D4F] transition cursor-pointer font-semibold text-lg gap-2"
                onClick={() => {
                  setDepositoEditar(null);
                  setMostrarModal(true);
                }}
              >
                <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth={3} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 5v14m7-7H5" />
                </svg>
                <span className="text-base font-semibold">Adicionar Depósito</span>
              </button>
            </div>
          )}

          {/* Tela do depósito */}
          {depositoAtivo && (
            <div className="transition-all duration-300 origin-center absolute inset-0 scale-100 opacity-100">
              <TelaDeposito
                depositoId={depositoAtivo}
                depositoNome={depositos.find(d => d.id === depositoAtivo)?.nome}
                onVoltar={voltarDepositos}
              />
            </div>
          )}
        </div>
      </div>

      {/* Modal para adicionar/editar depósito */}
      <ModalDeposito
        aberto={mostrarModal}
        onFechar={() => setMostrarModal(false)}
        editar={!!depositoEditar}
        depositoEditar={depositoEditar}
        onSucesso={atualizarDepositos}
      />

      {/* Drawer de perfil (lado direito) */}
      <PerfilEmpresa
        aberto={perfilAberto}
        onClose={() => setPerfilAberto(false)}
        onLogout={aoDeslogar}
        empresaImg={empresaImg}
        setEmpresaImg={setEmpresaImg}
      />
    </div>
  );
}
