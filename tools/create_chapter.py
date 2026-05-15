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
    "Japanese social game character illustration, bust portrait, "
    "clean flat cel-shaded anime style, uniform thin black outlines, "
    "simple shadow areas (not gradient), white background, no background elements, "
    "visual novel game art style"
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
            model="dall-e-3",
            prompt=prompt,
            size=size,
            quality="standard",
            n=1
        )
        img_bytes = requests.get(resp.data[0].url, timeout=30).content
        save_path.write_bytes(img_bytes)
        print(f"  ✅ 保存: {save_path.name}")
        time.sleep(2)  # APIレート制限対策
        return True
    except Exception as e:
        print(f"  ❌ 失敗: {e}")
        return False

def remove_background(image_path):
    """remove.bg で背景透過（元ファイルに上書き）"""
    print(f"  🔲 透過中: {image_path.name}")
    with open(image_path, 'rb') as f:
        resp = requests.post(
            'https://api.remove.bg/v1.0/removebg',
            files={'image_file': f},
            data={'size': 'auto'},
            headers={'X-Api-Key': REMOVEBG_API_KEY},
            timeout=30
        )
    if resp.status_code == 200:
        image_path.write_bytes(resp.content)
        print(f"  ✅ 透過完了: {image_path.name}")
        time.sleep(1)
    else:
        print(f"  ❌ エラー {resp.status_code}: {resp.text[:120]}")

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

    # フォルダ作成
    chapter_dir = BASE_DIR / f'img/Chapter{chapter_num}'
    chara_dir   = chapter_dir / 'chara'
    icon_dir    = chapter_dir / 'icon'
    bg_dir      = chapter_dir / 'bg'
    output_dir  = BASE_DIR / 'tools' / 'output'
    for d in [chara_dir, icon_dir, bg_dir, output_dir]:
        d.mkdir(parents=True, exist_ok=True)
    print(f"\n✅ フォルダ作成完了: img/Chapter{chapter_num}/")

    # ══════════════════════════════════════════════════════════════
    # フェーズ1: テーマ・キャラクター設計
    # ══════════════════════════════════════════════════════════════
    section(f"フェーズ1: 第{chapter_num}章 テーマ設計")

    themes_text = claude_generate(
        "あなたは日本のモバイルミステリーゲームの脚本家です。",
        f"第{chapter_num}章のテーマ候補を4つ提案してください。\n"
        "各テーマは「タイトル（一言）: 概要の一文」の形式で。\n"
        "ジャンルは推理・謎解き。社会問題・事件・犯罪・人間関係を絡めてください。"
    )
    print("\n【テーマ候補】\n" + themes_text)
    chosen_theme = ask(f"採用するテーマを入力してください（コピー可）:")

    # ── キャラクター設計 ──
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

    # ══════════════════════════════════════════════════════════════
    # フェーズ2: キャラクター画像生成
    # ══════════════════════════════════════════════════════════════
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
        if generate_image(cp['prompt'], filename):
            remove_background(filename)

    # ══════════════════════════════════════════════════════════════
    # フェーズ3: ジェネレーター画像生成（Lv1〜7）
    # ══════════════════════════════════════════════════════════════
    section("フェーズ3: ジェネレーター画像生成（Lv1〜7）")

    gen_prompts_text = claude_generate(
        "あなたは日本のモバイルゲームのアセットデザイナーです。",
        f"テーマ「{chosen_theme}」に合うジェネレーター（道具・機器）Lv1〜7を設計してください。\n"
        f"Lv1は最もシンプルな道具、Lv7は最も高機能・印象的な機器にしてください。\n"
        f"各LvのDALL-E 3プロンプト（英語）をJSON配列で出力してください（説明文不要）:\n"
        f'[{{"lv":1,"name":"名前（日本語）","prompt":"英語プロンプト"}}]\n'
        f"プロンプトの条件: white background, icon style, front view, flat illustration, no text"
    )
    gen_prompts = parse_json_from_text(gen_prompts_text)
    if gen_prompts:
        for gp in gen_prompts:
            lv       = gp.get('lv', 0)
            filename = icon_dir / f'image_merge_gene{chapter_num}_{lv:02d}.png'
            print(f"\n【ジェネレーター Lv{lv}: {gp.get('name','')}】")
            if generate_image(gp['prompt'], filename):
                remove_background(filename)

    # ══════════════════════════════════════════════════════════════
    # フェーズ4: マージアイテム画像生成（Lv1〜12）
    # ══════════════════════════════════════════════════════════════
    section("フェーズ4: マージアイテム画像生成（Lv1〜12）")

    item_prompts_text = claude_generate(
        "あなたは日本のモバイルゲームのアセットデザイナーです。",
        f"テーマ「{chosen_theme}」に合うマージアイテムLv1〜12を設計してください。\n"
        f"Lv1は最もシンプル、Lv12は最も価値が高く印象的なアイテムにしてください。\n"
        f"各LvのDALL-E 3プロンプト（英語）をJSON配列で出力してください（説明文不要）:\n"
        f'[{{"lv":1,"name":"名前（日本語）","prompt":"英語プロンプト"}}]\n'
        f"プロンプトの条件: white background, icon style, 3D perspective, detailed, no text"
    )
    item_prompts = parse_json_from_text(item_prompts_text)
    if item_prompts:
        for ip in item_prompts:
            lv       = ip.get('lv', 0)
            filename = icon_dir / f'image_merge_icon{chapter_num}_{lv:02d}.png'
            print(f"\n【アイテム Lv{lv}: {ip.get('name','')}】")
            if generate_image(ip['prompt'], filename):
                remove_background(filename)

    # ══════════════════════════════════════════════════════════════
    # フェーズ5: 脚本生成（25話）
    # ══════════════════════════════════════════════════════════════
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

    # ══════════════════════════════════════════════════════════════
    # フェーズ6: 背景画像生成
    # ══════════════════════════════════════════════════════════════
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
            generate_image(bp['prompt'], filename, size="1792x1024")  # 背景は横長

    # ══════════════════════════════════════════════════════════════
    # フェーズ7: ゲームコード生成
    # ══════════════════════════════════════════════════════════════
    section("フェーズ7: ゲームコード生成（ADV_SCENES・相関図）")

    bg_filenames = [bp.get('filename','') for bp in (bg_prompts or [])]

    code_text = claude_generate(
        "あなたはvanilla JavaScriptのゲーム開発者です。コードのみを出力してください。",
        f"以下の情報をもとにgame.jsへ追加するコードを生成してください。\n\n"
        f"第{chapter_num}章「{chosen_theme}」\n"
        f"登場人物:\n{chars_text}\n\n"
        f"脚本（抜粋）:\n{script_text[:3000]}\n\n"
        f"キャラ画像ファイル（img/Chapter{chapter_num}/chara/）: {char_file_names}\n"
        f"背景ファイル（img/Chapter{chapter_num}/bg/）: {bg_filenames}\n"
        f"章番号: {chapter_num}, シーン数: 25\n\n"
        f"生成するコード（この順番で）:\n"
        f"1. const CH{chapter_num}_SCENE_IDS = [...]\n"
        f"2. const CH{chapter_num}_SCENE_LIST = [...]\n"
        f"3. ADV_SCENES に追加する c{chapter_num}s01〜c{chapter_num}s25 のエントリ\n"
        f"4. const CH{chapter_num}_KANKEI_NODES / BADGES / EDGES\n\n"
        f"既存のCH5/CH6のコードと同じ形式にしてください。",
        max_tokens=8000
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

次のステップ:
  1. 画像を確認・必要なら差し替え
  2. 脚本を確認・修正
  3. chapter{chapter_num}_code.js の内容を game.js に統合
  4. index.html に story/debug ブロックを追加
  5. git push
""")


if __name__ == '__main__':
    main()
