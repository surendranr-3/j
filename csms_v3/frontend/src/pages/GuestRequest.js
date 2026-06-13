import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { submitGuestRequest } from '../services/api';

const SERVICE_TYPES = ['Oil Change', 'Tyre Replacement', 'Brake Service', 'Engine Repair', 'AC Service', 'Full Service', 'Battery Replacement', 'Other'];

export default function GuestRequest() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ guestName: '', guestEmail: '', guestPhone: '', carBrand: '', carModel: '', carNumber: '', serviceType: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await submitGuestRequest(form);
      setSubmitted(true);
    } catch (err) {
      setError(err.response?.data?.error || 'Submission failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div style={styles.container}>
        <div style={styles.card}>
          <div style={styles.successIcon}>✅</div>
          <h2 style={styles.successTitle}>Request Submitted!</h2>
          <p style={styles.successMsg}>
            Thank you, <strong>{form.guestName}</strong>! Your service request has been received.
            Our team will contact you at <strong>{form.guestEmail}</strong> or <strong>{form.guestPhone}</strong> soon.
          </p>
          <button style={styles.btn} onClick={() => navigate('/login')}>Back to Login</button>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.logoArea}>
          <span style={styles.logoIcon}>🚗</span>
          <h1 style={styles.logoText}>CSMS</h1>
          <p style={styles.logoSub}>Car Service Management System</p>
        </div>

        

        {error && <div style={styles.error}>{error}</div>}

        <form onSubmit={handleSubmit}>
          <div style={styles.section}>
            <div style={styles.sectionHead}>👤 Your Details</div>
            <label style={styles.label}>Full Name</label>
            <input style={styles.input} type="text" placeholder="John Doe"
              value={form.guestName} onChange={e => setForm({ ...form, guestName: e.target.value })} required />
            <label style={styles.label}>Email Address</label>
            <input style={styles.input} type="email" placeholder="you@example.com"
              value={form.guestEmail} onChange={e => setForm({ ...form, guestEmail: e.target.value })} required />
            <label style={styles.label}>Phone Number</label>
            <input style={styles.input} type="text" placeholder="+91 98765 43210"
              value={form.guestPhone} onChange={e => setForm({ ...form, guestPhone: e.target.value })} required />
          </div>

          <div style={styles.section}>
            <div style={styles.sectionHead}>🚘 Car Details</div>
            <div style={styles.row}>
              <div style={{ flex: 1 }}>
                <label style={styles.label}>Car Brand</label>
                <input style={styles.input} type="text" placeholder="e.g. Toyota"
                  value={form.carBrand} onChange={e => setForm({ ...form, carBrand: e.target.value })} required />
              </div>
              <div style={{ flex: 1 }}>
                <label style={styles.label}>Car Model</label>
                <input style={styles.input} type="text" placeholder="e.g. Innova"
                  value={form.carModel} onChange={e => setForm({ ...form, carModel: e.target.value })} required />
              </div>
            </div>
            <label style={styles.label}>Registration Number</label>
            <input style={styles.input} type="text" placeholder="e.g. KA01AB1234"
              value={form.carNumber} onChange={e => setForm({ ...form, carNumber: e.target.value.toUpperCase() })} required />
          </div>

          <div style={styles.section}>
            <div style={styles.sectionHead}>🔧 Service Required</div>
            <label style={styles.label}>Service Type</label>
            <select style={styles.select} value={form.serviceType}
              onChange={e => setForm({ ...form, serviceType: e.target.value })} required>
              <option value="">-- Select service type --</option>
              {SERVICE_TYPES.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>

          <button style={styles.btn} type="submit" disabled={loading}>
            {loading ? 'Submitting...' : '📨 Submit Request'}
          </button>
        </form>

        <p style={styles.footer}>
          Have an account? <Link to="/login" style={styles.link}>Sign in here</Link>
        </p>
      </div>
    </div>
  );
}

const styles = {
  container: { minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)', padding: '24px' },
  card: { background: '#fff', padding: '36px 32px', borderRadius: '20px', width: '100%', maxWidth: '500px', boxShadow: '0 25px 60px rgba(0,0,0,0.4)' },
  logoArea: { textAlign: 'center', marginBottom: '16px' },
  logoIcon: { fontSize: '2.2rem' },
  logoText: { fontSize: '1.6rem', fontWeight: '700', color: '#1a1a2e', margin: '4px 0 0' },
  logoSub: { fontSize: '12px', color: '#888', marginTop: '4px' },
  title: { fontSize: '1.2rem', fontWeight: '700', color: '#1a1a2e', textAlign: 'center', marginBottom: '4px' },
  subtitle: { fontSize: '13px', color: '#888', textAlign: 'center', marginBottom: '20px' },
  section: { background: '#f9fafb', borderRadius: '10px', padding: '16px', marginBottom: '14px', border: '1px solid #eee' },
  sectionHead: { fontSize: '13px', fontWeight: '700', color: '#0f3460', marginBottom: '12px' },
  row: { display: 'flex', gap: '10px' },
  label: { display: 'block', fontSize: '12px', fontWeight: '500', color: '#555', marginBottom: '5px' },
  input: { width: '100%', padding: '10px 14px', marginBottom: '12px', border: '1.5px solid #e0e0e0', borderRadius: '8px', fontSize: '13px', display: 'block', outline: 'none', boxSizing: 'border-box', background: '#fff' },
  select: { width: '100%', padding: '10px 14px', border: '1.5px solid #e0e0e0', borderRadius: '8px', fontSize: '13px', background: '#fff', cursor: 'pointer', outline: 'none', boxSizing: 'border-box' },
  btn: { width: '100%', padding: '13px', background: 'linear-gradient(135deg, #e94560, #c62a47)', color: '#fff', border: 'none', borderRadius: '10px', fontSize: '15px', fontWeight: '600', cursor: 'pointer', marginTop: '8px' },
  error: { background: '#fff0f0', color: '#c62a47', padding: '10px 14px', borderRadius: '8px', marginBottom: '14px', fontSize: '13px', border: '1px solid #f5c0c0' },
  footer: { textAlign: 'center', marginTop: '16px', fontSize: '14px', color: '#666' },
  link: { color: '#e94560', fontWeight: '600', textDecoration: 'none' },
  successIcon: { fontSize: '3rem', textAlign: 'center', marginBottom: '12px' },
  successTitle: { fontSize: '1.4rem', fontWeight: '700', color: '#10b981', textAlign: 'center', marginBottom: '10px' },
  successMsg: { fontSize: '14px', color: '#555', textAlign: 'center', lineHeight: 1.6, marginBottom: '24px' },
};
