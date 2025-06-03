# Contract Management

Aplicação web para gerenciamento de contratos, ativos e fornecedores, desenvolvida como parte de um teste técnico. A solução foi construída utilizando React com TypeScript, seguindo práticas modernas de desenvolvimento front-end.

---

## 🧰 Tecnologias Utilizadas

- **React + TypeScript**: Biblioteca principal para criação da interface com tipagem estática.
- **Ant Design**: Framework de UI utilizado pela empresa, oferece componentes prontos e responsivos.
- **Axios**: Cliente HTTP para consumo da API.
- **React Router DOM**: Gerenciamento de rotas no formato SPA (Single Page Application).
- **Responsividade**: A interface é completamente adaptável para dispositivos móveis e desktops.

---

## 📁 Estrutura de Pastas

src/
├── assets/ # Imagens, ícones e arquivos estáticos
├── components/ # Componentes reutilizáveis (Header)
├── context/ # Contextos globais de estado (ex: Temas)
├── layouts/ # Layouts compartilhados (ex: estrutura de páginas)
├── pages/ # Páginas principais da aplicação
│ ├── assets/ # Cadastro e listagem de ativos
│ ├── salesContract/ # Gerenciamento de contratos de venda
│ ├── suppliers/ # Cadastro e listagem de fornecedores
│ └── typeAssets/ # Cadastro e listagem Tipos de ativos
├── routes/ # Definição e configuração das rotas (React Router)
├── services/ # Comunicação com a API usando Axios
└── App.tsx # Componente principal da aplicação

---

## 🚀 Como Rodar o Projeto

### Pré-requisitos

- Node.js (versão 16 ou superior)
- npm (versão 6 ou superior)

### Passos

```bash
# 1. Clone o repositório
git clone https://github.com/seu-usuario/contract-management.git

# 2. Acesse a pasta do projeto
cd contract-management

# 3. Instale as dependências
npm install

# 4. Inicie o servidor de desenvolvimento
npm start
```

- A aplicação estará disponível em http://localhost:3000.