import React from 'react';
import network from '../../assets/network.mp4';
import './Home.css';

export const Home = () => {
    return (
        <div className="home-container">
            <div className="hero">
                <video className='videoTag' autoPlay loop muted>
                    <source src={network} type='video/mp4' />
                </video>
                <div className="hero-content">
                    <h1 className="hero-title">welcome to replica</h1>
                    <p className="hero-subtitle">your scientific research companion</p>
                </div>
            </div>
        </div>
    );
};