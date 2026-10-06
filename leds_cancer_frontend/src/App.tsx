import { MainLayout } from '@/layouts/MainLayout';

/**
 * Casca principal das rotas autenticadas.
 *
 * O `MainLayout` cuida de cabeçalho, menu e espaço de conteúdo; este componente
 * fica como ponto de entrada limpo para o React Router.
 */
export default function App() {
  return <MainLayout />;
}
