import { Point } from "framer-motion";
import { CanvasClass } from "../Canvas";
import { Shape } from "./Shape";

export class Line extends Shape {
  start: Point;
  end: Point;

  lineWidth: number = this.canvas.width;

  onDraw(): void {
    const ctx = this.canvas.getContext2D();
    if (ctx == null) {
      return;
    }

    this.handleBorderPoints(this.start);
    this.handleBorderPoints(this.end);

    ctx.beginPath();
    console.log(this);
    ctx.lineWidth = this.lineWidth;
    ctx.strokeStyle = this.canvas.color;
    ctx.moveTo(this.start.x, this.start.y);
    ctx.lineTo(this.end.x, this.end.y);
    ctx.stroke();
  }

  isPointInside(point: Point): boolean {
    const ctx = this.canvas.getContext2D();
    if (ctx == null) {
      return false;
    }

    const distance = this.distanceToPoint(point, this.start, this.end);
    return distance <= this.lineWidth;
  }

  distanceToPoint(point: Point, start: Point, end: Point): number {
    const { x: px, y: py } = point;
    const { x: x1, y: y1 } = start;
    const { x: x2, y: y2 } = end;

    const dx = x2 - x1;
    const dy = y2 - y1;

    const lengthSquared = dx * dx + dy * dy;
    if (lengthSquared === 0) {
      return Math.sqrt((px - x1) * (px - x1) + (py - y1) * (py - y1));
    }

    const t = ((px - x1) * dx + (py - y1) * dy) / lengthSquared;
    const projectionX = x1 + t * dx;
    const projectionY = y1 + t * dy;

    return Math.sqrt(
      (px - projectionX) * (px - projectionX) +
        (py - projectionY) * (py - projectionY)
    );
  }

  constructor(canvas: CanvasClass, start: Point, end: Point) {
    super(canvas);

    this.start = start;
    this.end = end;
  }
}
