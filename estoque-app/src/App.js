import { BrowserRouter as Router } from 'react-router-dom';
import { useState, useEffect } from 'react';
import RotasApp from './RotasApp'; // importa o novo componente com as rotas

function App() {
  const [logado, setLogado] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    setLogado(!!token); // está logado se houver token
  }, []);

  function aoLogar() {
    setLogado(true);
  }

  function aoDeslogar() {
    localStorage.removeItem('token');
    setLogado(false);
  }

  return (
    <Router>
      <RotasApp logado={logado} aoLogar={aoLogar} aoDeslogar={aoDeslogar} />
    </Router>
  );
}

export default App;
