Mini-ERP — Sistema de Gestão com Controle de Estoque

Mini-ERP com baixa automática de estoque, controle de concorrência via optimistic locking (@Version) e autenticação JWT. Backend em Spring Boot + PostgreSQL, frontend em React.

📁 Repositório

✨ Features
🔐 Autenticação
Autenticação stateless via JWT
Login e registro de usuários
📦 Produtos & Estoque
CRUD completo de produtos
Baixa automática de estoque na confirmação de pedidos
Controle de concorrência com optimistic locking (@Version), prevenindo estoque negativo em requisições simultâneas
👥 Clientes
Cadastro e listagem de clientes
Campo de endereço de entrega vinculado ao pedido
🛒 Pedidos
Fluxo de carrinho com confirmação de estoque em tempo real
Relacionamento entre Cliente, Produto e Pedido
Histórico de pedidos por cliente
Conversão correta de timestamp/timezone
📊 Relatórios & Dashboard
Relatório de faturamento com queries agregadas
Dashboard com gráfico de receita e ranking de top clientes/produtos
🖥️ Frontend
SPA em React com React Router
Sidebar de navegação, grid de produtos em cards
Páginas de login, produtos, clientes e pedidos com layout responsivo
🛠️ Tech Stack
Backend
Tecnologia	Propósito
Java	Linguagem principal
Spring Boot	Framework de aplicação
Spring Data JPA	ORM e abstração de banco de dados
PostgreSQL	Banco de dados relacional
JWT	Autenticação stateless
Docker	Containerização e deploy
Frontend
Tecnologia	Propósito
React	Interface do usuário
React Router	Roteamento SPA
CSS	Estilização (auth pages, sidebar, cards)
Infraestrutura
Serviço	Propósito
Render	Deploy em nuvem
Docker	Build containerizado
GitHub	Versionamento
🧪 Testes

Testes unitários para as camadas de negócio principais:

AuthServiceTest
ProdutoServiceTest
PedidoServiceTest, incluindo teste dedicado validando que o optimistic locking impede estoque negativo em cenário de concorrência
🚀 Getting Started
Pré-requisitos
Java 21+
Maven 3.9+
PostgreSQL 14+
Node.js (para o frontend)
Backend
bash
git clone https://github.com/devgomes07-droid/mini-erp.git
cd mini-erp

# Configure as variáveis de ambiente (application-local.properties ou env vars)
SPRING_DATASOURCE_URL=jdbc:postgresql://localhost:5432/minierp
SPRING_DATASOURCE_USERNAME=seu_usuario
SPRING_DATASOURCE_PASSWORD=sua_senha
JWT_SECRET=sua_chave_secreta

mvn spring-boot:run
Frontend
bash
cd frontend
npm install
npm start
Docker
bash
docker build -t mini-erp .
docker run -p 8080:8080 \
  -e SPRING_DATASOURCE_URL=jdbc:postgresql://host:5432/minierp \
  -e SPRING_DATASOURCE_USERNAME=usuario \
  -e SPRING_DATASOURCE_PASSWORD=senha \
  -e JWT_SECRET=secret \
  mini-erp
🔌 API Endpoints (principais)
Autenticação
Método	Endpoint	Descrição
POST	/api/auth/register	Criar conta
POST	/api/auth/login	Autenticar usuário
Produtos
Método	Endpoint	Descrição
GET	/api/produtos	Listar produtos
POST	/api/produtos	Criar produto
PUT	/api/produtos/:id	Atualizar produto
DELETE	/api/produtos/:id	Remover produto
Clientes
Método	Endpoint	Descrição
GET	/api/clientes	Listar clientes
POST	/api/clientes	Criar cliente
Pedidos
Método	Endpoint	Descrição
POST	/api/pedidos	Criar pedido (com baixa de estoque)
GET	/api/pedidos	Listar pedidos
GET	/api/pedidos/relatorio-faturamento	Relatório de faturamento agregado

Ajuste os endpoints acima para bater exatamente com os nomes reais dos seus @RequestMapping antes de publicar.

🗺️ Roadmap
 Autenticação com perfis (admin/vendedor)
 Exportar relatório de faturamento em PDF
 Notificação de estoque baixo
 Testes de integração end-to-end
📄 Licença

Este projeto está sob a licença MIT.

👤 Autor

Gabriel Gomes — @devgomes07-droid
