import { useState } from "react";
import { useNavigate } from "react-router-dom";

import api from "../api";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const handleLogin = async () => {
    try {
      const response =
        await api.post(
          "/auth/login",
          {
            email,
            password,
          }
        );

      localStorage.setItem(
        "token",
        response.data.token
      );
      localStorage.setItem(
        "userEmail",
        email
      );

      navigate("/dashboard");
    } catch (error) {
      console.error(error);

      alert("Login Failed");
    }
  };

  return (
    <div
      style={{
        padding: "40px",
      }}
    >
      <h1>Login</h1>

      <input
        placeholder="Email"
        value={email}
        onChange={(e) =>
          setEmail(e.target.value)
        }
      />

      <br />
      <br />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) =>
          setPassword(e.target.value)
        }
      />

      <br />
      <br />

      <button
        onClick={handleLogin}
      >
        Login
      </button>
    </div>
  );
}

export default Login;