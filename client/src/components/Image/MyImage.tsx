import { FC, useEffect, useState } from "react";
import { Button, Input } from "@mui/material";
import styles from "./MyImage.module.scss";
import { useDispatch, useSelector } from "react-redux";
import { setImageFilters, setImageURL } from "@/store/slices/dataSlice";

export const MyImage: FC = () => {
  const dispatch = useDispatch();
  const imageURL = useSelector((state) => state.data.imageURL);
  const imageFilters = useSelector((state) => state.data.imageFilters);

  const [file, setFile] = useState<string | null>(imageURL);
  //Filters
  const [blur, setBlur] = useState<number>(
    parseImageFilters(imageFilters).blur
  ); // 0 - 100
  const [brightness, setBrightness] = useState<number>(
    parseImageFilters(imageFilters).brightness
  ); // 0 - 200
  const [contrast, setContrast] = useState<number>(
    parseImageFilters(imageFilters).contrast
  ); // 0 - 200
  const [grayScale, setGrayScale] = useState<number>(
    parseImageFilters(imageFilters).grayScale
  ); // 0 - 100
  const [invert, setInvert] = useState<number>(
    parseImageFilters(imageFilters).invert
  ); // 0 - 100
  const [opacity, setOpacity] = useState<number>(
    parseImageFilters(imageFilters).opacity
  ); //0 - 100
  const [saturate, setSaturate] = useState<number>(
    parseImageFilters(imageFilters).saturate
  ); // 0 - 100
  const [sepia, setSepia] = useState<number>(
    parseImageFilters(imageFilters).sepia
  ); // 0 - 100

  function parseImageFilters(filtersString: string) {
    let filters = {
      blur: 0,
      brightness: 100,
      contrast: 100,
      grayScale: 0,
      invert: 0,
      opacity: 100,
      saturate: 100,
      sepia: 0,
    };

    if (filtersString === "" || filtersString === "none") {
      return filters;
    }

    const regex = /(\w+)\(([^\)]+)\)/g;
    let match;

    while ((match = regex.exec(filtersString)) !== null) {
      const [, property, value] = match;
      filters[property] = parseFloat(value);
    }

    return filters;
  }

  useEffect(() => {
    handleImageURL(file);
  }, [file]);

  useEffect(() => {
    handleImageFilters(getFiltersString());
  }, [blur, brightness, contrast, grayScale, invert, opacity, saturate, sepia]);

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

  function getFiltersString() {
    return `blur(${blur}px) brightness(${brightness}%) contrast(${contrast}%) grayscale(${grayScale}%) invert(${invert}%) opacity(${opacity}%) saturate(${saturate}%) sepia(${sepia}%)`;
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
        <span className={styles.title}>Choose from local files:</span>
        <label htmlFor="upload-photo">
          <input
            style={{ display: "none" }}
            id="upload-photo"
            name="upload-photo"
            type="file"
            onChange={(e) => handleChange(e)}
          />

          <Button
              color="primary"
              variant="contained"
              component="span"
              sx={{ marginBottom: '10px', width: '100%' }}
              className={styles.uploadButton}
          >
            Upload button
          </Button>
        </label>
      </div>
      {/*TODO: may be some validation for url?*/}
      <div style={{ marginBottom: '20px'}}>
        <span className={styles.title}>or enter the link to photo:</span>
        <input
          className={styles.inputText}
          value={file!}
          onChange={(e) => setFile(e.target.value)}
          type="url"
          style={{ width: '90%' }}
        />
      </div>

      <div>
        <h4>Filters</h4>

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
            style={{ width: '100%', marginBottom: '15px' }}
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
            style={{ width: '100%', marginBottom: '15px' }}
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
            style={{ width: '100%', marginBottom: '15px' }}
          ></input>
        </div>

        <div>
          <h5>Grey scale:</h5>
          <input
            disabled={!file || file === ""}
            type="range"
            onChange={(e) => setGrayScale(Number(e.target.value))}
            min={0}
            max={100}
            step={1}
            value={grayScale}
            style={{ width: '100%', marginBottom: '15px' }}
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
            style={{ width: '100%', marginBottom: '15px' }}
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
            style={{ width: '100%', marginBottom: '15px' }}
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
            style={{ width: '100%', marginBottom: '15px' }}
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
            style={{ width: '100%', marginBottom: '15px' }}
          ></input>
        </div>
      </div>
    </div>
  );
};
