export default function CardDeposito({ nome, onEntrar, onEditar }) {
<div className="bg-white text-[#91592A] rounded-lg p-4 shadow flex flex-col items-center justify-center">
  <h3 className="text-lg font-semibold mb-2">{nome}</h3>
  <div className="flex space-x-2">
    <button
      onClick={onEntrar}
      className="px-3 py-1 bg-[#91592A] text-white rounded hover:bg-[#7a4723]"
    >
      Entrar
    </button>
    <button
      onClick={onEditar}
      className="px-3 py-1 border border-[#91592A] text-[#91592A] rounded hover:bg-[#f1e9e3]"
    >
      ✏️
    </button>
  </div>
</div>
}
