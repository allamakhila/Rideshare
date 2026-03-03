import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const styles = {
    container: {
      height: "100vh",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "#b3d9ff",
      fontFamily: "Arial, sans-serif",
    },
    card: {
  backgroundColor: "#e6f2ff",
  padding: "40px",
  borderRadius: "12px",
  width: "350px",
  boxShadow: "0 5px 20px rgba(0,0,0,0.1)",
  textAlign: "center",
},
    title: {
      fontSize: "28px",
      fontWeight: "600",
      marginBottom: "20px",
      color: "#333",
    },
    input: {
      width: "100%",
      padding: "10px",
      margin: "10px 0",
      borderRadius: "6px",
      border: "1px solid #ddd",
    },
    button: {
      width: "100%",
      padding: "10px",
      marginTop: "15px",
      backgroundColor: "#4CAF50",
      color: "white",
      border: "none",
      borderRadius: "6px",
      cursor: "pointer",
      fontWeight: "600",
    },
    link: {
      marginTop: "15px",
      cursor: "pointer",
      color: "#4CAF50",
      fontSize: "14px",
    },
  };

  const handleLogin = async (e) => {
  e.preventDefault();

  try {
    const response = await axios.post(
      "http://localhost:8081/api/auth/login",
      { email, password }
    );

    const { token, role, name } = response.data;

    localStorage.setItem("token", token);
    localStorage.setItem("role", role);

    localStorage.setItem(
        "loggedInUser",
        JSON.stringify({ name: name, email: email, role: role })
      );

    alert("Login Successful!");

    if (role === "DRIVER") {
  navigate("/driver");
} else {
  navigate("/passenger");
}

  } catch (error) {
    alert("Invalid Credentials");
  }
};

  return (
    <div style={styles.container}>
      <form style={styles.card} onSubmit={handleLogin}>
        <div style={styles.title}>Login</div>

        <input
          type="email"
          placeholder="Email Address"
          required
          style={styles.input}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          required
          style={styles.input}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button type="submit" style={styles.button}>
          Login
        </button>

        <div style={styles.link} onClick={() => navigate("/register")}>
          Create an Account
        </div>
      </form>
    </div>
  );
}

export default Login;