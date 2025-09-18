import React, { useEffect, useState } from "react";
import Globe from 'react-globe.gl';
import Header from "./header";
import SideNavs from "./side_navs";
import Cookies from 'js-cookie';

export default function SnowAIEarth() {
    const baseUrl = 'https://backend-production-c0ab.up.railway.app';
    const [view3D, setView3D] = useState(false);
    const [selectedCountry, setSelectedCountry] = useState('');
    const [countries, setCountries] = useState([]);
    const [worldData, setWorldData] = useState({ features: [] });

    
    // Sample country data with coordinates
    const countryData = [
        { 
            name: 'United States', 
            lat: 39.8283, 
            lng: -98.5795,
            color: '#ff6b6b',
            iso: 'US'
        },
        { 
            name: 'Canada', 
            lat: 56.1304, 
            lng: -106.3468,
            color: '#4ecdc4',
            iso: 'CA'
        },
        { 
            name: 'Brazil', 
            lat: -14.2350, 
            lng: -51.9253,
            color: '#45b7d1',
            iso: 'BR'
        },
        { 
            name: 'Russia', 
            lat: 61.5240, 
            lng: 105.3188,
            color: '#96ceb4',
            iso: 'RU'
        },
        { 
            name: 'China', 
            lat: 35.8617, 
            lng: 104.1954,
            color: '#ffeaa7',
            iso: 'CN'
        },
        { 
            name: 'India', 
            lat: 20.5937, 
            lng: 78.9629,
            color: '#fab1a0',
            iso: 'IN'
        },
        { 
            name: 'Australia', 
            lat: -25.2744, 
            lng: 133.7751,
            color: '#fd79a8',
            iso: 'AU'
        },
        { 
            name: 'United Kingdom', 
            lat: 55.3781, 
            lng: -3.4360,
            color: '#6c5ce7',
            iso: 'GB'
        },
        { 
            name: 'France', 
            lat: 46.2276, 
            lng: 2.2137,
            color: '#a29bfe',
            iso: 'FR'
        },
        { 
            name: 'Germany', 
            lat: 51.1657, 
            lng: 10.4515,
            color: '#74b9ff',
            iso: 'DE'
        },
        { 
            name: 'Japan', 
            lat: 36.2048, 
            lng: 138.2529,
            color: '#00b894',
            iso: 'JP'
        },
        { 
            name: 'South Africa', 
            lat: -30.5595, 
            lng: 22.9375,
            color: '#e17055',
            iso: 'ZA'
        },
        { 
            name: 'Egypt', 
            lat: 26.0975, 
            lng: 31.4789,
            color: '#fdcb6e',
            iso: 'EG'
        },
        { 
            name: 'Mexico', 
            lat: 23.6345, 
            lng: -102.5528,
            color: '#e84393',
            iso: 'MX'
        },
        { 
            name: 'Argentina', 
            lat: -38.4161, 
            lng: -63.6167,
            color: '#00cec9',
            iso: 'AR'
        }
    ];

    useEffect(() => {
        setCountries(countryData);
        
        // Load world topology data for the globe
        fetch('https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson')
            .then(res => res.json())
            .then(data => {
                setWorldData(data);
            })
            .catch(err => {
                console.log('Error loading world data:', err);
                // Fallback empty data
                setWorldData({ features: [] });
            });
    }, []);

    const handleCountryClick = (country) => {
        setSelectedCountry(country.name);
        setTimeout(() => setSelectedCountry(''), 3000); // Clear after 3 seconds
    };

    const handlePolygonClick = (polygon) => {
        const countryName = polygon.properties.NAME || polygon.properties.name || 'Unknown Country';
        setSelectedCountry(countryName);
        setTimeout(() => setSelectedCountry(''), 3000);
    };

    const styles = {
        container: {
            width: '100%',
            height: '100vh',
            display: 'flex',
            flexDirection: 'column'
        },
        header: {
            zIndex: 1000
        },
        mainPageBody: {
            display: 'flex',
            flex: 1,
            height: 'calc(100vh - 80px)'
        },
        mainBodyInfo: {
            flex: 1,
            padding: '20px',
            backgroundColor: '#f8f9fa',
            position: 'relative'
        },
        majorUpcomingNewsEventsHeader: {
            fontSize: '2.5rem',
            fontWeight: 'bold',
            color: '#2c3e50',
            marginBottom: '20px',
            textAlign: 'center'
        },
        toggleContainer: {
            display: 'flex',
            justifyContent: 'center',
            marginBottom: '20px',
            gap: '10px'
        },
        toggleButton: {
            padding: '12px 24px',
            border: 'none',
            borderRadius: '25px',
            fontSize: '16px',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            boxShadow: '0 4px 15px rgba(0,0,0,0.1)'
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
        globeContainer: {
            width: '100%',
            height: 'calc(100vh - 200px)',
            position: 'relative',
            borderRadius: '15px',
            overflow: 'hidden',
            boxShadow: '0 10px 30px rgba(0,0,0,0.2)'
        },
        mapContainer: {
            width: '100%',
            height: 'calc(100vh - 200px)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: '#e8f4fd',
            borderRadius: '15px',
            boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
            position: 'relative',
            overflow: 'hidden'
        },
        svgMap: {
            width: '90%',
            height: '90%',
            cursor: 'pointer'
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
            fontSize: '18px',
            fontWeight: 'bold',
            zIndex: 1000,
            animation: 'fadeIn 0.3s ease-in',
            boxShadow: '0 4px 15px rgba(0,0,0,0.3)'
        },
        countryDot: {
            fill: '#ff6b6b',
            stroke: '#fff',
            strokeWidth: 2,
            cursor: 'pointer',
            transition: 'all 0.3s ease'
        },
        oceanPath: {
            fill: '#a8dadc',
            stroke: '#457b9d',
            strokeWidth: 0.5
        },
        countryPath: {
            fill: '#f1faee',
            stroke: '#457b9d',
            strokeWidth: 0.5,
            cursor: 'pointer',
            transition: 'all 0.3s ease'
        }
    };

    const Simple2DMap = () => {
        return (
            <div style={styles.mapContainer}>
                <svg style={styles.svgMap} viewBox="0 0 1000 500">
                    {/* Simplified world map paths */}
                    <rect width="1000" height="500" fill="#a8dadc" />
                    
                    {/* Simplified country shapes */}
                    <path 
                        d="M 150 150 L 300 150 L 300 250 L 150 250 Z" 
                        style={{...styles.countryPath, fill: selectedCountry === 'United States' ? '#ff6b6b' : '#f1faee'}}
                        onClick={() => handleCountryClick({name: 'United States'})}
                    />
                    <path 
                        d="M 100 100 L 350 100 L 350 140 L 100 140 Z" 
                        style={{...styles.countryPath, fill: selectedCountry === 'Canada' ? '#4ecdc4' : '#f1faee'}}
                        onClick={() => handleCountryClick({name: 'Canada'})}
                    />
                    <path 
                        d="M 200 300 L 280 300 L 280 400 L 200 400 Z" 
                        style={{...styles.countryPath, fill: selectedCountry === 'Brazil' ? '#45b7d1' : '#f1faee'}}
                        onClick={() => handleCountryClick({name: 'Brazil'})}
                    />
                    <path 
                        d="M 500 80 L 750 80 L 750 180 L 500 180 Z" 
                        style={{...styles.countryPath, fill: selectedCountry === 'Russia' ? '#96ceb4' : '#f1faee'}}
                        onClick={() => handleCountryClick({name: 'Russia'})}
                    />
                    <path 
                        d="M 650 200 L 750 200 L 750 280 L 650 280 Z" 
                        style={{...styles.countryPath, fill: selectedCountry === 'China' ? '#ffeaa7' : '#f1faee'}}
                        onClick={() => handleCountryClick({name: 'China'})}
                    />
                    <path 
                        d="M 600 280 L 680 280 L 680 320 L 600 320 Z" 
                        style={{...styles.countryPath, fill: selectedCountry === 'India' ? '#fab1a0' : '#f1faee'}}
                        onClick={() => handleCountryClick({name: 'India'})}
                    />
                    <path 
                        d="M 800 350 L 900 350 L 900 420 L 800 420 Z" 
                        style={{...styles.countryPath, fill: selectedCountry === 'Australia' ? '#fd79a8' : '#f1faee'}}
                        onClick={() => handleCountryClick({name: 'Australia'})}
                    />
                    <path 
                        d="M 450 170 L 480 170 L 480 200 L 450 200 Z" 
                        style={{...styles.countryPath, fill: selectedCountry === 'United Kingdom' ? '#6c5ce7' : '#f1faee'}}
                        onClick={() => handleCountryClick({name: 'United Kingdom'})}
                    />
                    <path 
                        d="M 480 200 L 520 200 L 520 240 L 480 240 Z" 
                        style={{...styles.countryPath, fill: selectedCountry === 'France' ? '#a29bfe' : '#f1faee'}}
                        onClick={() => handleCountryClick({name: 'France'})}
                    />
                    <path 
                        d="M 520 180 L 560 180 L 560 220 L 520 220 Z" 
                        style={{...styles.countryPath, fill: selectedCountry === 'Germany' ? '#74b9ff' : '#f1faee'}}
                        onClick={() => handleCountryClick({name: 'Germany'})}
                    />
                    <path 
                        d="M 820 240 L 860 240 L 860 280 L 820 280 Z" 
                        style={{...styles.countryPath, fill: selectedCountry === 'Japan' ? '#00b894' : '#f1faee'}}
                        onClick={() => handleCountryClick({name: 'Japan'})}
                    />
                    <path 
                        d="M 550 360 L 590 360 L 590 400 L 550 400 Z" 
                        style={{...styles.countryPath, fill: selectedCountry === 'South Africa' ? '#e17055' : '#f1faee'}}
                        onClick={() => handleCountryClick({name: 'South Africa'})}
                    />
                    
                    {/* Country labels */}
                    {countries.map((country, index) => (
                        <g key={index}>
                            <circle
                                cx={country.lng * 4 + 400}
                                cy={400 - country.lat * 4}
                                r="4"
                                style={styles.countryDot}
                                onClick={() => handleCountryClick(country)}
                                onMouseEnter={(e) => {
                                    e.target.style.r = '6';
                                    e.target.style.fill = country.color;
                                }}
                                onMouseLeave={(e) => {
                                    e.target.style.r = '4';
                                    e.target.style.fill = '#ff6b6b';
                                }}
                            />
                        </g>
                    ))}
                </svg>
                
                {selectedCountry && (
                    <div style={styles.countryLabel}>
                        {selectedCountry}
                    </div>
                )}
            </div>
        );
    };

    return (
        <div style={styles.container}>
            <div style={styles.header}>
                <Header />
            </div>
            <div style={styles.mainPageBody}>
                <SideNavs />
                <div style={styles.mainBodyInfo}>
                    <h5 style={styles.majorUpcomingNewsEventsHeader}>SnowAI Earth</h5>
                    
                    <div style={styles.toggleContainer}>
                        <button
                            style={{
                                ...styles.toggleButton,
                                ...(view3D ? styles.inactiveButton : styles.activeButton)
                            }}
                            onClick={() => setView3D(false)}
                        >
                            2D Map View
                        </button>
                        <button
                            style={{
                                ...styles.toggleButton,
                                ...(view3D ? styles.activeButton : styles.inactiveButton)
                            }}
                            onClick={() => setView3D(true)}
                        >
                            3D Globe View
                        </button>
                    </div>

                    {selectedCountry && (
                        <div style={styles.countryLabel}>
                            {selectedCountry}
                        </div>
                    )}

                    {view3D ? (
                        <div style={styles.globeContainer}>
                            <Globe
                                globeImageUrl="//unpkg.com/three-globe/example/img/earth-blue-marble.jpg"
                                bumpImageUrl="//unpkg.com/three-globe/example/img/earth-topology.png"
                                backgroundImageUrl="//unpkg.com/three-globe/example/img/night-sky.png"
                                
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
                                pointRadius={0.3}
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
                                
                                width={window.innerWidth * 0.7}
                                height={window.innerHeight * 0.7}
                            />
                        </div>
                    ) : (
                        <Simple2DMap />
                    )}
                </div>
            </div>
        </div>
    );
}

// npm i react-globe.gl