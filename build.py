#!/usr/bin/env python3
"""Gera dist/rota-do-grao.html: um único arquivo com CSS e JS embutidos.

Útil para hospedagens que aceitam apenas um HTML. Os módulos ES são
concatenados na ordem de dependência (imports removidos, `export` descartado)
e envolvidos em uma IIFE para não poluir o escopo global.
"""
import pathlib
import re

ROOT = pathlib.Path(__file__).parent
CSS = ["tokens", "base", "layout", "components", "responsive"]
JS = ["config", "state", "dom", "format", "calculator", "charts", "panels",
      "table", "modal", "ticker", "controls", "nav", "main"]

html = (ROOT / "index.html").read_text(encoding="utf-8")

css = "\n".join((ROOT / "css" / f"{n}.css").read_text(encoding="utf-8") for n in CSS)
html = re.sub(r'(?:\s*<link rel="stylesheet" href="css/[^"]+">)+',
              lambda _: f"\n  <style>\n{css}\n  </style>", html, count=1)


def strip_module(src: str) -> str:
    src = re.sub(r"^import .*?;\s*$", "", src, flags=re.M)
    return re.sub(r"^export (?=const|let|function|class)", "", src, flags=re.M)


js = "\n".join(strip_module((ROOT / "js" / f"{n}.js").read_text(encoding="utf-8")) for n in JS)
html = html.replace('<script type="module" src="js/main.js"></script>',
                    f"<script>\n(() => {{\n'use strict';\n{js}\n}})();\n</script>")

out = ROOT / "dist"
out.mkdir(exist_ok=True)
(out / "rota-do-grao.html").write_text(html, encoding="utf-8")
print(f"dist/rota-do-grao.html — {len(html) / 1024:.1f} KB")
