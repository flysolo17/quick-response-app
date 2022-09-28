import { Button } from "@mui/material";
import React from "react";
import { Interface } from "readline";
import { auth } from "../config/config";
interface ITeacherProps {}
const TeacherPage: React.FunctionComponent<ITeacherProps> = (first) => {
  return (
    <>
      <h1>Teacher page</h1>
      <Button onClick={() => auth.signOut()}>Sign out</Button>
    </>
  );
};

export default TeacherPage;
