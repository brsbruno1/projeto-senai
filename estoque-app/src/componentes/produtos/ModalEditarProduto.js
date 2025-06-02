import { useState, useEffect } from 'react';
import api from '../../axiosConfig';

export default function ModalEditarProduto({ produto, aoFechar, aoAtualizar }) {
  const [nome, setNome] = useState('');
  const [quantidade, setQuantidade] = useState('');
  const [preco, setPreco] = useState('');
  const [validade, setValidade] = useState('');
  const [estoqueMin, setEstoqueMin] = useState('');

  useEffect(() => {
    if (produto) {
      console.log("🟢 Produto para edição:", produto);
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
        estoque_min: estoqueMin,
        deposito_id: produto.deposito_id
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
        <h2 className="text-2xl font-bold mb-4 text-[#015D4F] text-center">Editar Produto</h2>

        <input
          value={nome}
          onChange={e => setNome(e.target.value)}
          placeholder="Nome"
          className="w-full p-2 border rounded text-[#015D4F] placeholder-[#015D4F] focus:outline-none focus:ring-2 focus:ring-[#015D4F]"
          required
        />

        <input
          value={quantidade}
          onChange={e => setQuantidade(e.target.value)}
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          placeholder="Quantidade"
          className="w-full p-2 border rounded text-[#015D4F] placeholder-[#015D4F] focus:outline-none focus:ring-2 focus:ring-[#015D4F]"
          required
        />

        <input
          value={preco}
          onChange={e => setPreco(e.target.value)}
          type="text"
          inputMode="decimal"
          pattern="[0-9.]*"
          placeholder="Preço"
          className="w-full p-2 border rounded text-[#015D4F] placeholder-[#015D4F] focus:outline-none focus:ring-2 focus:ring-[#015D4F]"
        />

        <input
          value={validade}
          onChange={e => setValidade(e.target.value)}
          type="date"
          placeholder="Validade"
          className="w-full p-2 border rounded text-[#015D4F] placeholder-[#015D4F] focus:outline-none focus:ring-2 focus:ring-[#015D4F]"
          style={{ colorScheme: "light" }}
        />

        <input
          value={estoqueMin}
          onChange={e => setEstoqueMin(e.target.value)}
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          placeholder="Estoque mínimo"
          className="w-full p-2 border rounded text-[#015D4F] placeholder-[#015D4F] focus:outline-none focus:ring-2 focus:ring-[#015D4F]"
        />

        <div className="flex justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={aoFechar}
            className="px-4 py-2 bg-transparent text-[#015D4F] rounded border border-[#015D4F] hover:bg-[#015D4F] hover:text-white transition"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-[#015D4F] text-white rounded hover:bg-[#013e35] transition"
          >
            Salvar
          </button>
        </div>
      </form>
    </div>
  );
}
