#!/usr/bin/env python3
"""橘美羽（chara_45）の画像を再生成するスクリプト"""

import os
import sys
import time
import base64
import requests
from pathlib import Path
from dotenv import load_dotenv

BASE_DIR = Path(__file__).parent.parent
load_dotenv(BASE_DIR / '.env')

OPENAI_API_KEY   = os.getenv('OPENAI_API_KEY')
REMOVEBG_API_KEY = os.getenv('REMOVEBG_API_KEY')

TARGET = BASE_DIR / 'img/Chapter8/chara/image_merge_order_chara_45.png'

CHAR_STYLE = (
    "high quality Japanese visual novel character illustration, "
    "square composition (1:1 aspect ratio), upper body shot from stomach to top of head, "
    "full torso visible including arms and waist area, full head and hair completely visible, "
    "detailed anime art style, soft gradient shading, "
    "detailed layered hair with natural highlights and shadow tones, "
    "smooth skin with soft shading, subtle thin outlines, "
    "expressive eyes with detailed iris and catch lights, "
    "PURE WHITE BACKGROUND #FFFFFF, no background elements, "
    "professional mobile game CG illustration, high resolution"
)

CHAR_PROMPT = (
    f"{CHAR_STYLE}, "
    "young Japanese woman, 19 years old, short brown bob hair, brown eyes, "
    "worried and anxious expression, slightly open mouth as if about to speak, "
    "casual beige hoodie, clean face with no dirt or marks, "
    "wholesome concerned younger sister character"
)


def generate_image():
    from openai import OpenAI
    client = OpenAI(api_key=OPENAI_API_KEY)
    print("🎨 gpt-image-1 で画像生成中...")
    resp = client.images.generate(
        model="gpt-image-1",
        prompt=CHAR_PROMPT,
        size="1024x1024",
        quality="high",
        n=1
    )
    item = resp.data[0]
    if hasattr(item, 'b64_json') and item.b64_json:
        img_bytes = base64.b64decode(item.b64_json)
    else:
        img_bytes = requests.get(item.url, timeout=30).content
    TARGET.write_bytes(img_bytes)
    print(f"✅ 保存: {TARGET.name}")


def add_padding():
    from PIL import Image
    img = Image.open(TARGET).convert('RGBA')
    w, h = img.size
    pad_top   = int(h * 0.15)
    pad_other = int(max(w, h) * 0.06)
    new_w = w + pad_other * 2
    new_h = h + pad_top + pad_other
    new_img = Image.new('RGBA', (new_w, new_h), (255, 255, 255, 255))
    new_img.paste(img, (pad_other, pad_top))
    new_img.save(TARGET)
    print("✅ パディング追加")


def remove_background():
    from PIL import Image
    import io, numpy as np

    # remove.bg API（クレジットがある場合は最高品質）
    if REMOVEBG_API_KEY:
        print("🔲 remove.bg API で背景透過中...")
        resp = requests.post(
            'https://api.remove.bg/v1.0/removebg',
            headers={'X-Api-Key': REMOVEBG_API_KEY},
            files={'image_file': open(TARGET, 'rb')},
            data={'size': 'auto'},
            timeout=60,
        )
        if resp.status_code == 200:
            img = Image.open(io.BytesIO(resp.content)).convert('RGBA')
            img.save(TARGET)
            print("✅ 背景透過完了（remove.bg API）")
            return
        print(f"⚠️  remove.bg API 失敗({resp.status_code})、isnet-anime にフォールバック")

    # isnet-anime（アニメ特化モデル）
    print("🔲 isnet-anime で背景透過中...")
    from rembg import remove, new_session
    session = new_session('isnet-anime')
    with open(TARGET, 'rb') as f:
        input_data = f.read()
    output_data = remove(input_data, session=session)
    img = Image.open(io.BytesIO(output_data)).convert('RGBA')
    arr = np.array(img)
    arr[:, :, 3] = np.where(arr[:, :, 3] < 128, 0, 255).astype(np.uint8)
    Image.fromarray(arr).save(TARGET)
    print("✅ 背景透過完了（isnet-anime）")


def autocrop():
    try:
        import numpy as np
        from PIL import Image
        img = Image.open(TARGET).convert('RGBA')
        arr = np.array(img)
        alpha = arr[:, :, 3]
        rows = np.any(alpha > 10, axis=1)
        cols = np.any(alpha > 10, axis=0)
        if not rows.any():
            return
        h, w = arr.shape[:2]
        margin = 0.04
        rmin, rmax = np.where(rows)[0][[0, -1]]
        cmin, cmax = np.where(cols)[0][[0, -1]]
        my, mx = int(h * margin), int(w * margin)
        cropped = img.crop((max(0, cmin - mx), max(0, rmin - my),
                            min(w, cmax + mx + 1), min(h, rmax + my + 1)))
        cw, ch = cropped.size
        target = 500
        scale = int(target * 0.90) / cw
        new_w, new_h = int(cw * scale), int(ch * scale)
        scaled = cropped.resize((new_w, new_h), Image.LANCZOS)
        canvas = Image.new('RGBA', (target, target), (0, 0, 0, 0))
        ox = (target - new_w) // 2
        oy = max(0, target - new_h)
        canvas.paste(scaled, (ox, oy), scaled)
        canvas.save(TARGET)
        print(f"✅ 正規化完了: 500×500px")
    except Exception as e:
        print(f"⚠️  トリミングスキップ: {e}")


def fit_character_to_canvas(scale=0.68):
    """キャラを縮小してキャンバス中央下寄りに配置 → 500×500 白背景で保存"""
    from PIL import Image
    TARGET_SIZE = 500
    img = Image.open(TARGET).convert('RGB')
    char_w = int(TARGET_SIZE * scale)
    char_h = int(img.height * char_w / img.width)
    resized = img.resize((char_w, char_h), Image.LANCZOS)
    canvas = Image.new('RGB', (TARGET_SIZE, TARGET_SIZE), (255, 255, 255))
    x = (TARGET_SIZE - char_w) // 2
    # 下寄せ（底面をキャンバス下端に合わせる）
    y = TARGET_SIZE - char_h
    canvas.paste(resized, (x, max(0, y)))
    canvas.save(TARGET)
    print(f"✅ 500×500px 保存（キャラ {int(scale*100)}% 縮小・白背景）")


if __name__ == '__main__':
    print("=" * 50)
    print("  橘美羽（chara_45）再生成")
    print("=" * 50)
    generate_image()
    fit_character_to_canvas(scale=0.95)
    print("\n完了:", TARGET)
