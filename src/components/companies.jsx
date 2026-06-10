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
  btnRecord: {
    background: 'linear-gradient(135deg, #c0392b, #e74c3c)',
    border: 'none',
    color: '#fff',
    borderRadius: 10,
    padding: '9px 20px',
    fontSize: 13,
    fontWeight: 600,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: 8,
  },
  btnRecordStop: {
    background: 'linear-gradient(135deg, #6c3483, #8e44ad)',
    border: 'none',
    color: '#fff',
    borderRadius: 10,
    padding: '9px 20px',
    fontSize: 13,
    fontWeight: 600,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: 8,
  },
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
  tabRow: {
    display: 'flex',
    gap: 4,
    marginBottom: 14,
    borderBottom: '1px solid #e6f1fb',
    paddingBottom: 0,
    overflowX: 'auto',
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
    whiteSpace: 'nowrap',
  }),
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
  addSection: {
    marginTop: 10,
    paddingTop: 10,
    borderTop: '1px dashed #b5d4f4',
  },
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
  success: {
    background: '#e8f8f0',
    border: '1px solid #a3e4bf',
    borderRadius: 8,
    padding: '8px 12px',
    color: '#1a6b3c',
    fontSize: 13,
    marginBottom: 14,
  },
  ytModalBox: {
    background: '#000',
    borderRadius: 16,
    width: '100%',
    maxWidth: 900,
    height: '92vh',
    maxHeight: '92vh',
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
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
    flex: '1 1 auto',
    minHeight: 360,
    border: 'none',
    display: 'block',
  },
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
  empty: {
    textAlign: 'center',
    padding: '40px 20px',
    color: '#85b7eb',
    fontSize: 14,
  },
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

  // ── Recording UI ──
  recordingBox: {
    background: '#fff8f8',
    border: '1.5px solid #f7c1c1',
    borderRadius: 12,
    padding: '14px 16px',
    marginTop: 12,
  },
  recordingHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    marginBottom: 10,
  },
  recordingDot: (active) => ({
    width: 10,
    height: 10,
    borderRadius: '50%',
    background: active ? '#e74c3c' : '#ccc',
    boxShadow: active ? '0 0 0 3px rgba(231,76,60,0.25)' : 'none',
    animation: active ? 'pulse 1.2s infinite' : 'none',
    flexShrink: 0,
  }),
  recordingLabel: {
    fontSize: 12,
    fontWeight: 600,
    color: '#c0392b',
    flex: 1,
  },
  recordingTimer: {
    fontSize: 12,
    fontWeight: 600,
    color: '#7f8c8d',
    fontVariantNumeric: 'tabular-nums',
  },
  transcriptBox: {
    background: '#fff',
    border: '1px solid #e0e0e0',
    borderRadius: 8,
    padding: '10px 12px',
    fontSize: 13,
    color: '#2c3e50',
    lineHeight: 1.65,
    minHeight: 80,
    maxHeight: 200,
    overflowY: 'auto',
    fontFamily: 'inherit',
    whiteSpace: 'pre-wrap',
    wordBreak: 'break-word',
  },
  interimText: {
    color: '#999',
    fontStyle: 'italic',
  },
  langSelect: {
    border: '1px solid #b5d4f4',
    borderRadius: 8,
    padding: '6px 10px',
    fontSize: 12,
    color: '#042c53',
    background: '#e6f1fb',
    outline: 'none',
    fontFamily: 'inherit',
  },
  savedTranscriptItem: {
    background: '#f4f8fd',
    border: '1px solid #daeaf7',
    borderRadius: 10,
    padding: '10px 12px',
    marginBottom: 8,
  },

  // ── Company transcript list (inside card tab) ──
  ctrItem: {
    background: '#f4f8fd',
    border: '1px solid #daeaf7',
    borderRadius: 12,
    padding: '12px 14px',
    marginBottom: 10,
    cursor: 'pointer',
    transition: 'box-shadow 0.15s, border-color 0.15s',
  },
  ctrItemTitle: {
    fontSize: 13,
    fontWeight: 600,
    color: '#042c53',
    margin: '0 0 4px',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  ctrItemMeta: {
    fontSize: 11,
    color: '#6a8fb5',
    display: 'flex',
    flexWrap: 'wrap',
    gap: '4px 12px',
    marginBottom: 6,
  },
  ctrStatusBadge: (status) => ({
    fontSize: 10,
    fontWeight: 600,
    padding: '2px 8px',
    borderRadius: 20,
    display: 'inline-flex',
    alignItems: 'center',
    gap: 4,
    background: status === 'raw'       ? '#fff8e6' :
                status === 'reviewed'  ? '#e8f5e9' :
                status === 'processed' ? '#e8f0fe' : '#f5f5f5',
    color:      status === 'raw'       ? '#b07800' :
                status === 'reviewed'  ? '#2e7d32' :
                status === 'processed' ? '#1a56db' : '#666',
    border: `1px solid ${
                status === 'raw'       ? '#f5d090' :
                status === 'reviewed'  ? '#a5d6a7' :
                status === 'processed' ? '#93b4f8' : '#ddd'}`,
  }),

  // ── Transcript viewer modal — FIXED for scrolling ──
  viewerModalBox: {
    background: '#fff',
    borderRadius: 20,
    width: '100%',
    maxWidth: 860,
    // FIX: use height + max-height together, and let flex children manage overflow
    height: '92vh',
    maxHeight: '92vh',
    display: 'flex',
    flexDirection: 'column',
    // FIX: overflow visible at container level so children can scroll independently
    overflow: 'hidden',
    boxShadow: '0 24px 80px rgba(4,44,83,0.22)',
  },
  viewerHeader: {
    background: 'linear-gradient(135deg, #042c53 0%, #0c447c 60%, #185fa5 100%)',
    padding: '18px 22px',
    // FIX: flexShrink 0 so header never compresses
    flexShrink: 0,
  },
  viewerHeaderTop: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: 12,
    marginBottom: 10,
  },
  viewerIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    background: 'rgba(255,255,255,0.15)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 20,
    flexShrink: 0,
  },
  viewerTitle: {
    fontSize: 16,
    fontWeight: 700,
    color: '#fff',
    margin: '0 0 3px',
    lineHeight: 1.3,
  },
  viewerSubtitle: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.65)',
    margin: 0,
  },
  viewerMeta: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '6px 16px',
    marginTop: 4,
  },
  viewerMetaChip: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.75)',
    display: 'flex',
    alignItems: 'center',
    gap: 5,
  },
  // FIX: This is the key — flex:1, minHeight:0, overflowY:auto
  viewerBody: {
    flex: 1,
    minHeight: 0,          // ← CRITICAL: allows flex child to shrink below content size
    overflowY: 'auto',     // ← scrolls here, not on the modal box
    padding: '20px 24px',
    display: 'flex',
    flexDirection: 'column',
    gap: 18,
  },
  viewerSection: {
    background: '#f7fafd',
    border: '1px solid #e2edf8',
    borderRadius: 12,
    overflow: 'hidden',
    // FIX: don't let sections shrink or collapse
    flexShrink: 0,
  },
  viewerSectionHead: {
    padding: '10px 16px',
    background: '#eaf2fb',
    borderBottom: '1px solid #d5e8f7',
    fontSize: 11,
    fontWeight: 700,
    color: '#185fa5',
    textTransform: 'uppercase',
    letterSpacing: '0.6px',
    display: 'flex',
    alignItems: 'center',
    gap: 6,
  },
  viewerSectionBody: {
    padding: '14px 16px',
    fontSize: 13,
    color: '#2c3e50',
    lineHeight: 1.75,
    whiteSpace: 'pre-wrap',
    wordBreak: 'break-word',
  },
  // FIX: footer must be flexShrink:0 so it stays pinned at bottom
  viewerFooter: {
    padding: '14px 22px',
    borderTop: '1px solid #e6f1fb',
    background: '#f4f8fd',
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    flexShrink: 0,         // ← CRITICAL: footer never gets squished
    flexWrap: 'wrap',
    borderRadius: '0 0 20px 20px',
  },

  // ── Record-into-company modal ──
  recordModalBox: {
    background: '#fff',
    borderRadius: 18,
    width: '100%',
    maxWidth: 560,
    maxHeight: '90vh',
    overflowY: 'auto',
    boxShadow: '0 24px 80px rgba(4,44,83,0.2)',
  },

  // ── Global transcript search modal ──
  txSearchModalBox: {
    background: '#fff',
    borderRadius: 20,
    width: '100%',
    maxWidth: 700,
    maxHeight: '88vh',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
    boxShadow: '0 24px 80px rgba(4,44,83,0.22)',
  },
  txSearchInput: {
    width: '100%',
    border: '1.5px solid #b5d4f4',
    borderRadius: 12,
    padding: '12px 16px',
    fontSize: 15,
    color: '#042c53',
    background: '#f4f8fd',
    outline: 'none',
    fontFamily: 'inherit',
    boxSizing: 'border-box',
  },
  txSearchResult: {
    padding: '12px 16px',
    borderBottom: '1px solid #e6f1fb',
    cursor: 'pointer',
    transition: 'background 0.12s',
  },

  // ── AI summary panel (inside viewer) ──
  aiPanel: {
    background: 'linear-gradient(135deg, #f0f4ff 0%, #fafbff 100%)',
    border: '1.5px solid #c5d8f8',
    borderRadius: 14,
    overflow: 'hidden',
    flexShrink: 0,
  },
  aiPanelHead: {
    padding: '12px 16px',
    background: 'linear-gradient(135deg, #1a56db, #185fa5)',
    display: 'flex',
    alignItems: 'center',
    gap: 10,
  },
  aiPanelBody: {
    padding: '14px 16px',
  },
  promptBox: {
    background: '#1e1e2e',
    borderRadius: 10,
    padding: '14px 16px',
    fontSize: 12,
    color: '#cdd6f4',
    lineHeight: 1.7,
    fontFamily: "'Fira Code', 'Consolas', monospace",
    whiteSpace: 'pre-wrap',
    wordBreak: 'break-word',
    maxHeight: 160,
    overflowY: 'auto',
    overflowX: 'hidden',
  },
  pasteArea: {
    width: '100%',
    border: '1.5px dashed #b5d4f4',
    borderRadius: 10,
    padding: '10px 12px',
    fontSize: 13,
    color: '#042c53',
    background: '#f4f8fd',
    outline: 'none',
    fontFamily: 'inherit',
    resize: 'vertical',
    boxSizing: 'border-box',
    minHeight: 100,
  },
};

// Pulse animation + global mobile overrides injected once
const pulseStyle = `
  @keyframes pulse {
    0%   { box-shadow: 0 0 0 0 rgba(231,76,60,0.4); }
    70%  { box-shadow: 0 0 0 6px rgba(231,76,60,0); }
    100% { box-shadow: 0 0 0 0 rgba(231,76,60,0); }
  }
`;

