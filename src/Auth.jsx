import { useState } from "react";
import axios from "axios";

function Auth({ onLoginSuccess }) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const API_BASE = "https://notepad-api-exbnfyefcse7e6g5.malaysiawest-01.azurewebsites.net";

  const handleSubmit = async (e) => {
    e.preventDefault();
    const endpoint = isLogin ? "/api/auth/login" : "/api/auth/register";
    try {
      const res = await axios.post(`${API_BASE}${endpoint}`, {
        email,
        password,
      });

      if (isLogin) {
        alert("Login Successful!");
        onLoginSuccess(res.data.userId, res.data.role); // Parent (App.jsx) ko user id bhej do
      } else {
        alert("Registered! Now please Login.");
        setIsLogin(true);
      }
    } catch (err) {
      alert(err.response?.data || "Operation failed!");
    }
  };

  return (
    <div
      style={{
        maxWidth: "400px",
        margin: "50px auto",
        padding: "20px",
        border: "1px solid #ddd",
        borderRadius: "8px",
      }}
    >
      <h3>{isLogin ? "Login" : "Register"}</h3>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={{ width: "100%", marginBottom: "10px", padding: "8px" }}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={{ width: "100%", marginBottom: "10px", padding: "8px" }}
        />
        <button
          type="submit"
          style={{
            width: "100%",
            padding: "10px",
            backgroundColor: "#2563eb",
            color: "white",
            border: "none",
            borderRadius: "4px",
          }}
        >
          {isLogin ? "Login" : "Register"}
        </button>
      </form>
      <p
        onClick={() => setIsLogin(!isLogin)}
        style={{
          cursor: "pointer",
          color: "blue",
          textAlign: "center",
          marginTop: "10px",
        }}
      >
        {isLogin ? "New user? Register here" : "Already have an account? Login"}
      </p>
    </div>
  );
}

export default Auth;
