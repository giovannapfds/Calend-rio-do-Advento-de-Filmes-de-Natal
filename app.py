"""Servidor local do calendário de filmes de Natal."""

import argparse
import json
from functools import partial
from http import HTTPStatus
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from io import BytesIO
from pathlib import Path
from urllib.parse import urlsplit

PROJECT_DIR = Path(__file__).resolve().parent
STATIC_DIR = PROJECT_DIR / "static"
CATALOG_PATH = PROJECT_DIR / "filmes.json"


class CalendarHandler(SimpleHTTPRequestHandler):
    def __init__(self, *args, catalog_body, **kwargs):
        self.catalog_body = catalog_body
        super().__init__(*args, **kwargs)

    def send_head(self):
        """Compartilha os cabeçalhos entre GET e HEAD, como os arquivos estáticos."""
        if urlsplit(self.path).path != "/api/filmes":
            return super().send_head()

        self.send_response(HTTPStatus.OK)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(self.catalog_body)))
        self.end_headers()
        return BytesIO(self.catalog_body)


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--port", type=int, default=8000, help="Porta do servidor local")
    args = parser.parse_args()
    # Carrega uma vez na inicialização e compartilha o catálogo entre requisições.
    catalog = json.loads(CATALOG_PATH.read_text(encoding="utf-8"))
    catalog_body = json.dumps(catalog, ensure_ascii=False).encode("utf-8")
    handler = partial(CalendarHandler, directory=str(STATIC_DIR), catalog_body=catalog_body)

    with ThreadingHTTPServer(("127.0.0.1", args.port), handler) as server:
        print(f"Abra http://127.0.0.1:{server.server_port}/", flush=True)
        try:
            server.serve_forever()
        except KeyboardInterrupt:
            pass


if __name__ == "__main__":
    main()
