/*
 * redesign_r9_budget_policy.js
 * 令和9年度予算編成「各局圧縮額への対応方針」説明スライド(16:9・1枚)を生成する。
 * 実行方法: node redesign_r9_budget_policy.js
 * 出力: redesign_r9_budget_policy.pptx
 */
const pptxgen = require("pptxgenjs");

// ---------------------------------------------------------------- 基本設定
const FONT = "BIZ UDPゴシック"; // 未導入環境では Noto Sans JP / Yu Gothic / Meiryo に置換される想定

const C = {
  navy: "17375E", // ダークネイビー(主色)
  midnight: "12304A", // ミッドナイトブルー
  blueGray: "526174", // ブルーグレー(補足テキスト)
  lightBlue: "EAF2F8", // ライトブルー(方針ボックス)
  lightGray: "F4F6F8", // ライトグレー(施策ブロック)
  gold: "C9912B", // 強調用ゴールド(圧縮対象経費のみ)
  goldTint: "FBF4E4", // ゴールドの薄い背景
  text: "26364A", // 本文色
  white: "FFFFFF",
  line: "D4DCE4", // 細罫線
};

// 予算区分データ(千円) ※原資料記載値のまま使用する
const BUDGET_SEGMENTS = [
  { name: "固定", value: 30310895, color: "17375E" },
  { name: "人件費", value: 21407066, color: "2E5F8A" },
  { name: "法定・債務負担", value: 605482, color: "4E7FA6" },
  { name: "係数算定", value: 1233040, color: "79A5C4" },
  { name: "員数単価", value: 730362, color: "A9C6DC" },
];

const fmt = (n) => n.toLocaleString("en-US"); // 3桁区切り

// ---------------------------------------------------------------- プレゼン
const pres = new pptxgen();
pres.layout = "LAYOUT_WIDE"; // 13.333 x 7.5 inch (16:9)

const slide = pres.addSlide();
slide.background = { color: C.white };

const MX = 0.42; // 左右マージン
const CW = 13.333 - MX * 2; // コンテンツ幅 12.49

// ================================================================ 第1層 タイトル
slide.addText("令和9年度予算編成", {
  x: MX, y: 0.3, w: 5.0, h: 0.3,
  fontFace: FONT, fontSize: 12, bold: true, color: C.blueGray,
  align: "left", margin: 0,
});
slide.addText("各局圧縮額への対応方針", {
  x: MX, y: 0.58, w: 7.4, h: 0.56,
  fontFace: FONT, fontSize: 28, bold: true, color: C.navy,
  align: "left", margin: 0,
});
// 結論タグ(右上)
slide.addText("市民生活への影響を抑え、まず内部から見直す", {
  x: 8.0, y: 0.62, w: 4.91, h: 0.46,
  shape: pres.shapes.ROUNDED_RECTANGLE, rectRadius: 0.06,
  fill: { color: C.navy },
  fontFace: FONT, fontSize: 12.5, bold: true, color: C.white,
  align: "center", valign: "middle",
});

// ================================================================ 第3層 基本方針(中央上部の横長ボックス)
slide.addShape(pres.shapes.ROUNDED_RECTANGLE, {
  x: MX, y: 1.28, w: CW, h: 1.08, rectRadius: 0.05,
  fill: { color: C.lightBlue }, line: { type: "none" },
});
// チェックマークのアイコン(シンプルな円形)
slide.addText("✓", {
  x: 0.66, y: 1.56, w: 0.5, h: 0.5,
  shape: pres.shapes.OVAL, fill: { color: C.navy },
  fontFace: FONT, fontSize: 20, bold: true, color: C.white,
  align: "center", valign: "middle", margin: 0,
});
slide.addText("総務局における見直し方針", {
  x: 1.34, y: 1.4, w: 6.0, h: 0.26,
  fontFace: FONT, fontSize: 11, bold: true, color: C.blueGray,
  align: "left", margin: 0,
});
slide.addText("市民生活への影響を抑えるため、まず行政内部の事務経費を徹底して見直す", {
  x: 1.34, y: 1.63, w: 11.4, h: 0.36,
  fontFace: FONT, fontSize: 17, bold: true, color: C.navy,
  align: "left", margin: 0,
});
slide.addText(
  [
    {
      text: "原文：「まずは、市民生活に直接影響を及ぼさない行政内部の事務における経費等について、徹底した見直しを行う。」",
      options: { breakLine: true },
    },
    {
      text: "　　　「内部管理事務経費については、最低限必要なものを除き、事務事業の計画的な執行等により節減する。」",
    },
  ],
  {
    x: 1.34, y: 2.0, w: 11.4, h: 0.34,
    fontFace: FONT, fontSize: 8.5, color: C.blueGray,
    align: "left", margin: 0, lineSpacing: 11.5,
  }
);

