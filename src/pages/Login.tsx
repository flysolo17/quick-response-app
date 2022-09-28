import React, { useState } from "react";
import "../styles/auth.css";
import { styled } from "@mui/material/styles";
import {
  Box,
  Button,
  Stack,
  TextField,
  ButtonProps,
  CircularProgress,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { grey } from "@mui/material/colors";
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, firestore } from "../config/config";
import { userConverter } from "../model/Users";

interface ILoginPageProps {}
interface IState {
  email: string;
  password: string;
  events: {
    loading: boolean;
  };
}
const LoginPage: React.FunctionComponent<ILoginPageProps> = (props) => {
  const [istate, isetState] = useState<IState>({
    email: "",
    password: "",
    events: {
      loading: false,
    },
  });
  const navigate = useNavigate();
  const ColorButton = styled(Button)<ButtonProps>(({ theme }) => ({
    color: theme.palette.getContrastText(grey[900]),
    borderRadius: 10,
    backgroundColor: grey[900],
    "&:hover": {
      backgroundColor: grey[800],
    },
  }));

  async function login(email: string, password: string) {
    isetState({
      ...istate,
      events: {
        loading: true,
      },
    });
    await signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        identifyUser(user.uid);
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorCode + " " + errorMessage);
      });
    isetState({
      ...istate,
      events: {
        loading: false,
      },
    });
  }

  async function identifyUser(userId: string) {
    const docRef = doc(firestore, "Users", userId).withConverter(userConverter);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const user = docSnap.data();
      if (user.type === "Teacher") {
        navigate("/");
      } else if (user.type === "Student") {
        navigate("/student");
      }
    } else {
      navigate("/*");
    }
  }
  if (istate.events.loading)
    return (
      <div className="login-body">
        <CircularProgress />
      </div>
    );
  return (
    <>
      <Stack direction="row">
        <Box
          sx={{
            width: 540,
            height: 640,
            backgroundColor: "#FCFCFD",
            borderTopLeftRadius: 30,
            borderBottomLeftRadius: 30,
          }}
        >
          <Stack direction="column" sx={{ height: 500, padding: 5 }}>
            <h1>Login</h1>
            <p>Already Have an account?</p>
            <Stack spacing={2} sx={{ marginY: 10, marginX: 5 }}>
              <TextField
                label="Email"
                variant="filled"
                type={"email"}
                fullWidth
                value={istate.email}
                onChange={(e) =>
                  isetState({
                    ...istate,
                    email: e.target.value,
                  })
                }
              />
              <TextField
                label="Password"
                variant="filled"
                fullWidth
                type={"password"}
                value={istate.password}
                onChange={(e) =>
                  isetState({ ...istate, password: e.target.value })
                }
              />
              <ColorButton
                variant="contained"
                size="large"
                onClick={() => login(istate.email, istate.password)}
              >
                Sign In
              </ColorButton>
            </Stack>
          </Stack>
          <Button fullWidth onClick={() => navigate("/register")}>
            Not a member ? Sign up
          </Button>
        </Box>
        <Box
          sx={{
            width: 540,
            height: 640,
            backgroundColor: "#101828",
            borderTopRightRadius: 30,
            borderBottomRightRadius: 30,
          }}
        ></Box>
      </Stack>
    </>
  );
};

export default LoginPage;
