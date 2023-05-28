import { FC, useState } from "react";
import Image from "next/image";

import styles from "./Position.module.scss";
import { useSelector } from "react-redux";

export const Position: FC = () => {
  const currentTool = useSelector((state) => state.data.tool);
  const currentShape = useSelector((state) => state.data.selectedShape);
  const [x, setX] = useState(currentShape?.start.x);

  console.log("JOPA1:", currentShape);
  console.log("JOPA2:", currentTool);
  return (
    <div className={styles.container}>
      <h4>Position</h4>
      <div className={styles.options}>
        <div className={styles.inputContainer}>
          <span>X</span>
          <input type="number" />
        </div>
        <div className={styles.inputContainer}>
          <span>Y</span>
          <input type="number" />
        </div>
        <div className={styles.inputContainer}>
          <Image
            src="/assets/icons/tools/borderRadius.png"
            alt="Border radius"
            width={20}
            height={20}
          />
          <input type="number" />
        </div>
      </div>
    </div>
  );
};
