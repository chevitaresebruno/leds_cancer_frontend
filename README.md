# LEDS Cancer — Frontend

Interface web do sistema de análise de exames de mamografia desenvolvido pelo **LEDS (Laboratório de Engenharia de Software)**. Consome a [API REST do backend](https://github.com/saraivagustavo/leds_cancer_backend) e oferece fluxos de autenticação, gerenciamento de pacientes, criação de exames e visualização do dashboard.

---

## Tecnologias

| Tecnologia | Versão | Função |
|---|---|---|
| React | 19 | UI declarativa |
| TypeScript | 5.9 | Tipagem estática |
| Vite | 8 | Build tool + dev server |
| MUI (Material UI) | 7 | Biblioteca de componentes |
| Axios | 1.9 | Requisições HTTP |
| React Router DOM | 7 | Roteamento SPA |
| Fuse.js | 7 | Busca fuzzy nos autocompletes |
| React Compiler | — | Otimização automática de re-renders |

---

## Estrutura do projeto

```
src/
├── contexts/
│   ├── AuthContext.tsx       # Sessão do usuário, login, registro, logout
│   ├── ExamContext.tsx       # Exames recentes, stats do dashboard, submit
│   └── ColorModeContext.tsx  # Alternância de tema claro/escuro
├── features/
│   ├── auth/                 # Páginas de login e cadastro
│   ├── dashboard/            # Cards de estatísticas + feed de exames
│   ├── history/              # Histórico e filtros de exames
│   ├── new-analysis/         # Fluxo de nova análise (stepper 3 passos)
│   │   └── components/
│   │       ├── PatientSelectStep.tsx    # Autocomplete de pacientes (Fuse.js)
│   │       ├── ImageUploadStep.tsx      # Upload e preview da imagem
│   │       ├── ExamDataStep.tsx         # Dados clínicos e técnicos
│   │       └── PhysicianAutocomplete.tsx # Autocomplete de médicos (Fuse.js)
│   ├── patients/             # Listagem, detalhe e CRUD de pacientes
│   └── settings/             # Configurações de perfil e senha
├── hooks/
│   ├── usePatients.ts        # Busca e estado da lista de pacientes
│   ├── useHistory.ts         # Busca e estado do histórico de exames
│   ├── usePhysicians.ts      # Busca de médicos para autocomplete
│   └── useAuthForm.ts        # Formulários de login e registro com validação
├── services/
│   ├── api.ts                # Instância Axios + interceptores JWT
│   ├── authService.ts        # Listagem de médicos
│   ├── patientService.ts     # CRUD de pacientes
│   └── examService.ts        # CRUD de exames + dashboard stats
├── types/
│   ├── auth.ts               # User, LoginFormData, RegisterFormData
│   ├── patient.ts            # Patient, PatientExam, PatientStatus
│   ├── analysis.ts           # NewAnalysisFormData, BreastSide, ExamTechnique
│   ├── dashboard.ts          # ExamStatus, RecentExam, StatCardData
│   └── history.ts            # HistoryExam
├── utils/
│   ├── formatters.ts         # Formatação de CPF, telefone e datas
│   ├── validators.ts         # Validações de formulário (CPF, e-mail, senha)
│   └── statusConfig.ts       # Mapeamento de status para label + cor MUI
├── layouts/
│   ├── MainLayout.tsx        # Layout com sidebar e header
│   ├── SideNav.tsx           # Menu de navegação lateral
│   └── AppHeader.tsx         # Cabeçalho com usuário e tema
└── router/
    ├── index.tsx             # Definição de rotas
    └── ProtectedRoute.tsx    # Guard de autenticação
```

---

## Configuração e instalação

### 1. Pré-requisitos

- Node.js 20+
- npm 10+ (ou pnpm/yarn equivalente)
- Backend rodando em `http://localhost:8000`

### 2. Clonar e instalar dependências

```bash
git clone https://github.com/saraivagustavo/leds_cancer.git
cd leds_cancer
npm install
```

### 3. Variável de ambiente

Crie um arquivo `.env` na raiz do projeto:

```dotenv
VITE_API_URL=http://localhost:8000/api
```

> Se omitido, o valor padrão é `http://localhost:8000/api`.

### 4. Servidor de desenvolvimento

```bash
npm run dev
```

A aplicação estará disponível em `http://localhost:5173`.

---

## Scripts disponíveis

```bash
npm run dev       # Inicia o servidor de desenvolvimento com HMR
npm run build     # Compila TypeScript e gera o bundle de produção em dist/
npm run preview   # Serve o bundle de produção localmente
npm run lint      # Executa ESLint em todo o projeto
```

---

## Funcionalidades

### Autenticação
- Login por **e-mail ou CRM**
- Renovação automática do access token via refresh token (interceptor Axios)
- Cadastro com fluxo de aprovação pelo administrador
- Alteração de senha e dados de perfil

### Dashboard
- Cards com contadores em tempo real: pacientes hoje, exames pendentes, diagnósticos do mês e concluídos hoje
- Feed dos exames mais recentes com status colorido

### Pacientes
- Listagem com busca por nome, CPF ou ID
- Cadastro e edição com máscara de CPF e telefone
- Validação de CPF com dígitos verificadores
- Detalhe do paciente com histórico de exames aninhado

### Nova Análise (stepper)
O fluxo de criação de um exame é dividido em 3 passos:

1. **Selecionar Paciente** — Autocomplete com busca fuzzy (Fuse.js) por nome, CPF e ID
2. **Enviar Imagem** — Upload com preview da mamografia
3. **Dados do Exame** — Técnica, lado examinado, data, médico solicitante (autocomplete fuzzy com dados reais da API) e histórico clínico

### Histórico de Exames
- Listagem completa com filtros por status e busca textual
- Atualização de status inline

---

## Autenticação e tokens JWT

O `AuthContext` gerencia o ciclo de vida da sessão:

- **Login**: persiste `access_token` e `refresh_token` no `localStorage`
- **Interceptor de request**: injeta `Authorization: Bearer <token>` em toda chamada
- **Interceptor de response**: ao receber `401`, tenta renovar o access token via `/auth/token/refresh/`; se falhar, redireciona para `/`
- **Restore de sessão**: ao montar, verifica se há token salvo e busca `GET /auth/me/` para restaurar o usuário sem novo login

---

## Busca fuzzy com Fuse.js

Dois componentes usam Fuse.js para buscas tolerantes a erros de digitação:

**PatientSelectStep** — busca por `name`, `cpf` e `id` com `threshold: 0.35`

**PhysicianAutocomplete** — busca por `full_name` e `crm` com `threshold: 0.35`. Opera em modo `freeSolo` (aceita qualquer texto) e exibe a opção _"Adicionar X"_ para nomes não cadastrados. A lista de médicos é carregada da API (`GET /api/auth/users/`).

---

## Convenções do projeto

- **Serviços** isolados em `src/services/` — nenhum componente faz chamadas Axios diretamente
- **Hooks** encapsulam estado assíncrono — componentes consomem apenas os dados prontos
- **Tipos** centralizados em `src/types/` — sem `any` implícito
- **Formatters e validators** em `src/utils/` — lógica de negócio fora dos componentes
- **JSDoc** em todos os services, hooks, contexts, types e utils
- Datas trafegam como `dd/MM/yyyy` entre API e frontend; campos `input[type=date]` usam `yyyy-MM-dd` internamente

---

## Dependências principais

```
@mui/material ^7        → componentes de UI (Grid v2, Autocomplete, etc.)
@mui/icons-material ^7  → ícones SVG
@emotion/react          → engine de CSS-in-JS do MUI
axios ^1.9              → cliente HTTP com interceptores
react-router-dom ^7     → roteamento declarativo
fuse.js ^7              → busca fuzzy
```