// Global styles tag — injected once at app level via a component
function GlobalStyles() {
  return (
    <style>{`
      ${pulseStyle}

      /* ── Mobile modal overrides ── */
      @media (max-width: 640px) {
        .snowai-modal-overlay {
          padding: 0 !important;
          align-items: flex-end !important;
        }
        .snowai-viewer-modal {
          max-width: 100% !important;
          width: 100% !important;
          height: 100dvh !important;
          max-height: 100dvh !important;
          border-radius: 0 !important;
        }
        .snowai-pdf-modal {
          max-width: 100% !important;
          width: 100% !important;
          max-height: 100dvh !important;
          border-radius: 0 !important;
        }
        .snowai-search-modal {
          max-width: 100% !important;
          width: 100% !important;
          max-height: 100dvh !important;
          border-radius: 0 !important;
        }
        .snowai-yt-modal {
          max-width: 100% !important;
          width: 100% !important;
          height: 100dvh !important;
          max-height: 100dvh !important;
          border-radius: 0 !important;
        }
        .snowai-viewer-header {
          padding: 12px 14px !important;
        }
        .snowai-viewer-body {
          padding: 14px !important;
        }
        .snowai-viewer-footer {
          padding: 10px 14px !important;
          gap: 6px !important;
        }
        .snowai-viewer-title {
          font-size: 14px !important;
        }
        .snowai-viewer-meta-chip {
          font-size: 10px !important;
        }
        .snowai-card-grid {
          grid-template-columns: 1fr !important;
        }
        .snowai-page-header {
          flex-direction: column !important;
          align-items: flex-start !important;
        }
        .snowai-tab-row {
          gap: 2px !important;
        }
        .snowai-tab-btn {
          padding: 5px 8px !important;
          font-size: 11px !important;
        }
      }
    `}</style>
  );
}

// ─── SUPPORTED LANGUAGES ──────────────────────────────────────────────────────
const SUPPORTED_LANGUAGES = [
  { code: 'af-ZA', label: 'Afrikaans (South Africa)' },
  { code: 'sq-AL', label: 'Albanian' },
  { code: 'am-ET', label: 'Amharic' },
  { code: 'ar-SA', label: 'Arabic (Saudi Arabia)' },
  { code: 'ar-EG', label: 'Arabic (Egypt)' },
  { code: 'hy-AM', label: 'Armenian' },
  { code: 'az-AZ', label: 'Azerbaijani' },
  { code: 'eu-ES', label: 'Basque' },
  { code: 'bn-BD', label: 'Bengali (Bangladesh)' },
  { code: 'bn-IN', label: 'Bengali (India)' },
  { code: 'bs-BA', label: 'Bosnian' },
  { code: 'bg-BG', label: 'Bulgarian' },
  { code: 'my-MM', label: 'Burmese' },
  { code: 'ca-ES', label: 'Catalan' },
  { code: 'zh-CN', label: 'Chinese (Mandarin, Simplified)' },
  { code: 'zh-TW', label: 'Chinese (Traditional)' },
  { code: 'zh-HK', label: 'Chinese (Cantonese)' },
  { code: 'hr-HR', label: 'Croatian' },
  { code: 'cs-CZ', label: 'Czech' },
  { code: 'da-DK', label: 'Danish' },
  { code: 'nl-NL', label: 'Dutch (Netherlands)' },
  { code: 'nl-BE', label: 'Dutch (Belgium)' },
  { code: 'en-US', label: 'English (US)' },
  { code: 'en-GB', label: 'English (UK)' },
  { code: 'en-AU', label: 'English (Australia)' },
  { code: 'en-ZA', label: 'English (South Africa)' },
  { code: 'et-EE', label: 'Estonian' },
  { code: 'fil-PH', label: 'Filipino' },
  { code: 'fi-FI', label: 'Finnish' },
  { code: 'fr-FR', label: 'French (France)' },
  { code: 'fr-CA', label: 'French (Canada)' },
  { code: 'gl-ES', label: 'Galician' },
  { code: 'ka-GE', label: 'Georgian' },
  { code: 'de-DE', label: 'German' },
  { code: 'el-GR', label: 'Greek' },
  { code: 'gu-IN', label: 'Gujarati' },
  { code: 'iw-IL', label: 'Hebrew' },
  { code: 'hi-IN', label: 'Hindi' },
  { code: 'hu-HU', label: 'Hungarian' },
  { code: 'is-IS', label: 'Icelandic' },
  { code: 'id-ID', label: 'Indonesian' },
  { code: 'it-IT', label: 'Italian' },
  { code: 'ja-JP', label: 'Japanese' },
  { code: 'jv-ID', label: 'Javanese' },
  { code: 'kn-IN', label: 'Kannada' },
  { code: 'km-KH', label: 'Khmer' },
  { code: 'ko-KR', label: 'Korean' },
  { code: 'lo-LA', label: 'Lao' },
  { code: 'lv-LV', label: 'Latvian' },
  { code: 'lt-LT', label: 'Lithuanian' },
  { code: 'mk-MK', label: 'Macedonian' },
  { code: 'ms-MY', label: 'Malay' },
  { code: 'ml-IN', label: 'Malayalam' },
  { code: 'mr-IN', label: 'Marathi' },
  { code: 'mn-MN', label: 'Mongolian' },
  { code: 'ne-NP', label: 'Nepali' },
  { code: 'nb-NO', label: 'Norwegian Bokmål' },
  { code: 'fa-IR', label: 'Persian' },
  { code: 'pl-PL', label: 'Polish' },
  { code: 'pt-BR', label: 'Portuguese (Brazil)' },
  { code: 'pt-PT', label: 'Portuguese (Portugal)' },
  { code: 'pa-Guru-IN', label: 'Punjabi' },
  { code: 'ro-RO', label: 'Romanian' },
  { code: 'ru-RU', label: 'Russian' },
  { code: 'sr-RS', label: 'Serbian' },
  { code: 'si-LK', label: 'Sinhala' },
  { code: 'sk-SK', label: 'Slovak' },
  { code: 'sl-SI', label: 'Slovenian' },
  { code: 'es-ES', label: 'Spanish (Spain)' },
  { code: 'es-MX', label: 'Spanish (Mexico)' },
  { code: 'es-US', label: 'Spanish (US)' },
  { code: 'su-ID', label: 'Sundanese' },
  { code: 'sw-TZ', label: 'Swahili' },
  { code: 'sv-SE', label: 'Swedish' },
  { code: 'ta-IN', label: 'Tamil (India)' },
  { code: 'ta-SG', label: 'Tamil (Singapore)' },
  { code: 'te-IN', label: 'Telugu' },
  { code: 'th-TH', label: 'Thai' },
  { code: 'tr-TR', label: 'Turkish' },
  { code: 'uk-UA', label: 'Ukrainian' },
  { code: 'ur-PK', label: 'Urdu (Pakistan)' },
  { code: 'uz-UZ', label: 'Uzbek' },
  { code: 'vi-VN', label: 'Vietnamese' },
  { code: 'zu-ZA', label: 'Zulu' },
];

// ─── HELPERS ──────────────────────────────────────────────────────────────────
function extractYouTubeId(url) {
  const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/shorts\/|youtube\.com\/live\/)([A-Za-z0-9_-]{11})/);
  return match ? match[1] : null;
}

function readFileAsBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function formatDuration(seconds) {
  const m = Math.floor(seconds / 60).toString().padStart(2, '0');
  const s = (seconds % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
}

// ─── RECORDING HOOK ───────────────────────────────────────────────────────────
function useTranscriptionRecorder({ language, onTranscriptUpdate }) {
  const recognitionRef = useRef(null);
  const [isRecording, setIsRecording] = useState(false);
  const [finalTranscript, setFinalTranscript] = useState('');
  const [interimTranscript, setInterimTranscript] = useState('');
  const [elapsed, setElapsed] = useState(0);
  const [error, setError] = useState('');
  const timerRef = useRef(null);
  const finalRef = useRef('');

  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  const isSupported = !!SpeechRecognition;

  const start = useCallback(() => {
    if (!isSupported) { setError('Speech recognition not supported in this browser. Use Chrome or Edge.'); return; }
    setError('');
    setFinalTranscript('');
    setInterimTranscript('');
    setElapsed(0);
    finalRef.current = '';

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = language;
    recognition.maxAlternatives = 1;

    recognition.onresult = (event) => {
      let interim = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const text = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalRef.current += text + ' ';
        } else {
          interim += text;
        }
      }
      setFinalTranscript(finalRef.current);
      setInterimTranscript(interim);
      onTranscriptUpdate && onTranscriptUpdate(finalRef.current + interim);
    };

    recognition.onerror = (e) => {
      if (e.error === 'no-speech') return;
      setError(`Recognition error: ${e.error}`);
      stopRecording();
    };

    recognition.onend = () => {
      if (isRecording || recognitionRef.current?._shouldRestart) {
        try { recognition.start(); } catch {}
      }
    };

    recognitionRef.current = recognition;
    recognitionRef.current._shouldRestart = true;
    recognition.start();
    setIsRecording(true);

    timerRef.current = setInterval(() => setElapsed(p => p + 1), 1000);
  }, [language, isSupported, onTranscriptUpdate]);

  const stop = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current._shouldRestart = false;
      recognitionRef.current.stop();
      recognitionRef.current = null;
    }
    setIsRecording(false);
    setInterimTranscript('');
    clearInterval(timerRef.current);
  }, []);

  const reset = useCallback(() => {
    stop();
    setFinalTranscript('');
    setInterimTranscript('');
    setElapsed(0);
    finalRef.current = '';
  }, [stop]);

  useEffect(() => () => { stop(); }, [stop]);

  return {
    isSupported, isRecording, finalTranscript, interimTranscript, elapsed, error,
    start, stop, reset,
    fullText: finalTranscript + interimTranscript,
  };
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
    f('logo_base64', await readFileAsBase64(file));
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
            <textarea style={styles.textarea} rows={3} value={form.description} onChange={e => f('description', e.target.value)} />
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label}>Logo <span style={{ color: '#85b7eb', textTransform: 'none' }}>(image)</span></label>
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
    f('photo_base64', await readFileAsBase64(file));
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
            <textarea style={styles.textarea} rows={3} value={form.bio} onChange={e => f('bio', e.target.value)} />
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label}>Profile photo</label>
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

