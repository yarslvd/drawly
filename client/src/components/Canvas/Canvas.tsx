import styles from './Canvas.module.scss';
import React, {FC, useEffect, useRef, useState} from "react";
import {Tool} from "@/data/ToolsClass";
import {NameTool} from "@/types/types";
import {Keyboard} from "@/data/Constants";


export interface CanvasProps {
    tool: string
    width: string;
    height: string;
}

export const Canvas: FC<CanvasProps> = ({tool, width, height }) => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
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
            ? handleZoomOut()
            : handleZoomIn()
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
                    ? console.log("ctrl + shift + z") // redoLastLine();
                    : console.log("ctrl + z")  // undoLastLine();
                break;
            case event.key === Keyboard.Y || event.code === Keyboard.KEY_Y:
                console.log("ctrl + y");
                // redoLastLine();
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
            style={{ transform: `scale(${scale})` }}
            ref={canvasRef}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
        />
    );
}