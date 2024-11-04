// 进行布尔运算测试的两个 path，多组。

import { IDrawParams } from './type';
import { ellipseToCubic } from './utils';

export const testData: IDrawParams['paths'] = [
  // 矩形和矩形
  {
    path1: [['M', 0, 0], ['L', 100, 0], ['L', 100, 100], ['L', 0, 100], ['Z']],
    path2: [
      ['M', 50, 50],
      ['L', 150, 50],
      ['L', 150, 150],
      ['L', 50, 150],
      ['Z'],
    ],
  },
  // 椭圆和圆形 (使用三阶贝塞尔曲线拟合)
  {
    path1: ellipseToCubic(60, 60, 80, 40),
    path2: ellipseToCubic(100, 50, 50, 50),
  },
];
