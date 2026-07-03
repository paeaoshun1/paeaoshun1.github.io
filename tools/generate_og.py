#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""OGシェア画像（1200×630）ジェネレータ — パパみかん

使い方:
  python3 tools/generate_og.py article-021          # 1記事だけ生成
  python3 tools/generate_og.py --all                # 記事100＋ピラー4＋トップ
出力: og/article-XXX.png / og/mikan.png / og/top.png など
新記事を追加したら `python3 tools/generate_og.py article-101` のように実行する。
"""
import glob
import hashlib
import os
import re
import subprocess
import sys
import tempfile

BASE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
OUT_DIR = os.path.join(BASE, "og")

# みかん一家（パパ・ママ・男の子・女の子）。記事IDのハッシュで安定的に割り当てる
CHARACTERS = ["papa-mikan.png", "mama-mikan.png", "chibi-mikan.png", "puchi-mikan.png"]


def pick_character(target_id):
    """記事IDから決定的に（=再生成しても同じ）キャラを選ぶ"""
    h = int(hashlib.md5(target_id.encode()).hexdigest(), 16)
    return CHARACTERS[h % len(CHARACTERS)]

TEMPLATE = """<!DOCTYPE html>
<html lang="ja">
<head>
<meta charset="UTF-8">
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  html, body { width: 1200px; height: 630px; overflow: hidden; }
  body {
    font-family: "Hiragino Sans", "Hiragino Kaku Gothic ProN", sans-serif;
    background: linear-gradient(135deg, #FFF7ED 0%, #FFEDD5 55%, #FED7AA 100%);
    position: relative;
  }
  /* 装飾の丸 */
  .deco1 { position: absolute; width: 480px; height: 480px; border-radius: 50%;
           background: rgba(224,112,0,0.07); top: -160px; right: -120px; }
  .deco2 { position: absolute; width: 300px; height: 300px; border-radius: 50%;
           background: rgba(224,112,0,0.06); bottom: -100px; left: -80px; }
  .frame { position: absolute; inset: 26px; border: 3px solid rgba(224,112,0,0.35);
           border-radius: 28px; }
  .content { position: absolute; inset: 0; padding: 78px 90px 70px; display: flex;
             flex-direction: column; }
  .badge { display: inline-block; align-self: flex-start; background: #E07000; color: #fff;
           font-size: 30px; font-weight: 700; padding: 10px 30px; border-radius: 999px;
           letter-spacing: 2px; }
  .title { flex: 1; display: flex; align-items: center; }
  .title h1 { color: #7C2D12; font-weight: 800; line-height: 1.42;
              width: 760px; word-break: break-word; }
  .footer { display: flex; align-items: center; gap: 18px; }
  .logo { font-size: 40px; }
  .site { color: #9A3412; font-size: 34px; font-weight: 800; letter-spacing: 1px; }
  .tagline { color: #C2410C; font-size: 24px; font-weight: 500; margin-left: 4px; }
  .chara-wrap { position: absolute; right: 70px; bottom: 64px; width: 226px; height: 226px;
                border-radius: 50%; background: #fff; border: 5px solid rgba(224,112,0,0.45);
                box-shadow: 0 10px 30px rgba(124,45,18,0.18);
                display: flex; align-items: center; justify-content: center; overflow: hidden; }
  .chara { height: 186px; width: auto; }
</style>
</head>
<body>
  <div class="deco1"></div>
  <div class="deco2"></div>
  <div class="frame"></div>
  <div class="content">
    <span class="badge">{BADGE}</span>
    <div class="title"><h1 id="t">{TITLE}</h1></div>
    <div class="footer">
      <span class="logo">🍊</span>
      <span class="site">パパみかん</span>
      <span class="tagline">毎日届く・みかん雑学</span>
    </div>
  </div>
  <div class="chara-wrap"><img class="chara" src="{CHARA}" alt=""></div>
  <script>
    // タイトル長に応じてフォントサイズを自動調整（最大3行に収める）
    const t = document.getElementById('t');
    const len = t.textContent.length;
    let size = 60;
    if (len > 26) size = 54;
    if (len > 34) size = 48;
    if (len > 44) size = 42;
    t.style.fontSize = size + 'px';
  </script>
</body>
</html>
"""


def esc(s):
    return s.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;")


def render(out_name, title, badge, chara_file):
    os.makedirs(OUT_DIR, exist_ok=True)
    chara = "file://" + os.path.join(BASE, chara_file).replace(" ", "%20")
    html = (TEMPLATE.replace("{TITLE}", esc(title))
                    .replace("{BADGE}", esc(badge))
                    .replace("{CHARA}", chara))
    with tempfile.NamedTemporaryFile("w", suffix=".html", delete=False,
                                     encoding="utf-8") as f:
        f.write(html)
        tmp = f.name
    png = os.path.join(OUT_DIR, out_name + ".png")
    subprocess.run([CHROME, "--headless=new", "--disable-gpu", "--hide-scrollbars",
                    "--force-device-scale-factor=1", "--window-size=1200,630",
                    f"--screenshot={png}", "file://" + tmp],
                   check=True, capture_output=True)
    os.unlink(tmp)
    # JPGに変換して容量を抑える（OG画像は透過不要）
    from PIL import Image
    out = os.path.join(OUT_DIR, out_name + ".jpg")
    Image.open(png).convert("RGB").save(out, "JPEG", quality=88, optimize=True)
    os.unlink(png)
    return out


def article_meta(aid):
    s = open(os.path.join(BASE, "articles", aid + ".html"), encoding="utf-8").read()
    title = re.search(r'<meta property="og:title" content="(.*?)">', s, re.S).group(1)
    m = re.search(r'<a href="\.\./(mikan|orange|vitamin|supplement)">([^<]*)</a>', s)
    badge = {"mikan": "みかん", "orange": "オレンジ",
             "vitamin": "ビタミン", "supplement": "サプリ"}.get(m.group(1), "豆知識") if m else "豆知識"
    return title, badge


PILLARS = {
    "mikan":      ("みかんの栄養・選び方・保存・品種 総まとめ", "カテゴリまとめ"),
    "orange":     ("オレンジの栄養・違い・品種・レシピ 総まとめ", "カテゴリまとめ"),
    "vitamin":    ("ビタミンCの効果・摂取量・食べ物 総まとめ", "カテゴリまとめ"),
    "supplement": ("サプリの選び方・飲み方・おすすめ 総まとめ", "カテゴリまとめ"),
}


def main():
    args = sys.argv[1:]
    if not args:
        print(__doc__)
        return
    targets = []
    if "--all" in args:
        for p in sorted(glob.glob(os.path.join(BASE, "articles", "article-*.html"))):
            targets.append(os.path.basename(p).replace(".html", ""))
        targets += list(PILLARS.keys()) + ["top"]
    else:
        targets = args
    for t in targets:
        if t == "top":
            # トップと各ピラーは「公式」感を出すためパパで固定
            out = render("top", "毎日届く・みかん雑学ブログ", "公式サイト", "papa-mikan.png")
        elif t in PILLARS:
            title, badge = PILLARS[t]
            out = render(t, title, badge, "papa-mikan.png")
        else:
            title, badge = article_meta(t)
            out = render(t, title, badge, pick_character(t))
        print("生成:", os.path.relpath(out, BASE))


if __name__ == "__main__":
    main()
