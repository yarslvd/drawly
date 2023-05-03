import styles from './Canvas.module.scss';
import {FC, useRef} from "react";

import { useOnDraw } from "@/hooks/useOnDraw";

interface CanvasProps {
    width: string;
    height: string;
}

interface onDrawTypes {
    ctx: CanvasRenderingContext2D;
    point: { x: number, y: number };
    prevPoint: { x: number, y: number };
}

interface drawLineTypes {
    start: { x: number, y: number };
    end: { x: number, y: number };
    ctx: CanvasRenderingContext2D;
    color: string;
    width: number;
}

export const Canvas: FC<CanvasProps> = ({ width, height }) => {
    const {
        setCanvasRef,
        onCanvasMouseDown
    } = useOnDraw(onDraw);

    function onDraw(ctx, point, prevPoint) {
        // console.log(ctx);
        // ctx.fillStyle = '#000';
        // ctx.arc(point.x, point.y, 2, 0, 2 * Math.PI);
        // ctx.fill();
        drawLine(prevPoint, point, ctx, '#000', 5);
    }

    function drawLine(
        start,
        end,
        ctx,
        color,
        width
    ) {
        start = start ?? end;
        ctx.beginPath();
        ctx.lineWidth = width;
        ctx.strokeStyle = color;
        ctx.moveTo(start.x, start.y);
        ctx.lineTo(end.x, end.y);
        ctx.stroke();
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(start.x, start.y, 2, 0, 2 * Math.PI);
        ctx.fill();
    }

    return(
        <canvas
            width={width}
            height={height}
            className={styles.canvas}
            onMouseDown={onCanvasMouseDown}
            ref={setCanvasRef}
        />
    );
}