# Cinema de Natal 🎄

Projeto pessoal gratuito e sem fins comerciais. O painel reúne 42 portinhas de 13 de novembro a 24 de dezembro de 2026, uma filmoteca com 100 títulos, receitas, quiz e uma lista pessoal.

## Como abrir

- **Com dois cliques** — abra [abrir_calendario.html](abrir_calendario.html) no navegador.
- **Com o mini player do YouTube no Mac** — abra `iniciar_cinema.command` com Python 3 instalado e deixe o Terminal aberto.
- **Para desenvolver** — abra esta pasta no terminal e use um dos comandos abaixo.

```bash
python3 servidores/app.py
```

```bash
php -S 127.0.0.1:8000 -t static servidores/app.php
```

Acesse [http://127.0.0.1:8000](http://127.0.0.1:8000). No Windows, você também pode usar `py servidores/app.py`.

## Onde encontrar cada coisa

| Pasta | Conteúdo |
| --- | --- |
| [static/](static/) | Interface, estilos, scripts e dados públicos da filmoteca |
| [dados/](dados/) | Catálogo das portinhas servido pela API |
| [servidores/](servidores/) | Servidores locais em Python e PHP |
| [ferramentas/](ferramentas/) | Geração da versão HTML independente |
| [docs/](docs/) | Manual de desenvolvimento e instruções de publicação |

- [Manual de desenvolvimento](docs/MANUAL_DEV.md)
- [Como publicar no GitHub](docs/PUBLICAR_NO_GIT.md)

Depois de editar o site ou os catálogos, rode `python3 ferramentas/gerar_html.py` para atualizar o HTML independente.

Sugestões são bem-vindas. Ao relatar um problema, descreva como abrir a página e quais passos reproduzem o erro.
