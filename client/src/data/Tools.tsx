import {Coordinates} from "@/data/data";

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
        this.isActing = true;
        this.lastPoint = point;
        this.onDown(point)
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

export class Brush extends Tool {
    protected onMove(start: Coordinates, end: Coordinates): void {
        if (!this.context) return

        this.context.beginPath();
        this.context.moveTo(start.x, start.y);
        this.context.lineTo(end.x, end.y);
        this.context.closePath();
        this.context.stroke();
    }

    protected onDown(point: Coordinates): void {
        if (!this.context) return

        this.context.fillRect(point.x,point.y,2,2);
    }

    protected onUp(point: Coordinates): void {
    }
}

export class Rectangle extends Tool {
    protected start: Coordinates | null = null;

    protected onDown(point: Coordinates): void {
        this.start = point
    }

    protected onMove(start: Coordinates, end: Coordinates): void {
        if (!this.context) return
        if (!this.start) return


        // const width = end.x - start.x;
        // const height = end.y - start.y;
        // this.context.strokeRect(start.x, start.y, width, height);
    }

    protected onUp(point: Coordinates): void {
        if (!this.context) return
        if (!this.start) return

        const width = point.x - this.start.x;
        const height = point.y - this.start.y;
        this.context.strokeRect(this.start.x, this.start.y, width, height);
    }
}
export class Line extends Tool {
    protected onMove(start: Coordinates, end: Coordinates): void {
        if (!this.context) {
            return;
        }

        this.context.beginPath();
        this.context.moveTo(start.x, start.y);
        this.context.lineTo(end.x, end.y);
        this.context.stroke();
    }

    protected onDown(point: Coordinates): void {
    }

    protected onUp(point: Coordinates): void {
    }
}

