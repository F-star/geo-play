import InitCanvasKit from 'canvaskit-wasm'; // default

const main = async () => {
  const CanvasKit = await InitCanvasKit({
    locateFile: (file) => '/node_modules/canvaskit-wasm/bin/' + file,
  });

  const surface = CanvasKit.MakeWebGLCanvasSurface('stage')!;
  const paint = new CanvasKit.Paint();
  paint.setColor(CanvasKit.Color4f(0, 0, 0, 1.0));
  paint.setStyle(CanvasKit.PaintStyle.Fill);
  paint.setAntiAlias(true);

  const fontData = await fetch('../../fonts/SourceHanSansCN-Regular.otf').then(
    (res) => res.arrayBuffer(),
  );
  // 绘制文字
  const canvas = surface.getCanvas();
  canvas.clear(CanvasKit.WHITE);
  const typeface = CanvasKit.Typeface.MakeFreeTypeFaceFromData(fontData)!;
  const font = new CanvasKit.Font(typeface, 24);
  canvas.drawText('AW 123 西瓜测试', 50, 50, paint, font);

  // canvas.drawImage(
  //   CanvasKit.MakeImageFromEncoded(
  //     await (await fetch('./fe_watermelon.jpg')).arrayBuffer(),
  //   )!,
  //   10,
  //   10,
  //   paint,
  // );

  surface.flush();
};

main();
