# GitHub Explorer

Aplicação client-side para buscar usuários do GitHub, visualizar seus dados e explorar seus repositórios. Podendo ordenar a lista por estrelas (asc ou desc) ou data de atualização, com busca por nome/descrição e paginação real via infinite scroll.

Desenvolvido como parte do **Desafio Front-End da Desbravador Software**.

**Demo:** [github-explorer-green-two.vercel.app](https://github-explorer-green-two.vercel.app)

---

## Requisitos do desafio

### Requisitos técnicos

| Requisito                                            | Status |
| ---------------------------------------------------- | ------ |
| Aplicação client-side consumindo a API do GitHub     | OK      |
| Mostrar os repositórios mais populares de um usuário | OK      |
| Funcionar nos navegadores mais recentes              | OK      |
| React + Vite                                         | OK      |
| Uso de rotas (`react-router-dom`)                    | OK      |
| Axios para requisições HTTP                          | OK      |
| Layout responsivo (mobile / tablet / desktop)        | OK      |

### Requisitos de negócio

| Como usuário, eu desejo...                                                                     | Status |
| ---------------------------------------------------------------------------------------------- | ------ |
| Buscar por um usuário do GitHub                                                                | OK      |
| Ver detalhes do usuário (seguidores, seguindo, avatar, e-mail, bio)                            | OK      |
| Ver a listagem de repositórios ordenada por estrelas (decrescente)                             | OK      |
| Alterar a ordem da listagem de repositórios                                                    | OK      |
| Ver detalhes de um repositório (nome, descrição, estrelas, linguagem, link externo pro GitHub) | OK      |

### Diferenciais aplicados

React · TypeScript · API REST · Hooks · TDD · Clean Architecture · SOLID · HTML/CSS · Responsividade · Versionamento (Git/GitHub) · CI/CD

> **Redux** e **Jest** não foram usados de propósito: o estado da aplicação não justifica um store global (hooks + Context já resolvem sem a complexidade extra de um Redux), e **Vitest** substitui o Jest com a mesma API do Testing Library, nativo em ESM/Vite e mais rápido — troca funcionalmente equivalente, mais alinhada com o resto da stack.

### Além do escopo pedido

- **Busca com debounce e paginação real** via GitHub Search API (não é filtro client-side de uma lista pré-carregada)
- **Infinite scroll** (`IntersectionObserver`) carregando 10 repositórios por vez
- **Cancelamento de requisições obsoletas** com `AbortController` (evita resultado antigo sobrescrever o novo numa corrida)
- **Histórico de buscas recentes** persistido em `localStorage`
- **Token pessoal do GitHub (PAT) configurável direto na UI**, sem precisar de backend — sobe o limite de requisições sem auth (60/h) para 5.000/h
- **CI/CD completo**: PR valida (lint + test + build), merge em `main` deploya em produção

---

## Arquitetura

Clean Architecture com regra de dependência estrita (camadas internas nunca importam camadas externas):

```text
domain        → regras de negócio puras, interfaces de usecases e modelos (zero dependência de framework)
data          → implementação dos usecases, dependendo só de protocolos (interfaces)
infra         → implementações concretas dos protocolos (Axios, localStorage)
validation    → validadores de formulário (Composite)
presentation  → componentes React, hooks e páginas — dependem só de protocolos/domain
main          → composition root: factories fazem a injeção de dependência manual (sem container)
```

Padrões de projeto usados: **Factory** (toda dependência é montada em `main/factories`), **Adapter** (`AxiosHttpClient` implementa o protocolo `HttpClient`), **Decorator** (`AuthorizeHttpClientDecorator` injeta o header `Authorization` sem acoplar o usecase à autenticação), **Composite** (`ValidationComposite` combina múltiplos validadores).

TDD ao longo de toda a implementação — 108 testes (Vitest + Testing Library), cobrindo domain, data, infra, validation e presentation.

---

## Stack

- **React 19** + **Vite** + **TypeScript**
- **React Router v7** (rotas aninhadas com `Outlet` + context, evitando prop drilling/refetch)
- **Axios** para HTTP
- **Tailwind CSS v4** + **HeroUI** (componentes acessíveis via React Aria)
- **Vitest** + **Testing Library** para testes
- **ESLint** (flat config, `typescript-eslint`, `eslint-plugin-react-hooks`)

---

## Instalação e execução

Requisitos: **Node 22+** e **pnpm**.

```bash
git clone git@github.com:evertonfxavier/github-explorer.git
cd github-explorer
pnpm install
```

Configura as variáveis de ambiente (copia o exemplo):

```bash
cp .env.example .env.development
```

```env
# .env.development
VITE_GITHUB_API_URL=https://api.github.com
```

Roda em desenvolvimento:

```bash
pnpm dev
```

Build de produção:

```bash
pnpm build
pnpm preview
```

> A API do GitHub sem autenticação tem limite de 60 requisições/hora (10/min pra busca). Se bater no limite, dá pra colar um Personal Access Token direto na tela de busca do app (sem escopo nenhum necessário) — sobe o limite sem precisar editar nada.

---

## Testes

```bash
pnpm test          # roda a suíte uma vez
pnpm test:watch    # modo watch
pnpm test:coverage # com relatório de cobertura
```

```bash
pnpm lint          # ESLint
```

---

## CI/CD

Pipeline no GitHub Actions (`.github/workflows/pipeline.yml`):

- **Pull Request → `main`**: roda lint, testes e build (gate de qualidade antes do merge)
- **Push em `main`** (merge do PR): dispara o deploy de produção via Vercel CLI

Deploy publicado em: [github-explorer-green-two.vercel.app](https://github-explorer-green-two.vercel.app)

---

## Estrutura resumida

```text
src/
├── domain/        # entidades, usecases (interfaces), erros
├── data/          # implementação dos usecases
├── infra/         # Axios, localStorage
├── validation/    # validadores de formulário
├── presentation/  # páginas, componentes, hooks
└── main/          # composition root (factories, rotas, config)
tests/             # espelha a estrutura de src/
```