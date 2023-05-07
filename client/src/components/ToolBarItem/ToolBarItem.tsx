import { FC } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { CSSProperties, MouseEventHandler } from "react";

import styles from "./ToolBarItem.module.scss";

interface ToolProps {
  name: string;
  icon: string;
  current: boolean;
  cursor?: CSSProperties | undefined;
  handleClick: MouseEventHandler<HTMLButtonElement> | undefined;
}

export const ToolBarItem: FC<ToolProps> = ({
  name,
  icon,
  current,
  handleClick,
}) => {
  return (
    <motion.button
      className={current ? styles.button_active : styles.button_inactive}
      onClick={handleClick}
      whileTap={{
        scale: 0.8,
      }}
    >
      <Image src={icon} alt={name} width={20} height={20} draggable="false" />
    </motion.button>
  );
};
