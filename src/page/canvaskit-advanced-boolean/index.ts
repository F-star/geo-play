import InitCanvasKit from 'canvaskit-wasm';

const main = async () => {
  const CanvasKit = await InitCanvasKit({
    locateFile: (file) => '/node_modules/canvaskit-wasm/bin/' + file,
  });

  const surface = CanvasKit.MakeWebGLCanvasSurface('stage')!;

  const strokePaint = new CanvasKit.Paint();
  strokePaint.setColor(CanvasKit.Color4f(0, 0, 0, 1.0));
  strokePaint.setStyle(CanvasKit.PaintStyle.Stroke);
  strokePaint.setAntiAlias(true);

  const fillPaint = new CanvasKit.Paint();
  fillPaint.setColor(CanvasKit.Color4f(0.9, 0, 0, 1.0));
  fillPaint.setStyle(CanvasKit.PaintStyle.Fill);
  fillPaint.setAntiAlias(true);

  const canvas = surface.getCanvas();
  canvas.clear(CanvasKit.WHITE);

  /*** 布尔运算 ****/
  const rectPath = new CanvasKit.Path().addRect(
    CanvasKit.XYWHRect(20, 20, 100, 100),
  );

  const circlePath = new CanvasKit.Path().addOval(
    CanvasKit.XYWHRect(50, 50, 100, 100),
  );

  // const circlePath = new CanvasKit.Path()
  //   .moveTo(150, 100)
  //   .cubicTo(150, 127.614, 127.614, 150, 100, 150)
  //   .cubicTo(72.386, 150, 50, 127.614, 50, 100)
  //   .cubicTo(50, 72.386, 72.386, 50, 100, 50)
  //   .cubicTo(127.614, 50, 150, 72.386, 150, 100)
  //   .close();

  // 进行布尔运算
  const booleanPath = rectPath.copy();
  booleanPath.op(circlePath, CanvasKit.PathOp.Intersect); // 布尔使用
  console.log(booleanPath.toCmds());
  console.log(booleanPath.toSVGString());

  // 绘制
  canvas.drawPath(booleanPath, fillPaint);
  canvas.drawPath(rectPath, strokePaint);
  canvas.drawPath(circlePath, strokePaint);

  surface.flush();
};

main();
