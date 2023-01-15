import * as React from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../config/config";
import KeyIcon from "@mui/icons-material/Key";

interface ForgotPasswordProps {}

const ForgotPassword: React.FunctionComponent<ForgotPasswordProps> = () => {
  const [open, setOpen] = React.useState(false);
  const [email, setEmail] = React.useState("");
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  const handleSubmit = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();
    try {
      await sendPasswordResetEmail(auth, email);
      handleClose();
      alert("Success");
    } catch {
      alert("error");
    }
  };

  return (
    <div>
      <Button
        variant="text"
        fullWidth
        disableElevation
        onClick={handleClickOpen}
      >
        Forgot Password
      </Button>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Forgot Password?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Email your email and we will send you change password link..
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Email Address"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            fullWidth
            variant="standard"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={(e) => handleSubmit(e)}>Send</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default ForgotPassword;
