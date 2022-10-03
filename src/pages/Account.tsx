import React, { useEffect } from "react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { Box, Stack, Grid, Button } from "@mui/material";
import logo from "../image/logo.png";
import { signOut } from "firebase/auth";
import { auth } from "../config/config";
import { useNavigate } from "react-router-dom";
import { useQRCode } from "next-qrcode";
import { useAuth } from "../context/AuthContext";
import { firestore } from "../config/config";
interface AccountPageProps {}

const AccountPage: React.FunctionComponent<AccountPageProps> = (props) => {
  const theme = createTheme({
    typography: {
      allVariants: {
        fontFamily: "Poppins",
      },
    },
  });
  const { users, currentUser } = useAuth();
  const { Canvas } = useQRCode();
  const navigate = useNavigate();

  return (
    <div>
      <ThemeProvider theme={theme}>
        <Grid
          container
          spacing={2}
          direction={"column"}
          justifyContent="center"
          alignContent={"center"}
          style={{ minHeight: "95vh" }}
        >
          <Box
            sx={{
              width: 800,
              height: "75vh",
              padding: 5,
              borderRadius: 10,
              boxShadow: 2,
              backgroundColor: "#111928",
            }}
          >
            <Stack>
              <Box
                style={{
                  display: "flex",
                  fontSize: "18px",
                  fontWeight: "bold",
                  color: "#ffff",
                }}
              >
                <label
                  className="accounts"
                  style={{
                    marginLeft: "auto",
                    marginRight: "auto",
                    fontSize: "40px",
                    fontWeight: "bolder",
                  }}
                >
                  <b>Account Details</b>
                </label>
              </Box>
              <Box
                style={{
                  marginTop: "15px",
                  display: "flex",
                  fontSize: "18px",
                  fontWeight: "bold",
                  color: "#ffff",
                }}
              >
                <Canvas
                  text={currentUser?.uid!}
                  options={{
                    type: "image/jpeg",
                    quality: 0.3,
                    level: "M",
                    margin: 3,
                    scale: 4,
                    width: 150,
                  }}
                />
                <span
                  style={{
                    marginTop: "auto",
                    marginBottom: "auto",
                    marginLeft: "15px",
                    cursor: "pointer",
                  }}
                >
                  <Button> as</Button>
                </span>
              </Box>
              <Box
                style={{
                  display: "inline-flex",
                  justifyContent: "center",
                  marginTop: "10px",
                  padding: "5px",
                  color: "#ffff",
                }}
              >
                <label style={{ paddingLeft: "0px" }}>Firstname</label>
                <label style={{ margin: "auto" }}>Middlename</label>
                <label style={{ paddingRight: "0px" }}>Lastname</label>
              </Box>
              <Stack
                sx={{ display: "flex", justifyContent: "space-between" }}
                direction={"row"}
              >
                <label className="account_input">{users?.firstName}</label>
                <label className="account_input">{users?.middleName}</label>
                <label className="account_input">{users?.lastName}</label>
              </Stack>

              <Box
                style={{
                  display: "inline-flex",
                  justifyContent: "center",
                  marginTop: "10px",
                  padding: "5px",
                  color: "#ffff",
                }}
              >
                <label style={{ paddingLeft: "0px" }}>Account</label>
                <label style={{ margin: "auto" }}> Email </label>
                <label style={{ paddingRight: "0px" }}>ID Number</label>
              </Box>
              <Stack
                sx={{ display: "flex", justifyContent: "space-between" }}
                direction={"row"}
              >
                <label className="account_input">{users?.type}</label>
                <label className="account_input">{users?.email}</label>
                <label className="account_input">{users?.idNumber}</label>
              </Stack>
              <Box
                style={{
                  display: "flex",
                  marginTop: "50px",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Button
                  variant="contained"
                  color="success"
                  style={{
                    marginLeft: "50px",
                    marginRight: "50px",
                    borderRadius: "50px",
                    width: "200px",
                  }}
                >
                  Edit Profile
                </Button>
                <Button
                  variant="contained"
                  color="error"
                  style={{
                    marginLeft: "50px",
                    marginRight: "50px",
                    borderRadius: "50px",
                    width: "200px",
                  }}
                  onClick={() => {
                    signOut(auth);
                    navigate("/login");
                  }}
                >
                  Logout
                </Button>
              </Box>
            </Stack>
          </Box>
        </Grid>
      </ThemeProvider>
    </div>
  );
};

export default AccountPage;
