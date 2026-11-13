# Manual de desenvolvimento do Cinema de Natal

## Rodar o projeto

Execute os comandos a partir da pasta que contém o README.

| Opção | Comando ou arquivo | Quando usar |
| --- | --- | --- |
| Python 3.9+ | `python3 servidores/app.py` | Desenvolvimento local com a biblioteca padrão |
| PHP | `php -S 127.0.0.1:8000 -t static servidores/app.php` | Desenvolvimento local com a API em PHP |
| Atalho macOS | `iniciar_cinema.command` | Abrir o servidor Python e o navegador juntos |
| HTML independente | `abrir_calendario.html` | Compartilhar um arquivo que abre direto no navegador |

Com o servidor rodando, acesse [http://127.0.0.1:8000](http://127.0.0.1:8000). Se a porta estiver ocupada, use `--port 8001` no comando Python ou troque o endereço para `127.0.0.1:8001` no comando PHP. O Python aceita `--open` para abrir o navegador automaticamente.

## Como as peças se conectam

```text
cinema_de_natal/
├── abrir_calendario.html   # Versão independente gerada
├── iniciar_cinema.command # Atalho do macOS
├── dados/
│   └── filmes.json         # Catálogo das portinhas
├── servidores/
│   ├── app.py              # Servidor Python e API
│   └── app.php             # Roteador PHP e API
├── static/
│   ├── index.html          # Estrutura das abas
│   ├── css/                # Estilos do calendário e do painel
│   ├── js/                 # Interações e componentes
│   └── dados/
│       └── filmoteca.json  # Catálogo pesquisável
├── ferramentas/
│   └── gerar_html.py       # Empacota a versão independente
└── docs/
```

Os dois servidores entregam a interface de `static/` e expõem `GET /api/filmes` e `HEAD /api/filmes`. O calendário monta as portinhas com os dados da API. A Filmoteca lê `static/dados/filmoteca.json` e usa React para renderizar os cartões quando a biblioteca carrega pelo CDN. Sem React, os cartões são renderizados pelo JavaScript local. O projeto funciona sem Node e sem etapa de build do frontend.

## Onde editar

| Quero mudar | Arquivo |
| --- | --- |
| Filmes das portinhas, resumos e links de streaming | [dados/filmes.json](../dados/filmes.json) |
| Filmes, gêneros e fontes de avaliação da Filmoteca | [static/dados/filmoteca.json](../static/dados/filmoteca.json) |
| Abas, textos e guia Como usar | [static/index.html](../static/index.html) |
| Calendário, fichas e notas das portinhas | [static/js/calendario.js](../static/js/calendario.js) |
| Ícones, temas e melodias das portinhas | [static/js/temas.js](../static/js/temas.js), [static/js/audio.js](../static/js/audio.js) |
| Busca, filtros e cartões | [static/js/painel.js](../static/js/painel.js), [static/js/filmoteca-react.js](../static/js/filmoteca-react.js) |
| Receitas e sugestões de pedido | [static/js/cardapio.js](../static/js/cardapio.js) |
| Perguntas e pontuação do quiz | [static/js/quiz.js](../static/js/quiz.js) |
| Sorteio, maratona, lista pessoal e convite | [static/js/sessoes.js](../static/js/sessoes.js) |
| Mini player e playlist | [static/js/trilha.js](../static/js/trilha.js), [static/index.html](../static/index.html) |
| Cores, layout e comportamento em telas menores | [static/css/estilo.css](../static/css/estilo.css), [static/css/painel.css](../static/css/painel.css) |

## Editar o catálogo e as recomendações

Cada portinha usa uma entrada na ordem abaixo.

```json
["Nome do filme", 2026, "N", "Resumo do filme", "https://exemplo.com/filme"]
```

O código `N` corresponde à Netflix, `P` ao Prime Video e `D` ao Disney+. O link direto é opcional. A primeira entrada de novembro corresponde ao dia 13 e a primeira de dezembro ao dia 1. Ao trocar a ordem das entradas, atualize a ordem dos pares de tema e ícone em `temas.js`. Reinicie o servidor Python após editar o catálogo das portinhas.

Cada ficha da Filmoteca usa `title`, `year`, `genre`, `menu` e `summary`. A combinação de título e ano identifica remakes e conecta uma ficha ao calendário. O campo `menu` precisa apontar para uma receita existente em `cardapio.js`. Para registrar uma avaliação, inclua `review.url` e, quando verificada, `review.note`. Algumas avaliações vieram do [guia natalino do Rotten Tomatoes](https://editorial.rottentomatoes.com/guide/best-christmas-movies/).

O quiz soma três pontos por preferência de gênero e um por preferência de comida. Em empate, vale a ordem da Filmoteca. Na maratona, o filtro de gênero orienta o primeiro filme e o segundo vem de outro gênero quando possível.

O navegador guarda progresso, notas e preferências em `localStorage`. As estrelas do calendário são vinculadas à data. As notas de Minha lista são vinculadas ao filme. Portas diferentes e o arquivo local podem ter estados separados.

## Gerar o HTML independente

```bash
python3 ferramentas/gerar_html.py
```

No Windows, use `py ferramentas/gerar_html.py` se esse for o comando do Python. O gerador incorpora CSS, scripts e os dois catálogos. Faça as alterações nos arquivos-fonte indicados acima e regenere o HTML. Para testar o player do YouTube incorporado, use a versão servida por HTTP.

## Conferir antes de enviar uma alteração

1. Abra portinhas dos dois meses e confira títulos, links, temas e notas após recarregar.
2. Busque um título na Filmoteca, filtre por gênero e abra a receita.
3. Complete o quiz e abra a sessão recomendada. Teste sorteio, maratona e convite.
4. Salve um filme e marque-o como assistido. Recarregue para conferir Minha lista.
5. Confira a navegação em tela estreita e abra a trilha sonora pela versão HTTP.
6. Regenere e abra o HTML independente. No pull request, descreva o que mudou e como verificou.

## Portinha de hoje, sessão e duração

O destaque usa a data local do navegador e aparece durante o calendário de 2026, entre 13 de novembro e 24 de dezembro. Se atualizar a edição, confira o ano em `highlightToday`, as datas da interface e as entradas do catálogo.

Minha sessão salva os filmes escolhidos, o cardápio e a data e hora do convite em `localStorage`. A sessão volta ao recarregar no mesmo navegador e endereço.

Na Filmoteca, `duration` é opcional e guarda minutos inteiros. Filmes sem duração aparecem na busca geral e ficam fora dos filtros por tempo. A maratona mostra a soma quando todos os filmes têm duração cadastrada.

## Visita do Papai Noel

`static/js/papai-noel.js` escolhe o transporte e controla os tempos de chegada, parada, visita às portinhas e saída. O CSS em `static/css/painel.css` usa `data-outfit` para manter o figurino depois da chegada. O atlas `static/imagens/papai-noel-figurinos.webp` tem uma linha por figurino e quatro colunas com duas passadas, costas e mão estendida. Para acrescentar movimentos, desenhe as poses no mesmo figurino, alinhe a base dos pés e confira a posição da mão em relação à borda da portinha.

A cena calcula a posição pela portinha visível e cancela a visita em andamento ao redimensionar a janela. A classe `santa-open` só altera a aparência. Para editar a cena e testar a versão independente, rode `python3 ferramentas/gerar_html.py`.

Para animar o desembarque, a escalada e a suspensão com continuidade, ainda são necessários quadros intermediários específicos de cada veículo ou um modelo articulado que preserve a textura e o figurino da referência.
