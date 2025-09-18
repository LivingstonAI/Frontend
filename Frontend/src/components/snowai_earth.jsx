import React, { useEffect, useState, useRef } from "react";
import * as THREE from 'three';
import Header from "./header";
import SideNavs from "./side_navs";

export default function SnowAIEarth() {
    const baseUrl = 'https://backend-production-c0ab.up.railway.app';
    const [viewMode, setViewMode] = useState('2d'); // '2d' or '3d'
    const [selectedCountry, setSelectedCountry] = useState(null);
    const [hoveredCountry, setHoveredCountry] = useState(null);
    const mountRef = useRef(null);
    const sceneRef = useRef(null);
    const rendererRef = useRef(null);
    const cameraRef = useRef(null);
    const earthRef = useRef(null);
    const animationRef = useRef(null);

    // Sample country data with coordinates
    const countries = [
        { name: "United States", lat: 39.8283, lng: -98.5795, code: "US" },
        { name: "Canada", lat: 56.1304, lng: -106.3468, code: "CA" },
        { name: "Brazil", lat: -14.2350, lng: -51.9253, code: "BR" },
        { name: "United Kingdom", lat: 55.3781, lng: -3.4360, code: "GB" },
        { name: "France", lat: 46.2276, lng: 2.2137, code: "FR" },
        { name: "Germany", lat: 51.1657, lng: 10.4515, code: "DE" },
        { name: "Russia", lat: 61.5240, lng: 105.3188, code: "RU" },
        { name: "China", lat: 35.8617, lng: 104.1954, code: "CN" },
        { name: "India", lat: 20.5937, lng: 78.9629, code: "IN" },
        { name: "Japan", lat: 36.2048, lng: 138.2529, code: "JP" },
        { name: "Australia", lat: -25.2744, lng: 133.7751, code: "AU" },
        { name: "South Africa", lat: -30.5595, lng: 22.9375, code: "ZA" },
        { name: "Egypt", lat: 26.8206, lng: 30.8025, code: "EG" },
        { name: "Nigeria", lat: 9.0820, lng: 8.6753, code: "NG" },
        { name: "Argentina", lat: -38.4161, lng: -63.6167, code: "AR" },
        { name: "Mexico", lat: 23.6345, lng: -102.5528, code: "MX" }
    ];

    // Convert lat/lng to 3D coordinates
    const latLngTo3D = (lat, lng, radius = 5) => {
        const phi = (90 - lat) * (Math.PI / 180);
        const theta = (lng + 180) * (Math.PI / 180);
        
        return {
            x: -(radius * Math.sin(phi) * Math.cos(theta)),
            y: radius * Math.cos(phi),
            z: radius * Math.sin(phi) * Math.sin(theta)
        };
    };

    useEffect(() => {
        if (viewMode === '3d' && mountRef.current) {
            init3DScene();
        }
        return () => {
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current);
            }
            if (rendererRef.current) {
                rendererRef.current.dispose();
            }
        };
    }, [viewMode]);

    const init3DScene = () => {
        const width = mountRef.current.clientWidth;
        const height = mountRef.current.clientHeight;

        // Scene setup
        const scene = new THREE.Scene();
        scene.background = new THREE.Color(0x001122);
        sceneRef.current = scene;

        // Camera setup
        const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
        camera.position.z = 12;
        cameraRef.current = camera;

        // Renderer setup
        const renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setSize(width, height);
        renderer.shadowMap.enabled = true;
        renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        rendererRef.current = renderer;

        // Clear previous content
        mountRef.current.innerHTML = '';
        mountRef.current.appendChild(renderer.domElement);

        // Create Earth sphere
        const geometry = new THREE.SphereGeometry(5, 64, 64);
        const material = new THREE.MeshPhongMaterial({
            color: 0x2194ce,
            shininess: 100,
            transparent: true,
            opacity: 0.8
        });
        
        const earth = new THREE.Mesh(geometry, material);
        earth.castShadow = true;
        earth.receiveShadow = true;
        scene.add(earth);
        earthRef.current = earth;

        // Add country markers
        countries.forEach(country => {
            const pos = latLngTo3D(country.lat, country.lng);
            
            // Create marker
            const markerGeometry = new THREE.SphereGeometry(0.05, 8, 8);
            const markerMaterial = new THREE.MeshBasicMaterial({
                color: 0x00ff88,
                transparent: true,
                opacity: 0.8
            });
            
            const marker = new THREE.Mesh(markerGeometry, markerMaterial);
            marker.position.set(pos.x, pos.y, pos.z);
            marker.userData = { country: country.name, code: country.code };
            
            scene.add(marker);
        });

        // Lighting
        const ambientLight = new THREE.AmbientLight(0x404040, 0.6);
        scene.add(ambientLight);
        
        const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
        directionalLight.position.set(10, 10, 5);
        directionalLight.castShadow = true;
        scene.add(directionalLight);

        // Mouse interaction
        const raycaster = new THREE.Raycaster();
        const mouse = new THREE.Vector2();

        const onMouseClick = (event) => {
            const rect = renderer.domElement.getBoundingClientRect();
            mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
            mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

            raycaster.setFromCamera(mouse, camera);
            const intersects = raycaster.intersectObjects(scene.children);

            for (let intersect of intersects) {
                if (intersect.object.userData.country) {
                    setSelectedCountry(intersect.object.userData.country);
                    break;
                }
            }
        };

        renderer.domElement.addEventListener('click', onMouseClick);

        // Animation loop
        const animate = () => {
            animationRef.current = requestAnimationFrame(animate);
            
            if (earthRef.current) {
                earthRef.current.rotation.y += 0.005;
            }
            
            renderer.render(scene, camera);
        };
        animate();

        // Handle resize
        const handleResize = () => {
            const width = mountRef.current.clientWidth;
            const height = mountRef.current.clientHeight;
            
            camera.aspect = width / height;
            camera.updateProjectionMatrix();
            renderer.setSize(width, height);
        };

        window.addEventListener('resize', handleResize);
        
        return () => {
            window.removeEventListener('resize', handleResize);
            renderer.domElement.removeEventListener('click', onMouseClick);
        };
    };

    const handleCountryClick = (countryName) => {
        setSelectedCountry(countryName);
    };

    const styles = `
        .snow-ai-earth-container {
            background: linear-gradient(135deg, #001122 0%, #002244 50%, #003366 100%);
            color: #00ccff;
            min-height: 100vh;
            font-family: 'Orbitron', monospace;
        }

        .header {
            background: rgba(0, 204, 255, 0.1);
            border-bottom: 2px solid #00ccff;
            box-shadow: 0 2px 20px rgba(0, 204, 255, 0.3);
        }

        .main-page-body {
            display: flex;
            height: calc(100vh - 80px);
        }

        .main-body-info {
            flex: 1;
            padding: 20px;
            position: relative;
        }

        .major-upcoming-news-events-header {
            color: #00ffcc;
            font-size: 2.5rem;
            text-align: center;
            text-shadow: 0 0 10px rgba(0, 255, 204, 0.5);
            margin-bottom: 30px;
            font-weight: 300;
            letter-spacing: 2px;
        }

        .earth-controls {
            position: absolute;
            top: 20px;
            right: 20px;
            z-index: 1000;
            display: flex;
            gap: 10px;
        }

        .control-btn {
            background: rgba(0, 204, 255, 0.2);
            border: 2px solid #00ccff;
            color: #00ccff;
            padding: 10px 20px;
            border-radius: 25px;
            cursor: pointer;
            transition: all 0.3s ease;
            font-family: 'Orbitron', monospace;
            font-size: 0.9rem;
            text-transform: uppercase;
            letter-spacing: 1px;
        }

        .control-btn:hover,
        .control-btn.active {
            background: rgba(0, 204, 255, 0.4);
            box-shadow: 0 0 15px rgba(0, 204, 255, 0.6);
            transform: translateY(-2px);
        }

        .earth-viewer {
            position: relative;
            height: 70vh;
            margin: 20px 0;
            border: 2px solid #00ccff;
            border-radius: 15px;
            overflow: hidden;
            box-shadow: 0 0 30px rgba(0, 204, 255, 0.3);
            background: rgba(0, 34, 68, 0.3);
        }

        .earth-2d {
            width: 100%;
            height: 100%;
            background: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 400"><rect width="800" height="400" fill="%23001122"/><ellipse cx="150" cy="200" rx="60" ry="40" fill="%23228B22" opacity="0.7"/><ellipse cx="300" cy="150" rx="80" ry="50" fill="%23228B22" opacity="0.7"/><ellipse cx="450" cy="180" rx="70" ry="45" fill="%23228B22" opacity="0.7"/><ellipse cx="600" cy="120" rx="50" ry="30" fill="%23228B22" opacity="0.7"/><ellipse cx="200" cy="300" rx="40" ry="25" fill="%23228B22" opacity="0.7"/><ellipse cx="500" cy="320" rx="60" ry="35" fill="%23228B22" opacity="0.7"/></svg>') center/cover;
            position: relative;
            cursor: crosshair;
        }

        .country-marker {
            position: absolute;
            width: 12px;
            height: 12px;
            background: #00ff88;
            border: 2px solid #ffffff;
            border-radius: 50%;
            cursor: pointer;
            transition: all 0.3s ease;
            box-shadow: 0 0 10px rgba(0, 255, 136, 0.5);
        }

        .country-marker:hover {
            transform: scale(1.5);
            box-shadow: 0 0 20px rgba(0, 255, 136, 0.8);
        }

        .earth-3d {
            width: 100%;
            height: 100%;
        }

        .country-info {
            position: absolute;
            bottom: 20px;
            left: 20px;
            right: 20px;
            background: rgba(0, 204, 255, 0.1);
            border: 2px solid #00ccff;
            border-radius: 15px;
            padding: 20px;
            backdrop-filter: blur(10px);
            box-shadow: 0 0 20px rgba(0, 204, 255, 0.3);
        }

        .country-info h3 {
            color: #00ffcc;
            margin: 0 0 10px 0;
            font-size: 1.5rem;
            text-shadow: 0 0 5px rgba(0, 255, 204, 0.5);
        }

        .country-info p {
            color: #00ccff;
            margin: 0;
            opacity: 0.8;
        }

        .hud-overlay {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            pointer-events: none;
            border: 1px solid rgba(0, 204, 255, 0.3);
            background: 
                linear-gradient(90deg, transparent 49%, rgba(0, 204, 255, 0.1) 50%, transparent 51%),
                linear-gradient(0deg, transparent 49%, rgba(0, 204, 255, 0.1) 50%, transparent 51%);
            background-size: 50px 50px;
        }

        .coordinates-display {
            position: absolute;
            top: 10px;
            left: 10px;
            background: rgba(0, 0, 0, 0.7);
            color: #00ccff;
            padding: 5px 10px;
            border-radius: 5px;
            font-family: 'Courier New', monospace;
            font-size: 0.8rem;
            border: 1px solid #00ccff;
        }
    `;

    return (
        <div className="snow-ai-earth-container">
            <style>{styles}</style>
            <div className="header">
                <Header />
            </div>
            <div className="main-page-body">
                <SideNavs />
                <div className="main-body-info">
                    <h5 className="major-upcoming-news-events-header">SnowAI Earth</h5>
                    
                    <div className="earth-controls">
                        <button 
                            className={`control-btn ${viewMode === '2d' ? 'active' : ''}`}
                            onClick={() => setViewMode('2d')}
                        >
                            2D Map
                        </button>
                        <button 
                            className={`control-btn ${viewMode === '3d' ? 'active' : ''}`}
                            onClick={() => setViewMode('3d')}
                        >
                            3D Globe
                        </button>
                    </div>

                    <div className="earth-viewer">
                        {viewMode === '2d' ? (
                            <div className="earth-2d">
                                {countries.map((country, index) => (
                                    <div
                                        key={country.code}
                                        className="country-marker"
                                        style={{
                                            left: `${((country.lng + 180) / 360) * 100}%`,
                                            top: `${((90 - country.lat) / 180) * 100}%`
                                        }}
                                        onClick={() => handleCountryClick(country.name)}
                                        onMouseEnter={() => setHoveredCountry(country.name)}
                                        onMouseLeave={() => setHoveredCountry(null)}
                                        title={country.name}
                                    />
                                ))}
                                <div className="hud-overlay" />
                                {hoveredCountry && (
                                    <div className="coordinates-display">
                                        {hoveredCountry}
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="earth-3d" ref={mountRef} />
                        )}
                    </div>

                    {selectedCountry && (
                        <div className="country-info">
                            <h3>{selectedCountry}</h3>
                            <p>Click on countries to explore different nations around the world.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}