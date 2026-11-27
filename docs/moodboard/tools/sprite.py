# Gera frontend/public/ornamentos.svg: os ornamentos do moodboard num sprite para <use href="/ornamentos.svg#id">.
# Rodar da raiz do repo: python docs/moodboard/tools/sprite.py
import os
import re
import sys

AQUI = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, AQUI)
import orn as gerador  # noqa: E402

RAIZ = os.path.abspath(os.path.join(AQUI, '..', '..', '..'))
ORN = os.path.join(AQUI, '..', 'orn')
VETORIZADOS = ['canto-superior', 'canto-superior-dir', 'canto-inferior', 'canto-inferior-dir',
               'canto-de-selecao', 'selecao-id', 'seta-lateral']

EXTRAS = '''<symbol id="carretel" viewBox="0 0 420 28"><path d="M0 14 L170 13 L186 14 L170 15 Z M420 14 L250 13 L234 14 L250 15 Z"/><circle cx="210" cy="14" r="11" fill="none" stroke="currentColor" stroke-width="1.6"/><path d="M202 9.5h16M200 14h20M202 18.5h16" stroke="currentColor" stroke-width="1.4"/><path d="M192 14l-6-4v8zM228 14l6-4v8z"/></symbol>
<symbol id="agulha" viewBox="0 0 30 52"><path d="M15 51 L12.6 14 Q15 2 17.4 14 Z" fill="#F3EEE8"/><ellipse cx="15" cy="12" rx="1.1" ry="3.4" fill="#140d0b"/><path d="M15 9 C 4 4, 3 22, 13 22 S 27 30, 22 40" fill="none" stroke="#C8323A" stroke-width="2.2" stroke-linecap="round"/></symbol>'''


def main():
    partes = []
    for n in VETORIZADOS:
        s = open(os.path.join(ORN, n + '.svg'), encoding='utf-8').read()
        vb = re.search(r'viewBox="([^"]+)"', s).group(1)
        miolo = re.sub(r'^<svg[^>]*>', '', s.strip())
        miolo = re.sub(r'</svg>\s*$', '', miolo)
        partes.append(f'<symbol id="{n}" viewBox="{vb}">{miolo}</symbol>')
    partes.append(gerador.simbolos())
    partes.append(EXTRAS)
    saida = os.path.join(RAIZ, 'frontend', 'public', 'ornamentos.svg')
    with open(saida, 'w', encoding='utf-8') as f:
        f.write('<svg xmlns="http://www.w3.org/2000/svg" fill="currentColor">\n' + '\n'.join(partes) + '\n</svg>\n')
    print(saida, os.path.getsize(saida))


if __name__ == '__main__':
    main()