// ─── ADD LINK MODAL (with auto-title + recording) ─────────────────────────────
function AddLinkModal({ companyId, onClose, onSaved }) {
  const [form, setForm] = useState({ link_type: 'url', title: '', url: '' });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [fetchingTitle, setFetchingTitle] = useState(false);
  const [recordingLanguage, setRecordingLanguage] = useState('en-US');
  const [savedTranscript, setSavedTranscript] = useState(null);
  const [savingTranscript, setSavingTranscript] = useState(false);
  const f = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const {
    isSupported, isRecording, finalTranscript, interimTranscript, elapsed, error: recError,
    start: startRec, stop: stopRec, reset: resetRec, fullText,
  } = useTranscriptionRecorder({ language: recordingLanguage });

  const handleUrlChange = async (url) => {
    f('url', url);
    if (form.link_type !== 'youtube') return;
    const videoId = extractYouTubeId(url);
    if (!videoId || form.title) return;
    setFetchingTitle(true);
    try {
      const res = await fetch(`${BASE}/snowai-vtr/youtube-metadata/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.title) f('title', data.title);
      }
    } catch { }
    finally { setFetchingTitle(false); }
  };

  const handleTypeChange = async (type) => {
    f('link_type', type);
    if (type === 'youtube' && form.url && !form.title) {
      const videoId = extractYouTubeId(form.url);
      if (videoId) {
        setFetchingTitle(true);
        try {
          const res = await fetch(`${BASE}/snowai-vtr/youtube-metadata/`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ url: form.url }),
          });
          if (res.ok) {
            const data = await res.json();
            if (data.title) f('title', data.title);
          }
        } catch {}
        finally { setFetchingTitle(false); }
      }
    }
  };

  const handleSaveTranscript = async () => {
    const text = finalTranscript.trim();
    if (!text) return;
    setSavingTranscript(true);
    try {
      const videoId = extractYouTubeId(form.url);
      const payload = {
        full_transcript_text: text,
        youtube_url:          form.url || null,
        youtube_video_id:     videoId || null,
        video_title:          form.title || null,
        transcript_language:  recordingLanguage,
        transcription_method: 'browser_speech_api',
        video_duration_seconds: elapsed,
        processing_status:    'completed',
      };
      const res = await fetch(`${BASE}/snowai-vtr/transcripts/save/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        const data = await res.json();
        setSavedTranscript(data.transcript);
        resetRec();
      }
    } catch {}
    finally { setSavingTranscript(false); }
  };

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

  const isYoutube = form.link_type === 'youtube';

  return (
    <div style={styles.modalOverlay}>
      <div style={{ ...styles.modalBox, maxWidth: isYoutube ? 600 : 520 }}>
        <div style={styles.modalHeader}>
          <span style={{ fontSize: 20 }}>🔗</span>
          <h2 style={styles.modalTitle}>Add link / resource</h2>
          <button style={styles.modalCloseBtn} onClick={onClose}>×</button>
        </div>
        <div style={styles.modalBody}>
          {error && <div style={styles.error}>{error}</div>}
          {savedTranscript && (
            <div style={styles.success}>
              ✅ Transcript saved ({savedTranscript.word_count} words, {savedTranscript.transcript_language})
            </div>
          )}
          <div style={styles.formGroup}>
            <label style={styles.label}>Type</label>
            <select style={styles.select} value={form.link_type} onChange={e => handleTypeChange(e.target.value)}>
              <option value="url">🌐 Web link</option>
              <option value="pdf">📄 PDF document</option>
              <option value="youtube">▶️ YouTube video</option>
            </select>
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label}>URL</label>
            <input
              style={styles.input}
              placeholder={placeholders[form.link_type]}
              value={form.url}
              onChange={e => handleUrlChange(e.target.value)}
            />
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label}>
              Title
              {fetchingTitle && <span style={{ color: '#85b7eb', textTransform: 'none', fontWeight: 400, marginLeft: 6 }}>⏳ detecting…</span>}
            </label>
            <input
              style={styles.input}
              placeholder={isYoutube ? 'Auto-detected from YouTube URL' : 'e.g. Annual Report 2024'}
              value={form.title}
              onChange={e => f('title', e.target.value)}
            />
          </div>

          {isYoutube && (
            <div style={styles.recordingBox}>
              <div style={styles.recordingHeader}>
                <div style={styles.recordingDot(isRecording)} />
                <span style={styles.recordingLabel}>
                  {isRecording ? '● Recording transcript…' : 'Live transcript recording'}
                </span>
                {isRecording && (
                  <span style={styles.recordingTimer}>{formatDuration(elapsed)}</span>
                )}
                <select
                  style={styles.langSelect}
                  value={recordingLanguage}
                  onChange={e => setRecordingLanguage(e.target.value)}
                  disabled={isRecording}
                >
                  {SUPPORTED_LANGUAGES.map(l => (
                    <option key={l.code} value={l.code}>{l.label}</option>
                  ))}
                </select>
              </div>

              {recError && <div style={{ ...styles.error, marginBottom: 8 }}>{recError}</div>}

              {!isSupported && (
                <div style={{ ...styles.error, marginBottom: 8 }}>
                  ⚠️ Speech recognition not supported. Use Chrome or Edge.
                </div>
              )}

              {(finalTranscript || interimTranscript) && (
                <div style={styles.transcriptBox}>
                  <span>{finalTranscript}</span>
                  {interimTranscript && <span style={styles.interimText}>{interimTranscript}</span>}
                </div>
              )}

              {!finalTranscript && !isRecording && (
                <p style={{ fontSize: 12, color: '#aaa', margin: '0 0 10px', textAlign: 'center' }}>
                  Press record while the video plays to capture a transcript.
                </p>
              )}

              <div style={{ display: 'flex', gap: 8, marginTop: 10, flexWrap: 'wrap' }}>
                {!isRecording ? (
                  <button style={styles.btnRecord} onClick={startRec} disabled={!isSupported}>
                    🎙 Start Recording
                  </button>
                ) : (
                  <button style={styles.btnRecordStop} onClick={stopRec}>
                    ⏹ Stop
                  </button>
                )}
                {finalTranscript && !isRecording && (
                  <button
                    style={{ ...styles.btnPrimary, fontSize: 12 }}
                    onClick={handleSaveTranscript}
                    disabled={savingTranscript}
                  >
                    {savingTranscript ? 'Saving…' : '💾 Save transcript'}
                  </button>
                )}
                {(finalTranscript || interimTranscript) && (
                  <button style={{ ...styles.btnSecondary, fontSize: 12 }} onClick={resetRec}>
                    Clear
                  </button>
                )}
              </div>
            </div>
          )}
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
    name: company.name, description: company.description,
    sector: company.sector, logo_base64: company.logo_base64,
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const f = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const handleSave = async () => {
    if (!form.name.trim()) { setError('Company name is required'); return; }
    setSaving(true); setError('');
    try {
      const res = await fetch(`${BASE}/snowai-companies-of-interest/${company.id}/update/`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form),
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
          <div style={styles.formGroup}><label style={styles.label}>Company name *</label>
            <input style={styles.input} value={form.name} onChange={e => f('name', e.target.value)} /></div>
          <div style={styles.formGroup}><label style={styles.label}>Sector</label>
            <input style={styles.input} value={form.sector} onChange={e => f('sector', e.target.value)} /></div>
          <div style={styles.formGroup}><label style={styles.label}>Description</label>
            <textarea style={styles.textarea} rows={3} value={form.description} onChange={e => f('description', e.target.value)} /></div>
          <div style={styles.formGroup}>
            <label style={styles.label}>Logo</label>
            <input type="file" accept="image/*" onChange={async e => { const f2 = e.target.files[0]; if (f2) f('logo_base64', await readFileAsBase64(f2)); }} style={{ fontSize: 13, color: '#185fa5' }} />
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
  const [form, setForm] = useState({ name: person.name, role: person.role, bio: person.bio, photo_base64: person.photo_base64 });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const f = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const handleSave = async () => {
    if (!form.name.trim()) { setError('Name is required'); return; }
    setSaving(true); setError('');
    try {
      const res = await fetch(`${BASE}/snowai-companies-of-interest/update-person/${person.id}/`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form),
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
          <div style={styles.formGroup}><label style={styles.label}>Full name *</label><input style={styles.input} value={form.name} onChange={e => f('name', e.target.value)} /></div>
          <div style={styles.formGroup}><label style={styles.label}>Role / title</label><input style={styles.input} value={form.role} onChange={e => f('role', e.target.value)} /></div>
          <div style={styles.formGroup}><label style={styles.label}>Bio / notes</label><textarea style={styles.textarea} rows={3} value={form.bio} onChange={e => f('bio', e.target.value)} /></div>
          <div style={styles.formGroup}>
            <label style={styles.label}>Profile photo</label>
            <input type="file" accept="image/*" onChange={async e => { const fl = e.target.files[0]; if (fl) f('photo_base64', await readFileAsBase64(fl)); }} style={{ fontSize: 13, color: '#185fa5' }} />
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
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form),
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
          <h2 style={styles.modalTitle}>Edit link</h2>
          <button style={styles.modalCloseBtn} onClick={onClose}>×</button>
        </div>
        <div style={styles.modalBody}>
          {error && <div style={styles.error}>{error}</div>}
          <div style={styles.formGroup}><label style={styles.label}>Title</label><input style={styles.input} value={form.title} onChange={e => f('title', e.target.value)} /></div>
          <div style={styles.formGroup}><label style={styles.label}>URL</label><input style={styles.input} value={form.url} onChange={e => f('url', e.target.value)} /></div>
        </div>
        <div style={styles.modalFooter}>
          <button style={styles.btnSecondary} onClick={onClose}>Cancel</button>
          <button style={styles.btnPrimary} onClick={handleSave} disabled={saving}>{saving ? 'Saving...' : '💾 Save changes'}</button>
        </div>
      </div>
    </div>
  );
}

// ─── YOUTUBE PLAYER MODAL (with recording panel) ──────────────────────────────
function YouTubeModal({ link, company, onClose }) {
  const videoId = extractYouTubeId(link.url);
  const [recordingLanguage, setRecordingLanguage] = useState('en-US');
  const [savedTranscript, setSavedTranscript] = useState(null);
  const [savingTranscript, setSavingTranscript] = useState(false);

  const {
    isSupported, isRecording, finalTranscript, interimTranscript, elapsed, error: recError,
    start: startRec, stop: stopRec, reset: resetRec,
  } = useTranscriptionRecorder({ language: recordingLanguage });

  const handleSaveTranscript = async () => {
    const text = finalTranscript.trim();
    if (!text) return;
    setSavingTranscript(true);
    try {
      const payload = {
        company_name:              company.name,
        source_title:              link.title,
        source_url:                link.url,
        youtube_video_id:          videoId,
        source_type:               'youtube',
        full_transcript_text:      text,
        transcript_language:       recordingLanguage,
        transcription_method:      'browser_speech_api',
        recording_duration_seconds: elapsed,
        status:                    'raw',
      };
      const res = await fetch(`${BASE}/snowai-ctr/company/${company.id}/transcripts/save/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        const data = await res.json();
        setSavedTranscript(data.transcript);
        resetRec();
      }
    } catch {}
    finally { setSavingTranscript(false); }
  };

  return (
    <div style={styles.modalOverlay} onClick={onClose}>
      <div className="snowai-yt-modal" style={{ ...styles.ytModalBox }} onClick={e => e.stopPropagation()}>
        <div style={styles.ytModalHeader}>
          <div style={styles.ytLogo}><span>▶</span><span>SnowAI YouTube</span></div>
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
            Could not extract YouTube video ID.
          </div>
        )}

        <div style={{ background: '#111', padding: '12px 16px', borderTop: '1px solid #222', flexShrink: 0 }}>
          {savedTranscript && (
            <div style={{ background: '#1a3a1a', border: '1px solid #2d6a2d', borderRadius: 8, padding: '8px 12px', color: '#6fcf97', fontSize: 12, marginBottom: 10 }}>
              ✅ Saved to <strong>{company.name}</strong> — {savedTranscript.word_count} words ({savedTranscript.transcript_language})
            </div>
          )}

          {recError && (
            <div style={{ background: '#3a1a1a', border: '1px solid #c0392b', borderRadius: 8, padding: '8px 12px', color: '#f1948a', fontSize: 12, marginBottom: 10 }}>
              {recError}
            </div>
          )}

          {(finalTranscript || interimTranscript) && (
            <div style={{ ...styles.transcriptBox, background: '#1a1a1a', border: '1px solid #333', color: '#e0e0e0', marginBottom: 8, maxHeight: 80, minHeight: 'unset' }}>
              <span>{finalTranscript}</span>
              {interimTranscript && <span style={{ color: '#888', fontStyle: 'italic' }}>{interimTranscript}</span>}
            </div>
          )}

          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
            <select
              style={{ ...styles.langSelect, background: '#222', color: '#ccc', border: '1px solid #444', fontSize: 12 }}
              value={recordingLanguage}
              onChange={e => setRecordingLanguage(e.target.value)}
              disabled={isRecording}
            >
              {SUPPORTED_LANGUAGES.map(l => (
                <option key={l.code} value={l.code}>{l.label}</option>
              ))}
            </select>

            {!isRecording ? (
              <button style={{ ...styles.btnRecord, fontSize: 12, padding: '7px 14px' }} onClick={startRec} disabled={!isSupported}>
                🎙 Record
              </button>
            ) : (
              <button style={{ ...styles.btnRecordStop, fontSize: 12, padding: '7px 14px' }} onClick={stopRec}>
                ⏹ Stop <span style={{ fontVariantNumeric: 'tabular-nums', opacity: 0.8 }}>({formatDuration(elapsed)})</span>
              </button>
            )}

            {finalTranscript && !isRecording && (
              <button style={{ ...styles.btnPrimary, fontSize: 12, padding: '7px 14px' }} onClick={handleSaveTranscript} disabled={savingTranscript}>
                {savingTranscript ? 'Saving…' : '💾 Save transcript'}
              </button>
            )}

            {(finalTranscript || interimTranscript) && (
              <button style={{ background: '#333', border: '1px solid #555', color: '#aaa', borderRadius: 7, padding: '7px 12px', fontSize: 12, cursor: 'pointer' }} onClick={resetRec}>
                Clear
              </button>
            )}

            {isRecording && <span style={{ color: '#e74c3c', fontSize: 11, marginLeft: 4 }}>● LIVE</span>}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── PDF VIEWER MODAL (with AI analysis) ──────────────────────────────────────
function PDFModal({ link, company, onClose }) {
  const [showAI, setShowAI]             = useState(false);
  const [promptCopied, setPromptCopied] = useState(false);
  const [pastedResponse, setPastedResponse] = useState('');
  const [parsing, setParsing]           = useState(false);
  const [parseError, setParseError]     = useState('');
  const [applying, setApplying]         = useState(false);
  const [applied, setApplied]           = useState(false);
  const [parsedData, setParsedData]     = useState(null);
  const [pdfAnalysis, setPdfAnalysis]   = useState(link.ai_analysis || null);  // cached on link obj

  const hasAnalysis = !!(pdfAnalysis?.summary || pdfAnalysis?.key_points?.length);

  // Build a prompt tailored for PDF documents
  const buildPdfPrompt = () => {
    const meta = [
      company?.name  && `Company: ${company.name}`,
      link.title     && `Document: ${link.title}`,
      link.url       && `URL: ${link.url}`,
    ].filter(Boolean).join('\n');

    return `You are a financial/business research analyst. The user has saved a PDF document for research. Analyse the document at the link below and respond with ONLY a valid JSON object — no markdown, no explanation, just the raw JSON.

CONTEXT
${meta}

Note: If you cannot access the PDF directly, the user will paste relevant excerpts or describe its content for you to analyse.

RESPOND WITH THIS EXACT JSON STRUCTURE:
{
  "summary": "2-4 sentence executive summary of the document",
  "key_points": [
    "First key finding or claim",
    "Second key finding",
    "Third key finding"
  ],
  "topics": ["topic_one", "topic_two", "topic_three"],
  "sentiment_score": 0.0,
  "analyst_notes": "Any notable context, red flags, or follow-up questions worth investigating"
}

Rules:
- sentiment_score must be a float between -1.0 (very negative) and 1.0 (very positive)
- topics should be short snake_case strings like "monetary_policy", "revenue_growth", "annual_report"
- key_points should be 3-6 items, each a single clear sentence
- Return ONLY the JSON object, nothing else`;
  };

  const handleCopyPrompt = async () => {
    await navigator.clipboard.writeText(buildPdfPrompt());
    setPromptCopied(true);
    setTimeout(() => setPromptCopied(false), 2500);
  };

  const handleParseResponse = () => {
    setParseError(''); setParsedData(null); setParsing(true);
    try {
      let raw = pastedResponse.trim();
      raw = raw.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '').trim();
      const data = JSON.parse(raw);
      if (!data.summary && !data.key_points) throw new Error('Missing summary or key_points');
      setParsedData(data);
    } catch (e) {
      setParseError(`Couldn't parse: ${e.message}. Make sure you copied the full JSON.`);
    } finally { setParsing(false); }
  };

  const handleApply = async () => {
    if (!parsedData || !company) return;
    setApplying(true);
    try {
      const payload = {
        link_id:         link.id,
        summary:         parsedData.summary        || '',
        key_points:      parsedData.key_points      || [],
        topics:          parsedData.topics          || [],
        sentiment_score: parsedData.sentiment_score ?? null,
        analyst_notes:   parsedData.analyst_notes   || '',
      };
      const res = await fetch(
        `${BASE}/snowai-companies-of-interest/${company.id}/links/${link.id}/apply-ai/`,
        { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) }
      );
      if (res.ok) {
        const data = await res.json();
        setPdfAnalysis(data.analysis);
        // Patch the link object so the next open shows it
        link.ai_analysis = data.analysis;
        setApplied(true);
        setPastedResponse('');
        setParsedData(null);
        setShowAI(false);
      }
    } catch {}
    finally { setApplying(false); }
  };

  return (
    <div className="snowai-modal-overlay" style={styles.modalOverlay} onClick={onClose}>
      <div
        className="snowai-pdf-modal"
        style={{
          ...styles.pdfModalBox,
          display: 'flex',
          flexDirection: 'column',
          height: '92vh',
          maxHeight: '92vh',
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{ ...styles.modalHeader, flexShrink: 0 }}>
          <span style={{ fontSize: 18 }}>📄</span>
          <h2 style={{ ...styles.modalTitle, flex: 1 }}>{link.title}</h2>
          <a href={link.url} target="_blank" rel="noreferrer"
             style={{ color: '#85b7eb', fontSize: 12, marginRight: 8, textDecoration: 'none', whiteSpace: 'nowrap' }}>
            ↗ Open
          </a>
          <button style={styles.modalCloseBtn} onClick={onClose}>×</button>
        </div>

        {/* PDF iframe — flex fill */}
        <iframe
          style={{ flex: 1, border: 'none', width: '100%', minHeight: 0 }}
          src={`${link.url}#view=fitH`}
          title={link.title}
        />

        {/* AI Analysis panel — pinned at bottom, collapsible */}
        <div style={{
          background: 'linear-gradient(135deg, #f0f4ff 0%, #fafbff 100%)',
          border: '1.5px solid #c5d8f8',
          borderTop: 'none',
          flexShrink: 0,
          maxHeight: showAI ? 440 : 52,
          overflowY: showAI ? 'auto' : 'hidden',
          transition: 'max-height 0.3s ease',
        }}>
          {/* Panel header */}
          <div style={{ ...styles.aiPanelHead, position: 'sticky', top: 0 }}>
            <span style={{ fontSize: 18, flexShrink: 0 }}>🤖</span>
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ margin: 0, fontSize: 13, fontWeight: 700, color: '#fff' }}>AI Analysis</p>
            </div>
            {applied && (
              <span style={{ fontSize: 11, color: '#6fcf97', marginRight: 8 }}>✅ Saved</span>
            )}
            <button
              style={{ ...styles.btnSmall, background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.3)', color: '#fff', fontSize: 12, flexShrink: 0 }}
              onClick={() => { setShowAI(p => !p); setParseError(''); setParsedData(null); }}
            >
              {showAI ? '▲ Collapse' : (hasAnalysis ? '✏️ Regenerate' : '✨ Analyse')}
            </button>
          </div>

          {/* Saved analysis preview when collapsed */}
          {!showAI && hasAnalysis && (
            <div style={{ padding: '10px 16px', display: 'flex', flexDirection: 'column', gap: 6 }}>
              {pdfAnalysis.summary && (
                <p style={{ margin: 0, fontSize: 12, color: '#2c3e50', lineHeight: 1.6 }}>
                  {pdfAnalysis.summary}
                </p>
              )}
              {pdfAnalysis.topics?.length > 0 && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                  {pdfAnalysis.topics.map(t => (
                    <span key={t} style={{ fontSize: 10, padding: '2px 8px', borderRadius: 20,
                                          background: '#e8f0fe', color: '#1a56db', border: '1px solid #93b4f8' }}>
                      {t}
                    </span>
                  ))}
                </div>
              )}
            </div>
          )}

          {showAI && (
            <div style={styles.aiPanelBody}>
              {/* Step 1 */}
              <div style={{ marginBottom: 14 }}>
                <p style={{ fontSize: 12, fontWeight: 600, color: '#185fa5', margin: '0 0 8px', display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ background: '#185fa5', color: '#fff', borderRadius: '50%', width: 18, height: 18, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 700 }}>1</span>
                  Copy this prompt → paste into ChatGPT, Claude, Gemini, etc.
                </p>
                <div style={styles.promptBox}><span style={{ userSelect: 'all' }}>{buildPdfPrompt()}</span></div>
                <button style={{ ...styles.btnPrimary, marginTop: 8, fontSize: 12 }} onClick={handleCopyPrompt}>
                  {promptCopied ? '✅ Copied!' : '📋 Copy prompt'}
                </button>
              </div>

              {/* Step 2 */}
              <div style={{ marginBottom: 12 }}>
                <p style={{ fontSize: 12, fontWeight: 600, color: '#185fa5', margin: '0 0 8px', display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ background: '#185fa5', color: '#fff', borderRadius: '50%', width: 18, height: 18, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 700 }}>2</span>
                  Paste the AI's JSON response here
                </p>
                <textarea
                  style={styles.pasteArea}
                  placeholder={'Paste the AI response here...\n\n{"summary": "...", "key_points": [...], ...}'}
                  value={pastedResponse}
                  onChange={e => { setPastedResponse(e.target.value); setParseError(''); setParsedData(null); }}
                />
                {parseError && <div style={{ ...styles.error, marginTop: 6, fontSize: 12 }}>{parseError}</div>}
                <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                  <button style={{ ...styles.btnSecondary, fontSize: 12 }} onClick={handleParseResponse} disabled={!pastedResponse.trim() || parsing}>
                    {parsing ? 'Parsing…' : '🔍 Parse response'}
                  </button>
                  {parsedData && (
                    <button style={{ ...styles.btnPrimary, fontSize: 12 }} onClick={handleApply} disabled={applying}>
                      {applying ? 'Saving…' : '💾 Save analysis'}
                    </button>
                  )}
                </div>
              </div>

              {parsedData && (
                <div style={{ background: '#e8f5e9', border: '1px solid #a5d6a7', borderRadius: 10, padding: '12px 14px', fontSize: 12, color: '#1b5e20' }}>
                  <p style={{ margin: '0 0 6px', fontWeight: 700 }}>✅ Parsed — preview:</p>
                  {parsedData.summary && <p style={{ margin: '0 0 4px' }}><strong>Summary:</strong> {parsedData.summary.slice(0, 120)}{parsedData.summary.length > 120 ? '…' : ''}</p>}
                  {parsedData.key_points?.length > 0 && <p style={{ margin: '0 0 4px' }}><strong>Key points:</strong> {parsedData.key_points.length} items</p>}
                  {parsedData.topics?.length > 0 && <p style={{ margin: 0 }}><strong>Topics:</strong> {parsedData.topics.join(', ')}</p>}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── HELPERS ─────────────────────────────────────────────────────────────────
function formatDurationHMS(secs) {
  if (!secs) return null;
  const h = Math.floor(secs / 3600), m = Math.floor((secs % 3600) / 60), s = secs % 60;
  return h > 0
    ? `${h}h ${m}m ${s}s`
    : m > 0 ? `${m}m ${s}s` : `${s}s`;
}
function fmtDate(iso) {
  if (!iso) return null;
  return new Date(iso).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' });
}
const SOURCE_ICONS = { youtube: '▶️', meeting: '🎙', earnings_call: '📊', conference: '🏛', interview: '🎤', other: '📝' };
const STATUS_LABELS = { raw: '⏳ Raw', reviewed: '✅ Reviewed', processed: '🔬 Processed', archived: '📦 Archived' };

// ─── TRANSCRIPT VIEWER MODAL ──────────────────────────────────────────────────
function TranscriptViewerModal({ transcript: initialT, onClose, onStatusChange, onDelete }) {
  const [t, setT]                           = useState(initialT);
  const [statusChanging, setStatusChanging] = useState(false);
  const [confirmDelete, setConfirmDelete]   = useState(false);
  const [showAI, setShowAI]                 = useState(false);
  const [promptCopied, setPromptCopied]     = useState(false);
  const [pastedResponse, setPastedResponse] = useState('');
  const [parsing, setParsing]               = useState(false);
  const [parseError, setParseError]         = useState('');
  const [applying, setApplying]             = useState(false);
  const [applied, setApplied]               = useState(false);
  const [parsedData, setParsedData]         = useState(null);

  const handleStatus = async (newStatus) => {
    setStatusChanging(true);
    try {
      await fetch(`${BASE}/snowai-ctr/company/${t.company_id}/transcripts/${t.id}/status/`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      setT(prev => ({ ...prev, status: newStatus }));
      onStatusChange && onStatusChange(newStatus);
    } catch {}
    finally { setStatusChanging(false); }
  };

  const handleDelete = async () => {
    try {
      await fetch(`${BASE}/snowai-ctr/company/${t.company_id}/transcripts/${t.id}/delete/`, { method: 'POST' });
      onDelete && onDelete();
      onClose();
    } catch {}
  };

  const buildPrompt = () => {
    const meta = [
      t.company_name   && `Company: ${t.company_name}`,
      t.source_title   && `Source: ${t.source_title}`,
      t.speaker_name   && `Speaker: ${t.speaker_name}${t.speaker_role ? ` (${t.speaker_role})` : ''}`,
      t.event_name     && `Event: ${t.event_name}`,
      t.event_date     && `Date: ${t.event_date}`,
      t.transcript_language && `Language: ${t.transcript_language}`,
    ].filter(Boolean).join('\n');

    return `You are a financial/business research analyst. Analyse the following transcript and respond with ONLY a valid JSON object — no markdown, no explanation, just the raw JSON.

CONTEXT
${meta}

TRANSCRIPT
${t.full_transcript_text}

RESPOND WITH THIS EXACT JSON STRUCTURE:
{
  "summary": "2-4 sentence executive summary of what was said",
  "key_points": [
    "First key point or claim made",
    "Second key point",
    "Third key point"
  ],
  "topics": ["topic_one", "topic_two", "topic_three"],
  "sentiment_score": 0.0,
  "analyst_notes": "Any notable context, red flags, or follow-up questions worth investigating"
}

Rules:
- sentiment_score must be a float between -1.0 (very negative) and 1.0 (very positive)
- topics should be short snake_case strings like "monetary_policy", "revenue_growth", "layoffs"
- key_points should be 3-6 items, each a single clear sentence
- Return ONLY the JSON object, nothing else`;
  };

  const handleCopyPrompt = async () => {
    await navigator.clipboard.writeText(buildPrompt());
    setPromptCopied(true);
    setTimeout(() => setPromptCopied(false), 2500);
  };

  const handleParseResponse = () => {
    setParseError('');
    setParsedData(null);
    setParsing(true);
    try {
      let raw = pastedResponse.trim();
      raw = raw.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '').trim();
      const data = JSON.parse(raw);
      if (!data.summary && !data.key_points)
        throw new Error('Missing summary or key_points in response');
      setParsedData(data);
    } catch (e) {
      setParseError(`Couldn't parse the response: ${e.message}. Make sure you copied the full JSON.`);
    } finally {
      setParsing(false);
    }
  };

  const handleApply = async () => {
    if (!parsedData) return;
    setApplying(true);
    try {
      const payload = {
        summary:         parsedData.summary        || '',
        key_points:      parsedData.key_points      || [],
        topics:          parsedData.topics          || [],
        sentiment_score: parsedData.sentiment_score ?? null,
        analyst_notes:   parsedData.analyst_notes   || '',
      };
      const res = await fetch(
        `${BASE}/snowai-ctr/company/${t.company_id}/transcripts/${t.id}/apply-ai/`,
        { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) }
      );
      if (res.ok) {
        const data = await res.json();
        setT(data.transcript);
        setApplied(true);
        setPastedResponse('');
        setParsedData(null);
        setShowAI(false);
        onStatusChange && onStatusChange('processed');
      }
    } catch {}
    finally { setApplying(false); }
  };

  const wordCount  = t.word_count || t.full_transcript_text?.split(/\s+/).filter(Boolean).length || 0;
  const sourceIcon = SOURCE_ICONS[t.source_type] || '📝';
  const ytId       = t.youtube_video_id;
  const hasAnalysis = !!(t.summary || t.key_points?.length || t.analyst_notes);

  return (
    <div className="snowai-modal-overlay" style={styles.modalOverlay} onClick={onClose}>
      {/*
        ─── THE FIX ───────────────────────────────────────────────────────────
        viewerModalBox:  display:flex, flexDirection:column, height:92vh, overflow:hidden
        viewerHeader:    flexShrink:0  → never compressed
        viewerBody:      flex:1, minHeight:0, overflowY:auto  → THE scroll container
        viewerFooter:    flexShrink:0  → always visible at bottom
        ────────────────────────────────────────────────────────────────────── 
      */}
      <div className="snowai-viewer-modal" style={styles.viewerModalBox} onClick={e => e.stopPropagation()}>

        {/* ── Gradient header — fixed at top, never shrinks ── */}
        <div className="snowai-viewer-header" style={styles.viewerHeader}>
          <div style={styles.viewerHeaderTop}>
            <div style={styles.viewerIcon}>{sourceIcon}</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={styles.viewerTitle}>{t.source_title || 'Untitled Transcript'}</p>
              <p style={styles.viewerSubtitle}>{t.company_name || `Company #${t.company_id}`}</p>
            </div>
            <span style={styles.ctrStatusBadge(t.status)}>{STATUS_LABELS[t.status] || t.status}</span>
            <button style={{ ...styles.modalCloseBtn, marginLeft: 6 }} onClick={onClose}>×</button>
          </div>
          <div style={styles.viewerMeta}>
            {t.speaker_name && <span style={styles.viewerMetaChip}>👤 {t.speaker_name}{t.speaker_role ? ` · ${t.speaker_role}` : ''}</span>}
            {t.event_name   && <span style={styles.viewerMetaChip}>🏛 {t.event_name}</span>}
            {t.event_date   && <span style={styles.viewerMetaChip}>📅 {fmtDate(t.event_date)}</span>}
            {t.transcript_language && <span style={styles.viewerMetaChip}>🌐 {t.transcript_language}</span>}
            {wordCount > 0  && <span style={styles.viewerMetaChip}>📝 {wordCount.toLocaleString()} words</span>}
            {t.recording_duration_seconds > 0 && <span style={styles.viewerMetaChip}>⏱ {formatDurationHMS(t.recording_duration_seconds)}</span>}
            {t.recorded_at  && <span style={styles.viewerMetaChip}>🕐 {fmtDate(t.recorded_at)}</span>}
          </div>
        </div>

        {/* ── THE SCROLL CONTAINER — flex:1, minHeight:0, overflowY:auto ── */}
        <div className="snowai-viewer-body" style={styles.viewerBody}>

          {applied && (
            <div style={{ background: '#e8f8f0', border: '1px solid #a3e4bf', borderRadius: 10,
                          padding: '10px 14px', fontSize: 13, color: '#1a6b3c', display: 'flex',
                          alignItems: 'center', gap: 8, flexShrink: 0 }}>
              ✅ AI analysis applied and saved — status updated to <strong>Processed</strong>
            </div>
          )}

          {ytId && (
            <a href={t.source_url} target="_blank" rel="noreferrer"
               style={{ display: 'flex', alignItems: 'center', gap: 12, textDecoration: 'none',
                        background: '#111', borderRadius: 12, overflow: 'hidden', border: '1px solid #222',
                        flexShrink: 0 }}>
              <img src={`https://img.youtube.com/vi/${ytId}/mqdefault.jpg`} alt="thumbnail"
                   style={{ width: 120, height: 68, objectFit: 'cover', flexShrink: 0 }} />
              <div style={{ padding: '8px 12px 8px 0' }}>
                <p style={{ margin: 0, fontSize: 12, color: '#eee', fontWeight: 600 }}>{t.source_title}</p>
                <p style={{ margin: '3px 0 0', fontSize: 11, color: '#888' }}>↗ Open on YouTube</p>
              </div>
              <div style={{ marginLeft: 'auto', paddingRight: 14, background: '#ff0000', borderRadius: 5,
                            width: 28, height: 20, display: 'flex', alignItems: 'center',
                            justifyContent: 'center', fontSize: 10, color: '#fff', flexShrink: 0 }}>▶</div>
            </a>
          )}

          {/* ── AI SUMMARY PANEL ── */}
          <div style={styles.aiPanel}>
            <div style={styles.aiPanelHead}>
              <span style={{ fontSize: 18, flexShrink: 0 }}>🤖</span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ margin: 0, fontSize: 13, fontWeight: 700, color: '#fff' }}>AI Analysis</p>
                <p style={{ margin: 0, fontSize: 11, color: 'rgba(255,255,255,0.65)',
                             whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {hasAnalysis ? 'Analysis saved — regenerate anytime' : 'Free — paste into any LLM, no API key needed'}
                </p>
              </div>
              <button
                style={{ ...styles.btnSmall, background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.3)',
                         color: '#fff', fontSize: 12, flexShrink: 0 }}
                onClick={() => { setShowAI(p => !p); setParseError(''); setParsedData(null); }}
              >
                {showAI ? '▲ Collapse' : (hasAnalysis ? '✏️ Regenerate' : '✨ Generate')}
              </button>
            </div>

            {showAI && (
              <div style={styles.aiPanelBody}>
                <div style={{ marginBottom: 14 }}>
                  <p style={{ fontSize: 12, fontWeight: 600, color: '#185fa5', margin: '0 0 8px', display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span style={{ background: '#185fa5', color: '#fff', borderRadius: '50%', width: 18, height: 18,
                                   display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 700 }}>1</span>
                    Copy this prompt → paste into ChatGPT, Claude, Gemini, etc.
                  </p>
                  <div style={styles.promptBox}>
                    <span style={{ userSelect: 'all' }}>{buildPrompt()}</span>
                  </div>
                  <button
                    style={{ ...styles.btnPrimary, marginTop: 8, fontSize: 12 }}
                    onClick={handleCopyPrompt}
                  >
                    {promptCopied ? '✅ Copied!' : '📋 Copy prompt'}
                  </button>
                </div>

                <div style={{ marginBottom: 12 }}>
                  <p style={{ fontSize: 12, fontWeight: 600, color: '#185fa5', margin: '0 0 8px', display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span style={{ background: '#185fa5', color: '#fff', borderRadius: '50%', width: 18, height: 18,
                                   display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 700 }}>2</span>
                    Paste the AI's JSON response here
                  </p>
                  <textarea
                    style={styles.pasteArea}
                    placeholder={'Paste the AI response here...\n\n{"summary": "...", "key_points": [...], ...}'}
                    value={pastedResponse}
                    onChange={e => { setPastedResponse(e.target.value); setParseError(''); setParsedData(null); setApplied(false); }}
                  />
                  {parseError && (
                    <div style={{ ...styles.error, marginTop: 6, fontSize: 12 }}>{parseError}</div>
                  )}
                  <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                    <button
                      style={{ ...styles.btnSecondary, fontSize: 12 }}
                      onClick={handleParseResponse}
                      disabled={!pastedResponse.trim() || parsing}
                    >
                      {parsing ? 'Parsing…' : '🔍 Parse response'}
                    </button>
                    {parsedData && (
                      <button
                        style={{ ...styles.btnPrimary, fontSize: 12 }}
                        onClick={handleApply}
                        disabled={applying}
                      >
                        {applying ? 'Saving…' : '💾 Apply & save to transcript'}
                      </button>
                    )}
                  </div>
                </div>

                {parsedData && (
                  <div style={{ background: '#e8f5e9', border: '1px solid #a5d6a7', borderRadius: 10,
                                padding: '12px 14px', fontSize: 12, color: '#1b5e20' }}>
                    <p style={{ margin: '0 0 6px', fontWeight: 700 }}>✅ Parsed successfully — preview:</p>
                    {parsedData.summary && <p style={{ margin: '0 0 4px' }}><strong>Summary:</strong> {parsedData.summary.slice(0, 120)}{parsedData.summary.length > 120 ? '…' : ''}</p>}
                    {parsedData.key_points?.length > 0 && <p style={{ margin: '0 0 4px' }}><strong>Key points:</strong> {parsedData.key_points.length} items</p>}
                    {parsedData.topics?.length > 0 && <p style={{ margin: '0 0 4px' }}><strong>Topics:</strong> {parsedData.topics.join(', ')}</p>}
                    {parsedData.sentiment_score != null && <p style={{ margin: 0 }}><strong>Sentiment:</strong> {parsedData.sentiment_score > 0 ? '+' : ''}{parsedData.sentiment_score}</p>}
                  </div>
                )}
              </div>
            )}

            {!showAI && hasAnalysis && (
              <div style={{ padding: '12px 16px', display: 'flex', flexDirection: 'column', gap: 8 }}>
                {t.summary && (
                  <p style={{ margin: 0, fontSize: 13, color: '#2c3e50', lineHeight: 1.6 }}>{t.summary}</p>
                )}
                {t.topics?.length > 0 && (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
                    {t.topics.map(tag => (
                      <span key={tag} style={{ fontSize: 11, padding: '2px 9px', borderRadius: 20,
                                              background: '#e8f0fe', color: '#1a56db', border: '1px solid #93b4f8' }}>
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Key points */}
          {t.key_points?.length > 0 && (
            <div style={styles.viewerSection}>
              <div style={styles.viewerSectionHead}>📌 Key Points</div>
              <div style={{ padding: '12px 16px' }}>
                {t.key_points.map((pt, i) => (
                  <div key={i} style={{ display: 'flex', gap: 10, marginBottom: 8, alignItems: 'flex-start' }}>
                    <span style={{ background: '#185fa5', color: '#fff', borderRadius: '50%', width: 20, height: 20,
                                   display: 'flex', alignItems: 'center', justifyContent: 'center',
                                   fontSize: 10, fontWeight: 700, flexShrink: 0 }}>{i + 1}</span>
                    <span style={{ fontSize: 13, color: '#2c3e50', lineHeight: 1.6 }}>{pt}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Analyst notes */}
          {t.analyst_notes && (
            <div style={styles.viewerSection}>
              <div style={styles.viewerSectionHead}>🖊 Analyst Notes</div>
              <div style={styles.viewerSectionBody}>{t.analyst_notes}</div>
            </div>
          )}

          {/* Sentiment bar */}
          {t.sentiment_score != null && (
            <div style={styles.viewerSection}>
              <div style={styles.viewerSectionHead}>📊 Sentiment</div>
              <div style={{ padding: '12px 16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ fontSize: 12, color: '#e74c3c', fontWeight: 600 }}>–</span>
                  <div style={{ flex: 1, height: 8, background: '#e6f1fb', borderRadius: 4, overflow: 'hidden' }}>
                    <div style={{ height: '100%', borderRadius: 4,
                                  width: `${((t.sentiment_score + 1) / 2) * 100}%`,
                                  background: t.sentiment_score > 0.2 ? '#2ecc71' : t.sentiment_score < -0.2 ? '#e74c3c' : '#f39c12',
                                  transition: 'width 0.4s ease' }} />
                  </div>
                  <span style={{ fontSize: 12, color: '#2ecc71', fontWeight: 600 }}>+</span>
                  <span style={{ fontSize: 12, color: '#042c53', fontWeight: 600, minWidth: 36 }}>
                    {t.sentiment_score > 0 ? '+' : ''}{t.sentiment_score.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Full transcript */}
          <div style={styles.viewerSection}>
            <div style={{ ...styles.viewerSectionHead, justifyContent: 'space-between' }}>
              <span>📄 Full Transcript</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontWeight: 400, textTransform: 'none', letterSpacing: 0, color: '#6a8fb5' }}>
                  {wordCount.toLocaleString()} words
                </span>
                <button
                  style={{ ...styles.btnSmall, fontSize: 10, padding: '3px 8px' }}
                  onClick={async () => { await navigator.clipboard.writeText(t.full_transcript_text); }}
                  title="Copy full transcript"
                >
                  📋 Copy
                </button>
              </div>
            </div>
            <div style={{ ...styles.viewerSectionBody, background: '#fff', fontSize: 13.5, lineHeight: 1.8 }}>
              {t.full_transcript_text}
            </div>
          </div>

        </div>
        {/* ── END SCROLL CONTAINER ── */}

        {/* ── Footer — fixed at bottom, never shrinks ── */}
        <div className="snowai-viewer-footer" style={styles.viewerFooter}>
          <span style={{ fontSize: 11, color: '#aaa', flex: 1 }}>
            Recorded {fmtDate(t.recorded_at)} · {t.transcription_method?.replace(/_/g, ' ')}
          </span>
          {t.status !== 'archived' && (
            <select style={{ ...styles.langSelect, fontSize: 12 }} value={t.status}
                    disabled={statusChanging} onChange={e => handleStatus(e.target.value)}>
              <option value="raw">⏳ Raw</option>
              <option value="reviewed">✅ Reviewed</option>
              <option value="processed">🔬 Processed</option>
              <option value="archived">📦 Archive</option>
            </select>
          )}
          {t.source_url && (
            <a href={t.source_url} target="_blank" rel="noreferrer"
               style={{ ...styles.btnSmall, textDecoration: 'none', fontSize: 12 }}>↗ Source</a>
          )}
          {confirmDelete ? (
            <>
              <span style={{ fontSize: 12, color: '#c0392b', fontWeight: 600 }}>Sure?</span>
              <button style={{ ...styles.btnDanger, fontSize: 12 }} onClick={handleDelete}>Yes, delete</button>
              <button style={{ ...styles.btnSecondary, fontSize: 12, padding: '5px 12px' }}
                      onClick={() => setConfirmDelete(false)}>Cancel</button>
            </>
          ) : (
            <button style={{ ...styles.btnDanger, fontSize: 12 }} onClick={() => setConfirmDelete(true)}>🗑 Delete</button>
          )}
        </div>

      </div>
    </div>
  );
}

// ─── RECORD FOR COMPANY MODAL ─────────────────────────────────────────────────
function RecordForCompanyModal({ company, onClose, onSaved }) {
  const [form, setForm] = useState({
    source_title: '', source_url: '', source_type: 'youtube',
    speaker_name: '', speaker_role: '', event_name: '',
  });
  const [recordingLanguage, setRecordingLanguage] = useState('en-US');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [fetchingTitle, setFetchingTitle] = useState(false);
  const f = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const {
    isSupported, isRecording, finalTranscript, interimTranscript, elapsed, error: recError,
    start: startRec, stop: stopRec, reset: resetRec,
  } = useTranscriptionRecorder({ language: recordingLanguage });

  const handleUrlChange = async (url) => {
    f('source_url', url);
    if (form.source_type !== 'youtube') return;
    const videoId = extractYouTubeId(url);
    if (!videoId || form.source_title) return;
    setFetchingTitle(true);
    try {
      const res = await fetch(`${BASE}/snowai-vtr/youtube-metadata/`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
      });
      if (res.ok) { const d = await res.json(); if (d.title) f('source_title', d.title); }
    } catch {}
    finally { setFetchingTitle(false); }
  };

  const handleSave = async () => {
    if (!finalTranscript.trim()) return;
    setSaving(true);
    try {
      const res = await fetch(`${BASE}/snowai-ctr/company/${company.id}/transcripts/save/`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          company_name:              company.name,
          full_transcript_text:      finalTranscript.trim(),
          transcript_language:       recordingLanguage,
          recording_duration_seconds: elapsed,
          transcription_method:      'browser_speech_api',
          status:                    'raw',
        }),
      });
      if (res.ok) { setSaved(true); resetRec(); onSaved && onSaved(); }
    } catch {}
    finally { setSaving(false); }
  };

  return (
    <div style={styles.modalOverlay}>
      <div style={styles.recordModalBox}>
        <div style={styles.modalHeader}>
          <span style={{ fontSize: 20 }}>🎙</span>
          <h2 style={styles.modalTitle}>Record transcript — {company.name}</h2>
          <button style={styles.modalCloseBtn} onClick={onClose}>×</button>
        </div>
        <div style={styles.modalBody}>
          {saved && (
            <div style={styles.success}>✅ Transcript saved to {company.name}!</div>
          )}

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 14 }}>
            <div style={styles.formGroup}>
              <label style={styles.label}>Source type</label>
              <select style={styles.select} value={form.source_type} onChange={e => f('source_type', e.target.value)}>
                <option value="youtube">▶️ YouTube</option>
                <option value="meeting">🎙 Meeting</option>
                <option value="earnings_call">📊 Earnings Call</option>
                <option value="conference">🏛 Conference</option>
                <option value="interview">🎤 Interview</option>
                <option value="other">📝 Other</option>
              </select>
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>Language</label>
              <select style={styles.select} value={recordingLanguage}
                      onChange={e => setRecordingLanguage(e.target.value)} disabled={isRecording}>
                {SUPPORTED_LANGUAGES.map(l => <option key={l.code} value={l.code}>{l.label}</option>)}
              </select>
            </div>
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>URL {fetchingTitle && <span style={{ color: '#85b7eb', textTransform: 'none', fontWeight: 400 }}>⏳ detecting title…</span>}</label>
            <input style={styles.input} placeholder="https://..." value={form.source_url}
                   onChange={e => handleUrlChange(e.target.value)} />
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label}>Title</label>
            <input style={styles.input} placeholder="e.g. Q3 Earnings Call 2024"
                   value={form.source_title} onChange={e => f('source_title', e.target.value)} />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            <div style={styles.formGroup}>
              <label style={styles.label}>Speaker</label>
              <input style={styles.input} placeholder="e.g. Jane Smith"
                     value={form.speaker_name} onChange={e => f('speaker_name', e.target.value)} />
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>Role</label>
              <input style={styles.input} placeholder="e.g. CEO"
                     value={form.speaker_role} onChange={e => f('speaker_role', e.target.value)} />
            </div>
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label}>Event name</label>
            <input style={styles.input} placeholder="e.g. Davos 2024"
                   value={form.event_name} onChange={e => f('event_name', e.target.value)} />
          </div>

          <div style={styles.recordingBox}>
            <div style={styles.recordingHeader}>
              <div style={styles.recordingDot(isRecording)} />
              <span style={styles.recordingLabel}>
                {isRecording ? `● Recording… ${formatDuration(elapsed)}` : 'Live transcript recorder'}
              </span>
            </div>

            {recError && <div style={{ ...styles.error, marginBottom: 8 }}>{recError}</div>}
            {!isSupported && <div style={{ ...styles.error, marginBottom: 8 }}>⚠️ Use Chrome or Edge for recording.</div>}

            {(finalTranscript || interimTranscript) && (
              <div style={styles.transcriptBox}>
                <span>{finalTranscript}</span>
                {interimTranscript && <span style={styles.interimText}>{interimTranscript}</span>}
              </div>
            )}
            {!finalTranscript && !isRecording && (
              <p style={{ fontSize: 12, color: '#bbb', textAlign: 'center', margin: '6px 0 10px' }}>
                Hit record and speak — transcript appears here in real time.
              </p>
            )}

            <div style={{ display: 'flex', gap: 8, marginTop: 10, flexWrap: 'wrap' }}>
              {!isRecording
                ? <button style={styles.btnRecord} onClick={startRec} disabled={!isSupported}>🎙 Start</button>
                : <button style={styles.btnRecordStop} onClick={stopRec}>⏹ Stop</button>
              }
              {finalTranscript && !isRecording && (
                <button style={{ ...styles.btnPrimary, fontSize: 12 }} onClick={handleSave} disabled={saving}>
                  {saving ? 'Saving…' : '💾 Save transcript'}
                </button>
              )}
              {(finalTranscript || interimTranscript) && (
                <button style={{ ...styles.btnSecondary, fontSize: 12 }} onClick={resetRec}>Clear</button>
              )}
            </div>
          </div>
        </div>
        <div style={styles.modalFooter}>
          <button style={styles.btnSecondary} onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
}

// ─── COMPANY TRANSCRIPTS TAB ──────────────────────────────────────────────────
function CompanyTranscriptsTab({ company }) {
  const [transcripts, setTranscripts]   = useState([]);
  const [loading, setLoading]           = useState(true);
  const [viewingTx, setViewingTx]       = useState(null);
  const [statusFilter, setStatusFilter] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const params = statusFilter ? `?status=${statusFilter}` : '';
      const res = await fetch(`${BASE}/snowai-ctr/company/${company.id}/transcripts/${params}`);
      if (res.ok) setTranscripts((await res.json()).transcripts || []);
    } catch {}
    finally { setLoading(false); }
  }, [company.id, statusFilter]);

  useEffect(() => { load(); }, [load]);

  const handleStatusChange = (newStatus) => {
    setTranscripts(prev => prev.map(t => t.id === viewingTx?.id ? { ...t, status: newStatus } : t));
    setViewingTx(prev => prev ? { ...prev, status: newStatus } : null);
  };

  const handleDelete = () => {
    setTranscripts(prev => prev.filter(t => t.id !== viewingTx?.id));
  };

  return (
    <>
      {viewingTx && (
        <TranscriptViewerModal
          transcript={viewingTx}
          onClose={() => setViewingTx(null)}
          onStatusChange={handleStatusChange}
          onDelete={handleDelete}
        />
      )}

      <div style={{ display: 'flex', gap: 8, marginBottom: 12, alignItems: 'center' }}>
        <select
          style={{ ...styles.langSelect, fontSize: 11, flex: 1 }}
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value)}
        >
          <option value="">All statuses</option>
          <option value="raw">⏳ Raw</option>
          <option value="reviewed">✅ Reviewed</option>
          <option value="processed">🔬 Processed</option>
        </select>
        <button style={styles.btnSmall} onClick={load} title="Refresh">↺ Refresh</button>
      </div>

      {loading ? (
        <p style={{ fontSize: 12, color: '#85b7eb', textAlign: 'center', padding: '12px 0' }}>Loading…</p>
      ) : transcripts.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '20px 10px' }}>
          <div style={{ fontSize: 32, marginBottom: 8 }}>🎙</div>
          <p style={{ fontSize: 12, color: '#85b7eb', margin: 0 }}>
            No transcripts yet — play a video and hit Record to capture one.
          </p>
        </div>
      ) : (
        transcripts.map(tx => {
          const wordCount = tx.word_count || 0;
          return (
            <div
              key={tx.id}
              style={styles.ctrItem}
              onClick={() => setViewingTx(tx)}
              onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 4px 16px rgba(24,95,165,0.14)'; e.currentTarget.style.borderColor = '#85b7eb'; }}
              onMouseLeave={e => { e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.borderColor = '#daeaf7'; }}
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
                <span style={{ fontSize: 18, lineHeight: 1, flexShrink: 0, marginTop: 1 }}>
                  {SOURCE_ICONS[tx.source_type] || '📝'}
                </span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={styles.ctrItemTitle}>{tx.source_title || 'Untitled'}</p>
                  <div style={styles.ctrItemMeta}>
                    {tx.speaker_name && <span>👤 {tx.speaker_name}</span>}
                    {tx.event_name   && <span>🏛 {tx.event_name}</span>}
                    {tx.recorded_at  && <span>📅 {fmtDate(tx.recorded_at)}</span>}
                    {wordCount > 0   && <span>📝 {wordCount.toLocaleString()} words</span>}
                    {tx.transcript_language && <span>🌐 {tx.transcript_language}</span>}
                  </div>
                  <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', alignItems: 'center' }}>
                    <span style={styles.ctrStatusBadge(tx.status)}>{STATUS_LABELS[tx.status] || tx.status}</span>
                    {tx.topics?.slice(0, 2).map(tp => (
                      <span key={tp} style={{ fontSize: 10, padding: '1px 7px', borderRadius: 10,
                                             background: '#e8f0fe', color: '#1a56db', border: '1px solid #93b4f8' }}>
                        {tp}
                      </span>
                    ))}
                  </div>
                </div>
                <span style={{ fontSize: 16, color: '#b5d4f4', flexShrink: 0 }}>›</span>
              </div>
            </div>
          );
        })
      )}
    </>
  );
}

// ─── GLOBAL TRANSCRIPT SEARCH MODAL ──────────────────────────────────────────
function GlobalTranscriptSearch({ onClose }) {
  const [query, setQuery]         = useState('');
  const [results, setResults]     = useState([]);
  const [loading, setLoading]     = useState(false);
  const [searched, setSearched]   = useState(false);
  const [viewingTx, setViewingTx] = useState(null);
  const inputRef = useRef(null);

  useEffect(() => { inputRef.current?.focus(); }, []);

  const doSearch = useCallback(async (q) => {
    if (!q.trim()) { setResults([]); setSearched(false); return; }
    setLoading(true); setSearched(true);
    try {
      const res = await fetch(`${BASE}/snowai-ctr/transcripts/?search=${encodeURIComponent(q)}&page_size=40`);
      if (res.ok) setResults((await res.json()).transcripts || []);
    } catch {}
    finally { setLoading(false); }
  }, []);

  useEffect(() => {
    const t = setTimeout(() => doSearch(query), 400);
    return () => clearTimeout(t);
  }, [query, doSearch]);

  const highlight = (text, q) => {
    if (!q || !text) return text;
    const idx = text.toLowerCase().indexOf(q.toLowerCase());
    if (idx === -1) return text.slice(0, 120) + '…';
    const start = Math.max(0, idx - 60);
    const end   = Math.min(text.length, idx + q.length + 80);
    const snippet = (start > 0 ? '…' : '') + text.slice(start, end) + (end < text.length ? '…' : '');
    const rel = idx - start + (start > 0 ? 1 : 0);
    const before = snippet.slice(0, rel);
    const match  = snippet.slice(rel, rel + q.length);
    const after  = snippet.slice(rel + q.length);
    return <span>{before}<mark style={{ background: '#fff3b0', borderRadius: 3, padding: '0 2px' }}>{match}</mark>{after}</span>;
  };

  return (
    <div style={styles.modalOverlay} onClick={onClose}>
      {viewingTx && (
        <TranscriptViewerModal
          transcript={viewingTx}
          onClose={() => setViewingTx(null)}
          onStatusChange={(s) => setViewingTx(p => ({ ...p, status: s }))}
          onDelete={() => { setViewingTx(null); doSearch(query); }}
        />
      )}
      <div className="snowai-search-modal" style={styles.txSearchModalBox} onClick={e => e.stopPropagation()}>

        <div style={styles.modalHeader}>
          <span style={{ fontSize: 20 }}>🔍</span>
          <h2 style={styles.modalTitle}>Search all transcripts</h2>
          <button style={styles.modalCloseBtn} onClick={onClose}>×</button>
        </div>

        <div style={{ padding: '16px 20px', borderBottom: '1px solid #e6f1fb', flexShrink: 0 }}>
          <input
            ref={inputRef}
            style={styles.txSearchInput}
            placeholder="Search by keyword, speaker, company, topic…"
            value={query}
            onChange={e => setQuery(e.target.value)}
          />
          {query && (
            <p style={{ fontSize: 11, color: '#85b7eb', margin: '7px 0 0' }}>
              {loading ? 'Searching…' : searched ? `${results.length} result${results.length !== 1 ? 's' : ''} across all companies` : ''}
            </p>
          )}
        </div>

        <div style={{ flex: 1, overflowY: 'auto', minHeight: 0 }}>
          {!query && (
            <div style={{ textAlign: 'center', padding: '48px 20px', color: '#85b7eb' }}>
              <div style={{ fontSize: 40, marginBottom: 12 }}>🔍</div>
              <p style={{ margin: 0, fontSize: 14 }}>Type to search across every transcript you've recorded</p>
              <p style={{ margin: '6px 0 0', fontSize: 12 }}>Searches title, speaker, full text, and summaries</p>
            </div>
          )}

          {searched && !loading && results.length === 0 && (
            <div style={{ textAlign: 'center', padding: '48px 20px', color: '#85b7eb' }}>
              <div style={{ fontSize: 36, marginBottom: 10 }}>🤷</div>
              <p style={{ margin: 0, fontSize: 14 }}>No transcripts match <strong>"{query}"</strong></p>
            </div>
          )}

          {results.map(tx => (
            <div
              key={tx.id}
              style={styles.txSearchResult}
              onClick={() => setViewingTx(tx)}
              onMouseEnter={e => e.currentTarget.style.background = '#f4f8fd'}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                <span style={{ fontSize: 20, flexShrink: 0, lineHeight: 1.2 }}>
                  {SOURCE_ICONS[tx.source_type] || '📝'}
                </span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', marginBottom: 3 }}>
                    <span style={{ fontSize: 13, fontWeight: 600, color: '#042c53' }}>
                      {tx.source_title || 'Untitled'}
                    </span>
                    <span style={{ fontSize: 11, background: '#e6f1fb', color: '#185fa5',
                                   border: '1px solid #b5d4f4', borderRadius: 5, padding: '1px 7px' }}>
                      {tx.company_name || `Company #${tx.company_id}`}
                    </span>
                    <span style={styles.ctrStatusBadge(tx.status)}>{STATUS_LABELS[tx.status]}</span>
                  </div>
                  <div style={{ fontSize: 11, color: '#6a8fb5', display: 'flex', gap: '4px 12px',
                                flexWrap: 'wrap', marginBottom: 5 }}>
                    {tx.speaker_name && <span>👤 {tx.speaker_name}</span>}
                    {tx.recorded_at  && <span>📅 {fmtDate(tx.recorded_at)}</span>}
                    {tx.word_count > 0 && <span>📝 {tx.word_count.toLocaleString()} words</span>}
                    {tx.transcript_language && <span>🌐 {tx.transcript_language}</span>}
                  </div>
                  <p style={{ fontSize: 12, color: '#4a6fa5', margin: 0, lineHeight: 1.6 }}>
                    {highlight(tx.summary || tx.full_transcript_text, query)}
                  </p>
                  {tx.topics?.length > 0 && (
                    <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', marginTop: 5 }}>
                      {tx.topics.map(tp => (
                        <span key={tp} style={{ fontSize: 10, padding: '1px 7px', borderRadius: 10,
                                               background: '#e8f0fe', color: '#1a56db', border: '1px solid #93b4f8' }}>
                          {tp}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                <span style={{ fontSize: 16, color: '#b5d4f4', flexShrink: 0 }}>›</span>
              </div>
            </div>
          ))}
        </div>
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

  const deletePerson = async (id) => {
    if (!window.confirm('Remove this person?')) return;
    await fetch(`${BASE}/snowai-companies-of-interest/delete-person/${id}/`, { method: 'POST' });
    onRefresh();
  };

  const deleteLink = async (id) => {
    if (!window.confirm('Remove this link?')) return;
    await fetch(`${BASE}/snowai-companies-of-interest/delete-link/${id}/`, { method: 'POST' });
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
      {playingVideo && <YouTubeModal link={playingVideo} company={company} onClose={() => setPlayingVideo(null)} />}
      {viewingPdf && <PDFModal link={viewingPdf} company={company} onClose={() => setViewingPdf(null)} />}
      {editingCompany && <EditCompanyModal company={company} onClose={() => setEditingCompany(false)} onSaved={() => { onRefresh(); setEditingCompany(false); }} />}
      {editingPerson && <EditPersonModal person={editingPerson} onClose={() => setEditingPerson(null)} onSaved={() => { onRefresh(); setEditingPerson(null); }} />}
      {editingLink && <EditLinkModal link={editingLink} onClose={() => setEditingLink(null)} onSaved={() => { onRefresh(); setEditingLink(null); }} />}

      <div style={styles.card}>
        <div style={styles.cardTopBar} />
        <div style={styles.cardHead}>
          <div style={styles.logoCircle}>
            {company.logo_base64 ? <img src={company.logo_base64} alt={company.name} style={styles.logoImg} /> : company.name.charAt(0).toUpperCase()}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={styles.companyName}>{company.name}</p>
            {company.sector && <span style={styles.sectorBadge}>{company.sector}</span>}
          </div>
          <button style={styles.btnSmall} onClick={() => setEditingCompany(true)}>✏️</button>
          <button style={styles.btnDanger} onClick={deleteCompany}>✕</button>
        </div>

        <div style={styles.cardBody}>
          {company.description && <p style={styles.description}>{company.description}</p>}

          <div style={{ display: 'flex', gap: 8, marginBottom: 14, flexWrap: 'wrap' }}>
            {[
              { label: `${company.key_people.length} people`, icon: '👥' },
              { label: `${linkCounts.url} links`, icon: '🌐' },
              { label: `${linkCounts.pdf} PDFs`, icon: '📄' },
              { label: `${linkCounts.youtube} videos`, icon: '▶️' },
            ].map((s, i) => (
              <span key={i} style={{ fontSize: 11, color: '#185fa5', background: '#e6f1fb', border: '1px solid #b5d4f4', borderRadius: 6, padding: '2px 8px', display: 'flex', alignItems: 'center', gap: 4 }}>
                {s.icon} {s.label}
              </span>
            ))}
          </div>

          <div className="snowai-tab-row" style={styles.tabRow}>
            {[
              { key: 'people', label: '👥 People' },
              { key: 'links', label: '🌐 Links' },
              { key: 'pdfs', label: '📄 PDFs' },
              { key: 'youtube', label: '▶️ Videos' },
              { key: 'transcripts', label: '🎙 Transcripts' },
            ].map(t => (
              <button key={t.key} className="snowai-tab-btn" style={styles.tab(tab === t.key)} onClick={() => setTab(t.key)}>{t.label}</button>
            ))}
          </div>

          {tab === 'people' && (
            <>
              {company.key_people.length === 0 && <p style={{ fontSize: 12, color: '#85b7eb', textAlign: 'center', padding: '12px 0' }}>No key people added yet.</p>}
              {company.key_people.map(person => (
                <div key={person.id} style={styles.personCard}>
                  <div style={styles.personPhoto}>
                    {person.photo_base64 ? <img src={person.photo_base64} alt={person.name} style={styles.personPhotoImg} /> : person.name.charAt(0).toUpperCase()}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={styles.personName}>{person.name}</p>
                    {person.role && <p style={styles.personRole}>{person.role}</p>}
                    {person.bio && <p style={styles.personBio}>{person.bio}</p>}
                  </div>
                  <button style={styles.btnSmall} onClick={() => setEditingPerson(person)}>✏️</button>
                  <button style={styles.btnDanger} onClick={() => deletePerson(person.id)}>✕</button>
                </div>
              ))}
              <div style={styles.addSection}>
                <button style={styles.btnSmall} onClick={() => setShowAddPerson(true)}><span>+</span> Add person</button>
              </div>
            </>
          )}

          {tab === 'links' && (
            <>
              {company.links.filter(l => l.link_type === 'url').length === 0 && <p style={{ fontSize: 12, color: '#85b7eb', textAlign: 'center', padding: '12px 0' }}>No web links added yet.</p>}
              {company.links.filter(l => l.link_type === 'url').map(link => (
                <div key={link.id} style={styles.linkItem}>
                  <span style={styles.linkIcon}>🌐</span>
                  <span style={styles.linkTitle}>{link.title}</span>
                  <a href={link.url} target="_blank" rel="noreferrer" style={{ ...styles.btnSmall, textDecoration: 'none', fontSize: 11 }}>↗ Open</a>
                  <button style={styles.btnSmall} onClick={() => setEditingLink(link)}>✏️</button>
                  <button style={styles.btnDanger} onClick={() => deleteLink(link.id)}>✕</button>
                </div>
              ))}
              <div style={styles.addSection}><button style={styles.btnSmall} onClick={() => setShowAddLink(true)}><span>+</span> Add link</button></div>
            </>
          )}

          {tab === 'pdfs' && (
            <>
              {company.links.filter(l => l.link_type === 'pdf').length === 0 && <p style={{ fontSize: 12, color: '#85b7eb', textAlign: 'center', padding: '12px 0' }}>No PDFs added yet.</p>}
              {company.links.filter(l => l.link_type === 'pdf').map(link => (
                <div key={link.id} style={styles.linkItem}>
                  <span style={styles.linkIcon}>📄</span>
                  <span style={styles.linkTitle}>{link.title}</span>
                  <button style={{ ...styles.btnSmall, fontSize: 11 }} onClick={() => setViewingPdf(link)}>👁 View</button>
                  <a href={link.url} target="_blank" rel="noreferrer" style={{ ...styles.btnSmall, textDecoration: 'none', fontSize: 11 }}>↗</a>
                  <button style={{ ...styles.btnSmall, fontSize: 11 }} onClick={() => setEditingLink(link)}>✏️</button>
                  <button style={styles.btnDanger} onClick={() => deleteLink(link.id)}>✕</button>
                </div>
              ))}
              <div style={styles.addSection}><button style={styles.btnSmall} onClick={() => setShowAddLink(true)}><span>+</span> Add PDF</button></div>
            </>
          )}

          {tab === 'youtube' && (
            <>
              {company.links.filter(l => l.link_type === 'youtube').length === 0 && <p style={{ fontSize: 12, color: '#85b7eb', textAlign: 'center', padding: '12px 0' }}>No videos added yet.</p>}
              {company.links.filter(l => l.link_type === 'youtube').map(link => {
                const videoId = extractYouTubeId(link.url);
                return (
                  <div key={link.id} style={{ ...styles.linkItem, alignItems: 'flex-start', flexWrap: 'wrap', gap: 10 }}>
                    {videoId && (
                      <div onClick={() => setPlayingVideo(link)} style={{ position: 'relative', width: 100, height: 56, borderRadius: 8, overflow: 'hidden', flexShrink: 0, cursor: 'pointer' }}>
                        <img src={`https://img.youtube.com/vi/${videoId}/mqdefault.jpg`} alt={link.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.35)' }}>
                          <span style={{ background: '#ff0000', borderRadius: 5, width: 28, height: 20, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, color: '#fff' }}>▶</span>
                        </div>
                      </div>
                    )}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ ...styles.linkTitle, whiteSpace: 'normal', fontSize: 12, fontWeight: 500, color: '#042c53', margin: '0 0 6px' }}>{link.title}</p>
                      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                        <button style={{ ...styles.btnSmall, fontSize: 11 }} onClick={() => setPlayingVideo(link)}>▶ Play</button>
                        <button style={{ ...styles.btnSmall, fontSize: 11 }} onClick={() => setEditingLink(link)}>✏️</button>
                        <button style={{ ...styles.btnDanger, fontSize: 11 }} onClick={() => deleteLink(link.id)}>✕</button>
                      </div>
                    </div>
                  </div>
                );
              })}
              <div style={styles.addSection}><button style={styles.btnSmall} onClick={() => setShowAddLink(true)}><span>+</span> Add video</button></div>
            </>
          )}

          {tab === 'transcripts' && (
            <CompanyTranscriptsTab company={company} />
          )}
        </div>
      </div>
    </>
  );
}

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────
export default function CompaniesofInterest() {
  const [companies, setCompanies]           = useState([]);
  const [loading, setLoading]               = useState(true);
  const [showAddCompany, setShowAddCompany] = useState(false);
  const [showSearch, setShowSearch]         = useState(false);
  const [search, setSearch]                 = useState('');
  const [sectorFilter, setSectorFilter]     = useState('');

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
      <GlobalStyles />
      {showSearch && <GlobalTranscriptSearch onClose={() => setShowSearch(false)} />}
      {showAddCompany && (
        <AddCompanyModal
          onClose={() => setShowAddCompany(false)}
          onSaved={() => { fetchCompanies(); setShowAddCompany(false); }}
        />
      )}
      <div className="header"><Header /></div>
      <div className="main-page-body">
        <SideNavs />
        <div className="main-body-info">
          <div className="snowai-page-header" style={styles.header}>
            <h5 style={styles.pageTitle}>
              <span style={styles.pageTitleAccent} />
              SnowAI Companies of Interest
            </h5>
            <div style={{ display: 'flex', gap: 8 }}>
              <button style={styles.btnSecondary} onClick={() => setShowSearch(true)}>
                🔍 Search transcripts
              </button>
              <button style={styles.btnPrimary} onClick={() => setShowAddCompany(true)}>+ Add company</button>
            </div>
          </div>

          <div style={styles.searchBar}>
            <input style={styles.searchInput} placeholder="Search companies, sectors, descriptions..." value={search} onChange={e => setSearch(e.target.value)} />
            {sectors.length > 0 && (
              <select style={{ ...styles.select, width: 'auto', minWidth: 140 }} value={sectorFilter} onChange={e => setSectorFilter(e.target.value)}>
                <option value="">All sectors</option>
                {sectors.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            )}
            {(search || sectorFilter) && (
              <button style={styles.btnSecondary} onClick={() => { setSearch(''); setSectorFilter(''); }}>Clear</button>
            )}
          </div>

          {loading ? (
            <div style={styles.empty}>
              <div className="spinner-border text-primary" role="status" />
              <p style={{ marginTop: 12 }}>Loading companies...</p>
            </div>
          ) : filtered.length === 0 ? (
            <div style={styles.empty}>
              {companies.length === 0 ? (
                <>
                  <div style={{ fontSize: 40, marginBottom: 12 }}>🏢</div>
                  <p>No companies yet. Add your first company of interest.</p>
                  <button style={{ ...styles.btnPrimary, margin: '12px auto', display: 'inline-flex' }} onClick={() => setShowAddCompany(true)}>+ Add first company</button>
                </>
              ) : <p>No companies match your search.</p>}
            </div>
          ) : (
            <>
              <p style={{ fontSize: 12, color: '#85b7eb', marginBottom: 16 }}>
                Showing {filtered.length} of {companies.length} {companies.length === 1 ? 'company' : 'companies'}
              </p>
              <div className="snowai-card-grid" style={styles.grid}>
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