import { Point } from "framer-motion";
import { CanvasClass } from "../Canvas";
import { Shape } from "./Shape";

export class Line extends Shape {
  start: Point;
  end: Point;

  onDraw(): void {
    const ctx = this.canvas.getContext2D();
    if (ctx == null) {
      return;
    }
    
    ctx.beginPath();
    ctx.lineWidth = 5;
    ctx.strokeStyle = "#000";
    ctx.moveTo(this.start.x, this.start.y);
    ctx.lineTo(this.end.x, this.end.y);
    ctx.stroke();
  }

  isPointInside(point: Point): boolean {
    return false;
  }

  constructor(canvas: CanvasClass, start: Point, end: Point) {
    super(canvas);

    this.start = start;
    this.end = end;
  }
}