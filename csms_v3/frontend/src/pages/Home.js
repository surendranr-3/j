import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Home.css';

const CAR_EMOJIS = ['🚘','🏎️','🚗','🚙','🚕','🚐'];

function CarCycler() {
  const [idx, setIdx] = useState(0);
  const [fade, setFade] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setFade(false);
      setTimeout(() => {
        setIdx(i => (i + 1) % CAR_EMOJIS.length);
        setFade(true);
      }, 400);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  return (
    <span
      className="big-car-emoji"
      style={{ transition: 'opacity 0.4s ease, transform 0.4s ease', opacity: fade ? 1 : 0, transform: fade ? 'scale(1)' : 'scale(0.8)' }}
    >
      {CAR_EMOJIS[idx]}
    </span>
  );
}

export default function Home() {
  const navigate = useNavigate();
  const [loaded, setLoaded] = useState(false);

  useEffect(() => { setTimeout(() => setLoaded(true), 100); }, []);

  return (
    <div className={`home-container ${loaded ? 'loaded' : ''}`}>
      <div className="particles">
        {[...Array(20)].map((_, i) => <div key={i} className={`particle particle-${i+1}`}></div>)}
      </div>
      <div className="road-overlay">
        <div className="road-stripe"></div>
        <div className="road-stripe"></div>
        <div className="road-stripe"></div>
      </div>

      <header className="home-header animate-down">
        <div className="home-logo">
          <span className="logo-icon">🚗</span>
          <span className="logo-text">CSMS</span>
        </div>
        <nav className="home-nav">
          <button className="nav-link" onClick={() => navigate('/user-login')}>Login</button>
          <button className="nav-link" onClick={() => navigate('/register')}>Register</button>
        </nav>
      </header>

      <main className="home-hero">
        <div className="hero-content animate-up">
          <div className="hero-badge">🏆 #1 Car Service Platform</div>
          <h1 className="hero-title">
            Your Car Deserves<br />
            <span className="hero-highlight">The Best Care</span>
          </h1>
          <p className="hero-subtitle">
            Professional car service management at your fingertips.
            Book, track, and manage all your vehicle services effortlessly.
          </p>
          <div className="hero-buttons">
            <button className="btn-primary pulse-btn" onClick={() => navigate('/user-login')}><span>🔑</span> Customer Login</button>
            <button className="btn-secondary" onClick={() => navigate('/admin-login')}><span>🛠️</span> Admin Portal</button>
          </div>
          <div className="hero-stats animate-fade">
            <div className="stat-item"><span className="stat-num">500+</span><span className="stat-label">Happy Customers</span></div>
            <div className="stat-divider"></div>
            <div className="stat-item"><span className="stat-num">1200+</span><span className="stat-label">Services Done</span></div>
            <div className="stat-divider"></div>
            <div className="stat-item"><span className="stat-num">98%</span><span className="stat-label">Satisfaction Rate</span></div>
          </div>
        </div>

        <div className="hero-car animate-right">
          <div className="car-glow"></div>
          <div className="car-emoji-wrap">
            <CarCycler />
            <div className="car-shadow"></div>
          </div>
          <div className="floating-badges">
            <div className="float-badge badge-1">✅ Fast Service</div>
            <div className="float-badge badge-2">⭐ 5-Star Quality</div>
            <div className="float-badge badge-3">🔧 Expert Team</div>
          </div>
        </div>
      </main>

      <section className="features-strip animate-up-delay">
        <div className="feature-card"><span className="feat-icon">📋</span><h3>Easy Booking</h3><p>Schedule your car service in just a few clicks</p></div>
        <div className="feature-card"><span className="feat-icon">📍</span><h3>Live Tracking</h3><p>Track your service request status in real-time</p></div>
        <div className="feature-card"><span className="feat-icon">🔔</span><h3>Instant Updates</h3><p>Get notified at every step of the service</p></div>
        <div className="feature-card"><span className="feat-icon">💰</span><h3>Best Pricing</h3><p>Transparent pricing with no hidden charges</p></div>
      </section>
    </div>
  );
}
