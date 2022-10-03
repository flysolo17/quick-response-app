import SubjectTable from "./SubjectTable";
import CustomizedDialogs from "../dialog/AddSubject";
import { Button } from "@mui/material";
import React, { useState } from "react";
interface DashBoardPageProps {}

const DashBoardPage: React.FunctionComponent<DashBoardPageProps> = () => {

  return (
    <>
      <SubjectTable/>
    </>
  );
};

export default DashBoardPage;
