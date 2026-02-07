import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AiOutlineMail, AiFillLock, AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import icon from "../assets/BalanceIQ-icon.png";
import './Login.css';

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    if (email && password) {
      navigate("/dashboard");
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <img src={icon} alt="BalanceIQ Logo" className="login-logo" />
        <h2>Welcome Back</h2>
        <form onSubmit={handleLogin}>
          <div className="input-wrapper">
            <span className="input-icon"><AiOutlineMail /></span>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="password-wrapper">
            <span className="input-icon"><AiFillLock /></span>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <span
              className="password-toggle"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <AiFillEyeInvisible /> : <AiFillEye />}
            </span>
          </div>

          <button type="submit">Login</button>
        </form>
        <p className="login-footer">
          Don't have an account? <Link to="/register">Register</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;