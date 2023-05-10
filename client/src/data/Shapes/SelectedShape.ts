import { Point } from "framer-motion";
import { CanvasClass } from "../Canvas";
import { Shape } from "./Shape";

export class SelectedShape extends Shape {
  private width: number = 0;
  private height: number = 0;

  borderWidth: number;

  drawCircle(
    ctx: CanvasRenderingContext2D,
    center: Point,
    radius: number,
    color: string
  ): void {
    ctx.beginPath();
    ctx.arc(center.x, center.y, radius, 0, 2 * Math.PI);
    ctx.fillStyle = color;
    ctx.fill();
  }

  onDraw(): void {
    console.log(this);
    const ctx = this.canvas.getContext2D();
    if (ctx == null) {
      return;
    }

    this.width = this.rightBottom.x - this.leftTop.x;
    this.height = this.rightBottom.y - this.leftTop.y;

    ctx.lineWidth = this.borderWidth;

    ctx.strokeRect(this.leftTop.x, this.leftTop.y, this.width, this.height);
    console.log(this);

    this.drawCircle(ctx, { x: this.leftTop.x, y: this.leftTop.y }, 10, "black");
    this.drawCircle(
      ctx,
      { x: this.rightBottom.x, y: this.leftTop.y },
      10,
      "black"
    );
    this.drawCircle(
      ctx,
      { x: this.rightBottom.x, y: this.rightBottom.y },
      10,
      "black"
    );
    this.drawCircle(
      ctx,
      { x: this.leftTop.x, y: this.rightBottom.y },
      10,
      "black"
    );
  }

  isPointInside(point: Point): boolean {
    const start = this.leftTop;

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

  constructor(canvas: CanvasClass, borderWidth: number) {
    super(canvas);

    this.borderWidth = borderWidth;
  }
}
