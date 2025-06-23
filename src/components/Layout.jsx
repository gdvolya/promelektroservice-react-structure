import React from "react";
import { Outlet } from "react-router-dom";

const Layout = () => {
  return (
    <div className="app-wrapper">
      <header><h1>Promelektroservice</h1></header>
      <Outlet />
      <footer>© 2025 Promelektroservice</footer>
    </div>
  );
};
export default Layout;