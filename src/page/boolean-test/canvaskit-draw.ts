import { CanvasKit, Path, Surface } from 'canvaskit-wasm';
import { IPathData } from './type';
import { Matrix } from 'pixi.js';

export const canvaskitDraw = async (
  CanvasKit: CanvasKit,
  surface: Surface,
  paths: {
    path1: IPathData;
    path2: IPathData;
  }[],

  tf?: Matrix,
) => {
  const blackStroke = new CanvasKit.Paint();
  blackStroke.setColor(CanvasKit.Color(0, 0, 0, 1));
  blackStroke.setStyle(CanvasKit.PaintStyle.Stroke);
  blackStroke.setAntiAlias(true);
  // blackStroke.setStrokeWidth(1);

  const greyStroke = new CanvasKit.Paint();
  greyStroke.setColor(CanvasKit.Color(128, 128, 128, 0.2));
  greyStroke.setStyle(CanvasKit.PaintStyle.Stroke);
  greyStroke.setAntiAlias(true);

  const booleanFill = new CanvasKit.Paint();
  booleanFill.setColor(CanvasKit.Color(0, 102, 255, 0.5));
  booleanFill.setStyle(CanvasKit.PaintStyle.Fill);
  booleanFill.setAntiAlias(true);

  const redFill = new CanvasKit.Paint();
  // 半透明红色
  redFill.setColor(CanvasKit.Color(255, 0, 0, 0.5));
  redFill.setStyle(CanvasKit.PaintStyle.Fill);

  redFill.setAntiAlias(true);

  const blueFill = new CanvasKit.Paint();
  // 半透明蓝色
  blueFill.setColor(CanvasKit.Color(0, 0, 255, 0.5));
  blueFill.setStyle(CanvasKit.PaintStyle.Fill);
  blueFill.setAntiAlias(true);

  const pathOps = [
    CanvasKit.PathOp.Intersect,
    CanvasKit.PathOp.Union,
    CanvasKit.PathOp.XOR,
    CanvasKit.PathOp.Difference,
    CanvasKit.PathOp.ReverseDifference,
  ];

  const canvas = surface.getCanvas();

  canvas.clear(CanvasKit.WHITE);
  canvas.save();

  if (tf) {
    canvas.concat([tf.a, tf.c, tf.tx, tf.b, tf.d, tf.ty]);
  }
  canvas.translate(10, 10);

  for (const path of paths) {
    canvas.save();
    const path1 = new CanvasKit.Path();
    setPath(path1, path.path1);
    const path2 = new CanvasKit.Path();
    setPath(path2, path.path2);

    // 绘制原始路径
    canvas.drawPath(path1, redFill);
    canvas.drawPath(path2, blueFill);
    canvas.drawPath(path1, blackStroke);
    canvas.drawPath(path2, blackStroke);
    canvas.translate(180, 0);

    for (const pathOp of pathOps) {
      const booleanPath = path1.copy();
      booleanPath.op(path2, pathOp);

      canvas.drawPath(booleanPath, booleanFill);
      canvas.drawPath(path1, greyStroke);
      canvas.drawPath(path2, greyStroke);
      canvas.drawPath(booleanPath, blackStroke);
      canvas.translate(180, 0);

      booleanPath.delete();
    }
    canvas.restore();
    canvas.translate(0, 200);

    path1.delete();
    path2.delete();
  }
  canvas.restore();

  surface.flush();
  blackStroke.delete();
  greyStroke.delete();
  booleanFill.delete();
  redFill.delete();
  blueFill.delete();
};

const setPath = (pathObj: Path, pathData: IPathData) => {
  for (const [op, ...args] of pathData) {
    switch (op) {
      case 'M':
        pathObj.moveTo(args[0], args[1]);
        break;
      case 'L':
        pathObj.lineTo(args[0], args[1]);
        break;
      case 'C':
        pathObj.cubicTo(args[0], args[1], args[2], args[3], args[4], args[5]);
        break;
      case 'Z':
        pathObj.close();
        break;
    }
  }
  return pathObj;
};
