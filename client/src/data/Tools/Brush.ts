import {Coordinates} from "@/types/types";
import {Tool} from "@/data/ToolsClass";
import {getCanvasPoints} from "@/utils/getCanvasPoints";

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

        //TODO: weight and height the same as the lineWidth, remember to upd after adding styles
        this.context.fillRect(point.x,point.y,2,2);
    }

    protected onUp(point: Coordinates): void {
    }
}