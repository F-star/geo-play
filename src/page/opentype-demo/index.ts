import { SVG } from '@svgdotjs/svg.js';
import opentype, { Font } from 'opentype.js';

const canvas = document.querySelector('canvas')!;
const ctx = canvas.getContext('2d')!;

const main = async () => {
  const buffer = await fetch('../../fonts/FiraCode-Regular.woff').then((res) =>
    // const buffer = await fetch('../../fonts/FiraCode-Regular.woff').then((res) =>
    res.arrayBuffer(),
  );

  const font = opentype.parse(buffer);
  console.log(font);

  // console.log(Font.palettes);
  // palettes
  const x = 60;
  const y = 60;
  const fontSize = 24;

  const text = '!==';
  const textPaths = [
    font.getPath(text, x, y, fontSize, {
      features: { liga: true },
    }),
  ];
  console.log(textPaths);

  // Canvas 2D 渲染
  debugger;
  font.draw(ctx, text, x, y, fontSize, {
    kerning: true,
    features: {
      liga: true,
      rlig: true,
    },
  });
  // font.drawMetrics(ctx, text, x, y, fontSize);

  // svg 渲染
  const pathDatas = textPaths.map((item) => item.toPathData(4));
  console.log(pathDatas);

  const svgDraw = SVG().addTo('body').size(700, 600);
  for (const d of pathDatas) {
    svgDraw.path(d);
  }

  // 获取 glyph 对象
  console.log(font.charToGlyph('永A'));

  // 获取字符 间距调整（kerning）
  // kerning 概念：https://en.wikipedia.org/wiki/Kerning
  const leftGlyph = font.charToGlyph('A');
  const rightGlyph = font.charToGlyph('V');
  console.log(font.getKerningValue(leftGlyph, rightGlyph));

  // 判断字符串长度
  console.log('getAdvanceWidth', font.getAdvanceWidth('A', 100));
};

main();
