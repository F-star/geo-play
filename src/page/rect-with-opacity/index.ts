import InitCanvasKit from 'canvaskit-wasm/bin/canvaskit.js';
// @ts-ignore
import CanvasKitWasm from 'canvaskit-wasm/bin/canvaskit.wasm?url';

const rect = {
  x: 100,
  y: 100,
  width: 200,
  height: 200,
};
const opacity = 0.5;

const drawCanvas2d = () => {
  const canvas = document.querySelector('#canvas2d') as HTMLCanvasElement;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = '#00ff00';
  ctx.fillRect(100, 100, 200, 200);

  const tmpCanvas = createTmpCanvas();

  ctx.globalAlpha = opacity;
  ctx.drawImage(tmpCanvas, rect.x, rect.y);
};

const createTmpCanvas = () => {
  const canvas = document.createElement('canvas');
  canvas.width = 500;
  canvas.height = 500;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = '#ff000099';
  ctx.strokeStyle = 'black';
  ctx.lineWidth = 20;

  ctx.beginPath();
  ctx.rect(100, 100, 200, 150);
  ctx.fill();
  ctx.stroke();

  return canvas;
};

const drawCanvasKit = async () => {
  const CanvasKit = await InitCanvasKit({
    locateFile: () => CanvasKitWasm,
  });

  const canvas = document.querySelector('#canvaskit') as HTMLCanvasElement;
  const surface = CanvasKit.MakeWebGLCanvasSurface(canvas)!;

  const paint = new CanvasKit.Paint();
  paint.setColor(CanvasKit.Color4f(1, 0, 0, 1));
  // paint.setAlphaf(opacity);

  const paint2 = new CanvasKit.Paint();
  paint2.setColor(CanvasKit.Color4f(0, 1, 0, 1));
  paint2.setStyle(CanvasKit.PaintStyle.Stroke);
  paint2.setStrokeWidth(20);
  // paint2.setAlphaf(opacity);

  /******* 图层使用的 ********/
  const layerPaint = new CanvasKit.Paint();
  paint2.setColor(CanvasKit.Color4f(0, 1, 0, 1));
  layerPaint.setAlphaf(opacity);

  const layerRect = CanvasKit.XYWHRect(50, 50, 300, 250);

  const rect = CanvasKit.XYWHRect(100, 100, 200, 150);

  surface.drawOnce((canvas) => {
    canvas.clear(CanvasKit.WHITE);

    canvas.scale(1.5, 1.5);

    canvas.saveLayer(
      layerPaint,
      // layerRect,
      // null,
      // CanvasKit.SaveLayerF16ColorType,
    );
    // 设置透明度
    canvas.drawRect(rect, paint);
    canvas.drawRect(rect, paint2);

    canvas.restore();

    canvas.translate(0, 200);

    paint.setAlphaf(opacity);
    paint2.setAlphaf(opacity);

    canvas.drawRect(rect, paint);
    canvas.drawRect(rect, paint2);
  });
};

drawCanvas2d();
drawCanvasKit();
