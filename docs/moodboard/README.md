# Moodboard

Direção visual da Hollow Page Pharloom: cenários, paleta, tipos, ornamentos, componentes, mapas, vessel, perfil e conquistas.

- `template.html`: a página, com `{{SPRITE}}` no lugar dos ornamentos.
- `orn/`: ornamentos vetorizados da Hollow Page original.
- `tools/orn.py`: gera as molduras de Pharloom (agulha, carretel, sino, espinho) e os cantos.
- `tools/build.py`: monta `hollow-page-pharloom.html` juntando template e ornamentos.
- `tools/sprite.py`: gera `frontend/public/ornamentos.svg` para o site.
- `refs/`: prints do jogo e os mapas da Hollow Knight Wiki.

```bash
python docs/moodboard/tools/build.py docs/moodboard
python -m http.server -d docs/moodboard 8771   # abrir /hollow-page-pharloom.html
python docs/moodboard/tools/sprite.py
```
