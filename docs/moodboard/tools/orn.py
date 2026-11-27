# Gera ornamentos caligráficos (traço afinando + espirais) como <symbol> SVG.
import math

def bez(p0, p1, p2, p3, n=40):
    out = []
    for i in range(n + 1):
        t = i / n; u = 1 - t
        out.append((u**3*p0[0] + 3*u*u*t*p1[0] + 3*u*t*t*p2[0] + t**3*p3[0],
                    u**3*p0[1] + 3*u*u*t*p1[1] + 3*u*t*t*p2[1] + t**3*p3[1]))
    return out

def poly(pts, ws):
    L, R = [], []
    n = len(pts)
    for i in range(n):
        a = pts[max(i-1, 0)]; b = pts[min(i+1, n-1)]
        dx, dy = b[0]-a[0], b[1]-a[1]; d = math.hypot(dx, dy) or 1
        nx, ny = -dy/d, dx/d; w = ws[i]/2
        L.append((pts[i][0]+nx*w, pts[i][1]+ny*w)); R.append((pts[i][0]-nx*w, pts[i][1]-ny*w))
    P = L + R[::-1]
    return 'M' + 'L'.join(f'{x:.1f} {y:.1f}' for x, y in P) + 'Z'

def perfil(n, w0, wm, w1, pico=.5):
    out = []
    for i in range(n):
        t = i/(n-1)
        if t < pico: w = w0 + (wm-w0)*math.sin(t/pico*math.pi/2)
        else: w = wm + (w1-wm)*(1-math.cos((t-pico)/(1-pico)*math.pi/2))
        out.append(max(w, .25))
    return out

def floreio(p0, c1, c2, p3, wm=4.0, curl=0.0, sentido=1, voltas=1.6, w0=.4, pico=.45):
    """Curva que afina e termina numa espiral (curl = raio inicial; 0 = sem espiral)."""
    pts = bez(p0, c1, c2, p3, 48)
    if curl <= 0:
        return poly(pts, perfil(len(pts), w0, wm, .3, pico))
    wb = perfil(len(pts), w0, wm, wm*.75, pico)
    a, b = pts[-2], pts[-1]
    dx, dy = b[0]-a[0], b[1]-a[1]; d = math.hypot(dx, dy) or 1
    nx, ny = -dy/d*sentido, dx/d*sentido
    cx, cy = b[0]+nx*curl, b[1]+ny*curl
    ang0 = math.atan2(b[1]-cy, b[0]-cx)
    m = int(60*voltas)
    sp, ws = [], []
    for i in range(1, m+1):
        t = i/m
        r = curl*(1-.82*t)
        ang = ang0 + sentido*(-1)*(-t*voltas*2*math.pi)
        sp.append((cx+r*math.cos(ang), cy+r*math.sin(ang)))
        ws.append(wm*.75*(1-t) + .5*t)
    # bolinha na ponta da espiral
    ex, ey = sp[-1]
    return poly(pts+sp, wb+ws) + circ(ex, ey, wm*.42)

def circ(x, y, r):
    return f'M{x-r:.1f} {y:.1f}a{r:.1f} {r:.1f} 0 1 0 {2*r:.1f} 0a{r:.1f} {r:.1f} 0 1 0 {-2*r:.1f} 0Z'

def espinho(x, y, ang, comp=10, larg=3.2):
    a = math.radians(ang); bx, by = math.cos(a+math.pi/2)*larg/2, math.sin(a+math.pi/2)*larg/2
    tx, ty = x+math.cos(a)*comp, y+math.sin(a)*comp
    # leve curva
    mx, my = x+math.cos(a)*comp*.55+bx*.6, y+math.sin(a)*comp*.55+by*.6
    return f'M{x+bx:.1f} {y+by:.1f}Q{mx:.1f} {my:.1f} {tx:.1f} {ty:.1f}L{x-bx:.1f} {y-by:.1f}Z'

def losango(x, y, rx, ry):
    return f'M{x} {y-ry}L{x+rx} {y}L{x} {y+ry}L{x-rx} {y}Z'

def espelhar(d, cx):
    # espelha números x de um path absoluto (só comandos M L Q C Z e 'a' relativo tratado à parte)
    import re
    toks = re.findall(r'[MLQCZa]|-?\d+\.?\d*', d)
    out = []; i = 0; cmd = None; k = 0; rel = False
    while i < len(toks):
        t = toks[i]
        if t in 'MLQCZa':
            cmd = t; out.append(t); k = 0; i += 1; continue
        v = float(t)
        if cmd == 'a':
            # rx ry rot large sweep dx dy
            if k % 7 == 4: v = 1 - v  # inverte sweep
            if k % 7 == 5: v = -v
            out.append(f'{v:g}' if k % 7 in (3, 4) else f'{v:.1f}')
        else:
            if k % 2 == 0: v = 2*cx - v
            out.append(f'{v:.1f}')
        k += 1; i += 1
    s = ''
    for t in out:
        if t in 'MLQCZa': s += t
        else: s += (t if s[-1:] in 'MLQCZa' else ' '+t)
    return s

def sim(meia, cx):
    return meia + espelhar(meia, cx)

