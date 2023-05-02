import { useState, useEffect } from 'react';

import styles from './ToolBar.module.scss';
import { ToolBarItem } from "@/components/ToolBarItem/ToolBarItem";

const tools = [
    {
        name: 'Move',
        icon: '/assets/icons/tools/move.png',
        cursors: 'default'
    },
    {
        name: 'Pen Tool',
        icon: '/assets/icons/tools/pentool.png',
        cursors: 'default'
    },
    {
        name: 'Figure',
        icon: '/assets/icons/tools/figure.png',
        cursors: 'crosshair'

    },
    {
        name: 'Text',
        icon: '/assets/icons/tools/text.png',
        cursors: 'crosshair'
    },
    {
        name: 'Hand',
        icon: '/assets/icons/tools/hand.png',
        cursors: 'crosshair'
    },
    {
        name: 'More',
        icon: '/assets/icons/tools/more.png',
        cursors: 'crosshair'
    }
];

export const ToolBar = () => {
    const [tool, setTool] = useState(0);
    const [cursor, setCursor] = useState('default');
    const [mousePosition, setMousePosition] = useState({
        x: 0,
        y: 0,
    });
    // console.log(mousePosition);

    const handleClick = (index: number) => {
        setTool(index);

    }

    useEffect(() => {
        const setPosition = e => {
            setMousePosition({
                x: e.clientX,
                y: e.clientY
            })
        }

        window.addEventListener("mousemove", setPosition);

        return () => {
            window.removeEventListener("mousemove", setPosition)
        }
    }, []);

    return(
        <div className={styles.toolbarContainer}>
            {tools.map((el, index) => (
                <ToolBarItem
                    key={index}
                    current={index === tool}
                    handleClick={() => handleClick(index)}
                    {...el}
                />
            ))}
        </div>
    );
}