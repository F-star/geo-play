import { Matrix } from 'pixi.js';

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

interface MatrixObj {
  a: number;
  b: number;
  c: number;
  d: number;
  tx: number;
  ty: number;
}

const transformToMatrix = (tf: TransformableObject) => {
  const matrix = new Matrix()
    .translate(-tf.pivot.x, -tf.pivot.y)
    .scale(tf.scale.x, tf.scale.y)
    .rotate(tf.rotation)
    .translate(tf.position.x, tf.position.y);
};
