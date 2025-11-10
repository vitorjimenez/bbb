# BBB Voting System

Sistema de votação para o Big Brother Brasil construído com Next.js 16 e integração com API Spring Boot.

## Funcionalidades

- ✅ Sistema de autenticação (Login e Registro)
- ✅ Página de votação com cards de participantes
- ✅ Página de confirmação com estatísticas em tempo real
- ✅ Integração completa com API Spring Boot
- ✅ Design responsivo com tema BBB
- ✅ Tratamento de erros e estados de loading

## Configuração da API

Para conectar o frontend com seu backend Spring Boot, você precisa configurar a variável de ambiente:

\`\`\`bash
NEXT_PUBLIC_API_URL=http://localhost:8080/api
\`\`\`

### Endpoints Esperados da API Spring Boot

#### Autenticação
- `POST /api/auth/login` - Login de usuário
  - Body: `{ "email": string, "password": string }`
  - Response: `{ "token": string, "user": object }`

- `POST /api/auth/register` - Registro de usuário
  - Body: `{ "name": string, "email": string, "password": string }`
  - Response: `{ "token": string, "user": object }`

#### Participantes
- `GET /api/participants` - Listar todos os participantes
  - Response: Array de participantes com id, name, age, occupation, photo, totalVotes, lastHourVotes

- `GET /api/participants/:id` - Buscar participante por ID
  - Response: Objeto do participante

#### Votação
- `POST /api/votes` - Submeter voto
  - Body: `{ "participantId": number }`
  - Response: `{ "success": boolean, "message": string, "vote": object }`

- `GET /api/votes/statistics` - Estatísticas de votação
  - Response: Array com participantId, participantName, totalVotes, lastHourVotes, percentage

## Estrutura do Projeto

\`\`\`
app/
├── page.tsx                 # Página inicial
├── login/page.tsx          # Página de login
├── registro/page.tsx       # Página de registro
├── votar/page.tsx          # Página de votação
└── confirmacao/page.tsx    # Página de confirmação

lib/
└── api.ts                  # Funções de integração com API

components/
└── ui/                     # Componentes shadcn/ui
\`\`\`

## Desenvolvimento

\`\`\`bash
# Instalar dependências
npm install

# Executar em desenvolvimento
npm run dev
\`\`\`

Acesse [http://localhost:3000](http://localhost:3000) para ver a aplicação.

## Tecnologias

- Next.js 16
- React 19.2
- TypeScript
- Tailwind CSS v4
- shadcn/ui
- Spring Boot API (backend)
