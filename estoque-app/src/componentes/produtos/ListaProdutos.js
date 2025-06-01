import { useEffect, useState } from "react";
import api from "../../axiosConfig";
import ModalEditarProduto from "../produtos/ModalEditarProduto";
import ModalAdicionarProduto from "../produtos/ModalAdicionarProduto";

export default function ListaProdutos({ aoDeslogar }) {
  const [produtos, setProdutos] = useState([]);
  const [produtoSelecionado, setProdutoSelecionado] = useState(null);
  const [mostrarModalAdicionar, setMostrarModalAdicionar] = useState(false);

  useEffect(() => {
    api.get("/produtos")
      .then(res => setProdutos(res.data))
      .catch(err => console.error("Erro ao buscar produtos:", err));
  }, []);

  function handleExcluirProduto(id) {
    if (!window.confirm("Deseja realmente excluir este produto?")) return;

    api.delete(`/produtos/${id}`)
      .then(() => {
        setProdutos(produtos.filter(p => p.id !== id));
      })
      .catch(err => {
        console.error("Erro ao excluir produto:", err);
      });
  }

  function validadeProxima(dataValidade) {
    const hoje = new Date();
    const validade = new Date(dataValidade);
    const tresMesesDepois = new Date(hoje);
    tresMesesDepois.setMonth(hoje.getMonth() + 3);
    return validade <= tresMesesDepois;
  }

  return (
    <div className="max-w-7xl mx-auto mt-10 px-4">
      <div className="relative p-10 bg-white rounded-2xl shadow-lg">
        <div className="flex justify-between items-center mb-6 relative">
          {/* Botão de adicionar produto */}
          <button
            onClick={() => setMostrarModalAdicionar(true)}
            className="absolute left-4 top-0 bg-black/60 text-white border border-[#015D4F] px-4 py-2 rounded-lg shadow hover:bg-[#015D4F]/80 hover:text-white transition"
          >
            + Produto
          </button>

          {/* Título */}
          <h2 className="text-xl font-semibold text-[#015D4F] text-center w-full">
            Produtos Cadastrados
          </h2>

          {/* Botão logout */}
          {aoDeslogar && (
            <button
              onClick={aoDeslogar}
              className="absolute right-4 top-0 bg-black/60 text-white border border-[#015D4F] px-4 py-2 rounded-lg shadow hover:bg-[#015D4F]/80 hover:text-white transition"
            >
              Logout
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {(produtos || []).map((produto, index) => {
            const alertaEstoque = produto.quantidade < produto.estoque_min;
            const alertaValidade = validadeProxima(produto.validade);

            return (
              <div
                key={index}
                className="bg-black/60 text-white p-4 rounded-xl shadow-md relative border border-[#015D4F] backdrop-blur-sm"
              >
                <h3 className="text-lg font-bold mb-2">{produto.nome}</h3>
                <p>Quantidade: {produto.quantidade}</p>
                <p>Preço: R$ {typeof produto.preco === "number" ? produto.preco.toFixed(2) : "---"}</p>
                <p>Validade: {produto.validade}</p>

                {alertaEstoque && (
                  <span className="absolute top-2 right-2 bg-red-500/90 text-white px-2 py-1 rounded text-xs shadow">
                    Estoque Baixo
                  </span>
                )}
                {alertaValidade && (
                  <span className="absolute bottom-2 right-2 bg-yellow-400/90 text-black px-2 py-1 rounded text-xs shadow">
                    Validade Próxima
                  </span>
                )}

                <div className="mt-4 flex justify-between">
                  <button
                    onClick={() => setProdutoSelecionado(produto)}
                    className="bg-white/90 text-[#015D4F] px-3 py-1 rounded shadow hover:bg-[#015D4F] hover:text-white transition"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => handleExcluirProduto(produto.id)}
                    className="bg-red-700/80 text-white px-3 py-1 rounded shadow hover:bg-red-800 transition"
                  >
                    Excluir
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Modal de edição */}
      {produtoSelecionado && (
        <ModalEditarProduto
          produto={produtoSelecionado}
          aoFechar={() => setProdutoSelecionado(null)}
          aoAtualizar={() => {
            api.get("/produtos").then(res => setProdutos(res.data));
          }}
        />
      )}

      {/* Modal de adicionar */}
      {mostrarModalAdicionar && (
        <ModalAdicionarProduto
          aoFechar={() => setMostrarModalAdicionar(false)}
          aoAtualizar={() => {
            api.get("/produtos").then(res => setProdutos(res.data));
          }}
        />
      )}
    </div>
  );
}
