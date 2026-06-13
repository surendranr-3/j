import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { loginUser } from '../services/api';

export default function Login() {
  const [selectedRole, setSelectedRole] = useState('');
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRoleSelect = (role) => {
    setSelectedRole(role);
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedRole) {
      setError('Please select your role first.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const res = await loginUser(form);
      const user = res.data;
      if (user.role !== selectedRole) {
        setError(
          selectedRole === 'ADMIN'
            ? 'This account is not an Admin account. Please select "Customer".'
            : 'This account is not a Customer account. Please select "Admin".'
        );
        setLoading(false);
        return;
      }
      localStorage.setItem('user', JSON.stringify(user));
      navigate(user.role === 'ADMIN' ? '/admin' : '/customer');
    } catch {
      setError('Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.logoArea}>
          <span style={styles.logoIcon}>🚗</span>
          <h1 style={styles.logoText}>CSMS</h1>
          <p style={styles.logoSub}>Car Service Management System</p>
        </div>

        <h2 style={styles.title}>Sign In</h2>

        <p style={styles.roleLabel}>I am signing in as:</p>
        <div style={styles.roleRow}>
          <button type="button" onClick={() => handleRoleSelect('CUSTOMER')}
            style={{ ...styles.roleBtn, ...(selectedRole === 'CUSTOMER' ? styles.roleBtnActive : {}) }}>
            <span style={styles.roleIcon}>👤</span>
            <span style={styles.roleName}>Customer</span>
            <span style={styles.roleDesc}>View & track my service requests</span>
          </button>
          <button type="button" onClick={() => handleRoleSelect('ADMIN')}
            style={{ ...styles.roleBtn, ...(selectedRole === 'ADMIN' ? styles.roleBtnActiveAdmin : {}) }}>
            <span style={styles.roleIcon}>🛠️</span>
            <span style={styles.roleName}>Admin</span>
            <span style={styles.roleDesc}>Manage all requests & customers</span>
          </button>
        </div>

        {error && <div style={styles.error}>{error}</div>}

        <form onSubmit={handleSubmit}>
          <label style={styles.label}>Email Address</label>
          <input style={styles.input} type="email" placeholder="you@example.com"
            value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required />
          <label style={styles.label}>Password</label>
          <input style={styles.input} type="password" placeholder="Enter password"
            value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} required />
          <button style={{
            ...styles.btn,
            ...(selectedRole === 'ADMIN' ? styles.btnAdmin : {}),
            opacity: !selectedRole ? 0.6 : 1,
            cursor: !selectedRole ? 'not-allowed' : 'pointer',
          }} type="submit" disabled={loading}>
            {loading ? 'Signing in...' : `Sign In as ${selectedRole === 'ADMIN' ? 'Admin' : selectedRole === 'CUSTOMER' ? 'Customer' : '...'}`}
          </button>
        </form>

        <div style={styles.divider}><span>or</span></div>

        <p style={styles.guestNote}>
          🚗 Need service without an account?{' '}
          <Link to="/guest-request" style={styles.link}>Submit a Guest Request</Link>
        </p>

        <p style={styles.footer}>
          Don't have an account? <Link to="/register" style={styles.link}>Register here</Link>
        </p>
      </div>
    </div>
  );
}

const styles = {
  container: { minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)', padding: '20px' },
  card: { background: '#fff', padding: '40px 36px', borderRadius: '20px', width: '100%', maxWidth: '440px', boxShadow: '0 25px 60px rgba(0,0,0,0.4)' },
  logoArea: { textAlign: 'center', marginBottom: '20px' },
  logoIcon: { fontSize: '2.6rem' },
  logoText: { fontSize: '1.8rem', fontWeight: '700', color: '#1a1a2e', margin: '4px 0 0' },
  logoSub: { fontSize: '12px', color: '#888', marginTop: '4px' },
  title: { fontSize: '1.2rem', fontWeight: '600', color: '#333', marginBottom: '16px', textAlign: 'center' },
  roleLabel: { fontSize: '13px', fontWeight: '500', color: '#666', marginBottom: '10px', textAlign: 'center' },
  roleRow: { display: 'flex', gap: '10px', marginBottom: '20px' },
  roleBtn: { flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '14px 10px', border: '2px solid #e0e0e0', borderRadius: '12px', background: '#fafafa', cursor: 'pointer', gap: '4px' },
  roleBtnActive: { border: '2px solid #e94560', background: '#fff0f3', boxShadow: '0 0 0 3px rgba(233,69,96,0.1)' },
  roleBtnActiveAdmin: { border: '2px solid #0f3460', background: '#f0f4ff', boxShadow: '0 0 0 3px rgba(15,52,96,0.1)' },
  roleIcon: { fontSize: '1.6rem' },
  roleName: { fontSize: '14px', fontWeight: '700', color: '#1a1a2e' },
  roleDesc: { fontSize: '11px', color: '#888', textAlign: 'center' },
  label: { display: 'block', fontSize: '13px', fontWeight: '500', color: '#555', marginBottom: '6px' },
  input: { width: '100%', padding: '12px 16px', marginBottom: '16px', border: '1.5px solid #e0e0e0', borderRadius: '10px', fontSize: '14px', display: 'block', outline: 'none', boxSizing: 'border-box' },
  btn: { width: '100%', padding: '13px', background: 'linear-gradient(135deg, #e94560, #c62a47)', color: '#fff', border: 'none', borderRadius: '10px', fontSize: '15px', fontWeight: '600', marginTop: '4px' },
  btnAdmin: { background: 'linear-gradient(135deg, #0f3460, #16213e)' },
  error: { background: '#fff0f0', color: '#c62a47', padding: '10px 14px', borderRadius: '8px', marginBottom: '14px', fontSize: '13px', border: '1px solid #f5c0c0' },
  divider: { textAlign: 'center', margin: '16px 0', color: '#bbb', fontSize: '12px', borderTop: '1px solid #eee', paddingTop: '16px' },
  guestNote: { textAlign: 'center', fontSize: '13px', color: '#666', marginBottom: '10px', background: '#f8f9ff', padding: '10px', borderRadius: '8px' },
  footer: { textAlign: 'center', marginTop: '12px', fontSize: '14px', color: '#666' },
  link: { color: '#e94560', fontWeight: '600', textDecoration: 'none' },
};
