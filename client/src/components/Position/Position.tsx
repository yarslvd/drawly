import { FC, useState } from "react";
import Image from "next/image";
import { useDispatch, useSelector } from "react-redux";

import styles from "./Position.module.scss";
import { setBorderRadius } from "@/store/slices/dataSlice";

export const Position: FC = () => {
  const dispatch = useDispatch();
  const borderRadius = useSelector((state) => state.data.borderRadius);

  const handleBorderRadius = (num) => {
    //dispatch(setBorderRadius(num));
  };

  return (
    <div className={styles.container}>
      <h4>Border Radius</h4>
      <div className={styles.options}>
        {/*<div className={styles.inputContainer}>*/}
        {/*  <span>X</span>*/}
        {/*  <input type="number" />*/}
        {/*</div>*/}
        {/*<div className={styles.inputContainer}>*/}
        {/*  <span>Y</span>*/}
        {/*  <input type="number" />*/}
        {/*</div>*/}
        <div className={styles.inputContainer}>
          <Image
            src="/assets/icons/tools/borderRadius.png"
            alt="Border radius"
            width={20}
            height={20}
          />
          <input
            type="number"
            value={borderRadius}
            onChange={(e) => handleBorderRadius(+e.target.value)}
          />
        </div>
      </div>
    </div>
  );
};
