import { FC, useEffect, useState } from "react";
import { Button, Input } from "@mui/material";
import styles from "./MyImage.module.scss";
import { useDispatch, useSelector } from "react-redux";
import { setImageFilters, setImageURL } from "@/store/slices/dataSlice";
import { CanvasClass } from "@/data/Canvas";

//TODO: type for state?
export const MyImage: FC = () => {
  const dispatch = useDispatch();
  const imageURL = useSelector((state) => state.data.imageURL);
  const imageFilters = useSelector((state) => state.data.imageFilters);

  const [file, setFile] = useState<string | null>();
  //Filters
  const [blur, setBlur] = useState<number>(0); // 0 - 100
  const [brightness, setBrightness] = useState<number>(100); // 0 - 200
  const [contrast, setContrast] = useState<number>(100); // 0 - 200
  const [greyScale, setGreyScale] = useState<number>(0); // 0 - 100
  const [invert, setInvert] = useState<number>(0); // 0 - 100
  const [opacity, setOpacity] = useState<number>(100); //0 - 100
  const [saturate, setSaturate] = useState<number>(100); // 0 - 100
  const [sepia, setSepia] = useState<number>(0); // 0 - 100

  useEffect(() => {
    handleImageURL(file);
  }, [file]);

  useEffect(() => {
    handleImageFilters(getFiltersString());
  }, [blur, brightness, contrast, greyScale, invert, opacity, saturate, sepia]);

  function handleChange(e) {
    let resp = URL.createObjectURL(e.target.files[0]);
    isBlobOrObjectUrl(resp) ? setFile(resp) : setFile("");
  }

  const handleImageURL = (url) => {
    dispatch(setImageURL(url));
  };

  const handleImageFilters = (filters) => {
    dispatch(setImageFilters(filters));
  };

  console.log(getFiltersString());
  function getFiltersString() {
    return `blur(${blur}) brightness(${brightness}%) contrast(${contrast}%) grayscale(${greyScale}%) invert(${invert}%) opacity(${opacity}%) saturate(${saturate}%) sepia(${sepia}%)`;
  }

  const blobObjectUrlRegex =
    /^blob:(?<origin>[\w\+]+:\/\/(?=.{1,254}(?::|$))(?:(?!\d|-)(?![a-z0-9\-]{1,62}-(?:\.|:|$))[a-z0-9\-]{1,63}\b(?!\.$)\.?)+(:\d+)?)\/(?<uuid>[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})$/;

  function isBlobOrObjectUrl(url) {
    return typeof url === "string" && blobObjectUrlRegex.test(url);
  }

  return (
    <div className={styles.container}>
      <h2 className={styles.header}>Image</h2>

      <div>
        <h4 className={styles.title}>Choose from local files:</h4>
        <label htmlFor="upload-photo">
          <input
            style={{ display: "none" }}
            id="upload-photo"
            name="upload-photo"
            type="file"
            onChange={(e) => handleChange(e)}
          />

          <Button color="secondary" variant="contained" component="span">
            Upload button
          </Button>
        </label>
      </div>
      {/*TODO: may be some validation for url?*/}
      <div>
        <h4>or enter the link to photo:</h4>
        <input
          className={styles.inputText}
          value={file!}
          onChange={(e) => setFile(e.target.value)}
          type="url"
        />
      </div>

      <div>
        <h4>Apply filters</h4>

        <div>
          <h5>Blur:</h5>
          <input
            disabled={!file || file === ""}
            type="range"
            onChange={(e) => setBlur(Number(e.target.value))}
            min={0}
            max={100}
            step={1}
            value={blur}
          ></input>
        </div>

        <div>
          <h5>Brightness:</h5>
          <input
            disabled={!file || file === ""}
            type="range"
            onChange={(e) => setBrightness(Number(e.target.value))}
            min={0}
            max={200}
            step={1}
            value={brightness}
          ></input>
        </div>

        <div>
          <h5>Contrast:</h5>
          <input
            disabled={!file || file === ""}
            type="range"
            onChange={(e) => setContrast(Number(e.target.value))}
            min={0}
            max={200}
            step={1}
            value={contrast}
          ></input>
        </div>

        <div>
          <h5>Grey scale:</h5>
          <input
            disabled={!file || file === ""}
            type="range"
            onChange={(e) => setGreyScale(Number(e.target.value))}
            min={0}
            max={100}
            step={1}
            value={greyScale}
          ></input>
        </div>

        <div>
          <h5>Invert:</h5>
          <input
            disabled={!file || file === ""}
            type="range"
            onChange={(e) => setInvert(Number(e.target.value))}
            min={0}
            max={100}
            step={1}
            value={invert}
          ></input>
        </div>

        <div>
          <h5>Opacity:</h5>
          <input
            disabled={!file || file === ""}
            type="range"
            onChange={(e) => setOpacity(Number(e.target.value))}
            min={0}
            max={100}
            step={1}
            value={opacity}
          ></input>
        </div>

        <div>
          <h5>Saturate:</h5>
          <input
            disabled={!file || file === ""}
            type="range"
            onChange={(e) => setSaturate(Number(e.target.value))}
            min={0}
            max={100}
            step={1}
            value={saturate}
          ></input>
        </div>

        <div>
          <h5>Sepia:</h5>
          <input
            disabled={!file || file === ""}
            type="range"
            onChange={(e) => setSepia(Number(e.target.value))}
            min={0}
            max={100}
            step={1}
            value={sepia}
          ></input>
        </div>
      </div>
    </div>
  );
};
