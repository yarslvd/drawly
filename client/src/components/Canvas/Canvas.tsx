import styles from './Canvas.module.scss';
import React, {FC, useEffect, useRef, useState} from "react";
import {Tool} from "@/data/Tools";
import {NameTool} from "@/data/data";
import {Keyboard} from "@/data/Constants";


export interface CanvasProps {
    tool: string
    width: string;
    height: string;
}

export const Canvas: FC<CanvasProps> = ({tool, width, height }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [selectedTool, setSelectedTool] = useState<Tool | null>(null);
    const [scale, setScale] = useState<number>(1);

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

        let currentTool = NameTool.get(tool)
        if (!currentTool) return

        setSelectedTool(currentTool(canvas) as Tool);
    }, [tool]);

    const handleWheel = (event :WheelEvent) => {
        event.preventDefault();

        if(!event.ctrlKey) return

        event.deltaY > 0
            ? handleZoomIn(event)
            : handleZoomOut(event)
    };

    const handleZoomIn = (event :WheelEvent | KeyboardEvent) => {
        event.preventDefault();
        scale < 4 && setScale((prev) => prev + 0.1);
    }

    const handleZoomOut = (event :WheelEvent | KeyboardEvent) => {
        event.preventDefault();
        scale > 0.2 && setScale((prev) => prev - 0.1);
    }
    const handleKeyDown = (event :KeyboardEvent) => {
        switch (event.ctrlKey) {
            case event.key === Keyboard.Z || event.code === Keyboard.KEY_Z:
                event.shiftKey
                    ? console.log("ctrl + shift + z") // redoLastLine();
                    : console.log("ctrl + z")  // undoLastLine();
                break;
            case event.key === Keyboard.Y || event.code === Keyboard.KEY_Y:
                console.log("ctrl + y");
                // redoLastLine();
                break;
            case event.code === Keyboard.EQUAL:              // +
                handleZoomIn(event)
                break;
            case event.code === Keyboard.MINUS:              // -
                handleZoomOut(event)
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
            style={{ transform: `scale(${scale})` }}
            ref={canvasRef}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
        />
    );
}