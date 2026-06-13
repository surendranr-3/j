import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { registerUser } from '../services/api';

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '', phone: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await registerUser(form);
      navigate('/user-login');
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed. Try again.');
    } finally {
      setLoading(false);
    }
  };

  const fields = [
    { key: 'name', label: 'Full Name', type: 'text', placeholder: 'John Doe' },
    { key: 'email', label: 'Email Address', type: 'email', placeholder: 'you@example.com' },
    { key: 'phone', label: 'Phone Number', type: 'text', placeholder: '+91 98765 43210' },
    { key: 'password', label: 'Password', type: 'password', placeholder: 'Create a password' },
  ];

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.logoArea}>
          <span style={styles.logoIcon}>🚗</span>
          <h1 style={styles.logoText}>CSMS</h1>
          <p style={styles.logoSub}>Car Service Management System</p>
        </div>
        <h2 style={styles.title}>Create Account</h2>
        {error && <div style={styles.error}>{error}</div>}
        <form onSubmit={handleSubmit}>
          {fields.map(f => (
            <div key={f.key}>
              <label style={styles.label}>{f.label}</label>
              <input style={styles.input} type={f.type} placeholder={f.placeholder}
                value={form[f.key]} onChange={e => setForm({ ...form, [f.key]: e.target.value })} required />
            </div>
          ))}
          <button style={styles.btn} type="submit" disabled={loading}>
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>
        <p style={styles.footer}>
          Already have an account? <Link to="/user-login" style={styles.link}>Sign in</Link>
          {' | '}<Link to="/" style={styles.link}>🏠 Home</Link>
        </p>
      </div>
    </div>
  );
}

const styles = {
  container: { minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #0d0d1a 0%, #1a1a2e 45%, #0f3460 100%)', padding: '20px' },
  card: { background: '#fff', padding: '48px 40px', borderRadius: '20px', width: '100%', maxWidth: '420px', boxShadow: '0 25px 60px rgba(0,0,0,0.4)' },
  logoArea: { textAlign: 'center', marginBottom: '28px' },
  logoIcon: { fontSize: '3rem' },
  logoText: { fontSize: '2rem', fontWeight: '700', color: '#1a1a2e', margin: '4px 0 0' },
  logoSub: { fontSize: '12px', color: '#888', marginTop: '4px' },
  title: { fontSize: '1.3rem', fontWeight: '600', color: '#333', marginBottom: '24px', textAlign: 'center' },
  label: { display: 'block', fontSize: '13px', fontWeight: '500', color: '#555', marginBottom: '6px' },
  input: { width: '100%', padding: '12px 16px', marginBottom: '16px', border: '1.5px solid #e0e0e0', borderRadius: '10px', fontSize: '14px', display: 'block', outline: 'none' },
  btn: { width: '100%', padding: '14px', background: 'linear-gradient(135deg, #e94560, #c62a47)', color: '#fff', border: 'none', borderRadius: '10px', fontSize: '15px', fontWeight: '600', cursor: 'pointer', marginTop: '4px' },
  error: { background: '#fff0f0', color: '#c62a47', padding: '12px 16px', borderRadius: '8px', marginBottom: '16px', fontSize: '14px', border: '1px solid #f5c0c0' },
  footer: { textAlign: 'center', marginTop: '20px', fontSize: '14px', color: '#666' },
  link: { color: '#e94560', fontWeight: '600', textDecoration: 'none' }
};
