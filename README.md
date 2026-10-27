# Pokédex — Bootstrap + JSON Server

Projeto de estudo com HTML, CSS e JavaScript separados, sem framework de JavaScript. Inclui 32 Pokémon de Kanto, busca por nome/número, filtros de tipo, ordenação, detalhes em modal e favoritos persistidos em db.json com PATCH.

## Como executar no Windows (Git Bash ou terminal do VS Code)

1. Instale o Node.js (versão 18 ou superior, preferencialmente LTS).
2. Extraia o ZIP e abra o terminal dentro da pasta pokedex (onde está package.json).
3. Execute:

```bash
npm install
npm start
```

4. Abra **http://localhost:3000** no navegador. Mantenha o terminal aberto. Para encerrar, pressione Ctrl+C.

Não abra index.html com duplo clique: ele precisa da API. O mesmo servidor entrega o site e a API; não precisa do Live Server.

## Arquivos

- public/index.html: estrutura e componentes Bootstrap.
- public/css/styles.css: identidade visual e responsividade.
- public/js/app.js: fetch, filtros, renderização, modal e gravação dos favoritos.
- db.json: dados dos Pokémon e estado dos favoritos.
- package.json: dependência e comando de execução.

## API

- GET /pokemons: lista completa.
- GET /pokemons/25: Pikachu.
- PATCH /pokemons/25 com {"favorito":true}: grava o favorito no arquivo.

O catálogo inicial é uma seleção de 32 Pokémon, não a Pokédex completa. Para expandir, adicione registros em db.json seguindo os campos existentes e usando id e numero únicos. As descrições são resumos em português para o projeto de estudo.

Bootstrap 5.3.8 é carregado pelo CDN jsDelivr. As ilustrações vêm do repositório público PokeAPI/sprites; conexão com a internet é necessária para esses recursos e para instalar dependências. Não há dependência da API externa para consultar os dados dos Pokémon. Favoritos são compartilhados por todos que acessam esta instância, sem login.

JSON Server está fixado em 0.17.4 para manter o comando --watch e o comportamento da versão usada no projeto. É uma API de estudo local, sem autenticação.

Documentação: https://getbootstrap.com/docs/5.3/ e https://github.com/typicode/json-server/tree/v0.17.4
