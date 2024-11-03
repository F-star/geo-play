import {
  arcToCubic,
  circleToCubic,
  ellipseToCubic,
  quarterCircleToCubic,
} from './circle-bezier-approximate';

const canvas = document.querySelector('canvas')!;
const ctx = canvas.getContext('2d')!;

const circle = {
  cx: 250,
  cy: 350,
  r: 100,
};

const ellipse = {
  cx: 250,
  cy: 400,
  rx: 100,
  ry: 50,
};

let startAngle = 0;
let endAngle = 0;

const draw = () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.save();

  // 绘制圆形
  ctx.beginPath();
  ctx.arc(circle.cx, circle.cy, circle.r, 0, Math.PI * 2);
  ctx.fillStyle = '#dddddd';
  ctx.fill();

  // 绘制贝塞尔拟合
  // const pathData = circleToCubic(circle.cx, circle.cy, circle.r);
  // drawPath(ctx, pathData);
  // drawControlPoints(ctx, pathData);

  // 绘制任意圆弧
  const pathData = arcToCubic(
    circle.cx,
    circle.cy,
    circle.r,
    startAngle,
    endAngle,
  );
  drawPath(ctx, pathData);
  drawControlPoints(ctx, pathData);

  // 绘制 1/4 圆弧拟合
  // const pathData2 = quarterCircleToCubic(circle.cx, circle.cy, circle.r);
  // console.log(pathData2);

  // ctx.strokeStyle = 'red';
  // ctx.lineWidth = 4;
  // drawPath(ctx, pathData2);
  // drawControlPoints(ctx, pathData2);

  // 绘制椭圆
  // ctx.beginPath();
  // ctx.ellipse(
  //   ellipse.cx,
  //   ellipse.cy,
  //   ellipse.rx,
  //   ellipse.ry,
  //   0,
  //   0,
  //   Math.PI * 2,
  // );
  // ctx.fillStyle = '#dddddd';
  // ctx.fill();

  // 绘制椭圆贝塞尔拟合
  // const pathData3 = ellipseToCubic(
  //   ellipse.cx,
  //   ellipse.cy,
  //   ellipse.rx,
  //   ellipse.ry,
  // );
  // drawPath(ctx, pathData3);
  // drawControlPoints(ctx, pathData3);
  ctx.restore();
};

const drawPath = (
  ctx: CanvasRenderingContext2D,
  pathData: [string, ...number[]][],
) => {
  ctx.beginPath();
  pathData.forEach(([command, ...args]) => {
    switch (command) {
      case 'M':
        ctx.moveTo(args[0], args[1]);
        break;
      case 'C':
        ctx.bezierCurveTo(args[0], args[1], args[2], args[3], args[4], args[5]);
        break;
      case 'Z':
        ctx.closePath();
        break;
    }
  });
  ctx.stroke();
};

const drawControlPoints = (
  ctx: CanvasRenderingContext2D,
  pathData: [string, ...number[]][],
) => {
  ctx.strokeStyle = 'blue';
  ctx.lineWidth = 1;
  let lastPoint: [number, number] | null = null;

  let index = 0;

  const drawPoint = (x: number, y: number) => {
    ctx.save();
    ctx.beginPath();
    ctx.arc(x, y, 4, 0, Math.PI * 2);
    ctx.fillStyle = 'blue';
    ctx.fill();
    // 偏移一点；白色描边，字高为18px
    ctx.font = '14px sans-serif';
    ctx.fillText(index.toString(), x + 6, y + 14);
    ctx.restore();
    index++;
  };

  pathData.forEach(([command, ...args]) => {
    switch (command) {
      case 'M':
        drawPoint(args[0], args[1]);
        lastPoint = [args[0], args[1]];
        break;
      case 'C':
        drawPoint(args[0], args[1]);
        // 绘制第一条控制线
        if (lastPoint) {
          ctx.beginPath();
          ctx.moveTo(lastPoint[0], lastPoint[1]);
          ctx.lineTo(args[0], args[1]);
          ctx.stroke();
        }
        lastPoint = [args[4], args[5]];

        // 绘制第二条
        ctx.moveTo(args[4], args[5]);
        ctx.lineTo(args[2], args[3]);
        ctx.stroke();

        drawPoint(args[2], args[3]);
        drawPoint(args[4], args[5]);
        break;
    }
  });
};

draw();

const startAnimation = () => {
  setInterval(() => {
    endAngle += Math.PI / 50;
    startAngle -= Math.PI / 100;
    draw();
  }, 30);
};

canvas.addEventListener('click', () => {
  startAnimation();
});
