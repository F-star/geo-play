import InitCanvasKit from "canvaskit-wasm/bin/canvaskit.js";
// @ts-ignore
import CanvasKitWasm from "canvaskit-wasm/bin/canvaskit.wasm?url";

// 文档：https://skia.org/docs/user/api/skblendmode_overview/
// 在线 demo：https://fiddle.skia.org/c/@BlendModes

const draw = async () => {
  const CanvasKit = await InitCanvasKit({
    locateFile: () => CanvasKitWasm,
  });

  const canvas = document.getElementById("stage") as HTMLCanvasElement;
  const surface = CanvasKit.MakeWebGLCanvasSurface(canvas)!;

  const paint1 = new CanvasKit.Paint();
  paint1.setColor(CanvasKit.Color4f(1, 0, 0, 1));

  const paint2 = new CanvasKit.Paint();
  paint2.setColor(CanvasKit.Color4f(0, 1, 0, 1));
  paint2.setBlendMode(CanvasKit.BlendMode.Difference);


  const rect1 =  CanvasKit.XYWHRect(100, 100, 100, 100);
  const rect2 =  CanvasKit.XYWHRect(150, 150, 100, 100);

  surface.drawOnce(canvas => {
    canvas.clear(CanvasKit.WHITE);

    canvas.drawRRect(rect1, paint1);
    canvas.drawRRect(rect2, paint2);
  });
};

draw();
