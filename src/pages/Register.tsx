import {
  Button,
  Grid,
  TextField,
  ButtonProps,
  Stack,
  Box,
  CircularProgress,
  RadioGroup,
  FormControl,
  FormLabel,
  FormControlLabel,
  Radio,
} from "@mui/material";
import React, { useState, useRef } from "react";
import { styled } from "@mui/material/styles";
import "../styles/auth.css";
import { grey } from "@mui/material/colors";
import { useNavigate } from "react-router-dom";
import { firestore, auth } from "../config/config";
import { setDoc, doc } from "firebase/firestore";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { flattenDiagnosticMessageText } from "typescript";
import { Users } from "../model/Users";
interface RegisterPageProps {}
interface IRegister {
  firstName: string;
  middleName: string;
  lastName: string;
  idNumber: string;
  type: string;
  email: string;
  password: string;
  loading: boolean;
  alert: {
    open: boolean;
    meesage: string;
  };
}
const RegisterPage: React.FunctionComponent<RegisterPageProps> = () => {
  const ColorButton = styled(Button)<ButtonProps>(({ theme }) => ({
    color: theme.palette.getContrastText(grey[900]),
    borderRadius: 10,
    backgroundColor: grey[900],
    "&:hover": {
      backgroundColor: grey[800],
    },
  }));
  const [istate, isetState] = useState<IRegister>({
    firstName: "",
    middleName: "",
    lastName: "",
    idNumber: "",
    type: "",
    email: "",
    password: "",
    loading: false,
    alert: {
      open: false,
      meesage: "",
    },
  });
  const timer = useRef<number>();

  const navigate = useNavigate();
  const handleButtonClick = () => {
    if (!istate.loading) {
      isetState({ ...istate, loading: true });
      timer.current = window.setTimeout(() => {
        isetState({ ...istate, loading: false });
      }, 2000);
    }
  };

  async function signUp() {
    isetState({ ...istate, loading: true });
    await createUserWithEmailAndPassword(auth, istate.email, istate.password)
      .then((userCredential) => {
        const currenUser = userCredential.user;
        let newUser: Users = {
          id: currenUser.uid,
          firstName: istate.firstName,
          middleName: istate.middleName,
          lastName: istate.lastName,
          idNumber: istate.idNumber,
          type: istate.type,
          email: istate.email,
        };
        saveUser(newUser);
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        isetState({
          ...istate,
          alert: {
            open: true,
            meesage: errorCode + " " + errorMessage,
          },
        });
      });
    isetState({ ...istate, loading: false });
  }
  async function saveUser(users: Users) {
    isetState({ ...istate, loading: true });
    try {
      await setDoc(doc(firestore, "Users", users.id), users);
      isetState({
        ...istate,
        alert: {
          open: true,
          meesage: "Successfull created",
        },
      });
    } catch (error) {
      console.error("Error adding document: ", error);
       isetState({
         ...istate,
         loading: false,
         alert: {
           open: true,
           meesage: "Error adding document",
         },
       });
    }
  }
  return (
    <div>
      <Box
        sx={{
          width: 640,
          height: "80vh",
          margin: 10,
          padding: 5,
          borderRadius: 10,
          backgroundColor: "#FCFCFD",
        }}
      >
        <Stack direction={"column"} spacing={2} justifyContent="center">
          <h1>Register</h1>
          <p>This is your first step with us!</p>
          <Stack direction={"column"} spacing={2} sx={{ padding: 3 }}>
            <TextField
              fullWidth
              variant="outlined"
              label="Firstname"
              value={istate.firstName}
              onChange={(e) =>
                isetState({ ...istate, firstName: e.target.value })
              }
            />
            <TextField
              fullWidth
              variant="outlined"
              label="Middlename"
              value={istate.middleName}
              onChange={(e) =>
                isetState({ ...istate, middleName: e.target.value })
              }
            />
            <TextField
              fullWidth
              variant="outlined"
              label="Lastname"
              value={istate.lastName}
              onChange={(e) =>
                isetState({ ...istate, lastName: e.target.value })
              }
            />
            <TextField
              fullWidth
              variant="outlined"
              label="ID number"
              type={"number"}
              value={istate.idNumber}
              onChange={(e) =>
                isetState({ ...istate, idNumber: e.target.value })
              }
            />
            <FormControl>
              <FormLabel id="demo-controlled-radio-buttons-group">
                Account Type
              </FormLabel>
              <RadioGroup
                row
                defaultValue="Teacher"
                aria-labelledby="demo--controlled-radio-buttons-group"
                name="controlled-radio-buttons-group"
                value={istate.type}
                onChange={(e) => isetState({ ...istate, type: e.target.value })}
              >
                <FormControlLabel
                  value="Student"
                  control={<Radio />}
                  label="Student"
                />
                <FormControlLabel
                  value="Teacher"
                  control={<Radio />}
                  label="Teacher"
                />
              </RadioGroup>
            </FormControl>
            <TextField
              fullWidth
              variant="outlined"
              label="Email"
              type={"email"}
              value={istate.email}
              onChange={(e) => isetState({ ...istate, email: e.target.value })}
            />
            <TextField
              fullWidth
              variant="outlined"
              label="Password"
              type={"password"}
              value={istate.password}
              onChange={(e) =>
                isetState({ ...istate, password: e.target.value })
              }
            />
            {istate.loading && (
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <CircularProgress />
              </Box>
            )}

            <ColorButton
              fullWidth
              variant="contained"
              size="large"
              disabled={istate.loading}
              onClick={handleButtonClick}
            >
              Register
            </ColorButton>
          </Stack>
        </Stack>

        <Button
          size={"large"}
          fullWidth
          color="success"
          onClick={() => navigate("/login")}
        >
          Already have an account? Login
        </Button>
      </Box>
    </div>
  );
};
export default RegisterPage;