# ---------- lado de moldura de título (metade esquerda, centro x=300) ----------
def lado_titulo(y=60, espinhos=False, fio=False):
    d = ''
    # linha longa que afina até a ponta
    d += floreio((262, y), (200, y+2), (110, y+1), (14, y), wm=3.4, w0=2.6, pico=.2)
    # curva grande de cima terminando em espiral
    d += floreio((262, y-3), (240, y-26), (200, y-34), (170, y-22), wm=4.6, curl=11, sentido=-1, voltas=1.3)
    # curva menor de baixo
    d += floreio((250, y+4), (232, y+20), (206, y+22), (190, y+12), wm=3.2, curl=7, sentido=1, voltas=1.2)
    # gancho externo
    d += floreio((150, y-1), (128, y-14), (104, y-16), (92, y-8), wm=2.4, curl=5, sentido=-1, voltas=1.1)
    d += circ(60, y, 2.6)
    if espinhos:
        for x, s in ((228, 1), (196, -1), (130, 1), (80, -1)):
            d += espinho(x, y + (1.5 if s > 0 else -1.5), 90*s - 25*s, 11 if x > 150 else 8, 3)
    if fio:
        d += floreio((262, y+1), (230, y-8), (214, y+16), (180, y+30), wm=1.6, curl=6, sentido=-1, voltas=1.0, w0=1.2)
    return d

def emblema(tipo, cx=300, y=60):
    if tipo == 'carretel':
        return (f'M{cx-15} {y-16}h30v5h-30zM{cx-15} {y+11}h30v5h-30z'
                f'M{cx-10} {y-11}h20v22h-20zM{cx-6} {y-7}h12v2h-12zM{cx-6} {y-1}h12v2h-12zM{cx-6} {y+5}h12v2h-12z'
                + espinho(cx, y-16, -90, 12, 4) + espinho(cx, y+16, 90, 12, 4))
    if tipo == 'agulha':
        d = f'M{cx} {y+34}L{cx-3.2} {y-14}Q{cx} {y-30} {cx+3.2} {y-14}Z'
        d += f'M{cx-1.1} {y-20}a1.1 3.4 0 1 0 2.2 0a1.1 3.4 0 1 0 -2.2 0Z'
        return d
    if tipo == 'sino':
        return (f'M{cx-14} {y+10}Q{cx-14} {y-20} {cx} {y-20}Q{cx+14} {y-20} {cx+14} {y+10}L{cx+18} {y+14}L{cx-18} {y+14}Z'
                f'M{cx-8} {y+6}Q{cx-8} {y-12} {cx} {y-12}Q{cx+8} {y-12} {cx+8} {y+6}Z' + circ(cx, y+20, 4) + circ(cx, y-24, 3))
    if tipo == 'espinho':
        return (losango(cx, y, 12, 20) + f'M{cx} {y-11}L{cx+6} {y}L{cx} {y+11}L{cx-6} {y}Z'
                + espinho(cx, y-20, -90, 14, 4) + espinho(cx, y+20, 90, 10, 4)
                + espinho(cx-10, y-6, -150, 10, 3) + espinho(cx+10, y-6, -30, 10, 3))
    return ''

def anel_fio(cx=300, y=60):
    # laço de linha em volta da agulha
    a = floreio((cx+4, y-6), (cx+34, y-24), (cx+30, y+22), (cx-2, y+12), wm=1.8, w0=1.2)
    b = floreio((cx-4, y+12), (cx-32, y+4), (cx-30, y-26), (cx-6, y-18), wm=1.8, w0=1.2)
    return a + b

def titulo(tipo):
    lado = lado_titulo(espinhos=(tipo == 'espinho'), fio=(tipo == 'agulha'))
    d = sim(lado, 300) + emblema(tipo)
    if tipo == 'agulha': d += anel_fio()
    return d

# ---------- cantos (viewBox 0 0 120 120) ----------
def canto(tipo):
    d = ''
    d += floreio((18, 16), (50, 15), (80, 15), (118, 16), wm=2.6, w0=3, pico=.1)
    d += floreio((16, 18), (15, 50), (15, 80), (16, 118), wm=2.6, w0=3, pico=.1)
    d += floreio((18, 18), (40, 26), (46, 44), (34, 50), wm=3.6, curl=7, sentido=1, voltas=1.25)
    d += floreio((20, 20), (30, 34), (44, 42), (52, 32), wm=2.6, curl=5, sentido=-1, voltas=1.1)
    d += circ(10, 10, 3.2)
    if tipo == 'espinho':
        d += espinho(16, 16, -135, 14, 4.2)
        d += espinho(60, 16, -60, 9, 3) + espinho(88, 16, -60, 7, 2.6)
        d += espinho(16, 60, -150, 9, 3) + espinho(16, 88, -150, 7, 2.6)
    if tipo == 'fio':
        d += floreio((22, 22), (70, 30), (30, 70), (70, 76), wm=1.5, curl=6, sentido=1, voltas=1, w0=1)
        d += f'M58 12L100 9.4Q106 10 100 10.6L58 13.6Z' + circ(100, 10, .8)
    return d

def simbolos():
    s = []
    for t in ('agulha', 'carretel', 'sino', 'espinho'):
        s.append(f'<symbol id="t-{t}" viewBox="0 0 600 120"><path fill-rule="nonzero" d="{titulo(t)}"/></symbol>')
    for t in ('liso', 'espinho', 'fio'):
        s.append(f'<symbol id="k-{t}" viewBox="0 0 120 120"><path d="{canto(t)}"/></symbol>')
    return '\n'.join(s)

if __name__ == '__main__':
    print(len(simbolos()))
