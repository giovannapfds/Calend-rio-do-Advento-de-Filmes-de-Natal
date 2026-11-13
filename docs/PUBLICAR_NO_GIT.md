# Enviar o projeto para o GitHub

1. Crie um repositório vazio no GitHub e copie a URL HTTPS.
2. Abra no VS Code a pasta extraída que contém `app.py` e `README.md`.
3. No terminal dessa pasta, execute os comandos abaixo. Troque a URL de exemplo pela URL do seu repositório.

```bash
git init -b main
git add .
git commit -m "Adiciona projeto Cinema de Natal"
git remote add origin https://github.com/SEU-USUARIO/cinema-de-natal.git
git push -u origin main
```

Se o Git pedir seu nome e e-mail para o primeiro commit, configure-os na pasta do projeto com `git config user.name "Seu nome"` e `git config user.email "seu-email"`. Depois repita o commit e continue.

O push envia o código-fonte. Para disponibilizar a versão Python como site, use uma hospedagem que execute Python. Para hospedagem estática, use o HTML independente como `index.html` na pasta publicada.
