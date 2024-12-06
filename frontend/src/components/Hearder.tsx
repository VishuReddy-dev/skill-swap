import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import "./Header.css";
import profile from "../assets/profile-user.png";

// Define the payload structure based on your JWT
interface MyJwtPayload {
  id: string; // Matches the `id` field in your token
  iat: number;
  exp: number;
}

export default function Header() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const isLoggedIn = !!token;

  let userId: string | null = null;

  if (token) {
    try {
      // Decode the token
      const decodedToken = jwtDecode<MyJwtPayload>(token);
      console.log("Decoded Token:", decodedToken); // Debugging
      userId = decodedToken.id; // Use `id` based on your token payload
    } catch (error) {
      console.error("Failed to decode token:", error);
    }
  }

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    // <header className="header">
    //   <nav className="navbar">
    //     <h1 className="logo" onClick={() => navigate("/")} role="button">
    //       Skill Swap
    //     </h1>
    //     {isLoggedIn ? (
    //       <div className="user-actions">
    //         <img
    //           src={profile}
    //           alt="User Profile"
    //           style={{ width: "40px", borderRadius: "50%", cursor: "pointer" }}
    //           onClick={() => {
    //             if (userId) {
    //               navigate(`/profile/${userId}`);
    //             } else {
    //               console.error("User ID not found.");
    //             }
    //           }}
    //         />
    //         <button className="btn btn-logout" onClick={handleLogout}>
    //           Logout
    //         </button>
    //       </div>
    //     ) : (
    //       <ul className="auth-buttons">
    //         <li>
    //           <button
    //             className="btn btn-primary"
    //             onClick={() => navigate("/login")}
    //           >
    //             Login
    //           </button>
    //         </li>
    //         <li>
    //           <button
    //             className="btn btn-secondary-border"
    //             onClick={() => navigate("/register")}
    //           >
    //             Register
    //           </button>
    //         </li>
    //       </ul>
    //     )}
    //   </nav>
    // </header>
    <header className="bg-dark text-white">
      <nav className="navbar container d-flex justify-content-between align-items-center py-3">
        {/* Logo */}
        <h1
          className="logo fw-bold text-light mb-0"
          onClick={() => navigate("/")}
          role="button"
          style={{ cursor: "pointer" }}
        >
          SkillSwap
        </h1>

        {/* Navigation Links */}
        {isLoggedIn ? (
          <div className="d-flex align-items-center">
            {/* Profile Image */}
            <img
              src={profile}
              alt="User Profile"
              style={{
                width: "40px",
                height: "40px",
                borderRadius: "50%",
                cursor: "pointer",
                marginRight: "15px",
              }}
              onClick={() => {
                if (userId) {
                  navigate(`/profile/${userId}`);
                } else {
                  console.error("User ID not found.");
                }
              }}
            />
            {/* Logout Button */}
            <button
              className="btn btn-outline-light btn-sm"
              onClick={handleLogout}
            >
              Logout
            </button>
          </div>
        ) : (
          <ul className="nav mb-0">
            <li className="nav-item me-3">
              <button
                className="btn btn-primary btn-sm"
                onClick={() => navigate("/login")}
              >
                Login
              </button>
            </li>
            <li className="nav-item">
              <button
                className="btn btn-outline-light btn-sm"
                onClick={() => navigate("/register")}
              >
                Register
              </button>
            </li>
          </ul>
        )}
      </nav>
    </header>
  );
}
