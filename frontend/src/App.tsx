import { Route, Routes } from 'react-router-dom';
import { RequerSessao } from './features/auth/RequerSessao';
import { Inicio } from './pages/Inicio';
import { Acesso } from './pages/Acesso';
import { Mapa } from './pages/Mapa';

export function App() {
  return (
    <Routes>
      <Route path="/" element={<Inicio />} />
      <Route path="/entrar" element={<Acesso modo="entrar" />} />
      <Route path="/criar-conta" element={<Acesso modo="criar" />} />
      <Route
        path="/mapa"
        element={
          <RequerSessao>
            <Mapa />
          </RequerSessao>
        }
      />
      <Route path="*" element={<Inicio />} />
    </Routes>
  );
}
