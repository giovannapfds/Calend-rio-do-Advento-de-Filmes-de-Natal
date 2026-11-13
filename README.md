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
| `static/calendario.js` | Portinhas, fichas, avaliações e progresso |
| `static/audio.js` | Reprodução e interrupção das melodias |
| `static/temas.js` | Temas visuais e arranjos instrumentais |
| `gerar_html.py` | Gera a versão independente a partir dos arquivos-fonte |
| `abrir_calendario.html` | HTML gerado para abrir com dois cliques |
| `.gitignore` | Ignora caches, ambientes virtuais e arquivos locais de configuração |

Após editar o catálogo ou os arquivos em `static/`, rode `python3 gerar_html.py` (ou `py gerar_html.py` no Windows) para atualizar o HTML independente.

- [Guia do código e da manutenção](docs/GUIA_DO_CODIGO.md)
- [Como subir no GitHub](docs/PUBLICAR_NO_GIT.md)

O progresso, as notas e a preferência de som ficam no armazenamento local do navegador. A versão online, a versão servida pelo Python e o HTML independente podem ter estados separados.

## Executar com PHP e React

Na pasta do projeto, execute `php -S 127.0.0.1:8000 -t static app.php` e abra
[http://127.0.0.1:8000](http://127.0.0.1:8000). Use uma porta diferente se o
servidor Python estiver rodando ao mesmo tempo.

O PHP serve a rota `/api/filmes` e o frontend é compartilhado com o servidor
Python. Em ambos, React renderiza os cartões da Filmoteca quando o navegador
consegue carregar a biblioteca. O HTML independente e os navegadores sem acesso
ao CDN usam a renderização local. Não é preciso instalar Node ou executar um build.

- [Servidor de desenvolvimento do PHP](https://www.php.net/manual/en/features.commandline.webserver.php)
- [Uso do React em uma parte da página](https://react.dev/reference/react-dom/client/createRoot#rendering-a-page-partially-built-with-react)
