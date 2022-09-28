import React, { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth, firestore } from "../config/config";
import { doc, getDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { CircularProgress } from "@mui/material";
import { userConverter } from "../model/Users";
export interface IAuthRouteProps {
  children: any;
}

const AuthRoute: React.FunctionComponent<IAuthRouteProps> = (props) => {
  const { children } = props;
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  async function identifyUser(userId: string) {
    const docRef = doc(firestore, "Users", userId).withConverter(userConverter);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const user = docSnap.data();
      if (user.type === "Teacher") {
        navigate("/");
      } else if (user.type === "Student") {
        navigate("/student");
      } else {
        navigate("/*");
      }
    }
  }
  useEffect(() => {
    const AuthCheck = onAuthStateChanged(auth, (user) => {
      if (user) {
        identifyUser(user.uid);
        setLoading(false);
      } else {
        console.log("unauthorized");
        navigate("/login");
      }
    });

    return () => AuthCheck();
  }, [auth]);

  if (loading) return <CircularProgress />;

  return <>{children}</>;
};

export default AuthRoute;
