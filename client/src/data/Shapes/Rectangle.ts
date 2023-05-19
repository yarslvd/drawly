import { Point } from "framer-motion";
import { CanvasClass } from "../Canvas";
import { Shape } from "./Shape";

export class Rectangle extends Shape {
  start: Point;

  width: number;
  height: number;

  borderWidth: number;
  color: string;

  isFilled: boolean;

  radius: number = 50;

  onDraw(): void {
    const ctx = this.canvas.getContext2D();
    if (ctx == null) {
      return;
    }

    if (this.radius != 0) {
      ctx.beginPath();
      ctx.roundRect(
        this.start.x,
        this.start.y,
        this.width,
        this.height,
        this.radius
      );
      ctx.closePath();
      ctx.stroke();
      ctx.fill();

      return;
    }

    ctx.lineWidth = this.borderWidth;
    ctx.strokeStyle = this.color;
    ctx.strokeRect(this.start.x, this.start.y, this.width, this.height);

    if (this.isFilled) {
      ctx.fillRect(this.start.x, this.start.y, this.width, this.height);
    }
  }

  isPointInside(point: Point): boolean {
    if (!this.isFilled) {
      return this.isPointInsideBorder(point);
    }

    const { x, y } = point;

    if (
      x >= this.leftTop.x &&
      x <= this.rightBottom.x &&
      y >= this.leftTop.y &&
      y <= this.rightBottom.y
    )
      return true;
    else {
      return this.isPointInsideBorder(point);
    }
  }

  isPointInsideBorder(point: Point): boolean {
    const start = this.start;

    const leftBoundary = start.x;
    const rightBoundary = start.x + this.width;
    const topBoundary = start.y;
    const bottomBoundary = start.y + this.height;

    const borderOffset = this.borderWidth / 2;

    const withinLeftBorder =
      point.x >= leftBoundary - borderOffset &&
      point.x <= leftBoundary + borderOffset;
    const withinRightBorder =
      point.x >= rightBoundary - borderOffset &&
      point.x <= rightBoundary + borderOffset;
    const withinTopBorder =
      point.y >= topBoundary && point.y <= topBoundary + borderOffset;
    const withinBottomBorder =
      point.y >= bottomBoundary - borderOffset &&
      point.y <= bottomBoundary + borderOffset;

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
    borderWidth: number,
    color: string
  ) {
    super(canvas);

    this.start = start;
    this.width = width;
    this.height = height;

    this.borderWidth = borderWidth;
    this.color = color;

    this.leftTop = start;
    this.rightBottom = { x: start.x + width, y: start.y + height };

    this.isFilled = true;
  }
}
