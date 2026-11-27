import type { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useSessaoQuery } from './authApi';

/** Só mostra o conteúdo para quem entrou; os outros vão para /entrar e voltam depois. */
export function RequerSessao({ children }: { children: ReactNode }) {
  const { data: conta, isLoading } = useSessaoQuery();
  const local = useLocation();
  if (isLoading) {
    return (
      <p className="carregando" role="status">
        Abrindo o mapa…
      </p>
    );
  }
  if (!conta) {
    return <Navigate to="/entrar" replace state={{ voltarPara: local.pathname }} />;
  }
  return <>{children}</>;
}
