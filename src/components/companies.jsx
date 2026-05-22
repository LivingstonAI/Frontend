import React, { useEffect, useState, useRef, useCallback } from "react";
import Header from "./header";
import SideNavs from "./side_navs";

const BASE = 'https://backend-production-c0ab.up.railway.app';

// ─── STYLES ───────────────────────────────────────────────────────────────────
const styles = {
  page: {
    fontFamily: "'DM Sans', 'Segoe UI', sans-serif",
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 28,
    flexWrap: 'wrap',
    gap: 12,
  },
  pageTitle: {
    fontSize: 22,
    fontWeight: 600,
    color: '#042c53',
    margin: 0,
    display: 'flex',
    alignItems: 'center',
    gap: 10,
  },
  pageTitleAccent: {
    display: 'inline-block',
    width: 4,
    height: 24,
    background: 'linear-gradient(180deg, #185fa5, #378add)',
    borderRadius: 2,
  },

  // ── Buttons ──
  btnPrimary: {
    background: 'linear-gradient(135deg, #042c53, #185fa5)',
    border: 'none',
    color: '#fff',
    borderRadius: 10,
    padding: '9px 20px',
    fontSize: 13,
    fontWeight: 500,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: 6,
    transition: 'opacity 0.2s',
  },
  btnSecondary: {
    background: 'transparent',
    border: '1px solid #b5d4f4',
    color: '#185fa5',
    borderRadius: 10,
    padding: '8px 16px',
    fontSize: 13,
    cursor: 'pointer',
    transition: 'background 0.2s',
  },
  btnDanger: {
    background: '#fcebeb',
    border: '1px solid #f7c1c1',
    color: '#791f1f',
    borderRadius: 8,
    padding: '5px 10px',
    fontSize: 12,
    cursor: 'pointer',
  },
  btnSmall: {
    background: '#e6f1fb',
    border: '1px solid #b5d4f4',
    color: '#185fa5',
    borderRadius: 7,
    padding: '5px 10px',
    fontSize: 12,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: 4,
  },

  // ── Company grid ──
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
    gap: 20,
  },
  card: {
    background: '#fff',
    border: '1px solid #b5d4f4',
    borderRadius: 16,
    overflow: 'hidden',
    transition: 'box-shadow 0.2s',
  },
  cardTopBar: {
    height: 4,
    background: 'linear-gradient(90deg, #042c53, #185fa5, #378add)',
  },
  cardHead: {
    padding: '16px 18px 12px',
    display: 'flex',
    alignItems: 'center',
    gap: 14,
    borderBottom: '1px solid #e6f1fb',
  },
  logoCircle: {
    width: 52,
    height: 52,
    borderRadius: 12,
    background: '#e6f1fb',
    border: '1px solid #b5d4f4',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 22,
    fontWeight: 700,
    color: '#185fa5',
    flexShrink: 0,
    overflow: 'hidden',
  },
  logoImg: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    borderRadius: 11,
  },
  companyName: {
    fontSize: 16,
    fontWeight: 600,
    color: '#042c53',
    margin: 0,
  },
  sectorBadge: {
    fontSize: 11,
    fontWeight: 500,
    color: '#185fa5',
    background: '#e6f1fb',
    border: '1px solid #b5d4f4',
    borderRadius: 6,
    padding: '2px 8px',
    display: 'inline-block',
    marginTop: 3,
  },
  cardBody: {
    padding: '14px 18px',
  },
  description: {
    fontSize: 13,
    color: '#4a6fa5',
    lineHeight: 1.6,
    marginBottom: 14,
  },

  // ── Tabs inside card ──
  tabRow: {
    display: 'flex',
    gap: 4,
    marginBottom: 14,
    borderBottom: '1px solid #e6f1fb',
    paddingBottom: 0,
  },
  tab: (active) => ({
    fontSize: 12,
    fontWeight: 500,
    padding: '6px 12px',
    cursor: 'pointer',
    borderRadius: '8px 8px 0 0',
    border: 'none',
    background: active ? '#e6f1fb' : 'transparent',
    color: active ? '#042c53' : '#85b7eb',
    borderBottom: active ? '2px solid #185fa5' : '2px solid transparent',
    transition: 'all 0.15s',
    marginBottom: -1,
  }),

  // ── Key people ──
  personCard: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    padding: '8px 10px',
    background: '#f4f8fd',
    borderRadius: 10,
    border: '1px solid #daeaf7',
    marginBottom: 8,
  },
  personPhoto: {
    width: 38,
    height: 38,
    borderRadius: '50%',
    background: '#e6f1fb',
    border: '1px solid #b5d4f4',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 15,
    fontWeight: 600,
    color: '#185fa5',
    flexShrink: 0,
    overflow: 'hidden',
  },
  personPhotoImg: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    borderRadius: '50%',
  },
  personName: {
    fontSize: 13,
    fontWeight: 500,
    color: '#042c53',
    margin: 0,
  },
  personRole: {
    fontSize: 11,
    color: '#4a6fa5',
    margin: 0,
  },
  personBio: {
    fontSize: 11,
    color: '#6a8fb5',
    marginTop: 2,
    lineHeight: 1.5,
  },

  // ── Links ──
  linkItem: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    padding: '7px 10px',
    background: '#f4f8fd',
    borderRadius: 8,
    border: '1px solid #daeaf7',
    marginBottom: 7,
  },
  linkIcon: {
    fontSize: 16,
    flexShrink: 0,
  },
  linkTitle: {
    fontSize: 13,
    color: '#042c53',
    flex: 1,
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  linkTypeBadge: (type) => ({
    fontSize: 10,
    fontWeight: 500,
    padding: '2px 7px',
    borderRadius: 5,
    background: type === 'youtube' ? '#fff0f0' : type === 'pdf' ? '#fff8e6' : '#e6f1fb',
    color: type === 'youtube' ? '#c00' : type === 'pdf' ? '#a05a00' : '#185fa5',
    border: `1px solid ${type === 'youtube' ? '#ffc1c1' : type === 'pdf' ? '#f5d090' : '#b5d4f4'}`,
    flexShrink: 0,
  }),

  // ── Add section ──
  addSection: {
    marginTop: 10,
    paddingTop: 10,
    borderTop: '1px dashed #b5d4f4',
  },

  // ── Modals ──
  modalOverlay: {
    position: 'fixed',
    inset: 0,
    background: 'rgba(4,44,83,0.6)',
    zIndex: 9999,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  modalBox: {
    background: '#fff',
    borderRadius: 16,
    border: '1px solid #b5d4f4',
    width: '100%',
    maxWidth: 520,
    maxHeight: '90vh',
    overflowY: 'auto',
  },
  modalHeader: {
    background: 'linear-gradient(135deg, #042c53 0%, #0c447c 50%, #185fa5 100%)',
    padding: '1.2rem 1.5rem',
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    borderRadius: '16px 16px 0 0',
    position: 'sticky',
    top: 0,
    zIndex: 1,
  },
  modalTitle: {
    color: '#fff',
    fontSize: 15,
    fontWeight: 500,
    margin: 0,
    flex: 1,
  },
  modalCloseBtn: {
    background: 'rgba(255,255,255,0.15)',
    border: 'none',
    borderRadius: 8,
    color: '#fff',
    width: 30,
    height: 30,
    cursor: 'pointer',
    fontSize: 18,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalBody: {
    padding: '1.5rem',
  },
  modalFooter: {
    padding: '1rem 1.5rem',
    borderTop: '1px solid #e6f1fb',
    display: 'flex',
    gap: 10,
    justifyContent: 'flex-end',
    background: '#f4f8fd',
    borderRadius: '0 0 16px 16px',
    position: 'sticky',
    bottom: 0,
  },

  // ── Form ──
  formGroup: { marginBottom: 14 },
  label: {
    fontSize: 11,
    fontWeight: 500,
    color: '#185fa5',
    textTransform: 'uppercase',
    letterSpacing: '0.4px',
    display: 'block',
    marginBottom: 5,
  },
  input: {
    width: '100%',
    border: '1px solid #b5d4f4',
    borderRadius: 8,
    padding: '9px 12px',
    fontSize: 14,
    color: '#042c53',
    background: '#e6f1fb',
    outline: 'none',
    fontFamily: 'inherit',
    boxSizing: 'border-box',
  },
  textarea: {
    width: '100%',
    border: '1px solid #b5d4f4',
    borderRadius: 8,
    padding: '9px 12px',
    fontSize: 14,
    color: '#042c53',
    background: '#e6f1fb',
    outline: 'none',
    fontFamily: 'inherit',
    resize: 'vertical',
    boxSizing: 'border-box',
  },
  select: {
    width: '100%',
    border: '1px solid #b5d4f4',
    borderRadius: 8,
    padding: '9px 12px',
    fontSize: 14,
    color: '#042c53',
    background: '#e6f1fb',
    outline: 'none',
    fontFamily: 'inherit',
  },
  error: {
    background: '#fcebeb',
    border: '1px solid #f09595',
    borderRadius: 8,
    padding: '8px 12px',
    color: '#791f1f',
    fontSize: 13,
    marginBottom: 14,
  },

  // ── YouTube modal ──
  ytModalBox: {
    background: '#000',
    borderRadius: 16,
    width: '100%',
    maxWidth: 860,
    overflow: 'hidden',
  },
  ytModalHeader: {
    background: '#111',
    padding: '10px 16px',
    display: 'flex',
    alignItems: 'center',
    gap: 10,
  },
  ytLogo: {
    background: '#ff0000',
    borderRadius: 6,
    padding: '2px 7px',
    fontSize: 11,
    fontWeight: 700,
    color: '#fff',
    letterSpacing: '0.5px',
    display: 'flex',
    alignItems: 'center',
    gap: 4,
  },
  ytTitle: {
    color: '#ddd',
    fontSize: 13,
    flex: 1,
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  ytIframe: {
    width: '100%',
    aspectRatio: '16/9',
    border: 'none',
    display: 'block',
  },

  // ── PDF modal ──
  pdfModalBox: {
    background: '#fff',
    borderRadius: 16,
    width: '100%',
    maxWidth: 900,
    maxHeight: '90vh',
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
  },
  pdfIframe: {
    flex: 1,
    border: 'none',
    width: '100%',
    minHeight: '75vh',
  },

  // ── Empty ──
  empty: {
    textAlign: 'center',
    padding: '40px 20px',
    color: '#85b7eb',
    fontSize: 14,
  },

  // ── Search bar ──
  searchBar: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    marginBottom: 24,
    flexWrap: 'wrap',
  },
  searchInput: {
    flex: 1,
    minWidth: 200,
    border: '1px solid #b5d4f4',
    borderRadius: 10,
    padding: '9px 14px',
    fontSize: 14,
    color: '#042c53',
    background: '#e6f1fb',
    outline: 'none',
    fontFamily: 'inherit',
  },
};

// ─── YOUTUBE ID EXTRACTOR ─────────────────────────────────────────────────────
function extractYouTubeId(url) {
  const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([A-Za-z0-9_-]{11})/);
  return match ? match[1] : null;
}

// ─── BASE64 FILE READER ───────────────────────────────────────────────────────
function readFileAsBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result); // includes data:image/...;base64,
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

