import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { addCar, getCarsByUser, createServiceRequest, getServiceRequestsByUser, updateUser, deleteCar, deleteServiceRequest, updateCar } from '../services/api';

function ConfirmModal({ message, onConfirm, onCancel }) {
  return (
    <div style={modal.overlay}>
      <div style={modal.box}>
        <div style={modal.icon}>⚠️</div>
        <p style={modal.msg}>{message}</p>
        <div style={modal.btns}>
          <button style={modal.cancelBtn} onClick={onCancel}>Cancel</button>
          <button style={modal.confirmBtn} onClick={onConfirm}>Delete</button>
        </div>
      </div>
    </div>
  );
}

function EditCarModal({ car, onSave, onCancel }) {
  const [form, setForm] = useState({ carBrand: car.carBrand, carModel: car.carModel, carNumber: car.carNumber });
  return (
    <div style={modal.overlay}>
      <div style={{ ...modal.box, maxWidth: 400, textAlign: 'left' }}>
        <h3 style={{ marginBottom: 18, color: '#1a1a2e' }}>✏️ Edit Car</h3>
        {[['carBrand','Brand'],['carModel','Model'],['carNumber','Registration No.']].map(([k,l]) => (
          <div key={k} style={{ marginBottom: 14 }}>
            <label style={{ fontSize: 13, fontWeight: 500, color: '#555', display: 'block', marginBottom: 5 }}>{l}</label>
            <input style={{ width: '100%', padding: '10px 14px', border: '1.5px solid #e0e0e0', borderRadius: 9, fontSize: 14, boxSizing: 'border-box' }}
              value={form[k]} onChange={e => setForm({ ...form, [k]: e.target.value })} />
          </div>
        ))}
        <div style={{ ...modal.btns, justifyContent: 'flex-end', marginTop: 8 }}>
          <button style={modal.cancelBtn} onClick={onCancel}>Cancel</button>
          <button style={{ ...modal.confirmBtn, background: 'linear-gradient(135deg,#0f3460,#1a1a2e)' }} onClick={() => onSave(form)}>Save</button>
        </div>
      </div>
    </div>
  );
}

