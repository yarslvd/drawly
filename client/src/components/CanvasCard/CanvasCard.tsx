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
            backgroundImage: `url(https://images.unsplash.com/photo-1682685797736-dabb341dc7de?ixlib=rb-4.0.3&ixid=M3wxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80)`,
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
