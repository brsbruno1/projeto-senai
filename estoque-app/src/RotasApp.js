import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './componentes/Login';
import CadastroUsuario from './componentes/funcionario/CadastroUsuario';
import ListaProdutos from './componentes/produtos/ListaProdutos';
import EsqueciSenha from './componentes/EsqueciSenha';
import DashboardEmpresa from './componentes/empresa/DashboardEmpresa';
import DashboardFuncionario from './componentes/funcionario/DashboardFuncionario';


export default function RotasApp({ logado, aoLogar, aoDeslogar }) {
  const tipo = localStorage.getItem('tipo');

return (
    <Routes>
      <Route
        path="/login"
        element={
          logado ? (
            tipo === 'empresa' ? (
              <Navigate to="/dashboard-empresa" />
            ) : (
              <Navigate to="/dashboard-funcionario" />
            )
          ) : (
            <Login aoLogar={aoLogar} />
          )
        }
      />

      <Route path="/cadastro" element={<CadastroUsuario />} />
      <Route path="/produtos" element={<ListaProdutos produtos={[]} aoExcluir={() => {}} aoEditar={() => {}} aoDeslogar={aoDeslogar} />} />
      <Route path="/esqueci-senha" element={<EsqueciSenha />} />
      <Route path="/dashboard-empresa" element={<DashboardEmpresa />} />
      <Route path="/dashboard-funcionario" element={<DashboardFuncionario />} />
      <Route path="*" element={<Navigate to="/login" />} />
    </Routes>
  );
}
