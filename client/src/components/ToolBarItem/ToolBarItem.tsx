import Image from 'next/image';
import {CSSProperties, MouseEventHandler} from "react";

import styles from './ToolBarItem.module.scss';

interface ToolProps {
    name: string;
    icon: string;
    current: boolean;
    cursor?: CSSProperties | undefined;
    handleClick: MouseEventHandler<HTMLButtonElement> | undefined;
}

export const ToolBarItem = ({name, icon, current, cursors, handleClick}: ToolProps) => {
    return(
        <button
            className={current ? styles.button_active : styles.button_inactive}
            // style={{ cursor: cursors }}
            onClick={handleClick}
        >
            <Image src={icon} alt={name} width={20} height={20}/>
        </button>
    )
}