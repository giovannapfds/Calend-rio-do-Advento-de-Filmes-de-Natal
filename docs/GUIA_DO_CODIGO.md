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

## Layout, som e avaliações

A página e os controles ficam em `static/index.html`. Edite o template `door-template` para alterar a estrutura de todas as portinhas. A aparência e os tamanhos para celular ficam em `static/estilo.css`. A lógica da nota fica em `showRating` e no evento `change` de `ratingGroup` em `static/calendario.js`. O navegador guarda as notas e o progresso por data em `localStorage`, usando chaves como `novembro-13`. A reprodução fica em `static/audio.js` e usa Web Audio.

## Conferir depois de editar

1. Rode `app.py` e recarregue a página.
2. Abra uma portinha de novembro e uma de dezembro. Confira título, resumo, tema, som e link.
3. Dê notas diferentes aos dois filmes. Recarregue a página e reabra as portinhas para conferir as notas.
4. Em uma janela estreita, confira a leitura das fichas e o botão de fechar.
5. Rode `python3 gerar_html.py` (ou `py gerar_html.py` no Windows) e abra `abrir_calendario.html` para conferir a versão independente.

O gerador incorpora o catálogo, o CSS e os scripts a partir dos arquivos-fonte. Faça as alterações nesses arquivos e regenere o HTML antes de publicar ou compartilhar a versão independente.

## Filmoteca, receitas e quiz

- `static/filmoteca.json` guarda as fichas da filmoteca. O painel ordena pelo título em português e usa o ano para distinguir remakes. Para registrar uma avaliação verificada, adicione `review.url` e `review.note` à ficha. As porcentagens consultadas vêm do [guia natalino do Rotten Tomatoes](https://editorial.rottentomatoes.com/guide/best-christmas-movies/).
- `static/cardapio.js` guarda receitas compartilhadas. Cada filme aponta para uma delas pelo campo `menu`. O campo `order` descreve o que buscar no iFood, cuja oferta depende do endereço.
- `static/quiz.js` guarda as dez perguntas e a pontuação. A preferência de gênero pesa três pontos por resposta e a de comida, um ponto. Em empate de filmes, vale a ordem da filmoteca.
- `static/painel.js` cuida da navegação, da busca, da exibição das receitas e da montagem do quiz. Depois de editar esses arquivos, regenere o HTML independente.

## Sessões, maratona e lista pessoal

`static/sessoes.js` reúne as ações de montar sessão, sortear, criar maratona e compartilhar o convite. O sorteio pode excluir filmes marcados como assistidos. Na maratona, o gênero selecionado orienta o primeiro filme e o segundo vem de outro gênero quando possível.

A lista usa o título e o ano como chave e guarda o estado no navegador. As notas da lista pessoal são por filme. As estrelas do calendário continuam vinculadas à portinha. Para títulos do calendário, a sessão reutiliza os mesmos links de streaming. Para os demais, abre uma busca no JustWatch.
