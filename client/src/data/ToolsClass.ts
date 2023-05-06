import {Coordinates} from "@/types/types";

export abstract class Tool {
    protected context: CanvasRenderingContext2D | null = null;
    protected canvas: HTMLCanvasElement | null = null;
    protected isActing: boolean = false;
    protected lastPoint: Coordinates | null = null;

    constructor(canvas: HTMLCanvasElement) {
        this.canvas = canvas;
        this.context = canvas.getContext("2d");
    }

    public onMouseDown(point: Coordinates): void {
        console.log(point);
        this.isActing = true;
        this.lastPoint = point;
        this.onDown(point);
    }

    public onMouseMove(newPoint: Coordinates): void {
        if (!this.isActing) return;
        if (!this.lastPoint) return;

        this.onMove(this.lastPoint, newPoint);
        this.lastPoint = newPoint;
    }

    public onMouseUp(): void {
        this.isActing = false;
        this.onUp(this.lastPoint!)
        this.lastPoint = null;
    }

    protected abstract onMove(start: Coordinates, end: Coordinates): void;
    protected abstract onUp(point: Coordinates): void;
    protected abstract onDown(point: Coordinates): void;
}