// ─── ADD COMPANY MODAL ────────────────────────────────────────────────────────
function AddCompanyModal({ onClose, onSaved }) {
  const [form, setForm] = useState({ name: '', description: '', sector: '', logo_base64: '' });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const f = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const handleLogoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const b64 = await readFileAsBase64(file);
    f('logo_base64', b64);
  };

  const handleSave = async () => {
    if (!form.name.trim()) { setError('Company name is required'); return; }
    setSaving(true); setError('');
    try {
      const res = await fetch(`${BASE}/snowai-companies-of-interest/add/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (res.ok) { onSaved(); onClose(); }
      else { const d = await res.json(); setError(d.error || 'Failed to save'); }
    } catch { setError('Network error'); }
    finally { setSaving(false); }
  };

  return (
    <div style={styles.modalOverlay}>
      <div style={styles.modalBox}>
        <div style={styles.modalHeader}>
          <span style={{ fontSize: 20 }}>🏢</span>
          <h2 style={styles.modalTitle}>Add company</h2>
          <button style={styles.modalCloseBtn} onClick={onClose}>×</button>
        </div>
        <div style={styles.modalBody}>
          {error && <div style={styles.error}>{error}</div>}
          <div style={styles.formGroup}>
            <label style={styles.label}>Company name *</label>
            <input style={styles.input} placeholder="e.g. Anthropic" value={form.name} onChange={e => f('name', e.target.value)} />
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label}>Sector</label>
            <input style={styles.input} placeholder="e.g. AI, Fintech, Healthcare" value={form.sector} onChange={e => f('sector', e.target.value)} />
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label}>Description</label>
            <textarea style={styles.textarea} rows={3} placeholder="Brief description of the company..." value={form.description} onChange={e => f('description', e.target.value)} />
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label}>Logo <span style={{ color: '#85b7eb', textTransform: 'none' }}>(image → stored as base64)</span></label>
            <input type="file" accept="image/*" onChange={handleLogoUpload} style={{ fontSize: 13, color: '#185fa5' }} />
            {form.logo_base64 && (
              <div style={{ marginTop: 8, display: 'flex', alignItems: 'center', gap: 8 }}>
                <img src={form.logo_base64} alt="preview" style={{ width: 44, height: 44, borderRadius: 10, objectFit: 'cover', border: '1px solid #b5d4f4' }} />
                <button style={styles.btnDanger} onClick={() => f('logo_base64', '')}>Remove</button>
              </div>
            )}
          </div>
        </div>
        <div style={styles.modalFooter}>
          <button style={styles.btnSecondary} onClick={onClose}>Cancel</button>
          <button style={styles.btnPrimary} onClick={handleSave} disabled={saving}>{saving ? 'Saving...' : '💾 Save company'}</button>
        </div>
      </div>
    </div>
  );
}

// ─── ADD PERSON MODAL ─────────────────────────────────────────────────────────
function AddPersonModal({ companyId, onClose, onSaved }) {
  const [form, setForm] = useState({ name: '', role: '', bio: '', photo_base64: '' });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const f = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const handlePhotoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const b64 = await readFileAsBase64(file);
    f('photo_base64', b64);
  };

  const handleSave = async () => {
    if (!form.name.trim()) { setError('Name is required'); return; }
    setSaving(true); setError('');
    try {
      const res = await fetch(`${BASE}/snowai-companies-of-interest/${companyId}/add-person/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (res.ok) { onSaved(); onClose(); }
      else { const d = await res.json(); setError(d.error || 'Failed to save'); }
    } catch { setError('Network error'); }
    finally { setSaving(false); }
  };

  return (
    <div style={styles.modalOverlay}>
      <div style={styles.modalBox}>
        <div style={styles.modalHeader}>
          <span style={{ fontSize: 20 }}>👤</span>
          <h2 style={styles.modalTitle}>Add key person</h2>
          <button style={styles.modalCloseBtn} onClick={onClose}>×</button>
        </div>
        <div style={styles.modalBody}>
          {error && <div style={styles.error}>{error}</div>}
          <div style={styles.formGroup}>
            <label style={styles.label}>Full name *</label>
            <input style={styles.input} placeholder="e.g. Sam Altman" value={form.name} onChange={e => f('name', e.target.value)} />
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label}>Role / title</label>
            <input style={styles.input} placeholder="e.g. CEO & Co-Founder" value={form.role} onChange={e => f('role', e.target.value)} />
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label}>Bio / notes</label>
            <textarea style={styles.textarea} rows={3} placeholder="Background, key decisions, why they matter..." value={form.bio} onChange={e => f('bio', e.target.value)} />
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label}>Profile photo <span style={{ color: '#85b7eb', textTransform: 'none' }}>(stored as base64)</span></label>
            <input type="file" accept="image/*" onChange={handlePhotoUpload} style={{ fontSize: 13, color: '#185fa5' }} />
            {form.photo_base64 && (
              <div style={{ marginTop: 8, display: 'flex', alignItems: 'center', gap: 8 }}>
                <img src={form.photo_base64} alt="preview" style={{ width: 40, height: 40, borderRadius: '50%', objectFit: 'cover', border: '1px solid #b5d4f4' }} />
                <button style={styles.btnDanger} onClick={() => f('photo_base64', '')}>Remove</button>
              </div>
            )}
          </div>
        </div>
        <div style={styles.modalFooter}>
          <button style={styles.btnSecondary} onClick={onClose}>Cancel</button>
          <button style={styles.btnPrimary} onClick={handleSave} disabled={saving}>{saving ? 'Saving...' : '💾 Save person'}</button>
        </div>
      </div>
    </div>
  );
}

