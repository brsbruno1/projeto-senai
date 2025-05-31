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
      <div className="bg-white text-[#91592A] rounded p-6 w-full max-w-md shadow-lg">
        <h2 className="text-xl font-semibold mb-4">Adicionar Produto</h2>
        <form onSubmit={handleSubmit} className="space-y-3">
          <input type="text" placeholder="Nome do produto" value={nome} onChange={e => setNome(e.target.value)} className="w-full p-2 border rounded" />
          <input type="number" placeholder="Quantidade" value={quantidade} onChange={e => setQuantidade(e.target.value)} className="w-full p-2 border rounded" />
          <input type="number" step="0.01" placeholder="Preço" value={preco} onChange={e => setPreco(e.target.value)} className="w-full p-2 border rounded" />
          <input type="date" placeholder="Validade" value={validade} onChange={e => setValidade(e.target.value)} className="w-full p-2 border rounded" />
          <input type="number" placeholder="Estoque mínimo" value={estoqueMinimo} onChange={e => setEstoqueMinimo(e.target.value)} className="w-full p-2 border rounded" />

          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400">Cancelar</button>
            <button type="submit" className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">Adicionar</button>
          </div>
        </form>
      </div>
    </div>
  );
}
