"""Genera miniaturas WebP (480 px) de las fotos de /products en /products/w.
Uso:  python3 scripts/miniaturas.py   (desde la carpeta sitio-nac)
Si agregas fotos nuevas y no corres esto, la tienda usa la foto original (funciona igual, solo carga más lento)."""
import os
from PIL import Image
SRC = 'products'; DST = 'products/w'; SIZE = 480
os.makedirs(DST, exist_ok=True)
n = 0
for f in sorted(os.listdir(SRC)):
    base, ext = os.path.splitext(f)
    if ext.lower() not in ('.jpg', '.jpeg', '.png', '.webp'): continue
    out = os.path.join(DST, base + '.webp')
    if os.path.exists(out) and os.path.getmtime(out) >= os.path.getmtime(os.path.join(SRC, f)): continue
    im = Image.open(os.path.join(SRC, f))
    im = im.convert('RGBA') if im.mode in ('RGBA', 'LA', 'P') else im.convert('RGB')
    if im.mode == 'RGBA':
        bg = Image.new('RGB', im.size, (255, 255, 255)); bg.paste(im, mask=im.getchannel('A')); im = bg
    im.thumbnail((SIZE, SIZE), Image.LANCZOS)
    im.save(out, 'WEBP', quality=80, method=6); n += 1
print('miniaturas nuevas:', n)
