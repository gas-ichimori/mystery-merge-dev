#!/usr/bin/env python3
"""
Mystery Merge Puzzle - Chapter Creator
新章（キャラ・画像・脚本・コード）を自動生成するスクリプト
"""

import os
import sys
import json
import time
import requests
from pathlib import Path
from dotenv import load_dotenv

# .envファイルの読み込み（プロジェクトルートから）
BASE_DIR = Path(__file__).parent.parent
load_dotenv(BASE_DIR / '.env')

ANTHROPIC_API_KEY = os.getenv('ANTHROPIC_API_KEY')
OPENAI_API_KEY    = os.getenv('OPENAI_API_KEY')
REMOVEBG_API_KEY  = os.getenv('REMOVEBG_API_KEY')

# キャラクター共通スタイル（ヤスに合わせたテンプレート）
CHAR_STYLE = (
    "high quality Japanese visual novel character illustration, "
    "square composition (1:1 aspect ratio), wide upper-body shot, "
    "showing full figure from waist to top of head, "
    "wide shot zoomed out, large white margins on all four sides, "
    "head occupies only the upper-center portion of the image, "
    "detailed anime art style, soft gradient shading, "
    "detailed layered hair with natural highlights and shadow tones, "
    "smooth skin with soft shading, subtle thin outlines, "
    "expressive eyes with detailed iris and catch lights, "
    "PURE WHITE BACKGROUND #FFFFFF, no background elements, "
    "professional mobile game CG illustration, high resolution"
)


# ─────────────────────────────────────────────────────────────────
# ヘルパー関数
# ─────────────────────────────────────────────────────────────────

def ask(prompt):
    """ユーザーへの入力を求める"""
    print(f"\n{prompt}")
    return input("> ").strip()

def ask_choice(prompt, choices):
    """番号選択式の質問"""
    print(f"\n{prompt}")
    for i, c in enumerate(choices, 1):
        print(f"  {i}. {c}")
    while True:
        try:
            n = int(input("> ")) - 1
            if 0 <= n < len(choices):
                return choices[n]
        except ValueError:
            pass
        print("  番号を入力してください")

def claude_generate(system, user, max_tokens=6000):
    """Claude API でテキスト生成"""
    import anthropic
    client = anthropic.Anthropic(api_key=ANTHROPIC_API_KEY)
    msg = client.messages.create(
        model="claude-opus-4-5",
        max_tokens=max_tokens,
        system=system,
        messages=[{"role": "user", "content": user}]
    )
    return msg.content[0].text

def parse_json_from_text(text):
    """テキストからJSON配列を抽出してパース"""
    try:
        start = text.index('[')
        end   = text.rindex(']') + 1
        return json.loads(text[start:end])
    except Exception as e:
        print(f"  ⚠️ JSONパース失敗: {e}")
        return None

def generate_image(prompt, save_path, size="1024x1024"):
    """DALL-E 3 で画像生成して保存"""
    from openai import OpenAI
    client = OpenAI(api_key=OPENAI_API_KEY)
    print(f"  🎨 生成中: {save_path.name}")
    try:
        resp = client.images.generate(
            model="gpt-image-1",
            prompt=prompt,
            size=size,
            n=1
        )
        item = resp.data[0]
        if hasattr(item, 'b64_json') and item.b64_json:
            import base64
            img_bytes = base64.b64decode(item.b64_json)
        else:
            img_bytes = requests.get(item.url, timeout=30).content
        save_path.write_bytes(img_bytes)
        print(f"  ✅ 保存: {save_path.name}")
        time.sleep(2)  # APIレート制限対策
        return True
    except Exception as e:
        print(f"  ❌ 失敗: {e}")
        return False

def add_padding(image_path, top_ratio=0.15, other_ratio=0.06):
    """上部に多めの余白を追加して頭の見切れを防ぐ"""
    from PIL import Image
    img = Image.open(image_path).convert('RGBA')
    w, h = img.size
    pad_top   = int(h * top_ratio)
    pad_other = int(max(w, h) * other_ratio)
    new_w = w + pad_other * 2
    new_h = h + pad_top + pad_other
    new_img = Image.new('RGBA', (new_w, new_h), (255, 255, 255, 255))
    new_img.paste(img, (pad_other, pad_top))
    new_img.save(image_path)

