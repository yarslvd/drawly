import { useState } from "react";
import { useRouter } from "next/router";
import { IconButton } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import DoneIcon from "@mui/icons-material/Done";

import styles from "./CanvasCard.module.scss";

export const CanvasCard = () => {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [cardName, setCardName] = useState("Card name");

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleInputChange = (e) => {
    setCardName(e.target.value);
  };

  const handleSaveClick = () => {
    setIsEditing(false);
  };

  return (
    <div>
      <div className={styles.container}>
        <div
          className={styles.image}
          style={{
            backgroundImage: `url(https://i.ibb.co/87r99Kb/272ebe31be92.png)`,
          }}
          onClick={() => router.push("https://www.google.com")}
        ></div>
        {isEditing ? (
          <input
            type="text"
            value={cardName}
            onChange={handleInputChange}
            onBlur={handleSaveClick}
            className={styles.input}
          />
        ) : (
          <h3>{cardName}</h3>
        )}
        <IconButton className={styles.deleteIcon}>
          <DeleteIcon sx={{ color: "#fff" }} />
        </IconButton>
        {isEditing ? (
          <IconButton className={styles.editName} onClick={handleSaveClick}>
            <DoneIcon sx={{ color: "#fff" }} />
          </IconButton>
        ) : (
          <IconButton className={styles.editName} onClick={handleEditClick}>
            <EditIcon sx={{ color: "#fff" }} />
          </IconButton>
        )}
      </div>
    </div>
  );
};
