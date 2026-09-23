from PIL import Image
from pathlib import Path
source = Path('C:/Users/spenc/Desktop/code/website-art-sept21/priority-mail-hero.png')
target = Path('C:/Users/spenc/Desktop/code/spencer-b-media/web/props/priority-mail-hero.webp')
with Image.open(source) as image:
    image.save(target, 'WEBP', quality=87, method=6)
print(f'{target.name}: {target.stat().st_size} bytes')
