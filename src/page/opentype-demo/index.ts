import { SVG } from '@svgdotjs/svg.js';
import opentype, { Font } from 'opentype.js';

const canvas = document.querySelector('canvas')!;
const ctx = canvas.getContext('2d')!;

const main = async () => {
  const buffer = await fetch('../../fonts/SourceHanSansCN-Regular.otf').then(
    (res) =>
      // const buffer = await fetch('../../fonts/FiraCode-Regular.woff').then((res) =>
      res.arrayBuffer(),
  );

  const font = opentype.parse(buffer);
  console.log(font);

  // console.log(Font.palettes);
  // palettes
  const x = 60;
  const y = 160;
  const fontSize = 24;

  const text = '前端西瓜哥/Ab1';
  const textPath = font.getPath(text, x, y, fontSize, {
    features: { liga: true },
  });

  const glyphs = font.stringToGlyphs('!=');
  console.log(glyphs);
  // textPaths.push(glyph.path);
  console.log(textPath);

  // Canvas 2D 渲染
  font.draw(ctx, text, x, y, fontSize, {
    features: {
      liga: true,
      rlig: true,
    },
  });
  // font.drawPoints(ctx, text, x, y, fontSize);
  font.drawMetrics(ctx, text, x, y, fontSize);

  // svg 渲染
  const pathData = textPath.toPathData(4);
  // console.log(pathData);

  const svgDraw = SVG().addTo('body').size(700, 600);

  svgDraw.path(pathData);

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
