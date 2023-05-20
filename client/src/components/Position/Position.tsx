import { FC } from "react";
import Image from "next/image";

import styles from "./Position.module.scss";

export const Position: FC = () => {
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
            src="/assets/icons/tools/angle.png"
            alt="Rotate"
            width={20}
            height={20}
          />
          <input type="number" />
        </div>
        <div className={styles.inputContainer}>
          <Image
            src="/assets/icons/tools/borderRadius.png"
            alt="Rotate"
            width={20}
            height={20}
          />
          <input type="number" />
        </div>
      </div>
    </div>
  );
};
