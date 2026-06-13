import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { loginUser } from '../services/api';
import './AuthLogin.css';

const CAR_SLIDES = ['🚗','🚙','🏎️','🚕','🚌'];

export default function UserLogin() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); setError('');
    try {
      const res = await loginUser(form);
      const user = res.data;
      if (user.role !== 'CUSTOMER') {
        setError('This account is not a Customer account. Use Admin Login instead.');
        setLoading(false); return;
      }
      localStorage.setItem('user', JSON.stringify(user));
      navigate('/customer');
    } catch { setError('Invalid email or password'); }
    finally { setLoading(false); }
  };

  return (
    <div className="auth-container user-bg">
      {/* Rotating car slideshow background */}
      <div className="car-slideshow">
        {CAR_SLIDES.map((car, i) => (
          <div key={i} className="car-slide">
            <span className="car-slide-emoji">{car}</span>
          </div>
        ))}
      </div>

      {/* Moving cars strip */}
      <div className="bg-cars">
        <span className="bg-car bc1">🚗</span>
        <span className="bg-car bc2">🚙</span>
        <span className="bg-car bc3">🏎️</span>
        <span className="bg-car bc4">🚕</span>
        <span className="bg-car bc5">🚗</span>
      </div>
      <div className="road-lines">
        <div className="rl rl1"></div>
        <div className="rl rl2"></div>
        <div className="rl rl3"></div>
      </div>

      <div className="auth-card animate-card">
        <button className="back-btn" onClick={() => navigate('/')}>← Back to Home</button>
        <div className="auth-top">
          <div className="auth-icon-wrap user-icon-wrap"><span className="auth-icon">👤</span></div>
          <h1 className="auth-title">Customer Login</h1>
          <p className="auth-sub">Sign in to manage your car services</p>
        </div>
        {error && <div className="auth-error">{error}</div>}
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="field-group">
            <label className="field-label">Email Address</label>
            <div className="field-wrap">
              <span className="field-icon">✉️</span>
              <input className="field-input" type="email" placeholder="you@example.com"
                value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required />
            </div>
          </div>
          <div className="field-group">
            <label className="field-label">Password</label>
            <div className="field-wrap">
              <span className="field-icon">🔒</span>
              <input className="field-input" type="password" placeholder="Enter your password"
                value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} required />
            </div>
          </div>
          <button type="submit" className="auth-btn user-btn" disabled={loading}>
            {loading ? <span className="loading-dots"><span></span><span></span><span></span></span> : <><span>🔑</span> Sign In as Customer</>}
          </button>
        </form>
        <div className="auth-divider"><span>or</span></div>
        <div className="auth-links">
          <p>Don't have an account? <Link to="/register" className="auth-link">Register here</Link></p>
          <p className="mt-8">Are you an admin? <Link to="/admin-login" className="auth-link admin-link">Admin Login →</Link></p>
          <p className="mt-8"><Link to="/guest-request" className="guest-link">🚗 Submit a Guest Request without login</Link></p>
        </div>
      </div>
    </div>
  );
}
