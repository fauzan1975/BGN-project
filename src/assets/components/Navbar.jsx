import React, { useState } from "react";
import "./Navbar.css";

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div style={{
          // position: 'absolute',
          top: 10,
          left: 10,
          zIndex: 1000,
          display: 'flex',
          alignItems: 'center',
          padding: '6px 12px',
          borderRadius: '8px',
          boxShadow: '0 2px 6px rgba(0,0,0,0.15)'
        }}>
          <img
            src="../../../img/logobgn.png"
            alt="Logo"
            style={{ width: '40px', height: 'auto', marginRight: '10px' }}
          />
          <span style={{ fontSize: '16px', fontWeight: 'bold', color: '#1e3a8a' }}>
            Badan Gizi Nasional Indonesia
          </span>
        </div>
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
