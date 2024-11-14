import { Leafer, Rect } from 'leafer-ui';

const main = () => {
  const leafer = new Leafer({
    view: 'stage',
    width: 500,
    height: 500,
  });

  const rect = new Rect({
    x: 100,
    y: 100,
    width: 200,
    height: 200,
    fill: '#d8d8d8',
    stroke: '#000',
    strokeWidth: 20,
    strokeAlign: 'center',
    opacity: 0.4,
  });

  leafer.add(rect);
};

main();
