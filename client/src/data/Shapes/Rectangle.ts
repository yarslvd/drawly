import { Point } from "framer-motion";
import { CanvasClass } from "../Canvas";
import { Shape } from "./Shape";

export class Rectangle extends Shape {
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
    ctx.strokeStyle = this.canvas.color;
    ctx.strokeRect(this.start.x, this.start.y, this.width, this.height);
  }

  isPointInside(point: Point): boolean {
    const start = this.start;

    const leftBoundary = start.x;
    const rightBoundary = start.x + this.width;
    const topBoundary = start.y;
    const bottomBoundary = start.y + this.height;

    const withinLeftBorder =
      point.x >= leftBoundary && point.x <= leftBoundary + this.borderWidth;
    const withinRightBorder =
      point.x >= rightBoundary - this.borderWidth && point.x <= rightBoundary;
    const withinTopBorder =
      point.y >= topBoundary && point.y <= topBoundary + this.borderWidth;
    const withinBottomBorder =
      point.y >= bottomBoundary - this.borderWidth && point.y <= bottomBoundary;

    return (
      withinLeftBorder ||
      withinRightBorder ||
      withinTopBorder ||
      withinBottomBorder
    );
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
