export default function TabelaProduto({ produtos, onEditar, onExcluir }) {
  return (
    <div className="overflow-x-auto shadow border rounded mt-4">
      <table className="min-w-full divide-y divide-gray-300">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">ID</th>
            <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Produto</th>
            <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Categoria</th>
            <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Quantidade</th>
            <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Status</th>
            <th className="px-4 py-2 text-center text-sm font-medium text-gray-700">Ações</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {produtos.map((produto) => (
            <tr key={produto.id}>
              <td className="px-4 py-2 text-sm text-gray-700">{produto.id}</td>
              <td className="px-4 py-2 text-sm text-gray-700">{produto.nome}</td>
              <td className="px-4 py-2 text-sm text-gray-700">{produto.categoria || '—'}</td>
              <td className="px-4 py-2 text-sm text-gray-700">{produto.quantidade}</td>
              <td className="px-4 py-2">
                <span
                  className={`px-2 py-1 rounded-full text-xs font-semibold ${
                    produto.quantidade > 0
                      ? 'bg-green-100 text-green-700'
                      : 'bg-red-100 text-red-700'
                  }`}
                >
                  {produto.quantidade > 0 ? 'Disponível' : 'Sem estoque'}
                </span>
              </td>
              <td className="px-4 py-2 text-center">
                <button
                  onClick={() => onEditar(produto)}
                  className="text-blue-500 hover:text-blue-700 mr-2"
                  title="Editar"
                >
                  ✏️
                </button>
                <button
                  onClick={() => onExcluir(produto.id)}
                  className="text-red-500 hover:text-red-700"
                  title="Excluir"
                >
                  🗑️
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
