import {
  Box,
  Stack,
  Typography,
  Container,
  CircularProgress,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { firestore } from "../config/config";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { MobileDatePicker } from "@mui/x-date-pickers/MobileDatePicker";
import { userConverter, Users } from "../model/Users";
import AttendanceTable from "../component/AttendanceTable";
import { studentConverter, Students } from "../model/Students";
import { countInSchool, countNotInSchool } from "../utils/Constants";
import TextField from "@mui/material/TextField";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs, { Dayjs } from "dayjs";
import DailyReportTable from "../component/DailyReportTable";

interface DailyRecordPageProps {}

const DailyRecordPage: React.FunctionComponent<DailyRecordPageProps> = () => {
  const [users, setUsers] = useState<Users | null>(null);
  const [loading, setLoading] = useState(false);
  const { currentUser } = useAuth();
  const [studentCounter, setStudentCounter] = useState(0);
  const [attendance, setAttendance] = useState<any[]>([]);
  const [student, setStudent] = useState<Students>({
    firstName: "",
    middleName: "",
    lastName: "",
    studentID: "",
    pin: "",
    createdAt: 0,
  });
  const [value, setValue] = React.useState<Dayjs | null>(dayjs(new Date()));
  const handleChange = (newValue: Dayjs | null) => {
    setValue(newValue);
  };
  const [valueEnd, setValueEnd] = React.useState<Dayjs | null>(
    dayjs(new Date())
  );
  const handleChangeEnd = (newValue: Dayjs | null) => {
    setValueEnd(newValue);
  };
  useEffect(() => {
    if (currentUser !== null) {
      const ref = collection(
        firestore,
        "Users",
        currentUser!.uid,
        "Attendance"
      );
      const q = query(
        ref,
        where("timestamp", ">=", value!.startOf("day").toDate().getTime()),
        where("timestamp", "<=", valueEnd!.endOf("day").toDate().getTime()),
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
  }, [value]);
  useEffect(() => {
    if (currentUser !== null) {
      const ref = collection(firestore, "Users", currentUser.uid, "Students");
      getDocs(ref).then((snapshot) => {
        let total_count: number = 0;
        snapshot.forEach((doc) => {
          if (snapshot != undefined) {
            total_count += 1;
            console.log(total_count);
          }
        });
        setStudentCounter(total_count);
      });
    }
  }, []);
  useEffect(() => {
    if (currentUser !== null) {
      const ref = doc(firestore, "Users", currentUser!.uid).withConverter(
        userConverter
      );
      const unsub = onSnapshot(ref, (snapshot) => {
        if (snapshot.exists()) {
          setUsers(snapshot.data());
          console.log("user fetch");
        }
      });
      return () => unsub();
    }
  }, []);
  if (loading)
    return (
      <Container
        sx={{
          width: "100%",
          height: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <CircularProgress />
      </Container>
    );
  return (
    <Stack
      sx={{
        padding: "1rem",
        height: "100vh",
        overflow: "hidden",
        backgroundColor: "#0000008a",
      }}
      direction={"column"}
      spacing={"10px"}
    >
      <Stack
        sx={{
          backgroundColor: "white",
          width: "30%",
          padding: "1rem",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: "10px",
        }}
        direction={"row"}
        spacing={2}
      >
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <MobileDatePicker
            label="Pick start date"
            inputFormat="MM/DD/YYYY"
            value={value}
            onChange={handleChange}
            renderInput={(params) => (
              <TextField {...params} color={"success"} />
            )}
          />
        </LocalizationProvider>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <MobileDatePicker
            label="Pick start date"
            inputFormat="MM/DD/YYYY"
            value={valueEnd}
            onChange={handleChangeEnd}
            renderInput={(params) => (
              <TextField {...params} color={"success"} />
            )}
          />
        </LocalizationProvider>
      </Stack>
      {<DailyReportTable attendance={attendance} />}
    </Stack>
  );
};

export default DailyRecordPage;
