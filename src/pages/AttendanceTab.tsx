import React, { useEffect, useState } from "react";
import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import Stack from "@mui/material/Stack";
import DeleteIcon from "@mui/icons-material/Delete";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import IconButton from "@mui/material/IconButton";
import CustomizedDialogs from "../dialog/AddSubject";
import { Tab } from "@mui/icons-material";
import { useAuth } from "../context/AuthContext";
import {
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  Timestamp,
  where,
} from "firebase/firestore";
import { firestore } from "../config/config";
import { Alert, Snackbar, Typography } from "@mui/material";
import SubjectDialog from "../dialog/SubjectDialog";
import { Subjects } from "../model/Subjects";
import { Attendance } from "../model/Attendance";
import { time } from "console";
import Moment from "react-moment";
import CopyToClipBoardComponent from "../component/CopyToClipboard";
import AttendanceDialog from "../dialog/AttendanceDialog";
const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

interface ISubjectTableProps {
  subjectId: string;
}
const AttendancePage: React.FunctionComponent<ISubjectTableProps> = (props) => {
  const { subjectId } = props;
  const [attendanceArray, setAttendanceArray] = useState<any[]>([]);
  useEffect(() => {
    const reference = collection(firestore, "Attendance");
    const attendanceQuery = query(
      reference,
      where("subjectID", "==", subjectId)
    );
    const unsubscribe = onSnapshot(attendanceQuery, (snapshot) => {
      let data: any[] = [];
      snapshot.forEach((doc) => {
        data.push({ ...doc.data(), id: doc.id });
      });
      setAttendanceArray(data);
      console.log(data);
    });
    return () => unsubscribe();
  }, []);
  const deleteAttendance = async (attendanceId: string) => {
    await deleteDoc(doc(firestore, "Attendance", attendanceId));
  };
  return (
    <>
      <TableContainer component={Paper} sx={{ height: 700 }}>
        <Table
          sx={{
            minWidth: "100%",
            maxHeight: 800,
            textAlign: "center",
          }}
          stickyHeader
          aria-label="sticky table"
        >
          <TableHead>
            <TableRow>
              <StyledTableCell>Attendance ID</StyledTableCell>
              <StyledTableCell align="center">Attendees</StyledTableCell>
              <StyledTableCell align="center">Date Created</StyledTableCell>
              <StyledTableCell align="right">Actions</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {attendanceArray.length > 0 ? (
              attendanceArray.map((row) => (
                <StyledTableRow key={row.id}>
                  <StyledTableCell component="th" scope="row">
                    {row.id}
                    <CopyToClipBoardComponent text={row.id} />
                  </StyledTableCell>
                  <StyledTableCell align="center">
                    {row.attendees.length}
                  </StyledTableCell>
                  <StyledTableCell align="center">
                    {row.createdAt.toDate().toDateString()}
                  </StyledTableCell>
                  <StyledTableCell align="right">
                    <Stack direction={"row"}>
                      <AttendanceDialog
                        attendance={row}
                        attendanceId={row.id}
                      />
                      <IconButton
                        aria-label="delete"
                        size="large"
                        color="error"
                        onClick={() => deleteAttendance(row.id)}
                      >
                        <DeleteIcon fontSize="inherit" />
                      </IconButton>
                    </Stack>
                  </StyledTableCell>
                </StyledTableRow>
              ))
            ) : (
              <StyledTableCell align="center" colSpan={5}>
                <Typography align="center">No attendance!</Typography>
              </StyledTableCell>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
};

export default AttendancePage;
