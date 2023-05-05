import styles from './Canvas.module.scss';
import {FC, useEffect, useRef, useState} from "react";

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
    const [scale, setScale] = useState<number>(1);
    const [canvasPosition, setCanvasPosition] = useState({ x: 0, y: 0 });
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const [isMouseDown, setIsMouseDown] = useState<boolean>(false);

    const currentCanvas = canvasRef.current;

    function onDraw(ctx, point, prevPoint) {
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
        console.log(ctx);
        start = start ?? end;
        ctx.beginPath();
        ctx.lineWidth = width;
        ctx.strokeStyle = color;
        ctx.moveTo(start.x, start.y);
        ctx.lineTo(end.x, end.y);
        //ctx.quadraticCurveTo((start.x + end.x) / 2, end.x, end.x, end.y);
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

      const handleWheel = (event) => {
          event.preventDefault();

          if(event.ctrlKey) {
              if(event.deltaY > 0) {
                  console.log(scale);
                  if(scale > 0.2) {
                      setScale(prev => prev - 0.1);
                  }
              }
              else if(event.deltaY < 0) {
                  console.log(scale);
                  if(scale < 4) {
                      setScale(prev => prev + 0.1);
                  }
                  //scale < 4 && setScale(prev => prev + 0.1);
              }
          }
      }

    const handleKeyDown = (event) => {
        switch (event.ctrlKey) {
            case event.key === 'z' || event.code === 'KeyZ':
                if(event.shiftKey || event.key === 'y') {
                    console.log("ctrl + shift + z");
                    redoLastLine();
                }
                else {
                    console.log("ctrl + z");
                    undoLastLine();
                }
                break;
            case event.key === 'y' || event.code === 'KeyY':
                console.log("ctrl + y");
                redoLastLine();
                break;
            case event.code === 'Equal':              // +
                event.preventDefault();
                if(scale < 4) {
                    console.log('zoom in');
                    setScale((prev) => prev + 0.1);
                }
                break;
            case event.code === 'Minus':              // -
                event.preventDefault();
                if(scale > 0.2) {
                    console.log('zoom out');
                    setScale((prev) => prev - 0.1);
                }
                break;
            default:
                return;
        }
    }
      
      useEffect(() => {
          const drawEnd = () => {
              console.log("draw end");
              history.push(curveLine);
          }

          const drawStart = () => {
              console.log("draw start");
              curveLine = [];
          }

        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener("mouseup", drawStart);
        window.addEventListener("mousedown", drawEnd);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('mouseup', drawStart);
            window.removeEventListener("mousedown", drawEnd);
        }

      }, []);

      // Scaling handle
      useEffect(() => {
          window.addEventListener('keydown', handleKeyDown);
          window.addEventListener('wheel', handleWheel, { passive: false });

          return () => {
              window.removeEventListener('keydown', handleKeyDown);
              window.removeEventListener('wheel', handleWheel);
          }
      }, [scale]);

    return(
        <canvas
            width={width}
            height={height}
            style={{ transform: `scale(${scale}) translate(${canvasPosition.x}px, ${canvasPosition.y}px)` }}
            className={styles.canvas}
            onMouseDown={onCanvasMouseDown}
            ref={setCanvasRef}
        />
    );
}