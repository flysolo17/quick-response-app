import React from "react";
import HomeIcon from "@mui/icons-material/Home";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import InfoIcon from "@mui/icons-material/Info";
export const navData = [
  {
    title: "Dashboard",
    path: "/dashboard",
    icon: <HomeIcon />,
  },
  {
    title: "Account",
    path: "/account",
    icon: <AccountCircleIcon />,
  },
  {
    title: "About",
    path: "/about",
    icon: <InfoIcon />,
  },
];
