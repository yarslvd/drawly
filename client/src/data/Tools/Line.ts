import {Tool} from "@/data/ToolsClass";
import {Coordinates} from "@/types/types";

export class Line extends Tool {
    protected start: Coordinates | null = null;

    protected onDown(point: Coordinates): void {
        if (!this.context) return

        this.start = point
        this.context.beginPath();

    }

    protected onMove(start: Coordinates, end: Coordinates): void {
        if (!this.context) return;
    }

    protected onUp(point: Coordinates): void {
        if (!this.context) return
        if (!this.start) return

        this.context.moveTo(this.start.x, this.start.y);
        this.context.lineTo(point.x, point.y);
        this.context.stroke();
    }
}