import React, { useState } from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";

import CloseIcon from "@mui/icons-material/Close";
import Slide from "@mui/material/Slide";
import { TransitionProps } from "@mui/material/transitions";
import { Subjects } from "../model/Subjects";
import { Alert, Box, Paper, Snackbar, Stack } from "@mui/material";

import IconButton from "@mui/material/IconButton";

import Typography from "@mui/material/Typography";

import AttendancePage from "../pages/AttendanceTab";
import { firestore } from "../config/config";
import { addDoc, collection } from "firebase/firestore";

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

interface ISubjectDialogProps {
  isOpen: boolean;
  isClose: () => void;
  subjectId: string;
  subject: Subjects | null;
}

const SubjectDialog: React.FunctionComponent<ISubjectDialogProps> = (props) => {
  const { isOpen, isClose, subjectId, subject } = props;
  const [open, setOpen] = useState({
    open: false,
    message: "",
  });
  const generateAttendance = async () => {
    await addDoc(collection(firestore, "Attendance"), {
      subjectID: subjectId,
      teacher: subject?.teacher,
      attendees: [],
      createdAt: new Date(),
    });
  };
  return (
    <div>
      <Dialog
        fullScreen
        open={isOpen}
        onClose={isClose}
        TransitionComponent={Transition}
      >
        <AppBar sx={{ position: "relative" }}>
          <Toolbar>
            <IconButton
              edge="start"
              color="inherit"
              onClick={isClose}
              aria-label="close"
            >
              <CloseIcon />
            </IconButton>
            <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
              Attendance
            </Typography>
          </Toolbar>
        </AppBar>
        <Box
          sx={{
            height: "93vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "start",
            flexDirection: "column",
            padding: 5,
            textAlign: "left",
          }}
        >
          <Stack
            direction={"row"}
            sx={{
              width: "70%",
              margin: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <div>
              <Typography textAlign={"left"} variant={"h5"}>
                {subject?.name}
              </Typography>
              <Typography>{subject?.desc}</Typography>
            </div>

            <Button variant="contained" onClick={generateAttendance}>
              Generate Attendance
            </Button>
          </Stack>

          <Paper sx={{ width: "70%", height: 600 }} elevation={2}>
            <AttendancePage subjectId={subjectId} />
          </Paper>
        </Box>
      </Dialog>

      <Stack>
        <Snackbar
          open={open.open}
          autoHideDuration={2000}
          onClose={() => setOpen({ ...open, open: false })}
          message={open.message}
        >
          <Alert severity="success" sx={{ width: "100%" }}>
            This is a success message!
          </Alert>
        </Snackbar>
      </Stack>
    </div>
  );
};

export default SubjectDialog;