// ─── ADD LINK MODAL ───────────────────────────────────────────────────────────
function AddLinkModal({ companyId, onClose, onSaved }) {
  const [form, setForm] = useState({ link_type: 'url', title: '', url: '' });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const f = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const handleSave = async () => {
    if (!form.title.trim() || !form.url.trim()) { setError('Title and URL are required'); return; }
    setSaving(true); setError('');
    try {
      const res = await fetch(`${BASE}/snowai-companies-of-interest/${companyId}/add-link/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (res.ok) { onSaved(); onClose(); }
      else { const d = await res.json(); setError(d.error || 'Failed to save'); }
    } catch { setError('Network error'); }
    finally { setSaving(false); }
  };

  const placeholders = {
    url:     'https://example.com',
    pdf:     'https://example.com/document.pdf',
    youtube: 'https://youtube.com/watch?v=...',
  };

  return (
    <div style={styles.modalOverlay}>
      <div style={styles.modalBox}>
        <div style={styles.modalHeader}>
          <span style={{ fontSize: 20 }}>🔗</span>
          <h2 style={styles.modalTitle}>Add link / resource</h2>
          <button style={styles.modalCloseBtn} onClick={onClose}>×</button>
        </div>
        <div style={styles.modalBody}>
          {error && <div style={styles.error}>{error}</div>}
          <div style={styles.formGroup}>
            <label style={styles.label}>Type</label>
            <select style={styles.select} value={form.link_type} onChange={e => f('link_type', e.target.value)}>
              <option value="url">🌐 Web link</option>
              <option value="pdf">📄 PDF document</option>
              <option value="youtube">▶️ YouTube video</option>
            </select>
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label}>Title</label>
            <input style={styles.input} placeholder="e.g. Annual Report 2024" value={form.title} onChange={e => f('title', e.target.value)} />
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label}>URL</label>
            <input style={styles.input} placeholder={placeholders[form.link_type]} value={form.url} onChange={e => f('url', e.target.value)} />
          </div>
        </div>
        <div style={styles.modalFooter}>
          <button style={styles.btnSecondary} onClick={onClose}>Cancel</button>
          <button style={styles.btnPrimary} onClick={handleSave} disabled={saving}>{saving ? 'Saving...' : '💾 Save link'}</button>
        </div>
      </div>
    </div>
  );
}

// ─── EDIT COMPANY MODAL ───────────────────────────────────────────────────────
function EditCompanyModal({ company, onClose, onSaved }) {
  const [form, setForm] = useState({
    name:        company.name,
    description: company.description,
    sector:      company.sector,
    logo_base64: company.logo_base64,
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const f = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const handleLogoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    f('logo_base64', await readFileAsBase64(file));
  };

  const handleSave = async () => {
    if (!form.name.trim()) { setError('Company name is required'); return; }
    setSaving(true); setError('');
    try {
      const res = await fetch(`${BASE}/snowai-companies-of-interest/${company.id}/update/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (res.ok) { onSaved(); onClose(); }
      else { const d = await res.json(); setError(d.error || 'Failed to save'); }
    } catch { setError('Network error'); }
    finally { setSaving(false); }
  };

  return (
    <div style={styles.modalOverlay}>
      <div style={styles.modalBox}>
        <div style={styles.modalHeader}>
          <span style={{ fontSize: 20 }}>✏️</span>
          <h2 style={styles.modalTitle}>Edit company</h2>
          <button style={styles.modalCloseBtn} onClick={onClose}>×</button>
        </div>
        <div style={styles.modalBody}>
          {error && <div style={styles.error}>{error}</div>}
          <div style={styles.formGroup}>
            <label style={styles.label}>Company name *</label>
            <input style={styles.input} value={form.name} onChange={e => f('name', e.target.value)} />
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label}>Sector</label>
            <input style={styles.input} value={form.sector} onChange={e => f('sector', e.target.value)} />
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label}>Description</label>
            <textarea style={styles.textarea} rows={3} value={form.description} onChange={e => f('description', e.target.value)} />
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label}>Logo <span style={{ color: '#85b7eb', textTransform: 'none' }}>(replace image)</span></label>
            <input type="file" accept="image/*" onChange={handleLogoUpload} style={{ fontSize: 13, color: '#185fa5' }} />
            {form.logo_base64 && (
              <div style={{ marginTop: 8, display: 'flex', alignItems: 'center', gap: 8 }}>
                <img src={form.logo_base64} alt="preview" style={{ width: 44, height: 44, borderRadius: 10, objectFit: 'cover', border: '1px solid #b5d4f4' }} />
                <button style={styles.btnDanger} onClick={() => f('logo_base64', '')}>Remove</button>
              </div>
            )}
          </div>
        </div>
        <div style={styles.modalFooter}>
          <button style={styles.btnSecondary} onClick={onClose}>Cancel</button>
          <button style={styles.btnPrimary} onClick={handleSave} disabled={saving}>{saving ? 'Saving...' : '💾 Save changes'}</button>
        </div>
      </div>
    </div>
  );
}

