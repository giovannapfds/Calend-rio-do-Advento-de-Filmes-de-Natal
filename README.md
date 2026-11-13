# Cinema de Natal 🎄

Calendário interativo de filmes de Natal, com 42 portinhas de 13 de novembro a 24 de dezembro de 2026. Cada dia mostra um filme, um resumo, onde assistir e uma avaliação de 1 a 5 estrelas. As fichas têm temas visuais e melodias que combinam com os filmes.

## Abrir no navegador

Extraia o ZIP inteiro. Para experimentar o calendário sem instalar nada, dê dois cliques em **`abrir_calendario.html`** e abra o arquivo no Chrome ou no Safari. Esse arquivo é uma versão independente do calendário, incluída para facilitar a abertura local.

## Executar com Python e JavaScript

1. Abra a pasta **`cinema_de_natal`** no VS Code.
2. Abra **Terminal → Novo Terminal**. Use Python 3.9 ou posterior.
3. No Mac ou Linux, execute `python3 app.py`. No Windows, execute `py app.py` ou `python app.py`.
4. Mantenha o terminal aberto e acesse [http://127.0.0.1:8000](http://127.0.0.1:8000) no navegador do mesmo computador.

O projeto usa a biblioteca padrão do Python. Se a porta estiver ocupada, acrescente `--port 8001` ao comando e use o endereço exibido no terminal.

## Código e documentação

| Arquivo | Função |
| --- | --- |
| `app.py` | Servidor Python local e rota `GET /api/filmes` |
| `filmes.json` | Catálogo com os 42 filmes |
| `static/index.html` | Estrutura da página servida pelo Python |
| `static/estilo.css` | Layout, cores, contraste e animações |
| `static/calendario.js` | Portinhas, fichas, áudio, avaliações e progresso |
| `static/temas.js` | Temas visuais e arranjos instrumentais |
| `abrir_calendario.html` | Cópia independente para abrir com dois cliques |
| `.gitignore` | Ignora caches, ambientes virtuais e arquivos locais de configuração |

- [Guia do código e da manutenção](docs/GUIA_DO_CODIGO.md)
- [Como subir no GitHub](docs/PUBLICAR_NO_GIT.md)

O progresso, as notas e a preferência de som ficam no armazenamento local do navegador. A versão online, a versão servida pelo Python e o HTML independente podem ter estados separados.
