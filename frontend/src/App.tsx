import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Hearder";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import SkillDetailPage from "./pages/SkillPage";
import Profile from "./pages/Profile.tsx";
import CreateSkill from "./pages/CreateSkill.tsx";
import Footer from "./components/Footer.tsx";
export default function App() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/skills/:id" element={<SkillDetailPage />} />
        <Route path="/profile/:id" element={<Profile />} />
        <Route path="/createSkill" element={<CreateSkill />} />
      </Routes>
      <Footer />
    </Router>
  );
}
