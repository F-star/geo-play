const canvas = document.querySelector('canvas')!;
const ctx = canvas.getContext('2d')!;

const rect = {
  x: 10,
  y: 10,
  width: 200,
  height: 200,
};

const drawLinearGradient = () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // 创建线性渐变
  const linearGradient = ctx.createLinearGradient(
    rect.x,
    rect.y,
    rect.x + rect.width,
    rect.y + rect.height,
  );
  linearGradient.addColorStop(0, 'red');
  linearGradient.addColorStop(0.5, 'green');
  linearGradient.addColorStop(1, 'blue');

  // 使用渐变填充矩形
  ctx.fillStyle = linearGradient;
  ctx.fillRect(rect.x, rect.y, rect.width, rect.height);
};

drawLinearGradient();
