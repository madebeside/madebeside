"""Original geometric motion placeholders; no client footage or reference assets."""
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont
import math, subprocess

ROOT = Path(__file__).resolve().parents[1]
DEST = ROOT / 'web' / 'placeholders'
DEST.mkdir(parents=True, exist_ok=True)
FONT = ROOT / 'web' / 'fonts' / 'dm-sans-variable.ttf'
FFMPEG = ROOT / '.sites-runtime' / 'tools' / 'ffmpeg.exe'
W, H, FPS, SECONDS = 960, 540, 30, 8
INK, PAPER, GREEN = '#121111', '#f5f5f0', '#16db65'

def font(size, weight=600):
    value = ImageFont.truetype(str(FONT), size)
    try: value.set_variation_by_axes([weight])
    except (OSError, ValueError): pass
    return value

LARGE, MEDIUM, SMALL = font(118, 600), font(77, 550), font(22, 500)

def text(draw, xy, words, face=LARGE, fill=INK, spacing=-6):
    x, y = xy
    for char in words:
        draw.text((x,y), char, font=face, fill=fill, anchor='la')
        x += draw.textlength(char, font=face) + spacing

def arch(draw, x, y, width=180, height=254, stroke=48, fill=GREEN):
    draw.arc((x,y,x+width,y+width),180,360,fill=fill,width=stroke)
    draw.rectangle((x,y+width/2,x+stroke-1,y+height),fill=fill)
    draw.rectangle((x+width-stroke,y+width/2,x+width,y+height),fill=fill)

def frame(index, phase):
    wave = math.sin(phase*math.tau)
    image = Image.new('RGB',(W,H), PAPER if index != 2 else INK)
    draw = ImageDraw.Draw(image)
    if index == 1:
        text(draw,(49,74),'good')
        text(draw,(49,187),'things.')
        draw.line((52,447,906,447),fill=INK,width=1)
        text(draw,(52,470),'made beside.',face=SMALL,spacing=-.6)
        layer = Image.new('RGBA',(460,380))
        art = ImageDraw.Draw(layer)
        arch(art,28,58+wave*12,width=184,height=244)
        arch(art,228,58-wave*12,width=184,height=244)
        layer = layer.rotate(wave*4,resample=Image.Resampling.BICUBIC)
        image.paste(layer,(476,53),layer)
    elif index == 2:
        for i in range(5):
            x = 55+i*185 + wave*10
            draw.rounded_rectangle((x,62,x+144,478),radius=72,outline=GREEN,width=2)
        text(draw,(184,136),'side by',fill=PAPER)
        text(draw,(253,265),'side.',fill=PAPER)
        draw.rectangle((55,62+202*(1+wave),73,83+202*(1+wave)),fill=GREEN)
    else:
        panel=Image.new('RGBA',(460,460))
        art=ImageDraw.Draw(panel)
        art.rounded_rectangle((34,34,426,426),radius=196,fill=GREEN)
        art.rounded_rectangle((103,103,357,357),radius=127,fill=PAPER)
        art.rectangle((234,222,470,470),fill=PAPER)
        panel=panel.rotate(22+wave*18,resample=Image.Resampling.BICUBIC)
        image.paste(panel,(-50,46),panel)
        text(draw,(412,109),'A new',face=MEDIUM,spacing=-4)
        text(draw,(412,190),'point of',face=MEDIUM,spacing=-4)
        text(draw,(412,272),'view.',face=MEDIUM,spacing=-4)
        draw.line((414,418,904,418),fill=INK,width=1)
    return image

for index in range(1,4):
    frame(index,.125).save(DEST / f'project-{index:02}.jpg',quality=92)
    process=subprocess.Popen([str(FFMPEG),'-y','-loglevel','error','-f','rawvideo','-pix_fmt','rgb24','-s',f'{W}x{H}','-r',str(FPS),'-i','-','-an','-c:v','libx264','-preset','veryfast','-crf','21','-pix_fmt','yuv420p','-movflags','+faststart',str(DEST/f'project-{index:02}.mp4')],stdin=subprocess.PIPE)
    for tick in range(FPS*SECONDS):
        process.stdin.write(frame(index,tick/(FPS*SECONDS)).tobytes())
    process.stdin.close()
    if process.wait(): raise RuntimeError('Video encode failed')
    print(f'Project {index:02}: {FPS*SECONDS} frames, {SECONDS}s, {W}x{H}',flush=True)
