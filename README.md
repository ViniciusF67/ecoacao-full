# ECOAÇÃO — Sistema completo (React + Node/Express + SQL Server)

Projeto escolar de informática relacionado à **ODS 13 — Ação Contra a Mudança Global do Clima**.
Plataforma educacional (não é uma ONG) para conscientização e participação em questões ambientais.

```
React/Vite  →  HTTP/REST  →  Node.js + Express  →  SQL (parametrizado)  →  SQL Server
```

O React **nunca** se conecta diretamente ao banco. Toda autorização (quem pode criar/editar/excluir
o quê) é verificada no **backend**, nunca só escondendo botões no frontend.

---

## 1. Pré-requisitos

- [Node.js](https://nodejs.org/) 18 ou superior
- Microsoft SQL Server (Express, Developer ou outra edição) rodando localmente ou acessível pela rede
- [SQL Server Management Studio (SSMS)](https://learn.microsoft.com/sql/ssms/download-sql-server-management-studio-ssms)

---

## 2. Criar o banco de dados

1. Abra o SSMS e conecte na sua instância do SQL Server.
2. Abra o arquivo `database/schema.sql` e execute (ele cria o banco `EcoAcao`, todas as tabelas,
   chaves estrangeiras e índices).
3. **Antes de rodar o seed**, gere um hash de senha real para o usuário administrador (veja o passo 3).
4. Abra `database/seed.sql`, substitua `@HASH_ADMIN@` pelo hash gerado, e execute o script.
   Ele popula: roles, as permissões do RBAC, o usuário admin, categorias, e alguns registros de
   exemplo (notícia, conteúdo, quiz com perguntas, desafio, organização).

## 3. Configurar e rodar o backend

```bash
cd backend
npm install
cp .env.example .env
```

Edite o `.env` com os dados da sua instância SQL Server (`DB_SERVER`, `DB_USER`, `DB_PASSWORD` etc.)
e defina um `JWT_SECRET` longo e aleatório.

**Gerar o hash da senha do admin** (necessário antes do passo 2.4 acima):
```bash
node src/utils/gerarHashSenha.js SuaSenhaAqui
```
Copie o hash impresso e cole no lugar de `@HASH_ADMIN@` em `database/seed.sql`, depois rode o seed.

**Iniciar o servidor:**
```bash
npm run dev
```
Por padrão sobe em `http://localhost:3000`. Teste com:
```bash
curl http://localhost:3000/api/health
```

## 4. Configurar e rodar o frontend

```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```
Abre em `http://localhost:5173`. O `.env` já aponta para `http://localhost:3000/api` por padrão.

---

## 5. Estrutura do projeto

```
/
├── frontend/           React + Vite
│   └── src/
│       ├── components/ Navbar, Footer, Button, Cards, Input, etc.
│       ├── context/     AuthContext (sessão via JWT)
│       ├── layout/       Layout, RotaProtegida, RotaAdmin
│       ├── pages/        Uma pasta por página (inclui pages/Admin/ — painel administrativo)
│       ├── services/     Camada de chamadas HTTP (api.js + um arquivo por recurso)
│       └── utils/
│
├── backend/             Node.js + Express
│   └── src/
│       ├── config/db.js       Pool de conexão mssql
│       ├── middleware/        requireAuth, requirePermission, errorHandler
│       ├── controllers/       Lógica de cada rota
│       ├── services/          Acesso ao banco (queries parametrizadas)
│       ├── routes/            Definição dos endpoints REST
│       └── utils/gerarHashSenha.js
│
└── database/
    ├── schema.sql        Estrutura completa (tabelas, FKs, índices)
    └── seed.sql          Dados iniciais (roles, permissões, admin, exemplos)
```

---

## 6. Sistema de permissões (RBAC)

4 papéis: `usuario`, `colaborador`, `admin`, `superadmin`. Permissões (ex.: `news.create`,
`quiz.delete`, `admin.access`) ficam em `permissions`, associadas a papéis via `role_permissions`
(veja `database/seed.sql` para o mapeamento completo).

O middleware `requirePermission('news.create')` (em `backend/src/middleware/auth.js`) bloqueia
a requisição na API caso o usuário autenticado não tenha essa permissão — **isso acontece mesmo
que alguém chame a rota diretamente via curl/Postman**, sem passar pela interface.

> Nota de design: as permissões do usuário são embutidas no token JWT no momento do login, para
> evitar uma consulta ao banco a cada requisição. Isso significa que, se o papel de alguém for
> alterado pelo admin, a mudança só é refletida no próximo login dessa pessoa (ou quando o token
> expirar). Para um sistema em produção real, considere invalidar tokens antigos ou reduzir o
> tempo de expiração.

---

## 7. Testando o fluxo completo

1. **Cadastro**: vá em `/cadastro`, crie uma conta (papel `usuario` por padrão)
2. **Login**: `/login` com a conta criada, ou com `admin@ecoacao.com` + a senha que você definiu no seed
3. **Perfil**: `/perfil` mostra seus dados vindos da API; `/perfil/editar` atualiza nome/foto/bio e permite trocar senha (exige a senha atual)
4. **Notícias/Conteúdos/Desafios/Organizações**: listam dados reais vindos do SQL Server
5. **Quiz**: faça um quiz logado — o resultado é **calculado no backend** (o frontend nunca recebe o gabarito antes de responder) e fica salvo em `resultados_quiz`
6. **Testar permissão negada**: com uma conta `usuario` comum, tente abrir `/admin` → é redirecionado. Tente chamar `POST /api/noticias` diretamente (ex. via curl) com o token dessa conta → a API responde `403` com `{ "erro": "Acesso negado: esta ação requer a permissão \"news.create\"." }`
7. **Painel administrativo**: logado como `admin` ou `superadmin`, acesse `/admin` (também aparece um link "Painel admin" na navbar). De lá dá pra: ver o resumo de números, criar/excluir notícias, criar/excluir categorias, e alterar o papel/status de outros usuários
8. **Criar notícia pelo painel**: `/admin/noticias` → "Nova notícia" → preencha e publique. Ela aparece imediatamente em `/noticias`

---

## 8. O que foi implementado e testado nesta etapa

**Implementado e validado estaticamente** (sintaxe real verificada com `node --check` em todos os
31 arquivos do backend e bundle real com esbuild em todo o frontend — zero erros em ambos):

- Backend Express completo: auth (register/login/me com bcrypt+JWT), CRUD de categorias, notícias,
  conteúdos, desafios (+ participação), organizações (+ ações), usuários (perfil próprio + admin),
  quiz (responder com cálculo de nota no servidor), rotas administrativas de apoio (roles,
  permissions, resumo), contato
- RBAC real com middleware `requireAuth` / `requirePermission`, aplicado em todas as rotas de escrita
- Schema SQL Server completo com todas as tabelas pedidas, FKs, UNIQUE, índices
- Seed com roles, as ~28 permissions, mapeamento de papéis, usuário admin, e dados de exemplo
- Frontend 100% conectado à API via camada de services (nada mais hardcoded como fonte de dados)
- Painel administrativo funcional: dashboard com números reais, CRUD de notícias, CRUD de
  categorias, gestão de papel/status de usuários
- Revisão visual: remoção de todos os emojis decorativos (substituídos por tipografia/números/
  acentos de cor), correção do `overflow:hidden` que arriscava cortar texto no hero da Home

**O que eu NÃO consegui testar de verdade** (ambiente sem acesso à internet e sem instância de
SQL Server disponível):

- `npm install` do backend e do frontend — não rodei, porque este ambiente não tem acesso à
  internet (registry do npm bloqueado). A validação que fiz foi de sintaxe (`node --check`) e de
  resolução de `require`/`import`, não uma execução real.
- Conexão de fato com um SQL Server — o código em `config/db.js` segue a API oficial do pacote
  `mssql`, mas nunca rodou contra um banco de verdade aqui.
- O fluxo ponta a ponta (cadastro → login → quiz → resultado salvo → admin gerenciando) nunca foi
  executado de fato; só revisado linha a linha.

**Funcionalidades com API pronta no backend mas sem interface no painel admin ainda:**
- Criar/editar conteúdos educacionais, desafios, organizações e quizzes (as rotas e a lógica já
  existem e funcionam — `POST /api/conteudos`, `POST /api/desafios`, `POST /api/organizacoes`,
  `POST /api/quizzes` — só falta a tela correspondente em `pages/Admin/`, seguindo o mesmo padrão
  de `AdminNoticias.jsx`)
- Edição (PUT) de notícias/conteúdos pelo painel (hoje só criar e excluir têm tela; editar já tem
  endpoint no backend)

## 9. Principais endpoints da API

```
POST   /api/auth/register          POST /api/auth/login          GET /api/auth/me

GET    /api/noticias                GET /api/noticias/:id
POST   /api/noticias   (news.create)      PUT /api/noticias/:id (news.update)   DELETE (news.delete)

GET    /api/conteudos  ...mesmo padrão (content.*)
GET    /api/desafios   ...mesmo padrão (challenge.*)
                         POST /api/desafios/:id/participar   POST /api/desafios/:id/concluir
GET    /api/organizacoes ...mesmo padrão (organization.*)    POST /:id/acoes

GET    /api/quizzes                 GET /api/quizzes/:id (sem gabarito)
POST   /api/quizzes/:id/responder   (calcula nota no servidor)
POST   /api/quizzes        (quiz.create)        DELETE /api/quizzes/:id (quiz.delete)
GET    /api/quizzes/historico/me

GET    /api/users/me    PUT /api/users/me    PUT /api/users/me/senha
GET    /api/users (users.read)   PUT /:id/role (role.manage)   PUT /:id/status (users.update)   DELETE (users.delete)

GET    /api/admin/roles | /permissions | /resumo   (role.manage / admin.access)

POST   /api/contato
```

## 10. Segurança aplicada

- Senhas: hash bcrypt (nunca texto puro), nunca retornadas pela API
- JWT assinado com `JWT_SECRET` (configurável via `.env`, nunca commitado)
- Toda query usa parâmetros (`request.input(...)`) via `mssql` — sem concatenação de string, sem SQL injection
- `requireAuth` + `requirePermission` em toda rota de escrita
- CORS restrito à origem do frontend (`CORS_ORIGIN` no `.env`)
- `.env` e `.env.example` com `.gitignore` configurado (nunca subir credenciais reais)
- Resultado de quiz sempre calculado e validado no servidor, nunca aceito do cliente
