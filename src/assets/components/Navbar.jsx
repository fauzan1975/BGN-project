import React, { useState } from "react";
import "./Navbar.css";

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-logo">BGN INDONESIA</div>
        <div className="burger" onClick={toggleMenu}>
          ☰
        </div>
        <div className={`navbar-links ${isOpen ? "active" : ""}`}>
          <a href="/">Home</a>
          <a href="/statistik">Statistik</a>
          <a href="/data">Data</a>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
