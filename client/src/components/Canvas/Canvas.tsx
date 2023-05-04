import styles from './Canvas.module.scss';
import {FC, useRef, useState} from "react";
import {ChromePicker, ColorChangeHandler} from 'react-color';

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
    const [color, setColor] = useState<string>('#000');
    const {
        setCanvasRef,
        onCanvasMouseDown
    } = useOnDraw(onDraw);

    function onDraw(ctx, point, prevPoint) {
        drawLine(prevPoint, point, ctx, color, 10);
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
        ctx.arc(start.x, start.y, 5, 0, 10 * Math.PI);
        ctx.fill();
    }

    return(
        <>
            <ChromePicker color={color} onChange={(e) => setColor(e.hex)}/>
            <canvas
                width={width}
                height={height}
                className={styles.canvas}
                onMouseDown={onCanvasMouseDown}
                ref={setCanvasRef}
            />
        </>
    );
}