import Header from "./header";
import SideNavs from "./side_navs";
import React, { useEffect, useState, useRef, useCallback } from "react";
import Globe from 'react-globe.gl';
import * as d3 from 'd3';
import { Eye, AlertTriangle, TrendingUp, DollarSign, Shield, Lock } from 'lucide-react';

const geoUrl = "https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson";

export default function CIAMacroIntel() {
    const baseUrl = 'https://backend-production-c0ab.up.railway.app';
    const [view3D, setView3D] = useState(true);
    const [selectedCountry, setSelectedCountry] = useState('');
    const [countries, setCountries] = useState([]);
    const [worldData, setWorldData] = useState({ features: [] });
    const [globeTheme, setGlobeTheme] = useState('night-ops');
    const [isMobile, setIsMobile] = useState(false);
    const [geoJsonData, setGeoJsonData] = useState(null);
    const [showConfirmationModal, setShowConfirmationModal] = useState(false);
    const [economicAnalysis, setEconomicAnalysis] = useState({});
    const [loadingAnalysis, setLoadingAnalysis] = useState(false);
    const [showAnalysisModal, setShowAnalysisModal] = useState(false);
    const [clickedCountry, setClickedCountry] = useState('');
    const svgRef = useRef();
    const globeRef = useRef();
    const mapContainerRef = useRef();
    const zoomRef = useRef();
    const [searchCountry, setSearchCountry] = useState('');
    const [autoRotate, setAutoRotate] = useState(true);
    const [intelStatus, setIntelStatus] = useState('STANDBY');
    const [threatLevel] = useState('MODERATE');
    const [showMediaCenter, setShowMediaCenter] = useState(false);
    const [videoUrl, setVideoUrl] = useState('');
    const [isVideoPlaying, setIsVideoPlaying] = useState(false);

    const globeThemes = {
        'night-ops': {
            name: 'NIGHT OPS',
            globeImage: "//unpkg.com/three-globe/example/img/earth-night.jpg",
            bumpImage: "//unpkg.com/three-globe/example/img/earth-topology.png",
            background: "//unpkg.com/three-globe/example/img/night-sky.png"
        },
        'satellite': {
            name: 'SATELLITE',
            globeImage: "//unpkg.com/three-globe/example/img/earth-blue-marble.jpg",
            bumpImage: "//unpkg.com/three-globe/example/img/earth-topology.png",
            background: "//unpkg.com/three-globe/example/img/night-sky.png"
        },
        'recon': {
            name: 'RECON',
            globeImage: "//unpkg.com/three-globe/example/img/earth-day.jpg",
            bumpImage: "//unpkg.com/three-globe/example/img/earth-topology.png",
            background: "//unpkg.com/three-globe/example/img/night-sky.png"
        }
    };
    
    const countryData = [
        // United States - Major Centers
        { name: 'Washington D.C.', lat: 38.9072, lng: -77.0369, color: '#2563eb', iso: 'US', threat: 'LOW', type: 'Political/Military' },
        { name: 'New York', lat: 40.7128, lng: -74.0060, color: '#2563eb', iso: 'US', threat: 'LOW', type: 'Financial' },
        { name: 'San Francisco', lat: 37.7749, lng: -122.4194, color: '#2563eb', iso: 'US', threat: 'LOW', type: 'Tech/Economic' },
        { name: 'Los Angeles', lat: 34.0522, lng: -118.2437, color: '#2563eb', iso: 'US', threat: 'LOW', type: 'Economic' },
        { name: 'Chicago', lat: 41.8781, lng: -87.6298, color: '#2563eb', iso: 'US', threat: 'LOW', type: 'Financial' },
        
        // China - Major Centers
        { name: 'Beijing', lat: 39.9042, lng: 116.4074, color: '#ef4444', iso: 'CN', threat: 'HIGH', type: 'Political/Military' },
        { name: 'Shanghai', lat: 31.2304, lng: 121.4737, color: '#ef4444', iso: 'CN', threat: 'HIGH', type: 'Financial' },
        { name: 'Shenzhen', lat: 22.5431, lng: 114.0579, color: '#ef4444', iso: 'CN', threat: 'HIGH', type: 'Tech/Economic' },
        { name: 'Hong Kong', lat: 22.3193, lng: 114.1694, color: '#ef4444', iso: 'CN', threat: 'HIGH', type: 'Financial' },
        
        // Europe - Major Centers
        { name: 'London', lat: 51.5074, lng: -0.1278, color: '#2563eb', iso: 'GB', threat: 'LOW', type: 'Financial' },
        { name: 'Frankfurt', lat: 50.1109, lng: 8.6821, color: '#3b82f6', iso: 'DE', threat: 'LOW', type: 'Financial' },
        { name: 'Paris', lat: 48.8566, lng: 2.3522, color: '#3b82f6', iso: 'FR', threat: 'LOW', type: 'Political/Economic' },
        { name: 'Brussels', lat: 50.8503, lng: 4.3517, color: '#3b82f6', iso: 'BE', threat: 'LOW', type: 'Political/Diplomatic' },
        { name: 'Geneva', lat: 46.2044, lng: 6.1432, color: '#3b82f6', iso: 'CH', threat: 'LOW', type: 'Diplomatic' },
        { name: 'Zurich', lat: 47.3769, lng: 8.5417, color: '#3b82f6', iso: 'CH', threat: 'LOW', type: 'Financial' },
        { name: 'Berlin', lat: 52.5200, lng: 13.4050, color: '#3b82f6', iso: 'DE', threat: 'LOW', type: 'Political' },
        { name: 'Amsterdam', lat: 52.3676, lng: 4.9041, color: '#3b82f6', iso: 'NL', threat: 'LOW', type: 'Financial' },
        
        // Asia-Pacific
        { name: 'Tokyo', lat: 35.6762, lng: 139.6503, color: '#3b82f6', iso: 'JP', threat: 'LOW', type: 'Economic/Financial' },
        { name: 'Singapore', lat: 1.3521, lng: 103.8198, color: '#3b82f6', iso: 'SG', threat: 'LOW', type: 'Financial' },
        { name: 'Seoul', lat: 37.5665, lng: 126.9780, color: '#f59e0b', iso: 'KR', threat: 'MEDIUM', type: 'Tech/Economic' },
        { name: 'Mumbai', lat: 19.0760, lng: 72.8777, color: '#f59e0b', iso: 'IN', threat: 'MEDIUM', type: 'Financial' },
        { name: 'New Delhi', lat: 28.6139, lng: 77.2090, color: '#f59e0b', iso: 'IN', threat: 'MEDIUM', type: 'Political' },
        { name: 'Sydney', lat: -33.8688, lng: 151.2093, color: '#3b82f6', iso: 'AU', threat: 'LOW', type: 'Financial' },
        { name: 'Dubai', lat: 25.2048, lng: 55.2708, color: '#f59e0b', iso: 'AE', threat: 'MEDIUM', type: 'Financial' },
        
        // Russia
        { name: 'Moscow', lat: 55.7558, lng: 37.6173, color: '#dc2626', iso: 'RU', threat: 'HIGH', type: 'Political/Military' },
        { name: 'St. Petersburg', lat: 59.9343, lng: 30.3351, color: '#dc2626', iso: 'RU', threat: 'HIGH', type: 'Economic' },
        
        // Middle East
        { name: 'Tel Aviv', lat: 32.0853, lng: 34.7818, color: '#f59e0b', iso: 'IL', threat: 'MEDIUM', type: 'Tech/Military' },
        { name: 'Riyadh', lat: 24.7136, lng: 46.6753, color: '#f59e0b', iso: 'SA', threat: 'MEDIUM', type: 'Political/Economic' },
        { name: 'Istanbul', lat: 41.0082, lng: 28.9784, color: '#f59e0b', iso: 'TR', threat: 'MEDIUM', type: 'Economic/Strategic' },
        
        // Americas
        { name: 'Toronto', lat: 43.6532, lng: -79.3832, color: '#3b82f6', iso: 'CA', threat: 'LOW', type: 'Financial' },
        { name: 'São Paulo', lat: -23.5505, lng: -46.6333, color: '#60a5fa', iso: 'BR', threat: 'MEDIUM', type: 'Economic/Financial' },
        { name: 'Mexico City', lat: 19.4326, lng: -99.1332, color: '#f59e0b', iso: 'MX', threat: 'MEDIUM', type: 'Political/Economic' },
        { name: 'Buenos Aires', lat: -34.6037, lng: -58.3816, color: '#60a5fa', iso: 'AR', threat: 'MEDIUM', type: 'Economic' },
        
        // Africa
        { name: 'Johannesburg', lat: -26.2041, lng: 28.0473, color: '#f59e0b', iso: 'ZA', threat: 'MEDIUM', type: 'Economic/Financial' },
        { name: 'Cairo', lat: 30.0444, lng: 31.2357, color: '#f59e0b', iso: 'EG', threat: 'MEDIUM', type: 'Political/Strategic' },
        { name: 'Lagos', lat: 6.5244, lng: 3.3792, color: '#f59e0b', iso: 'NG', threat: 'MEDIUM', type: 'Economic' },
        
        // Additional Strategic Points
        { name: 'Vancouver', lat: 49.2827, lng: -123.1207, color: '#3b82f6', iso: 'CA', threat: 'LOW', type: 'Economic' },
        { name: 'Miami', lat: 25.7617, lng: -80.1918, color: '#2563eb', iso: 'US', threat: 'LOW', type: 'Financial' },
        { name: 'Boston', lat: 42.3601, lng: -71.0589, color: '#2563eb', iso: 'US', threat: 'LOW', type: 'Tech/Financial' },
        { name: 'Seattle', lat: 47.6062, lng: -122.3321, color: '#2563eb', iso: 'US', threat: 'LOW', type: 'Tech/Economic' },
        { name: 'Austin', lat: 30.2672, lng: -97.7431, color: '#2563eb', iso: 'US', threat: 'LOW', type: 'Tech' },
        { name: 'Taipei', lat: 25.0330, lng: 121.5654, color: '#f59e0b', iso: 'TW', threat: 'MEDIUM', type: 'Tech/Strategic' },
        { name: 'Bangkok', lat: 13.7563, lng: 100.5018, color: '#f59e0b', iso: 'TH', threat: 'MEDIUM', type: 'Economic' },
        { name: 'Kuala Lumpur', lat: 3.1390, lng: 101.6869, color: '#f59e0b', iso: 'MY', threat: 'MEDIUM', type: 'Economic' },
        { name: 'Vienna', lat: 48.2082, lng: 16.3738, color: '#3b82f6', iso: 'AT', threat: 'LOW', type: 'Diplomatic' },
        { name: 'Stockholm', lat: 59.3293, lng: 18.0686, color: '#3b82f6', iso: 'SE', threat: 'LOW', type: 'Economic/Tech' },
        { name: 'Copenhagen', lat: 55.6761, lng: 12.5683, color: '#3b82f6', iso: 'DK', threat: 'LOW', type: 'Economic' },
        { name: 'Oslo', lat: 59.9139, lng: 10.7522, color: '#3b82f6', iso: 'NO', threat: 'LOW', type: 'Economic' },
        { name: 'Warsaw', lat: 52.2297, lng: 21.0122, color: '#3b82f6', iso: 'PL', threat: 'LOW', type: 'Political/Economic' },
        { name: 'Prague', lat: 50.0755, lng: 14.4378, color: '#3b82f6', iso: 'CZ', threat: 'LOW', type: 'Economic' },
        { name: 'Milan', lat: 45.4642, lng: 9.1900, color: '#3b82f6', iso: 'IT', threat: 'LOW', type: 'Economic/Financial' },
        { name: 'Madrid', lat: 40.4168, lng: -3.7038, color: '#3b82f6', iso: 'ES', threat: 'LOW', type: 'Political/Economic' },
        { name: 'Lisbon', lat: 38.7223, lng: -9.1393, color: '#3b82f6', iso: 'PT', threat: 'LOW', type: 'Economic' },
        { name: 'Dublin', lat: 53.3498, lng: -6.2603, color: '#3b82f6', iso: 'IE', threat: 'LOW', type: 'Tech/Financial' },
        { name: 'Luxembourg', lat: 49.6116, lng: 6.1319, color: '#3b82f6', iso: 'LU', threat: 'LOW', type: 'Financial' },
        { name: 'Monaco', lat: 43.7384, lng: 7.4246, color: '#3b82f6', iso: 'MC', threat: 'LOW', type: 'Financial' }
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

    const handleCountrySearch = () => {
        if (!searchCountry.trim() || !globeRef.current) return;
        
        let targetCountry = countryData.find(country => 
            country.name.toLowerCase().includes(searchCountry.toLowerCase())
        );
        
        if (targetCountry) {
            globeRef.current.pointOfView({
                lat: targetCountry.lat,
                lng: targetCountry.lng,
                altitude: 2.5
            }, 2000);
            
            setSelectedCountry(targetCountry.name);
            setSearchCountry('');
            return;
        }
        
        const foundFeature = worldData.features?.find(feature => {
            const countryName = feature.properties?.NAME || feature.properties?.name || '';
            return countryName.toLowerCase().includes(searchCountry.toLowerCase());
        });
        
        if (foundFeature && foundFeature.properties) {
            const coords = foundFeature.geometry.coordinates;
            let lat = 0, lng = 0;
            
            if (foundFeature.geometry.type === 'Polygon') {
                const coordArray = coords[0];
                coordArray.forEach(coord => {
                    lng += coord[0];
                    lat += coord[1];
                });
                lng /= coordArray.length;
                lat /= coordArray.length;
            } else if (foundFeature.geometry.type === 'MultiPolygon') {
                let totalPoints = 0;
                coords.forEach(polygon => {
                    polygon[0].forEach(coord => {
                        lng += coord[0];
                        lat += coord[1];
                        totalPoints++;
                    });
                });
                lng /= totalPoints;
                lat /= totalPoints;
            }
            
            globeRef.current.pointOfView({
                lat: lat,
                lng: lng,
                altitude: 2.5
            }, 2000);
            
            const countryName = foundFeature.properties.NAME || foundFeature.properties.name;
            setSelectedCountry(countryName);
            setSearchCountry('');
        } else {
            alert(`TARGET "${searchCountry}" NOT FOUND IN DATABASE. VERIFY INTEL.`);
        }
    };

    const drawD3Map = useCallback(() => {
        if (!geoJsonData || !geoJsonData.features || !svgRef.current || !mapContainerRef.current) {
            return;
        }

        const svg = d3.select(svgRef.current);
        svg.selectAll("*").remove();

        const container = mapContainerRef.current;
        const width = container.clientWidth;
        const height = container.clientHeight;

        if (width <= 0 || height <= 0) {
            return;
        }

        svg.attr("width", width).attr("height", height);

        const projection = d3.geoNaturalEarth1()
            .scale(isMobile ? width / 4.5 : width / 10)
            .translate([width / 2, height / 2]);

        const path = d3.geoPath().projection(projection);

        const zoom = d3.zoom()
            .scaleExtent([0.5, 8])
            .on("zoom", (event) => {
                g.attr("transform", event.transform);
            });

        zoomRef.current = zoom;
        svg.call(zoom);

        const g = svg.append("g");

        g.append("g")
            .selectAll("path")
            .data(geoJsonData.features)
            .enter()
            .append("path")
            .attr("d", path)
            .attr("fill", d => {
                const countryName = d.properties?.NAME || d.properties?.name;
                return selectedCountry === countryName ? "#2563eb" : "#1e293b";
            })
            .attr("stroke", "#334155")
            .attr("stroke-width", 0.5)
            .style("cursor", "pointer")
            .on("mouseover", function(event, d) {
                d3.select(this)
                    .attr("fill", "#3b82f6")
                    .attr("stroke-width", 1);
            })
            .on("mouseout", function(event, d) {
                const countryName = d.properties?.NAME || d.properties?.name;
                d3.select(this)
                    .attr("fill", selectedCountry === countryName ? "#2563eb" : "#1e293b")
                    .attr("stroke-width", 0.5);
            })
            .on("click", function(event, d) {
                const countryName = d.properties?.NAME || d.properties?.name || 'Unknown Country';
                handleCountryClick({ name: countryName });
            });

        g.append("g")
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
            .attr("stroke", "#0f172a")
            .attr("stroke-width", 1.5)
            .style("cursor", "pointer")
            .style("filter", "drop-shadow(0 0 6px rgba(37, 99, 235, 0.8))")
            .on("click", function(event, d) {
                handleCountryClick(d);
            })
            .append("title")
            .text(d => `${d.name} - THREAT: ${d.threat}\nTYPE: ${d.type}`);

    }, [geoJsonData, isMobile, countries]);

    const resetZoom = () => {
        if (zoomRef.current && svgRef.current) {
            d3.select(svgRef.current)
                .transition()
                .duration(750)
                .call(zoomRef.current.transform, d3.zoomIdentity);
        }
    };

    useEffect(() => {
        if (!view3D && geoJsonData) {
            const timer = setTimeout(() => {
                drawD3Map();
            }, 100);
            
            return () => clearTimeout(timer);
        }
    }, [view3D, geoJsonData, drawD3Map]);

    useEffect(() => {
        const handleResize = () => {
            if (!view3D) {
                const timer = setTimeout(() => {
                    drawD3Map();
                }, 200);
                return () => clearTimeout(timer);
            }
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [view3D, drawD3Map]);

    const fetchEconomicData = async (countryName) => {
        setLoadingAnalysis(true);
        try {
            // Fetch economic data
            const econResponse = await fetch(`${baseUrl}/api/economic-data-map/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    country_name: countryName
                })
            });

            const econData = await econResponse.json();
            
            // Get currency code for news data
            const currencyMap = {
                'United States': 'USD', 'USA': 'USD', 'US': 'USD',
                'Canada': 'CAD', 'United Kingdom': 'GBP', 'UK': 'GBP',
                'Japan': 'JPY', 'Australia': 'AUD', 'Switzerland': 'CHF',
                'China': 'CNY', 'Brazil': 'BRL', 'Mexico': 'MXN',
                'South Africa': 'ZAR', 'India': 'INR', 'Russia': 'RUB',
                'South Korea': 'KRW', 'Sweden': 'SEK', 'Norway': 'NOK',
                'Germany': 'EUR', 'France': 'EUR', 'Italy': 'EUR', 'Spain': 'EUR'
            };
            
            const currency = currencyMap[countryName] || 'USD';
            const currencyPair = `${currency}USD`;
            
            // Fetch news data
            let newsData = { message: [] };
            try {
                const newsResponse = await fetch(`${baseUrl}/api/fetch_news_data_api/`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        assets: [currencyPair],
                        user_email: 'intel@classified.gov'
                    })
                });
                
                if (newsResponse.ok) {
                    newsData = await newsResponse.json();
                }
            } catch (newsError) {
                console.log('News data unavailable:', newsError);
            }
            
            if (econData.success) {
                const analysisData = {
                    ...econData,
                    aiAnalysis: JSON.parse(econData.ai_analysis),
                    newsData: newsData.message || [],
                    currencyPair: currencyPair
                };
                
                setEconomicAnalysis(prev => ({
                    ...prev,
                    [countryName]: analysisData
                }));
                
                return analysisData;
            } else {
                console.error('Failed to fetch economic data:', econData.error);
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
        setIntelStatus('QUERYING');
    };

    const handleConfirmAnalysis = async () => {
        setShowConfirmationModal(false);
        setIntelStatus('ANALYZING');
        
        if (!economicAnalysis[clickedCountry]) {
            await fetchEconomicData(clickedCountry);
        }
        
        setShowAnalysisModal(true);
        setIntelStatus('ACTIVE');
    };

    const handleDeclineAnalysis = () => {
        setShowConfirmationModal(false);
        setSelectedCountry('');
        setClickedCountry('');
        setIntelStatus('STANDBY');
    };

    const handleCloseAnalysisModal = () => {
        setShowAnalysisModal(false);
        setSelectedCountry('');
        setIntelStatus('STANDBY');
    };

    const extractYouTubeId = (url) => {
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
        const match = url.match(regExp);
        return (match && match[2].length === 11) ? match[2] : null;
    };

    const handlePlayVideo = () => {
        const videoId = extractYouTubeId(videoUrl);
        if (videoId) {
            setIsVideoPlaying(true);
        } else {
            alert('INVALID YOUTUBE URL FORMAT. PLEASE VERIFY INTEL SOURCE.');
        }
    };

    const handleCloseMediaCenter = () => {
        setShowMediaCenter(false);
        setVideoUrl('');
        setIsVideoPlaying(false);
    };

    const handlePolygonClick = (polygon) => {
        const countryName = polygon.properties?.NAME || polygon.properties?.name || 'Unknown Country';
        handleCountryClick(countryName);
    };

    const renderAnalysisModal = () => {
        const analysis = economicAnalysis[selectedCountry];
        if (!analysis) return null;

        const aiData = analysis.aiAnalysis;
        const targetCountry = countries.find(c => c.name === selectedCountry);
        const newsArticles = analysis.newsData || [];

        return (
            <div style={styles.analysisModal}>
                <div style={styles.analysisModalContent}>
                    <div style={styles.analysisModalHeader}>
                        <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '4px' }}>
                                <Eye size={24} />
                                <h3 style={styles.analysisModalTitle}>
                                    INTEL BRIEF: {analysis.country.toUpperCase()}
                                </h3>
                            </div>
                            <div style={{ fontSize: '11px', color: '#64748b', letterSpacing: '1px' }}>
                                CLASSIFICATION: {targetCountry?.threat || 'UNKNOWN'} PRIORITY | PAIR: {analysis.currencyPair}
                            </div>
                        </div>
                        <button 
                            style={styles.analysisCloseButton}
                            onClick={handleCloseAnalysisModal}
                        >
                            ×
                        </button>
                    </div>
                    
                    <div style={styles.analysisModalBody}>
                        {analysis.has_data ? (
                            <div>
                                <div style={styles.threatPanel}>
                                    <div style={styles.threatHeader}>
                                        <AlertTriangle size={16} />
                                        <span>ECONOMIC THREAT ASSESSMENT</span>
                                    </div>
                                    <div style={styles.sentimentBadge(aiData.overall_sentiment)}>
                                        {aiData.overall_sentiment.toUpperCase()}
                                    </div>
                                </div>

                                {/* News Intelligence Section */}
                                {newsArticles.length > 0 && (
                                    <div style={styles.newsIntelSection}>
                                        <div style={styles.sectionHeader}>
                                            <div style={styles.sectionLine} />
                                            <h4 style={styles.sectionTitle}>
                                                🔴 LIVE INTELLIGENCE FEED - {analysis.currencyPair}
                                            </h4>
                                        </div>
                                        <div style={styles.newsGrid}>
                                            {newsArticles.slice(0, 6).map((article, index) => (
                                                <div key={index} style={styles.newsCard} className="newsCard">
                                                    <div style={styles.newsHeader}>
                                                        <span style={styles.newsSource}>{article.source}</span>
                                                        <span style={styles.newsAsset}>{article.asset}</span>
                                                    </div>
                                                    <h5 style={styles.newsTitle}>{article.title}</h5>
                                                    {article.highlights && (
                                                        <p style={styles.newsHighlight}>
                                                            ⚡ {typeof article.highlights === 'string' 
                                                                ? article.highlights 
                                                                : JSON.stringify(article.highlights).substring(0, 150) + '...'}
                                                        </p>
                                                    )}
                                                    <a 
                                                        href={article.url} 
                                                        target="_blank" 
                                                        rel="noopener noreferrer"
                                                        style={styles.newsLink}
                                                        className="newsLink"
                                                    >
                                                        ACCESS FULL INTEL →
                                                    </a>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                                
                                <div style={styles.intelSection}>
                                    <div style={styles.sectionHeader}>
                                        <div style={styles.sectionLine} />
                                        <h4 style={styles.sectionTitle}>EXECUTIVE SUMMARY</h4>
                                    </div>
                                    <p style={styles.summaryText}>{aiData.summary}</p>
                                </div>
                                
                                <div style={styles.intelSection}>
                                    <div style={styles.sectionHeader}>
                                        <div style={styles.sectionLine} />
                                        <h4 style={styles.sectionTitle}>KEY INTELLIGENCE</h4>
                                    </div>
                                    <div style={styles.highlightsList}>
                                        {aiData.key_highlights.map((highlight, index) => (
                                            <div key={index} style={styles.highlightItem}>
                                                <span style={styles.bulletPoint}>▸</span>
                                                {highlight}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                
                                {aiData.major_events.length > 0 && (
                                    <div style={styles.intelSection}>
                                        <div style={styles.sectionHeader}>
                                            <div style={styles.sectionLine} />
                                            <h4 style={styles.sectionTitle}>SIGNIFICANT EVENTS</h4>
                                        </div>
                                        {aiData.major_events.map((event, index) => (
                                            <div key={index} style={styles.eventCard}>
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
                                        <div style={styles.riskPanel}>
                                            <div style={styles.panelHeader}>
                                                <AlertTriangle size={14} />
                                                <span>RISK FACTORS</span>
                                            </div>
                                            <div style={styles.factorsList}>
                                                {aiData.risk_factors.map((risk, index) => (
                                                    <div key={index} style={styles.riskItem}>
                                                        <span style={styles.riskBullet}>◆</span>
                                                        {risk}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                    
                                    {aiData.opportunities.length > 0 && (
                                        <div style={styles.opportunityPanel}>
                                            <div style={styles.panelHeader}>
                                                <TrendingUp size={14} />
                                                <span>OPPORTUNITIES</span>
                                            </div>
                                            <div style={styles.factorsList}>
                                                {aiData.opportunities.map((opportunity, index) => (
                                                    <div key={index} style={styles.opportunityItem}>
                                                        <span style={styles.opportunityBullet}>◆</span>
                                                        {opportunity}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                                
                                <div style={styles.metaInfo}>
                                    <div style={styles.metaItem}>
                                        <DollarSign size={12} />
                                        <span>CURRENCY: {analysis.currency}</span>
                                    </div>
                                    <div style={styles.metaSeparator}>|</div>
                                    <div style={styles.metaItem}>
                                        <span>PERIOD: {aiData.analysis_period}</span>
                                    </div>
                                    <div style={styles.metaSeparator}>|</div>
                                    <div style={styles.metaItem}>
                                        <span>CLASSIFIED</span>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div style={styles.noDataContainer}>
                                <div style={styles.noDataIcon}>
                                    <Shield size={48} color="#475569" />
                                </div>
                                <h4 style={styles.noDataTitle}>INSUFFICIENT INTEL</h4>
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
            </div>
        );
    };

    const MediaCenterModal = () => {
        const videoId = isVideoPlaying ? extractYouTubeId(videoUrl) : null;
        
        return (
            <div style={styles.mediaCenterModal} onClick={(e) => {
                if (e.target === e.currentTarget) {
                    handleCloseMediaCenter();
                }
            }}>
                <div style={styles.mediaCenterContent}>
                    <div style={styles.mediaCenterHeader}>
                        <h3 style={styles.mediaCenterTitle}>
                            <span>📡</span> MEDIA SURVEILLANCE CENTER
                        </h3>
                        <button 
                            style={styles.mediaCloseButton}
                            onClick={handleCloseMediaCenter}
                        >
                            ×
                        </button>
                    </div>
                    
                    <div style={styles.mediaWarning}>
                        ⚠️ CLASSIFIED MEDIA ACCESS - Enter YouTube URL for intelligence briefing playback. All sessions are monitored and logged.
                    </div>
                    
                    {!isVideoPlaying && (
                        <div style={styles.mediaInputContainer}>
                            <input
                                type="text"
                                placeholder="ENTER YOUTUBE URL (e.g., https://www.youtube.com/watch?v=...)"
                                value={videoUrl}
                                onChange={(e) => setVideoUrl(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && handlePlayVideo()}
                                style={styles.mediaInput}
                            />
                            <button
                                onClick={handlePlayVideo}
                                style={styles.mediaButton}
                                onMouseEnter={(e) => {
                                    e.target.style.boxShadow = '0 0 30px rgba(220, 38, 38, 0.6)';
                                }}
                                onMouseLeave={(e) => {
                                    e.target.style.boxShadow = '0 0 20px rgba(220, 38, 38, 0.4)';
                                }}
                            >
                                INITIATE PLAYBACK
                            </button>
                        </div>
                    )}
                    
                    {isVideoPlaying && videoId ? (
                        <div>
                            <div style={styles.videoContainer}>
                                <iframe
                                    key={videoId}
                                    style={styles.videoIframe}
                                    src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`}
                                    title="Intelligence Briefing Video"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                ></iframe>
                            </div>
                            <button
                                onClick={() => {
                                    setIsVideoPlaying(false);
                                    setVideoUrl('');
                                }}
                                style={{
                                    ...styles.mediaButton,
                                    marginTop: '15px',
                                    background: 'linear-gradient(135deg, #64748b 0%, #94a3b8 100%)'
                                }}
                            >
                                TERMINATE PLAYBACK
                            </button>
                        </div>
                    ) : !isVideoPlaying ? (
                        <div style={{
                            textAlign: 'center',
                            padding: '40px 20px',
                            color: '#64748b',
                            fontSize: isMobile ? '12px' : '14px',
                            letterSpacing: '1px'
                        }}>
                            AWAITING VIDEO INTELLIGENCE SOURCE...
                        </div>
                    ) : null}
                </div>
            </div>
        );
    };

    const styles = {
        container: {
            background: 'linear-gradient(to bottom, #0f1419 0%, #1a1f2e 100%)',
            minHeight: '100vh',
            color: '#e2e8f0'
        },
        mainPageBody: {
            display: 'flex',
            flexDirection: 'column'
        },
        mainBodyInfo: {
            padding: isMobile ? '15px' : '30px',
            maxWidth: '1400px',
            margin: '0 auto',
            width: '100%'
        },
        pageHeader: {
            textAlign: 'center',
            marginBottom: '30px',
            borderBottom: '2px solid #1e3a8a',
            paddingBottom: '20px'
        },
        pageTitle: {
            fontSize: isMobile ? '1.8rem' : '2.2rem',
            fontWeight: '700',
            color: '#fff',
            margin: 0,
            letterSpacing: '3px',
            textTransform: 'uppercase',
            textShadow: '0 0 20px rgba(37, 99, 235, 0.5)'
        },
        pageSubtitle: {
            fontSize: '12px',
            color: '#64748b',
            letterSpacing: '2px',
            marginTop: '8px'
        },
        controlsContainer: {
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            marginBottom: '25px',
            gap: '15px',
            background: 'rgba(15, 20, 25, 0.8)',
            padding: '20px',
            borderRadius: '8px',
            border: '1px solid #1e293b'
        },
        toggleContainer: {
            display: 'flex',
            gap: '8px',
            background: '#0f172a',
            padding: '4px',
            borderRadius: '6px',
            border: '1px solid #1e3a8a',
            flexWrap: 'wrap',
            justifyContent: 'center'
        },
        themeContainer: {
            display: 'flex',
            gap: '8px',
            alignItems: 'center',
            background: '#0f172a',
            padding: '4px',
            borderRadius: '6px',
            border: '1px solid #1e3a8a',
            flexWrap: 'wrap',
            justifyContent: 'center'
        },
        controlLabel: {
            fontSize: '11px',
            color: '#64748b',
            fontWeight: '600',
            letterSpacing: '1px',
            marginRight: '8px'
        },
        toggleButton: {
            padding: isMobile ? '10px 18px' : '12px 24px',
            border: 'none',
            borderRadius: '4px',
            fontSize: isMobile ? '12px' : '13px',
            fontWeight: '700',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            letterSpacing: '1px',
            textTransform: 'uppercase',
            whiteSpace: 'nowrap'
        },
        themeButton: {
            padding: '8px 14px',
            border: 'none',
            borderRadius: '4px',
            fontSize: '11px',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            letterSpacing: '1px',
            whiteSpace: 'nowrap'
        },
        activeButton: {
            background: 'linear-gradient(135deg, #1e3a8a 0%, #2563eb 100%)',
            color: '#fff',
            boxShadow: '0 0 20px rgba(37, 99, 235, 0.5)'
        },
        inactiveButton: {
            background: 'transparent',
            color: '#64748b',
            border: '1px solid #1e293b'
        },
        searchContainer: {
            display: 'flex',
            gap: '10px',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '20px',
            flexWrap: 'wrap'
        },
        searchInput: {
            padding: '10px 16px',
            background: '#0f172a',
            border: '1px solid #1e3a8a',
            borderRadius: '6px',
            color: '#e2e8f0',
            fontSize: '13px',
            outline: 'none',
            width: isMobile ? '200px' : '280px',
            fontFamily: 'monospace',
            letterSpacing: '1px'
        },
        searchButton: {
            padding: '10px 20px',
            background: 'linear-gradient(135deg, #1e3a8a 0%, #2563eb 100%)',
            border: 'none',
            borderRadius: '6px',
            color: '#fff',
            fontSize: '13px',
            fontWeight: '600',
            cursor: 'pointer',
            letterSpacing: '1px',
            textTransform: 'uppercase',
            transition: 'all 0.3s ease',
            boxShadow: '0 0 15px rgba(37, 99, 235, 0.3)'
        },
        viewContainer: {
            width: '100%',
            height: `calc(100vh - ${isMobile ? '400px' : '350px'})`,
            position: 'relative',
            borderRadius: '8px',
            overflow: 'hidden',
            border: '2px solid #1e3a8a',
            boxShadow: '0 0 40px rgba(37, 99, 235, 0.2)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            background: view3D ? '#000' : '#0f172a'
        },
        countryLabel: {
            position: 'absolute',
            top: '20px',
            left: '50%',
            transform: 'translateX(-50%)',
            background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(30, 58, 138, 0.95) 100%)',
            color: '#fff',
            padding: '12px 24px',
            borderRadius: '6px',
            fontSize: isMobile ? '13px' : '16px',
            fontWeight: '700',
            zIndex: 1000,
            border: '1px solid #2563eb',
            letterSpacing: '2px',
            textTransform: 'uppercase',
            boxShadow: '0 0 30px rgba(37, 99, 235, 0.5)'
        },
        mapContainer: {
            width: '100%',
            height: '100%',
            background: '#0f172a',
            position: 'relative'
        },
        svgMap: {
            width: '100%',
            height: '100%',
            display: 'block'
        },
        modal: {
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: 'rgba(0, 0, 0, 0.85)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 10000,
            backdropFilter: 'blur(8px)'
        },
        modalContent: {
            background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
            padding: '35px',
            borderRadius: '12px',
            border: '2px solid #1e3a8a',
            boxShadow: '0 0 60px rgba(37, 99, 235, 0.4)',
            maxWidth: '550px',
            width: '90%',
            textAlign: 'center'
        },
        modalTitle: {
            fontSize: '1.4rem',
            fontWeight: '700',
            color: '#fff',
            marginBottom: '10px',
            letterSpacing: '2px',
            textTransform: 'uppercase'
        },
        modalMessage: {
            fontSize: '14px',
            color: '#94a3b8',
            marginBottom: '30px',
            lineHeight: '1.6',
            letterSpacing: '0.5px'
        },
        modalButtons: {
            display: 'flex',
            gap: '15px',
            justifyContent: 'center'
        },
        modalButton: {
            padding: '12px 28px',
            border: 'none',
            borderRadius: '6px',
            fontSize: '13px',
            fontWeight: '700',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            minWidth: '120px',
            letterSpacing: '1px',
            textTransform: 'uppercase'
        },
        confirmButton: {
            background: 'linear-gradient(135deg, #1e3a8a 0%, #2563eb 100%)',
            color: '#fff',
            boxShadow: '0 0 20px rgba(37, 99, 235, 0.4)'
        },
        declineButton: {
            background: 'transparent',
            color: '#64748b',
            border: '1px solid #334155'
        },
        loadingOverlay: {
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: 'rgba(0, 0, 0, 0.9)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 9999,
            borderRadius: '8px'
        },
        loadingContent: {
            background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
            padding: '40px',
            borderRadius: '12px',
            textAlign: 'center',
            border: '2px solid #1e3a8a',
            boxShadow: '0 0 40px rgba(37, 99, 235, 0.4)'
        },
        loadingSpinner: {
            width: '50px',
            height: '50px',
            border: '4px solid #1e293b',
            borderTop: '4px solid #2563eb',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 20px',
            boxShadow: '0 0 20px rgba(37, 99, 235, 0.5)'
        },
        loadingText: {
            fontSize: '14px',
            color: '#e2e8f0',
            fontWeight: '600',
            letterSpacing: '1px',
            textTransform: 'uppercase'
        },
        analysisModal: {
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: 'rgba(0, 0, 0, 0.9)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 10001,
            backdropFilter: 'blur(10px)'
        },
        analysisModalContent: {
            background: 'linear-gradient(135deg, #0f172a 0%, #1a1f2e 100%)',
            borderRadius: '12px',
            border: '2px solid #1e3a8a',
            boxShadow: '0 0 60px rgba(37, 99, 235, 0.5)',
            width: isMobile ? '95%' : '800px',
            maxWidth: '95vw',
            maxHeight: '90vh',
            overflow: 'hidden'
        },
        analysisModalHeader: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            padding: '25px 30px',
            background: 'linear-gradient(135deg, #1e3a8a 0%, #2563eb 100%)',
            color: '#fff',
            borderBottom: '2px solid #60a5fa'
        },
        analysisModalTitle: {
            fontSize: isMobile ? '1.2rem' : '1.4rem',
            fontWeight: '700',
            margin: 0,
            letterSpacing: '2px'
        },
        analysisCloseButton: {
            background: 'none',
            border: 'none',
            color: '#fff',
            fontSize: '32px',
            cursor: 'pointer',
            padding: '0',
            width: '40px',
            height: '40px',
            borderRadius: '6px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            transition: 'background 0.3s ease',
            fontWeight: '300'
        },
        analysisModalBody: {
            padding: '30px',
            maxHeight: '75vh',
            overflowY: 'auto',
            background: '#0f172a'
        },
        threatPanel: {
            background: 'linear-gradient(135deg, rgba(30, 58, 138, 0.2) 0%, rgba(37, 99, 235, 0.1) 100%)',
            padding: '20px',
            borderRadius: '8px',
            marginBottom: '25px',
            border: '1px solid #1e3a8a',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
        },
        threatHeader: {
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            color: '#60a5fa',
            fontSize: '13px',
            fontWeight: '700',
            letterSpacing: '1px',
            textTransform: 'uppercase'
        },
        sentimentBadge: (sentiment) => ({
            display: 'inline-block',
            padding: '8px 16px',
            borderRadius: '6px',
            fontSize: '11px',
            fontWeight: '700',
            letterSpacing: '1px',
            textTransform: 'uppercase',
            background: sentiment === 'positive' 
                ? 'linear-gradient(135deg, #16a34a 0%, #22c55e 100%)' 
                : sentiment === 'negative' 
                ? 'linear-gradient(135deg, #dc2626 0%, #ef4444 100%)' 
                : 'linear-gradient(135deg, #64748b 0%, #94a3b8 100%)',
            color: '#fff',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            boxShadow: '0 0 15px rgba(0, 0, 0, 0.3)'
        }),
        intelSection: {
            marginBottom: '25px'
        },
        sectionHeader: {
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            marginBottom: '15px'
        },
        sectionLine: {
            width: '4px',
            height: '20px',
            background: 'linear-gradient(to bottom, #2563eb, #60a5fa)',
            borderRadius: '2px'
        },
        sectionTitle: {
            fontSize: '13px',
            fontWeight: '700',
            color: '#60a5fa',
            margin: 0,
            letterSpacing: '2px',
            textTransform: 'uppercase'
        },
        summaryText: {
            fontSize: '14px',
            color: '#cbd5e1',
            lineHeight: '1.7',
            margin: 0,
            paddingLeft: '16px',
            borderLeft: '2px solid #1e3a8a'
        },
        highlightsList: {
            display: 'flex',
            flexDirection: 'column',
            gap: '12px'
        },
        highlightItem: {
            fontSize: '13px',
            color: '#cbd5e1',
            lineHeight: '1.6',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '12px',
            padding: '12px',
            background: 'rgba(30, 58, 138, 0.1)',
            borderRadius: '6px',
            border: '1px solid #1e293b'
        },
        bulletPoint: {
            color: '#2563eb',
            fontSize: '16px',
            fontWeight: '700',
            flexShrink: 0
        },
        eventCard: {
            background: 'rgba(30, 41, 59, 0.5)',
            padding: '18px',
            borderRadius: '8px',
            marginBottom: '12px',
            border: '1px solid #1e3a8a'
        },
        eventHeader: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '10px',
            gap: '10px'
        },
        eventName: {
            fontSize: '14px',
            fontWeight: '700',
            color: '#e2e8f0',
            letterSpacing: '0.5px'
        },
        impactBadge: (impact) => ({
            padding: '4px 10px',
            borderRadius: '4px',
            fontSize: '10px',
            fontWeight: '700',
            letterSpacing: '1px',
            textTransform: 'uppercase',
            background: impact === 'high' 
                ? 'linear-gradient(135deg, #dc2626 0%, #ef4444 100%)' 
                : impact === 'medium' 
                ? 'linear-gradient(135deg, #d97706 0%, #f59e0b 100%)' 
                : 'linear-gradient(135deg, #64748b 0%, #94a3b8 100%)',
            color: '#fff',
            border: '1px solid rgba(255, 255, 255, 0.2)'
        }),
        eventSummary: {
            fontSize: '13px',
            color: '#94a3b8',
            margin: 0,
            lineHeight: '1.5'
        },
        analysisGrid: {
            display: 'grid',
            gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
            gap: '20px',
            marginBottom: '25px'
        },
        riskPanel: {
            background: 'linear-gradient(135deg, rgba(220, 38, 38, 0.1) 0%, rgba(239, 68, 68, 0.05) 100%)',
            padding: '20px',
            borderRadius: '8px',
            border: '1px solid rgba(220, 38, 38, 0.3)'
        },
        opportunityPanel: {
            background: 'linear-gradient(135deg, rgba(22, 163, 74, 0.1) 0%, rgba(34, 197, 94, 0.05) 100%)',
            padding: '20px',
            borderRadius: '8px',
            border: '1px solid rgba(22, 163, 74, 0.3)'
        },
        panelHeader: {
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            marginBottom: '15px',
            fontSize: '12px',
            fontWeight: '700',
            letterSpacing: '1px',
            textTransform: 'uppercase',
            color: '#94a3b8'
        },
        factorsList: {
            display: 'flex',
            flexDirection: 'column',
            gap: '10px'
        },
        riskItem: {
            fontSize: '13px',
            color: '#fca5a5',
            lineHeight: '1.5',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '10px'
        },
        riskBullet: {
            color: '#ef4444',
            fontSize: '12px',
            flexShrink: 0,
            marginTop: '2px'
        },
        opportunityItem: {
            fontSize: '13px',
            color: '#86efac',
            lineHeight: '1.5',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '10px'
        },
        opportunityBullet: {
            color: '#22c55e',
            fontSize: '12px',
            flexShrink: 0,
            marginTop: '2px'
        },
        metaInfo: {
            borderTop: '1px solid #1e293b',
            paddingTop: '20px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '15px',
            flexWrap: 'wrap'
        },
        metaItem: {
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '11px',
            color: '#64748b',
            fontWeight: '600',
            letterSpacing: '1px',
            textTransform: 'uppercase'
        },
        metaSeparator: {
            color: '#334155',
            fontSize: '11px'
        },
        noDataContainer: {
            textAlign: 'center',
            padding: '40px 20px'
        },
        noDataIcon: {
            marginBottom: '20px',
            opacity: 0.5
        },
        noDataTitle: {
            fontSize: '1.2rem',
            fontWeight: '700',
            color: '#64748b',
            marginBottom: '12px',
            margin: '0 0 12px 0',
            letterSpacing: '2px',
            textTransform: 'uppercase'
        },
        noDataMessage: {
            fontSize: '14px',
            color: '#475569',
            marginBottom: '15px',
            lineHeight: '1.6',
            margin: '0 0 15px 0'
        },
        noDataSummary: {
            fontSize: '13px',
            color: '#334155',
            lineHeight: '1.5',
            fontStyle: 'italic',
            margin: 0
        },
        statusBar: {
            background: 'linear-gradient(135deg, #0f172a 0%, #1a1f2e 100%)',
            padding: '12px 30px',
            borderBottom: '1px solid #1e3a8a',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '15px'
        },
        statusItem: {
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '11px',
            color: '#64748b',
            fontWeight: '600',
            letterSpacing: '1px'
        },
        statusDot: (status) => ({
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            background: status === 'ACTIVE' || status === 'ANALYZING' 
                ? '#22c55e' 
                : status === 'QUERYING' 
                ? '#f59e0b' 
                : '#64748b',
            boxShadow: status === 'ACTIVE' || status === 'ANALYZING'
                ? '0 0 10px #22c55e'
                : status === 'QUERYING'
                ? '0 0 10px #f59e0b'
                : 'none',
            animation: status === 'ACTIVE' || status === 'ANALYZING' || status === 'QUERYING' 
                ? 'pulse 2s infinite' 
                : 'none'
        }),
        statusValue: {
            color: '#2563eb',
            fontWeight: '700'
        },
        threatIndicator: (level) => ({
            display: 'inline-block',
            padding: '4px 10px',
            borderRadius: '4px',
            fontSize: '10px',
            fontWeight: '700',
            letterSpacing: '1px',
            background: level === 'HIGH' 
                ? 'linear-gradient(135deg, #dc2626 0%, #ef4444 100%)' 
                : level === 'ELEVATED'
                ? 'linear-gradient(135deg, #d97706 0%, #f59e0b 100%)'
                : 'linear-gradient(135deg, #059669 0%, #10b981 100%)',
            color: '#fff',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            boxShadow: '0 0 10px rgba(0, 0, 0, 0.3)'
        }),
        mediaCenterButton: {
            position: 'fixed',
            bottom: '30px',
            right: '30px',
            width: isMobile ? '50px' : '60px',
            height: isMobile ? '50px' : '60px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #dc2626 0%, #ef4444 100%)',
            border: '2px solid #fff',
            color: '#fff',
            fontSize: isMobile ? '20px' : '24px',
            cursor: 'pointer',
            boxShadow: '0 0 30px rgba(220, 38, 38, 0.6), 0 4px 20px rgba(0, 0, 0, 0.4)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 9998,
            transition: 'all 0.3s ease',
            animation: 'pulse 2s infinite'
        },
        mediaCenterModal: {
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: 'rgba(0, 0, 0, 0.95)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 10002,
            backdropFilter: 'blur(10px)'
        },
        mediaCenterContent: {
            background: 'linear-gradient(135deg, #0f172a 0%, #1a1f2e 100%)',
            borderRadius: '12px',
            border: '2px solid #dc2626',
            boxShadow: '0 0 60px rgba(220, 38, 38, 0.5)',
            width: isMobile ? '95%' : '900px',
            maxWidth: '95vw',
            maxHeight: '90vh',
            overflow: 'auto',
            padding: isMobile ? '15px' : '25px'
        },
        mediaCenterHeader: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '20px',
            paddingBottom: '15px',
            borderBottom: '2px solid #dc2626'
        },
        mediaCenterTitle: {
            fontSize: isMobile ? '1.1rem' : '1.3rem',
            fontWeight: '700',
            color: '#fff',
            margin: 0,
            letterSpacing: '2px',
            textTransform: 'uppercase',
            display: 'flex',
            alignItems: 'center',
            gap: '10px'
        },
        mediaCloseButton: {
            background: 'none',
            border: 'none',
            color: '#dc2626',
            fontSize: '32px',
            cursor: 'pointer',
            padding: '0',
            width: '40px',
            height: '40px',
            borderRadius: '6px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            transition: 'background 0.3s ease',
            fontWeight: '300'
        },
        mediaInputContainer: {
            marginBottom: '20px'
        },
        mediaInput: {
            width: '100%',
            padding: isMobile ? '10px 14px' : '12px 16px',
            background: '#0f172a',
            border: '1px solid #dc2626',
            borderRadius: '6px',
            color: '#e2e8f0',
            fontSize: isMobile ? '12px' : '14px',
            outline: 'none',
            fontFamily: 'monospace',
            letterSpacing: '0.5px',
            marginBottom: '10px'
        },
        mediaButton: {
            width: '100%',
            padding: isMobile ? '10px 20px' : '12px 24px',
            background: 'linear-gradient(135deg, #dc2626 0%, #ef4444 100%)',
            border: 'none',
            borderRadius: '6px',
            color: '#fff',
            fontSize: isMobile ? '12px' : '14px',
            fontWeight: '700',
            cursor: 'pointer',
            letterSpacing: '1px',
            textTransform: 'uppercase',
            transition: 'all 0.3s ease',
            boxShadow: '0 0 20px rgba(220, 38, 38, 0.4)'
        },
        videoContainer: {
            position: 'relative',
            width: '100%',
            paddingBottom: '56.25%',
            height: 0,
            overflow: 'hidden',
            borderRadius: '8px',
            border: '2px solid #dc2626',
            boxShadow: '0 0 30px rgba(220, 38, 38, 0.3)'
        },
        videoIframe: {
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            border: 'none'
        },
        mediaWarning: {
            background: 'rgba(220, 38, 38, 0.1)',
            border: '1px solid rgba(220, 38, 38, 0.3)',
            borderRadius: '6px',
            padding: isMobile ? '10px' : '15px',
            marginBottom: '15px',
            fontSize: isMobile ? '11px' : '12px',
            color: '#fca5a5',
            letterSpacing: '0.5px',
            lineHeight: '1.5'
        },
        newsIntelSection: {
            marginBottom: '30px',
            padding: '20px',
            background: 'linear-gradient(135deg, rgba(220, 38, 38, 0.05) 0%, rgba(239, 68, 68, 0.02) 100%)',
            borderRadius: '8px',
            border: '1px solid rgba(220, 38, 38, 0.3)'
        },
        newsGrid: {
            display: 'grid',
            gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, 1fr)',
            gap: '15px',
            marginTop: '15px'
        },
        newsCard: {
            background: 'rgba(15, 23, 42, 0.6)',
            padding: '15px',
            borderRadius: '6px',
            border: '1px solid #1e3a8a',
            transition: 'all 0.3s ease',
            cursor: 'pointer'
        },
        newsHeader: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '10px',
            flexWrap: 'wrap',
            gap: '8px'
        },
        newsSource: {
            fontSize: '10px',
            fontWeight: '700',
            color: '#60a5fa',
            textTransform: 'uppercase',
            letterSpacing: '1px',
            background: 'rgba(37, 99, 235, 0.2)',
            padding: '4px 8px',
            borderRadius: '4px'
        },
        newsAsset: {
            fontSize: '10px',
            fontWeight: '700',
            color: '#94a3b8',
            textTransform: 'uppercase',
            letterSpacing: '1px'
        },
        newsTitle: {
            fontSize: '13px',
            fontWeight: '600',
            color: '#e2e8f0',
            marginBottom: '8px',
            lineHeight: '1.4',
            margin: '0 0 8px 0'
        },
        newsHighlight: {
            fontSize: '12px',
            color: '#94a3b8',
            lineHeight: '1.5',
            marginBottom: '10px',
            margin: '0 0 10px 0',
            fontStyle: 'italic'
        },
        newsLink: {
            fontSize: '11px',
            color: '#2563eb',
            textDecoration: 'none',
            fontWeight: '700',
            letterSpacing: '1px',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '5px',
            transition: 'color 0.3s ease'
        }
    };

    const getGlobeSize = () => {
        const baseSize = isMobile ? 
            Math.min(window.innerWidth - 40, 400) : 
            Math.min(window.innerWidth * 0.45, window.innerHeight * 0.55, 650);
        
        return {
            width: baseSize,
            height: baseSize
        };
    };

    const D3Map = () => {
        return (
            <div ref={mapContainerRef} style={styles.mapContainer}>
                <svg ref={svgRef} style={styles.svgMap}></svg>
            </div>
        );
    };

    const ConfirmationModal = () => (
        <div style={styles.modal}>
            <div style={styles.modalContent}>
                <h3 style={styles.modalTitle}>INITIATE INTEL BRIEFING</h3>
                <p style={styles.modalMessage}>
                    Request economic intelligence analysis for <strong style={{ color: '#2563eb' }}>{clickedCountry}</strong>?
                    <br /><br />
                    <span style={{ fontSize: '12px', color: '#64748b' }}>
                        Classification: CONFIDENTIAL
                    </span>
                </p>
                <div style={styles.modalButtons}>
                    <button
                        style={{...styles.modalButton, ...styles.declineButton}}
                        onClick={handleDeclineAnalysis}
                        onMouseEnter={(e) => {
                            e.target.style.background = '#1e293b';
                            e.target.style.color = '#94a3b8';
                        }}
                        onMouseLeave={(e) => {
                            e.target.style.background = 'transparent';
                            e.target.style.color = '#64748b';
                        }}
                    >
                        ABORT
                    </button>
                    <button
                        style={{...styles.modalButton, ...styles.confirmButton}}
                        onClick={handleConfirmAnalysis}
                        onMouseEnter={(e) => {
                            e.target.style.boxShadow = '0 0 30px rgba(37, 99, 235, 0.6)';
                        }}
                        onMouseLeave={(e) => {
                            e.target.style.boxShadow = '0 0 20px rgba(37, 99, 235, 0.4)';
                        }}
                    >
                        AUTHORIZE
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
                    PROCESSING INTEL: {clickedCountry}
                </div>
                <div style={{ fontSize: '11px', color: '#64748b', marginTop: '10px', letterSpacing: '1px' }}>
                    ACCESSING CLASSIFIED DATABASE...
                </div>
            </div>
        </div>
    );

    const currentTheme = globeThemes[globeTheme];
    const globeSize = getGlobeSize();

    useEffect(() => {
        if (globeRef.current && globeRef.current.controls) {
            globeRef.current.controls().autoRotate = autoRotate;
            globeRef.current.controls().autoRotateSpeed = 0.5;
        }
    }, [autoRotate]);

    return (
        <div style={styles.container}>
            <Header />
            <SideNavs />
            
            {/* Live Status Bar */}
            <div style={styles.statusBar}>
                <div style={styles.statusItem}>
                    <div style={styles.statusDot(intelStatus)}></div>
                    <span>SYSTEM STATUS: <span style={styles.statusValue}>{intelStatus}</span></span>
                </div>
                <div style={styles.statusItem}>
                    <span>THREAT LEVEL: </span>
                    <span style={styles.threatIndicator(threatLevel)}>{threatLevel}</span>
                </div>
            </div>
            
            <div style={styles.mainPageBody}>
                <div style={styles.mainBodyInfo}>
                    <div style={styles.pageHeader}>
                        <h1 style={styles.pageTitle}>
                            GEOPOLITICAL INTELLIGENCE SYSTEM
                        </h1>
                        <p style={styles.pageSubtitle}>
                            REAL-TIME ECONOMIC SURVEILLANCE & THREAT ASSESSMENT
                        </p>
                    </div>
                    
                    <div style={styles.controlsContainer}>
                        <div style={styles.toggleContainer}>
                            <button
                                style={{
                                    ...styles.toggleButton,
                                    ...(view3D ? styles.inactiveButton : styles.activeButton)
                                }}
                                onClick={() => setView3D(false)}
                                onMouseEnter={(e) => {
                                    if (!view3D) return;
                                    e.target.style.background = '#1e293b';
                                    e.target.style.color = '#94a3b8';
                                }}
                                onMouseLeave={(e) => {
                                    if (!view3D) return;
                                    e.target.style.background = 'transparent';
                                    e.target.style.color = '#64748b';
                                }}
                            >
                                2D MAP
                            </button>
                            <button
                                style={{
                                    ...styles.toggleButton,
                                    ...(view3D ? styles.activeButton : styles.inactiveButton)
                                }}
                                onClick={() => setView3D(true)}
                                onMouseEnter={(e) => {
                                    if (view3D) return;
                                    e.target.style.background = '#1e293b';
                                    e.target.style.color = '#94a3b8';
                                }}
                                onMouseLeave={(e) => {
                                    if (view3D) return;
                                    e.target.style.background = 'transparent';
                                    e.target.style.color = '#64748b';
                                }}
                            >
                                3D GLOBE
                            </button>
                        </div>
                        
                        {view3D && (
                            <div style={styles.themeContainer}>
                                <span style={styles.controlLabel}>MODE:</span>
                                {Object.entries(globeThemes).map(([key, theme]) => (
                                    <button
                                        key={key}
                                        style={{
                                            ...styles.themeButton,
                                            ...(globeTheme === key ? styles.activeButton : styles.inactiveButton)
                                        }}
                                        onClick={() => setGlobeTheme(key)}
                                        onMouseEnter={(e) => {
                                            if (globeTheme === key) return;
                                            e.target.style.background = '#1e293b';
                                            e.target.style.color = '#94a3b8';
                                        }}
                                        onMouseLeave={(e) => {
                                            if (globeTheme === key) return;
                                            e.target.style.background = 'transparent';
                                            e.target.style.color = '#64748b';
                                        }}
                                    >
                                        {theme.name}
                                    </button>
                                ))}
                            </div>
                        )}
                        
                        {!view3D && (
                            <button
                                style={{...styles.toggleButton, ...styles.inactiveButton}}
                                onClick={resetZoom}
                                onMouseEnter={(e) => {
                                    e.target.style.background = '#1e293b';
                                    e.target.style.color = '#94a3b8';
                                }}
                                onMouseLeave={(e) => {
                                    e.target.style.background = 'transparent';
                                    e.target.style.color = '#64748b';
                                }}
                            >
                                RESET VIEW
                            </button>
                        )}

                        {view3D && (
                            <button
                                style={{
                                    ...styles.toggleButton,
                                    ...(autoRotate ? styles.activeButton : styles.inactiveButton)
                                }}
                                onClick={() => setAutoRotate(!autoRotate)}
                                onMouseEnter={(e) => {
                                    if (autoRotate) return;
                                    e.target.style.background = '#1e293b';
                                    e.target.style.color = '#94a3b8';
                                }}
                                onMouseLeave={(e) => {
                                    if (autoRotate) return;
                                    e.target.style.background = 'transparent';
                                    e.target.style.color = '#64748b';
                                }}
                            >
                                {autoRotate ? 'STOP ROTATION' : 'AUTO ROTATE'}
                            </button>
                        )}
                    </div>

                    {view3D && (
                        <div style={styles.searchContainer}>
                            <input
                                type="text"
                                placeholder="ENTER TARGET LOCATION..."
                                value={searchCountry}
                                onChange={(e) => setSearchCountry(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && handleCountrySearch()}
                                style={styles.searchInput}
                            />
                            <button
                                onClick={handleCountrySearch}
                                style={styles.searchButton}
                                onMouseEnter={(e) => {
                                    e.target.style.boxShadow = '0 0 25px rgba(37, 99, 235, 0.5)';
                                }}
                                onMouseLeave={(e) => {
                                    e.target.style.boxShadow = '0 0 15px rgba(37, 99, 235, 0.3)';
                                }}
                            >
                                LOCATE TARGET
                            </button>
                        </div>
                    )}

                    {selectedCountry && (
                        <div style={styles.countryLabel}>
                            TARGET: {selectedCountry}
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
                                polygonCapColor={() => 'rgba(30, 58, 138, 0.3)'}
                                polygonSideColor={() => 'rgba(37, 99, 235, 0.1)'}
                                polygonStrokeColor={() => '#1e3a8a'}
                                polygonLabel={({ properties }) => `
                                    <div style="
                                        background: linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(30, 58, 138, 0.95) 100%);
                                        color: white;
                                        padding: 10px 16px;
                                        border-radius: 6px;
                                        font-size: 13px;
                                        font-weight: bold;
                                        max-width: 200px;
                                        border: 1px solid #2563eb;
                                        letter-spacing: 1px;
                                        text-transform: uppercase;
                                    ">
                                        ${properties?.NAME || properties?.name || 'UNKNOWN TERRITORY'}
                                    </div>
                                `}
                                onPolygonClick={handlePolygonClick}
                                
                                pointsData={countries}
                                pointAltitude={0.01}
                                pointColor={d => d.color}
                                pointRadius={isMobile ? 0.15 : 0.2}
                                pointLabel={d => `
                                    <div style="
                                        background: linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(30, 58, 138, 0.95) 100%);
                                        color: white;
                                        padding: 12px 18px;
                                        border-radius: 6px;
                                        font-size: 12px;
                                        font-weight: bold;
                                        border: 1px solid #2563eb;
                                        letter-spacing: 1px;
                                    ">
                                        <div style="text-transform: uppercase; margin-bottom: 4px; font-size: 13px;">${d.name}</div>
                                        <div style="font-size: 10px; color: #94a3b8; margin-bottom: 3px;">${d.type}</div>
                                        <div style="font-size: 11px; color: ${
                                            d.threat === 'HIGH' ? '#ef4444' :
                                            d.threat === 'MEDIUM' ? '#f59e0b' : '#22c55e'
                                        };">THREAT: ${d.threat}</div>
                                    </div>
                                `}
                                onPointClick={handleCountryClick}
                                
                                showAtmosphere={true}
                                atmosphereColor="#2563eb"
                                atmosphereAltitude={0.2}
                                
                                enablePointerInteraction={true}
                                
                                controlsAutoRotate={autoRotate}
                                controlsAutoRotateSpeed={0.5}
                                controlsEnableZoom={true}
                                controlsEnablePan={true}
                                
                                animateIn={true}
                                
                                width={globeSize.width}
                                height={globeSize.height}
                            />
                        ) : (
                            <D3Map />
                        )}

                        {loadingAnalysis && <LoadingOverlay />}
                    </div>

                    {selectedCountry && economicAnalysis[selectedCountry] && showAnalysisModal && renderAnalysisModal()}
                </div>
            </div>

            {/* Media Center Floating Button */}
            <button
                style={styles.mediaCenterButton}
                onClick={() => setShowMediaCenter(true)}
                title="Media Surveillance Center"
                onMouseEnter={(e) => {
                    e.target.style.transform = 'scale(1.1)';
                    e.target.style.boxShadow = '0 0 40px rgba(220, 38, 38, 0.8), 0 4px 25px rgba(0, 0, 0, 0.5)';
                }}
                onMouseLeave={(e) => {
                    e.target.style.transform = 'scale(1)';
                    e.target.style.boxShadow = '0 0 30px rgba(220, 38, 38, 0.6), 0 4px 20px rgba(0, 0, 0, 0.4)';
                }}
            >
                📡
            </button>

            {showConfirmationModal && <ConfirmationModal />}
            {showMediaCenter && <MediaCenterModal />}

            <style>{`
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
                
                @keyframes pulse {
                    0%, 100% { opacity: 1; }
                    50% { opacity: 0.4; }
                }
                
                *::-webkit-scrollbar {
                    width: 10px;
                    height: 10px;
                }
                
                *::-webkit-scrollbar-track {
                    background: #0f172a;
                    border-radius: 5px;
                }
                
                *::-webkit-scrollbar-thumb {
                    background: linear-gradient(135deg, #1e3a8a 0%, #2563eb 100%);
                    border-radius: 5px;
                    border: 2px solid #0f172a;
                }
                
                *::-webkit-scrollbar-thumb:hover {
                    background: linear-gradient(135deg, #2563eb 0%, #3b82f6 100%);
                }
                
                input::placeholder {
                    color: #475569;
                    text-transform: uppercase;
                    letter-spacing: 1px;
                }
                
                button:active {
                    transform: scale(0.98);
                }
                
                .newsCard:hover {
                    border-color: #2563eb !important;
                    box-shadow: 0 0 20px rgba(37, 99, 235, 0.3) !important;
                    transform: translateY(-2px);
                }
                
                .newsLink:hover {
                    color: #60a5fa !important;
                }
                
                .mediaCenterButton:hover {
                    animation: none !important;
                }
                
                .mediaCloseButton:hover {
                    background: rgba(220, 38, 38, 0.2) !important;
                }
            `}</style>
        </div>
    );
}