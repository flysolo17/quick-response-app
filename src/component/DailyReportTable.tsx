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
  attendance: any[];
}

const DailyReportTable: React.FunctionComponent<DailyReportTableProps> = (
  props
) => {
  const { attendance } = props;

  return (
    <TableContainer component={Paper}>
      <Table
        sx={{ width: "100%", maxHeight: "100vh" }}
        size="small"
        aria-label="a dense table"
      >
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
