import re,sys,os
sys.path.insert(0,os.path.dirname(os.path.abspath(__file__)))
import orn as gerador
VB={'seta-de-lista-baixo':'0 -6 90 46'}
base=sys.argv[1]
usar=['canto-superior','canto-superior-dir','canto-inferior','canto-inferior-dir','canto-de-selecao','selecao-id','seta-lateral','seta-de-lista-baixo']
out=[]
for n in usar:
    s=open(os.path.join(base,'orn',n+'.svg'),encoding='utf-8').read()
    vb=VB.get(n) or re.search(r'viewBox="([^"]+)"',s).group(1)
    inner=re.sub(r'^<svg[^>]*>','',s.strip()); inner=re.sub(r'</svg>\s*$','',inner)
    out.append(f'<symbol id="{n}" viewBox="{vb}">{inner}</symbol>')
out.append(gerador.simbolos())
t=open(os.path.join(base,'template.html'),encoding='utf-8').read().replace('{{SPRITE}}','\n'.join(out))
open(os.path.join(base,'hollow-page-pharloom.html'),'w',encoding='utf-8').write(t)
print(len(t))
