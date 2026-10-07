# DnDTools

> Ferramentas open source para mestres de RPG criarem conteúdo de mesa sem
> repetir trabalho operacional.

[![Licença MIT](https://img.shields.io/badge/license-MIT-amber.svg)](LICENSE)
[![Conteúdo SRD](https://img.shields.io/badge/game%20content-SRD%205.1%20%2F%20CC--BY--4.0-blue.svg)](ATTRIBUTION.md)

**[Ver roadmap](ROADMAP.md)** · **[Contribuir](CONTRIBUTING.md)**

> A demonstração online será adicionada assim que o projeto for publicado no
> domínio de produção correto. Para rodar a aplicação agora, siga as instruções
> de [execução local](#executar-localmente).

DnDTools é uma plataforma aberta para automatizar tarefas repetitivas de
Dungeon Masters e outros mestres de RPG. A primeira ferramenta é um gerador e
gerenciador de lojas: você define regras de inventário, filtra os itens e cria
lojas prontas para levar à sessão. O objetivo não é atender apenas uma
campanha, mas oferecer uma base reutilizável e extensível para qualquer mesa.

## O problema que resolve

Montar uma loja de RPG costuma exigir pesquisar itens, equilibrar raridade,
variar o estoque, definir preços e ainda dar personalidade ao comerciante. O
DnDTools reúne esse fluxo em uma interface: o mestre configura a loja e recebe
um inventário legível, pronto para improvisar ou preparar a próxima sessão.

## Funcionalidades atuais

- Geração de múltiplas lojas em uma única solicitação.
- Regras por quantidade, raridade, categoria e classe.
- Catálogo de itens baseado no SRD 5.1 distribuído com atribuição CC-BY-4.0.
- Detalhes expansíveis para consultar propriedades e descrições dos itens.
- Nomes de loja e personalidade de comerciante personalizáveis.
- Texto narrativo opcional para a entrada da loja e apresentação de itens,
  gerado pela API da OpenAI.
- Interface em português brasileiro, responsiva e adequada para uso à mesa.

## Executar localmente

Pré-requisito: Node.js compatível com a versão do Next.js declarada em
`package.json`.

```bash
git clone https://github.com/haydnsass/dndtools.git
cd dndtools
npm install
Copy-Item .env.example .env.local
npm run dev
```

Abra [http://localhost:3000](http://localhost:3000). A geração de inventários
funciona sem chave de API; para o texto narrativo opcional, adicione sua chave
em `.env.local`:

```dotenv
OPENAI_API_KEY=sua_chave
```

Para verificar uma alteração antes de abrir um pull request:

```bash
npm run lint
npm run build
```

## Tecnologias

- Next.js 16 e React 19
- TypeScript
- Tailwind CSS
- OpenAI API, apenas para o texto narrativo opcional

## Roadmap

O plano público está em [ROADMAP.md](ROADMAP.md). As prioridades iniciais são
pacotes de conteúdo por licença, preços configuráveis, exportação/importação
de lojas e uma biblioteca de comerciantes e cenários originais.

## Como contribuir

Issues e pull requests são bem-vindos. Leia [CONTRIBUTING.md](CONTRIBUTING.md)
e a [política de conteúdo](docs/CONTENT_POLICY.md) antes de contribuir. Em
especial, não envie material de terceiros sem licença de redistribuição clara.

## Licença e conteúdo de jogo

O código e a documentação originais estão sob [MIT](LICENSE). O catálogo em
`src/data/srd-items.json` e `src/data/srd-item-translations.ts` contêm material
do SRD 5.1 e são disponibilizados sob CC-BY-4.0, com a atribuição em
[ATTRIBUTION.md](ATTRIBUTION.md). Esses regimes de licença são diferentes.

DnDTools é um projeto independente e não é afiliado, endossado ou patrocinado
pela Wizards of the Coast. “Dungeons & Dragons” e “D&D” são marcas de seus
respectivos titulares.
