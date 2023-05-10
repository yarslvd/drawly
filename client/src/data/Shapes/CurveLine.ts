import { Point } from "framer-motion";
import { CanvasClass } from "../Canvas";
import { Shape } from "./Shape";

export class CurveLine extends Shape {
  points: Point[];

  lineWidth: number;
  lineColor: string;

  lineSize: number = 5;

  onDraw(): void {
    const ctx = this.canvas.getContext2D();
    if (this.points.length < 2 || ctx == null) {
      return;
    }

    const start = this.points[0];
    console.log(this.canvas);
    ctx.beginPath();
    ctx.lineWidth = this.lineWidth;
    ctx.strokeStyle = this.lineColor;
    ctx.moveTo(start.x, start.y);

    this.handleBorderPoints(start);

    for (let i = 1; i < this.points.length - 1; i++) {
      const point = this.points[i];
      const next = this.points[i + 1];
      const controlX = (point.x + next.x) / 2;
      const controlY = (point.y + next.y) / 2;
      ctx.quadraticCurveTo(point.x, point.y, controlX, controlY);
      this.handleBorderPoints(this.points[i]);
    }

    const end = this.points[this.points.length - 1];
    ctx.lineTo(end.x, end.y);
    this.handleBorderPoints(end);
    ctx.stroke();
  }

  isPointInside(point: Point): boolean {
    const ctx = this.canvas.getContext2D();
    if (ctx == null || this.points.length < 2) {
      return false;
    }
    console.log("CurveLine isPointInside");
    for (let i = 1; i < this.points.length; i++) {
      const startPoint = this.points[i - 1];
      const endPoint = this.points[i];

      const distance = this.distanceToLineSegment(point, startPoint, endPoint);

      if (distance <= this.lineSize) {
        return true;
      }
    }

    return false;
  }

  distanceToLineSegment(point: Point, start: Point, end: Point): number {
    const { x: px, y: py } = point;
    const { x: x1, y: y1 } = start;
    const { x: x2, y: y2 } = end;

    const dx = x2 - x1;
    const dy = y2 - y1;
    const t = ((px - x1) * dx + (py - y1) * dy) / (dx * dx + dy * dy);

    if (t <= 0) {
      return Math.sqrt((px - x1) * (px - x1) + (py - y1) * (py - y1));
    }
    if (t >= 1) {
      return Math.sqrt((px - x2) * (px - x2) + (py - y2) * (py - y2));
    }

    const projectionX = x1 + t * dx;
    const projectionY = y1 + t * dy;
    return Math.sqrt(
      (px - projectionX) * (px - projectionX) +
        (py - projectionY) * (py - projectionY)
    );
  }

  constructor(
    canvas: CanvasClass,
    points: Point[],
    lineWidth: number,
    lineColor: string
  ) {
    super(canvas);

    this.points = points;
    this.lineWidth = lineWidth;
    this.lineColor = lineColor;
  }
}
