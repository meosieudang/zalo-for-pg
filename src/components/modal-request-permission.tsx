import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Slide from "@mui/material/Slide";
import { TransitionProps } from "@mui/material/transitions";
import resume from "../static/icons/resume.png";
import { Typography } from "@mui/material";
import usePermissionZalo from "../hooks/usePermissionZalo";

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const ModalRequestPermission = React.forwardRef<
  { toggle: () => void },
  { onAccept: () => void }
>(({ onAccept }, ref) => {
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  React.useImperativeHandle(ref, () => ({
    toggle: () => setOpen(!open),
  }));

  return (
    <Dialog
      open={open}
      TransitionComponent={Transition}
      keepMounted
      onClose={handleClose}
      aria-describedby="alert-dialog-slide-description"
    >
      <DialogTitle display="flex" flexDirection="column">
        <img
          style={{
            width: 60,
            height: 60,
            alignSelf: "center",
          }}
          src={resume}
          loading="lazy"
        />
      </DialogTitle>
      <DialogContent>
        <Typography variant="h6" textAlign={"center"}>
          {"Đăng kí mới"}
        </Typography>
        <DialogContentText id="alert-dialog-slide-description">
          Cho phép truy cập thông tin người dùng, số điện thoại cho CREGift để
          sử dụng tính năng đổi quà
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onAccept}>Xác nhận</Button>
        <Button onClick={handleClose}>Để sau</Button>
      </DialogActions>
    </Dialog>
  );
});

export default ModalRequestPermission;
