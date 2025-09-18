import React, { useEffect, useState, useRef } from "react";
import Globe from 'react-globe.gl';
import * as d3 from 'd3';
import Header from "./header";
import SideNavs from "./side_navs";

const geoUrl = "https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson";

export default function SnowAIEarth() {
    const baseUrl = 'https://backend-production-c0ab.up.railway.app';
    const [view3D, setView3D] = useState(true);
    const [selectedCountry, setSelectedCountry] = useState('');
    const [countries, setCountries] = useState([]);
    const [worldData, setWorldData] = useState({ features: [] });
    const [globeTheme, setGlobeTheme] = useState('blue-marble');
    const [isMobile, setIsMobile] = useState(false);
    const [geoJsonData, setGeoJsonData] = useState(null);
    const [showConfirmationModal, setShowConfirmationModal] = useState(false);
    const [economicAnalysis, setEconomicAnalysis] = useState({});
    const [loadingAnalysis, setLoadingAnalysis] = useState(false);
    const [clickedCountry, setClickedCountry] = useState('');
    const svgRef = useRef();
    const globeRef = useRef();

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
        
        const checkMobile = () => {
            setIsMobile(window.innerWidth <= 768);
        };
        
        checkMobile();
        window.addEventListener('resize', checkMobile);
        
        fetch(geoUrl)
            .then(res => res.json())
            .then(data => {
                setGeoJsonData(data);
                setWorldData(data);
            })
            .catch(err => {
                console.error('Error loading world data:', err);
                setWorldData({ features: [] });
                setGeoJsonData({ features: [] });
            });
            
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    useEffect(() => {
        if (!view3D && geoJsonData && svgRef.current) {
            drawD3Map();
        }
    }, [view3D, geoJsonData, isMobile, selectedCountry]);

    const fetchEconomicData = async (countryName) => {
        setLoadingAnalysis(true);
        try {
            const response = await fetch(`${baseUrl}/api/economic-data/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    country_name: countryName
                })
            });

            const data = await response.json();
            
            if (data.success) {
                const analysisData = {
                    ...data,
                    aiAnalysis: JSON.parse(data.ai_analysis)
                };
                
                setEconomicAnalysis(prev => ({
                    ...prev,
                    [countryName]: analysisData
                }));
                
                return analysisData;
            } else {
                console.error('Failed to fetch economic data:', data.error);
                return null;
            }
        } catch (error) {
            console.error('Error fetching economic data:', error);
            return null;
        } finally {
            setLoadingAnalysis(false);
        }
    };

    const handleCountryClick = (country) => {
        const countryName = typeof country === 'string' ? country : country.name;
        setClickedCountry(countryName);
        setSelectedCountry(countryName);
        setShowConfirmationModal(true);
    };

    const handleConfirmAnalysis = async () => {
        setShowConfirmationModal(false);
        
        // Check if we already have analysis for this country
        if (!economicAnalysis[clickedCountry]) {
            await fetchEconomicData(clickedCountry);
        }
    };

    const handleDeclineAnalysis = () => {
        setShowConfirmationModal(false);
        setSelectedCountry('');
        setClickedCountry('');
    };

    const drawD3Map = () => {
        if (!geoJsonData || !geoJsonData.features) return;

        const svg = d3.select(svgRef.current);
        svg.selectAll("*").remove();

        const container = svg.node().parentElement;
        const width = container.clientWidth;
        const height = container.clientHeight;

        svg.attr("width", width).attr("height", height);

        const projection = d3.geoNaturalEarth1()
            .scale(isMobile ? width / 7 : width / 6.5)
            .translate([width / 2, height / 2]);

        const path = d3.geoPath().projection(projection);

        svg.append("g")
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
                d3.select(this)
                    .attr("fill", "#74b9ff")
                    .attr("stroke-width", 1);
            })
            .on("mouseout", function(event, d) {
                const countryName = d.properties?.NAME || d.properties?.name;
                d3.select(this)
                    .attr("fill", selectedCountry === countryName ? "#ff6b6b" : "#f1faee")
                    .attr("stroke-width", 0.5);
            })
            .on("click", function(event, d) {
                const countryName = d.properties?.NAME || d.properties?.name || 'Unknown Country';
                handleCountryClick({ name: countryName });
            });

        svg.append("g")
            .selectAll("circle")
            .data(countries)
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

    const handlePolygonClick = (polygon) => {
        const countryName = polygon.properties?.NAME || polygon.properties?.name || 'Unknown Country';
        handleCountryClick(countryName);
    };

    const renderAnalysisPanel = () => {
        const analysis = economicAnalysis[selectedCountry];
        if (!analysis) return null;

        const aiData = analysis.aiAnalysis;

        return (
            <div style={styles.analysisPanel}>
                <div style={styles.analysisPanelHeader}>
                    <h3 style={styles.analysisPanelTitle}>
                        Economic Analysis: {analysis.country}
                    </h3>
                    <button 
                        style={styles.closeButton}
                        onClick={() => setSelectedCountry('')}
                    >
                        ×
                    </button>
                </div>
                
                <div style={styles.analysisPanelContent}>
                    {analysis.has_data ? (
                        <div>
                            <div style={styles.analysisSection}>
                                <div style={styles.sentimentBadge(aiData.overall_sentiment)}>
                                    {aiData.overall_sentiment.toUpperCase()} SENTIMENT
                                </div>
                            </div>
                            
                            <div style={styles.analysisSection}>
                                <h4 style={styles.sectionTitle}>Summary</h4>
                                <p style={styles.summaryText}>{aiData.summary}</p>
                            </div>
                            
                            <div style={styles.analysisSection}>
                                <h4 style={styles.sectionTitle}>Key Highlights</h4>
                                <ul style={styles.highlightsList}>
                                    {aiData.key_highlights.map((highlight, index) => (
                                        <li key={index} style={styles.highlightItem}>{highlight}</li>
                                    ))}
                                </ul>
                            </div>
                            
                            {aiData.major_events.length > 0 && (
                                <div style={styles.analysisSection}>
                                    <h4 style={styles.sectionTitle}>Major Events</h4>
                                    {aiData.major_events.map((event, index) => (
                                        <div key={index} style={styles.eventItem}>
                                            <div style={styles.eventHeader}>
                                                <span style={styles.eventName}>{event.event_name}</span>
                                                <span style={styles.impactBadge(event.impact_level)}>
                                                    {event.impact_level.toUpperCase()}
                                                </span>
                                            </div>
                                            <p style={styles.eventSummary}>{event.summary}</p>
                                        </div>
                                    ))}
                                </div>
                            )}
                            
                            <div style={styles.analysisGrid}>
                                {aiData.risk_factors.length > 0 && (
                                    <div style={styles.riskFactorsSection}>
                                        <h4 style={styles.sectionTitle}>Risk Factors</h4>
                                        <ul style={styles.factorsList}>
                                            {aiData.risk_factors.map((risk, index) => (
                                                <li key={index} style={styles.riskItem}>{risk}</li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                                
                                {aiData.opportunities.length > 0 && (
                                    <div style={styles.opportunitiesSection}>
                                        <h4 style={styles.sectionTitle}>Opportunities</h4>
                                        <ul style={styles.factorsList}>
                                            {aiData.opportunities.map((opportunity, index) => (
                                                <li key={index} style={styles.opportunityItem}>{opportunity}</li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </div>
                            
                            <div style={styles.metaInfo}>
                                <small style={styles.metaText}>
                                    Analysis Period: {aiData.analysis_period} | Currency: {analysis.currency}
                                </small>
                            </div>
                        </div>
                    ) : (
                        <div style={styles.noDataContainer}>
                            <div style={styles.noDataIcon}>📊</div>
                            <h4 style={styles.noDataTitle}>No Economic Data Available</h4>
                            <p style={styles.noDataMessage}>
                                {analysis.message}
                            </p>
                            {aiData.summary && (
                                <p style={styles.noDataSummary}>
                                    {aiData.summary}
                                </p>
                            )}
                        </div>
                    )}
                </div>
            </div>
        );
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
            height: '100%'
        },
        modal: {
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 10000
        },
        modalContent: {
            backgroundColor: 'white',
            padding: '30px',
            borderRadius: '20px',
            boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
            maxWidth: '500px',
            width: '90%',
            textAlign: 'center',
            animation: 'fadeIn 0.3s ease'
        },
        modalTitle: {
            fontSize: '1.5rem',
            fontWeight: 'bold',
            color: '#2c3e50',
            marginBottom: '15px'
        },
        modalMessage: {
            fontSize: '1rem',
            color: '#7f8c8d',
            marginBottom: '25px',
            lineHeight: '1.5'
        },
        modalButtons: {
            display: 'flex',
            gap: '15px',
            justifyContent: 'center'
        },
        modalButton: {
            padding: '12px 24px',
            border: 'none',
            borderRadius: '25px',
            fontSize: '16px',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            minWidth: '100px'
        },
        confirmButton: {
            backgroundColor: '#3498db',
            color: 'white',
            boxShadow: '0 4px 15px rgba(52, 152, 219, 0.3)'
        },
        declineButton: {
            backgroundColor: '#ecf0f1',
            color: '#7f8c8d'
        },
        loadingOverlay: {
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 9999,
            borderRadius: '15px'
        },
        loadingContent: {
            backgroundColor: 'white',
            padding: '30px',
            borderRadius: '15px',
            textAlign: 'center',
            boxShadow: '0 10px 30px rgba(0,0,0,0.3)'
        },
        loadingSpinner: {
            width: '40px',
            height: '40px',
            border: '4px solid #ecf0f1',
            borderTop: '4px solid #3498db',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 15px'
        },
        loadingText: {
            fontSize: '16px',
            color: '#2c3e50',
            fontWeight: '500'
        },
        analysisPanel: {
            position: 'absolute',
            top: '20px',
            right: '20px',
            width: isMobile ? 'calc(100% - 40px)' : '400px',
            maxHeight: 'calc(100vh - 280px)',
            backgroundColor: 'white',
            borderRadius: '15px',
            boxShadow: '0 15px 35px rgba(0,0,0,0.2)',
            zIndex: 1001,
            overflow: 'hidden'
        },
        analysisPanelHeader: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '20px',
            backgroundColor: '#3498db',
            color: 'white'
        },
        analysisPanelTitle: {
            fontSize: '1.2rem',
            fontWeight: 'bold',
            margin: 0
        },
        closeButton: {
            background: 'none',
            border: 'none',
            color: 'white',
            fontSize: '24px',
            cursor: 'pointer',
            padding: '0',
            width: '30px',
            height: '30px',
            borderRadius: '50%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            transition: 'background-color 0.3s ease'
        },
        analysisPanelContent: {
            padding: '20px',
            maxHeight: 'calc(100vh - 360px)',
            overflowY: 'auto'
        },
        analysisSection: {
            marginBottom: '20px'
        },
        sentimentBadge: (sentiment) => ({
            display: 'inline-block',
            padding: '6px 12px',
            borderRadius: '20px',
            fontSize: '12px',
            fontWeight: 'bold',
            backgroundColor: sentiment === 'positive' ? '#27ae60' : sentiment === 'negative' ? '#e74c3c' : '#95a5a6',
            color: 'white'
        }),
        sectionTitle: {
            fontSize: '1rem',
            fontWeight: 'bold',
            color: '#2c3e50',
            marginBottom: '10px',
            margin: '0 0 10px 0'
        },
        summaryText: {
            fontSize: '14px',
            color: '#7f8c8d',
            lineHeight: '1.6',
            margin: 0
        },
        highlightsList: {
            margin: 0,
            paddingLeft: '20px'
        },
        highlightItem: {
            fontSize: '14px',
            color: '#2c3e50',
            marginBottom: '5px',
            lineHeight: '1.4'
        },
        eventItem: {
            backgroundColor: '#f8f9fa',
            padding: '15px',
            borderRadius: '10px',
            marginBottom: '10px'
        },
        eventHeader: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '8px'
        },
        eventName: {
            fontSize: '14px',
            fontWeight: 'bold',
            color: '#2c3e50'
        },
        impactBadge: (impact) => ({
            padding: '3px 8px',
            borderRadius: '12px',
            fontSize: '10px',
            fontWeight: 'bold',
            backgroundColor: impact === 'high' ? '#e74c3c' : impact === 'medium' ? '#f39c12' : '#95a5a6',
            color: 'white'
        }),
        eventSummary: {
            fontSize: '13px',
            color: '#7f8c8d',
            margin: 0,
            lineHeight: '1.4'
        },
        analysisGrid: {
            display: 'grid',
            gridTemplateColumns: '1fr',
            gap: '15px',
            marginBottom: '20px'
        },
        riskFactorsSection: {
            backgroundColor: '#fdf2f2',
            padding: '15px',
            borderRadius: '10px',
            borderLeft: '4px solid #e74c3c'
        },
        opportunitiesSection: {
            backgroundColor: '#f0f9f4',
            padding: '15px',
            borderRadius: '10px',
            borderLeft: '4px solid #27ae60'
        },
        factorsList: {
            margin: 0,
            paddingLeft: '20px'
        },
        riskItem: {
            fontSize: '13px',
            color: '#c0392b',
            marginBottom: '5px',
            lineHeight: '1.4'
        },
        opportunityItem: {
            fontSize: '13px',
            color: '#27ae60',
            marginBottom: '5px',
            lineHeight: '1.4'
        },
        metaInfo: {
            borderTop: '1px solid #ecf0f1',
            paddingTop: '15px'
        },
        metaText: {
            fontSize: '12px',
            color: '#bdc3c7'
        },
        noDataContainer: {
            textAlign: 'center',
            padding: '20px'
        },
        noDataIcon: {
            fontSize: '48px',
            marginBottom: '15px'
        },
        noDataTitle: {
            fontSize: '1.1rem',
            fontWeight: 'bold',
            color: '#7f8c8d',
            marginBottom: '10px',
            margin: '0 0 10px 0'
        },
        noDataMessage: {
            fontSize: '14px',
            color: '#95a5a6',
            marginBottom: '15px',
            lineHeight: '1.5',
            margin: '0 0 15px 0'
        },
        noDataSummary: {
            fontSize: '13px',
            color: '#bdc3c7',
            lineHeight: '1.4',
            fontStyle: 'italic',
            margin: 0
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
                <svg ref={svgRef} style={styles.svgMap}></svg>
            </div>
        );
    };

    const ConfirmationModal = () => (
        <div style={styles.modal}>
            <div style={styles.modalContent}>
                <h3 style={styles.modalTitle}>Economic Analysis</h3>
                <p style={styles.modalMessage}>
                    Would you like to see an AI-powered economic summary for <strong>{clickedCountry}</strong>?
                </p>
                <div style={styles.modalButtons}>
                    <button
                        style={{...styles.modalButton, ...styles.declineButton}}
                        onClick={handleDeclineAnalysis}
                    >
                        No, Thanks
                    </button>
                    <button
                        style={{...styles.modalButton, ...styles.confirmButton}}
                        onClick={handleConfirmAnalysis}
                    >
                        Yes, Show Me
                    </button>
                </div>
            </div>
        </div>
    );

    const LoadingOverlay = () => (
        <div style={styles.loadingOverlay}>
            <div style={styles.loadingContent}>
                <div style={styles.loadingSpinner}></div>
                <div style={styles.loadingText}>
                    Analyzing economic data for {clickedCountry}...
                </div>
            </div>
        </div>
    );

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
                                ref={globeRef}
                                globeImageUrl={currentTheme.globeImage}
                                bumpImageUrl={currentTheme.bumpImage}
                                backgroundImageUrl={currentTheme.background}
                                
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
                                
                                showAtmosphere={true}
                                atmosphereColor="lightblue"
                                atmosphereAltitude={0.15}
                                
                                enablePointerInteraction={true}
                                animateIn={true}
                                
                                width={globeSize.width}
                                height={globeSize.height}
                            />
                        ) : (
                            <D3Map />
                        )}

                        {loadingAnalysis && <LoadingOverlay />}
                    </div>

                    {selectedCountry && economicAnalysis[selectedCountry] && renderAnalysisPanel()}
                </div>
            </div>

            {showConfirmationModal && <ConfirmationModal />}

            <style jsx>{`
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(-20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
                
                .closeButton:hover {
                    background-color: rgba(255, 255, 255, 0.2) !important;
                }
                
                .modalButton:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
                }
                
                .analysisPanelContent::-webkit-scrollbar {
                    width: 6px;
                }
                
                .analysisPanelContent::-webkit-scrollbar-track {
                    background: #f1f1f1;
                    border-radius: 3px;
                }
                
                .analysisPanelContent::-webkit-scrollbar-thumb {
                    background: #c1c1c1;
                    border-radius: 3px;
                }
                
                .analysisPanelContent::-webkit-scrollbar-thumb:hover {
                    background: #a8a8a8;
                }
            `}</style>
        </div>
    );
}