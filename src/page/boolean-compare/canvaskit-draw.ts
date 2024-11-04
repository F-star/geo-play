import InitCanvasKit, { Path } from 'canvaskit-wasm';
import { IDrawParams, IPathData } from './type';

export const canvaskitDraw = async (params: IDrawParams) => {
  const CanvasKit = await InitCanvasKit({
    locateFile: (file) => '/node_modules/canvaskit-wasm/bin/' + file,
  });

  const surface = CanvasKit.MakeWebGLCanvasSurface(params.canvas)!;

  const strokePaint = new CanvasKit.Paint();
  strokePaint.setColor(params.stroke);
  strokePaint.setStyle(CanvasKit.PaintStyle.Stroke);
  strokePaint.setAntiAlias(true);

  const fillPaint = new CanvasKit.Paint();
  fillPaint.setColor(params.fill);
  fillPaint.setStyle(CanvasKit.PaintStyle.Fill);
  fillPaint.setAntiAlias(true);

  // const pathOp = {
  //   intersect: CanvasKit.PathOp.Intersect,
  //   union: CanvasKit.PathOp.Union,
  //   xor: CanvasKit.PathOp.XOR,
  //   difference: CanvasKit.PathOp.Difference,
  // }[params.op];
  const pathOps = [
    CanvasKit.PathOp.Intersect,
    CanvasKit.PathOp.Union,
    CanvasKit.PathOp.XOR,
    CanvasKit.PathOp.Difference,
    CanvasKit.PathOp.ReverseDifference,
  ];

  surface.drawOnce((canvas) => {
    canvas.clear(CanvasKit.WHITE);

    canvas.translate(10, 10);

    canvas.save();

    for (const path of params.paths) {
      const path1 = new CanvasKit.Path();
      setPath(path1, path.path1);
      const path2 = new CanvasKit.Path();
      setPath(path2, path.path2);

      for (const pathOp of pathOps) {
        const booleanPath = path1.copy();
        booleanPath.op(path2, pathOp);

        canvas.drawPath(booleanPath, fillPaint);
        canvas.drawPath(path1, strokePaint);
        canvas.drawPath(path2, strokePaint);
        canvas.translate(180, 0);
      }
      canvas.restore();
      canvas.translate(0, 200);
    }
  });
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
