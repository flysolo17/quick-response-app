import Button from "@mui/material/Button";
import { styled } from "@mui/material/styles";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import TextField from "@mui/material/TextField";
import DialogContentText from "@mui/material/DialogContentText";
import { Subjects } from "../model/Subjects";
import { useAuth } from "../context/AuthContext";
import { firestore } from "../config/config";
import { doc, setDoc } from "firebase/firestore";
import EditIcon from "@mui/icons-material/Edit";
import React, { useState } from "react";

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialogContent-root": {
    padding: theme.spacing(2),
  },
  "& .MuiDialogActions-root": {
    padding: theme.spacing(1),
  },
}));

export interface DialogTitleProps {
  id: string;
  children?: React.ReactNode;
  onClose: () => void;
}

const BootstrapDialogTitle = (props: DialogTitleProps) => {
  const { children, onClose, ...other } = props;
  return (
    <DialogTitle sx={{ m: 0, p: 2 }} {...other}>
      {children}
      {onClose ? (
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      ) : null}
    </DialogTitle>
  );
};

interface UpdateSubjectDialogProps {
  subject: Subjects;
  subjectId: string;
}

const UpdateSubjectDialog: React.FunctionComponent<UpdateSubjectDialogProps> = (
  props
) => {
  const [open, setOpen] = useState(false);
  const { currentUser } = useAuth();
  const { subject, subjectId } = props;
  const [newSubject, setNewSubject] = useState<Subjects>({
    name: subject.name,
    desc: subject.desc,
    teacher: subject.teacher,
    createdAt: subject.createdAt,
  });
  const addSubject = async () => {
    if (currentUser?.uid != null) {
      await setDoc(doc(firestore, "Subjects", subjectId), {
        ...newSubject,
        createdAt: new Date(),
        teacher: currentUser.uid,
      });
      setOpen(false);
    }
  };
  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };
  return (
    <>
      <IconButton
        aria-label="delete"
        size="large"
        color="success"
        onClick={handleClickOpen}
      >
        <EditIcon fontSize="inherit" />
      </IconButton>
      <BootstrapDialog
        onClose={handleClose}
        aria-labelledby="customized-dialog-title"
        open={open}
      >
        <BootstrapDialogTitle
          id="customized-dialog-title"
          onClose={handleClose}
        >
          Update
        </BootstrapDialogTitle>
        <DialogContent dividers>
          <DialogContentText>Please fill up all forms.</DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Name"
            value={newSubject.name}
            onChange={(e) =>
              setNewSubject({ ...newSubject, name: e.target.value })
            }
            fullWidth
            variant="standard"
          />
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Description"
            fullWidth
            variant="standard"
            value={newSubject.desc}
            onChange={(e) =>
              setNewSubject({ ...newSubject, desc: e.target.value })
            }
          />
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={addSubject}>
            Update
          </Button>
        </DialogActions>
      </BootstrapDialog>
    </>
  );
};

export default UpdateSubjectDialog;
