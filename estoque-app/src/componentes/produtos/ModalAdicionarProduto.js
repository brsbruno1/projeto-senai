import { useState } from 'react';
import api from '../../axiosConfig';

export default function ModalAdicionarProduto({ depositoId, onClose, onProdutoAdicionado }) {
  const [nome, setNome] = useState('');
  const [quantidade, setQuantidade] = useState('');
  const [preco, setPreco] = useState('');
  const [validade, setValidade] = useState('');
  const [estoqueMinimo, setEstoqueMinimo] = useState('');

const handleSubmit = async (e) => {
  e.preventDefault();

  const dados = {
  nome,
  quantidade: parseInt(quantidade),
  preco: parseFloat(preco),
  validade,
  estoque_min: parseInt(estoqueMinimo),
  deposito_id: depositoId
};

  console.log("🟢 Enviando dados para o backend:", JSON.stringify(dados, null, 2)); // ✅ Mostra o conteúdo exato enviado

  try {
    await api.post('/produtos', dados);
    onProdutoAdicionado();
} catch (erro) {
  console.error('❌ Erro ao adicionar produto:', erro);

  if (erro.response?.data?.erro) {
    alert(`Erro do servidor: ${erro.response.data.erro}`);
  } else if (erro.message) {
    alert(`Erro inesperado: ${erro.message}`);
  } else {
    alert('Erro ao adicionar produto.');
  }
}



};


  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white text-[#015D4F] rounded p-6 w-full max-w-md shadow-lg">
        <h2 className="text-2xl font-bold mb-4 text-[#015D4F]">Adicionar Produto</h2>
        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            type="text"
            placeholder="Nome do produto"
            value={nome}
            onChange={e => setNome(e.target.value)}
            className="w-full p-2 border rounded text-[#015D4F] placeholder-[#6bb7a6] focus:outline-none focus:ring-2 focus:ring-[#015D4F]"
          />
          <input
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            placeholder="Quantidade"
            value={quantidade}
            onChange={e => setQuantidade(e.target.value.replace(/\D/,''))}
            className="w-full p-2 border rounded text-[#015D4F] placeholder-[#6bb7a6] focus:outline-none focus:ring-2 focus:ring-[#015D4F]"
          />
          <input
            type="text"
            inputMode="decimal"
            pattern="[0-9.]*"
            placeholder="Preço"
            value={preco}
            onChange={e => setPreco(e.target.value.replace(/[^0-9.]/g,''))}
            className="w-full p-2 border rounded text-[#015D4F] placeholder-[#6bb7a6] focus:outline-none focus:ring-2 focus:ring-[#015D4F]"
          />
          <input
            type="date"
            placeholder="Validade"
            value={validade}
            onChange={e => setValidade(e.target.value)}
            className="w-full p-2 border rounded text-[#015D4F] placeholder-[#6bb7a6] focus:outline-none focus:ring-2 focus:ring-[#015D4F]"
          />
          <input
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            placeholder="Estoque mínimo"
            value={estoqueMinimo}
            onChange={e => setEstoqueMinimo(e.target.value.replace(/\D/,''))}
            className="w-full p-2 border rounded text-[#015D4F] placeholder-[#6bb7a6] focus:outline-none focus:ring-2 focus:ring-[#015D4F]"
          />

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-transparent text-[#015D4F] rounded border border-[#015D4F] hover:bg-[#015D4F] hover:text-white transition"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-[#015D4F] text-white rounded hover:bg-[#013e35] transition"
            >
              Adicionar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
