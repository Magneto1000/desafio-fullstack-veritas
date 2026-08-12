# 📋 Kanban Veritas - Desafio FullStack

Este é o Produto Mínimo Viável (MVP) de um mini Kanban de tarefas desenvolvido para o processo seletivo da Veritas Consultoria Empresarial. A aplicação permite realizar operações de CRUD (Criar, Ler, Atualizar e Excluir) em tarefas organizadas em três colunas de status.

## 🚀 Tecnologias Utilizadas
* **Frontend:** React (criado com Vite), CSS puro para estilização fluida e componentização simplificada.
* **Backend:** Go (Golang), servindo uma API RESTful.
* **Armazenamento:** Estrutura de dados em memória (Map), utilizando `sync.Mutex` para garantir segurança contra condições de corrida (concorrência).

## ⚙️ Decisões Técnicas e Arquitetura
1. **Gerenciamento de Estado:** Optei por gerenciar o estado da aplicação localmente com o hook `useState` e sincronizar com o backend via `useEffect`.
2. **Fluxo de Movimentação:** Para focar na fluidez exigida pelo escopo mínimo e garantir o CRUD completo, implementei a transição de status via botões direcionais (`<` e `>`), alterando o status da tarefa entre `TODO`, `DOING` e `DONE` diretamente na API.
3. **CORS e Middleware:** Desenvolvi um middleware customizado no backend em Go para habilitar o CORS, permitindo a comunicação segura entre o servidor local do frontend (porta 5173) e a API (porta 8080).
4. **User Flow:** A modelagem da jornada do usuário está documentada visualmente e pode ser encontrada no diretório `/docs`.

## 💻 Como rodar o projeto localmente

Você precisará de dois terminais abertos para rodar o backend e o frontend simultaneamente.

### Passo 1: Rodando a API (Backend)
1. Navegue até a pasta do backend: `cd backend`
2. Execute o servidor: `go run main.go`
3. O servidor estará rodando em `http://localhost:8080`

### Passo 2: Rodando a Interface (Frontend)
1. Em um novo terminal, navegue até a pasta do frontend: `cd frontend`
2. Instale as dependências: `npm install`
3. Inicie o servidor de desenvolvimento: `npm run dev`
4. Acesse a aplicação no navegador através do link gerado (geralmente `http://localhost:5173/`).