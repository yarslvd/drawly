import { FC } from "react";

import styles from "./Menu.module.scss";

import { Position } from "@/components/Position/Position";
import { Fill } from "@/components/Fill/Fill";
import { Stroke } from "@/components/Stroke/Stroke";
import { MyImage } from "@/components/Image/MyImage";

export const Menu: FC = () => {
  return (
    <div className={styles.container}>
      <div className={styles.options}>
        <h3>Selected element</h3>
        <Position />
        <Fill />
        <Stroke />
      </div>
      <div className={styles.layers}></div>
      <div className={styles.image}>
        <MyImage />
      </div>
    </div>
  );
};