// ================================================================ 第2層 主要数値と全体構成(左カラム)
const LX = MX; // 左カラム x
const LW = 4.9; // 左カラム幅

slide.addText("令和9年度 一般財源見込額", {
  x: LX, y: 2.56, w: LW, h: 0.3,
  fontFace: FONT, fontSize: 12, bold: true, color: C.blueGray,
  align: "left", margin: 0,
});
slide.addText(
  [
    { text: "54,457,581", options: { fontSize: 37, bold: true, color: C.navy } },
    { text: " 千円", options: { fontSize: 14, bold: true, color: C.blueGray } },
  ],
  {
    x: LX, y: 2.84, w: LW, h: 0.62,
    fontFace: FONT, align: "left", valign: "middle", margin: 0,
  }
);

// 圧縮対象経費 KPIカード(限定的なゴールド強調)
slide.addShape(pres.shapes.ROUNDED_RECTANGLE, {
  x: LX, y: 3.6, w: LW, h: 0.68, rectRadius: 0.05,
  fill: { color: C.goldTint }, line: { color: C.gold, width: 0.75 },
});
slide.addText("圧縮対象経費（全体の3％）", {
  x: LX + 0.2, y: 3.6, w: 2.5, h: 0.68,
  fontFace: FONT, fontSize: 11, bold: true, color: C.text,
  align: "left", valign: "middle", margin: 0,
});
slide.addText("1,963,402千円", {
  x: LX + 2.55, y: 3.6, w: 2.15, h: 0.68,
  fontFace: FONT, fontSize: 16, bold: true, color: C.gold,
  align: "right", valign: "middle", margin: 0,
});

// 構成グラフ(横100％積み上げ棒)
slide.addText("一般財源見込額の構成（単位：千円）", {
  x: LX, y: 4.48, w: LW, h: 0.26,
  fontFace: FONT, fontSize: 10.5, bold: true, color: C.blueGray,
  align: "left", margin: 0,
});
slide.addChart(
  pres.charts.BAR,
  BUDGET_SEGMENTS.map((s) => ({
    name: s.name,
    labels: ["令和9年度見込額"],
    values: [s.value],
  })),
  {
    x: LX - 0.08, y: 4.72, w: LW + 0.16, h: 0.62,
    barDir: "bar",
    barGrouping: "percentStacked",
    chartColors: BUDGET_SEGMENTS.map((s) => s.color),
    dataBorder: { pt: 1, color: C.white },
    showLegend: false,
    showTitle: false,
    showValue: false,
    catAxisHidden: true,
    valAxisHidden: true,
    catGridLine: { style: "none" },
    valGridLine: { style: "none" },
    barGapWidthPct: 25,
  }
);

// 凡例(色チップ+区分名+金額 : 色だけに依存しない表記)
BUDGET_SEGMENTS.forEach((s, i) => {
  const ry = 5.52 + i * 0.29;
  slide.addShape(pres.shapes.RECTANGLE, {
    x: LX + 0.02, y: ry + 0.06, w: 0.15, h: 0.15,
    fill: { color: s.color }, line: { type: "none" },
  });
  slide.addText(s.name, {
    x: LX + 0.28, y: ry, w: 2.2, h: 0.27,
    fontFace: FONT, fontSize: 10, color: C.text,
    align: "left", valign: "middle", margin: 0,
  });
  slide.addText(fmt(s.value), {
    x: LX + 2.5, y: ry, w: 2.2, h: 0.27,
    fontFace: FONT, fontSize: 10, color: C.text,
    align: "right", valign: "middle", margin: 0,
  });
});

