import opentype, { Font } from 'opentype.js';

const canvas = document.querySelector('canvas')!;
const ctx = canvas.getContext('2d')!;

const main = async () => {
  const buffer = await fetch('../../fonts/SmileySans-Oblique.otf').then((res) =>
    res.arrayBuffer(),
  );

  const font = opentype.parse(buffer);
  console.log(font);

  // console.log(Font.palettes);
  // palettes

  const textPath = font.getPaths('永A', 0, 0, 24);
  console.log(textPath);

  const text = '永fAV';
  font.draw(ctx, text, 200, 200, 100);
  font.drawMetrics(ctx, text, 200, 200, 100);

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
