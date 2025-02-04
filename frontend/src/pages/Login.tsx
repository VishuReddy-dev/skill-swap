import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:5000/api/users/login",
        {
          email,
          password,
        }
      );
      setSuccess("Login sucessful");
      setError("");
      localStorage.setItem("token", response.data.token); // Save token in localStorage
      navigate("/");
    } catch (err) {
      setError("An error occurred");
      setSuccess("");
    }
  };
  const handleRegister = () => {
    navigate("/register");
  };
  return (
    <form
      action=""
      className="container"
      style={{ maxWidth: "40%", margin: "0 auto", height: "70vh" }}
      onSubmit={handleSubmit}
    >
      <h2>Login</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}
      <div className="form-group">
        <label htmlFor="exampleInputEmail1">Email address</label>
        <input
          type="email"
          className="form-control"
          id="exampleInputEmail1"
          placeholder="Email Id"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      <div className="form-group">
        <label htmlFor="Password">Password</label>
        <input
          type="password"
          className="form-control"
          id="Password"
          placeholder="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>
      <p onClick={handleRegister} className="mt-1">
        Register
      </p>
      <button type="submit" className="btn btn-info mt-1">
        Login
      </button>
    </form>
  );
}
