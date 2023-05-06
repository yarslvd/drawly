import { Point } from "framer-motion";
import { CanvasClass } from "../Canvas";
import { BrushPoint } from "./BrushPoint";
import { Shape } from "./Shape";

export class BrushLine extends Shape {
  points: Point[];
  brushSize: number;
  brushColor: string;

  onDraw(): void {
    const ctx = this.canvas.getContext2D();
    if (ctx == null) {
      return;
    }
    const points = this.points;

    // (new BrushPoint(this.canvas, point, this.brushSize, this.brushColor)).onDraw();
    ctx.strokeStyle = this.brushColor;
    ctx.lineWidth = this.brushSize;

    const point = this.points[0];
    ctx.beginPath();
    ctx.arc(point.x, point.y, this.brushSize / 2, 0, 2 * Math.PI);
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);

    for (let i = 1; i < this.points.length - 2; i++) {
      const xc = (points[i].x + points[i + 1].x) / 2;
      const yc = (points[i].y + points[i + 1].y) / 2;
      ctx.quadraticCurveTo(points[i].x, points[i].y, xc, yc);
    }

    ctx.lineTo(
      points[this.points.length - 1].x,
      points[this.points.length - 1].y
    );
    ctx.stroke();
  }

  isPointInside(point: Point): boolean {
    const tolerance = this.brushSize / 2;

    for (let i = 1; i < this.points.length; i++) {
      const startPoint = this.points[i - 1];
      const endPoint = this.points[i];

      const distance = this.distanceToLineSegment(point, startPoint, endPoint);

      if (distance <= tolerance) {
        return true;
      }
    }

    return false;
  }

  distanceToLineSegment(
    point: Point,
    startPoint: Point,
    endPoint: Point
  ): number {
    const dx = endPoint.x - startPoint.x;
    const dy = endPoint.y - startPoint.y;
    const lengthSquared = dx ** 2 + dy ** 2;

    if (lengthSquared === 0) {
      return Math.sqrt(
        (point.x - startPoint.x) ** 2 + (point.y - startPoint.y) ** 2
      );
    }

    const t =
      ((point.x - startPoint.x) * dx + (point.y - startPoint.y) * dy) /
      lengthSquared;
    const clampedT = Math.max(0, Math.min(1, t));
    const projectedX = startPoint.x + clampedT * dx;
    const projectedY = startPoint.y + clampedT * dy;

    const distanceToLine = Math.sqrt(
      (point.x - projectedX) ** 2 + (point.y - projectedY) ** 2
    );
    const distanceToSegment =
      (distanceToLine * Math.sqrt(lengthSquared)) /
      Math.sqrt(lengthSquared + 1);

    return distanceToSegment;
  }

  constructor(
    canvas: CanvasClass,
    points: Point[],
    size: number,
    color: string
  ) {
    super(canvas);

    this.points = points;
    this.brushSize = size;
    this.brushColor = color;
  }
}
