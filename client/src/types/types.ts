import { Brush, Line, Move, Rectangle } from "@/data/Tools";
import { Tools } from "@/data/Constants";
import { CanvasClass } from "@/data/Canvas";
import { Tool } from "@/data/ToolsClass";
import { CurveLine } from "@/data/Tools/CurveLine";
import { Ellipse } from "@/data/Tools/Ellipse";

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
      console.log("move");
      return new Move(canvas);
    },
  ],
  [
    Tools.BRUSH,
    (canvas: CanvasClass) => {
      console.log("brush", canvas.history);
      return new Brush(canvas);
    },
  ],
  [
    Tools.RECTANGLE,
    (canvas: CanvasClass) => {
      console.log("rectangle");
      return new Rectangle(canvas);
    },
  ],
  [
    Tools.ELLIPSE,
    (canvas: CanvasClass) => {
      console.log("ellipse");
      return new Ellipse(canvas);
    },
  ],
  [
    Tools.LINE,
    (canvas: CanvasClass) => {
      console.log("line");
      return new Line(canvas);
    },
  ],
  [
    Tools.CURVE_LINE,
    (canvas: CanvasClass) => {
      console.log("curve line", canvas.history);
      return new CurveLine(canvas);
    },
  ],
]);
