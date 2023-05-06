import { Brush, Line, Move, Rectangle } from "@/data/Tools";
import { Tools } from "@/data/Constants";
import { CanvasClass } from "@/data/Canvas";
import { Tool } from "@/data/ToolsClass";

export interface CanvasProps {
  tool: number;
  width: string;
  height: string;
}

export interface onDrawTypes {
  ctx: CanvasRenderingContext2D;
  point: { x: number; y: number };
  prevPoint: { x: number; y: number };
}

export interface drawLineTypes {
  start: { x: number; y: number };
  end: { x: number; y: number };
  ctx: CanvasRenderingContext2D;
  color: string;
  width: number;
}

export interface Coordinates {
  x: number;
  y: number;
}

export const NameTool = new Map<string, (canvas: CanvasClass) => Tool>([
  [
    Tools.MOVE,
    (canvas: CanvasClass) => {
      console.log("move:", canvas.history);
      return new Move(canvas);
    },
  ],
  [
    Tools.BRUSH,
    (canvas: CanvasClass) => {
      console.log("brush:", canvas.history);
      return new Brush(canvas);
    },
  ],
  [
    Tools.RECTANGLE,
    (canvas: CanvasClass) => {
      console.log("rectangle:", canvas.history);
      return new Rectangle(canvas);
    },
  ],
  [
    Tools.LINE,
    (canvas: CanvasClass) => {
      return new Line(canvas);
    },
  ],
]);
