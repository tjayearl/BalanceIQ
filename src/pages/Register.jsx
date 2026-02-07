import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import icon from "../assets/BalanceIQ-icon.png";
import "./Login.css"; // Re-use login styles for consistency

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleRegister = (e) => {
    e.preventDefault();

    if (name && email && password) {
      console.log("Registered:", { name, email, password });
      navigate("/dashboard"); // go to dashboard after registration
    } else {
      alert("Please fill all fields!");
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <div className="login-header">
          <img src={icon} alt="BalanceIQ Logo" className="login-logo" />
          <h1>BalanceIQ</h1>
        </div>
        <h2>Register</h2>
        <form onSubmit={handleRegister}>
          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit">Register</button>
        </form>
        <p style={{ textAlign: "center", marginTop: "1rem" }}>
          Already have an account? <Link to="/">Login</Link>
        </p>
      </div>
    </div>
  );
}

export default Register;