import { FC, useState } from "react";

import styles from "./Menu.module.scss";

import ListSubheader from "@mui/material/ListSubheader";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import TextField from "@mui/material/TextField";
import { ToolBarItem } from "@/components/ToolBarItem/ToolBarItem";
import { Button, Input } from "@mui/material";

import { Position } from "@/components/Position/Position";
import { Fill } from "@/components/Fill/Fill";
import { Stroke } from "@/components/Stroke/Stroke";
import { MyImage } from "@/components/Image/MyImage";
import { useSelector } from "react-redux";

import Image from "next/image";
import { Collapse } from "@mui/material";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import { CanvasClass } from "@/data/Canvas";

export const Menu: FC = () => {
  const currentTool = useSelector((state) => state.data.tool);
  const selectedShape = useSelector((state) => state.data.selectedShape);
  const [displayPickerFill, setDisplayPickerFill] = useState(false);
  const [displayPickerStroke, setDisplayPickerStroke] = useState(false);
  const fillArrTools = ["rectangle", "ellipse"];
  const strokeArrTools = [
    "rectangle",
    "ellipse",
    "line",
    "curve_line",
    "brush",
  ];
  const fillArrShapes = ["Rectangle", "Ellipse"];
  const strokeArrShapes = [
    "Rectangle",
    "Ellipse",
    "Line",
    "CurveLine",
    "brush",
  ];
  console.log(selectedShape, currentTool);

  const canvas: CanvasClass = useSelector((state) => state.data.canvas);
  const [open, setOpen] = useState(false);

  const handleClick = () => {
    setOpen(!open);
  };

  const addLayer = () => {
    canvas.layers.push([]);
    canvas.history = canvas.layers[canvas.layers.length - 1];
  };

  return (
    <div className={styles.container}>
      <div
        className={styles.options}
        style={
          displayPickerFill || displayPickerStroke
            ? { overflow: "visible" }
            : { overflow: "auto" }
        }
      >
        <h3>Selected element</h3>
        <Position />
        {(fillArrTools.includes(currentTool) ||
          (currentTool == "move" && fillArrShapes.includes(selectedShape))) && (
          <Fill
            displayPicker={displayPickerFill}
            setDisplayPicker={setDisplayPickerFill}
          />
        )}
        {(strokeArrTools.includes(currentTool) ||
          (currentTool == "move" &&
            strokeArrShapes.includes(selectedShape))) && (
          <Stroke
            displayPicker={displayPickerStroke}
            setDisplayPicker={setDisplayPickerStroke}
          />
        )}
        {(currentTool == "image" || selectedShape == "Img") && <MyImage />}
      </div>
      <div className={styles.layers}>
        <h3>Layers</h3>
        <Button onClick={addLayer}>Add layer</Button>
        <div className={styles.layersContainer}>
          <List
            sx={{ width: "100%", maxWidth: 360, bgcolor: "background.paper" }}
            component="nav"
            aria-labelledby="nested-list-subheader"
          >
            {/* <ListItemButton>
            <ListItemIcon>
              <Image
                src="/assets/icons/tools/figure.png"
                width={20}
                height={20}
              />
              <ListItemText>Rectangle 1</ListItemText>
            </ListItemIcon>
            <ListItemText />
          </ListItemButton> */}
            {canvas &&
              canvas.layers.map((layer, index) => {
                return (
                  <>
                    <ListItemButton onClick={handleClick}>
                      <ListItemText primary={`layer ${index + 1}`} />
                      {open ? <ExpandLess /> : <ExpandMore />}
                    </ListItemButton>
                    <Collapse in={open} timeout="auto" unmountOnExit>
                      <List component="div" disablePadding>
                        {layer.map((shape) => {
                          return (
                            <>
                              <ListItemButton sx={{ pl: 4 }}>
                                <ListItemIcon></ListItemIcon>
                                <ListItemText primary={shape.name} />
                              </ListItemButton>
                            </>
                          );
                        })}
                      </List>
                    </Collapse>
                  </>
                );
              })}
          </List>
        </div>
      </div>
      <div className={styles.image}>
        <MyImage />
      </div>
    </div>
  );
};
