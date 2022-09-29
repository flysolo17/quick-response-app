import React from "react";
import { useNavigate } from "react-router-dom";
import { navData } from "./NavData";
import logo from "../image/logo.png";
export interface INavigationBarProps {
  children: any;
}
const NavigationBar: React.FunctionComponent<INavigationBarProps> = (props) => {
  const navigate = useNavigate();
  const { children } = props;
  return (
    <div className="main-container">
      <div className="sidebar">
        <div className="nav-header">
          <ul className="header">
            <li className="header-row">
              <img src={logo} alt="logo" className="header-logo" />
              <div className="header-label">Quick Response App</div>
            </li>
          </ul>
        </div>
        <ul className="nav-list">
          {navData.map((val, key) => {
            return (
              <li
                key={key}
                className="row"
                id={window.location.pathname === val.path ? "active" : ""}
                onClick={() => navigate(val.path)}
              >
                <div id={"title"}>{val.title}</div>
              </li>
            );
          })}
        </ul>
        <div className="nav-logout">
          <ul
            className="logout"
            style={{ cursor: "pointer", width: "100%" }}
            onClick={() => navigate("/login")}
          >
            <li className="logout-row" style={{ cursor: "pointer" }}>
              <span>
                <p>Logout</p>
              </span>
            </li>
          </ul>
        </div>
      </div>
      <main className="main-content">{children}</main>
    </div>
  );
};

export default NavigationBar;