export default function CustomerDashboard() {
  const user = JSON.parse(localStorage.getItem('user'));
  const navigate = useNavigate();
  const [tab, setTab] = useState('requests');
  const [cars, setCars] = useState([]);
  const [requests, setRequests] = useState([]);
  const [carForm, setCarForm] = useState({ carBrand: '', carModel: '', carNumber: '' });
  const [reqForm, setReqForm] = useState({ carId: '', serviceType: '' });
  const [profileForm, setProfileForm] = useState({ name: user.name, phone: user.phone || '', password: '' });
  const [msg, setMsg] = useState('');
  const [confirm, setConfirm] = useState(null);
  const [editCar, setEditCar] = useState(null);

  const loadData = () => {
    getCarsByUser(user.id).then(r => setCars(r.data));
    getServiceRequestsByUser(user.id).then(r => setRequests(r.data));
  };

  useEffect(() => { loadData(); }, []);

  const showMsg = (text) => { setMsg(text); setTimeout(() => setMsg(''), 3000); };

  const handleAddCar = async (e) => {
    e.preventDefault();
    await addCar(user.id, carForm);
    await getCarsByUser(user.id).then(r => setCars(r.data));
    setCarForm({ carBrand: '', carModel: '', carNumber: '' });
    showMsg('✅ Car added successfully!');
  };

  const handleRequest = async (e) => {
    e.preventDefault();
    await createServiceRequest({ userId: user.id, carId: reqForm.carId, serviceType: reqForm.serviceType });
    await getServiceRequestsByUser(user.id).then(r => setRequests(r.data));
    setReqForm({ carId: '', serviceType: '' });
    showMsg('✅ Service request submitted!');
    setTab('requests');
  };

  const handleProfile = async (e) => {
    e.preventDefault();
    const updated = await updateUser(user.id, profileForm);
    localStorage.setItem('user', JSON.stringify({ ...user, ...updated.data }));
    showMsg('✅ Profile updated successfully!');
  };

  // DELETE
  const handleDeleteCar = (id) => setConfirm({ message: 'Delete this car? All related requests may be affected.', onConfirm: async () => { await deleteCar(id); loadData(); setConfirm(null); showMsg('🗑️ Car deleted'); } });
  const handleDeleteRequest = (id) => setConfirm({ message: 'Cancel and delete this service request?', onConfirm: async () => { await deleteServiceRequest(id); loadData(); setConfirm(null); showMsg('🗑️ Request deleted'); } });

  // EDIT car
  const handleEditCarSave = async (form) => { await updateCar(editCar.id, form); loadData(); setEditCar(null); showMsg('✅ Car updated!'); };

  const statusColor = { PENDING: '#f59e0b', IN_PROGRESS: '#3b82f6', COMPLETED: '#10b981', CANCELLED: '#ef4444' };
  const serviceTypes = ['Oil Change', 'Brake Inspection', 'Tire Rotation', 'Engine Tune-Up', 'AC Service', 'Battery Replacement', 'Full Service', 'Wheel Alignment', 'Car Wash'];
  const pendingCount = requests.filter(r => r.status === 'PENDING').length;
  const completedCount = requests.filter(r => r.status === 'COMPLETED').length;

  return (
    <div style={styles.page}>
      {confirm && <ConfirmModal message={confirm.message} onConfirm={confirm.onConfirm} onCancel={() => setConfirm(null)} />}
      {editCar && <EditCarModal car={editCar} onSave={handleEditCarSave} onCancel={() => setEditCar(null)} />}

      <nav style={styles.nav}>
        <span style={styles.navBrand}>🚗 CSMS</span>
        <span style={{ color: '#ccc', fontSize: 14 }}>Welcome, <strong style={{ color: '#fff' }}>{user.name}</strong></span>
        <button onClick={() => { localStorage.clear(); navigate('/'); }} style={styles.logoutBtn}>Logout</button>
      </nav>

      <div style={styles.statsRow}>
        {[
          { label: 'My Cars', value: cars.length, icon: '🚘', color: '#0f3460' },
          { label: 'Total Requests', value: requests.length, icon: '📋', color: '#e94560' },
          { label: 'Pending', value: pendingCount, icon: '⏳', color: '#f59e0b' },
          { label: 'Completed', value: completedCount, icon: '✅', color: '#10b981' },
        ].map(s => (
          <div key={s.label} style={{ ...styles.statCard, borderTop: `4px solid ${s.color}` }}>
            <span style={styles.statIcon}>{s.icon}</span>
            <div><div style={styles.statValue}>{s.value}</div><div style={styles.statLabel}>{s.label}</div></div>
          </div>
        ))}
      </div>

      <div style={styles.tabs}>
        {[['requests', '📋 My Requests'], ['cars', '🚘 My Cars'], ['new-request', '➕ New Request'], ['profile', '👤 Profile']].map(([t, label]) => (
          <button key={t} onClick={() => setTab(t)} style={{ ...styles.tab, ...(tab === t ? styles.activeTab : {}) }}>{label}</button>
        ))}
      </div>

      {msg && <div style={styles.msgBox}>{msg}</div>}

      <div style={styles.content}>

        {tab === 'requests' && (
          <div>
            <h2 style={styles.sectionTitle}>My Service Requests</h2>
            {requests.length === 0 ? (
              <div style={styles.empty}>
                <p style={{ fontSize: '3rem' }}>📋</p>
                <p>No service requests yet. <button style={styles.linkBtn} onClick={() => setTab('new-request')}>Create one →</button></p>
              </div>
            ) : (
              <div style={styles.tableWrapper}>
                <table style={styles.table}>
                  <thead><tr>{['#', 'Car', 'Service Type', 'Request Date', 'Status', 'Action'].map(h => <th key={h} style={styles.th}>{h}</th>)}</tr></thead>
                  <tbody>
                    {requests.map(r => (
                      <tr key={r.id} style={styles.tr}>
                        <td style={styles.td}>#{r.id}</td>
                        <td style={styles.td}>{r.car?.carBrand} {r.car?.carModel}<br /><small style={{ color: '#888' }}>{r.car?.carNumber}</small></td>
                        <td style={styles.td}>{r.serviceType}</td>
                        <td style={styles.td}>{r.requestDate}</td>
                        <td style={styles.td}><span style={{ ...styles.badge, background: statusColor[r.status] }}>{r.status}</span></td>
                        <td style={styles.td}>
                          {(r.status === 'PENDING') && (
                            <button style={styles.delBtn} onClick={() => handleDeleteRequest(r.id)}>🗑️ Cancel</button>
                          )}
                          {r.status !== 'PENDING' && <span style={{ color: '#bbb', fontSize: 13 }}>—</span>}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {tab === 'cars' && (
          <div>
            <h2 style={styles.sectionTitle}>My Cars</h2>
            <div style={styles.grid}>
              {cars.map(c => (
                <div key={c.id} style={styles.carCard}>
                  <div style={styles.carIconBox}>🚘</div>
                  <h3 style={{ marginBottom: 4 }}>{c.carBrand} {c.carModel}</h3>
                  <p style={styles.carPlate}>{c.carNumber}</p>
                  <div style={{ display: 'flex', gap: 8, justifyContent: 'center', marginTop: 12 }}>
                    <button style={styles.editBtn} onClick={() => setEditCar(c)}>✏️ Edit</button>
                    <button style={styles.delBtn} onClick={() => handleDeleteCar(c.id)}>🗑️ Delete</button>
                  </div>
                </div>
              ))}
            </div>
            <h3 style={{ margin: '32px 0 16px', color: '#1a1a2e' }}>Add New Car</h3>
            <form onSubmit={handleAddCar} style={styles.formCard}>
              <label style={styles.label}>Car Brand</label>
              <input style={styles.input} placeholder="e.g. Toyota" value={carForm.carBrand} onChange={e => setCarForm({ ...carForm, carBrand: e.target.value })} required />
              <label style={styles.label}>Car Model</label>
              <input style={styles.input} placeholder="e.g. Corolla" value={carForm.carModel} onChange={e => setCarForm({ ...carForm, carModel: e.target.value })} required />
              <label style={styles.label}>Registration Number</label>
              <input style={styles.input} placeholder="e.g. KA01AB1234" value={carForm.carNumber} onChange={e => setCarForm({ ...carForm, carNumber: e.target.value })} required />
              <button style={styles.btn} type="submit">Add Car</button>
            </form>
          </div>
        )}

        {tab === 'new-request' && (
          <div>
            <h2 style={styles.sectionTitle}>Request a Service</h2>
            {cars.length === 0 ? (
              <div style={styles.empty}>
                <p style={{ fontSize: '2rem' }}>🚘</p>
                <p>Please <button style={styles.linkBtn} onClick={() => setTab('cars')}>add a car first →</button></p>
              </div>
            ) : (
              <form onSubmit={handleRequest} style={styles.formCard}>
                <label style={styles.label}>Select Car</label>
                <select style={styles.input} value={reqForm.carId} onChange={e => setReqForm({ ...reqForm, carId: e.target.value })} required>
                  <option value="">-- Choose a car --</option>
                  {cars.map(c => <option key={c.id} value={c.id}>{c.carBrand} {c.carModel} — {c.carNumber}</option>)}
                </select>
                <label style={styles.label}>Service Type</label>
                <select style={styles.input} value={reqForm.serviceType} onChange={e => setReqForm({ ...reqForm, serviceType: e.target.value })} required>
                  <option value="">-- Select service --</option>
                  {serviceTypes.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
                <button style={styles.btn} type="submit">Submit Request</button>
              </form>
            )}
          </div>
        )}

        {tab === 'profile' && (
          <div>
            <h2 style={styles.sectionTitle}>Edit Profile</h2>
            <form onSubmit={handleProfile} style={styles.formCard}>
              <label style={styles.label}>Full Name</label>
              <input style={styles.input} placeholder="Full Name" value={profileForm.name} onChange={e => setProfileForm({ ...profileForm, name: e.target.value })} required />
              <label style={styles.label}>Phone Number</label>
              <input style={styles.input} placeholder="Phone Number" value={profileForm.phone} onChange={e => setProfileForm({ ...profileForm, phone: e.target.value })} />
              <label style={styles.label}>New Password <span style={{ color: '#aaa', fontWeight: 400 }}>(leave blank to keep current)</span></label>
              <input style={styles.input} type="password" placeholder="New password" value={profileForm.password} onChange={e => setProfileForm({ ...profileForm, password: e.target.value })} />
              <button style={styles.btn} type="submit">Save Changes</button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}

const modal = {
  overlay: { position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.55)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, backdropFilter: 'blur(4px)' },
  box: { background: '#fff', padding: '36px 32px', borderRadius: 18, width: '90%', maxWidth: 360, boxShadow: '0 30px 80px rgba(0,0,0,0.3)', textAlign: 'center' },
  icon: { fontSize: '2.5rem', marginBottom: 12 },
  msg: { fontSize: 15, color: '#333', marginBottom: 24, lineHeight: 1.6 },
  btns: { display: 'flex', gap: 12, justifyContent: 'center' },
  cancelBtn: { padding: '10px 24px', border: '1.5px solid #ddd', borderRadius: 9, background: '#fff', cursor: 'pointer', fontWeight: 600, fontSize: 14, color: '#555' },
  confirmBtn: { padding: '10px 24px', border: 'none', borderRadius: 9, background: 'linear-gradient(135deg,#e94560,#c62a47)', color: '#fff', cursor: 'pointer', fontWeight: 600, fontSize: 14 },
};

const styles = {
  page: { minHeight: '100vh', background: '#f0f2f5' },
  nav: { background: 'linear-gradient(135deg,#1a1a2e,#0f3460)', color: '#fff', padding: '16px 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' },
  navBrand: { fontSize: '1.4rem', fontWeight: 700 },
  logoutBtn: { background: '#e94560', color: '#fff', border: 'none', padding: '8px 18px', borderRadius: 8, cursor: 'pointer', fontWeight: 600 },
  statsRow: { display: 'flex', gap: 16, padding: '24px 32px', flexWrap: 'wrap' },
  statCard: { background: '#fff', padding: '20px 24px', borderRadius: 12, boxShadow: '0 2px 12px rgba(0,0,0,0.07)', display: 'flex', alignItems: 'center', gap: 16, flex: 1, minWidth: 160 },
  statIcon: { fontSize: '2rem' },
  statValue: { fontSize: '1.8rem', fontWeight: 700, color: '#1a1a2e' },
  statLabel: { fontSize: 13, color: '#888' },
  tabs: { display: 'flex', gap: 4, padding: '0 32px', background: '#fff', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' },
  tab: { padding: '14px 20px', border: 'none', background: 'none', cursor: 'pointer', fontWeight: 500, borderBottom: '3px solid transparent', fontSize: 14, color: '#666' },
  activeTab: { borderBottom: '3px solid #e94560', color: '#e94560' },
  content: { padding: 32, maxWidth: 1200, margin: '0 auto' },
  sectionTitle: { marginBottom: 20, color: '#1a1a2e', fontSize: '1.4rem', fontWeight: 600 },
  tableWrapper: { overflowX: 'auto', borderRadius: 12, boxShadow: '0 4px 16px rgba(0,0,0,0.08)' },
  table: { width: '100%', borderCollapse: 'collapse', background: '#fff' },
  th: { background: '#1a1a2e', color: '#fff', padding: '14px 18px', textAlign: 'left', fontSize: 13, fontWeight: 600 },
  tr: { borderBottom: '1px solid #f5f5f5' },
  td: { padding: '14px 18px', fontSize: 14 },
  badge: { padding: '5px 14px', borderRadius: 20, color: '#fff', fontSize: 12, fontWeight: 600 },
  editBtn: { padding: '6px 14px', background: 'linear-gradient(135deg,#0f3460,#1a5276)', color: '#fff', border: 'none', borderRadius: 7, cursor: 'pointer', fontSize: 13, fontWeight: 600 },
  delBtn: { padding: '6px 14px', background: 'linear-gradient(135deg,#e94560,#c62a47)', color: '#fff', border: 'none', borderRadius: 7, cursor: 'pointer', fontSize: 13, fontWeight: 600 },
  formCard: { background: '#fff', padding: 32, borderRadius: 14, maxWidth: 500, boxShadow: '0 4px 16px rgba(0,0,0,0.08)' },
  label: { display: 'block', fontSize: 13, fontWeight: 500, color: '#555', marginBottom: 6 },
  input: { width: '100%', padding: '12px 16px', marginBottom: 18, border: '1.5px solid #e0e0e0', borderRadius: 10, fontSize: 14, display: 'block' },
  btn: { padding: '13px 32px', background: 'linear-gradient(135deg,#e94560,#c62a47)', color: '#fff', border: 'none', borderRadius: 10, fontWeight: 600, cursor: 'pointer', fontSize: 15 },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(200px,1fr))', gap: 16, marginBottom: 8 },
  carCard: { background: '#fff', padding: 24, borderRadius: 14, textAlign: 'center', boxShadow: '0 4px 16px rgba(0,0,0,0.07)' },
  carIconBox: { fontSize: '2.5rem', marginBottom: 10 },
  carPlate: { background: '#f0f2f5', padding: '4px 12px', borderRadius: 6, display: 'inline-block', fontSize: 13, fontWeight: 600, color: '#555' },
  msgBox: { margin: '0 32px 8px', padding: '12px 20px', background: '#d1fae5', borderRadius: 8, color: '#065f46', fontSize: 14, fontWeight: 500 },
  empty: { textAlign: 'center', padding: '60px 20px', background: '#fff', borderRadius: 14, color: '#888', fontSize: 15 },
  linkBtn: { background: 'none', border: 'none', color: '#e94560', cursor: 'pointer', fontWeight: 600, fontSize: 15 },
};
