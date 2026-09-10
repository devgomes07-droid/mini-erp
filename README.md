# Mini-ERP — Sistema de Gestão com Controle de Estoque

![CI](https://github.com/devgomes07-droid/mini-erp/actions/workflows/ci.yml/badge.svg)

Mini-ERP com baixa automática de estoque, controle de concorrência via optimistic locking (`@Version`) e autenticação JWT. Backend em Spring Boot + PostgreSQL, frontend em React.

🔗 **Demo ao vivo:** [mini-erp-frontend-alpha.vercel.app](https://mini-erp-frontend-alpha.vercel.app)
🔗 **API em produção:** [mini-erp-api-qh1u.onrender.com](https://mini-erp-api-qh1u.onrender.com)
📁 **Repositório:** [github.com/devgomes07-droid/mini-erp](https://github.com/devgomes07-droid/mini-erp)

> A API roda em plano gratuito e "dorme" após inatividade — a primeira requisição pode levar ~30-50s para responder.

---

## Features

### 🔐 Autenticação
- Autenticação stateless via JWT
- Login e registro de usuários, com perfis USER/ADMIN

### 📦 Produtos & Estoque
- Catálogo de produtos com busca por nome e **filtro por categoria**
- Baixa automática de estoque na confirmação de pedidos
- Controle de concorrência com optimistic locking (`@Version`), prevenindo estoque negativo em requisições simultâneas
- Alerta visual de estoque baixo (card do produto e dashboard)

### 👥 Clientes
- Cadastro e listagem de clientes, com busca e cards detalhados
- Campo de endereço de entrega vinculado ao pedido (pode divergir do cadastro do cliente)

### 🛒 Pedidos
- Fluxo de carrinho com confirmação de estoque em tempo real
- Abas **Pendentes** / **Confirmados**
- Modal de detalhes exibindo os itens comprados
- **Cancelamento** de pedidos pendentes ou confirmados, com **reposição automática de estoque** quando o pedido já estava confirmado
- Relacionamento entre Cliente, Produto e Pedido
- Conversão correta de timestamp/timezone

### 📊 Relatórios & Dashboard
- Relatório de faturamento com queries agregadas (por período)
- Dashboard com gráfico de receita por dia, ticket médio, ranking de top clientes/produtos
- Filtro de período (7 dias, 30 dias, 90 dias, ano)
- Alerta consolidado de produtos em estoque baixo

### 🖥️ Frontend
- SPA em React com React Router
- Sidebar de navegação, grid de produtos em cards
- Identidade visual própria (tema "ledger de estoque")
- Páginas de login, cadastro, dashboard, produtos, clientes e pedidos — layout responsivo

---

## 🛠️ Tech Stack

### Backend
| Tecnologia | Propósito |
|---|---|
| Java 17 | Linguagem principal |
| Spring Boot | Framework de aplicação |
| Spring Data JPA / Hibernate | ORM e abstração de banco de dados |
| Spring Security + JWT | Autenticação stateless |
| PostgreSQL | Banco de dados relacional |
| Docker | Containerização e deploy |

### Frontend
| Tecnologia | Propósito |
|---|---|
| React | Interface do usuário |
| React Router | Roteamento SPA |
| Recharts | Gráficos do dashboard |
| CSS dedicado | Estilização por página |

### Infraestrutura
| Serviço | Propósito |
|---|---|
| Render | Deploy do backend (Docker) |
| Neon | PostgreSQL hospedado |
| Vercel | Deploy do frontend |
| GitHub Actions | CI — testes automatizados a cada push |

---

## 🧪 Testes

Pipeline de CI (GitHub Actions) roda os testes automaticamente a cada push na branch `main`.

Testes unitários para as camadas de negócio principais:
- `AuthServiceTest`
- `ProdutoServiceTest`
- `PedidoServiceTest`, incluindo teste dedicado validando que o optimistic locking impede estoque negativo em cenário de concorrência

---

## 🚀 Getting Started

### Pré-requisitos
- Java 17+
- Maven 3.9+
- PostgreSQL 14+
- Node.js (para o frontend)

### Backend
```bash
git clone https://github.com/devgomes07-droid/mini-erp.git
cd mini-erp

# Configure as variáveis de ambiente (application-local.properties ou env vars)
DATABASE_URL=jdbc:postgresql://localhost:5432/minierp
DATABASE_USERNAME=seu_usuario
DATABASE_PASSWORD=sua_senha
JWT_SECRET=sua_chave_secreta
JWT_EXPIRATION=86400000

mvn spring-boot:run
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

### Docker
```bash
docker build -t mini-erp .
docker run -p 8080:8080 \
  -e DATABASE_URL=jdbc:postgresql://host:5432/minierp \
  -e DATABASE_USERNAME=usuario \
  -e DATABASE_PASSWORD=senha \
  -e JWT_SECRET=secret \
  -e JWT_EXPIRATION=86400000 \
  mini-erp
```

---

## 🔌 API Endpoints (principais)

> A API não usa prefixo `/api` — os endpoints ficam na raiz (ex: `/produtos`, não `/api/produtos`).

### Autenticação
| Método | Endpoint | Descrição | Acesso |
|---|---|---|---|
| POST | `/auth/register` | Criar conta | Público |
| POST | `/auth/login` | Autenticar usuário | Público |

### Produtos
| Método | Endpoint | Descrição | Acesso |
|---|---|---|---|
| GET | `/produtos` | Listar produtos (paginado) | Autenticado |
| POST | `/produtos` | Criar produto | Admin |

### Clientes
| Método | Endpoint | Descrição | Acesso |
|---|---|---|---|
| GET | `/clientes` | Listar clientes | Autenticado |
| POST | `/clientes` | Criar cliente | Autenticado |

### Pedidos
| Método | Endpoint | Descrição | Acesso |
|---|---|---|---|
| POST | `/pedidos` | Criar pedido (status PENDENTE) | Autenticado |
| GET | `/pedidos` | Listar pedidos (paginado) | Autenticado |
| PUT | `/pedidos/{id}/confirmar` | Confirmar pedido e dar baixa no estoque | Autenticado |
| PUT | `/pedidos/{id}/cancelar` | Cancelar pedido (repõe estoque se já confirmado) | Autenticado |

### Relatórios
| Método | Endpoint | Descrição | Acesso |
|---|---|---|---|
| GET | `/relatorios/faturamento?inicio=&fim=` | Faturamento agregado por período | Autenticado |

---

## 🗺️ Roadmap
- [ ] Edição e exclusão de produtos e clientes
- [ ] Perfis de acesso mais granulares no frontend (Admin vs Vendedor)
- [ ] Exportar relatório de faturamento em PDF
- [ ] Notificação de estoque baixo
- [ ] Testes de integração end-to-end

---

## 📄 Licença
Este projeto está sob a licença MIT.

## 👤 Autor
Gabriel Gomes — [@devgomes07-droid](https://github.com/devgomes07-droid)
