import { useState, useEffect } from 'react';

export default function Sidebar({ onLogout }) {
  const [aberto, setAberto] = useState(false);
  const [empresaId, setEmpresaId] = useState('');

  useEffect(() => {
    const id = localStorage.getItem('empresa_id') || '000000';
    setEmpresaId(id);
  }, []);

  return (
    <>
      {/* Botão ☰ fixo no topo esquerdo */}
      <button
        className="fixed top-6 left-4 z-50 text-2xl text-black"
        onClick={() => setAberto(!aberto)}
      >
        ☰
      </button>

      {/* Sidebar personalizada */}
      <div
        className={`fixed top-0 left-0 h-full w-72 bg-white shadow-lg px-4 py-6 rounded-tr-3xl rounded-br-3xl transform transition-transform duration-300 z-40 ${
          aberto ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <h2 className="text-xl font-bold mb-6">Painel da Empresa</h2>

        <div className="mb-6 text-sm text-[#91592A] border border-[#91592A] rounded px-3 py-2 bg-white">
          ID da empresa: <strong>{empresaId}</strong>
        </div>

        <ul className="space-y-3 text-sm">
          {[
            { label: 'Relatório de vendas' },
            { label: 'Validade de produtos' },
            { label: 'Produtos com pouco estoque' },
            { label: 'Saídas de estoque' },
            { label: 'Convites de funcionários' },
          ].map((item, index) => (
            <li
              key={index}
              className="bg-[#91592A] text-white rounded px-4 py-2 text-center cursor-pointer hover:bg-[#7a4723] transition"
            >
              {item.label}
            </li>
          ))}
        </ul>

        <button
          onClick={onLogout}
          className="mt-8 w-full bg-[#91592A] text-white px-4 py-2 rounded hover:bg-[#7a4723]"
        >
          Logout
        </button>
      </div>
    </>
  );
}
