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
  Search,
  Rocket
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
    console.error("Failed to load Google Maps script.");
  };

  document.head.appendChild(script);
};

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
          fullscreenControl: false, // Handled by our layout
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
    .catch((e) => {
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
          setErrorMsg("No Street View imagery found near these coordinates.");
          setTimeout(() => setErrorMsg(''), 4000);
        });
      } else {
        setErrorMsg("No Street View imagery found near these coordinates.");
        // Auto-hide error after 4 seconds
        setTimeout(() => setErrorMsg(''), 4000);
      }
    });
  }, []);

  // Update map when predefined location is selected
  useEffect(() => {
    if (isLoaded) {
      jumpToLocation(currentLocation);
    }
  }, [currentLocation, isLoaded, jumpToLocation]);

  const handleCustomSearch = (e) => {
    e.preventDefault();
    const lat = parseFloat(customLat);
    const lng = parseFloat(customLng);
    
    if (isNaN(lat) || isNaN(lng)) {
      setErrorMsg("Please enter valid numeric coordinates.");
      setTimeout(() => setErrorMsg(''), 4000);
      return;
    }
    
    // Clear predefined selection to highlight custom input
    const customLoc = { id: 'custom', name: 'Custom Location', lat, lng };
    setCurrentLocation(customLoc);
    jumpToLocation(customLoc);
  };

  return (
    <div className="relative w-full h-screen bg-slate-900 overflow-hidden font-sans">
      
      {/* The Google Maps Container */}
      <div 
        ref={mapRef} 
        className="absolute inset-0 z-0 w-full h-full"
        style={{ filter: showSettings ? 'blur(4px)' : 'none', transition: 'filter 0.3s ease' }}
      />

      {/* Loading State Overlay */}
      {!isLoaded && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-slate-900 text-white">
          <div className="flex flex-col items-center gap-4">
            <Compass className="w-12 h-12 animate-spin text-blue-500" />
            <h2 className="text-xl font-semibold tracking-wider">Loading Street View...</h2>
          </div>
        </div>
      )}

      {/* Main UI Overlay - Sidebar */}
      <div className="absolute top-4 left-4 z-10 w-80 max-h-[calc(100vh-2rem)] flex flex-col gap-4">
        
        {/* App Header */}
        <div className="bg-slate-900/80 backdrop-blur-md border border-slate-700/50 rounded-2xl p-4 shadow-2xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-white">
              <Globe className="w-6 h-6 text-blue-400" />
              <h1 className="font-bold text-lg tracking-wide">World Walker</h1>
            </div>
            <button 
              onClick={() => setShowSettings(!showSettings)}
              className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-full transition-colors"
              title="Settings"
            >
              <Settings className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Navigation Panel */}
        <div className="bg-slate-900/80 backdrop-blur-md border border-slate-700/50 rounded-2xl p-4 shadow-2xl flex-1 overflow-y-auto custom-scrollbar">
          
          {}
          <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
            <Map className="w-3 h-3" />
            Global Economic Hubs
          </h2>
          
          <div className="flex flex-col gap-4 mb-6">
            {LOCATION_GROUPS.map((group) => (
              <div key={group.region} className="flex flex-col gap-2">
                <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-wider pl-1">{group.region}</h3>
                {group.locations.map((loc) => (
                  <button
                    key={loc.id}
                    onClick={() => setCurrentLocation(loc)}
                    className={`flex flex-col text-left p-3 rounded-xl transition-all duration-200 border ${
                      currentLocation.id === loc.id 
                        ? 'bg-blue-600/20 border-blue-500/50 text-white shadow-[0_0_15px_rgba(59,130,246,0.15)]' 
                        : 'bg-slate-800/50 border-transparent text-slate-300 hover:bg-slate-700/50'
                    }`}
                  >
                    <span className="font-semibold">{loc.name}</span>
                    <span className="text-xs opacity-70 flex items-center gap-1 mt-1">
                      <MapPin className="w-3 h-3" /> {loc.city}
                    </span>
                  </button>
                ))}
              </div>
            ))}
          </div>

          <div className="h-px w-full bg-slate-700/50 my-4" />

          <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
            <Search className="w-3 h-3" />
            Custom Coordinates
          </h2>
          
          <form onSubmit={handleCustomSearch} className="flex flex-col gap-3">
            <div className="flex gap-2">
              <input 
                type="text" 
                placeholder="Lat (e.g. 48.8584)" 
                value={customLat}
                onChange={(e) => setCustomLat(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500 transition-colors"
              />
              <input 
                type="text" 
                placeholder="Lng (e.g. 2.2945)" 
                value={customLng}
                onChange={(e) => setCustomLng(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500 transition-colors"
              />
            </div>
            <button 
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold py-2 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors"
            >
              <Navigation className="w-4 h-4" />
              Teleport
            </button>
          </form>

        </div>
      </div>

      {/* Error Message Toast */}
      {errorMsg && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-50 bg-red-500/90 backdrop-blur-md text-white px-6 py-3 rounded-xl shadow-2xl border border-red-400 flex items-center gap-3 animate-in slide-in-from-top-4 fade-in duration-300">
          <Info className="w-5 h-5" />
          <span className="font-medium">{errorMsg}</span>
        </div>
      )}

      {/* Settings Modal Overlay */}
      {showSettings && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-md p-6 shadow-2xl relative">
            <button 
              onClick={() => setShowSettings(false)}
              className="absolute top-4 right-4 p-1 text-slate-400 hover:text-white bg-slate-800 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            
            <div className="flex items-center gap-3 mb-6 text-white">
              <div className="p-3 bg-blue-500/20 rounded-xl">
                <Key className="w-6 h-6 text-blue-400" />
              </div>
              <div>
                <h2 className="text-xl font-bold">API Settings</h2>
                <p className="text-xs text-slate-400">Manage Google Maps configuration</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4 flex gap-3 text-amber-200/90">
                <Info className="w-5 h-5 shrink-0 mt-0.5" />
                <p className="text-sm leading-relaxed">
                  The app runs in <strong>Development Mode</strong> by default. This fully allows you to walk around, but displays a faint "For development purposes only" watermark. To remove it, enter your free Google Maps JavaScript API key below.
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Google Maps API Key
                </label>
                <input 
                  type="password"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="AIzaSy..."
                  className="w-full bg-slate-800 border border-slate-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-mono text-sm"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button 
                  onClick={() => {
                    setActiveKey(apiKey);
                    setShowSettings(false);
                  }}
                  className="flex-1 bg-blue-600 hover:bg-blue-500 text-white font-semibold py-2.5 px-4 rounded-xl transition-colors"
                >
                  Save & Reload Map
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <style dangerouslySetInnerHTML={{__html: `
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: rgba(51, 65, 85, 0.5);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background-color: rgba(71, 85, 105, 0.8);
        }
      `}} />
    </div>
  );
}