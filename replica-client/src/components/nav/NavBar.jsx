import React from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from "react-router-dom"
import logo from '../../assets/replica_logo_tall.png'
import workflows from '../../assets/workflows.png'
import models from '../../assets/models.png'
import projects from '../../assets/projects.png'
import profile from '../../assets/profile.png'
import logout from '../../assets/logout.png'
import "./NavBar.css"

export const NavBar = () => {
  const navigate = useNavigate()

  return (
    <nav className='navbar'>
      <Link to="/" className="navbar-logo-link">
        <img src={logo} className='navbar-logo' alt='Replica logo'/>
      </Link>
      <div className="navbar-links">
        <Link to="/workflows" className='navbar-item'>
          <img src={workflows} alt='Workflows' />
          <span>Workflows</span>
        </Link>
        <Link to="/models" className='navbar-item'>
          <img src={models} alt='Models' />
          <span>Models</span>
        </Link>
        <Link to="/projects" className='navbar-item'>
          <img src={projects} alt='Projects' />
          <span>Projects</span>
        </Link>
        <Link to="/profile" className='navbar-item'>
          <img src={profile} alt='Profile' />
          <span>Profile</span>
        </Link>
        {localStorage.getItem("replica_user") && (
          <Link
            to=""
            className='navbar-item'
            onClick={() => {
              localStorage.removeItem("replica_user")
              navigate("/", { replace: true })
            }}
          >
            <img src={logout} alt='Logout' />
            <span>Logout</span>
          </Link>
        )}
      </div>
    </nav>
  );
};