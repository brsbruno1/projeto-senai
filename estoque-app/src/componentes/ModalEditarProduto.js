import { useState, useEffect } from 'react';
import api from '../axiosConfig';

export default function ModalEditarProduto({ produto, aoFechar, aoAtualizar }) {
  const [nome, setNome] = useState('');
  const [quantidade, setQuantidade] = useState('');
  const [preco, setPreco] = useState('');
  const [validade, setValidade] = useState('');
  const [estoqueMin, setEstoqueMin] = useState('');

  useEffect(() => {
    if (produto) {
      setNome(produto.nome);
      setQuantidade(produto.quantidade);
      setPreco(produto.preco);
      setValidade(produto.validade?.slice(0, 10)); // Formato yyyy-mm-dd
      setEstoqueMin(produto.estoque_min);
    }
  }, [produto]);

  async function salvarEdicao(e) {
    e.preventDefault();

    try {
      await api.put(`/produtos/${produto.id}`, {
        nome,
        quantidade,
        preco,
        validade,
        estoque_min: estoqueMin
      });

      aoAtualizar();  // Atualiza lista no pai
      aoFechar();     // Fecha o modal
    } catch (err) {
      console.error('Erro ao atualizar produto:', err);
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <form onSubmit={salvarEdicao} className="bg-white p-6 rounded-lg w-full max-w-md shadow-lg space-y-4 relative">
        <h2 className="text-xl font-semibold text-[#91592A] text-center">Editar Produto</h2>

        <input
          value={nome}
          onChange={e => setNome(e.target.value)}
          placeholder="Nome"
          className="w-full p-2 border rounded"
          required
        />

        <input
          value={quantidade}
          onChange={e => setQuantidade(e.target.value)}
          type="number"
          placeholder="Quantidade"
          className="w-full p-2 border rounded"
          required
        />

        <input
          value={preco}
          onChange={e => setPreco(e.target.value)}
          type="number"
          placeholder="Preço"
          step="0.01"
          className="w-full p-2 border rounded"
        />

        <input
          value={validade}
          onChange={e => setValidade(e.target.value)}
          type="date"
          placeholder="Validade"
          className="w-full p-2 border rounded"
        />

        <input
          value={estoqueMin}
          onChange={e => setEstoqueMin(e.target.value)}
          type="number"
          placeholder="Estoque mínimo"
          className="w-full p-2 border rounded"
        />

        <div className="flex justify-between mt-4">
          <button
            type="button"
            onClick={aoFechar}
            className="bg-gray-300 text-black px-4 py-2 rounded"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="bg-[#91592A] text-white px-4 py-2 rounded hover:bg-[#7a4723]"
          >
            Salvar
          </button>
        </div>
      </form>
    </div>
  );
}
