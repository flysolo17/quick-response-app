import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AuthRoute from "./component/AuthRoute";
import LoginPage from "./pages/Login";
import RegisterPage from "./pages/Register";
import NotFoundPage from "./pages/NotFound";
import StudentPage from "./pages/Student";
import TeacherPage from "./pages/Teacher";

interface ApplictionProps {}

const Appliction: React.FunctionComponent<ApplictionProps> = (props) => {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <AuthRoute>
              <TeacherPage />
            </AuthRoute>
          }
        />
        <Route
          path="/student"
          element={
            <AuthRoute>
              <StudentPage />
            </AuthRoute>
          }
        />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default Appliction;
