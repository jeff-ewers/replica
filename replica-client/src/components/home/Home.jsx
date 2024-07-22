import React from 'react';
import logo from '../../assets/replica_logo_text.png'

export const Home = () => {
  return (
    <div style={styles.container}>
      <div style={styles.hero}>
      <img src={logo} alt='Replica logo'></img>
        <h1 style={styles.title}>Welcome to Replica</h1>
        <p style={styles.subtitle}>Your Scientific Research Companion</p>
        
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    paddingTop: '64px', // Add padding equal to navbar height
    boxSizing: 'border-box',
  },
  hero: {

    textAlign: 'center',
    padding: '2rem',
    borderRadius: '8px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',

    
  },
  title: {
    fontSize: '3rem',
    marginBottom: '1rem',
  },
  subtitle: {
    fontSize: '1.5rem',
    color: '#666',
  },
};

