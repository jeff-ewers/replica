import React from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from "react-router-dom"
import logo from '../../assets/replica_logo_tall.png'
import "./NavBar.css"

export const NavBar = () => {
  const navigate = useNavigate()

  return (
    <nav className='navbar'>
      <Link to="/" className="navbar-logo-link">
        <img src={logo} className='navbar-logo' alt='Replica logo'/>
      </Link>
      <div className="navbar-links">
        <Link to="/workflows" className='logo-workflow'>Workflows</Link>
        <Link to="/models" className='logo-models'>Models</Link>
        <Link to="/projects" className='logo-projects'>Projects</Link>
        <Link to="/profile" className='logo-profile'>Profile</Link>
        {localStorage.getItem("replica_user") && (
          <Link
            to=""
            onClick={() => {
              localStorage.removeItem("replica_user")
              navigate("/", { replace: true })
            }}
          >
            Logout
          </Link>
        )}
      </div>
    </nav>
  );
};