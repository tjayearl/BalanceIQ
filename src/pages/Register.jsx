import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AiOutlineMail, AiFillLock, AiOutlineUser, AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import icon from "../assets/BalanceIQ-icon.png";
import "./Login.css"; // Re-use login styles for consistency

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
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
        <img src={icon} alt="BalanceIQ Logo" className="login-logo" />
        <h2>Create Account</h2>
        <form onSubmit={handleRegister}>
          <div className="input-wrapper">
            <span className="input-icon"><AiOutlineUser /></span>
            <input
              type="text"
              placeholder="Username"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

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

          <div className="password-wrapper">
            <span className="input-icon"><AiFillLock /></span>
            <input
              type={showConfirm ? "text" : "password"}
              placeholder="Confirm Password"
            />
            <span
              className="password-toggle"
              onClick={() => setShowConfirm(!showConfirm)}
            >
              {showConfirm ? <AiFillEyeInvisible /> : <AiFillEye />}
            </span>
          </div>

          <button type="submit">Register</button>
        </form>
        <p className="login-footer">
          Already have an account? <Link to="/">Login</Link>
        </p>
      </div>
    </div>
  );
}

export default Register;