def remove_background(image_path, subject_type='auto', use_api=False):
    """背景透過: remove.bg API(use_api=True の時のみ) → isnet-anime"""
    import io
    import numpy as np
    from PIL import Image
    print(f"  🔲 透過中: {image_path.name}")

    # remove.bg API（明示的に有効化した場合のみ使用）
    if use_api and REMOVEBG_API_KEY:
        try:
            resp = requests.post(
                'https://api.remove.bg/v1.0/removebg',
                headers={'X-Api-Key': REMOVEBG_API_KEY},
                files={'image_file': open(image_path, 'rb')},
                data={'size': 'auto'},
                timeout=60,
            )
            if resp.status_code == 200:
                img = Image.open(io.BytesIO(resp.content)).convert('RGBA')
                img.save(image_path)
                print(f"  ✅ 透過完了（remove.bg API）: {image_path.name}")
                return
            print(f"  ⚠️  remove.bg API 失敗({resp.status_code})、isnet-anime にフォールバック")
        except Exception as e:
            print(f"  ⚠️  remove.bg API エラー({e})、isnet-anime にフォールバック")

    # isnet-anime（アニメ特化モデル）
    try:
        from rembg import remove, new_session
        with open(image_path, 'rb') as f:
            input_data = f.read()
        session = new_session('isnet-anime')
        output_data = remove(input_data, session=session)
        img = Image.open(io.BytesIO(output_data)).convert('RGBA')
        arr = np.array(img)
        arr[:, :, 3] = np.where(arr[:, :, 3] < 128, 0, 255).astype(np.uint8)
        Image.fromarray(arr).save(image_path)
        print(f"  ✅ 透過完了（isnet-anime）: {image_path.name}")
    except Exception as e:
        print(f"  ❌ 透過失敗: {e}")

def autocrop_character(image_path, margin_ratio=0.04):
    """透過PNG をキャラクター範囲にトリミングし、ヤスと同じ 500×500px 正方形に正規化"""
    try:
        import numpy as np
        from PIL import Image
        img = Image.open(image_path).convert('RGBA')
        arr = np.array(img)
        alpha = arr[:, :, 3]
        rows = np.any(alpha > 10, axis=1)
        cols = np.any(alpha > 10, axis=0)
        if not rows.any():
            return
        rmin, rmax = np.where(rows)[0][[0, -1]]
        cmin, cmax = np.where(cols)[0][[0, -1]]
        h, w = arr.shape[:2]
        my = int(h * margin_ratio)
        mx = int(w * margin_ratio)
        rmin = max(0, rmin - my)
        rmax = min(h - 1, rmax + my)
        cmin = max(0, cmin - mx)
        cmax = min(w - 1, cmax + mx)
        cropped = img.crop((cmin, rmin, cmax + 1, rmax + 1))
        cw, ch = cropped.size

        # 横幅をヤスと同じ ~450px 相当にスケールして 500×500 に収める
        target = 500
        fill_w = int(target * 0.90)  # 450px（ヤスは470px）
        scale = fill_w / cw
        new_w = int(cw * scale)
        new_h = int(ch * scale)
        scaled = cropped.resize((new_w, new_h), Image.LANCZOS)
        canvas = Image.new('RGBA', (target, target), (0, 0, 0, 0))
        ox = (target - new_w) // 2
        oy = max(0, target - new_h)  # 下揃え（はみ出す場合は上端0）
        canvas.paste(scaled, (ox, oy), scaled)
        canvas.save(image_path)
        print(f"  ✅ 正規化完了: 500×500px ({image_path.name})")
    except Exception as e:
        print(f"  ⚠️ トリミングスキップ: {e}")

def section(title):
    print(f"\n{'─'*50}")
    print(f"  {title}")
    print('─'*50)


# ─────────────────────────────────────────────────────────────────
# メイン処理
# ─────────────────────────────────────────────────────────────────

