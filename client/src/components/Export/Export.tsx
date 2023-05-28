import { FC, useState } from "react";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import InputAdornment from "@mui/material/InputAdornment";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { Button } from "@mui/material";
import TextField from "@mui/material/TextField";
import { MimeExtension } from "@/types/types";
import { MimeTypes } from "@/data/Constants";
import { CanvasClass } from "@/data/Canvas";
import { useSelector } from "react-redux";
import { jsPDF } from "jspdf";

export const Export: FC = () => {
  const [type, setType] = useState(MimeTypes.PNG);
  const [filename, setFilename] = useState("");
  const canvas: CanvasClass = useSelector((state) => state.data.canvas);

  const handleExport = () => {
    let canvasHTML = canvas.canvasHTML;
    if (!canvasHTML) return;
    let name = filename + MimeExtension.get(type);

    if (type === MimeTypes.PDF) {
      handlePDFExport(canvasHTML, name);
      return;
    }
    switch (type) {
      case MimeTypes.PDF: {
        handlePDFExport(canvasHTML, name);
        return;
      }
      case MimeTypes.JPEG: {
        fillWhiteBackground(canvasHTML);
        handleImageExport(canvasHTML, name);
        return;
      }
      default: {
        handleImageExport(canvasHTML, name);
        return;
      }
    }
  };

  function handleImageExport(canvasHTML: HTMLCanvasElement, name: string) {
    let link = document.createElement("a");
    link.download = name;
    link.href = canvasHTML.toDataURL(type);
    link.click();
    return;
  }

  function handlePDFExport(canvasHTML: HTMLCanvasElement, name: string) {
    let pdf = new jsPDF("l", "px", [canvasHTML.width, canvasHTML.height]);
    fillWhiteBackground(canvasHTML);
    pdf.addImage(canvasHTML, "JPEG", 0, 0, canvasHTML.width, canvasHTML.height);
    pdf.save(name);
    return;
  }

  function fillWhiteBackground(canvasHTML: HTMLCanvasElement) {
    const context = canvasHTML.getContext("2d");
    if (!context) return;

    context.save();
    context.globalCompositeOperation = "destination-over";
    context.fillStyle = "white";
    context.fillRect(0, 0, canvasHTML.width, canvasHTML.height);
    context.restore();
  }

  return (
    <div>
      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <h3>Export</h3>
        </AccordionSummary>
        <AccordionDetails>
          <Box sx={{ minWidth: 120 }}>
            <FormControl fullWidth>
              <InputLabel id="demo-simple-select-label">Age</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={type}
                label="Type"
                onChange={(event) => setType(event.target.value)}
              >
                <MenuItem value={MimeTypes.PNG}>PNG</MenuItem>
                <MenuItem value={MimeTypes.JPEG}>JPEG</MenuItem>
                <MenuItem value={MimeTypes.WEBP}>WEBP</MenuItem>
                <MenuItem value={MimeTypes.PDF}>PDF</MenuItem>
              </Select>
            </FormControl>
          </Box>
          <TextField
            label="Filename"
            id="outlined-basic"
            value={filename}
            onChange={(event) => setFilename(event.target.value)}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  {MimeExtension.get(type)}
                </InputAdornment>
              ),
            }}
          />

          <Button variant="outlined" onClick={handleExport}>
            Export
          </Button>
        </AccordionDetails>
      </Accordion>
    </div>
  );
};