// ─── EDIT PERSON MODAL ────────────────────────────────────────────────────────
function EditPersonModal({ person, onClose, onSaved }) {
  const [form, setForm] = useState({
    name:         person.name,
    role:         person.role,
    bio:          person.bio,
    photo_base64: person.photo_base64,
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const f = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const handlePhotoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    f('photo_base64', await readFileAsBase64(file));
  };

  const handleSave = async () => {
    if (!form.name.trim()) { setError('Name is required'); return; }
    setSaving(true); setError('');
    try {
      const res = await fetch(`${BASE}/snowai-companies-of-interest/update-person/${person.id}/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (res.ok) { onSaved(); onClose(); }
      else { const d = await res.json(); setError(d.error || 'Failed to save'); }
    } catch { setError('Network error'); }
    finally { setSaving(false); }
  };

  return (
    <div style={styles.modalOverlay}>
      <div style={styles.modalBox}>
        <div style={styles.modalHeader}>
          <span style={{ fontSize: 20 }}>✏️</span>
          <h2 style={styles.modalTitle}>Edit person — {person.name}</h2>
          <button style={styles.modalCloseBtn} onClick={onClose}>×</button>
        </div>
        <div style={styles.modalBody}>
          {error && <div style={styles.error}>{error}</div>}
          <div style={styles.formGroup}>
            <label style={styles.label}>Full name *</label>
            <input style={styles.input} value={form.name} onChange={e => f('name', e.target.value)} />
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label}>Role / title</label>
            <input style={styles.input} value={form.role} onChange={e => f('role', e.target.value)} />
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label}>Bio / notes</label>
            <textarea style={styles.textarea} rows={3} value={form.bio} onChange={e => f('bio', e.target.value)} />
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label}>Profile photo <span style={{ color: '#85b7eb', textTransform: 'none' }}>(replace)</span></label>
            <input type="file" accept="image/*" onChange={handlePhotoUpload} style={{ fontSize: 13, color: '#185fa5' }} />
            {form.photo_base64 && (
              <div style={{ marginTop: 8, display: 'flex', alignItems: 'center', gap: 8 }}>
                <img src={form.photo_base64} alt="preview" style={{ width: 40, height: 40, borderRadius: '50%', objectFit: 'cover', border: '1px solid #b5d4f4' }} />
                <button style={styles.btnDanger} onClick={() => f('photo_base64', '')}>Remove</button>
              </div>
            )}
          </div>
        </div>
        <div style={styles.modalFooter}>
          <button style={styles.btnSecondary} onClick={onClose}>Cancel</button>
          <button style={styles.btnPrimary} onClick={handleSave} disabled={saving}>{saving ? 'Saving...' : '💾 Save changes'}</button>
        </div>
      </div>
    </div>
  );
}

// ─── EDIT LINK MODAL ──────────────────────────────────────────────────────────
function EditLinkModal({ link, onClose, onSaved }) {
  const [form, setForm] = useState({ title: link.title, url: link.url });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const f = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const handleSave = async () => {
    if (!form.title.trim() || !form.url.trim()) { setError('Title and URL are required'); return; }
    setSaving(true); setError('');
    try {
      const res = await fetch(`${BASE}/snowai-companies-of-interest/update-link/${link.id}/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (res.ok) { onSaved(); onClose(); }
      else { const d = await res.json(); setError(d.error || 'Failed to save'); }
    } catch { setError('Network error'); }
    finally { setSaving(false); }
  };

  const typeLabel = { url: '🌐 Web link', pdf: '📄 PDF', youtube: '▶️ YouTube' }[link.link_type];

  return (
    <div style={styles.modalOverlay}>
      <div style={styles.modalBox}>
        <div style={styles.modalHeader}>
          <span style={{ fontSize: 20 }}>✏️</span>
          <h2 style={styles.modalTitle}>Edit {typeLabel}</h2>
          <button style={styles.modalCloseBtn} onClick={onClose}>×</button>
        </div>
        <div style={styles.modalBody}>
          {error && <div style={styles.error}>{error}</div>}
          <div style={styles.formGroup}>
            <label style={styles.label}>Title</label>
            <input style={styles.input} value={form.title} onChange={e => f('title', e.target.value)} />
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label}>URL</label>
            <input style={styles.input} value={form.url} onChange={e => f('url', e.target.value)} />
          </div>
        </div>
        <div style={styles.modalFooter}>
          <button style={styles.btnSecondary} onClick={onClose}>Cancel</button>
          <button style={styles.btnPrimary} onClick={handleSave} disabled={saving}>{saving ? 'Saving...' : '💾 Save changes'}</button>
        </div>
      </div>
    </div>
  );
}

// ─── YOUTUBE PLAYER MODAL ─────────────────────────────────────────────────────
function YouTubeModal({ link, onClose }) {
  const videoId = extractYouTubeId(link.url);

  return (
    <div style={styles.modalOverlay} onClick={onClose}>
      <div style={styles.ytModalBox} onClick={e => e.stopPropagation()}>
        <div style={styles.ytModalHeader}>
          <div style={styles.ytLogo}>
            <span>▶</span>
            <span>SnowAI YouTube</span>
          </div>
          <span style={styles.ytTitle}>{link.title}</span>
          <button onClick={onClose} style={{ background: 'transparent', border: 'none', color: '#aaa', fontSize: 22, cursor: 'pointer', padding: '2px 6px' }}>×</button>
        </div>
        {videoId ? (
          <iframe
            style={styles.ytIframe}
            src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`}
            title={link.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        ) : (
          <div style={{ padding: 40, textAlign: 'center', color: '#aaa', fontSize: 14 }}>
            Could not extract YouTube video ID from this URL.
          </div>
        )}
      </div>
    </div>
  );
}

// ─── PDF VIEWER MODAL ─────────────────────────────────────────────────────────
function PDFModal({ link, onClose }) {
  return (
    <div style={styles.modalOverlay} onClick={onClose}>
      <div style={styles.pdfModalBox} onClick={e => e.stopPropagation()}>
        <div style={styles.modalHeader}>
          <span style={{ fontSize: 18 }}>📄</span>
          <h2 style={{ ...styles.modalTitle, flex: 1 }}>{link.title}</h2>
          <a href={link.url} target="_blank" rel="noreferrer" style={{ color: '#85b7eb', fontSize: 12, marginRight: 8, textDecoration: 'none' }}>
            ↗ Open in tab
          </a>
          <button style={styles.modalCloseBtn} onClick={onClose}>×</button>
        </div>
        <iframe
          style={styles.pdfIframe}
          src={`${link.url}#view=fitH`}
          title={link.title}
        />
      </div>
    </div>
  );
}

// ─── COMPANY CARD ─────────────────────────────────────────────────────────────
function CompanyCard({ company, onRefresh }) {
  const [tab, setTab] = useState('people');
  const [showAddPerson, setShowAddPerson] = useState(false);
  const [showAddLink, setShowAddLink] = useState(false);
  const [playingVideo, setPlayingVideo] = useState(null);
  const [viewingPdf, setViewingPdf] = useState(null);
  const [editingCompany, setEditingCompany] = useState(false);
  const [editingPerson, setEditingPerson] = useState(null);
  const [editingLink, setEditingLink] = useState(null);

  const deletePerson = async (personId) => {
    if (!window.confirm('Remove this person?')) return;
    await fetch(`${BASE}/snowai-companies-of-interest/delete-person/${personId}/`, { method: 'POST' });
    onRefresh();
  };

  const deleteLink = async (linkId) => {
    if (!window.confirm('Remove this link?')) return;
    await fetch(`${BASE}/snowai-companies-of-interest/delete-link/${linkId}/`, { method: 'POST' });
    onRefresh();
  };

  const deleteCompany = async () => {
    if (!window.confirm(`Delete ${company.name}? This removes all associated data.`)) return;
    await fetch(`${BASE}/snowai-companies-of-interest/${company.id}/delete/`, { method: 'POST' });
    onRefresh();
  };

  const linkCounts = {
    url:     company.links.filter(l => l.link_type === 'url').length,
    pdf:     company.links.filter(l => l.link_type === 'pdf').length,
    youtube: company.links.filter(l => l.link_type === 'youtube').length,
  };

  return (
    <>
      {showAddPerson && <AddPersonModal companyId={company.id} onClose={() => setShowAddPerson(false)} onSaved={onRefresh} />}
      {showAddLink && <AddLinkModal companyId={company.id} onClose={() => setShowAddLink(false)} onSaved={onRefresh} />}
      {playingVideo && <YouTubeModal link={playingVideo} onClose={() => setPlayingVideo(null)} />}
      {viewingPdf && <PDFModal link={viewingPdf} onClose={() => setViewingPdf(null)} />}
      {editingCompany && <EditCompanyModal company={company} onClose={() => setEditingCompany(false)} onSaved={() => { onRefresh(); setEditingCompany(false); }} />}
      {editingPerson && <EditPersonModal person={editingPerson} onClose={() => setEditingPerson(null)} onSaved={() => { onRefresh(); setEditingPerson(null); }} />}
      {editingLink && <EditLinkModal link={editingLink} onClose={() => setEditingLink(null)} onSaved={() => { onRefresh(); setEditingLink(null); }} />}

      <div style={styles.card}>
        <div style={styles.cardTopBar} />

        {/* Card header */}
        <div style={styles.cardHead}>
          <div style={styles.logoCircle}>
            {company.logo_base64
              ? <img src={company.logo_base64} alt={company.name} style={styles.logoImg} />
              : company.name.charAt(0).toUpperCase()
            }
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={styles.companyName}>{company.name}</p>
            {company.sector && <span style={styles.sectorBadge}>{company.sector}</span>}
          </div>
          <button style={styles.btnSmall} onClick={() => setEditingCompany(true)} title="Edit company">✏️</button>
          <button style={styles.btnDanger} onClick={deleteCompany} title="Delete company">✕</button>
        </div>

        {/* Description */}
        <div style={styles.cardBody}>
          {company.description && (
            <p style={styles.description}>{company.description}</p>
          )}

          {/* Stats row */}
          <div style={{ display: 'flex', gap: 8, marginBottom: 14, flexWrap: 'wrap' }}>
            {[
              { label: `${company.key_people.length} people`, icon: '👥' },
              { label: `${linkCounts.url} links`, icon: '🌐' },
              { label: `${linkCounts.pdf} PDFs`, icon: '📄' },
              { label: `${linkCounts.youtube} videos`, icon: '▶️' },
            ].map((s, i) => (
              <span key={i} style={{
                fontSize: 11, color: '#185fa5',
                background: '#e6f1fb', border: '1px solid #b5d4f4',
                borderRadius: 6, padding: '2px 8px',
                display: 'flex', alignItems: 'center', gap: 4,
              }}>
                {s.icon} {s.label}
              </span>
            ))}
          </div>

          {/* Tabs */}
          <div style={styles.tabRow}>
            {[
              { key: 'people',  label: '👥 People' },
              { key: 'links',   label: '🌐 Links' },
              { key: 'pdfs',    label: '📄 PDFs' },
              { key: 'youtube', label: '▶️ Videos' },
            ].map(t => (
              <button key={t.key} style={styles.tab(tab === t.key)} onClick={() => setTab(t.key)}>
                {t.label}
              </button>
            ))}
          </div>

          {/* People tab */}
          {tab === 'people' && (
            <>
              {company.key_people.length === 0 && (
                <p style={{ fontSize: 12, color: '#85b7eb', textAlign: 'center', padding: '12px 0' }}>No key people added yet.</p>
              )}
              {company.key_people.map(person => (
                <div key={person.id} style={styles.personCard}>
                  <div style={styles.personPhoto}>
                    {person.photo_base64
                      ? <img src={person.photo_base64} alt={person.name} style={styles.personPhotoImg} />
                      : person.name.charAt(0).toUpperCase()
                    }
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={styles.personName}>{person.name}</p>
                    {person.role && <p style={styles.personRole}>{person.role}</p>}
                    {person.bio && <p style={styles.personBio}>{person.bio}</p>}
                  </div>
                  <button style={styles.btnSmall} onClick={() => setEditingPerson(person)} title="Edit">✏️</button>
                  <button style={styles.btnDanger} onClick={() => deletePerson(person.id)}>✕</button>
                </div>
              ))}
              <div style={styles.addSection}>
                <button style={styles.btnSmall} onClick={() => setShowAddPerson(true)}>
                  <span>+</span> Add person
                </button>
              </div>
            </>
          )}

          {/* Links tab */}
          {tab === 'links' && (
            <>
              {company.links.filter(l => l.link_type === 'url').length === 0 && (
                <p style={{ fontSize: 12, color: '#85b7eb', textAlign: 'center', padding: '12px 0' }}>No web links added yet.</p>
              )}
              {company.links.filter(l => l.link_type === 'url').map(link => (
                <div key={link.id} style={styles.linkItem}>
                  <span style={styles.linkIcon}>🌐</span>
                  <span style={styles.linkTitle}>{link.title}</span>
                  <a href={link.url} target="_blank" rel="noreferrer" style={{ ...styles.btnSmall, textDecoration: 'none', fontSize: 11 }}>↗ Open</a>
                  <button style={styles.btnSmall} onClick={() => setEditingLink(link)} title="Edit">✏️</button>
                  <button style={styles.btnDanger} onClick={() => deleteLink(link.id)}>✕</button>
                </div>
              ))}
              <div style={styles.addSection}>
                <button style={styles.btnSmall} onClick={() => setShowAddLink(true)}>
                  <span>+</span> Add link
                </button>
              </div>
            </>
          )}

          {/* PDFs tab */}
          {tab === 'pdfs' && (
            <>
              {company.links.filter(l => l.link_type === 'pdf').length === 0 && (
                <p style={{ fontSize: 12, color: '#85b7eb', textAlign: 'center', padding: '12px 0' }}>No PDFs added yet.</p>
              )}
              {company.links.filter(l => l.link_type === 'pdf').map(link => (
                <div key={link.id} style={styles.linkItem}>
                  <span style={styles.linkIcon}>📄</span>
                  <span style={styles.linkTitle}>{link.title}</span>
                  <button style={{ ...styles.btnSmall, fontSize: 11 }} onClick={() => setViewingPdf(link)}>👁 View</button>
                  <a href={link.url} target="_blank" rel="noreferrer" style={{ ...styles.btnSmall, textDecoration: 'none', fontSize: 11 }}>↗</a>
                  <button style={{ ...styles.btnSmall, fontSize: 11 }} onClick={() => setEditingLink(link)} title="Edit">✏️</button>
                  <button style={styles.btnDanger} onClick={() => deleteLink(link.id)}>✕</button>
                </div>
              ))}
              <div style={styles.addSection}>
                <button style={styles.btnSmall} onClick={() => setShowAddLink(true)}>
                  <span>+</span> Add PDF
                </button>
              </div>
            </>
          )}

          {/* YouTube tab */}
          {tab === 'youtube' && (
            <>
              {company.links.filter(l => l.link_type === 'youtube').length === 0 && (
                <p style={{ fontSize: 12, color: '#85b7eb', textAlign: 'center', padding: '12px 0' }}>No videos added yet.</p>
              )}
              {company.links.filter(l => l.link_type === 'youtube').map(link => {
                const videoId = extractYouTubeId(link.url);
                return (
                  <div key={link.id} style={{ ...styles.linkItem, alignItems: 'flex-start', flexWrap: 'wrap', gap: 10 }}>
                    {videoId && (
                      <div
                        onClick={() => setPlayingVideo(link)}
                        style={{ position: 'relative', width: 100, height: 56, borderRadius: 8, overflow: 'hidden', flexShrink: 0, cursor: 'pointer' }}
                      >
                        <img
                          src={`https://img.youtube.com/vi/${videoId}/mqdefault.jpg`}
                          alt={link.title}
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                        <div style={{
                          position: 'absolute', inset: 0, display: 'flex',
                          alignItems: 'center', justifyContent: 'center',
                          background: 'rgba(0,0,0,0.35)',
                        }}>
                          <span style={{
                            background: '#ff0000', borderRadius: 5,
                            width: 28, height: 20,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: 10, color: '#fff',
                          }}>▶</span>
                        </div>
                      </div>
                    )}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ ...styles.linkTitle, whiteSpace: 'normal', fontSize: 12, fontWeight: 500, color: '#042c53', margin: '0 0 6px' }}>
                        {link.title}
                      </p>
                      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                        <button style={{ ...styles.btnSmall, fontSize: 11 }} onClick={() => setPlayingVideo(link)}>▶ Play</button>
                        <button style={{ ...styles.btnSmall, fontSize: 11 }} onClick={() => setEditingLink(link)} title="Edit">✏️</button>
                        <button style={{ ...styles.btnDanger, fontSize: 11 }} onClick={() => deleteLink(link.id)}>✕</button>
                      </div>
                    </div>
                  </div>
                );
              })}
              <div style={styles.addSection}>
                <button style={styles.btnSmall} onClick={() => setShowAddLink(true)}>
                  <span>+</span> Add video
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────
export default function CompaniesofInterest() {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddCompany, setShowAddCompany] = useState(false);
  const [search, setSearch] = useState('');
  const [sectorFilter, setSectorFilter] = useState('');

  const fetchCompanies = useCallback(async () => {
    try {
      const res = await fetch(`${BASE}/snowai-companies-of-interest/`);
      if (res.ok) setCompanies(await res.json());
    } catch (e) {
      console.error('Failed to fetch companies:', e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchCompanies(); }, [fetchCompanies]);

  const sectors = [...new Set(companies.map(c => c.sector).filter(Boolean))].sort();

  const filtered = companies.filter(c => {
    const matchSearch = !search || c.name.toLowerCase().includes(search.toLowerCase()) || c.description.toLowerCase().includes(search.toLowerCase()) || c.sector.toLowerCase().includes(search.toLowerCase());
    const matchSector = !sectorFilter || c.sector === sectorFilter;
    return matchSearch && matchSector;
  });

  return (
    <div style={styles.page}>
      {showAddCompany && (
        <AddCompanyModal
          onClose={() => setShowAddCompany(false)}
          onSaved={() => { fetchCompanies(); setShowAddCompany(false); }}
        />
      )}

      <div className="header">
        <Header />
      </div>
      <div className="main-page-body">
        <SideNavs />
        <div className="main-body-info">

          {/* Page header */}
          <div style={styles.header}>
            <h5 style={styles.pageTitle}>
              <span style={styles.pageTitleAccent} />
              SnowAI Companies of Interest
            </h5>
            <button style={styles.btnPrimary} onClick={() => setShowAddCompany(true)}>
              + Add company
            </button>
          </div>

          {/* Search + filter */}
          <div style={styles.searchBar}>
            <input
              style={styles.searchInput}
              placeholder="Search companies, sectors, descriptions..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
            {sectors.length > 0 && (
              <select
                style={{ ...styles.select, width: 'auto', minWidth: 140 }}
                value={sectorFilter}
                onChange={e => setSectorFilter(e.target.value)}
              >
                <option value="">All sectors</option>
                {sectors.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            )}
            {(search || sectorFilter) && (
              <button style={styles.btnSecondary} onClick={() => { setSearch(''); setSectorFilter(''); }}>
                Clear
              </button>
            )}
          </div>

          {/* Content */}
          {loading ? (
            <div style={styles.empty}>
              <div className="spinner-border text-primary" role="status" />
              <p style={{ marginTop: 12 }}>Loading companies...</p>
            </div>
          ) : filtered.length === 0 ? (
            <div style={styles.empty}>
              {companies.length === 0
                ? <>
                    <div style={{ fontSize: 40, marginBottom: 12 }}>🏢</div>
                    <p>No companies yet. Add your first company of interest.</p>
                    <button style={{ ...styles.btnPrimary, margin: '12px auto', display: 'inline-flex' }} onClick={() => setShowAddCompany(true)}>
                      + Add first company
                    </button>
                  </>
                : <p>No companies match your search.</p>
              }
            </div>
          ) : (
            <>
              <p style={{ fontSize: 12, color: '#85b7eb', marginBottom: 16 }}>
                Showing {filtered.length} of {companies.length} {companies.length === 1 ? 'company' : 'companies'}
              </p>
              <div style={styles.grid}>
                {filtered.map(company => (
                  <CompanyCard key={company.id} company={company} onRefresh={fetchCompanies} />
                ))}
              </div>
            </>
          )}

          <br />
        </div>
      </div>
    </div>
  );
}