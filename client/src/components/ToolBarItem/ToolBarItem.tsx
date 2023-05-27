import { FC, useEffect, useState, useRef } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { CSSProperties, MouseEventHandler } from "react";

import styles from "./ToolBarItem.module.scss";

import { Dropdown } from "@/components/Dropdown/Dropdown";

// TODO: Fix types ;))
interface ToolProps {
  name: string;
  icon: string;
  current: boolean;
  cursor?: CSSProperties | undefined;
  shape: number;
  setShape: () => void;
  handleClick: MouseEventHandler<HTMLInputElement | HTMLDivElement> | undefined;
  multipleOptions?: boolean;
  tools: any;
}
type UnionProps = ToolProps[] | ToolProps;

export const ToolBarItem: FC<UnionProps> = (props: ToolProps) => {
  const [dropdown, setDropdown] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);

  const handleDropdown = () => {
    setDropdown(!dropdown);
  };

  useEffect(() => {
    if (dropdown) {
      setDropdown(false);
    }
  }, [props.handleClick]);

  useEffect(() => {}, [props.shape]);

  useEffect(() => {
    const closeDropdown = (e) => {
      if (dropdown && ref.current && !ref.current.contains(e.target)) {
        setDropdown(false);
      }
    };

    document.body.addEventListener("click", closeDropdown);
    return () => {
      document.body.removeEventListener("click", closeDropdown);
    };
  }, [dropdown]);

  return (
    <>
      <motion.div
        className={styles.container}
        onClick={props.handleClick}
        whileTap={{
          scale: 0.9,
        }}
      >
        <input
          type="radio"
          name="tool"
          id={props.tools ? props.tools[props.shape].name : props.name}
          value={props.tools ? props.tools[props.shape].name : props.name}
          checked={props.current}
          onChange={props.handleClick}
          className={styles.input}
        />
        <label
          htmlFor={props.tools ? props.tools[props.shape].name : props.name}
          className={styles.label}
        >
          <div className={styles.toolContainer} ref={ref}>
            <Image
              src={props.tools ? props.tools[props.shape].icon : props.icon}
              alt={props.tools ? props.tools[props.shape].name : props.name}
              width={20}
              height={20}
              className={styles.tool}
              draggable="false"
            />
            {props.multipleOptions && (
              <button onClick={handleDropdown} className={styles.choose}>
                <Image
                  alt="Choose tool"
                  src="/assets/icons/tools/choose.png"
                  width={6}
                  height={6}
                />
              </button>
            )}
          </div>
        </label>
      </motion.div>
      {dropdown && (
        <Dropdown
          tools={props.tools}
          setShape={props.setShape}
          shape={props.shape}
        />
      )}
    </>
  );
};
