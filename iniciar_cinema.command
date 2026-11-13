#!/bin/zsh
# Abre a versão local com HTTP, necessário para o player do YouTube.
set -eu
cd -- "$(dirname -- "$0")"

if ! command -v python3 >/dev/null; then
  print -u2 'Instale o Python 3 para iniciar o Cinema de Natal.'
  exit 1
fi

exec python3 servidores/app.py --open
