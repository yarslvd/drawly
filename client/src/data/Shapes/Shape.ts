import { Point } from "framer-motion";
import { CanvasClass } from "../Canvas";

export abstract class Shape {
  canvas: CanvasClass;

  abstract onDraw(): void;

  abstract isPointInside(point: Point): boolean;

  constructor(canvas: CanvasClass) {
    this.canvas = canvas;
  }
}
