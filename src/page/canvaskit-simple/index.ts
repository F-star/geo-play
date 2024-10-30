import InitCanvasKit from 'canvaskit-wasm';

const main = async () => {
  const CanvasKit = await InitCanvasKit({
    locateFile: (file) => '/node_modules/canvaskit-wasm/bin/' + file,
  });
  console.log(CanvasKit);

  // 绘制矩形
  const surface = CanvasKit.MakeWebGLCanvasSurface('stage')!;

  console.log('Color4f', CanvasKit.Color4f(0.9, 0, 0, 1.0));

  const paint = new CanvasKit.Paint(); // 创建 paint 对象
  paint.setColor(CanvasKit.Color4f(0.9, 0, 0, 1.0)); // 设置颜色
  paint.setStyle(CanvasKit.PaintStyle.Stroke); // 填充还是描边，这里选择描边
  paint.setStrokeWidth(2); // 线宽
  paint.setAntiAlias(true); // 抗锯齿

  console.log(CanvasKit.XYWHRect(50, 50, 200, 100));

  const roundRect = CanvasKit.RRectXY(
    CanvasKit.XYWHRect(50, 50, 200, 100),
    10,
    10,
  );

  const fillPaint = new CanvasKit.Paint();
  fillPaint.setColor(CanvasKit.Color(0, 0, 0, 1));
  fillPaint.setStyle(CanvasKit.PaintStyle.Fill);
  fillPaint.setAntiAlias(true);

  const imgData = await fetch('./fe_watermelon.jpg').then((res) =>
    res.arrayBuffer(),
  );
  const img = CanvasKit.MakeImageFromEncoded(imgData)!;

  const fontData = await fetch('../../fonts/SourceHanSansCN-Regular.otf').then(
    (res) => res.arrayBuffer(),
  );

  surface.drawOnce((canvas) => {
    canvas.clear(CanvasKit.WHITE);

    /****** 绘制圆角矩形 ******/
    // canvas.drawRRect(roundRect, paint);

    /****** 绘制矩形 ******/
    // canvas.drawRect(CanvasKit.XYWHRect(50, 50, 200, 100), paint);

    /****** 绘制椭圆 ******/
    // canvas.drawOval(CanvasKit.XYWHRect(50, 50, 200, 100), paint);

    /****** 绘制圆 ******/
    // canvas.drawCircle(
    //   100, // cx
    //   100, // cy
    //   80, // radius
    //   paint,
    // );

    /****** 绘制直线 ******/
    // canvas.drawLine(20, 20, 140, 100, paint);

    /****** 绘制椭圆弧 ******/
    // canvas.drawArc(
    //   CanvasKit.XYWHRect(50, 50, 200, 100), // oval，包围椭圆的矩形
    //   0, // startAngle，起始角度。极轴坐标中正右方向为 0 度，角度方向为顺时针
    //   90, // endAngle，结束角度
    //   true, // useCenter，是否使用中心，即是否额外加多两条连接到圆心的线
    //   paint,
    // );

    /*** 绘制点 ***/
    // canvas.drawPoints(
    //   CanvasKit.PointMode.Polygon, // 模式为多段线模式
    //   [20, 20, 50, 60, 90, 30, 150, 60], // 点的集合
    //   paint,
    // );

    /*** 绘制路径 ***/
    // const path = new CanvasKit.Path();
    // path
    //   .moveTo(20, 150)
    //   .lineTo(50, 60)
    //   .arc(80, 80, 20, 0, Math.PI)
    //   .cubicTo(90, 30, 150, 60, 190, 90);
    // canvas.drawPath(path, paint);

    /*** 绘制图片 ***/
    // canvas.drawImage(img, 10, 10);

    /*** 绘制文字 ***/
    // const typeface = CanvasKit.Typeface.MakeFreeTypeFaceFromData(fontData)!;
    // const font = new CanvasKit.Font(typeface, 24);
    // canvas.drawText('AW 123 西瓜测试', 50, 50, fillPaint, font);

    /*** 绘制文字段落 ***/
    const fontMgr = CanvasKit.FontMgr.FromData(fontData)!;
    const paraStyle = new CanvasKit.ParagraphStyle({
      textStyle: {
        color: CanvasKit.BLACK,
        fontFamilies: ['SourceHanSansCN-Regular'],
        fontSize: 28,
      },
      textAlign: CanvasKit.TextAlign.Left,
    });
    const text =
      'Any sufficiently entrenched 一行白鹭上青天，春江水暖鸭先知。 technology is indistinguishable from Javascript';
    const builder = CanvasKit.ParagraphBuilder.Make(paraStyle, fontMgr);
    builder.addText(text);
    const paragraph = builder.build();
    paragraph.layout(290); // 包裹文字的宽度
    canvas.drawParagraph(paragraph, 10, 10);
    // 辅助参照用
    canvas.drawRect(CanvasKit.XYWHRect(10, 10, 290, 300), paint);
  });
};

main();
