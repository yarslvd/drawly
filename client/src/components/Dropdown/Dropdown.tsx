import Image from "next/image";
import { motion } from "framer-motion";
import { FC } from "react";

import styles from "./Dropdown.module.scss";

export const Dropdown: FC = ({ tools, setShape, shape }) => {
  return (
    <div className={styles.container}>
      <ul className={styles.list}>
        {tools.map((el, index) => (
          <ListItem
            key={index}
            {...tools[index]}
            setShape={setShape}
            shape={shape}
            index={index}
          />
        ))}
      </ul>
    </div>
  );
};

const ListItem: FC = ({ name, icon, setShape, shape, index }) => {
  const handleShapeChange = () => {
    setShape(index);
  };

  return (
    <li className={styles.listItem}>
      <motion.div className={styles.item_container} onClick={handleShapeChange}>
        <input
          type="radio"
          name="Shapes"
          id={name}
          value={name}
          checked={shape === index}
          onChange={handleShapeChange}
        />
        <label htmlFor={name}>
          <div className={styles.select}>
            <Image
              src={icon}
              alt={name}
              width={20}
              height={20}
              draggable="false"
              style={{ width: "15px", height: "15px" }}
            />
            <span className={styles.name}>{name}</span>
          </div>
        </label>
      </motion.div>
    </li>
  );
};
