import { Matrix } from 'pixi.js';

const canvas = document.querySelector('canvas');
const canvasWidth = canvas.width;
const canvasHeight = canvas.height;

const radius = 10; // 绿球半径
const redRadius = 12; // 红球半径
const greenBallCount = 5000;

const ctx = canvas.getContext('2d');

// 返回随机坐标
function getRandPos(w, h, offset) {
  function getRandInt(min, max) {
    min = Math.floor(min);
    max = Math.ceil(max);
    return Math.floor(Math.random() * (max - min + 1) + min);
  }
  const x = getRandInt(0 + offset, w - offset);
  const y = getRandInt(0 + offset, h - offset);
  return { x, y };
}

// 记录大量的
const greenBalls = new Array(greenBallCount);
for (let i = 0; i < greenBalls.length; i++) {
  greenBalls[i] = {
    ...getRandPos(canvasWidth, canvasHeight, radius),
    index: i,
  };
}

// 绘制大量绿色圆形
function drawGreenBalls(balls) {
  ctx.fillStyle = '#519D36'; // 绿色
  for (let i = 0; i < balls.length; i++) {
    ctx.save();
    ctx.beginPath();
    const { x, y } = balls[i];
    ctx.arc(x, y, radius, 0, Math.PI * 2); // 0 为从右方为起点
    ctx.fill();
    ctx.stroke();
    ctx.closePath();
    ctx.restore();
  }
}

let prevRedBall;

function drawRedBall(x, y) {
  ctx.fillStyle = 'red';
  ctx.beginPath();
  ctx.arc(x, y, redRadius, 0, Math.PI * 2); // 0 为从右方为起点
  ctx.fill();
  ctx.stroke();
  prevRedBall = { x, y, radius: redRadius };
}

/**** 局部渲染 ****/
function partRender(targetX, targetY) {
  // 【1】计算需要重绘的区域
  // 为当前红色球和即将渲染的红色球形成的 “包围盒”
  let dirtyBox = getCircleBBox(prevRedBall, {
    x: targetX,
    y: targetY,
    radius: redRadius,
  });

  // 【2】计算所有被碰撞的绿色球
  const collisions = []; // 被碰撞的 ball 的坐标
  for (let i = 0; i < greenBalls.length; i++) {
    const { x, y, index } = greenBalls[i];
    // +1 是为了弥补 strokeWidth 的 1px 宽度所产生的外扩像素
    const circle = { x, y, radius: radius + 1 };
    const circleBBox = getCircleBBox(circle);

    if (isRectIntersect(circleBBox, dirtyBox)) {
      collisions.push({ x, y, index });
    }
  }

  // 【2】用 clip 圈定范围，进行局部绘制
  // 范围为上一次的位置到当前位置，所形成的矩形

  ctx.save();
  const tf = ctx.getTransform();
  // 1. 重置 transform
  ctx.resetTransform();
  // 2. 自己算视口坐标下的矩形
  const minPt = viewMatrix.apply({ x: dirtyBox.x, y: dirtyBox.y });
  const maxPt = viewMatrix.apply({
    x: dirtyBox.x + dirtyBox.width,
    y: dirtyBox.y + dirtyBox.height,
  });
  dirtyBox = {
    x: Math.min(minPt.x, maxPt.x),
    y: Math.min(minPt.y, maxPt.y),
    width: Math.abs(maxPt.x - minPt.x),
    height: Math.abs(maxPt.y - minPt.y),
  };

  // 3. 修正，丢掉小数点
  dirtyBox.x = Math.floor(dirtyBox.x);
  dirtyBox.y = Math.floor(dirtyBox.y);
  dirtyBox.width = Math.ceil(dirtyBox.width);
  dirtyBox.height = Math.ceil(dirtyBox.height);

  // 4. 挖空脏矩形
  ctx.clearRect(dirtyBox.x, dirtyBox.y, dirtyBox.width, dirtyBox.height);

  ctx.beginPath();
  ctx.rect(dirtyBox.x, dirtyBox.y, dirtyBox.width, dirtyBox.height);
  // 你可以取消这个注释，看看脏矩形范围
  // ctx.stroke();
  ctx.clip();
  // 只绘制被碰撞的绿球

  // 5. 恢复 transform
  ctx.setTransform(tf);
  drawGreenBalls(collisions);
  // 再画红球
  drawRedBall(targetX, targetY);
  ctx.restore();
}

