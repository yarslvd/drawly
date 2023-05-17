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

    this.handleBorderPoints(start);

    for (let i = 1; i < this.points.length - 1; i++) {
      const point = this.points[i];
      const next = this.points[i + 1];
      const controlX = (point.x + next.x) / 2;
      const controlY = (point.y + next.y) / 2;
      ctx.quadraticCurveTo(point.x, point.y, controlX, controlY);
      this.handleBorderPoints(this.points[i]);

      this.curvePoints.push(point);
      this.curvePoints.push({ x: controlX, y: controlY });
      this.curvePoints.push(next);
    }

    const end = this.points[this.points.length - 1];
    ctx.lineTo(end.x, end.y);
    this.handleBorderPoints(end);
    ctx.stroke();
  }

  isPointInside(point: Point): boolean {
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

      const ctx = this.canvas.getContext2D();
      if (!ctx) return false;
      ctx.fillStyle = "black";
      ctx?.beginPath();

      ctx?.arc(p0p1.x, p0p1.y, 15 / 2, 0, 2 * Math.PI);
      ctx?.fill();

      ctx.closePath();

      //////////////////////////////////////////////

      // console.log({p0p1,p1,p1p2});

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

    const ctx = this.canvas.getContext2D();
    if (!ctx) return 0;

    ctx.strokeStyle = "black";

    for (let t = 0; t <= 1; t += step) {
      const x =
        Math.pow(1 - t, 2) * p0.x +
        2 * (1 - t) * t * p1.x +
        Math.pow(t, 2) * p2.x;
      const y =
        Math.pow(1 - t, 2) * p0.y +
        2 * (1 - t) * t * p1.y +
        Math.pow(t, 2) * p2.y;

      const ctx = this.canvas.getContext2D();

      // ctx?.beginPath();

      // ctx?.arc(x1, y1, 15 / 2, 0, 2 * Math.PI);
      // ctx?.fill();

      // ctx?.closePath();
      // ctx?.beginPath();

      // ctx?.arc(x2, y2, 15 / 2, 0, 2 * Math.PI);
      // ctx?.fill();

      // ctx?.closePath();
      ctx?.beginPath();

      ctx?.arc(x, y, 15 / 2, 0, 2 * Math.PI);
      ctx?.fill();
      ctx?.closePath();

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

  // export class CurveLine extends Shape {
  //   points: Point[];

  //   lineWidth: number;
  //   lineColor: string;

  //   lineSize: number = 5;

  //   onDraw(): void {
  //     const ctx = this.canvas.getContext2D();
  //     if (this.points.length < 2 || ctx == null) {
  //       return;
  //     }

  //     const start = this.points[0];
  //     console.log(this.canvas);
  //     ctx.beginPath();
  //     ctx.lineWidth = this.lineWidth;
  //     ctx.strokeStyle = this.lineColor;
  //     ctx.moveTo(start.x, start.y);

  //     this.handleBorderPoints(start);

  //     for (let i = 1; i < this.points.length - 1; i+=2) {
  //       const point = this.points[i];
  //       const next = this.points[i + 1];

  //       ctx.quadraticCurveTo(point.x, point.y, next.x, next.y);
  //       this.handleBorderPoints(this.points[i]);
  //     }

  //     const end = this.points[this.points.length - 1];
  //     ctx.lineTo(end.x, end.y);
  //     this.handleBorderPoints(end);
  //     ctx.stroke();
  //   }

  //   isPointInside(point: Point): boolean {
  //     this.isPointInsideProm(point)
  //     return false;
  //   }

  //   async isPointInsideProm(point: Point): Promise<boolean> {
  //     const { x: px, y: py } = point;

  //     for (let i = 0; i < this.points.length - 2; i+=2) {
  //       const p0 = this.points[i];
  //       const p1 = this.points[i + 1];
  //       const controlX = (p0.x + p1.x) / 2;
  //       const controlY = (p0.y + p1.y) / 2;

  //       const p2 = this.points[i + 2]

  //       const ctx = this.canvas.getContext2D();

  //           ctx?.beginPath();

  //       ctx?.arc(controlX, controlY, 15 / 2, 0, 2 * Math.PI);
  //       ctx?.fill();

  //       const distanceToCurve = await this.distanceToCurveLineSegment(point, p0,  p1, p2);

  //       if (distanceToCurve <= 10) {
  //         return true;
  //       }
  //     }

  //     const len = this.points.length;

  //     const p0 = this.points[len - 3];
  //       const p1 = this.points[len - 2];
  //       const controlX = (p0.x + p1.x) / 2;
  //       const controlY = (p0.y + p1.y) / 2;

  //       const p2 = this.points[len - 1]

  //       const ctx = this.canvas.getContext2D();

  //           ctx?.beginPath();

  //       ctx?.arc(controlX, controlY, 15 / 2, 0, 2 * Math.PI);
  //       ctx?.fill();

  //       const distanceToCurve = await this.distanceToCurveLineSegment(point, p0,  p1, p2);

  //       if (distanceToCurve <= 10) {
  //         return true;
  //       }

  //     return false;
  //   }

  //   async distanceToCurveLineSegment(point: Point, p0: Point, p1: Point, p2: Point): number {
  //     const precision = 100;
  //     const step = 1 / precision;
  //     let minDistance = Infinity;

  //     function sleep(ms) {
  //       return new Promise(resolve => setTimeout(resolve, ms));
  //   }

  //   const controlP0P1 = {x:(p0.x + p1.x) / 2, y:(p0.y + p1.y) / 2};
  //   const controlP1P2 = {x:(p1.x + p2.x) / 2, y:(p1.y + p2.y) / 2};

  //     const ctx = this.canvas.getContext2D();
  //     if(!ctx) return 0;

  //     ctx.strokeStyle = "black";

  //     for (let t = 0; t <= 1; t += step) {
  //       const x1 = Math.pow(1 - t, 2) * p0.x + 2 * (1 - t) * t * controlP0P1.x + Math.pow(t, 2) * p1.x;
  //       const y1 = Math.pow(1 - t, 2) * p0.y + 2 * (1 - t) * t * controlP0P1.y + Math.pow(t, 2) * p1.y;

  //       const x2 = Math.pow(1 - t, 2) * p1.x + 2 * (1 - t) * t * controlP1P2.x + Math.pow(t, 2) * p2.x;
  //       const y2 = Math.pow(1 - t, 2) * p1.y + 2 * (1 - t) * t * controlP1P2.y + Math.pow(t, 2) * p2.y;

  //       const dx = x2 - x1;
  //       const dy = y2 - y1;

  //       const length = Math.sqrt(dx * dx + dy * dy);

  //       const quarterLength = length * t;

  //       const x = x1 + (dx / length) * quarterLength;
  //       const y = y1 + (dy / length) * quarterLength;

  //       const ctx = this.canvas.getContext2D();

  //       ctx?.beginPath();

  //       ctx?.arc(x1, y1, 15 / 2, 0, 2 * Math.PI);
  //       ctx?.fill();

  //       ctx?.closePath();
  //       ctx?.beginPath();

  //       ctx?.arc(x2, y2, 15 / 2, 0, 2 * Math.PI);
  //       ctx?.fill();

  //       ctx?.closePath();
  //       ctx?.beginPath();

  //       ctx?.arc(x, y, 15 / 2, 0, 2 * Math.PI);
  //       ctx?.fill();
  //       ctx?.closePath();

  //       await sleep(50);
  //       const distance = Math.sqrt(Math.pow(point.x - x, 2) + Math.pow(point.y - y, 2));
  //       console.log({distance})
  //       if (distance < minDistance) {
  //         minDistance = distance;
  //       }
  //     }

  //     return minDistance;
  //   }

  //   constructor(
  //     canvas: CanvasClass,
  //     points: Point[],
  //     lineWidth: number,
  //     lineColor: string
  //   ) {
  //     super(canvas);

  //     this.points = points;
  //     this.lineWidth = lineWidth;
  //     this.lineColor = lineColor;
  //   }
  // }

  // isPointInside(point: Point): boolean {
  //   const ctx = this.canvas.getContext2D();
  //   if (ctx == null || this.points.length < 2) {
  //     return false;
  //   }
  //   console.log("CurveLine isPointInside");
  //   for (let i = 1; i < this.points.length; i++) {
  //     const startPoint = this.points[i - 1];
  //     const endPoint = this.points[i];

  //     const distance = this.distanceToLineSegment(point, startPoint, endPoint);

  //     if (distance <= this.lineSize) {
  //       return true;
  //     }
  //   }

  //   return false;
  // }

  // distanceToLineSegment(point: Point, start: Point, end: Point): number {
  //   const { x: px, y: py } = point;
  //   const { x: x1, y: y1 } = start;
  //   const { x: x2, y: y2 } = end;

  //   const dx = x2 - x1;
  //   const dy = y2 - y1;
  //   const t = ((px - x1) * dx + (py - y1) * dy) / (dx * dx + dy * dy);

  //   if (t <= 0) {
  //     return Math.sqrt((px - x1) * (px - x1) + (py - y1) * (py - y1));
  //   }
  //   if (t >= 1) {
  //     return Math.sqrt((px - x2) * (px - x2) + (py - y2) * (py - y2));
  //   }

  //   const projectionX = x1 + t * dx;
  //   const projectionY = y1 + t * dy;
  //   return Math.sqrt(
  //     (px - projectionX) * (px - projectionX) +
  //       (py - projectionY) * (py - projectionY)
  //   );
  // }

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
