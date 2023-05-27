import { FC, memo, useEffect, useState } from "react";
import styles from "./ToolBar.module.scss";
import { ToolBarItem } from "@/components/ToolBarItem/ToolBarItem";
import { Tools } from "@/data/Constants";
import {useDispatch, useSelector} from "react-redux";

import {setTool as setStoreTool} from "@/store/slices/dataSlice";

export const tools = [
  {
    name: Tools.MOVE,
    icon: "/assets/icons/tools/move.png",
    cursors: "/assets/icons/cursors/move.png",
  },
  {
    name: Tools.CURVE_LINE,
    icon: "/assets/icons/tools/pentool.png",
    cursors: "crosshair",
  },
  {
    tools: [
      {
        name: Tools.RECTANGLE,
        icon: "/assets/icons/tools/figure.png",
      },
      {
        name: Tools.ELLIPSE,
        icon: "/assets/icons/tools/ellipse.png",
      },
      {
        name: Tools.LINE,
        icon: "/assets/icons/tools/line.png",
      },
    ],
    cursors: "crosshair",
    multipleOptions: true,
  },
  {
    name: Tools.BRUSH,
    icon: "/assets/icons/tools/brush.png",
    cursors: "crosshair",
  },
  {
    name: Tools.TEXT,
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
    name: Tools.IMAGE,
    icon: "/assets/icons/tools/image.png",
    cursors: "crosshair",
  },
];

//TODO: Add types ;)))
export const ToolBar: FC<any> = memo(({ tool, setTool }) => {
  const [shape, setShape] = useState(0);
  const dispatch = useDispatch();


  useEffect(() => {
    // TODO: automatically set this shape on mount, think how to fix it
    setTool(tools[2].tools[shape].name);
  }, [shape]);

  const handleClick = (index: number) => {
    console.log(shape);
    if(tools[index].tools) {
      setTool(tools[index].tools[shape].name);
      dispatch(setStoreTool(tools[index].tools[shape].name));
    }
    else {
      setTool(tools[index].name)
      dispatch(setStoreTool(tools[index].name));
    }
    document.body.style.cursor =
      tools[index].cursors.charAt(0) == "/"
        ? `url(${tools[index].cursors}), auto`
        : `${tools[index].cursors}`;
  };

  return (
    <div className={styles.toolbarContainer}>
      {tools.map((el, index) => (
        <ToolBarItem
          key={tools[index].tools ? el.tools[shape].name : el.name}
          current={
            tools[index].tools
              ? el.tools[shape].name === tool
              : el.name === tool
          }
          handleClick={() => handleClick(index)}
          setShape={setShape}
          shape={shape}
          {...el}
        />
      ))}
    </div>
  );
});
