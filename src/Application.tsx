import React, { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AuthRoute from "./component/AuthRoute";
import LoginPage from "./pages/Login";
import RegisterPage from "./pages/Register";
import NotFoundPage from "./pages/NotFound";
import DashBoardPage from "./pages/DashBoard";
import AccountPage from "./pages/Account";
import AboutPage from "./pages/About";
import "./App.css";
interface ApplictionProps {}

const Appliction: React.FunctionComponent<ApplictionProps> = (props) => {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/dashboard"
          element={
            <AuthRoute>
              <DashBoardPage />
            </AuthRoute>
          }
        />
        <Route
          path="/account"
          element={
            <AuthRoute>
              <AccountPage />
            </AuthRoute>
          }
        />
        <Route
          path="/about"
          element={
            <AuthRoute>
              <AboutPage />
            </AuthRoute>
          }
        />
        <Route
          path="*"
          element={
            <AuthRoute>
              <DashBoardPage />
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
