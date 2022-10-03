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

import Stack from "@mui/material/Stack";
import DeleteIcon from "@mui/icons-material/Delete";
import IconButton from "@mui/material/IconButton";
import CustomizedDialogs from "../dialog/AddSubject";

import { useAuth } from "../context/AuthContext";
import {
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";
import { firestore } from "../config/config";
import { Alert, Snackbar, Typography } from "@mui/material";
import SubjectDialog from "../dialog/SubjectDialog";
import { Subjects } from "../model/Subjects";
import UpdateSubjectDialog from "../dialog/UpdateSubject";
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

interface ISubjectTableProps {}
const SubjectTable: React.FunctionComponent<ISubjectTableProps> = (props) => {
  const [subjects, setSubjects] = useState<any[]>([]);
  const { currentUser } = useAuth();
  const [open, setOpen] = useState(false);
  const [subjectId, setSubjectId] = useState("");
  const [subjectSelected, setSubjectSeleted] = useState<Subjects | null>(null);
  const handleClickOpen = (subjectId: string, subject: Subjects) => {
    setSubjectId(subjectId);
    setSubjectSeleted(subject);
    setOpen(true);
  };

  const handleClose = () => {
    setSubjectSeleted(null);
    setSubjectId("");
    setOpen(false);
  };
  useEffect(() => {
    if (currentUser != null) {
      const subjectReference = collection(firestore, "Subjects");
      const subjectQuery = query(
        subjectReference,
        where("teacher", "==", currentUser.uid)
      );
      const unsubscribe = onSnapshot(subjectQuery, (snapshot) => {
        let data: any[] = [];
        snapshot.forEach((doc) => {
          data.push({ ...doc.data(), id: doc.id });
        });
        setSubjects(data);
        console.log(subjects);
      });
      return () => unsubscribe();
    }
  }, []);
  const deleteSubject = async (subjectId: string) => {
    await deleteDoc(doc(firestore, "Subjects", subjectId));
  };
  return (
    <>
      <Stack
        direction={"row"}
        sx={{
          display: "flex",
          alignItems: "center",
          margin: 1,
          justifyContent: "space-between",
        }}
      >
        <Typography variant="h5">My Subjects</Typography>
        <CustomizedDialogs />
      </Stack>
      <TableContainer component={Paper} sx={{ height: 700 }}>
        <Table
          sx={{
            minWidth: 800,
            maxHeight: 900,
            textAlign: "center",
          }}
          stickyHeader
          aria-label="sticky table"
        >
          <TableHead>
            <TableRow>
              <StyledTableCell>Name</StyledTableCell>
              <StyledTableCell align="center">Desc</StyledTableCell>
              <StyledTableCell align="center">Date Created</StyledTableCell>
              <StyledTableCell align="right">Actions</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {subjects.length > 0 ? (
              subjects.map((row) => (
                <StyledTableRow key={row.id}>
                  <StyledTableCell component="th" scope="row">
                    {row.name}
                  </StyledTableCell>
                  <StyledTableCell align="center">{row.desc}</StyledTableCell>
                  <StyledTableCell align="center">
                    {row.createdAt.toDate().toDateString()}
                  </StyledTableCell>
                  <StyledTableCell align="right">
                    <Button onClick={() => handleClickOpen(row.id, row)}>
                      View
                    </Button>
                    <IconButton
                      aria-label="delete"
                      size="large"
                      color="error"
                      onClick={() => deleteSubject(row.id)}
                    >
                      <DeleteIcon fontSize="inherit" />
                    </IconButton>
                    <UpdateSubjectDialog subject={row} subjectId={row.id} />
                  </StyledTableCell>
                </StyledTableRow>
              ))
            ) : (
              <StyledTableCell align="center" colSpan={5}>
                <Typography align="center">No Subjects yet!</Typography>
              </StyledTableCell>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <SubjectDialog
        isOpen={open}
        isClose={handleClose}
        subjectId={subjectId}
        subject={subjectSelected}
      />
    </>
  );
};

export default SubjectTable;
