import { Application, Graphics } from 'pixi.js';

const canvas = document.querySelector('canvas')!;

// 绘制一个矩形
const app = new Application();
await app.init({ canvas });

const graphics = new Graphics();
graphics.rect(10, 10, 100, 50).fill('#f04');

app.stage.addChild(graphics);

// graphics.getTransform();

// 创建一个 transform
