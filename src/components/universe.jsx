import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  MapPin,
  Settings,
  Navigation,
  Compass,
  Globe,
  Key,
  Info,
  X,
  Map,
  Search
} from 'lucide-react';

const LOCATION_GROUPS = [
  {
    region: 'Out of This World 🚀',
    locations: [
      {
        id: 'iss-cupola',
        name: 'International Space Station',
        city: 'Low Earth Orbit',
        lat: 29.5602853,
        lng: -95.0853914,
        panoId: 'zChzPIAn4RIAAAQvxgbyEg', // Specific panorama ID for the ISS Cupola
        pov: { heading: 260, pitch: -10 }
      }
    ]
  },
  {
    region: 'North America',
    locations: [
      { id: 'nyc-wall', name: 'Wall Street', city: 'New York, USA', lat: 40.706005, lng: -74.008827, pov: { heading: 120, pitch: 10 } },
      { id: 'nyc-tsq', name: 'Times Square', city: 'New York, USA', lat: 40.758896, lng: -73.985130, pov: { heading: 0, pitch: 10 } },
      { id: 'sf-fin', name: 'Financial District', city: 'San Francisco, USA', lat: 37.7937, lng: -122.3995, pov: { heading: 320, pitch: 5 } },
      { id: 'toronto-fin', name: 'Financial District', city: 'Toronto, Canada', lat: 43.6481, lng: -79.3790, pov: { heading: 0, pitch: 15 } }
    ]
  },
  {
    region: 'Europe',
    locations: [
      { id: 'london-city', name: 'City of London', city: 'London, UK', lat: 51.5134, lng: -0.0890, pov: { heading: 250, pitch: 10 } },
      { id: 'london-canary', name: 'Canary Wharf', city: 'London, UK', lat: 51.5045, lng: -0.0195, pov: { heading: 90, pitch: 20 } },
      { id: 'paris-def', name: 'La Défense', city: 'Paris, France', lat: 48.8925, lng: 2.2361, pov: { heading: 110, pitch: 5 } },
      { id: 'frankfurt-fin', name: 'Bankenviertel', city: 'Frankfurt, Germany', lat: 50.1111, lng: 8.6728, pov: { heading: 350, pitch: 15 } }
    ]
  },
  {
    region: 'East Asia',
    locations: [
      { id: 'tokyo-shibuya', name: 'Shibuya Crossing', city: 'Tokyo, Japan', lat: 35.6595209, lng: 139.7005165, pov: { heading: 270, pitch: 0 } },
      { id: 'seoul-gangnam', name: 'Gangnam District', city: 'Seoul, South Korea', lat: 37.4979, lng: 127.0276, pov: { heading: 180, pitch: 5 } },
      { id: 'seoul-yeouido', name: 'Yeouido Financial Hub', city: 'Seoul, South Korea', lat: 37.5219, lng: 126.9243, pov: { heading: 120, pitch: 10 } },
      { id: 'shanghai-pudong', name: 'Lujiazui / Pudong', city: 'Shanghai, China', lat: 31.2397, lng: 121.4998, pov: { heading: 90, pitch: 10 } },
      { id: 'beijing-cbd', name: 'Guomao CBD', city: 'Beijing, China', lat: 39.9087, lng: 116.4551, pov: { heading: 0, pitch: 10 } },
      { id: 'hk-central', name: 'Central District', city: 'Hong Kong, China', lat: 22.2813, lng: 114.1565, pov: { heading: 180, pitch: 15 } },
      { id: 'macau-cotai', name: 'Cotai Strip', city: 'Macau, China', lat: 22.1465, lng: 113.5647, pov: { heading: 160, pitch: 10 } },
      { id: 'taipei-xinyi', name: 'Xinyi District (Taipei 101)', city: 'Taipei, Taiwan', lat: 25.0336, lng: 121.5646, pov: { heading: 45, pitch: 20 } }
    ]
  },
  {
    region: 'Southeast Asia & Middle East',
    locations: [
      { id: 'singapore-marina', name: 'Raffles Place', city: 'Singapore', lat: 1.2835, lng: 103.8525, pov: { heading: 45, pitch: 5 } },
      { id: 'dubai-difc', name: 'Financial Centre', city: 'Dubai, UAE', lat: 25.2127, lng: 55.2818, pov: { heading: 130, pitch: 10 } }
    ]
  },
  {
    region: 'South America',
    locations: [
      { id: 'sp-paulista', name: 'Avenida Paulista', city: 'São Paulo, Brazil', lat: -23.5615, lng: -46.6559, pov: { heading: 140, pitch: 5 } }
    ]
  }
];

