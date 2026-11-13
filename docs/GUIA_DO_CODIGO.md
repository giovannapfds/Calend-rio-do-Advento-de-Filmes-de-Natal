# Guia do código

## Como o calendário funciona

O navegador abre `static/index.html`, que carrega o CSS e os scripts. O JavaScript consulta `GET /api/filmes` no servidor Python e monta as portinhas na ordem do catálogo. Ao clicar numa data, o código mostra a ficha, toca a melodia se o som estiver ligado e marca a portinha como aberta. Os links de streaming dependem dos catálogos brasileiros e podem mudar.

## Trocar um filme ou seu tema

Em `filmes.json`, cada entrada segue esta ordem:

```json
["Nome do filme", 2026, "N", "Resumo do filme", "https://exemplo.com/filme"]
```

`N` significa Netflix, `P` Prime Video e `D` Disney+. O quinto item é opcional. A primeira entrada de novembro corresponde ao dia 13, e a primeira de dezembro ao dia 1. Para trocar um filme, edite a entrada daquela data e reinicie o servidor, que lê o catálogo ao iniciar. Se mudar a ordem das entradas, ajuste a ordem correspondente em `static/temas.js`.

O par de cada data em `static/temas.js` contém o nome do tema e o ícone da ficha. O objeto `themes` define as notas, o timbre e o ritmo. Para mudar as cores, procure o tema correspondente no CSS, nos seletores `#film[data-theme="…"]`.

## Layout e avaliações

A página e os controles ficam em `static/index.html`. A aparência e os tamanhos para celular ficam em `static/estilo.css`. A lógica da nota fica em `showRating` e no evento `change` de `ratingGroup` em `static/calendario.js`. O navegador guarda as notas por data em `localStorage`, sem banco de dados.

## Conferir depois de editar

1. Rode `app.py` e recarregue a página.
2. Abra uma portinha de novembro e uma de dezembro. Confira título, resumo, tema, som e link.
3. Dê notas diferentes aos dois filmes. Recarregue a página e reabra as portinhas para conferir as notas.
4. Em uma janela estreita, confira a leitura das fichas e o botão de fechar.

`abrir_calendario.html` é uma cópia completa e independente incluída no pacote. Edições no catálogo e nos arquivos de `static/` aparecem na versão servida pelo Python. Para refletir as mesmas edições na cópia independente, atualize também seu catálogo e os estilos ou scripts incorporados.
