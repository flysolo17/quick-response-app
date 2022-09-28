import React from "react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { Box, Stack, Grid, Button } from "@mui/material";
import logo from "../image/logo.png";

interface AccountPageProps {}

const AccountPage: React.FunctionComponent<AccountPageProps> = () => {
  const theme = createTheme({
    typography: {
      allVariants: {
        fontFamily: "Poppins",
      },
    },
  });
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
                <img src={logo} alt="qr-code" />
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
              <Box
                style={{
                  display: "inline-flex",
                  justifyContent: "left",
                  padding: "5px",
                  color: "#ffff",
                }}
              >
                <input
                  className="account_input"
                  style={{
                    border: "none",
                    textAlign: "left",
                  }}
                  value="Sample"
                />
                <input
                  className="account_input"
                  style={{
                    textAlign: "center",
                    marginLeft: "70px",
                  }}
                  value="Sample"
                />
                <input
                  className="account_input"
                  style={{
                    textAlign: "center",

                    marginLeft: "95px",
                  }}
                  value="Sample"
                />
              </Box>
              <Box
                style={{
                  display: "inline-flex",
                  marginTop: "10px",
                  padding: "5px",
                  color: "#ffff",
                }}
              >
                <label style={{ paddingLeft: "0px" }}>Account Type</label>
                <label style={{ marginLeft: "200px" }}>ID Number</label>
              </Box>
              <Box
                style={{
                  display: "inline-flex",
                  padding: "10px",
                  color: "#ffff",
                }}
              >
                <input
                  className="account_input"
                  style={{
                    textAlign: "left",
                    color: "white",
                  }}
                  value="Teacher"
                />
                <input
                  className="account_input"
                  style={{
                    textAlign: "left",
                    marginLeft: "105px",
                  }}
                  value="03161704870"
                />
              </Box>
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
