import { useState, useEffect, FC } from 'react';
import { motion } from 'framer-motion';

import styles from './ToolBar.module.scss';
import { ToolBarItem } from "@/components/ToolBarItem/ToolBarItem";

const tools = [
    {
        name: 'Move',
        icon: '/assets/icons/tools/move.png',
        cursors: '/assets/icons/cursors/move.png'
    },
    {
        name: 'Pen Tool',
        icon: '/assets/icons/tools/pentool.png',
        cursors: '/assets/icons/cursors/pentool.png'
    },
    {
        name: 'Figure',
        icon: '/assets/icons/tools/figure.png',
        cursors: 'crosshair'
    },
    {
        name: 'Text',
        icon: '/assets/icons/tools/text.png',
        cursors: 'text'
    },
    {
        name: 'Hand',
        icon: '/assets/icons/tools/hand.png',
        cursors: 'grab'
    },
    {
        name: 'More',
        icon: '/assets/icons/tools/more.png',
        cursors: 'pointer'
    }
];

export const ToolBar: FC = () => {
    const [tool, setTool] = useState(0);

    const handleClick = (index: number) => {
        setTool(index);
        console.log((tools[index].cursors).charAt(0));
        document.body.style.cursor = (tools[index].cursors).charAt(0) == '/' ? `url(${tools[index].cursors}), auto` : `${tools[index].cursors}`;
    }

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