import styles from './Canvas.module.scss';
import React, {FC, useEffect, useRef, useState} from "react";
import {Tool} from "@/data/ToolsClass";
import {NameTool} from "@/types/types";
import {Keyboard} from "@/data/Constants";
import {getCanvasPoints} from "@/utils/getCanvasPoints";
import { CanvasClass } from '@/data/Canvas';

export interface CanvasProps {
    tool: string
    width: string;
    height: string;
}

let canvas: CanvasClass | null;

export const Canvas: FC<CanvasProps> = ({tool, width, height }) => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const [selectedTool, setSelectedTool] = useState<Tool | null>(null);
    const [scale, setScale] = useState<number>(1);

    const handleMouseDown = (event: React.MouseEvent<HTMLCanvasElement>) => {
        if (selectedTool) {
            const point = getCanvasPoints({ clientX: event.clientX, clientY: event.clientY }, canvasRef, scale);
            point && selectedTool.onMouseDown(point);
        }
    };

    const handleMouseMove = (event: React.MouseEvent<HTMLCanvasElement>) => {
        if (selectedTool) {
            const point = getCanvasPoints({ clientX: event.clientX, clientY: event.clientY }, canvasRef, scale);
            point && selectedTool.onMouseMove(point);
        }
    };

    const handleMouseUp = () => {
        if (selectedTool) {
            selectedTool.onMouseUp();
        }
    };

    const handleOnClick = (event: React.MouseEvent<HTMLCanvasElement>) => {
        if (canvas) {
            const point = getCanvasPoints({ clientX: event.clientX, clientY: event.clientY }, canvasRef, scale);

            for(let i = canvas.history.length - 1; i >= 0; i--) {
                if (point && canvas.history[i].isPointInside(point)) {
                    console.log("Selected shape", i);
                    return;
                }
            }
        }
    }

    useEffect(() => {
        const canvasHTML = canvasRef.current;
        if (!canvasHTML) return;

        if(!canvas) {
            console.log("new canvas 1");
            canvas = new CanvasClass(canvasHTML);
        }
    }, [])

    useEffect(() => {
        const canvasHTML = canvasRef.current;
        if (!canvasHTML) return;

        if(!canvas) {
            console.log("new canvas 2");
            canvas = new CanvasClass(canvasHTML);
        }
        // const context = canvas.getContext("2d");
        // if (!context) return;

        // context.lineWidth = 2;
        // context.strokeStyle = "#000";

        let currentTool = NameTool.get(tool);
        if (!currentTool) return;

        setSelectedTool(currentTool(canvas) as Tool);

    }, [tool]);

    const handleWheel = (event :WheelEvent) => {
        event.preventDefault();

        if(!event.ctrlKey) return

        const canvas = canvasRef.current;

        event.deltaY > 0
            ? handleZoomOut()
            : handleZoomIn()
        console.log(canvasRef?.current && Math.round(canvasRef.current.clientWidth * scale));

        // canvas.width = Math.round(canvas.clientWidth * scale);
        // canvas.height = Math.round(canvas.clientHeight * scale);
    };

    const handleZoomIn = () => {
        const newScale = scale + 0.1;
        newScale < 4 && setScale((prev) => prev + 0.1);
    }

    const handleZoomOut = () => {
        const newScale = scale - 0.1;
        newScale > 0.2 && setScale((prev) => prev - 0.1);
    }
    const handleKeyDown = (event :KeyboardEvent) => {
        event.preventDefault();
        switch (event.ctrlKey) {
            case event.key === Keyboard.Z || event.code === Keyboard.KEY_Z:
                event.shiftKey
                    ? canvas?.redoShape() // redoLastLine();
                    : canvas?.undoShape()  // undoLastLine();
                break;
            case event.key === Keyboard.Y || event.code === Keyboard.KEY_Y:
                console.log("ctrl + y");
                canvas?.redoShape();
                break;
            case event.code === Keyboard.EQUAL:              // +
                handleZoomIn();
                break;
            case event.code === Keyboard.MINUS:              // -
                handleZoomOut();
                break;
            default:
                return;
        }
    }

    useEffect(() => {
        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('wheel', handleWheel, { passive: false });

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('wheel', handleWheel);
        }
    }, [scale]);

    return (
        <canvas
            width={width}
            height={height}
            className={styles.canvas}
            style={{ transform: `scale(${scale})`}}
            ref={canvasRef}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onClick={handleOnClick}
        />
    );
}