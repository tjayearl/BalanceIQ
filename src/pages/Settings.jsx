import React, { useState } from "react";
import "./Settings.css";

const Settings = () => {
  const [profile, setProfile] = useState({
    username: "User",
    email: "user@example.com",
    theme: "light"
  });

  const handleChange = (e) => setProfile({...profile, [e.target.name]: e.target.value});

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Settings saved!");
  }

  return (
    <div className="settings-container">
      <h2>Settings</h2>
      <form className="settings-form" onSubmit={handleSubmit}>
        <input type="text" name="username" value={profile.username} onChange={handleChange} placeholder="Username"/>
        <input type="email" name="email" value={profile.email} onChange={handleChange} placeholder="Email"/>
        <select name="theme" value={profile.theme} onChange={handleChange}>
          <option value="light">Light Theme</option>
          <option value="dark">Dark Theme</option>
        </select>
        <button type="submit">Save Settings</button>
      </form>
    </div>
  );
}

export default Settings;