const loadGoogleMapsScript = (apiKey, callback) => {
  const existingScript = document.getElementById('google-maps-script');

  if (existingScript) {
    if (window.google && window.google.maps) {
      callback();
    }
    return;
  }

  const script = document.createElement('script');
  script.id = 'google-maps-script';
  // Use provided key, otherwise use weekly version (will show development watermark)
  script.src = `https://maps.googleapis.com/maps/api/js?${apiKey ? `key=${apiKey}&` : ''}v=weekly`;
  script.async = true;
  script.defer = true;

  script.onload = () => {
    if (window.google && window.google.maps) {
      callback();
    }
  };

  script.onerror = () => {
    console.error('Failed to load Google Maps script.');
  };

  document.head.appendChild(script);
};

// ---- Styles (plain JS objects, no Tailwind required) ----
const styles = {
  container: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: '100vw',
    height: '100vh',
    zIndex: 9999,
    backgroundColor: '#0f172a',
    overflow: 'hidden',
    fontFamily: "system-ui, -apple-system, 'Segoe UI', sans-serif"
  },
  mapContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 0,
    width: '100%',
    height: '100%',
    transition: 'filter 0.3s ease'
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    zIndex: 50,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0f172a',
    color: '#fff'
  },
  loadingContent: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 16
  },
  spinIcon: {
    width: 48,
    height: 48,
    color: '#3b82f6',
    animation: 'wwe-spin 1.2s linear infinite'
  },
  loadingTitle: {
    fontSize: 20,
    fontWeight: 600,
    letterSpacing: '0.05em',
    margin: 0
  },
  sidebar: {
    position: 'absolute',
    top: 16,
    left: 16,
    zIndex: 10,
    width: 320,
    maxHeight: 'calc(100vh - 2rem)',
    display: 'flex',
    flexDirection: 'column',
    gap: 16
  },
  card: {
    backgroundColor: 'rgba(15, 23, 42, 0.82)',
    backdropFilter: 'blur(12px)',
    WebkitBackdropFilter: 'blur(12px)',
    border: '1px solid rgba(51, 65, 85, 0.5)',
    borderRadius: 16,
    boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)'
  },
  headerCard: {
    padding: 16
  },
  headerRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  logoRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    color: '#fff'
  },
  appTitle: {
    fontWeight: 700,
    fontSize: 18,
    letterSpacing: '0.02em'
  },
  settingsButton: {
    padding: 8,
    backgroundColor: '#1e293b',
    border: 'none',
    color: '#cbd5e1',
    borderRadius: 9999,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'background-color 0.2s'
  },
  navPanel: {
    padding: 16,
    flex: 1,
    overflowY: 'auto',
    minHeight: 0
  },
  sectionHeader: {
    fontSize: 11,
    fontWeight: 700,
    color: '#94a3b8',
    textTransform: 'uppercase',
    letterSpacing: '0.15em',
    marginTop: 0,
    marginBottom: 12,
    display: 'flex',
    alignItems: 'center',
    gap: 8
  },
  regionsWrapper: {
    display: 'flex',
    flexDirection: 'column',
    gap: 16,
    marginBottom: 24
  },
  regionGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: 8
  },
  regionTitle: {
    fontSize: 10,
    fontWeight: 700,
    color: '#64748b',
    textTransform: 'uppercase',
    letterSpacing: '0.1em',
    paddingLeft: 4,
    margin: 0
  },
  locationButton: {
    display: 'flex',
    flexDirection: 'column',
    textAlign: 'left',
    width: '100%',
    padding: 12,
    borderRadius: 12,
    transition: 'all 0.2s',
    border: '1px solid transparent',
    backgroundColor: 'rgba(30, 41, 59, 0.5)',
    color: '#cbd5e1',
    cursor: 'pointer'
  },
  locationButtonActive: {
    backgroundColor: 'rgba(37, 99, 235, 0.2)',
    borderColor: 'rgba(59, 130, 246, 0.5)',
    color: '#fff',
    boxShadow: '0 0 15px rgba(59,130,246,0.15)'
  },
  locationName: {
    fontWeight: 600,
    fontSize: 14
  },
  locationCity: {
    fontSize: 12,
    opacity: 0.7,
    display: 'flex',
    alignItems: 'center',
    gap: 4,
    marginTop: 4
  },
  divider: {
    height: 1,
    width: '100%',
    backgroundColor: 'rgba(51,65,85,0.5)',
    margin: '16px 0'
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: 12
  },
  inputRow: {
    display: 'flex',
    gap: 8
  },
  input: {
    width: '100%',
    boxSizing: 'border-box',
    backgroundColor: '#1e293b',
    border: '1px solid #334155',
    borderRadius: 8,
    padding: '8px 12px',
    fontSize: 13,
    color: '#fff',
    outline: 'none'
  },
  submitButton: {
    width: '100%',
    boxSizing: 'border-box',
    backgroundColor: '#2563eb',
    color: '#fff',
    fontWeight: 600,
    fontSize: 14,
    padding: '10px 16px',
    borderRadius: 8,
    border: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    cursor: 'pointer',
    transition: 'background-color 0.2s'
  },
  errorToast: {
    position: 'absolute',
    top: 16,
    left: '50%',
    transform: 'translateX(-50%)',
    zIndex: 50,
    backgroundColor: 'rgba(239, 68, 68, 0.92)',
    backdropFilter: 'blur(12px)',
    WebkitBackdropFilter: 'blur(12px)',
    color: '#fff',
    padding: '12px 24px',
    borderRadius: 12,
    boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)',
    border: '1px solid #f87171',
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    fontWeight: 500,
    fontSize: 14,
    animation: 'wwe-toast-in 0.25s ease'
  },
  modalOverlay: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    zIndex: 50,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.45)',
    backdropFilter: 'blur(4px)',
    WebkitBackdropFilter: 'blur(4px)',
    padding: 16
  },
  modalCard: {
    backgroundColor: '#0f172a',
    border: '1px solid #334155',
    borderRadius: 16,
    width: '100%',
    maxWidth: 448,
    padding: 24,
    boxShadow: '0 25px 50px -12px rgba(0,0,0,0.6)',
    position: 'relative',
    boxSizing: 'border-box'
  },
  closeButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    padding: 6,
    color: '#94a3b8',
    backgroundColor: '#1e293b',
    borderRadius: 9999,
    border: 'none',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  modalHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    marginBottom: 24,
    color: '#fff'
  },
  modalIconWrapper: {
    padding: 12,
    backgroundColor: 'rgba(59, 130, 246, 0.2)',
    borderRadius: 12,
    display: 'flex'
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 700,
    margin: 0
  },
  modalSubtitle: {
    fontSize: 12,
    color: '#94a3b8',
    margin: 0
  },
  modalBody: {
    display: 'flex',
    flexDirection: 'column',
    gap: 16
  },
  infoBox: {
    backgroundColor: 'rgba(245, 158, 11, 0.1)',
    border: '1px solid rgba(245, 158, 11, 0.2)',
    borderRadius: 12,
    padding: 16,
    display: 'flex',
    gap: 12,
    color: 'rgba(253, 230, 138, 0.9)'
  },
  infoText: {
    fontSize: 13,
    lineHeight: 1.6,
    margin: 0
  },
  label: {
    display: 'block',
    fontSize: 14,
    fontWeight: 500,
    color: '#cbd5e1',
    marginBottom: 8
  },
  apiInput: {
    width: '100%',
    boxSizing: 'border-box',
    backgroundColor: '#1e293b',
    border: '1px solid #475569',
    borderRadius: 8,
    padding: '12px 16px',
    color: '#fff',
    outline: 'none',
    fontFamily: 'monospace',
    fontSize: 14
  },
  buttonRow: {
    display: 'flex',
    gap: 12,
    paddingTop: 8
  },
  saveButton: {
    flex: 1,
    backgroundColor: '#2563eb',
    color: '#fff',
    fontWeight: 600,
    fontSize: 14,
    padding: '10px 16px',
    borderRadius: 12,
    border: 'none',
    cursor: 'pointer',
    transition: 'background-color 0.2s'
  }
};

