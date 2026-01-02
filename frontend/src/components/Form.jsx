import { useState } from "react";
import api from "../api";
import { useNavigate } from "react-router-dom";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../constants";
import "../styles/Form.css";

function Form({ route, method }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const name = method === "login" ? "Login" : "Register";

  const handleSubmit = async (e) => {
    setLoading(true);
    e.preventDefault();

    try {
      const response = await api.post(route, { username, password });
      console.log(" LOGIN RESPONSE:", response.data); 

      if (method === "login") {
        // Save tokens
        localStorage.setItem(ACCESS_TOKEN, response.data.access);
        localStorage.setItem(REFRESH_TOKEN, response.data.refresh);
        
        //Save user data
        localStorage.setItem("user_name", username); 
        localStorage.setItem("user_email", `${username}@gmail.com`); 
        
        // Check if Django sent user data
        if (response.data.user) {
          console.log(" Django sent user data:", response.data.user);
          localStorage.setItem("user_name", response.data.user.name || response.data.user.username || username);
          localStorage.setItem("user_email", response.data.user.email || `${username}@gmail.com`);
        }
        
        navigate("/");
      } else {
        alert("Registration successful! Please log in.");
        navigate("/login");
      }
    } catch (error) {
      alert("An error occurred.");
      console.error("Login error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="form-container">
      <h1>{name}</h1>

      <input
        className="form-input"
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="Username"
        style={{ color: "black", backgroundColor: "white" }} 
      />

      <input
        className="form-input"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
        style={{ color: "black", backgroundColor: "white" }} 
      />

      <button className="form-button" type="submit">
        {name}
      </button>
    </form>
  );
}

export default Form;