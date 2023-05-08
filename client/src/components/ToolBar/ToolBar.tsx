import {FC, memo, useEffect, useState} from "react";
import styles from "./ToolBar.module.scss";
import { ToolBarItem } from "@/components/ToolBarItem/ToolBarItem";
import { Tools } from "@/data/Constants";

const tools = [
  {
    name: Tools.MOVE,
    icon: "/assets/icons/tools/move.png",
    cursors: "/assets/icons/cursors/move.png",
  },
  {
    name: Tools.BRUSH,
    icon: "/assets/icons/tools/pentool.png",
    cursors: "/assets/icons/cursors/pentool.png",
  },
  {
    tools: [
      {
        name: Tools.RECTANGLE,
        icon: "/assets/icons/tools/figure.png",
        cursors: "crosshair",
      },
      {
      name: Tools.LINE,
      icon: "/assets/icons/tools/line.png",
      cursors: "crosshair",
      },
    ],
    multipleOptions: true,
  },
  {
    name: "Text",
    icon: "/assets/icons/tools/text.png",
    cursors: "text",
  },
  {
    name: "Hand",
    icon: "/assets/icons/tools/hand.png",
    cursors: "grab",
  },
  {
    name: "Eraser",
    icon: "/assets/icons/tools/eraser.png",
    cursors: "crosshair",
  },
  {
    name: "More",
    icon: "/assets/icons/tools/more.png",
    cursors: "pointer",
  },
];

//TODO: Add types ;)))
export const ToolBar: FC<any> = memo(({ tool, setTool }) => {
  const [shape, setShape] = useState(0);

  useEffect(() => {
    // TODO: automatically set this shape on mount, think how to fix it
    setTool(tools[2].tools[shape].name);
  }, [shape]);

  const handleClick = (index: number) => {
    tools[index].tools ? setTool(tools[index].tools[shape].name) : setTool(tools[index].name);
    // document.body.style.cursor =
    //   tools[index].cursors.charAt(0) == "/"
    //     ? `url(${tools[index].cursors}), auto`
    //     : `${tools[index].cursors}`;
  };

  return (
    <div className={styles.toolbarContainer}>
      {tools.map((el, index) => (
        <ToolBarItem
          key={tools[index].tools ? el.tools[shape].name : el.name}
          current={tools[index].tools ? el.tools[shape].name === tool : el.name === tool}
          handleClick={() => handleClick(index)}
          setShape={setShape}
          shape={shape}
          {...el}
        />
      ))}
    </div>
  );
});
