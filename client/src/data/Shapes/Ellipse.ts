import { Point } from "framer-motion";
import { CanvasClass } from "../Canvas";
import { Shape } from "./Shape";

export class Ellipse extends Shape {
  start: Point;

  width: number;
  height: number;

  borderWidth: number;

  onDraw(): void {
    const ctx = this.canvas.getContext2D();
    if (ctx == null) {
      return;
    }

    ctx.lineWidth = this.borderWidth;
    ctx.beginPath();
    ctx.ellipse(
      this.start.x,
      this.start.y,
      Math.abs(this.width),
      Math.abs(this.height),
      0,
      0,
      2 * Math.PI
    );
    ctx.fillStyle = "black";
    ctx.fill();
  }

  isPointInside(point: Point): boolean {
    return false;
  }

  constructor(
    canvas: CanvasClass,
    start: Point,
    width: number,
    height: number,
    borderWidth: number
  ) {
    super(canvas);

    this.start = start;
    this.width = width;
    this.height = height;

    this.borderWidth = borderWidth;
  }
}
