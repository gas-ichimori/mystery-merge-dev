#!/usr/bin/env python3
"""白石ユウト（chara_48）の画像を再生成するスクリプト"""

import os
import base64
import requests
from pathlib import Path
from dotenv import load_dotenv

BASE_DIR = Path(__file__).parent.parent
load_dotenv(BASE_DIR / '.env')

OPENAI_API_KEY = os.getenv('OPENAI_API_KEY')

TARGET = BASE_DIR / 'img/Chapter8/chara/image_merge_order_chara_48.png'

CHAR_STYLE = (
    "high quality Japanese visual novel character illustration, "
    "square composition (1:1 aspect ratio), bust shot showing chest, shoulders and upper torso to top of head, "
    "body slightly turned in three-quarter view, face looking toward camera, eye-level camera angle, "
    "chest and collarbone prominently visible, upper torso takes up lower half of image, no hands visible, "
    "character placed in lower half of the canvas, large white empty space above the head, head fully visible, "
    "detailed anime art style, soft gradient shading, "
    "detailed layered hair with natural highlights and shadow tones, "
    "smooth skin with soft shading, subtle thin outlines, "
    "expressive eyes with detailed iris and catch lights, "
    "PURE WHITE BACKGROUND #FFFFFF, no background elements, "
    "professional mobile game CG illustration, high resolution"
)

CHAR_PROMPT = (
    f"{CHAR_STYLE}, "
    "young Japanese man, 21 years old, blonde hair with dark highlights, slim thin build, "
    "gentle-looking but slightly obsessive expression, casual streetwear outfit, "
    "college student appearance, fan merchandise badge on bag strap visible, "
    "outwardly calm but internally intense personality"
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


def fit_character_to_canvas(scale=0.98, top_margin=12):
    from PIL import Image
    TARGET_SIZE = 500
    img = Image.open(TARGET).convert('RGB')
    char_w = int(TARGET_SIZE * scale)
    char_h = int(img.height * char_w / img.width)
    resized = img.resize((char_w, char_h), Image.LANCZOS)
    canvas = Image.new('RGB', (TARGET_SIZE, TARGET_SIZE), (255, 255, 255))
    x = (TARGET_SIZE - char_w) // 2
    canvas.paste(resized, (x, top_margin))
    canvas.save(TARGET)
    print(f"✅ 500×500px 保存（キャラ {int(scale*100)}% ・上余白{top_margin}px・白背景）")


if __name__ == '__main__':
    print("=" * 50)
    print("  白石ユウト（chara_48）再生成")
    print("=" * 50)
    TARGET.parent.mkdir(parents=True, exist_ok=True)
    generate_image()
    fit_character_to_canvas(scale=0.98, top_margin=12)
    print("\n完了:", TARGET)
