import styles from './Canvas.module.scss';
import React, {FC, useEffect, useRef, useState} from "react";
import { useOnDraw } from "@/hooks/useOnDraw";
import {Brush, Rectangle, Tool} from "@/data/Tools";
import {CanvasProps} from "@/data/data";

export const Canvas: FC<CanvasProps> = ({tool, width, height }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [selectedTool, setSelectedTool] = useState<Tool | null>(null);
    const [scale, setScale] = useState<number>(1);

    const history: any[] = [];
    const removedHistory: any[] = [];

    const handleMouseDown = (event: React.MouseEvent<HTMLCanvasElement>) => {
        if (selectedTool) {
            selectedTool.onMouseDown({ x: event.clientX, y: event.clientY });
        }
    };

    const handleMouseMove = (event: React.MouseEvent<HTMLCanvasElement>) => {
        if (selectedTool) {
            selectedTool.onMouseMove({ x: event.clientX, y: event.clientY });
        }
    };

    const handleMouseUp = () => {
        if (selectedTool) {
            selectedTool.onMouseUp();
        }
    };

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const context = canvas.getContext("2d");
        if (!context) return;

        context.lineWidth = 2;
        context.strokeStyle = "#000";

        //TODO: this map mustn't be here, think about where it can be moved
        let toolTool = new Map<number, Tool>([
            [1, new Brush(canvas)],
            [2, new Rectangle(canvas)]
        ]);

        setSelectedTool(toolTool.get(tool) as Tool);
    }, [tool]);
    const handleWheel = (event :WheelEvent) => {
        event.preventDefault();

        if(!event.ctrlKey) return

        event.deltaY > 0
            ? scale > 0.2 && setScale(prev => prev - 0.1)
            : scale < 4 && setScale(prev => prev + 0.1)
    };

    useEffect(() => {
        // window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('wheel', handleWheel, { passive: false });

        return () => {
          // window.removeEventListener('keydown', handleKeyDown);
          window.removeEventListener('wheel', handleWheel);
        }
    }, [scale]);

    return (
        <canvas
            width={width}
            height={height}
            className={styles.canvas}
            style={{ transform: `scale(${scale})` }}
            ref={canvasRef}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
        />
    );
    // const {
    //     setCanvasRef,
    //     onCanvasMouseDown,
    //     canvasRef,
    //     isDrawingRef
    // } = useOnDraw(onDraw, ()=> {
    //     console.log("mousedown");
    // }, () => {
    //     console.log("mouseup");
    // });
    //

    //
    // // change array to class with draw() method
    // let curveLine: any[] = [];
    //
    // const currentCanvas = canvasRef.current;
    //
    // function onDraw(ctx, point, prevPoint) {
    //     drawLine(prevPoint, point, ctx, '#000', 5);
    //     curveLine.push({start: prevPoint, end: point, ctx, color: '#000', width: 5});
    // }
    //
    // function drawLine(
    //     start,
    //     end,
    //     ctx,
    //     color,
    //     width
    // ) {
    //     console.log(ctx);
    //     start = start ?? end;
    //     ctx.beginPath();
    //     ctx.lineWidth = width;
    //     ctx.strokeStyle = color;
    //     ctx.moveTo(start.x, start.y);
    //     ctx.lineTo(end.x, end.y);
    //     //ctx.quadraticCurveTo((start.x + end.x) / 2, end.x, end.x, end.y);
    //     ctx.stroke();
    //     ctx.fillStyle = color;
    //     ctx.beginPath();
    //     ctx.arc(start.x, start.y, 2, 0, 2 * Math.PI);
    //     ctx.fill();
    // }
    //
    // const undoLastLine = () => {
    //     const currentCanvas = canvasRef?.current;
    //     const ctx = currentCanvas?.getContext('2d');
    //     if (history.length > 0 && currentCanvas && ctx) {
    //         console.log("undo", history)
    //         removedHistory.unshift(history[history.length - 1]);
    //         history.pop();
    //
    //         ctx.clearRect(0, 0, currentCanvas?.width, currentCanvas?.height);
    //
    //         history.forEach((line) => {
    //         line.forEach((point) => {
    //             drawLine(point.start, point.end, ctx, point.width, point.color);
    //         })
    //       });
    //     }
    //   };
    //
    //   const redoLastLine = () => {
    //     const currentCanvas = canvasRef?.current;
    //     const ctx = currentCanvas?.getContext('2d');
    //     if (removedHistory.length > 0 && currentCanvas && ctx) {
    //         console.log("redo", removedHistory)
    //         const line = removedHistory[0];
    //         history.push(line);
    //         removedHistory.shift();
    //
    //         line.forEach((point) => {
    //             drawLine(point.start, point.end, ctx, point.width, point.color);
    //         })
    //     }
    //   }
    //
    //   const handleWheel = (event) => {
    //       event.preventDefault();
    //
    //       if(event.ctrlKey) {
    //           if(event.deltaY > 0) {
    //               console.log(scale);
    //               if(scale > 0.2) {
    //                   setScale(prev => prev - 0.1);
    //               }
    //           }
    //           else if(event.deltaY < 0) {
    //               console.log(scale);
    //               if(scale < 4) {
    //                   setScale(prev => prev + 0.1);
    //               }
    //               //scale < 4 && setScale(prev => prev + 0.1);
    //           }
    //       }
    //   }
    //
    // const handleKeyDown = (event) => {
    //     switch (event.ctrlKey) {
    //         case event.key === 'z' || event.code === 'KeyZ':
    //             if(event.shiftKey || event.key === 'y') {
    //                 console.log("ctrl + shift + z");
    //                 redoLastLine();
    //             }
    //             else {
    //                 console.log("ctrl + z");
    //                 undoLastLine();
    //             }
    //             break;
    //         case event.key === 'y' || event.code === 'KeyY':
    //             console.log("ctrl + y");
    //             redoLastLine();
    //             break;
    //         case event.code === 'Equal':              // +
    //             event.preventDefault();
    //             if(scale < 4) {
    //                 console.log('zoom in');
    //                 setScale((prev) => prev + 0.1);
    //             }
    //             break;
    //         case event.code === 'Minus':              // -
    //             event.preventDefault();
    //             if(scale > 0.2) {
    //                 console.log('zoom out');
    //                 setScale((prev) => prev - 0.1);
    //             }
    //             break;
    //         default:
    //             return;
    //     }
    // }
    //
    //   useEffect(() => {
    //       const drawEnd = () => {
    //           console.log("draw end");
    //           history.push(curveLine);
    //       }
    //
    //       const drawStart = () => {
    //           console.log("draw start");
    //           curveLine = [];
    //       }
    //
    //     window.addEventListener('keydown', handleKeyDown);
    //     window.addEventListener("mouseup", drawStart);
    //     window.addEventListener("mousedown", drawEnd);
    //
    //     return () => {
    //         window.removeEventListener('keydown', handleKeyDown);
    //         window.removeEventListener('mouseup', drawStart);
    //         window.removeEventListener("mousedown", drawEnd);
    //     }
    //
    //   }, []);
    //
    //   // Scaling handle
    //   useEffect(() => {
    //       window.addEventListener('keydown', handleKeyDown);
    //       window.addEventListener('wheel', handleWheel, { passive: false });
    //
    //       return () => {
    //           window.removeEventListener('keydown', handleKeyDown);
    //           window.removeEventListener('wheel', handleWheel);
    //       }
    //   }, [scale]);

    // return(
    //     <canvas
    //         width={width}
    //         height={height}
    //         style={{ transform: `scale(${scale})` }}
    //         className={styles.canvas}
    //         onMouseDown={onCanvasMouseDown}
    //         ref={setCanvasRef}
    //     />
    // );
}