import { Point } from "framer-motion";
import { CanvasClass } from "../Canvas";

export abstract class Shape {
  canvas: CanvasClass;
  leftTop: Point;
  rightBottom: Point;

  name: string = "";

  abstract onDraw(): void;

  abstract isPointInside(point: Point): boolean;

  protected handleBorderPoints(point: Point) {
    if (point.x < this.leftTop.x) {
      this.leftTop.x = point.x;
    }
    if (point.y < this.leftTop.y) {
      this.leftTop.y = point.y;
    }
    if (point.x > this.rightBottom.x) {
      this.rightBottom.x = point.x;
    }
    if (point.y > this.rightBottom.y) {
      this.rightBottom.y = point.y;
    }
  }

  constructor(canvas: CanvasClass) {
    this.canvas = canvas;
    this.name = new.target.name;

    // kostil bleat
    this.leftTop = {
      x: this.canvas.canvasHTML?.width || 0,
      y: this.canvas.canvasHTML?.height || 0,
    };
    this.rightBottom = { x: 0, y: 0 };
  }
}
