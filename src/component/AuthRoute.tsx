import { useNavigate } from "react-router-dom";
import NavigationBar from "./NavigationBar";
import { useAuth } from "../context/AuthContext";
import React, { useEffect, useState } from "react";
import { firestore } from "../config/config";
import { getDoc, doc } from "firebase/firestore";
import { userConverter, Users } from "../model/Users";
export interface IAuthRouteProps {
  children: any;
}

const AuthRoute: React.FunctionComponent<IAuthRouteProps> = (props) => {
  const { currentUser, type } = useAuth();
  const { children } = props;
  const navigate = useNavigate();
  useEffect(() => {
    if (currentUser != null) {
      if (type === "Student") {
        navigate("/account");
      } else {
        navigate("/");
      }
    } else {
      navigate("/login");
    }
  }, []);

  if (type === "Student") {
    return <>{children}</>;
  } else {
    return (
      <>
        <NavigationBar>{children}</NavigationBar>
      </>
    );
  }
};

export default AuthRoute;
