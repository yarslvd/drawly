import { FC, useEffect, useState } from "react";

import styles from "./Menu.module.scss";

import ListSubheader from "@mui/material/ListSubheader";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import TextField from "@mui/material/TextField";
import { ToolBarItem } from "@/components/ToolBarItem/ToolBarItem";
import { Button } from "@mui/material";

import { Position } from "@/components/Position/Position";
import { Fill } from "@/components/Fill/Fill";
import { Stroke } from "@/components/Stroke/Stroke";
import { MyImage } from "@/components/Image/MyImage";
import { useDispatch, useSelector } from "react-redux";

import { Collapse } from "@mui/material";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import { CanvasClass } from "@/data/Canvas";
import { Tools } from "@/data/Constants";
import { Shape } from "@/data/Shapes/Shape";
import { Export } from "@/components/Export/Export";
import { setSelectedShape } from "@/store/slices/dataSlice";
import { TextEdit } from "@/components/TextEdit/TextEdit";
import DeleteIcon from "@mui/icons-material/Delete";

export const Menu: FC = () => {
  const currentTool = useSelector((state) => state.data.tool);
  const selectedShape = useSelector((state) => state.data.selectedShape);
  const [displayPickerFill, setDisplayPickerFill] = useState(false);
  const [displayPickerStroke, setDisplayPickerStroke] = useState(false);
  const [layers, setLayers] = useState<Shape[][]>([]);
  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const fillArrTools = ["rectangle", "ellipse"];
  const strokeArrTools = [
    Tools.RECTANGLE,
    Tools.ELLIPSE,
    Tools.LINE,
    Tools.CURVE_LINE,
    Tools.BRUSH,
    Tools.ERASER,
  ];
  const fillArrShapes = ["Rectangle", "Ellipse"];
  const strokeArrShapes = [
    "Rectangle",
    "Ellipse",
    "Line",
    "CurveLine",
    "brush",
  ];
  console.log("HERE", selectedShape, currentTool);

  const canvas: CanvasClass = useSelector((state) => state.data.canvas);
  const history: Shape[] = useSelector((state) => state.data.canvas?.history);

  // useEffect(() => {
  //   if(canvas?.layers)
  //   setLayers([...canvas.layers]);

  //   console.log("update layers")
  // }, [canvas, history]);
  useEffect(() => {
    if (canvas?.layers) {
      setLayers([...canvas.layers]);
    }
  }, [canvas?.layers]);

  const addLayer = () => {
    const newLayers = [...canvas.layers, []];
    canvas.layers = newLayers;
    canvas.history = newLayers[newLayers.length - 1];
    setLayers(newLayers);
  };

  const handleSelectLayer = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>,
    index: number
  ) => {
    canvas.history = canvas.layers[index];
    setSelectedIndex(index);
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
            isEraser={currentTool === Tools.ERASER}
          />
        )}
        {(currentTool == "image" || selectedShape == "Img") && <MyImage />}
        {selectedShape == "Text" && <TextEdit />}
      </div>
      <div>
        <Export />
      </div>
      <div className={styles.layers}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <h3>Layers</h3>
          <Button onClick={addLayer}>Add</Button>
        </div>
        <div className={styles.layersContainer}>
          <List
            sx={{
              width: "100%",
              maxWidth: 360,
              bgcolor: "background.paper",
              overflow: "auto",
              height: "180px",
            }}
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
            {layers &&
              layers.map((layer, index) => (
                <NestedList
                  layer={{ shapes: [...layer] }}
                  index={index}
                  selectLayer={handleSelectLayer}
                  selectedIndex={selectedIndex}
                  key={index}
                />
              ))}
          </List>
        </div>
      </div>
      {/*<div className={styles.image}>*/}
      {/*  <MyImage />*/}
      {/*</div>*/}
    </div>
  );
};

const NestedList: FC<{
  layer: { shapes: Shape[] };
  index: number;
  selectLayer;
  selectedIndex;
}> = ({ layer, index, selectLayer, selectedIndex }) => {
  const [refresh, setRefresh] = useState(false);
  const [open, setOpen] = useState(false);
  const [shapes, setShapes] = useState<Shape[]>(layer.shapes);
  const canvas: CanvasClass = useSelector((state) => state.data.canvas);
  const dispatch = useDispatch();

  useEffect(() => {
    setShapes(layer.shapes);
  }, [layer.shapes]);

  const handleClick = (event, index) => {
    setOpen(!open);
    selectLayer(event, index);
  };

  const handleDeleteShape = (index) => {
    console.log(canvas.history[index]);
    canvas.history.splice(index, 1);
    setRefresh(!refresh);
    canvas.redrawCanvas();
  };

  const [selectedShapeIndex, setSelectedShapeIndex] = useState<number>(-1);

  const handleSelectShape = (event, index) => {
    canvas.selectedShape = canvas.history[index];
    canvas.selectedShapeIndex = index;
    console.log(canvas.selectedShape);
    dispatch(
      setSelectedShape(
        Object.getPrototypeOf(canvas.selectedShape).constructor.name
      )
    );
    canvas.redrawCanvas();
    setSelectedShapeIndex(index);
  };

  return (
    <>
      <ListItemButton
        selected={selectedIndex === index}
        onClick={(event) => handleClick(event, index)}
      >
        <ListItemText primary={`layer ${index + 1}`} />
        {open ? <ExpandLess /> : <ExpandMore />}
      </ListItemButton>
      <Collapse in={open} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
          {shapes.map((shape, shapeIndex) => {
            return (
              <div style={{ display: "flex" }}>
                <ListItemButton
                  sx={{ pl: 4 }}
                  selected={selectedShapeIndex == shapeIndex}
                  onClick={(event) => handleSelectShape(event, shapeIndex)}
                  key={shapeIndex}
                >
                  <ListItemIcon></ListItemIcon>
                  <ListItemText primary={shape.name} />
                </ListItemButton>
                <Button onClick={() => handleDeleteShape(shapeIndex)}>
                  <DeleteIcon sx={{ color: "#000" }} />
                </Button>
              </div>
            );
          })}
        </List>
      </Collapse>
    </>
  );
};
