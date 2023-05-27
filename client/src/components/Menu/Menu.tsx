import {FC, useState} from "react";

import styles from "./Menu.module.scss";

import { Position } from "@/components/Position/Position";
import { Fill } from "@/components/Fill/Fill";
import { Stroke } from "@/components/Stroke/Stroke";
import { MyImage } from "@/components/Image/MyImage";
import {useSelector} from "react-redux";

export const Menu: FC = () => {
    const currentTool = useSelector((state) => state.data.tool);
    const selectedShape = useSelector((state) => state.data.selectedShape);
    const [displayPickerFill, setDisplayPickerFill] = useState(false);
    const [displayPickerStroke, setDisplayPickerStroke] = useState(false);
    const fillArrTools = ['rectangle', 'ellipse'];
    const strokeArrTools = ['rectangle', 'ellipse', 'line', 'curve_line', 'brush'];
    const fillArrShapes = ['Rectangle', 'Ellipse'];
    const strokeArrShapes = ['Rectangle', 'Ellipse', 'Line', 'CurveLine', 'brush'];
    console.log(selectedShape, currentTool);

  return (
    <div className={styles.container}>
      <div className={styles.options} style={displayPickerFill || displayPickerStroke? { overflow: 'visible'} : {overflow: 'auto'}}>
          <h3>Selected element</h3>
          <Position />
          {(fillArrTools.includes(currentTool) || currentTool == 'move' && fillArrShapes.includes(selectedShape))
              && <Fill displayPicker={displayPickerFill} setDisplayPicker={setDisplayPickerFill} />}
          {(strokeArrTools.includes(currentTool) || currentTool == 'move' && strokeArrShapes.includes(selectedShape)) &&
              <Stroke displayPicker={displayPickerStroke} setDisplayPicker={setDisplayPickerStroke} />}
          {(currentTool == 'image' || selectedShape == 'Img') && <MyImage />}
      </div>
      <div className={styles.layers}>
            <h3>Layers</h3>
            <div className={styles.layersContainer}>

            </div>
      </div>
    </div>
  );
};
