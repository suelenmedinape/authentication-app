# Cliente App - E-commerce em JavaScript Vanilla

Aplicação cliente de e-commerce desenvolvida em JavaScript vanilla, sem frameworks, com foco em funcionalidades essenciais para um sistema de compras online.

## Funcionalidades

- Cadastro e login de usuários
- Gerenciamento de conta
- Integração com backend para autenticação e operações de conta
- Interface moderna e responsiva
- Estrutura modular de páginas (login, cadastro, conta)
- As informaçoes do usuário são salvas no `localStorage`

## Estrutura do Projeto

```
cliente-app/
    ├── index.html
    ├── package.json
    ├── public/
    └── src/
        ├── main.js
        ├── pages/
        │   ├── account/
        │   ├── login/
        │   └── register/
        └── service/
```

## Como rodar o projeto

1. Instale as dependências:
   ```bash
   npm install
   ```

2. Inicie o servidor de desenvolvimento:
   ```bash
   npm run dev
   ```

3. Acesse no navegador:
   ```
   http://localhost:5173
   ```

## Tecnologias Utilizadas

- JavaScript (ES6+)
- [Tailwind](https://tailwindcss.com/docs/installation/using-vite) e [Flowbite](https://flowbite.com/) para estilização das paginas
- [Vite](https://vitejs.dev/) para build e desenvolvimento

## Observações

- Este projeto é apenas o front-end e depende de um backend para autenticação e operações de conta.
- Ideal para estudos de JavaScript vanilla e integração com APIs REST. 
