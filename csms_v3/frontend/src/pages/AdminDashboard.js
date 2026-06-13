import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  getCustomers, getAllServiceRequests, updateServiceStatus, getAllCars,
  getAllGuestRequests, updateGuestRequestStatus,
  deleteServiceRequest, deleteGuestRequest, deleteUser, deleteCar,
  updateUser, updateCar
} from '../services/api';

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

function EditModal({ title, fields, data, onSave, onCancel }) {
  const [form, setForm] = useState(data);
  return (
    <div style={modal.overlay}>
      <div style={{ ...modal.box, maxWidth: 440 }}>
        <h3 style={{ marginBottom: 18, color: '#1a1a2e', fontSize: '1.1rem' }}>✏️ {title}</h3>
        {fields.map(f => (
          <div key={f.key} style={{ marginBottom: 14 }}>
            <label style={{ fontSize: 13, fontWeight: 500, color: '#555', display: 'block', marginBottom: 5 }}>{f.label}</label>
            <input
              style={{ width: '100%', padding: '10px 14px', border: '1.5px solid #e0e0e0', borderRadius: 9, fontSize: 14, boxSizing: 'border-box' }}
              type={f.type || 'text'}
              value={form[f.key] || ''}
              onChange={e => setForm({ ...form, [f.key]: e.target.value })}
            />
          </div>
        ))}
        <div style={modal.btns}>
          <button style={modal.cancelBtn} onClick={onCancel}>Cancel</button>
          <button style={{ ...modal.confirmBtn, background: 'linear-gradient(135deg,#0f3460,#1a1a2e)' }} onClick={() => onSave(form)}>Save</button>
        </div>
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [tab, setTab] = useState('requests');
  const [requests, setRequests] = useState([]);
  const [guestRequests, setGuestRequests] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [cars, setCars] = useState([]);
  const [filterStatus, setFilterStatus] = useState('');
  const [guestFilterStatus, setGuestFilterStatus] = useState('');
  const [confirm, setConfirm] = useState(null);
  const [editModal, setEditModal] = useState(null);
  const [toast, setToast] = useState('');

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(''), 3000); };

  const loadRequests = async (status = '') => { const r = await getAllServiceRequests(status); setRequests(r.data); };
  const loadGuestRequests = async (status = '') => { try { const r = await getAllGuestRequests(status); setGuestRequests(r.data); } catch { setGuestRequests([]); } };

  useEffect(() => {
    loadRequests();
    loadGuestRequests();
    getCustomers().then(r => setCustomers(r.data));
    getAllCars().then(r => setCars(r.data));
  }, []);

  const handleStatusUpdate = async (id, status) => { await updateServiceStatus(id, status); loadRequests(filterStatus); };
  const handleGuestStatusUpdate = async (id, status) => { await updateGuestRequestStatus(id, status); loadGuestRequests(guestFilterStatus); };

  // DELETE handlers
  const handleDeleteRequest = (id) => setConfirm({ message: `Delete service request #${id}?`, onConfirm: async () => { await deleteServiceRequest(id); loadRequests(filterStatus); setConfirm(null); showToast('🗑️ Request deleted'); } });
  const handleDeleteGuest = (id) => setConfirm({ message: `Delete guest request #${id}?`, onConfirm: async () => { await deleteGuestRequest(id); loadGuestRequests(guestFilterStatus); setConfirm(null); showToast('🗑️ Guest request deleted'); } });
  const handleDeleteCustomer = (id) => setConfirm({ message: `Delete customer #${id}? This cannot be undone.`, onConfirm: async () => { await deleteUser(id); getCustomers().then(r => setCustomers(r.data)); setConfirm(null); showToast('🗑️ Customer deleted'); } });
  const handleDeleteCar = (id) => setConfirm({ message: `Delete car #${id}?`, onConfirm: async () => { await deleteCar(id); getAllCars().then(r => setCars(r.data)); setConfirm(null); showToast('🗑️ Car deleted'); } });

  // EDIT handlers
  const handleEditCustomer = (c) => setEditModal({
    title: 'Edit Customer', data: { name: c.name, email: c.email, phone: c.phone || '' },
    fields: [{ key: 'name', label: 'Full Name' }, { key: 'email', label: 'Email', type: 'email' }, { key: 'phone', label: 'Phone' }],
    onSave: async (form) => { await updateUser(c.id, form); getCustomers().then(r => setCustomers(r.data)); setEditModal(null); showToast('✅ Customer updated'); }
  });
  const handleEditCar = (c) => setEditModal({
    title: 'Edit Car', data: { carBrand: c.carBrand, carModel: c.carModel, carNumber: c.carNumber },
    fields: [{ key: 'carBrand', label: 'Brand' }, { key: 'carModel', label: 'Model' }, { key: 'carNumber', label: 'Registration No.' }],
    onSave: async (form) => { await updateCar(c.id, form); getAllCars().then(r => setCars(r.data)); setEditModal(null); showToast('✅ Car updated'); }
  });

  const statusColor = { PENDING: '#f59e0b', IN_PROGRESS: '#3b82f6', COMPLETED: '#10b981', CANCELLED: '#ef4444' };
  const statuses = ['PENDING', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'];
  const pendingCount = requests.filter(r => r.status === 'PENDING').length;
  const inProgressCount = requests.filter(r => r.status === 'IN_PROGRESS').length;
  const completedCount = requests.filter(r => r.status === 'COMPLETED').length;
  const guestPendingCount = guestRequests.filter(r => r.status === 'PENDING').length;

  return (
    <div style={styles.page}>
      {confirm && <ConfirmModal message={confirm.message} onConfirm={confirm.onConfirm} onCancel={() => setConfirm(null)} />}
      {editModal && <EditModal title={editModal.title} fields={editModal.fields} data={editModal.data} onSave={editModal.onSave} onCancel={() => setEditModal(null)} />}
      {toast && <div style={styles.toast}>{toast}</div>}

      <nav style={styles.nav}>
        <span style={styles.navBrand}>🚗 CSMS Admin Panel</span>
        <div style={styles.navStats}>
          <span style={styles.navStat}>👥 {customers.length} Customers</span>
          <span style={styles.navStat}>🚘 {cars.length} Cars</span>
          <span style={styles.navStat}>📋 {requests.length} Requests</span>
          {guestPendingCount > 0 && <span style={{ ...styles.navStat, background: '#f59e0b', color: '#fff' }}>👤 {guestPendingCount} Guest Pending</span>}
        </div>
        <button onClick={() => { localStorage.clear(); navigate('/'); }} style={styles.logoutBtn}>Logout</button>
      </nav>

      <div style={styles.statsRow}>
        {[
          { label: 'Total Requests', value: requests.length, icon: '📋', color: '#0f3460' },
          { label: 'Pending', value: pendingCount, icon: '⏳', color: '#f59e0b' },
          { label: 'In Progress', value: inProgressCount, icon: '🔧', color: '#3b82f6' },
          { label: 'Completed', value: completedCount, icon: '✅', color: '#10b981' },
          { label: 'Guest Requests', value: guestRequests.length, icon: '👤', color: '#8b5cf6' },
        ].map(s => (
          <div key={s.label} style={{ ...styles.statCard, borderTop: `4px solid ${s.color}` }}>
            <span style={styles.statIcon}>{s.icon}</span>
            <div><div style={styles.statValue}>{s.value}</div><div style={styles.statLabel}>{s.label}</div></div>
          </div>
        ))}
      </div>

      <div style={styles.tabs}>
        {[['requests', '📋 Service Requests'], ['guest', `👤 Guest Requests${guestPendingCount > 0 ? ` (${guestPendingCount})` : ''}`], ['customers', '👥 Customers'], ['cars', '🚘 Cars']].map(([t, label]) => (
          <button key={t} onClick={() => setTab(t)} style={{ ...styles.tab, ...(tab === t ? styles.activeTab : {}) }}>{label}</button>
        ))}
      </div>

      <div style={styles.content}>

        {tab === 'requests' && (
          <div>
            <div style={styles.tableHeader}>
              <h2 style={styles.sectionTitle}>Service Requests</h2>
              <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                <label style={{ fontSize: 13, color: '#666' }}>Filter:</label>
                <select style={styles.filterSelect} value={filterStatus} onChange={e => { setFilterStatus(e.target.value); loadRequests(e.target.value); }}>
                  <option value="">All</option>
                  {statuses.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            </div>
            <div style={styles.tableWrapper}>
              <table style={styles.table}>
                <thead><tr>{['#', 'Customer', 'Car', 'Service Type', 'Date', 'Status', 'Update Status', 'Actions'].map(h => <th key={h} style={styles.th}>{h}</th>)}</tr></thead>
                <tbody>
                  {requests.map(r => (
                    <tr key={r.id} style={styles.tr}>
                      <td style={styles.td}>#{r.id}</td>
                      <td style={styles.td}><strong>{r.user?.name}</strong><br /><small style={{ color: '#888' }}>{r.user?.email}</small></td>
                      <td style={styles.td}>{r.car?.carBrand} {r.car?.carModel}<br /><small style={{ color: '#888' }}>{r.car?.carNumber}</small></td>
                      <td style={styles.td}>{r.serviceType}</td>
                      <td style={styles.td}>{r.requestDate}</td>
                      <td style={styles.td}><span style={{ ...styles.badge, background: statusColor[r.status] }}>{r.status}</span></td>
                      <td style={styles.td}>
                        <select style={styles.statusSelect} value={r.status} onChange={e => handleStatusUpdate(r.id, e.target.value)}>
                          {statuses.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                      </td>
                      <td style={styles.td}>
                        <button style={styles.delBtn} onClick={() => handleDeleteRequest(r.id)}>🗑️ Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {requests.length === 0 && <div style={styles.empty}>No service requests found.</div>}
            </div>
          </div>
        )}

        {tab === 'guest' && (
          <div>
            <div style={styles.tableHeader}>
              <h2 style={styles.sectionTitle}>Guest Requests <span style={styles.guestBadge}>No Login Required</span></h2>
              <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                <label style={{ fontSize: 13, color: '#666' }}>Filter:</label>
                <select style={styles.filterSelect} value={guestFilterStatus} onChange={e => { setGuestFilterStatus(e.target.value); loadGuestRequests(e.target.value); }}>
                  <option value="">All</option>
                  {statuses.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            </div>
            <div style={styles.infoBox}>ℹ️ These are requests submitted by walk-in guests without an account.</div>
            <div style={styles.tableWrapper}>
              <table style={styles.table}>
                <thead><tr>{['#', 'Guest Name', 'Contact', 'Car', 'Service Type', 'Date', 'Status', 'Update Status', 'Actions'].map(h => <th key={h} style={styles.th}>{h}</th>)}</tr></thead>
                <tbody>
                  {guestRequests.map(r => (
                    <tr key={r.id} style={styles.tr}>
                      <td style={styles.td}>#{r.id}</td>
                      <td style={styles.td}><strong>{r.guestName}</strong><br /><span style={styles.guestTag}>Guest</span></td>
                      <td style={styles.td}><div>📧 {r.guestEmail}</div><div>📞 {r.guestPhone}</div></td>
                      <td style={styles.td}>{r.carBrand} {r.carModel}<br /><small style={{ color: '#888' }}>{r.carNumber}</small></td>
                      <td style={styles.td}>{r.serviceType}</td>
                      <td style={styles.td}>{r.requestDate}</td>
                      <td style={styles.td}><span style={{ ...styles.badge, background: statusColor[r.status] }}>{r.status}</span></td>
                      <td style={styles.td}>
                        <select style={styles.statusSelect} value={r.status} onChange={e => handleGuestStatusUpdate(r.id, e.target.value)}>
                          {statuses.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                      </td>
                      <td style={styles.td}>
                        <button style={styles.delBtn} onClick={() => handleDeleteGuest(r.id)}>🗑️ Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {guestRequests.length === 0 && <div style={styles.empty}>No guest requests found.</div>}
            </div>
          </div>
        )}

        {tab === 'customers' && (
          <div>
            <h2 style={styles.sectionTitle}>Registered Customers ({customers.length})</h2>
            <div style={styles.tableWrapper}>
              <table style={styles.table}>
                <thead><tr>{['#', 'Name', 'Email', 'Phone', 'Actions'].map(h => <th key={h} style={styles.th}>{h}</th>)}</tr></thead>
                <tbody>
                  {customers.map(c => (
                    <tr key={c.id} style={styles.tr}>
                      <td style={styles.td}>#{c.id}</td>
                      <td style={styles.td}><strong>{c.name}</strong></td>
                      <td style={styles.td}>{c.email}</td>
                      <td style={styles.td}>{c.phone || '—'}</td>
                      <td style={styles.td}>
                        <div style={{ display: 'flex', gap: 8 }}>
                          <button style={styles.editBtn} onClick={() => handleEditCustomer(c)}>✏️ Edit</button>
                          <button style={styles.delBtn} onClick={() => handleDeleteCustomer(c.id)}>🗑️ Delete</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {customers.length === 0 && <div style={styles.empty}>No customers registered yet.</div>}
            </div>
          </div>
        )}

        {tab === 'cars' && (
          <div>
            <h2 style={styles.sectionTitle}>All Registered Cars ({cars.length})</h2>
            <div style={styles.tableWrapper}>
              <table style={styles.table}>
                <thead><tr>{['#', 'Owner', 'Brand', 'Model', 'Registration No.', 'Actions'].map(h => <th key={h} style={styles.th}>{h}</th>)}</tr></thead>
                <tbody>
                  {cars.map(c => (
                    <tr key={c.id} style={styles.tr}>
                      <td style={styles.td}>#{c.id}</td>
                      <td style={styles.td}><strong>{c.user?.name}</strong><br /><small style={{ color: '#888' }}>{c.user?.email}</small></td>
                      <td style={styles.td}>{c.carBrand}</td>
                      <td style={styles.td}>{c.carModel}</td>
                      <td style={styles.td}><span style={styles.plateBadge}>{c.carNumber}</span></td>
                      <td style={styles.td}>
                        <div style={{ display: 'flex', gap: 8 }}>
                          <button style={styles.editBtn} onClick={() => handleEditCar(c)}>✏️ Edit</button>
                          <button style={styles.delBtn} onClick={() => handleDeleteCar(c.id)}>🗑️ Delete</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {cars.length === 0 && <div style={styles.empty}>No cars registered yet.</div>}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

const modal = {
  overlay: { position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.55)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, backdropFilter: 'blur(4px)' },
  box: { background: '#fff', padding: '36px 32px', borderRadius: 18, width: '90%', maxWidth: 360, boxShadow: '0 30px 80px rgba(0,0,0,0.3)', textAlign: 'center', animation: 'none' },
  icon: { fontSize: '2.5rem', marginBottom: 12 },
  msg: { fontSize: 15, color: '#333', marginBottom: 24, lineHeight: 1.6 },
  btns: { display: 'flex', gap: 12, justifyContent: 'center' },
  cancelBtn: { padding: '10px 24px', border: '1.5px solid #ddd', borderRadius: 9, background: '#fff', cursor: 'pointer', fontWeight: 600, fontSize: 14, color: '#555' },
  confirmBtn: { padding: '10px 24px', border: 'none', borderRadius: 9, background: 'linear-gradient(135deg,#e94560,#c62a47)', color: '#fff', cursor: 'pointer', fontWeight: 600, fontSize: 14 },
};

const styles = {
  page: { minHeight: '100vh', background: '#f0f2f5' },
  nav: { background: 'linear-gradient(135deg,#1a1a2e,#0f3460)', color: '#fff', padding: '16px 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 },
  navBrand: { fontSize: '1.3rem', fontWeight: 700 },
  navStats: { display: 'flex', gap: 12, flexWrap: 'wrap' },
  navStat: { background: 'rgba(255,255,255,0.15)', padding: '6px 14px', borderRadius: 20, fontSize: 13 },
  logoutBtn: { background: '#e94560', color: '#fff', border: 'none', padding: '8px 18px', borderRadius: 8, cursor: 'pointer', fontWeight: 600 },
  statsRow: { display: 'flex', gap: 16, padding: '24px 32px', flexWrap: 'wrap' },
  statCard: { background: '#fff', padding: '20px 24px', borderRadius: 12, boxShadow: '0 2px 12px rgba(0,0,0,0.07)', display: 'flex', alignItems: 'center', gap: 16, flex: 1, minWidth: 150 },
  statIcon: { fontSize: '2rem' },
  statValue: { fontSize: '1.8rem', fontWeight: 700, color: '#1a1a2e' },
  statLabel: { fontSize: 13, color: '#888' },
  tabs: { display: 'flex', gap: 4, padding: '0 32px', background: '#fff', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', flexWrap: 'wrap' },
  tab: { padding: '14px 22px', border: 'none', background: 'none', cursor: 'pointer', fontWeight: 500, borderBottom: '3px solid transparent', fontSize: 14, color: '#666' },
  activeTab: { borderBottom: '3px solid #e94560', color: '#e94560' },
  content: { padding: 32, maxWidth: 1400, margin: '0 auto' },
  tableHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, flexWrap: 'wrap', gap: 12 },
  sectionTitle: { marginBottom: 0, color: '#1a1a2e', fontSize: '1.4rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 10 },
  guestBadge: { fontSize: 11, background: '#8b5cf6', color: '#fff', padding: '3px 10px', borderRadius: 20, fontWeight: 600 },
  infoBox: { background: '#fffbeb', border: '1px solid #fcd34d', borderRadius: 8, padding: '12px 16px', fontSize: 13, color: '#92400e', marginBottom: 16 },
  tableWrapper: { overflowX: 'auto', borderRadius: 12, boxShadow: '0 4px 16px rgba(0,0,0,0.08)', background: '#fff' },
  table: { width: '100%', borderCollapse: 'collapse' },
  th: { background: '#1a1a2e', color: '#fff', padding: '14px 18px', textAlign: 'left', fontSize: 13, fontWeight: 600, whiteSpace: 'nowrap' },
  tr: { borderBottom: '1px solid #f5f5f5' },
  td: { padding: '14px 18px', fontSize: 14, verticalAlign: 'middle' },
  badge: { padding: '5px 14px', borderRadius: 20, color: '#fff', fontSize: 12, fontWeight: 600, whiteSpace: 'nowrap' },
  guestTag: { fontSize: 10, background: '#8b5cf6', color: '#fff', padding: '2px 8px', borderRadius: 10, fontWeight: 600 },
  plateBadge: { background: '#f0f2f5', padding: '4px 12px', borderRadius: 6, fontWeight: 600, fontSize: 13, color: '#333' },
  filterSelect: { padding: '8px 14px', border: '1.5px solid #e0e0e0', borderRadius: 8, fontSize: 14, cursor: 'pointer' },
  statusSelect: { padding: '7px 12px', border: '1.5px solid #e0e0e0', borderRadius: 8, fontSize: 13, cursor: 'pointer', background: '#fff' },
  editBtn: { padding: '6px 14px', background: 'linear-gradient(135deg,#0f3460,#1a5276)', color: '#fff', border: 'none', borderRadius: 7, cursor: 'pointer', fontSize: 13, fontWeight: 600, whiteSpace: 'nowrap' },
  delBtn: { padding: '6px 14px', background: 'linear-gradient(135deg,#e94560,#c62a47)', color: '#fff', border: 'none', borderRadius: 7, cursor: 'pointer', fontSize: 13, fontWeight: 600, whiteSpace: 'nowrap' },
  empty: { textAlign: 'center', padding: 40, color: '#888', fontSize: 15 },
  toast: { position: 'fixed', bottom: 28, right: 28, background: '#1a1a2e', color: '#fff', padding: '14px 24px', borderRadius: 12, fontSize: 14, fontWeight: 600, zIndex: 9999, boxShadow: '0 8px 30px rgba(0,0,0,0.3)', animation: 'slideUpToast 0.3s ease' },
};
