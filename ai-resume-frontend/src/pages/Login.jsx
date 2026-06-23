import { useState } from "react";
import API from "../services/api";

function Login() {
  const [form, setForm] = useState({
    email: "saranya@gmail.com",
    password: "Saranya@123",
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await API.post("/api/users/login", form);

      localStorage.setItem("token", response.data.token);

      alert("Login Successful!");
      window.location.href = "/dashboard";
    } catch (error) {
      alert("Login Failed");
      console.log(error);
    }
  };

  return (
    <div style={{ padding: "50px" }}>
      <h1>Login</h1>

      <form onSubmit={handleSubmit}>
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

        <button type="submit">Login</button>
      </form>

      <br />

      <p>
        Don't have an account?
        <button
          type="button"
          onClick={() => (window.location.href = "/register")}
        >
          Register
        </button>
      </p>
    </div>
  );
}

export default Login;