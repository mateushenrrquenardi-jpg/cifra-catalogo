# Cifra Web — Catálogo de Cifras

Repositório oficial para armazenamento do catálogo de cifras musicais do projeto **Cifra Web**.

## Estrutura do Catálogo

Cada música é representada por um arquivo `.md` organizado por pasta de artista:

```text
musicas/
└── <artista-normalizado>/
    └── <musica-normalizada>.md
```

## Formato do Arquivo de Cifra

Os arquivos seguem a especificação de `DATA_MODEL.md`:

```markdown
---
title: Nome da Música
artist: Artista Oficial
category: Gênero / Categoria
tags:
  - tag1
  - tag2
author: Compositor (opcional)
created_at: YYYY-MM-DD
original_key: Tom
---

[C]             [Am]
Linha da letra com acordes entre colchetes...
```
