import { useEffect, useState } from 'react';
import api from '../../axiosConfig';

export default function RelatorioSaida() {
  const [relatorio, setRelatorio] = useState([]);

  useEffect(() => {
    async function carregarRelatorio() {
      try {
        const resposta = await api.get('/relatorio-saida');
        setRelatorio(resposta.data);
      } catch (erro) {
        console.error('Erro ao carregar relatório de saída:', erro);
      }
    }
    carregarRelatorio();
  }, []);

  return (
    <div className="mt-6">
      <h2 className="text-xl font-semibold mb-4">Relatório de Saídas</h2>
      {relatorio.length === 0 ? (
        <p className="text-sm text-gray-600">Nenhuma saída registrada.</p>
      ) : (
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left border-b">
              <th className="py-2">Produto</th>
              <th>Quantidade</th>
              <th>Data</th>
            </tr>
          </thead>
          <tbody>
            {relatorio.map((item, index) => (
              <tr key={index} className="border-b">
                <td className="py-2">{item.nome}</td>
                <td>{item.quantidade}</td>
                <td>{item.data_saida}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