def main():
    print("\n" + "="*50)
    print("  Mystery Merge Puzzle - Chapter Creator")
    print("="*50)

    # ── 基本情報 ──
    chapter_num = int(ask("作成する章番号を入力してください（例: 7）"))
    char_start  = int(ask(f"キャラ画像の開始番号を入力してください（例: 第7章なら 39）"))
    start_phase = int(ask(
        "開始フェーズを選択してください\n"
        "  1: テーマ・キャラ設計から（最初から）\n"
        "  2: キャラ画像生成から\n"
        "  3: ジェネレーター画像生成から\n"
        "  4: マージアイテム画像生成から\n"
        "  5: 脚本生成から\n"
        "  6: 背景画像生成から\n"
        "  7: ゲームコード生成から"
    ))

    # フォルダ作成
    chapter_dir = BASE_DIR / f'img/Chapter{chapter_num}'
    chara_dir   = chapter_dir / 'chara'
    icon_dir    = chapter_dir / 'icon'
    bg_dir      = chapter_dir / 'bg'
    output_dir  = BASE_DIR / 'tools' / 'output'
    for d in [chara_dir, icon_dir, bg_dir, output_dir]:
        d.mkdir(parents=True, exist_ok=True)
    print(f"\n✅ フォルダ作成完了: img/Chapter{chapter_num}/")

    # ── キャッシュ読み込み ──
    cache_file = output_dir / f'chapter{chapter_num}_cache.json'
    cache = {}
    if cache_file.exists() and start_phase > 1:
        cache = json.loads(cache_file.read_text(encoding='utf-8'))
        print(f"✅ キャッシュ読み込み: {cache_file.name}")

    def save_cache():
        cache_file.write_text(json.dumps(cache, ensure_ascii=False, indent=2), encoding='utf-8')

    # ══════════════════════════════════════════════════════════════
    # フェーズ1: テーマ・キャラクター設計
    # ══════════════════════════════════════════════════════════════
    if start_phase <= 1:
        section(f"フェーズ1: 第{chapter_num}章 テーマ設計")
        themes_text = claude_generate(
            "あなたは日本のモバイルミステリーゲームの脚本家です。",
            f"第{chapter_num}章のテーマ候補を4つ提案してください。\n"
            "各テーマは「タイトル（一言）: 概要の一文」の形式で。\n"
            "ジャンルは推理・謎解き。社会問題・事件・犯罪・人間関係を絡めてください。"
        )
        print("\n【テーマ候補】\n" + themes_text)
        chosen_theme = ask(f"採用するテーマを入力してください（コピー可）:")

        section("フェーズ1: キャラクター設計")
        chars_text = claude_generate(
            "あなたは日本のモバイルミステリーゲームの脚本家です。",
            f"第{chapter_num}章テーマ「{chosen_theme}」の登場人物を5〜6名設計してください。\n"
            "1人目は必ず依頼人にしてください。\n"
            "各キャラの情報: 名前/年齢/職業・役割/外見（髪色・スタイル・服装）/性格\n"
            "主人公ヤス（私立探偵・男性）は含めないでください。"
        )
        print("\n【登場人物案】\n" + chars_text)
        input("\n確認できたらEnterを押してください...")
        cache['chosen_theme'] = chosen_theme
        cache['chars_text']   = chars_text
        save_cache()
    else:
        chosen_theme = cache.get('chosen_theme') or ask("テーマを入力してください:")
        chars_text   = cache.get('chars_text')   or ask("キャラ情報を入力してください:")
        print(f"\n📋 テーマ: {chosen_theme}")

    # ══════════════════════════════════════════════════════════════
    # フェーズ2: キャラクター画像生成
    # ══════════════════════════════════════════════════════════════
    if start_phase <= 2:
        section("フェーズ2: キャラクター画像生成")
        char_prompts_text = claude_generate(
            "あなたは画像生成AIのプロンプト作成の専門家です。",
            f"以下の登場人物それぞれのDALL-E 3用プロンプトをJSON配列で出力してください。\n"
            f"共通スタイル（必ず先頭に付ける）:\n「{CHAR_STYLE}」\n\n"
            f"登場人物:\n{chars_text}\n\n"
            f"出力形式（純粋なJSON配列のみ、説明文不要）:\n"
            f'[{{"name":"名前","prompt":"共通スタイル, 性別と年齢, 髪の色・スタイル, 表情, 服装"}}]'
        )
        char_prompts = parse_json_from_text(char_prompts_text)
        if not char_prompts:
            print("キャラプロンプトの取得に失敗しました。終了します。")
            sys.exit(1)

        char_file_names = []
        for i, cp in enumerate(char_prompts):
            idx      = char_start + i
            filename = chara_dir / f'image_merge_order_chara_{idx:02d}.png'
            char_file_names.append(filename.name)
            print(f"\n【キャラ{i+1}: {cp['name']}】")
            if filename.exists() and filename.stat().st_size > 10000:
                print(f"  ⏭️ スキップ（既存ファイルあり）: {filename.name}")
                continue
            if generate_image(cp['prompt'], filename, size="1024x1024"):
                # 白背景のまま 500×500 にリサイズ（透過処理はスキップ）
                from PIL import Image as _Img
                _Img.open(filename).convert('RGB').resize((500, 500), _Img.LANCZOS).save(filename)
        cache['char_file_names'] = char_file_names
        save_cache()
    else:
        char_file_names = cache.get('char_file_names', [
            f'image_merge_order_chara_{char_start + i:02d}.png' for i in range(6)
        ])
        print(f"📋 キャラファイル: {char_file_names}")

    # ══════════════════════════════════════════════════════════════
    # フェーズ3: ジェネレーター画像生成（Lv1〜7）
    # ══════════════════════════════════════════════════════════════
    if start_phase <= 3:
        section("フェーズ3: ジェネレーター画像生成（Lv1〜7）")
        gen_prompts_text = claude_generate(
            "あなたは日本のモバイルゲームのアセットデザイナーです。",
            f"テーマ「{chosen_theme}」に合うジェネレーター（道具・機器）Lv1〜7を設計してください。\n"
            f"Lv1は最もシンプルな道具、Lv7は最も高機能・印象的な機器にしてください。\n"
            f"各LvのDALL-E 3プロンプト（英語）をJSON配列で出力してください（説明文不要）:\n"
            f'[{{"lv":1,"name":"名前（日本語）","prompt":"英語プロンプト"}}]\n'
            f"プロンプトの条件: pure white background #FFFFFF, detailed Japanese mobile game item illustration, "
            f"soft cel-shaded style with clean outlines, rich colors with shading and highlights, "
            f"slightly isometric or front-facing view, game card art style, no text, no person, "
            f"entire object fully visible with generous padding on all sides, "
            f"object occupies no more than 75% of the image area, NEVER crop any part of the object, "
            f"NO flames, NO fire, NO smoke, NO dark background, NO atmospheric effects, NO glowing aura"
        )
        gen_prompts = parse_json_from_text(gen_prompts_text)
        if gen_prompts:
            for gp in gen_prompts:
                lv       = gp.get('lv', 0)
                filename = icon_dir / f'image_merge_gene{chapter_num}_{lv:02d}.png'
                print(f"\n【ジェネレーター Lv{lv}: {gp.get('name','')}】")
                if generate_image(gp['prompt'], filename):
                    add_padding(filename, top_ratio=0.18, other_ratio=0.15)
                    remove_background(filename, 'product', use_api=False)

    # ══════════════════════════════════════════════════════════════
    # フェーズ4: マージアイテム画像生成（Lv1〜12）
    # ══════════════════════════════════════════════════════════════
    if start_phase <= 4:
        section("フェーズ4: マージアイテム画像生成（Lv1〜12）")
        item_prompts_text = claude_generate(
            "あなたは日本のモバイルゲームのアセットデザイナーです。",
            f"テーマ「{chosen_theme}」に合うマージアイテムLv1〜12を設計してください。\n"
            f"Lv1は最もシンプル、Lv12は最も価値が高く印象的なアイテムにしてください。\n"
            f"各LvのDALL-E 3プロンプト（英語）をJSON配列で出力してください（説明文不要）:\n"
            f'[{{"lv":1,"name":"名前（日本語）","prompt":"英語プロンプト"}}]\n'
            f"プロンプトの条件: pure white background #FFFFFF, detailed Japanese mobile game item illustration, "
            f"soft cel-shaded style with clean outlines, rich colors with shading and highlights, "
            f"slightly isometric or front-facing view, game card art style, no text, no person, "
            f"entire object fully visible with generous padding on all sides, "
            f"object occupies no more than 75% of the image area, NEVER crop any part of the object, "
            f"NO flames, NO fire, NO smoke, NO dark background, NO atmospheric effects, NO glowing aura"
        )
        item_prompts = parse_json_from_text(item_prompts_text)
        if item_prompts:
            for ip in item_prompts:
                lv       = ip.get('lv', 0)
                filename = icon_dir / f'image_merge_icon{chapter_num}_{lv:02d}.png'
                print(f"\n【アイテム Lv{lv}: {ip.get('name','')}】")
                if generate_image(ip['prompt'], filename):
                    add_padding(filename, top_ratio=0.18, other_ratio=0.15)
                    remove_background(filename, 'product', use_api=False)

    # ══════════════════════════════════════════════════════════════
    # フェーズ5: 脚本生成（25話）
    # ══════════════════════════════════════════════════════════════
    if start_phase <= 5:
        section("フェーズ5: 脚本生成（25話）")
        script_text = claude_generate(
            "あなたは日本のモバイルミステリーゲーム「Mystery Merge Puzzle」の脚本家です。",
            f"第{chapter_num}章「{chosen_theme}」の脚本を25話構成で作成してください。\n\n"
            f"登場人物:\n{chars_text}\n\n"
            f"ルール:\n"
            f"- 主人公はヤス（私立探偵・男性）\n"
            f"- scene_idは c{chapter_num}s01〜c{chapter_num}s25\n"
            f"- 各シーンは「scene_id / タイトル / 右キャラ名 / 会話（3〜6ターン）」\n"
            f"- c{chapter_num}s24は解決・完結\n"
            f"- c{chapter_num}s25は後日談\n"
            f"- ヤスの台詞は「ヤス:」、相手は「キャラ名:」で表記",
            max_tokens=8000
        )
        script_path = output_dir / f'chapter{chapter_num}_script.txt'
        script_path.write_text(script_text, encoding='utf-8')
        print(f"\n✅ 脚本を保存: tools/output/chapter{chapter_num}_script.txt")
        cache['script_text'] = script_text
        save_cache()
    else:
        script_path = output_dir / f'chapter{chapter_num}_script.txt'
        script_text = cache.get('script_text') or (
            script_path.read_text(encoding='utf-8') if script_path.exists() else ''
        )
        print(f"📋 脚本をキャッシュから読み込みました")

    # ══════════════════════════════════════════════════════════════
    # フェーズ6: 背景画像生成
    # ══════════════════════════════════════════════════════════════
    if start_phase <= 6:
        section("フェーズ6: 背景画像生成")
        bg_prompts_text = claude_generate(
            "あなたは日本のビジュアルノベルゲームの背景アーティストです。",
            f"テーマ「{chosen_theme}」の脚本に必要な背景画像を2〜3枚提案してください。\n"
            f"脚本概要:\n{script_text[:1500]}\n\n"
            f"JSON配列で出力（説明文不要）:\n"
            f'[{{"name":"場所名（英語スネーク）","filename":"image_merge_bg_xxx.png","prompt":"英語プロンプト"}}]\n'
            f"プロンプトの条件: wide horizontal background, Japanese visual novel style, "
            f"no characters, atmospheric, photorealistic"
        )
        bg_prompts = parse_json_from_text(bg_prompts_text)
        if bg_prompts:
            for bp in bg_prompts:
                filename = bg_dir / bp.get('filename', f"image_merge_bg_{bp['name']}.png")
                print(f"\n【背景: {bp.get('name','')}】")
                generate_image(bp['prompt'], filename, size="1536x1024")
            cache['bg_prompts'] = bg_prompts
            save_cache()
    else:
        bg_prompts = cache.get('bg_prompts', [])
        print(f"📋 背景プロンプトをキャッシュから読み込みました")

    # ══════════════════════════════════════════════════════════════
    # フェーズ7: ゲームコード生成
    # ══════════════════════════════════════════════════════════════
    if start_phase <= 7:
        section("フェーズ7: ゲームコード生成（ADV_SCENES・相関図）")
        bg_filenames = [bp.get('filename','') for bp in (bg_prompts or [])]
        char_name_map = '\n'.join(
            f"  chara_{char_start+i:02d}.png → {line.split('**')[1] if '**' in line else f'キャラ{i+1}'}"
            for i, line in enumerate(
                [l for l in chars_text.split('\n') if l.strip().startswith('**') and '（' in l]
            )
        )
        code_text = claude_generate(
            "あなたはvanilla JavaScriptのゲーム開発者です。コードのみを出力してください。説明文は一切不要です。",
            f"以下の情報をもとにgame.jsへ追加するコードを生成してください。\n\n"
            f"【第{chapter_num}章「{chosen_theme}」】\n"
            f"登場人物とキャラ画像の対応:\n{char_name_map}\n\n"
            f"脚本（全文）:\n{script_text}\n\n"
            f"背景ファイル（img/Chapter{chapter_num}/bg/）: {bg_filenames}\n\n"
            f"【出力形式】既存のCH6と完全に同じ形式で以下を出力:\n\n"
            f"1. const CH{chapter_num}_SCENE_IDS = ['c{chapter_num}s01',...,'c{chapter_num}s25'];\n\n"
            f"2. const CH{chapter_num}_SCENE_LIST = [{{id:'c{chapter_num}s01',title:'タイトル'}},...]\n\n"
            f"3. ADV_SCENESオブジェクトの各エントリ（c{chapter_num}s01〜c{chapter_num}s25）:\n"
            f"各シーンの形式:\n"
            f"  c{chapter_num}s01: {{\n"
            f"    title: 'シーンタイトル',\n"
            f"    leftImg: 'img/Chapter1/Chara/image_merge_order_chara_00.png',\n"
            f"    rightImg: 'img/Chapter{chapter_num}/chara/image_merge_order_chara_XX.png',\n"
            f"    bg: 'img/Chapter{chapter_num}/bg/image_merge_bg_XXX.png',\n"
            f"    leftEntrance: 'fade', flipLeft: true,\n"
            f"    rightEntrance: 'slide', autoClose: false,\n"
            f"    script: [\n"
            f"      {{ speaker: 'キャラ名', text: '台詞', side: 'right' }},\n"
            f"      {{ speaker: 'ヤス', text: '台詞', side: 'left' }},\n"
            f"    ],\n"
            f"  }},\n\n"
            f"4. const CH{chapter_num}_KANKEI_NODES / BADGES / EDGES（既存CH6と同じ形式）\n",
            max_tokens=16000
        )
        code_path = output_dir / f'chapter{chapter_num}_code.js'
        code_path.write_text(code_text, encoding='utf-8')
        print(f"\n✅ コードを保存: tools/output/chapter{chapter_num}_code.js")

    # ══════════════════════════════════════════════════════════════
    # 完了
    # ══════════════════════════════════════════════════════════════
    print("\n" + "="*50)
    print(f"  ✅ 第{chapter_num}章の自動生成が完了しました！")
    print("="*50)
    print(f"""
生成されたファイル:
  📁 img/Chapter{chapter_num}/chara/  ← キャラ画像（透過済み）
  📁 img/Chapter{chapter_num}/icon/   ← ジェネレーター・アイテム画像（透過済み）
  📁 img/Chapter{chapter_num}/bg/     ← 背景画像
  📄 tools/output/chapter{chapter_num}_script.txt  ← 脚本
  📄 tools/output/chapter{chapter_num}_code.js     ← game.js追加コード
  📄 tools/output/chapter{chapter_num}_cache.json  ← キャッシュ（再実行時に活用）

次のステップ:
  1. 画像を確認・必要なら再実行（開始フェーズを指定して部分再生成可）
  2. 脚本を確認・修正
  3. chapter{chapter_num}_code.js の内容を game.js に統合
  4. index.html に story/debug ブロックを追加
  5. git push
""")


if __name__ == '__main__':
    main()
