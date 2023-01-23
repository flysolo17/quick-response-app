import React, { useState, useEffect } from "react";
import Table from "@mui/material/Table";
import Typography from "@mui/material/Typography";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { useAuth } from "../context/AuthContext";
import { Users } from "../model/Users";
import CircularProgress from "@mui/material/CircularProgress";
import {
  collection,
  doc,
  getDoc,
  onSnapshot,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { firestore } from "../config/config";
import { studentConverter, Students } from "../model/Students";
import {
  endOfMonth,
  formatTimestamp,
  inOrOut,
  startOfMonth,
} from "../utils/Constants";
import Box from "@mui/material/Box";

interface DailyReportTableProps {
  month: number;
}

const DailyReportTable: React.FunctionComponent<DailyReportTableProps> = (
  props
) => {
  const { month } = props;
  const [loading, setLoading] = useState(false);
  const { currentUser } = useAuth();
  const [attendance, setAttendance] = useState<any[]>([]);
  const [student, setStudent] = useState<Students>({
    firstName: "",
    middleName: "",
    lastName: "",
    studentID: "",
    pin: "",
    createdAt: 0,
  });
  useEffect(() => {
    console.log("start", new Date(startOfMonth(month)).toLocaleString());
    console.log("end", new Date(endOfMonth(month)).toLocaleString());
    if (currentUser !== null) {
      const ref = collection(
        firestore,
        "Users",
        currentUser!.uid,
        "Attendance"
      );
      const q = query(
        ref,
        where("timestamp", ">=", startOfMonth(month)),
        where("timestamp", "<=", endOfMonth(month)),
        orderBy("timestamp", "desc")
      );
      const unsub = onSnapshot(q, (snapshot) => {
        let data: any[] = [];
        snapshot.forEach((document) => {
          if (document !== undefined) {
            const docRef = doc(
              firestore,
              "Users",
              currentUser!.uid,
              "Students",
              document.data()["studentID"]
            ).withConverter(studentConverter);
            setLoading(true);
            getDoc(docRef)
              .then((snap) => {
                if (snap.exists()) {
                  data.push({
                    ...document.data(),
                    id: document.id,
                    student: snap.data(),
                  });
                  console.log("done");
                } else {
                  data.push({
                    ...document.data(),
                    id: document.id,
                    student: student,
                  });
                }
              })
              .catch((error) => {
                console.log(error);
              })
              .finally(() => {
                setLoading(false);
              });
          }
        });
        setAttendance(data);
      });
      return () => unsub();
    }
  }, []);
  if (loading)
    return (
      <Box
        sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}
      >
        <CircularProgress color="success" />
      </Box>
    );

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell align="left">ID number</TableCell>
            <TableCell align="right">Time</TableCell>
            <TableCell align="right">IN/OUT</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {attendance.length > 0 ? (
            attendance.map((row) => (
              <TableRow
                key={row.id}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  {row.student.firstName} {row.student.middleName}{" "}
                  {row.student.lastName}
                </TableCell>
                <TableCell align="left">{row.studentID}</TableCell>
                <TableCell align="right">
                  {" "}
                  {formatTimestamp(row.timestamp)}
                </TableCell>
                <TableCell align="right"> {inOrOut(row.inSchool)}</TableCell>
              </TableRow>
            ))
          ) : (
            <TableCell align="center" colSpan={4}>
              No Report{" "}
            </TableCell>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default DailyReportTable;
