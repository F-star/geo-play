import { Application, Graphics, Matrix } from 'pixi.js';

interface TransformableObject {
  position: PointData;
  scale: PointData;
  pivot: PointData;
  skew: PointData;
  rotation: number;
}

interface PointData {
  x: number;
  y: number;
}

const tfObj: TransformableObject = {
  position: { x: 50, y: 50 },
  scale: { x: 1, y: 1 },
  pivot: { x: 0, y: 0 },
  skew: { x: Math.PI / 3, y: -Math.PI / 3 },
  rotation: 0, // Math.PI / 6,
};

(async () => {
  // Create a new application
  const app = new Application();

  // Initialize the application
  await app.init({ antialias: true, width: 300, height: 300 });

  // Append the application canvas to the document body
  document.body.appendChild(app.canvas);

  const graphics = new Graphics();

  // Rectangle + line style 1
  graphics.rect(0, 0, 100, 100);
  graphics.fill(0xde3249);
  graphics.stroke({ width: 2, color: 0xfeeb77 });

  graphics.scale.set(tfObj.scale.x, tfObj.scale.y);
  graphics.skew.set(tfObj.skew.x, tfObj.skew.y);
  graphics.pivot.set(tfObj.pivot.x, tfObj.pivot.y);
  graphics.position.set(tfObj.position.x, tfObj.position.y);
  graphics.rotation = tfObj.rotation;

  console.log(graphics.position.x, graphics.position.y);

  app.stage.addChild(graphics);
})();

const transformToMatrix = (tf: TransformableObject) => {
  const cosX = Math.cos(tf.rotation + tf.skew.y);
  const sinX = Math.sin(tf.rotation + tf.skew.y);
  const cosY = -Math.sin(tf.rotation - tf.skew.x);
  const sinY = Math.cos(tf.rotation - tf.skew.x);

  const skewMatrix = new Matrix(cosX, sinX, cosY, sinY, 0, 0);

  const matrix = new Matrix()
    .translate(-tf.pivot.x, -tf.pivot.y)
    .scale(tf.scale.x, tf.scale.y)
    .prepend(skewMatrix)
    .translate(tf.position.x, tf.position.y);
  return matrix;
};

(async () => {
  // Create a new application
  const app = new Application();

  // Initialize the application
  await app.init({ antialias: true, width: 300, height: 300 });

  // Append the application canvas to the document body
  document.body.appendChild(app.canvas);

  const graphics = new Graphics();

  // Rectangle + line style 1
  graphics.rect(0, 0, 100, 100);
  graphics.fill(0xde3249);
  graphics.stroke({ width: 2, color: 0xfeeb77 });

  //   graphics.rotation = Math.PI / 6;
  const matrix = transformToMatrix(tfObj);
  console.log('matrix', matrix.toString());
  graphics.setFromMatrix(matrix);

  app.stage.addChild(graphics);
})();

// const leftMatrix = new Matrix();
// const rightMatrix = new Matrix();

// // 右乘
// const newMatrix = leftMatrix.append(rightMatrix);

// // 左乘
// const newMatrix2 = rightMatrix.prepend(leftMatrix);

// // 逆矩阵
// const inverseMatrix = leftMatrix.invert();

const matrix = new Matrix();
// 点应用矩阵后的结果
const point = matrix.apply({ x: 100, y: 100 });

// 应用逆矩阵的结果
const inversePoint = matrix.applyInverse({ x: 100, y: 100 });
