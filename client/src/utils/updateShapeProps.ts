

export const updateShapeProps = (canvas, figureProps) => {
    canvas.selectedShape.canvas.selectedShape.fillColor = figureProps.fillColor;
    canvas.selectedShape.canvas.selectedShape.strokeColor = figureProps.strokeColor;
    canvas.selectedShape.canvas.selectedShape.borderWidth = figureProps.borderWidth;
    canvas.selectedShape.canvas.selectedShape.displayStroke = figureProps.displayStroke;
    canvas.selectedShape.canvas.selectedShape.displayFill = figureProps.displayFill;
}