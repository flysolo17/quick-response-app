import React, { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth, firestore } from "../config/config";
import { doc, getDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { CircularProgress } from "@mui/material";
import { userConverter } from "../model/Users";
import NavigationBar from "./NavigationBar";
export interface IAuthRouteProps {
  children: any;
}

const AuthRoute: React.FunctionComponent<IAuthRouteProps> = (props) => {
  const { children } = props;
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const AuthCheck = onAuthStateChanged(auth, (user) => {
      if (user) {
        setLoading(false);
      } else {
        console.log("unauthorized");
        navigate("/login");
      }
    });

    return () => AuthCheck();
  }, [auth]);

  if (loading) return <CircularProgress />;

  return (
    <>
      <NavigationBar>{children}</NavigationBar>
    </>
  );
};

export default AuthRoute;
