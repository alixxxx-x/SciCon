import { useState } from "react";
import "./Register.css";

export default function Register() {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    confirmEmail: "",
    password: "",
    confirmPassword: "",
  });

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleSubmit(e) {
    e.preventDefault();

    if (form.email !== form.confirmEmail) {
      return alert("Emails do not match!");
    }

    if (form.password !== form.confirmPassword) {
      return alert("Passwords do not match!");
    }

    alert("Account created successfully!");
  }

  return (
    <div className="register-container">
      <div className="register-box">
        <h2>Sign Up</h2>

        <form onSubmit={handleSubmit}>
          <div className="name-row">
            <input
              type="text"
              name="firstName"
              placeholder="First Name"
              onChange={handleChange}
            />

            <input
              type="text"
              name="lastName"
              placeholder="Last Name"
              onChange={handleChange}
            />
          </div>

          <input
            type="email"
            name="email"
            placeholder="Email"
            onChange={handleChange}
          />

          <input
            type="email"
            name="confirmEmail"
            placeholder="Confirm Email"
            onChange={handleChange}
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            onChange={handleChange}
          />

          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            onChange={handleChange}
          />

          <button type="submit">Sign up</button>
        </form>

        <p className="login-link">
          Already have an account? <a href="/">Sign In</a>
        </p>
      </div>
    </div>
  );
}
