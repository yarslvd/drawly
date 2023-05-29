import { useState } from "react";
import { useRouter } from "next/router";
import { IconButton } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import DoneIcon from "@mui/icons-material/Done";

import styles from "./CanvasCard.module.scss";
import {
  useDeleteCanvasMutation,
  useUpdateCanvasMutation,
} from "@/store/api/fetchCanvasApi";
import { unmountComponentAtNode } from "react-dom";

export const CanvasCard = ({ canvas, refetchCanvases }) => {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [cardName, setCardName] = useState(canvas.title);

  const [updateCanvas] = useUpdateCanvasMutation();
  const [deleteCanvas] = useDeleteCanvasMutation();

  const handleDeleteClick = async () => {
    await deleteCanvas({ id: canvas.id });
    await refetchCanvases();
  };

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleInputChange = (e) => {
    setCardName(e.target.value);
  };

  const handleSaveClick = async () => {
    setIsEditing(false);

    console.log({ id: canvas.id, title: cardName });
    await updateCanvas({ id: canvas.id, title: cardName });
  };

  return (
    <div>
      <div className={styles.container}>
        <div
          className={styles.image}
          style={{
            backgroundImage: `url(${canvas.preview})`,
          }}
          onClick={() => router.push("/canvas/" + canvas.id)}
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
        <IconButton className={styles.deleteIcon} onClick={handleDeleteClick}>
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
