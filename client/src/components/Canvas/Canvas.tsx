import styles from './Canvas.module.scss';
import {FC, useEffect, useRef} from "react";

import { useOnDraw } from "@/hooks/useOnDraw";
import Stack from 'ts-data.stack';

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
        onCanvasMouseDown,
        canvasRef,
        isDrawingRef
    } = useOnDraw(onDraw, ()=> {
        console.log("mousedown");
    }, () => {
        console.log("mouseup");
    });

    const history: any[] = [];
    const removedHistory: any[] = [];

    // change array to class with draw() method
    let curveLine: any[] = [];

    const currentCanvas = canvasRef.current;

    function onDraw(ctx, point, prevPoint) {
        // console.log(ctx);
        // ctx.fillStyle = '#000';
        // ctx.arc(point.x, point.y, 2, 0, 2 * Math.PI);
        // ctx.fill();
        drawLine(prevPoint, point, ctx, '#000', 5);
        curveLine.push({start: prevPoint, end: point, ctx, color: '#000', width: 5});
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

    const undoLastLine = () => {
        const currentCanvas = canvasRef?.current;
        const ctx = currentCanvas?.getContext('2d');
        if (history.length > 0 && currentCanvas && ctx) {
            console.log("undo", history)
            removedHistory.unshift(history[history.length - 1]);
            history.pop();
        
            ctx.clearRect(0, 0, currentCanvas?.width, currentCanvas?.height);
        
            history.forEach((line) => {
            line.forEach((point) => {
                drawLine(point.start, point.end, ctx, point.width, point.color);
            })
          });
        }
      };

      const redoLastLine = () => {
        const currentCanvas = canvasRef?.current;
        const ctx = currentCanvas?.getContext('2d');
        if (removedHistory.length > 0 && currentCanvas && ctx) {
            console.log("redo", removedHistory)
            const line = removedHistory[0];
            history.push(line);
            removedHistory.shift();
        
            line.forEach((point) => {
                drawLine(point.start, point.end, ctx, point.width, point.color);
            })
        }
      }
      
      useEffect(() => {
        window.addEventListener('keydown', (event) => {
            if (event.ctrlKey && (event.key === 'z' || event.code === 'KeyZ')) {
                if(event.shiftKey) {
                    console.log("ctrl + shift + z");
                    redoLastLine();
                }
                else {
                    console.log("ctrl + z");
                    undoLastLine();
                }
                return;
            }
        });
        
        window.addEventListener("mouseup", () => {
            console.log("draw end");
            history.push(curveLine);
        });

        window.addEventListener("mousedown", () => {
            console.log("draw start");
            curveLine = [];
        });

      }, []);
      
      

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