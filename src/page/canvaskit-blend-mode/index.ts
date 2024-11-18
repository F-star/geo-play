import InitCanvasKit, {
  BlendMode,
  CanvasKit,
} from 'canvaskit-wasm/bin/canvaskit.js';
// @ts-ignore
import CanvasKitWasm from 'canvaskit-wasm/bin/canvaskit.wasm?url';

// 文档：https://skia.org/docs/user/api/skblendmode_overview/
// 在线 demo：https://fiddle.skia.org/c/@BlendModes

const draw = (
  canvas: HTMLCanvasElement,
  CanvasKit: CanvasKit,
  blendMode: BlendMode,
) => {
  const surface = CanvasKit.MakeWebGLCanvasSurface(canvas)!;

  const paint1 = new CanvasKit.Paint();
  paint1.setColor(CanvasKit.Color4f(1, 0, 0, 0.5));

  const paint2 = new CanvasKit.Paint();
  paint2.setColor(CanvasKit.Color4f(0, 1, 0, 0.5));
  paint2.setBlendMode(blendMode);

  console.log(paint2);

  // const paint3 = new CanvasKit.Paint();
  // paint3.setColor(CanvasKit.Color4f(0, 1, 0, 1));

  const rect1 = CanvasKit.XYWHRect(100, 100, 100, 100);
  const rect2 = CanvasKit.XYWHRect(150, 150, 100, 100);

  surface.drawOnce((canvas) => {
    canvas.clear(CanvasKit.WHITE);

    canvas.drawRRect(rect1, paint1);

    // canvas.saveLayer(paint2);
    canvas.drawRRect(rect2, paint2);
    // canvas.restore();
  });
};

const main = async () => {
  const CanvasKit = await InitCanvasKit({
    locateFile: () => CanvasKitWasm,
  });

  const blendModes = [
    [CanvasKit.BlendMode.Clear, 'clear'],
    [CanvasKit.BlendMode.Src, 'src'],
    [CanvasKit.BlendMode.Dst, 'dst'],
    [CanvasKit.BlendMode.SrcOver, 'srcOver'],
    [CanvasKit.BlendMode.DstOver, 'dstOver'],
    [CanvasKit.BlendMode.SrcIn, 'srcIn'],
    [CanvasKit.BlendMode.DstIn, 'dstIn'],
    [CanvasKit.BlendMode.SrcOut, 'srcOut'],
    [CanvasKit.BlendMode.DstOut, 'dstOut'],
    [CanvasKit.BlendMode.SrcATop, 'srcATop'],
    [CanvasKit.BlendMode.DstATop, 'dstATop'],
    [CanvasKit.BlendMode.Xor, 'xor'],
    [CanvasKit.BlendMode.Plus, 'plus'],
    [CanvasKit.BlendMode.Modulate, 'modulate'],
    [CanvasKit.BlendMode.Screen, 'screen'],
    [CanvasKit.BlendMode.Overlay, 'overlay'],
    [CanvasKit.BlendMode.Darken, 'darken'],
    [CanvasKit.BlendMode.Lighten, 'lighten'],
    [CanvasKit.BlendMode.ColorDodge, 'colorDodge'],
    [CanvasKit.BlendMode.ColorBurn, 'colorBurn'],
    [CanvasKit.BlendMode.HardLight, 'hardLight'],
    [CanvasKit.BlendMode.SoftLight, 'softLight'],
    [CanvasKit.BlendMode.Difference, 'difference'],
    [CanvasKit.BlendMode.Exclusion, 'exclusion'],
    [CanvasKit.BlendMode.Multiply, 'multiply'],
    [CanvasKit.BlendMode.Hue, 'hue'],
    [CanvasKit.BlendMode.Saturation, 'saturation'],
    [CanvasKit.BlendMode.Color, 'color'],
    [CanvasKit.BlendMode.Luminosity, 'luminosity'],
  ] as const;

  let index = 0;
  const canvas = document.getElementById('stage') as HTMLCanvasElement;
  const infoEl = document.getElementById('info')!;

  draw(canvas, CanvasKit, blendModes[index][0]);
  infoEl.innerText = blendModes[index][1];

  canvas.addEventListener('click', () => {
    index = (index + 1) % blendModes.length;
    draw(canvas, CanvasKit, blendModes[index][0]);
    infoEl.innerText = blendModes[index][1];
  });
};

main();
