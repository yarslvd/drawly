import { Point } from "framer-motion";
import { CanvasClass } from "../Canvas";
import { Shape } from "./Shape";

export class CurveLine extends Shape {
  points: Point[];
  curvePoints: Point[] = [];

  lineWidth: number;
  lineColor: string;

  lineSize: number = 5;

  onDraw(): void {
    const ctx = this.canvas.getContext2D();
    if (this.points.length < 2 || ctx == null) {
      return;
    }

    this.curvePoints = [];

    const start = this.points[0];
    ctx.beginPath();
    ctx.lineWidth = this.lineWidth;
    ctx.strokeStyle = this.lineColor;
    ctx.moveTo(start.x, start.y);

    for (let i = 1; i < this.points.length - 1; i++) {
      const point = this.points[i];
      const next = this.points[i + 1];
      const controlX = (point.x + next.x) / 2;
      const controlY = (point.y + next.y) / 2;
      ctx.quadraticCurveTo(point.x, point.y, controlX, controlY);

      this.curvePoints.push(point);
      this.curvePoints.push({ x: controlX, y: controlY });
      this.curvePoints.push(next);
    }

    const end = this.points[this.points.length - 1];
    ctx.lineTo(end.x, end.y);

    ctx.stroke();
  }

  isPointInside(point: Point): boolean {
    this.calcBoundingBox();
    if (this.points.length < 2) {
      return false;
    }

    if (this.points.length == 2) {
      const distanceToLine = this.distanceToLineSegment(
        point,
        this.points[0],
        this.points[1]
      );
      if (distanceToLine <= 10) {
        return true;
      }

      return false;
    }

    let p0 = this.points[0];
    let p1 = this.points[1];
    let p2 = this.points[2];

    let distanceToCurve =
      p0 &&
      p1 &&
      this.curvePoints[1] &&
      this.distanceToCurveLineSegment(point, p0, p1, {
        x: (p2.x + p1.x) / 2,
        y: (p2.y + p1.y) / 2,
      });

    if (distanceToCurve <= 10) {
      return true;
    }

    for (let i = 1; i < this.points.length - 2; i++) {
      const p0 = this.points[i];
      const p1 = this.points[i + 1];
      const p2 = this.points[i + 2];

      const p0p1 = { x: (p0.x + p1.x) / 2, y: (p0.y + p1.y) / 2 };
      const p1p2 = { x: (p1.x + p2.x) / 2, y: (p1.y + p2.y) / 2 };

      //////////////////////////////////////////////

      // const ctx = this.canvas.getContext2D();
      // if (!ctx) return false;
      // ctx.fillStyle = "black";
      // ctx?.beginPath();

      // ctx?.arc(p0p1.x, p0p1.y, 20 / 2, 0, 2 * Math.PI);
      // ctx?.fill();

      // ctx.closePath();

      //////////////////////////////////////////////

      const distanceToCurve = this.distanceToCurveLineSegment(
        point,
        p0p1,
        p1,
        p1p2
      );
      if (distanceToCurve <= 10) {
        return true;
      }
    }

    const len = this.points.length;
    p0 = this.points[len - 2];
    p1 = this.points[len - 1];

    distanceToCurve =
      p0 &&
      p1 &&
      this.distanceToCurveLineSegment(
        point,
        { x: (p0.x + p1.x) / 2, y: (p0.y + p1.y) / 2 },
        { x: (p0.x + p1.x) / 2, y: (p0.y + p1.y) / 2 },
        p1
      );

    if (distanceToCurve <= 10) {
      return true;
    }

    return false;
  }

  distanceToCurveLineSegment(
    point: Point,
    p0: Point,
    p1: Point,
    p2: Point
  ): number {
    const precision = 100;
    const step = 1 / precision;
    let minDistance = Infinity;

    for (let t = 0; t <= 1; t += step) {
      const x =
        Math.pow(1 - t, 2) * p0.x +
        2 * (1 - t) * t * p1.x +
        Math.pow(t, 2) * p2.x;
      const y =
        Math.pow(1 - t, 2) * p0.y +
        2 * (1 - t) * t * p1.y +
        Math.pow(t, 2) * p2.y;

      // const ctx = this.canvas.getContext2D();
      // if (!ctx) return 0;

      // ctx.strokeStyle = "black";
      // ctx?.beginPath();

      // ctx?.arc(x1, y1, 15 / 2, 0, 2 * Math.PI);
      // ctx?.fill();

      // ctx?.closePath();
      // ctx?.beginPath();

      // ctx?.arc(x2, y2, 15 / 2, 0, 2 * Math.PI);
      // ctx?.fill();

      // ctx?.closePath();
      // ctx?.beginPath();

      // ctx?.arc(x, y, 15 / 2, 0, 2 * Math.PI);
      // ctx?.fill();
      // ctx?.closePath();

      const distance = Math.sqrt(
        Math.pow(point.x - x, 2) + Math.pow(point.y - y, 2)
      );
      console.log({ distance });
      if (distance < minDistance) {
        minDistance = distance;
      }
    }

    return minDistance;
  }

  distanceToLineSegment(point: Point, start: Point, end: Point): number {
    const { x: px, y: py } = point;
    const { x: x1, y: y1 } = start;
    const { x: x2, y: y2 } = end;

    const dx = x2 - x1;
    const dy = y2 - y1;

    const length = Math.sqrt(dx * dx + dy * dy);

    const directionX = dx / length;
    const directionY = dy / length;

    const vectorX = px - x1;
    const vectorY = py - y1;

    const dotProduct = vectorX * directionX + vectorY * directionY;

    const closestX = x1 + dotProduct * directionX;
    const closestY = y1 + dotProduct * directionY;

    const distance = Math.sqrt(
      (closestX - px) * (closestX - px) + (closestY - py) * (closestY - py)
    );

    return distance;
  }

  calcBoundingBox() {
    if (this.points.length < 2) {
      return;
    }
    this.handleBorderPoints(this.points[0]);

    const len = this.points.length;

    let p0 = this.points[0];
    let p1 = this.points[1];
    let p2 = this.points[2];

    let control = {
      x: (p2.x + p1.x) / 2,
      y: (p2.y + p1.y) / 2,
    };

    this.handleBoundingBoxSegment(p0, p1, control);

    for (let i = 1; i < this.points.length - 2; i++) {
      const p0 = this.points[i];
      const p1 = this.points[i + 1];
      const p2 = this.points[i + 2];

      const p0p1 = { x: (p0.x + p1.x) / 2, y: (p0.y + p1.y) / 2 };
      const p1p2 = { x: (p1.x + p2.x) / 2, y: (p1.y + p2.y) / 2 };

      this.handleBoundingBoxSegment(p0p1, p1, p1p2);
    }

    this.handleBorderPoints(this.points[len - 1]);
  }

  private handleBoundingBoxSegment(p0p1: Point, p1: Point, p1p2: Point) {
    const precision = 100;
    const step = 1 / precision;

    for (let t = 0; t <= 1; t += step) {
      const x =
        Math.pow(1 - t, 2) * p0p1.x +
        2 * (1 - t) * t * p1.x +
        Math.pow(t, 2) * p1p2.x;
      const y =
        Math.pow(1 - t, 2) * p0p1.y +
        2 * (1 - t) * t * p1.y +
        Math.pow(t, 2) * p1p2.y;

      this.handleBorderPoints({ x, y });
    }
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
