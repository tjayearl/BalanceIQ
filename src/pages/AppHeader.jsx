import React from "react";
import Logo from "./Logo";

function AppHeader() {
  return (
    <header style={{ display: "flex", alignItems: "center", marginBottom: "1.5rem" }}>
      <Logo size={40} />
      <h1 style={{ fontSize: "1.5rem", margin: "0 0 0 0.75rem", color: "white" }}>BalanceIQ</h1>
    </header>
  );
}

export default AppHeader;