/********** 一些图形学算法 ***********/

/**
 * 矩形是否相交
 */
function isRectIntersect(rect1, rect2) {
  return (
    rect1.x <= rect2.x + rect2.width &&
    rect1.x + rect1.width >= rect2.x &&
    rect1.y <= rect2.y + rect2.height &&
    rect1.height + rect1.y >= rect2.y
  );
}

/**
 * 计算多个圆形组成的包围盒
 */
function getCircleBBox(...circles) {
  const rects = circles.map((circle) => {
    const { x, y, radius } = circle;
    const d = radius * 2;
    const padding = 2;
    return {
      x: x - radius - padding,
      y: y - radius - padding,
      width: d + padding * 2,
      height: d + padding * 2,
    };
  });
  return getRectBBox(...rects);
}

/**
 * 求多个矩形组成的包围盒
 */
function getRectBBox(...rects) {
  const first = rects[0];
  let x = first.x;
  let y = first.y;
  let x2 = x + first.width;
  let y2 = y + first.height;
  for (let i = 1, len = rects.length; i < len; i++) {
    const rect = rects[i];
    if (rect.x < x) {
      x = rect.x;
    }
    if (rect.y < y) {
      y = rect.y;
    }
    const _x2 = rect.x + rect.width;
    if (_x2 > x2) {
      x2 = _x2;
    }
    const _y2 = rect.y + rect.height;
    if (_y2 > y2) {
      y2 = _y2;
    }
  }
  return {
    x,
    y,
    width: x2 - x,
    height: y2 - y,
  };
}

canvas.addEventListener('mousemove', (e) => {
  const x = e.clientX;
  const y = e.clientY;

  const pt = viewMatrix.applyInverse({ x, y });

  // 全部重渲染（性能很差）
  // drawScene(pt.x, pt.y);

  // 局部重渲染（性能好）
  partRender(pt.x, pt.y);
});

/****** 缩放画布逻辑 ****/
let viewMatrix = new Matrix();
const zoomStep = 0.2325;

const getScaleFromMatrix = (m) => {
  const { a, b } = m;
  return Math.sqrt(a * a + b * b);
};

const matrixToArr = (m) => {
  return [m.a, m.b, m.c, m.d, m.tx, m.ty];
};

canvas.addEventListener('wheel', (event) => {
  let isZoomOut = event.deltaY > 0;
  const zoom = getScaleFromMatrix(viewMatrix);
  let newZoom;
  if (isZoomOut) {
    newZoom = zoom / (1 + zoomStep);
  } else {
    newZoom = zoom * (1 + zoomStep);
  }
  const deltaZoom = newZoom / zoom;
  viewMatrix
    .translate(-event.clientX, -event.clientY)
    .scale(deltaZoom, deltaZoom)
    .translate(event.clientX, event.clientY);

  document.querySelector('#info').innerText = `zoom: ${newZoom.toFixed(
    6,
  )}, tx: ${viewMatrix.tx.toFixed(6)}, ty: ${viewMatrix.ty.toFixed(6)}`;

  drawScene(prevRedBall.x, prevRedBall.y);
});

// 全量渲染
function drawScene(x, y) {
  ctx.resetTransform();
  ctx.clearRect(0, 0, canvasWidth, canvasHeight);
  ctx.setTransform(
    viewMatrix.a,
    viewMatrix.b,
    viewMatrix.c,
    viewMatrix.d,
    viewMatrix.tx,
    viewMatrix.ty,
  );
  drawGreenBalls(greenBalls);
  drawRedBall(x, y);
}

// 初次渲染
drawScene(100, 100);

document.querySelector(
  '#info',
).innerText = `zoom: 1, tx: ${viewMatrix.tx.toFixed(
  6,
)}, ty: ${viewMatrix.ty.toFixed(6)}`;
