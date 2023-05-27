import { FC } from "react";

import styles from "./Menu.module.scss";

import { Position } from "@/components/Position/Position";
import { Fill } from "@/components/Fill/Fill";
import { Stroke } from "@/components/Stroke/Stroke";
import { MyImage } from "@/components/Image/MyImage";
import {useSelector} from "react-redux";

export const Menu: FC = () => {
    const currentTool = useSelector((state) => state.data.tool);
    const selecedShape = useSelector((state) => state.data.selectedShape);
    const fillArr = ['rectangle', 'ellipse'];
    const strokeArr = ['rectangle', 'ellipse', 'line', 'curve_line', 'brush'];
    console.log(selecedShape);

  return (
    <div className={styles.container}>
      <div className={styles.options}>
          <h3>Selected element</h3>
          <Position />
          <Fill />
          <Stroke />
      </div>
      <div className={styles.layers}>
            <h3>Layers</h3>
            <div className={styles.layersContainer}>

            </div>
      </div>
      {/*<div className={styles.image}>*/}
      {/*  <MyImage />*/}
      {/*</div>*/}
    </div>
  );
};
