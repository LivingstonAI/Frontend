import React, { useEffect, useState } from "react";
import Globe from 'react-globe.gl';
import { ComposableMap, Geographies, Geography, Marker } from "react-simple-maps";
import Header from "./header";
import SideNavs from "./side_navs";

const geoUrl = "https://raw.githubusercontent.com/deldersveld/topojson/master/world-atlas-110m/world-110m.json";

export default function SnowAIEarth() {
    const [view3D, setView3D] = useState(false);
    const [selectedCountry, setSelectedCountry] = useState('');
    const [countries, setCountries] = useState([]);
    const [worldData, setWorldData] = useState({ features: [] });
    const [globeTheme, setGlobeTheme] = useState('blue-marble');
    const [isMobile, setIsMobile] = useState(false);

    // Globe theme configurations
    const globeThemes = {
        'blue-marble': {
            name: 'Blue Marble',
            globeImage: "//unpkg.com/three-globe/example/img/earth-blue-marble.jpg",
            bumpImage: "//unpkg.com/three-globe/example/img/earth-topology.png",
            background: "//unpkg.com/three-globe/example/img/night-sky.png"
        },
        'night-lights': {
            name: 'Night Lights',
            globeImage: "//unpkg.com/three-globe/example/img/earth-night.jpg",
            bumpImage: "//unpkg.com/three-globe/example/img/earth-topology.png",
            background: "//unpkg.com/three-globe/example/img/night-sky.png"
        },
        'natural-earth': {
            name: 'Natural Earth',
            globeImage: "//unpkg.com/three-globe/example/img/earth-day.jpg",
            bumpImage: "//unpkg.com/three-globe/example/img/earth-topology.png",
            background: "//unpkg.com/three-globe/example/img/night-sky.png"
        },
        'dark': {
            name: 'Dark Theme',
            globeImage: null,
            bumpImage: null,
            background: null
        }
    };
    
    // Sample country data with coordinates
    const countryData = [
        { name: 'United States', lat: 39.8283, lng: -98.5795, color: '#ff6b6b', iso: 'US' },
        { name: 'Canada', lat: 56.1304, lng: -106.3468, color: '#4ecdc4', iso: 'CA' },
        { name: 'Brazil', lat: -14.2350, lng: -51.9253, color: '#45b7d1', iso: 'BR' },
        { name: 'Russia', lat: 61.5240, lng: 105.3188, color: '#96ceb4', iso: 'RU' },
        { name: 'China', lat: 35.8617, lng: 104.1954, color: '#ffeaa7', iso: 'CN' },
        { name: 'India', lat: 20.5937, lng: 78.9629, color: '#fab1a0', iso: 'IN' },
        { name: 'Australia', lat: -25.2744, lng: 133.7751, color: '#fd79a8', iso: 'AU' },
        { name: 'United Kingdom', lat: 55.3781, lng: -3.4360, color: '#6c5ce7', iso: 'GB' },
        { name: 'France', lat: 46.2276, lng: 2.2137, color: '#a29bfe', iso: 'FR' },
        { name: 'Germany', lat: 51.1657, lng: 10.4515, color: '#74b9ff', iso: 'DE' },
        { name: 'Japan', lat: 36.2048, lng: 138.2529, color: '#00b894', iso: 'JP' },
        { name: 'South Africa', lat: -30.5595, lng: 22.9375, color: '#e17055', iso: 'ZA' },
        { name: 'Egypt', lat: 26.0975, lng: 31.4789, color: '#fdcb6e', iso: 'EG' },
        { name: 'Mexico', lat: 23.6345, lng: -102.5528, color: '#e84393', iso: 'MX' },
        { name: 'Argentina', lat: -38.4161, lng: -63.6167, color: '#00cec9', iso: 'AR' }
    ];

    useEffect(() => {
        setCountries(countryData);
        
        // Check if mobile
        const checkMobile = () => {
            setIsMobile(window.innerWidth <= 768);
        };
        
        checkMobile();
        window.addEventListener('resize', checkMobile);
        
        // Load world topology data for the globe
        fetch('https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson')
            .then(res => res.json())
            .then(data => {
                setWorldData(data);
            })
            .catch(err => {
                console.log('Error loading world data:', err);
                setWorldData({ features: [] });
            });
            
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    const handleCountryClick = (country) => {
        setSelectedCountry(country.name);
        setTimeout(() => setSelectedCountry(''), 3000);
    };

    const handlePolygonClick = (polygon) => {
        const countryName = polygon.properties.NAME || polygon.properties.name || 'Unknown Country';
        setSelectedCountry(countryName);
        setTimeout(() => setSelectedCountry(''), 3000);
    };

    const handleGeographyClick = (geo) => {
        const countryName = geo.properties.NAME || geo.properties.name || 'Unknown Country';
        setSelectedCountry(countryName);
        setTimeout(() => setSelectedCountry(''), 3000);
    };

    const styles = {
        
        mainBodyInfo: {
            flex: 1,
            padding: isMobile ? '10px' : '20px',
            backgroundColor: '#f8f9fa',
            position: 'relative',
            overflow: 'hidden'
        },
        majorUpcomingNewsEventsHeader: {
            fontSize: isMobile ? '1.8rem' : '2.5rem',
            fontWeight: 'bold',
            color: '#2c3e50',
            marginBottom: '20px',
            textAlign: 'center'
        },
        controlsContainer: {
            display: 'flex',
            flexDirection: isMobile ? 'column' : 'row',
            justifyContent: 'center',
            alignItems: 'center',
            marginBottom: '20px',
            gap: '15px',
            flexWrap: 'wrap'
        },
        toggleContainer: {
            display: 'flex',
            gap: '10px'
        },
        themeContainer: {
            display: 'flex',
            gap: '5px',
            alignItems: 'center'
        },
        toggleButton: {
            padding: isMobile ? '10px 16px' : '12px 24px',
            border: 'none',
            borderRadius: '25px',
            fontSize: isMobile ? '14px' : '16px',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
            whiteSpace: 'nowrap'
        },
        themeButton: {
            padding: '8px 12px',
            border: 'none',
            borderRadius: '20px',
            fontSize: '12px',
            fontWeight: '500',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            whiteSpace: 'nowrap'
        },
        activeButton: {
            backgroundColor: '#3498db',
            color: 'white',
            transform: 'translateY(-2px)',
            boxShadow: '0 6px 20px rgba(52, 152, 219, 0.3)'
        },
        inactiveButton: {
            backgroundColor: 'white',
            color: '#7f8c8d',
            border: '2px solid #ecf0f1'
        },
        viewContainer: {
            width: '100%',
            height: `calc(100vh - ${isMobile ? '280px' : '200px'})`,
            position: 'relative',
            borderRadius: '15px',
            overflow: 'hidden',
            boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
        },
        countryLabel: {
            position: 'absolute',
            top: '20px',
            left: '50%',
            transform: 'translateX(-50%)',
            backgroundColor: 'rgba(0,0,0,0.8)',
            color: 'white',
            padding: '10px 20px',
            borderRadius: '25px',
            fontSize: isMobile ? '14px' : '18px',
            fontWeight: 'bold',
            zIndex: 1000,
            boxShadow: '0 4px 15px rgba(0,0,0,0.3)'
        },
        mapContainer: {
            width: '100%',
            height: '100%',
            backgroundColor: '#e8f4fd'
        }
    };

    const getGlobeSize = () => {
        if (isMobile) {
            return {
                width: Math.min(window.innerWidth - 40, 400),
                height: Math.min(window.innerHeight * 0.5, 400)
            };
        }
        const containerWidth = window.innerWidth * 0.6; // Account for sidebar
        const containerHeight = window.innerHeight * 0.6;
        return {
            width: Math.min(containerWidth, containerHeight),
            height: Math.min(containerWidth, containerHeight)
        };
    };

    const ReactSimpleMap = () => {
        return (
            <div style={styles.mapContainer}>
                <ComposableMap
                    projection="geoMercator"
                    style={{ width: '100%', height: '100%' }}
                >
                    <Geographies geography={geoUrl}>
                        {({ geographies }) =>
                            geographies.map((geo) => (
                                <Geography
                                    key={geo.rsmKey}
                                    geography={geo}
                                    onClick={() => handleGeographyClick(geo)}
                                    style={{
                                        default: {
                                            fill: selectedCountry === (geo.properties.NAME || geo.properties.name) 
                                                ? "#ff6b6b" 
                                                : "#f1faee",
                                            stroke: "#457b9d",
                                            strokeWidth: 0.5,
                                            outline: "none",
                                        },
                                        hover: {
                                            fill: "#74b9ff",
                                            stroke: "#457b9d",
                                            strokeWidth: 1,
                                            outline: "none",
                                        },
                                        pressed: {
                                            fill: "#ff6b6b",
                                            stroke: "#457b9d",
                                            strokeWidth: 1,
                                            outline: "none",
                                        }
                                    }}
                                />
                            ))
                        }
                    </Geographies>
                    
                    {countries.map((country, index) => (
                        <Marker
                            key={index}
                            coordinates={[country.lng, country.lat]}
                            onClick={() => handleCountryClick(country)}
                        >
                            <circle
                                r={isMobile ? 3 : 4}
                                fill={country.color}
                                stroke="#fff"
                                strokeWidth={2}
                                style={{ cursor: 'pointer' }}
                            />
                        </Marker>
                    ))}
                </ComposableMap>
            </div>
        );
    };

    const currentTheme = globeThemes[globeTheme];
    const globeSize = getGlobeSize();

    return (
        <div style={styles.container}>
            <div style={styles.header}>
                <Header />
            </div>
            <div style={styles.mainPageBody}>
                {!isMobile && <SideNavs />}
                <div style={styles.mainBodyInfo}>
                    <h5 style={styles.majorUpcomingNewsEventsHeader}>SnowAI Earth</h5>
                    
                    <div style={styles.controlsContainer}>
                        <div style={styles.toggleContainer}>
                            <button
                                style={{
                                    ...styles.toggleButton,
                                    ...(view3D ? styles.inactiveButton : styles.activeButton)
                                }}
                                onClick={() => setView3D(false)}
                            >
                                2D Map
                            </button>
                            <button
                                style={{
                                    ...styles.toggleButton,
                                    ...(view3D ? styles.activeButton : styles.inactiveButton)
                                }}
                                onClick={() => setView3D(true)}
                            >
                                3D Globe
                            </button>
                        </div>
                        
                        {view3D && (
                            <div style={styles.themeContainer}>
                                <span style={{ fontSize: '14px', color: '#7f8c8d', marginRight: '5px' }}>Theme:</span>
                                {Object.entries(globeThemes).map(([key, theme]) => (
                                    <button
                                        key={key}
                                        style={{
                                            ...styles.themeButton,
                                            ...(globeTheme === key ? styles.activeButton : styles.inactiveButton)
                                        }}
                                        onClick={() => setGlobeTheme(key)}
                                    >
                                        {theme.name}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {selectedCountry && (
                        <div style={styles.countryLabel}>
                            {selectedCountry}
                        </div>
                    )}

                    <div style={styles.viewContainer}>
                        {view3D ? (
                            <Globe
                                globeImageUrl={currentTheme.globeImage}
                                bumpImageUrl={currentTheme.bumpImage}
                                backgroundImageUrl={currentTheme.background}
                                
                                // Polygons (countries)
                                polygonsData={worldData.features}
                                polygonAltitude={0.01}
                                polygonCapColor={() => 'rgba(200, 0, 0, 0.6)'}
                                polygonSideColor={() => 'rgba(0, 100, 0, 0.05)'}
                                polygonStrokeColor={() => '#111'}
                                polygonLabel={({ properties }) => `
                                    <b>${properties.NAME || properties.name || 'Unknown'}</b>
                                `}
                                onPolygonClick={handlePolygonClick}
                                
                                // Points (markers for countries)
                                pointsData={countries}
                                pointAltitude={0.02}
                                pointColor={d => d.color}
                                pointRadius={isMobile ? 0.2 : 0.3}
                                pointLabel={d => `<b>${d.name}</b>`}
                                onPointClick={handleCountryClick}
                                
                                // Globe properties
                                showAtmosphere={true}
                                atmosphereColor="lightskyblue"
                                atmosphereAltitude={0.1}
                                
                                // Controls
                                enablePointerInteraction={true}
                                
                                // Animation
                                animateIn={true}
                                
                                width={globeSize.width}
                                height={globeSize.height}
                            />
                        ) : (
                            <ReactSimpleMap />
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}