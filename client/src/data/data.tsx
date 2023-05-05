import {Brush, Line, Rectangle, Tool} from "@/data/Tools";
import {Tools} from "@/data/Constants";

export interface onDrawTypes {
    ctx: CanvasRenderingContext2D;
    point: { x: number, y: number };
    prevPoint: { x: number, y: number };
}

export interface drawLineTypes {
    start: { x: number, y: number };
    end: { x: number, y: number };
    ctx: CanvasRenderingContext2D;
    color: string;
    width: number;
}

export interface Coordinates {
    x: number;
    y: number;
}

export const NameTool = new Map<string, (canvas: HTMLCanvasElement) => Tool>([
    [Tools.BRUSH, (canvas :HTMLCanvasElement) => {
        return new Brush(canvas);
    }],
    [Tools.RECTANGLE, (canvas :HTMLCanvasElement) => {
        return new Rectangle(canvas);
    }],
    [Tools.LINE, (canvas :HTMLCanvasElement) => {
        return new Line(canvas);
    }],
]);