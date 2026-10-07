# Auditoria de conteúdo — 2026-10-07

Esta auditoria é uma revisão operacional, não aconselhamento jurídico.

## Estado da árvore atual

| Área | Situação para distribuição pública | Ação |
| --- | --- | --- |
| Código e documentação originais | Licenciados sob MIT | Mantidos no repositório |
| `src/data/srd-items.json` | Material do SRD 5.1 | Mantido com atribuição CC-BY-4.0 |
| PDF *Sane Magical Prices* e tabela derivada | Licença de redistribuição não verificada | Retirados da árvore versionada |
| Catálogo amplo de itens, traduções e arquivos legados | Inclui fontes além do SRD e/ou procedência não verificada | Retirados da árvore versionada até curadoria por licença |
| Arquivos de backup locais | Não fazem parte do produto | Ignorados pelo Git |

## Ponto importante: histórico do Git

Remover arquivos em um commit novo **não remove cópias de commits antigos**.
Antes de promover ou anunciar o repositório, o mantenedor deve revisar o
histórico remoto e, se necessário, reescrevê-lo para eliminar os blobs de PDF,
dados e amostras não autorizados. Isso exige coordenação com quem tiver clones
do projeto e um `force push`; portanto não é feito automaticamente por esta
mudança.

## Regra de manutenção

Conteúdo novo só pode entrar quando for original ou tiver licença verificável
para redistribuição. Para material SRD, mantenha a atribuição exigida em
[`ATTRIBUTION.md`](../ATTRIBUTION.md).
