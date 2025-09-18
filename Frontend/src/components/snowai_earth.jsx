import React, { useEffect, useState, useRef } from "react";
import Globe from 'react-globe.gl';
import * as d3 from 'd3';
import Header from "./header";
import SideNavs from "./side_navs";

const geoUrl = "https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson";

export default function SnowAIEarth() {
    const [view3D, setView3D] = useState(true); // Start with 3D view
    const [selectedCountry, setSelectedCountry] = useState('');
    const [hoveredCountry, setHoveredCountry] = useState('');
    const [countries, setCountries] = useState([]);
    const [worldData, setWorldData] = useState({ features: [] });
    const [globeTheme, setGlobeTheme] = useState('blue-marble');
    const [isMobile, setIsMobile] = useState(false);
    const [geoJsonData, setGeoJsonData] = useState(null);
    const [zoomTransform, setZoomTransform] = useState(d3.zoomIdentity);
    const svgRef = useRef();
    const globeRef = useRef();
    const zoomRef = useRef();

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
        
        // Load GeoJSON data for both globe and D3 map
        fetch(geoUrl)
            .then(res => res.json())
            .then(data => {
                console.log('Loaded GeoJSON data:', data);
                setGeoJsonData(data);
                setWorldData(data);
            })
            .catch(err => {
                console.error('Error loading world data:', err);
                // Fallback to empty data
                setWorldData({ features: [] });
                setGeoJsonData({ features: [] });
            });
            
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    // D3 Map Effect - Only redraw when view changes, data loads, or mobile state changes
    useEffect(() => {
        if (!view3D && geoJsonData && svgRef.current) {
            // Add a small delay to ensure the container has proper dimensions
            const timer = setTimeout(() => {
                drawD3Map();
            }, 100);
            return () => clearTimeout(timer);
        }
    }, [view3D, geoJsonData, isMobile]);

    // Separate effect for updating country colors without full redraw
    useEffect(() => {
        if (!view3D && svgRef.current && geoJsonData) {
            updateCountryColors();
        }
    }, [selectedCountry, view3D]);

    const drawD3Map = () => {
        if (!geoJsonData || !geoJsonData.features || !svgRef.current) return;

        const svg = d3.select(svgRef.current);
        svg.selectAll("*").remove(); // Clear previous content

        const container = svg.node().parentElement;
        if (!container) return;
        
        const width = container.clientWidth;
        const height = container.clientHeight;

        if (width === 0 || height === 0) return; // Don't draw if container has no size

        svg.attr("width", width).attr("height", height);

        // Create zoom behavior
        const zoom = d3.zoom()
            .scaleExtent([0.5, 8])
            .on("zoom", (event) => {
                setZoomTransform(event.transform);
                g.attr("transform", event.transform);
            });

        zoomRef.current = zoom;
        svg.call(zoom);

        // Create main group for all elements
        const g = svg.append("g");

        // Create projection
        const projection = d3.geoNaturalEarth1()
            .scale(isMobile ? width / 7 : width / 6.5)
            .translate([width / 2, height / 2]);

        const path = d3.geoPath().projection(projection);

        // Add countries
        const countries = g.append("g")
            .attr("class", "countries")
            .selectAll("path")
            .data(geoJsonData.features)
            .enter()
            .append("path")
            .attr("d", path)
            .attr("fill", d => {
                const countryName = d.properties?.NAME || d.properties?.name;
                return selectedCountry === countryName ? "#ff6b6b" : "#f1faee";
            })
            .attr("stroke", "#457b9d")
            .attr("stroke-width", 0.5)
            .style("cursor", "pointer")
            .on("mouseover", function(event, d) {
                const countryName = d.properties?.NAME || d.properties?.name || 'Unknown Country';
                setHoveredCountry(countryName);
                d3.select(this)
                    .attr("fill", "#74b9ff")
                    .attr("stroke-width", 1);
            })
            .on("mouseout", function(event, d) {
                setHoveredCountry('');
                const countryName = d.properties?.NAME || d.properties?.name;
                d3.select(this)
                    .attr("fill", selectedCountry === countryName ? "#ff6b6b" : "#f1faee")
                    .attr("stroke-width", 0.5);
            })
            .on("click", function(event, d) {
                const countryName = d.properties?.NAME || d.properties?.name || 'Unknown Country';
                handleCountryClick({ name: countryName });
            });

        // Add markers for sample countries
        const markers = g.append("g")
            .attr("class", "markers")
            .selectAll("circle")
            .data(countryData)
            .enter()
            .append("circle")
            .attr("cx", d => {
                const coords = projection([d.lng, d.lat]);
                return coords ? coords[0] : 0;
            })
            .attr("cy", d => {
                const coords = projection([d.lng, d.lat]);
                return coords ? coords[1] : 0;
            })
            .attr("r", isMobile ? 3 : 4)
            .attr("fill", d => d.color)
            .attr("stroke", "#fff")
            .attr("stroke-width", 2)
            .style("cursor", "pointer")
            .on("click", function(event, d) {
                handleCountryClick(d);
            })
            .append("title")
            .text(d => d.name);
    };

    const updateCountryColors = () => {
        if (!svgRef.current) return;
        
        const svg = d3.select(svgRef.current);
        const countriesGroup = svg.select(".countries");
        
        if (countriesGroup.empty()) return;
        
        countriesGroup
            .selectAll("path")
            .attr("fill", function(d) {
                const countryName = d.properties?.NAME || d.properties?.name;
                return selectedCountry === countryName ? "#ff6b6b" : "#f1faee";
            });
    };

    const handleCountryClick = (country) => {
        const countryName = typeof country === 'string' ? country : country.name;
        setSelectedCountry(prevSelected => {
            // Toggle selection - if clicking same country, deselect it
            return prevSelected === countryName ? '' : countryName;
        });
        console.log('Selected country:', countryName);
        // Remove the automatic timeout clearing
    };

    const handlePolygonClick = (polygon) => {
        const countryName = polygon.properties?.NAME || polygon.properties?.name || 'Unknown Country';
        console.log('Polygon clicked:', countryName, polygon.properties);
        handleCountryClick(countryName);
    };

    const handlePolygonHover = (polygon) => {
        if (polygon && polygon.properties) {
            const countryName = polygon.properties.NAME || polygon.properties.name || 'Unknown Country';
            // You could set a hover state here if needed
        }
    };

    const resetZoom = () => {
        if (zoomRef.current && svgRef.current) {
            d3.select(svgRef.current)
                .transition()
                .duration(750)
                .call(zoomRef.current.transform, d3.zoomIdentity);
        }
    };

    const clearSelection = () => {
        setSelectedCountry('');
    };

    const styles = {
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
            alignItems: 'center',
            flexWrap: 'wrap'
        },
        mapControlsContainer: {
            display: 'flex',
            gap: '10px',
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
            padding: '6px 12px',
            border: 'none',
            borderRadius: '20px',
            fontSize: '12px',
            fontWeight: '500',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            whiteSpace: 'nowrap',
            margin: '2px'
        },
        controlButton: {
            padding: '8px 16px',
            border: 'none',
            borderRadius: '20px',
            fontSize: '14px',
            fontWeight: '500',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            backgroundColor: '#f8f9fa',
            color: '#495057',
            border: '1px solid #dee2e6'
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
            height: `calc(100vh - ${isMobile ? '300px' : '220px'})`,
            position: 'relative',
            borderRadius: '15px',
            overflow: 'hidden',
            boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: view3D ? '#000' : '#e8f4fd'
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
            backgroundColor: '#e8f4fd',
            position: 'relative'
        },
        svgMap: {
            width: '100%',
            height: '100%',
            cursor: 'grab'
        },
        zoomControls: {
            position: 'absolute',
            top: '20px',
            right: '20px',
            display: 'flex',
            flexDirection: 'column',
            gap: '5px',
            zIndex: 1000
        },
        zoomButton: {
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            border: 'none',
            backgroundColor: 'rgba(255,255,255,0.9)',
            color: '#333',
            fontSize: '18px',
            fontWeight: 'bold',
            cursor: 'pointer',
            boxShadow: '0 2px 10px rgba(0,0,0,0.2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.2s ease'
        }
    };

    const getGlobeSize = () => {
        const baseSize = isMobile ? 
            Math.min(window.innerWidth - 40, 400) : 
            Math.min(window.innerWidth * 0.4, window.innerHeight * 0.5, 600);
        
        return {
            width: baseSize,
            height: baseSize
        };
    };

    const D3Map = () => {
        return (
            <div style={styles.mapContainer}>
                <svg 
                    ref={svgRef} 
                    style={styles.svgMap}
                    onMouseDown={() => {
                        if (svgRef.current) {
                            svgRef.current.style.cursor = 'grabbing';
                        }
                    }}
                    onMouseUp={() => {
                        if (svgRef.current) {
                            svgRef.current.style.cursor = 'grab';
                        }
                    }}
                ></svg>
                <div style={styles.zoomControls}>
                    <button
                        style={styles.zoomButton}
                        onClick={() => {
                            if (zoomRef.current && svgRef.current) {
                                d3.select(svgRef.current).transition().call(
                                    zoomRef.current.scaleBy, 1.5
                                );
                            }
                        }}
                        onMouseEnter={(e) => e.target.style.backgroundColor = 'white'}
                        onMouseLeave={(e) => e.target.style.backgroundColor = 'rgba(255,255,255,0.9)'}
                    >
                        +
                    </button>
                    <button
                        style={styles.zoomButton}
                        onClick={() => {
                            if (zoomRef.current && svgRef.current) {
                                d3.select(svgRef.current).transition().call(
                                    zoomRef.current.scaleBy, 1 / 1.5
                                );
                            }
                        }}
                        onMouseEnter={(e) => e.target.style.backgroundColor = 'white'}
                        onMouseLeave={(e) => e.target.style.backgroundColor = 'rgba(255,255,255,0.9)'}
                    >
                        −
                    </button>
                    <button
                        style={{...styles.zoomButton, fontSize: '12px', width: '50px'}}
                        onClick={resetZoom}
                        onMouseEnter={(e) => e.target.style.backgroundColor = 'white'}
                        onMouseLeave={(e) => e.target.style.backgroundColor = 'rgba(255,255,255,0.9)'}
                    >
                        Reset
                    </button>
                </div>
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
                <SideNavs />
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
                        
                        {view3D ? (
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
                        ) : (
                            <div style={styles.mapControlsContainer}>
                                <span style={{ fontSize: '14px', color: '#7f8c8d' }}>Map Controls:</span>
                                <button
                                    style={styles.controlButton}
                                    onClick={resetZoom}
                                >
                                    Reset Zoom
                                </button>
                                {selectedCountry && (
                                    <button
                                        style={styles.controlButton}
                                        onClick={clearSelection}
                                    >
                                        Clear Selection
                                    </button>
                                )}
                            </div>
                        )}
                    </div>

                    {(selectedCountry || hoveredCountry) && (
                        <div style={styles.countryLabel}>
                            {selectedCountry || hoveredCountry}
                        </div>
                    )}

                    <div style={styles.viewContainer}>
                        {view3D ? (
                            <Globe
                                ref={globeRef}
                                globeImageUrl={currentTheme.globeImage}
                                bumpImageUrl={currentTheme.bumpImage}
                                backgroundImageUrl={currentTheme.background}
                                
                                // Countries/Polygons with borders
                                polygonsData={worldData.features || []}
                                polygonAltitude={0.006}
                                polygonCapColor={() => 'rgba(50, 50, 50, 0.1)'}
                                polygonSideColor={() => 'rgba(50, 50, 50, 0.05)'}
                                polygonStrokeColor={() => '#ffffff'}
                                polygonLabel={({ properties }) => `
                                    <div style="
                                        background: rgba(0,0,0,0.8);
                                        color: white;
                                        padding: 8px 12px;
                                        border-radius: 6px;
                                        font-size: 14px;
                                        font-weight: bold;
                                        max-width: 200px;
                                    ">
                                        ${properties?.NAME || properties?.name || 'Unknown Country'}
                                    </div>
                                `}
                                onPolygonClick={handlePolygonClick}
                                onPolygonHover={handlePolygonHover}
                                
                                // Points (markers for sample countries)
                                pointsData={countries}
                                pointAltitude={0.01}
                                pointColor={d => d.color}
                                pointRadius={isMobile ? 0.15 : 0.25}
                                pointLabel={d => `
                                    <div style="
                                        background: rgba(0,0,0,0.8);
                                        color: white;
                                        padding: 8px 12px;
                                        border-radius: 6px;
                                        font-size: 14px;
                                        font-weight: bold;
                                    ">
                                        ${d.name}
                                    </div>
                                `}
                                onPointClick={handleCountryClick}
                                
                                // Globe properties
                                showAtmosphere={true}
                                atmosphereColor="lightblue"
                                atmosphereAltitude={0.15}
                                
                                // Controls
                                enablePointerInteraction={true}
                                
                                // Animation
                                animateIn={true}
                                
                                // Size
                                width={globeSize.width}
                                height={globeSize.height}
                            />
                        ) : (
                            <D3Map />
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}