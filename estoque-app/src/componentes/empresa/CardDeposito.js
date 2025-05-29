import { FiEdit, FiTrash } from 'react-icons/fi';

export default function CardDeposito({ nome, onEntrar, onEditar, onExcluir }) {
  return (
    <div className="bg-white text-[#91592A] rounded-lg shadow p-4 flex flex-col justify-between h-28">
      <div className="flex justify-between items-start">
        <h2 className="text-lg font-semibold">{nome}</h2>
        <div className="flex space-x-2">
          <button
            onClick={onEditar}
            className="text-[#91592A] hover:text-[#7a4723]"
            title="Editar"
          >
            <FiEdit size={18} />
          </button>
          <button
            onClick={onExcluir}
            className="text-red-500 hover:text-red-700"
            title="Excluir"
          >
            <FiTrash size={18} />
          </button>
        </div>
      </div>
      <button
        onClick={onEntrar}
        className="mt-4 bg-[#91592A] text-white py-1 px-4 rounded hover:bg-[#7a4723]"
      >
        Entrar
      </button>
    </div>
  );
}