// Small helper so hover states don't need extra React state per row
const withHover = (base, hoverStyle) => ({
  onMouseEnter: (e) => Object.assign(e.currentTarget.style, hoverStyle),
  onMouseLeave: (e) => Object.assign(e.currentTarget.style, base)
});

export default function StreetViewExplorer() {
  const [apiKey, setApiKey] = useState('');
  const [activeKey, setActiveKey] = useState('');
  const [isLoaded, setIsLoaded] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  const [currentLocation, setCurrentLocation] = useState(LOCATION_GROUPS[0].locations[0]);
  const [customLat, setCustomLat] = useState('');
  const [customLng, setCustomLng] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const mapRef = useRef(null);
  const panoramaRef = useRef(null);
  const svServiceRef = useRef(null);

  // Initialize Maps Script
  useEffect(() => {
    setIsLoaded(false);
    // Remove old script if key changes
    const oldScript = document.getElementById('google-maps-script');
    if (oldScript) {
      oldScript.remove();
      // Clean up global google object to force reload
      if (window.google) {
        delete window.google;
      }
    }

    loadGoogleMapsScript(activeKey, () => {
      setIsLoaded(true);
    });
  }, [activeKey]);

  // Initialize Panorama instance
  useEffect(() => {
    if (isLoaded && mapRef.current && window.google && window.google.maps) {
      panoramaRef.current = new window.google.maps.StreetViewPanorama(
        mapRef.current,
        {
          position: { lat: currentLocation.lat, lng: currentLocation.lng },
          pov: currentLocation.pov || { heading: 0, pitch: 0 },
          zoom: 1,
          addressControl: true,
          showRoadLabels: true,
          linksControl: true,
          panControl: true,
          zoomControl: true,
          clickToGo: true,
          scrollwheel: true,
          disableDoubleClickZoom: false,
          motionTracking: true,
          motionTrackingControl: true,
          enableCloseButton: false,
          fullscreenControl: false // Handled by our layout
        }
      );

      svServiceRef.current = new window.google.maps.StreetViewService();
    }
  }, [isLoaded]); // Only run on initial load or key change

  // Handle jumping to a new location
  const jumpToLocation = useCallback((loc) => {
    if (!panoramaRef.current || !svServiceRef.current) return;
    setErrorMsg('');

    // If we have a specific pano ID (like the ISS), use that. Otherwise use coordinates.
    const request = loc.panoId
      ? { pano: loc.panoId }
      : { location: { lat: loc.lat, lng: loc.lng }, radius: 50 };

    svServiceRef.current.getPanorama(request)
      .then(({ data }) => {
        panoramaRef.current.setPano(data.location.pano);
        if (loc.pov) {
          panoramaRef.current.setPov(loc.pov);
        }

        // Update custom input fields to reflect new position
        setCustomLat(data.location.latLng.lat().toFixed(6));
        setCustomLng(data.location.latLng.lng().toFixed(6));
      })
      .catch(() => {
        // Fallback if panoId fails but we have coords
        if (loc.panoId && loc.lat && loc.lng) {
          svServiceRef.current.getPanorama({ location: { lat: loc.lat, lng: loc.lng }, radius: 500 })
            .then(({ data }) => {
              panoramaRef.current.setPano(data.location.pano);
              if (loc.pov) {
                panoramaRef.current.setPov(loc.pov);
              }
              setCustomLat(data.location.latLng.lat().toFixed(6));
              setCustomLng(data.location.latLng.lng().toFixed(6));
            }).catch(() => {
              setErrorMsg('No Street View imagery found near these coordinates.');
              setTimeout(() => setErrorMsg(''), 4000);
            });
        } else {
          setErrorMsg('No Street View imagery found near these coordinates.');
          setTimeout(() => setErrorMsg(''), 4000);
        }
      });
  }, []);

  // Update map when predefined location is selected
  useEffect(() => {
    if (isLoaded) {
      jumpToLocation(currentLocation);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentLocation, isLoaded, jumpToLocation]);

  const handleCustomSearch = () => {
    const lat = parseFloat(customLat);
    const lng = parseFloat(customLng);

    if (isNaN(lat) || isNaN(lng)) {
      setErrorMsg('Please enter valid numeric coordinates.');
      setTimeout(() => setErrorMsg(''), 4000);
      return;
    }

    const customLoc = { id: 'custom', name: 'Custom Location', lat, lng };
    setCurrentLocation(customLoc);
    jumpToLocation(customLoc);
  };

  const handleInputKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleCustomSearch();
    }
  };

  return (
    <div style={styles.container}>

      {/* The Google Maps Container */}
      <div
        ref={mapRef}
        style={{ ...styles.mapContainer, filter: showSettings ? 'blur(4px)' : 'none' }}
      />

      {/* Loading State Overlay */}
      {!isLoaded && (
        <div style={styles.loadingOverlay}>
          <div style={styles.loadingContent}>
            <Compass style={styles.spinIcon} />
            <h2 style={styles.loadingTitle}>Loading Street View...</h2>
          </div>
        </div>
      )}

      {/* Main UI Overlay - Sidebar */}
      <div style={styles.sidebar}>

        {/* App Header */}
        <div style={{ ...styles.card, ...styles.headerCard }}>
          <div style={styles.headerRow}>
            <div style={styles.logoRow}>
              <Globe style={{ width: 24, height: 24, color: '#60a5fa' }} />
              <h1 style={styles.appTitle}>SnowAI World Walker</h1>
            </div>
            <button
              onClick={() => setShowSettings(!showSettings)}
              style={styles.settingsButton}
              title="Settings"
              {...withHover(styles.settingsButton, { backgroundColor: '#334155' })}
            >
              <Settings style={{ width: 16, height: 16 }} />
            </button>
          </div>
        </div>

        {/* Navigation Panel */}
        <div style={{ ...styles.card, ...styles.navPanel }} className="wwe-scrollbar">

          <h2 style={styles.sectionHeader}>
            <Map style={{ width: 12, height: 12 }} />
            Global Economic Hubs
          </h2>

          <div style={styles.regionsWrapper}>
            {LOCATION_GROUPS.map((group) => (
              <div key={group.region} style={styles.regionGroup}>
                <h3 style={styles.regionTitle}>{group.region}</h3>
                {group.locations.map((loc) => {
                  const isActive = currentLocation.id === loc.id;
                  const base = isActive
                    ? { ...styles.locationButton, ...styles.locationButtonActive }
                    : styles.locationButton;
                  return (
                    <button
                      key={loc.id}
                      onClick={() => setCurrentLocation(loc)}
                      style={base}
                      {...(!isActive
                        ? withHover(styles.locationButton, { backgroundColor: 'rgba(51, 65, 85, 0.5)' })
                        : {})}
                    >
                      <span style={styles.locationName}>{loc.name}</span>
                      <span style={styles.locationCity}>
                        <MapPin style={{ width: 12, height: 12 }} /> {loc.city}
                      </span>
                    </button>
                  );
                })}
              </div>
            ))}
          </div>

          <div style={styles.divider} />

          <h2 style={styles.sectionHeader}>
            <Search style={{ width: 12, height: 12 }} />
            Custom Coordinates
          </h2>

          <div style={styles.form}>
            <div style={styles.inputRow}>
              <input
                type="text"
                placeholder="Lat (e.g. 48.8584)"
                value={customLat}
                onChange={(e) => setCustomLat(e.target.value)}
                onKeyDown={handleInputKeyDown}
                style={styles.input}
              />
              <input
                type="text"
                placeholder="Lng (e.g. 2.2945)"
                value={customLng}
                onChange={(e) => setCustomLng(e.target.value)}
                onKeyDown={handleInputKeyDown}
                style={styles.input}
              />
            </div>
            <button
              onClick={handleCustomSearch}
              style={styles.submitButton}
              {...withHover(styles.submitButton, { backgroundColor: '#3b82f6' })}
            >
              <Navigation style={{ width: 16, height: 16 }} />
              Teleport
            </button>
          </div>

        </div>
      </div>

      {/* Error Message Toast */}
      {errorMsg && (
        <div style={styles.errorToast}>
          <Info style={{ width: 20, height: 20 }} />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Settings Modal Overlay */}
      {showSettings && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalCard}>
            <button
              onClick={() => setShowSettings(false)}
              style={styles.closeButton}
              {...withHover(styles.closeButton, { color: '#fff' })}
            >
              <X style={{ width: 20, height: 20 }} />
            </button>

            <div style={styles.modalHeader}>
              <div style={styles.modalIconWrapper}>
                <Key style={{ width: 24, height: 24, color: '#60a5fa' }} />
              </div>
              <div>
                <h2 style={styles.modalTitle}>API Settings</h2>
                <p style={styles.modalSubtitle}>Manage Google Maps configuration</p>
              </div>
            </div>

            <div style={styles.modalBody}>
              <div>
                <label style={styles.label}>
                  Google Maps API Key
                </label>
                <input
                  type="password"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="AIzaSy..."
                  style={styles.apiInput}
                />
              </div>

              <div style={styles.buttonRow}>
                <button
                  onClick={() => {
                    setActiveKey(apiKey);
                    setShowSettings(false);
                  }}
                  style={styles.saveButton}
                  {...withHover(styles.saveButton, { backgroundColor: '#3b82f6' })}
                >
                  Save & Reload Map
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <style dangerouslySetInnerHTML={{
        __html: `
        @keyframes wwe-spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes wwe-toast-in {
          from { opacity: 0; transform: translate(-50%, -12px); }
          to { opacity: 1; transform: translate(-50%, 0); }
        }
        .wwe-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .wwe-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .wwe-scrollbar::-webkit-scrollbar-thumb {
          background-color: rgba(51, 65, 85, 0.5);
          border-radius: 10px;
        }
        .wwe-scrollbar::-webkit-scrollbar-thumb:hover {
          background-color: rgba(71, 85, 105, 0.8);
        }
      `}} />
    </div>
  );
}