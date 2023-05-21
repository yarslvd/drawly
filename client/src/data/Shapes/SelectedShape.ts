import { Point } from "framer-motion";
import { CanvasClass } from "../Canvas";
import { Shape } from "./Shape";
import { Line } from "./Line";
import { Rectangle } from "./Rectangle";

interface Circle {
  center: Point;
  radius: number;
}

export class SelectedShape extends Shape {
  private width: number = 0;
  private height: number = 0;
  private color: string = "#72bac2";

  private circles: Circle[] = [];
  private selectedCircle: Circle | null = null;

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

    this.circles.push({ center, radius });
  }

  onDraw(): void {
    console.log(this);
    this.circles = [];
    const ctx = this.canvas.getContext2D();
    if (ctx == null || this.canvas.selectedShape == null) {
      return;
    }

    this.width = this.rightBottom.x - this.leftTop.x;
    this.height = this.rightBottom.y - this.leftTop.y;

    ctx.lineWidth = this.borderWidth;

    if (this.canvas.selectedShape instanceof Line) {
      const line = this.canvas.selectedShape as Line;
      this.drawCircle(ctx, line.start, 4, this.color);
      this.drawCircle(ctx, line.end, 4, this.color);
      return;
    }

    ctx.strokeRect(this.leftTop.x, this.leftTop.y, this.width, this.height);
    ctx.strokeStyle = this.color;
    console.log(this);

    this.drawCircle(
      ctx,
      { x: this.leftTop.x, y: this.leftTop.y },
      4,
      this.color
    );
    this.drawCircle(
      ctx,
      { x: this.rightBottom.x, y: this.leftTop.y },
      4,
      this.color
    );
    this.drawCircle(
      ctx,
      { x: this.rightBottom.x, y: this.rightBottom.y },
      4,
      this.color
    );
    this.drawCircle(
      ctx,
      { x: this.leftTop.x, y: this.rightBottom.y },
      4,
      this.color
    );
  }

  isPointInside(point: Point): boolean {
    return false;
  }

  isPointOnCircle(point: Point): number {
    console.log("isPointOnCircle");
    this.selectedCircle = null;
    for (let i = 0; i < this.circles.length; i++) {
      const distance = Math.sqrt(
        Math.pow(point.x - this.circles[i].center.x, 2) +
          Math.pow(point.y - this.circles[i].center.y, 2)
      );

      if (distance < this.circles[i].radius) {
        this.selectedCircle = this.circles[i];
        return i;
      }
    }

    return -1;
  }

  movedPoint: Point | null = null;

  handleResize(point: Point) {
    if (!this.selectedCircle) {
      return;
    }
    const shape = this.canvas.selectedShape;
    const center = this.selectedCircle?.center;
    switch (true) {
      case shape instanceof Line: {
        const line = shape as Line;
        if (line.start.x == center.x && line.start.y == center.y) {
          this.movedPoint = line.start;
        } else {
          this.movedPoint = line.end;
        }

        this.movedPoint.x = point.x;
        this.movedPoint.y = point.y;

        this.canvas.redrawCanvas();

        break;
      }
      case shape instanceof Rectangle: {
        const rect = shape as Rectangle;

        // Determine which corner of the rectangle is being resized
        const topLeft = rect.leftTop;
        const topRight = { x: rect.rightBottom.x, y: rect.leftTop.y };
        const bottomRight = rect.rightBottom;
        const bottomLeft = { x: rect.leftTop.x, y: rect.rightBottom.y };

        if (center.x === topLeft.x && center.y === topLeft.y) {
          rect.start.x = point.x;
          rect.start.y = point.y;
          rect.leftTop.x = point.x;
          rect.leftTop.y = point.y;
          rect.width -= topLeft.x - point.x;
          console.log("leftTop");
          rect.height += topLeft.y - point.y;
        } else if (center.x === topRight.x && center.y === topRight.y) {
          rect.start.y = point.y;
          rect.width += topRight.x - point.x;
          rect.height += topRight.y - point.y;
        } else if (center.x === bottomRight.x && center.y === bottomRight.y) {
          rect.width += bottomRight.x - point.x;
          rect.height += bottomRight.y - point.y;
        } else if (center.x === bottomLeft.x && center.y === bottomLeft.y) {
          rect.start.x = point.x;
          rect.width += bottomLeft.x - point.x;
          rect.height += bottomLeft.y - point.y;
        }
        this.canvas.redrawCanvas();

        break;
      }
    }
  }

  onMouseUp() {
    this.selectedCircle = null;
  }

  constructor(canvas: CanvasClass, borderWidth: number) {
    super(canvas);

    this.borderWidth = 2;
  }
}

function getVec(coord1: number, coord2: number) {
  return coord1 > coord2 ? -1 : 1;
}
