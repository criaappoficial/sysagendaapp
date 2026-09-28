# SysAgenda - Sistema Local de Agendamento

SysAgenda é um sistema web moderno, robusto e totalmente local, desenvolvido para criar, organizar e compartilhar reuniões.
Ideal para gerenciar a própria agenda sem depender de serviços externos na nuvem, garantindo total privacidade, rapidez e controle dos dados.

## Funcionalidades Principais

*   **Gestão de Reuniões**: Crie reuniões Presenciais, Online ou Híbridas rapidamente.
*   **Convites via WhatsApp**: Geração automática de textos prontos para WhatsApp contendo link da reunião, pauta, horário e participantes.
*   **Gestão de Contatos e Empresas**: Cadastre facilmente pessoas e as associe às reuniões.
*   **Categorias Customizadas**: Identifique reuniões usando cores para melhor organização visual.
*   **Dashboard Inteligente**: Veja as reuniões de hoje, resumos da semana e sua próxima reunião.
*   **Totalmente Local**: Banco de dados SQLite salvo diretamente na pasta `/database`, sem necessidade de APIs ou hospedagens externas.

## Requisitos

*   [Node.js](https://nodejs.org/en) (v20+)
*   NPM (v10+)

## Instalação

1.  Baixe ou clone o repositório.
2.  Abra o terminal na pasta raiz do projeto.
3.  Instale as dependências:
    ```bash
    npm install
    ```

## Configuração do Banco de Dados Local (SQLite)

O projeto usa SQLite via Prisma ORM.

1.  Para criar as tabelas do banco de dados na pasta `/database/meetings.db`:
    ```bash
    npm run db:push
    ```

2.  Para inicializar os dados padrões (Categorias base, configurações do sistema):
    ```bash
    npm run db:seed
    ```

## Executando o Sistema

Para rodar o projeto localmente em ambiente de desenvolvimento, utilize:
```bash
npm run dev
```

O sistema ficará disponível em [http://localhost:3000](http://localhost:3000).

## Comandos Disponíveis

*   `npm run dev` - Inicia o servidor local de desenvolvimento.
*   `npm run build` - Gera a build otimizada de produção.
*   `npm start` - Roda o servidor Next.js de produção.
*   `npm run db:push` - Aplica alterações de esquema no SQLite de forma sincronizada.
*   `npm run db:seed` - Cria dados iniciais.
*   `npm test` - Executa a suíte de testes unitários local (se implementado).

## Estrutura do Projeto

*   `/database` - Contém o arquivo `meetings.db` com todas as suas informações locais.
*   `/prisma` - Configuração do Schema do Prisma e Seed.
*   `/src/actions` - Lógica de backend isolada usando Next.js Server Actions.
*   `/src/app` - Páginas do frontend (Dashboard, Reuniões, Contatos, Configurações, Compartilhar).
*   `/src/components` - Componentes visuais isolados (Formulário, Sidebar, etc).
*   `/src/schemas` - Regras de validação seguras usando Zod.
*   `/src/lib` - Utilitários (como manipulação de datas e formatação de texto do WhatsApp).

## Backup e Restauração

Todo o seu conteúdo é salvo num arquivo local do SQLite. Para fazer um backup completo:
1. Copie o arquivo `/database/meetings.db` para um local seguro.
2. Para restaurar, apenas substitua o arquivo pelo seu backup antes de rodar o comando `npm run dev`.

## Stack Tecnológica

*   **Next.js 14+** (App Router)
*   **React**
*   **Tailwind CSS v4**
*   **Prisma ORM** + **SQLite**
*   **Zod**
*   **Lucide React** (Ícones)
*   **date-fns**
