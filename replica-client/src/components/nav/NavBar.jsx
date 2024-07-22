import React from 'react';
import { Link } from 'react-router-dom';

export const NavBar = () => {
  return (
    <nav style={styles.nav}>
      <Link to="/" style={styles.link}>replica</Link>
      <div style={styles.linkContainer}>
        <Link to="/workflows" style={styles.link}>Workflows</Link>
        <Link to="/models" style={styles.link}>Models</Link>
        <Link to="/projects" style={styles.link}>Projects</Link>
        <Link to="/profile" style={styles.link}>User</Link>
      </div>
    </nav>
  );
};

const styles = {
  nav: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '1rem',
    backgroundColor: '#333',
    color: 'white',
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
    height: '64px', // Explicitly set the height
    boxSizing: 'border-box',
  },
  linkContainer: {
    display: 'flex',
    gap: '1rem',
  },
  link: {
    color: 'white',
    textDecoration: 'none',
    fontSize: '1.1rem',
  },
};

