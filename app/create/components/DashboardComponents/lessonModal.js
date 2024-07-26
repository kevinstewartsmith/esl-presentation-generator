import * as React from "react";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import InputWithIcon from "@app/create/components/PresentationPrep/AddTextButtons/InputWithIcon";
import FreeSoloDropDown from "@app/create/components/PresentationPrep/AddTextButtons/FreeSoloDropDown";

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

export default function LessonModal({
  open,
  handleClose,
  handleOpen,
  addButtonPressed,
}) {
  return (
    <div>
      {/* <Button onClick={handleOpen}>Open modal</Button> */}
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
          <InputWithIcon />
          <FreeSoloDropDown />
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
    </div>
  );
}
