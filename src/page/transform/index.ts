import { Matrix } from 'pixi.js';
import { drawImg, drawNumText, fillPoints } from '../../draw-util';
import imgUrl from './fe_watermelon.jpg';

const canvas = document.querySelector('canvas')!;
const ctx = canvas.getContext('2d')!;

// 坐标系原点移动到画布中心

const oldRect = {
  width: 200,
  height: 160,
  // transform: new Matrix(1, 2, 3, 4, 200, 200),
  // transform: new Matrix(0.987391, 0.1583, -0.371753, 0.928332, 200, 200),
  transform: new Matrix(0.894991, 0.446084, -0.889758, 0.456433, 300, 200),
  // transform: new Matrix(1, 0, 0, 1, 0, 0),
};

const img = new Image();
img.src = imgUrl;

// 被移动的点
let movedPt = {
  x: 0,
  y: 0,
};

const draw = () => {
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const rect = recomputeRectAttrs(
    oldRect,
    movedPt,
    // 'right-bottom',
    'left-bottom',
  );

  // 原图
  {
    ctx.save();
    ctx.globalAlpha = 0.3;
    const transform = oldRect.transform;
    ctx.transform(
      transform.a,
      transform.b,
      transform.c,
      transform.d,
      transform.tx,
      transform.ty,
    );

    drawImg(ctx, img, {
      x: 0,
      y: 0,
      width: oldRect.width,
      height: oldRect.height,
    });
    ctx.restore();
  }

  // 缩放后的图
  const transform = rect.transform;
  ctx.transform(
    transform.a,
    transform.b,
    transform.c,
    transform.d,
    transform.tx,
    transform.ty,
  );
  drawImg(ctx, img, {
    x: 0,
    y: 0,
    width: rect.width,
    height: rect.height,
  });
  ctx.setTransform(1, 0, 0, 1, 0, 0);

  const leftTop = transform.apply({
    x: 0,
    y: 0,
  });
  const rightTop = transform.apply({
    x: rect.width,
    y: 0,
  });
  const leftBottom = transform.apply({
    x: 0,
    y: rect.height,
  });
  const rightBottom = transform.apply({
    x: rect.width,
    y: rect.height,
  });

  fillPoints(ctx, [leftTop, rightTop, leftBottom, rightBottom, movedPt]);
  drawNumText(ctx, leftTop, 'left-top');
  drawNumText(ctx, rightTop, 'right-top');
  drawNumText(ctx, leftBottom, 'left-bottom');
  drawNumText(ctx, rightBottom, 'right-bottom');
  // drawNumText(ctx, movedPt, `${movedPt.x.toFixed(2)}, ${movedPt.y.toFixed(2)}`);
};

img.onload = () => {
  movedPt = oldRect.transform.apply({
    x: oldRect.width,
    y: oldRect.height,
  });
  draw();
};

const recomputeRectAttrs = (
  /** 被缩放的矩形 */
  rect: { width: number; height: number; transform: Matrix },
  /** 世界坐标系的控制点的新位置 */
  newGlobalPt: { x: number; y: number },
  /** 被移动的控制点类型，我们会基于这个 type，确定 origin */
  type: 'left-top' | 'right-top' | 'left-bottom' | 'right-bottom',
): { width: number; height: number; transform: Matrix } => {
  /**
   * 算法步骤
   *
   */
  const newRect = {
    width: 0,
    height: 0,
    transform: rect.transform.clone(),
  };
  const newLocalPt = rect.transform.applyInverse(newGlobalPt);

  if (type === 'right-bottom') {
    // type 为 right-bottom
    // 缩放中心在左上角
    const localOrigin = { x: 0, y: 0 };
    // const globalOrigin = rect.transform.apply(localOrigin);
    // // 右下角
    // const localPt = {
    //   x: rect.width,
    //   y: rect.height,
    // };
    newRect.width = Math.abs(newLocalPt.x - localOrigin.x);
    newRect.height = Math.abs(newLocalPt.y - localOrigin.y);
    const scaleX = Math.sign(newLocalPt.x - localOrigin.x) || 1;
    const scaleY = Math.sign(newLocalPt.y - localOrigin.y) || 1;
    const scaleTransform = new Matrix(scaleX, 0, 0, scaleY, 0, 0);
    newRect.transform = newRect.transform.append(scaleTransform);
  } else if (type === 'left-bottom') {
    const localOrigin = { x: oldRect.width, y: 0 };
    const globalOrigin = rect.transform.apply(localOrigin);
    // fillPoints(ctx, [globalOrigin], 20);
    // console.log(globalOrigin);

    newRect.width = Math.abs(newLocalPt.x - localOrigin.x);
    newRect.height = Math.abs(newLocalPt.y - localOrigin.y);

    const scaleX = Math.sign(localOrigin.x - newLocalPt.x) || 1;
    const scaleY = Math.sign(newLocalPt.y - localOrigin.y) || 1;
    const scaleTransform = new Matrix()
      // .translate(localOrigin.x, localOrigin.y)
      .scale(scaleX, scaleY);
    // const tranlateTransform = new Matrix(scaleX, 0, 0, scaleY, 0, 0)
    // console.log({ })
    newRect.transform = newRect.transform.append(scaleTransform);
    const newGlobalOrigin = newRect.transform.apply({
      x: newRect.width,
      y: 0,
    });
    // fillPoints(ctx, [newGlobalOrigin], 30);

    console.log(newGlobalOrigin);

    const offset = {
      x: newGlobalOrigin.x - globalOrigin.x,
      y: newGlobalOrigin.y - globalOrigin.y,
    };
    console.log(offset);

    newRect.transform.translate(-offset.x, -offset.y);
  }
  return newRect;
};

canvas.addEventListener('pointermove', (e: PointerEvent) => {
  movedPt.x = e.clientX;
  movedPt.y = e.clientY;

  draw();
});

canvas.addEventListener('click', () => {
  // ...
  draw();
});
