# API de Controle de Estoque

Essa é uma API para controle de entradas e saídas de produtos em um sistema de estoque, permitindo gerenciar múltiplos estoques diferentes.

## Tecnologias Utilizadas

- [AdonisJS 6](https://adonisjs.com/)
- [Node.js](https://nodejs.org/)
- [PostgreSQL](https://www.postgresql.org/)

## Funcionalidades

- **Gerenciar múltiplos estoques**: Adicione, edite e remova estoques diferentes.
- **Controle de entradas**: Registre as entradas de produtos no estoque.
- **Controle de saídas**: Registre as saídas de produtos do estoque.

## Pré-requisitos

Antes de rodar a aplicação, você precisa ter o [Node.js](https://nodejs.org/) instalado.

## Instalação

1. Clone o repositório:
   ```bash
   git clone https://github.com/matheuscimatti/api-estoque.git
   cd api-estoque
2. Instale as dependências:
   ```bash
   npm install
3. Configure o arquivo .env com as informações do seu banco. Use o arquivo .env.example como base.
4. Execute as migrações para criar as tabelas no banco de dados:
   ```bash
   node ace migration:run
5. Inicie a API
   ```bash
   npm run dev
A API estará disponível em ```http://localhost:3333```

Para testar a API você pode importar a collection no postman com o arquivo ```Estoque API.postman_collection.json```
