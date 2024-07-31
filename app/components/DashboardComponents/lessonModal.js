import React, { useState } from "react";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import InputWithIcon from "@app/components/PresentationPrep/AddTextButtons/InputWithIcon";
import FreeSoloDropDown from "@app/components/PresentationPrep/AddTextButtons/FreeSoloDropDown";
import TextField from "@mui/material/TextField";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 500,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

export default function LessonModal({ open, handleClose, addLesson }) {
  const [lessonTitle, setLessonTitle] = useState("");

  function handleChange(e) {
    setLessonTitle(e.target.value);
  }
  function addButtonPressed() {
    addLesson(lessonTitle);
    setLessonTitle("");
  }

  return (
    <Modal
      keepMounted
      open={open}
      onClose={handleClose}
      aria-labelledby="keep-mounted-modal-title"
      aria-describedby="keep-mounted-modal-description"
    >
      <Box sx={style}>
        <Typography
          id="keep-mounted-modal-title"
          variant="h6"
          component="h2"
          color={"black"}
        >
          Ready, set, plan!
        </Typography>
        <div style={{ width: "100%", margin: 30 }}>
          <TextField
            id="input-with-sx"
            label={"Lesson Title"}
            variant="standard"
            style={{ width: "90%", color: "black" }}
            value={lessonTitle}
            onChange={handleChange}
          />
        </div>

        <Typography
          id="keep-mounted-modal-description"
          sx={{ mt: 2 }}
          color={"black"}
        >
          Duis mollis, est non commodo luctus, nisi erat porttitor ligula.
        </Typography>
        <Button onClick={addButtonPressed}>ADD</Button>
      </Box>
    </Modal>
  );
}
