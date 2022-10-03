import * as React from "react";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import AppBar from "@mui/material/AppBar";
import CssBaseline from "@mui/material/CssBaseline";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import { navData } from "./NavData";
import { useNavigate } from "react-router-dom";
import logo from "../image/logo.png";
const drawerWidth = 240;
interface INavigationProps {
  children: any;
}
const NavigationBar: React.FunctionComponent<INavigationProps> = (props) => {
  const { children } = props;
  const navigate = useNavigate();

  return (
    <Box sx={{ display: "flex" }}>
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: {
            width: drawerWidth,
            boxSizing: "border-box",
          },
        }}
      >
        <img src={logo} alt="qr-code" width={80} height={80} />
        <Box sx={{ overflow: "auto" }}>
          <List>
            {navData.map((data, key) => {
              return (
                <ListItem
                  key={key}
                  disablePadding
                  onClick={() => navigate(data.path)}
                  id={window.location.pathname === data.path ? "active" : ""}
                >
                  <ListItemButton>
                    <ListItemIcon>{data.icon}</ListItemIcon>
                    <ListItemText primary={data.title} />
                  </ListItemButton>
                </ListItem>
              );
            })}
          </List>
        </Box>
      </Drawer>
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Toolbar />
        <main className="main-content">{children}</main>
      </Box>
    </Box>
  );
};

export default NavigationBar;
