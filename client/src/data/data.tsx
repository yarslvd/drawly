
export interface CanvasProps {
    tool: number
    width: string;
    height: string;
}

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