// ================================================================ 第4層 2つの対応方針(右側2ブロック)
const CARD_W = 3.54;
const CARD_H = 4.4;
const CARD_Y = 2.56;
const CARDS = [
  {
    x: 5.62,
    num: "01",
    title: "内部管理事務の見直し",
    items: [
      {
        name: "ペーパーレスのさらなる推進",
        desc: "新たなコミュニケーションツールを活用し、複写料やコピー用紙を節減",
        detail: "令和8年度導入の新ツールを徹底活用",
      },
      {
        name: "積算方法の見直し",
        desc: "大学の施設管理運営費などを、実態に即した積算へ見直し",
        detail: "運営費交付金等の積算方法を再点検",
      },
    ],
  },
  {
    x: 9.37,
    num: "02",
    title: "歳入の確保",
    items: [
      {
        name: "国・県補助金の再確認",
        desc: "制度改正や国の予算動向を把握し、補助金の計上漏れを防止",
        detail: "少額のものも含めて漏れなく計上",
      },
      {
        name: "企業版ふるさと納税の活用",
        desc: "マッチング事業を継続し、企業からの寄附拡大を推進",
        detail: "令和8年度開始事業をR9年度も継続",
      },
    ],
  },
];

CARDS.forEach((card) => {
  slide.addShape(pres.shapes.ROUNDED_RECTANGLE, {
    x: card.x, y: CARD_Y, w: CARD_W, h: CARD_H, rectRadius: 0.05,
    fill: { color: C.lightGray }, line: { type: "none" },
  });
  // 番号バッジ
  slide.addText(card.num, {
    x: card.x + 0.24, y: CARD_Y + 0.26, w: 0.52, h: 0.52,
    shape: pres.shapes.ROUNDED_RECTANGLE, rectRadius: 0.04,
    fill: { color: C.navy },
    fontFace: FONT, fontSize: 17, bold: true, color: C.white,
    align: "center", valign: "middle", margin: 0,
  });
  // ブロック見出し
  slide.addText(card.title, {
    x: card.x + 0.9, y: CARD_Y + 0.26, w: CARD_W - 1.1, h: 0.52,
    fontFace: FONT, fontSize: 15, bold: true, color: C.navy,
    align: "left", valign: "middle", margin: 0,
  });
  // 2つの施策
  card.items.forEach((item, i) => {
    const iy = CARD_Y + 1.06 + i * 1.66;
    slide.addText(item.name, {
      x: card.x + 0.26, y: iy, w: CARD_W - 0.5, h: 0.3,
      fontFace: FONT, fontSize: 12.5, bold: true, color: C.text,
      align: "left", valign: "middle", margin: 0,
    });
    slide.addText(item.desc, {
      x: card.x + 0.26, y: iy + 0.34, w: CARD_W - 0.52, h: 0.62,
      fontFace: FONT, fontSize: 10.5, color: C.text,
      align: "left", valign: "top", margin: 0, lineSpacing: 15,
    });
    slide.addText(item.detail, {
      x: card.x + 0.26, y: iy + 1.0, w: CARD_W - 0.52, h: 0.26,
      fontFace: FONT, fontSize: 9, color: C.blueGray,
      align: "left", valign: "top", margin: 0,
    });
    if (i === 0) {
      // 施策間の細罫線
      slide.addShape(pres.shapes.LINE, {
        x: card.x + 0.26, y: iy + 1.5, w: CARD_W - 0.52, h: 0,
        line: { color: C.line, width: 0.75 },
      });
    }
  });
});

// ================================================================ 注記
slide.addText("注：構成区分の数値および圧縮対象経費の比率は、原資料記載値に基づく。", {
  x: MX, y: 7.08, w: CW, h: 0.24,
  fontFace: FONT, fontSize: 8.5, color: C.blueGray,
  align: "left", margin: 0,
});

// ---------------------------------------------------------------- 出力
pres
  .writeFile({ fileName: "redesign_r9_budget_policy.pptx" })
  .then((name) => console.log(`created: ${name}`))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
