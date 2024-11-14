const rect = {
  x: 100,
  y: 100,
  width: 200,
  height: 200,
};
const opacity = 0.5;

const draw = () => {
  const canvas = document.querySelector('canvas') as HTMLCanvasElement;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = '#00ff00';
  ctx.fillRect(100, 100, 200, 200);

  const tmpCanvas = createTmpCanvas();

  ctx.globalAlpha = opacity;
  ctx.drawImage(tmpCanvas, rect.x, rect.y);
};

const createTmpCanvas = () => {
  const canvas = document.createElement('canvas');
  canvas.width = 500;
  canvas.height = 500;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = '#ff000099';
  ctx.strokeStyle = 'black';
  ctx.lineWidth = 20;

  ctx.beginPath();
  ctx.rect(100, 100, 200, 150);
  ctx.fill();
  ctx.stroke();

  return canvas;
};

draw();
