import React from "react";
import icon from "../assets/BalanceIQ-icon.png";

function AppHeader() {
  return (
    <header style={{ display: "flex", alignItems: "center", marginBottom: "1.5rem" }}>
      <img src={icon} alt="BalanceIQ Logo" style={{ width: "40px", height: "40px" }} />
      <h1 style={{ fontSize: "1.5rem", margin: "0 0 0 0.75rem", color: "white" }}>BalanceIQ</h1>
    </header>
  );
}

export default AppHeader;