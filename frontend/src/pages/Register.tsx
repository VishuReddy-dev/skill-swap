import { useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
export default function Register() {
  const navigate = useNavigate();
  const handleLogin = () => {
    navigate("/login");
  };
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:5000/api/users/register",
        { name, email, password }
      );
      setSuccess("register sucessfull");
      setError("");
      localStorage.setItem("token", response.data.token);
      navigate("/");
    } catch (error) {
      setError("An error occurred");
      setSuccess("");
    }
  };
  return (
    <form
      action=""
      className="container"
      style={{ maxWidth: "40%", margin: "0 auto", height: "70vh" }}
      onSubmit={handleSubmit}
    >
      <h2>Register</h2>
      <div className="form-group">
        <label htmlFor="name">Name:</label>
        <input
          type="text"
          className="form-control"
          id="name"
          placeholder="Enter name"
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>
      <div className="form-group">
        <label htmlFor="email">Email:</label>
        <input
          type="email"
          className="form-control"
          id="email"
          placeholder="Enter email"
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      <div className="form-group">
        <label htmlFor="password">Password:</label>
        <input
          type="password"
          className="form-control"
          id="password"
          placeholder="password"
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>
      <p onClick={handleLogin}>Login</p>
      <button className="btn btn-primary mt-3" type="submit">
        Register
      </button>
    </form>
  );
}
