"""Servidor local do calendário de filmes de Natal."""

import argparse
import json
from functools import partial
from http import HTTPStatus
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.parse import urlsplit

PROJECT_DIR = Path(__file__).resolve().parent
STATIC_DIR = PROJECT_DIR / "static"
CATALOG = json.loads((PROJECT_DIR / "filmes.json").read_text(encoding="utf-8"))
CATALOG_BODY = json.dumps(CATALOG, ensure_ascii=False).encode("utf-8")


class CalendarHandler(SimpleHTTPRequestHandler):
    def do_GET(self):
        if urlsplit(self.path).path != "/api/filmes":
            super().do_GET()
            return

        self.send_response(HTTPStatus.OK)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(CATALOG_BODY)))
        self.end_headers()
        self.wfile.write(CATALOG_BODY)


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--port", type=int, default=8000, help="Porta do servidor local")
    args = parser.parse_args()
    handler = partial(CalendarHandler, directory=str(STATIC_DIR))

    with ThreadingHTTPServer(("127.0.0.1", args.port), handler) as server:
        print(f"Abra http://127.0.0.1:{server.server_port}/", flush=True)
        try:
            server.serve_forever()
        except KeyboardInterrupt:
            pass


if __name__ == "__main__":
    main()
