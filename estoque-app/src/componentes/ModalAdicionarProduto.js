import { useState } from 'react';
import api from '../axiosConfig';

export default function ModalAdicionarProduto({ aoFechar, aoAtualizar }) {
  const [nome, setNome] = useState('');
  const [quantidade, setQuantidade] = useState('');
  const [preco, setPreco] = useState('');
  const [validade, setValidade] = useState('');
  const [estoqueMin, setEstoqueMin] = useState('');

  async function adicionarProduto(e) {
    e.preventDefault();

    try {
      await api.post('/produtos', {
        nome,
        quantidade: parseInt(quantidade),
        preco: parseFloat(preco),
        validade,
        estoque_min: parseInt(estoqueMin)
      });

      aoAtualizar(); // atualiza a lista
      aoFechar();    // fecha o modal
    } catch (err) {
      console.error('Erro ao adicionar produto:', err);
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <form
        onSubmit={adicionarProduto}
        className="bg-white p-6 rounded-lg w-full max-w-md shadow-lg space-y-4"
      >
        <h2 className="text-xl font-semibold text-[#91592A] text-center">Novo Produto</h2>

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
          step="0.01"
          placeholder="Preço"
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
            Adicionar
          </button>
        </div>
      </form>
    </div>
  );
}
