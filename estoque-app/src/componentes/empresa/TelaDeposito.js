import { useEffect, useState } from 'react';
import api from '../../axiosConfig';
import FormularioProduto from '../FormularioProduto';

export default function TelaDeposito({ depositoId, onVoltar }) {
  const [produtos, setProdutos] = useState([]);

  useEffect(() => {
    async function carregarProdutos() {
      try {
        const resposta = await api.get(`/produtos?deposito_id=${depositoId}`);
        setProdutos(resposta.data);
      } catch (erro) {
        console.error('Erro ao carregar produtos:', erro);
      }
    }
    carregarProdutos();
  }, [depositoId]);

  return (
    <div className="p-4">
      <button onClick={onVoltar} className="mb-4 text-sm text-blue-500 hover:underline">← Voltar para os depósitos</button>
      <h2 className="text-xl font-semibold mb-4">Produtos no Depósito #{depositoId}</h2>
      <FormularioProduto depositoId={depositoId} />

      <ul className="mt-6 space-y-2">
        {produtos.map(produto => (
          <li key={produto.id} className="border p-3 rounded">
            <p><strong>{produto.nome}</strong></p>
            <p>Quantidade: {produto.quantidade}</p>
            <p>Validade: {produto.validade}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
