import InitCanvasKit from 'canvaskit-wasm';

const main = async () => {
  const CanvasKit = await InitCanvasKit({
    locateFile: (file) => '/node_modules/canvaskit-wasm/bin/' + file,
  });
  // 绘制矩形
  const surface = CanvasKit.MakeWebGLCanvasSurface('stage')!;

  const greyPaint = new CanvasKit.Paint();
  greyPaint.setColor(CanvasKit.Color4f(0.5, 0.5, 0.5, 1.0));
  greyPaint.setStyle(CanvasKit.PaintStyle.Stroke);
  // 虚线
  greyPaint.setPathEffect(CanvasKit.PathEffect.MakeDash([5, 5]));
  greyPaint.setAntiAlias(true);

  const redPaint = new CanvasKit.Paint();
  redPaint.setColor(CanvasKit.Color4f(0.9, 0, 0, 1.0));
  redPaint.setStyle(CanvasKit.PaintStyle.Stroke);
  redPaint.setStrokeWidth(2);
  redPaint.setAntiAlias(true);

  const canvas = surface.getCanvas();
  canvas.clear(CanvasKit.WHITE);

  const rect = CanvasKit.XYWHRect(0, 0, 100, 100);
  canvas.drawRect(rect, greyPaint);

  console.log(canvas.getTotalMatrix());

  canvas.save();

  /******** 矩阵 *******/
  canvas.translate(100, 100); // 移动 100, 100
  canvas.rotate(30, 0, 0); // 旋转 30 度
  canvas.scale(2, 2); // 缩放 2 倍
  // canvas.skew(1, 0);

  // const m = [2, 0, 0, 0, 2, 0];
  // canvas.concat(m);

  // CanvasKit.Matrix.identity(); // 返回一个单位矩阵的数组
  // CanvasKit.Matrix.multiply(m1, m2, m3);
  // CanvasKit.Matrix.skewed(kx, ky, px, py);
  // console.log(
  //   CanvasKit.Matrix.mapPoints(CanvasKit.Matrix.scaled(2, 2), [1, 1, 2, 2]),
  // );

  window.canvas = canvas;

  // canvas.restore();
  canvas.concat(CanvasKit.Matrix.invert(canvas.getTotalMatrix())!);

  console.log(canvas.getTotalMatrix());

  canvas.drawRect(rect, redPaint);

  // 混合模式

  surface.flush();
};

main();
