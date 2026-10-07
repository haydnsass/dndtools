# Contributing to DnDTools

Obrigado por querer melhorar o DnDTools. O projeto existe para ajudar mestres
de RPG a reduzir trabalho repetitivo, de forma que outras mesas possam usá-lo,
estudá-lo e adaptá-lo.

## Antes de abrir uma contribuição

1. Procure uma issue existente ou abra uma issue curta para discutir mudanças
   que alterem comportamento, dados ou interface.
2. Crie uma branch a partir da `main` e mantenha o pull request focado em um
   único objetivo.
3. Rode `npm run lint` e `npm run build` antes de enviar o PR.
4. Explique no PR o problema resolvido, como foi testado e inclua imagens para
   mudanças visuais.

## Conteúdo, dados e assets

Não envie PDFs, ilustrações, textos de livros, stat blocks, listas de itens ou
outros materiais de terceiros sem uma licença redistribuível que permita esse
uso. Todo dado de jogo deve ser:

- criado por quem contribui; ou
- proveniente de uma fonte com licença verificável, acompanhado da atribuição
  e da licença exigidas.

O catálogo distribuído hoje é deliberadamente limitado ao SRD. Leia
[`docs/CONTENT_POLICY.md`](docs/CONTENT_POLICY.md) e
[`ATTRIBUTION.md`](ATTRIBUTION.md) antes de alterar arquivos em `src/data/`.

## Desenvolvimento local

```bash
npm install
Copy-Item .env.example .env.local
npm run dev
```

`OPENAI_API_KEY` é necessário apenas para gerar textos narrativos opcionais.
Nunca envie chaves, arquivos `.env*` ou dados privados em commits.
