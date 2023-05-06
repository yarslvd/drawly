import { Point } from "framer-motion";
import { CanvasClass } from "../Canvas";
import { Shape } from "./Shape";

export class BrushPoint extends Shape {
  point: Point;
  brushSize: number;
  brushColor: string;

  onDraw(): void {
    const ctx = this.canvas.getContext2D();
    if (ctx == null) {
      return;
    }
    
    ctx.strokeStyle = this.brushColor;
    ctx.beginPath();
    
    ctx.arc(this.point.x, this.point.y, this.brushSize / 2, 0, 2 * Math.PI);
    ctx.fill();
  }

  isPointInside(point: Point): boolean {
    return false;
  }

  constructor(canvas: CanvasClass, point: Point, size: number, color: string) {
    super(canvas);

    this.point = point;
    this.brushSize = size;
    this.brushColor = color;
  }
}