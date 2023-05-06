import { FC, memo } from 'react';
import styles from './ToolBar.module.scss';
import { ToolBarItem } from "@/components/ToolBarItem/ToolBarItem";
import {Tools} from "@/data/Constants";

const tools = [
    {
        name: 'Move',
        icon: '/assets/icons/tools/move.png',
        cursors: '/assets/icons/cursors/move.png'
    },
    {
        name: Tools.BRUSH,
        icon: '/assets/icons/tools/pentool.png',
        cursors: '/assets/icons/cursors/pentool.png'
    },
    {
        name: Tools.RECTANGLE,
        icon: '/assets/icons/tools/figure.png',
        cursors: 'crosshair'
    },
    {
        name: Tools.LINE,
        icon: '/assets/icons/tools/text.png',
        cursors: 'text'
    },
    {
        name: 'Hand',
        icon: '/assets/icons/tools/hand.png',
        cursors: 'grab'
    },
    {
        name: 'Eraser',
        icon: '/assets/icons/tools/eraser.png',
        cursors: 'crosshair'
    },
    {
        name: 'More',
        icon: '/assets/icons/tools/more.png',
        cursors: 'pointer'
    }
];

export const ToolBar: FC<any> = memo(({tool, setTool}) => {

    const handleClick = (index: number) => {
        setTool(tools[index].name);
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
});