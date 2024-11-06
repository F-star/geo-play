import { distance } from '../../geo';
import { Point } from '../../type';
import { quadraticBezierToCubic } from './utils';

const canvas = document.querySelector('canvas')!;
const ctx = canvas.getContext('2d')!;

// 二阶贝塞尔曲线控制点
const q0 = { x: 100, y: 100 };
const q1 = { x: 200, y: 300 };
const q2 = { x: 300, y: 100 };

const draw = () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // 绘制二阶贝塞尔曲线
  ctx.beginPath();
  ctx.moveTo(q0.x, q0.y);
  ctx.quadraticCurveTo(q1.x, q1.y, q2.x, q2.y);
  // 半透明
  ctx.strokeStyle = 'rgba(255, 0, 0, 0.5)';
  ctx.lineWidth = 6;
  ctx.stroke();

  // 绘制三阶贝塞尔曲线
  const [c0, c1, c2, c3] = quadraticBezierToCubic(q0, q1, q2);
  ctx.beginPath();
  ctx.moveTo(c0.x, c0.y);
  ctx.bezierCurveTo(c1.x, c1.y, c2.x, c2.y, c3.x, c3.y);
  ctx.strokeStyle = '#000';
  ctx.lineWidth = 1;
  ctx.stroke();

  // 绘制起点和终点
  drawPoint(q0, '#000');
  drawPoint(q2, '#000');

  // 绘制二阶贝塞尔的 q1 控制点
  drawLine(q0, q1, 'rgba(0, 0, 255, 0.5)');
  drawLine(q1, q2, 'rgba(0, 0, 255, 0.5)');
  drawPoint(q1, 'rgba(0, 0, 255, 0.5)');

  // 绘制三阶贝塞尔的 c1、c2 控制点
  drawLine(c0, c1, 'rgba(0, 255, 0, 0.5)');
  drawPoint(c1, 'rgba(0, 255, 0, 0.5)');
  drawLine(c2, c3, 'rgba(0, 255, 0, 0.5)');
  drawPoint(c2, 'rgba(0, 255, 0, 0.5)');
};

const drawPoint = (pt: Point, color: string) => {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(pt.x, pt.y, 5, 0, Math.PI * 2);
  ctx.fill();
};

const drawLine = (p0: Point, p1: Point, color: string) => {
  ctx.strokeStyle = color;
  ctx.beginPath();
  ctx.moveTo(p0.x, p0.y);
  ctx.lineTo(p1.x, p1.y);
  ctx.stroke();
};

draw();

canvas.addEventListener('mousedown', (e) => {
  const cursorPt = {
    x: e.clientX,
    y: e.clientY,
  };
  let movedPt: Point | null = null;
  [q0, q1, q2].some((p) => {
    if (distance(cursorPt, p) < 10) {
      movedPt = p;
      return true;
    }
  });

  if (!movedPt) return;

  const onMouseover = (e: MouseEvent) => {
    if (movedPt) {
      movedPt.x = e.clientX;
      movedPt.y = e.clientY;
    }
    draw();
  };
  const onMouseup = () => {
    window.removeEventListener('mousemove', onMouseover);
    window.removeEventListener('mouseup', onMouseup);
    movedPt = null;
  };

  window.addEventListener('mousemove', onMouseover);
  window.addEventListener('mouseup', onMouseup);
});

canvas.addEventListener('mousemove', (e) => {
  const cursorPt = {
    x: e.clientX,
    y: e.clientY,
  };
  for (const p of [q0, q1, q2]) {
    if (distance(cursorPt, p) < 10) {
      canvas.style.cursor = 'pointer';
      return true;
    }
  }
  canvas.style.cursor = '';
});
