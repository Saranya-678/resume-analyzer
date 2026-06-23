import { useState } from "react";
import API from "../services/api";

function Register() {
  const [form, setForm] = useState({
  fullName: "Saranya",
  email: "saranya@gmail.com",
  password: "Saranya@123",
  confirmPassword: "Saranya@123",
  role: "USER",
});

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.password !== form.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    try {
      await API.post("/api/users/register", {
        fullName: form.fullName,
        email: form.email,
        password: form.password,
        role: form.role,
      });

      alert("Registration Successful!");
      window.location.href = "/";
    } catch (error) {
      alert("Registration Failed");
      console.log(error);
    }
  };

  return (
    <div style={{ padding: "50px" }}>
      <h1>Register</h1>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="fullName"
          placeholder="Full Name"
          value={form.fullName}
          onChange={handleChange}
        />

        <br /><br />

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
        />

        <br /><br />

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
        />

        <br /><br />

        <input
          type="password"
          name="confirmPassword"
          placeholder="Confirm Password"
          value={form.confirmPassword}
          onChange={handleChange}
        />

        <br /><br />

        <button type="submit">Register</button>
      </form>

      <br />

      <p>
        Already have an account?
        <button
          type="button"
          onClick={() => (window.location.href = "/")}
        >
          Login
        </button>
      </p>
    </div>
  );
}

export default Register;