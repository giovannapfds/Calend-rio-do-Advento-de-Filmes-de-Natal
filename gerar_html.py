"""Gera a versão independente a partir dos arquivos usados pelo servidor."""

import json
import re
from pathlib import Path

PROJECT_DIR = Path(__file__).resolve().parent
STATIC_DIR = PROJECT_DIR / "static"


def build_html():
    """Incorpora o CSS, os scripts e o catálogo na ordem do HTML original."""
    page = (STATIC_DIR / "index.html").read_text(encoding="utf-8")
    data_tags = [
        inline_json(PROJECT_DIR / "filmes.json", "film-catalog"),
        inline_json(STATIC_DIR / "filmoteca.json", "library-catalog"),
    ]

    page = re.sub(
        r'<link rel="stylesheet" href="([^"]+)">',
        lambda match: inline_asset(match[1], "style"),
        page,
    )
    # O HTML independente usa a renderização local da filmoteca.
    page = re.sub(r'<script defer crossorigin="anonymous" src="https://[^"]+"></script>\n', "", page)
    # O catálogo precisa existir antes da execução do primeiro script.
    first_script = page.index("<script defer")
    page = page[:first_script] + "\n".join(data_tags) + "\n" + page[first_script:]
    return re.sub(
        r'<script defer src="([^"]+)"></script>',
        lambda match: inline_asset(match[1], "script"),
        page,
    )


def inline_json(path, element_id):
    data = json.loads(path.read_text(encoding="utf-8"))
    # Impede que um texto do catálogo seja interpretado como uma tag HTML.
    body = json.dumps(data, ensure_ascii=False, indent=2).replace("<", "\\u003c")
    return f'<script id="{element_id}" type="application/json">\n{body}\n</script>'


def inline_asset(filename, tag):
    content = (STATIC_DIR / filename).read_text(encoding="utf-8").rstrip()
    return f"<{tag}>\n{content}\n</{tag}>"


if __name__ == "__main__":
    output = PROJECT_DIR / "abrir_calendario.html"
    notice = "<!-- Arquivo gerado por gerar_html.py. Edite os arquivos-fonte. -->"
    output.write_text(
        build_html().replace("<!doctype html>", f"<!doctype html>\n{notice}", 1),
        encoding="utf-8",
    )
    print(f"Arquivo atualizado: {output.name}")
