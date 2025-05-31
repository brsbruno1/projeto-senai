import { useEffect, useState } from 'react';
import api from '../../axiosConfig';
import ModalEditarProduto from '../produtos/ModalEditarProduto';
import ModalAdicionarProduto from '../produtos/ModalAdicionarProduto'; // ✅ não estava incluso
import TabelaProduto from '../produtos/TabelaProduto';

export default function TelaDeposito({ depositoId, onVoltar }) {
  const [produtos, setProdutos] = useState([]);
  const [produtoSelecionado, setProdutoSelecionado] = useState(null);
  const [mostrarModalEditar, setMostrarModalEditar] = useState(false);
  const [mostrarModalAdicionar, setMostrarModalAdicionar] = useState(false);

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

  const editarProduto = (produto) => {
    setProdutoSelecionado(produto);
    setMostrarModalEditar(true);
  };

  const excluirProduto = async (id) => {
    if (window.confirm("Tem certeza que deseja excluir este produto?")) {
      try {
        await api.delete(`/produtos/${id}`);
        const resposta = await api.get(`/produtos?deposito_id=${depositoId}`);
        setProdutos(resposta.data);
      } catch (erro) {
        console.error("Erro ao excluir produto:", erro);
      }
    }
  };

  return (
    <div className="p-4">
      <button onClick={onVoltar} className="mb-4 text-sm text-blue-500 hover:underline">
        ← Voltar para os depósitos
      </button>

      <h2 className="text-xl font-semibold mb-4">
        Produtos no Depósito #{depositoId}
      </h2>

      <div className="flex justify-end mb-4">
        <button
          onClick={() => setMostrarModalAdicionar(true)}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded shadow"
        >
          + Adicionar Produto
        </button>
      </div>

      <TabelaProduto
        produtos={produtos}
        onEditar={editarProduto}
        onExcluir={excluirProduto}
      />

      {mostrarModalEditar && (
        <ModalEditarProduto
          produto={produtoSelecionado}
          onClose={() => setMostrarModalEditar(false)}
          onAtualizar={() => {
            setMostrarModalEditar(false);
            api
              .get(`/produtos?deposito_id=${depositoId}`)
              .then((res) => setProdutos(res.data));
          }}
        />
      )}

      {mostrarModalAdicionar && (
        <ModalAdicionarProduto
          depositoId={depositoId}
          onClose={() => setMostrarModalAdicionar(false)}
          onProdutoAdicionado={() => {
            setMostrarModalAdicionar(false);
            api.get(`/produtos?deposito_id=${depositoId}`)
              .then(res => setProdutos(res.data));
          }}
        />
      )}
    </div>
  );
}
