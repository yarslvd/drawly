import {Tool} from "@/data/ToolsClass";

import {Coordinates} from "@/types/types";

export class Rectangle extends Tool {
    protected start: Coordinates | null = null;

    protected onDown(point: Coordinates): void {
        this.start = point
    }

    protected onMove(start: Coordinates, end: Coordinates): void {
        if (!this.context) return
        if (!this.start) return


        // const width = end.x - this.start.x;
        // const height = end.y - this.start.y;
        // this.context.strokeRect(this.start.x, this.start.y, width, height);
    }

    protected onUp(point: Coordinates): void {
        if (!this.context) return
        if (!this.start) return

        const width = point.x - this.start.x;
        const height = point.y - this.start.y;
        this.context.strokeRect(this.start.x, this.start.y, width, height);
    }
}