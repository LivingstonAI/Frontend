import React, { useEffect, useState, useRef } from "react";
import * as THREE from 'three';
import { Settings, Trash2, RotateCw, Move, Zap, Cog, Fuel, Wrench } from 'lucide-react';

export default function ScientificPlayground() {
    const mountRef = useRef(null);
    const sceneRef = useRef(null);
    const rendererRef = useRef(null);
    const cameraRef = useRef(null);
    const raycasterRef = useRef(new THREE.Raycaster());
    const mouseRef = useRef(new THREE.Vector2());
    const [selectedPart, setSelectedPart] = useState(null);
    const [placedParts, setPlacedParts] = useState([]);
    const [activeTool, setActiveTool] = useState('select');
    const [showProperties, setShowProperties] = useState(false);
    const [selectedObject, setSelectedObject] = useState(null);
    const [isDragging, setIsDragging] = useState(false);
    const [dragOffset, setDragOffset] = useState(new THREE.Vector3());

    // Enhanced parts library with better visuals
    const partLibrary = [
        { 
            id: 'engine', 
            name: 'V8 Engine', 
            icon: <Zap className="w-4 h-4" />,
            color: '#1e40af', 
            size: [2, 1.5, 1.2], 
            params: { power: 350, efficiency: 0.85, torque: 400 } 
        },
        { 
            id: 'wheel', 
            name: 'Racing Wheel', 
            icon: <RotateCw className="w-4 h-4" />,
            color: '#374151', 
            size: [0.8, 0.8, 0.3], 
            params: { diameter: 18, width: 8, pressure: 32 } 
        },
        { 
            id: 'wing', 
            name: 'Aerodynamic Wing', 
            icon: <Move className="w-4 h-4" />,
            color: '#3b82f6', 
            size: [3.5, 0.15, 0.8], 
            params: { liftCoeff: 0.6, dragCoeff: 0.018, angle: 15 } 
        },
        { 
            id: 'fuselage', 
            name: 'Carbon Chassis', 
            icon: <Settings className="w-4 h-4" />,
            color: '#1f2937', 
            size: [4.5, 0.8, 1.2], 
            params: { weight: 450, rigidity: 95, material: 'carbon fiber' } 
        },
        { 
            id: 'propeller', 
            name: 'Turbo Prop', 
            icon: <Cog className="w-4 h-4" />,
            color: '#6b7280', 
            size: [0.3, 2.2, 0.15], 
            params: { blades: 3, diameter: 2.2, pitch: 1.2 } 
        },
        { 
            id: 'tire', 
            name: 'Performance Tire', 
            icon: <RotateCw className="w-4 h-4" />,
            color: '#111827', 
            size: [0.9, 0.9, 0.35], 
            params: { compound: 'soft', tread: 0.8, sidewall: 'reinforced' } 
        },
        { 
            id: 'pipe', 
            name: 'Exhaust Pipe', 
            icon: <Wrench className="w-4 h-4" />,
            color: '#dc2626', 
            size: [0.25, 2.5, 0.25], 
            params: { diameter: 0.25, material: 'titanium', temp: 800 } 
        },
        { 
            id: 'tank', 
            name: 'Fuel Cell', 
            icon: <Fuel className="w-4 h-4" />,
            color: '#f59e0b', 
            size: [1.2, 2.2, 1.2], 
            params: { capacity: 65, fuel: 'premium', pressure: 3.5 } 
        }
    ];

    // Initialize Three.js scene
    useEffect(() => {
        if (!mountRef.current) return;

        // Scene setup
        const scene = new THREE.Scene();
        scene.background = new THREE.Color(0xf8fafc);
        sceneRef.current = scene;

        // Camera setup
        const camera = new THREE.PerspectiveCamera(75, 1000 / 700, 0.1, 1000);
        camera.position.set(8, 6, 8);
        camera.lookAt(0, 0, 0);
        cameraRef.current = camera;

        // Renderer setup
        const renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setSize(1000, 700);
        renderer.shadowMap.enabled = true;
        renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        renderer.setClearColor(0xf8fafc);
        rendererRef.current = renderer;

        // Enhanced ground with blue accent
        const groundGeometry = new THREE.PlaneGeometry(25, 25);
        const groundMaterial = new THREE.MeshLambertMaterial({ 
            color: 0xe2e8f0,
            transparent: true,
            opacity: 0.8
        });
        const ground = new THREE.Mesh(groundGeometry, groundMaterial);
        ground.rotation.x = -Math.PI / 2;
        ground.receiveShadow = true;
        scene.add(ground);

        // Enhanced grid with blue lines
        const gridHelper = new THREE.GridHelper(25, 25, 0x3b82f6, 0xbfdbfe);
        gridHelper.material.opacity = 0.6;
        gridHelper.material.transparent = true;
        scene.add(gridHelper);

        // Better lighting setup
        const ambientLight = new THREE.AmbientLight(0x64748b, 0.5);
        scene.add(ambientLight);

        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight.position.set(15, 15, 10);
        directionalLight.castShadow = true;
        directionalLight.shadow.mapSize.width = 4096;
        directionalLight.shadow.mapSize.height = 4096;
        directionalLight.shadow.camera.near = 0.1;
        directionalLight.shadow.camera.far = 50;
        directionalLight.shadow.camera.left = -15;
        directionalLight.shadow.camera.right = 15;
        directionalLight.shadow.camera.top = 15;
        directionalLight.shadow.camera.bottom = -15;
        scene.add(directionalLight);

        // Add blue rim light
        const rimLight = new THREE.DirectionalLight(0x3b82f6, 0.3);
        rimLight.position.set(-10, 5, -10);
        scene.add(rimLight);

        // Enhanced orbit controls
        let isRotating = false;
        let previousMousePosition = { x: 0, y: 0 };

        const onMouseDown = (event) => {
            if (event.button === 2) { // Right click for rotation
                isRotating = true;
                previousMousePosition = { x: event.clientX, y: event.clientY };
            }
        };

        const onMouseMove = (event) => {
            if (isRotating) {
                const deltaMove = {
                    x: event.clientX - previousMousePosition.x,
                    y: event.clientY - previousMousePosition.y
                };

                const spherical = new THREE.Spherical();
                spherical.setFromVector3(camera.position);
                spherical.theta -= deltaMove.x * 0.01;
                spherical.phi += deltaMove.y * 0.01;
                spherical.phi = Math.max(0.1, Math.min(Math.PI - 0.1, spherical.phi));

                camera.position.setFromSpherical(spherical);
                camera.lookAt(0, 0, 0);
                previousMousePosition = { x: event.clientX, y: event.clientY };
            }
        };

        const onMouseUp = () => {
            isRotating = false;
        };

        const onWheel = (event) => {
            const scale = event.deltaY > 0 ? 1.1 : 0.9;
            camera.position.multiplyScalar(scale);
            camera.position.clampLength(3, 20);
        };

        const onContextMenu = (event) => {
            event.preventDefault();
        };

        renderer.domElement.addEventListener('mousedown', onMouseDown);
        renderer.domElement.addEventListener('mousemove', onMouseMove);
        renderer.domElement.addEventListener('mouseup', onMouseUp);
        renderer.domElement.addEventListener('wheel', onWheel);
        renderer.domElement.addEventListener('contextmenu', onContextMenu);

        mountRef.current.appendChild(renderer.domElement);

        // Animation loop
        const animate = () => {
            requestAnimationFrame(animate);
            
            // Add subtle rotation to propellers
            scene.traverse((child) => {
                if (child.userData.id === 'propeller') {
                    child.rotation.y += 0.1;
                }
            });
            
            renderer.render(scene, camera);
        };
        animate();

        // Cleanup
        return () => {
            if (mountRef.current && renderer.domElement) {
                mountRef.current.removeChild(renderer.domElement);
            }
            renderer.dispose();
        };
    }, []);

    // Create enhanced 3D parts
    const createPart = (partData, position = [0, 0, 0]) => {
        const group = new THREE.Group();
        const [width, height, depth] = partData.size;

        let mainGeometry;
        let materials = [];

        switch (partData.id) {
            case 'engine':
                // Engine block
                mainGeometry = new THREE.BoxGeometry(width, height, depth);
                materials = [
                    new THREE.MeshPhongMaterial({ color: partData.color, shininess: 100 }),
                    new THREE.MeshPhongMaterial({ color: 0x1e3a8a, shininess: 100 }),
                    new THREE.MeshPhongMaterial({ color: 0x1e40af, shininess: 100 }),
                    new THREE.MeshPhongMaterial({ color: 0x1e3a8a, shininess: 100 }),
                    new THREE.MeshPhongMaterial({ color: partData.color, shininess: 100 }),
                    new THREE.MeshPhongMaterial({ color: 0x1e3a8a, shininess: 100 })
                ];
                break;

            case 'wheel':
            case 'tire':
                // Wheel with rim
                const wheelGeometry = new THREE.CylinderGeometry(width/2, width/2, depth, 16);
                const rimGeometry = new THREE.CylinderGeometry(width/2 - 0.1, width/2 - 0.1, depth + 0.05, 16);
                
                const wheelMesh = new THREE.Mesh(wheelGeometry, new THREE.MeshPhongMaterial({ color: partData.color }));
                const rimMesh = new THREE.Mesh(rimGeometry, new THREE.MeshPhongMaterial({ color: 0x94a3b8, shininess: 100 }));
                
                group.add(wheelMesh);
                group.add(rimMesh);
                break;

            case 'wing':
                // Aerodynamic wing shape
                const wingShape = new THREE.Shape();
                wingShape.moveTo(0, 0);
                wingShape.lineTo(width, 0);
                wingShape.lineTo(width * 0.8, depth);
                wingShape.lineTo(width * 0.1, depth);
                wingShape.lineTo(0, 0);
                
                const extrudeSettings = { depth: height, bevelEnabled: true, bevelSegments: 2, steps: 2, bevelSize: 0.02, bevelThickness: 0.02 };
                mainGeometry = new THREE.ExtrudeGeometry(wingShape, extrudeSettings);
                materials = new THREE.MeshPhongMaterial({ color: partData.color, shininess: 80 });
                break;

            case 'propeller':
                // Propeller with blades
                const hubGeometry = new THREE.CylinderGeometry(0.15, 0.15, 0.2, 8);
                const hubMesh = new THREE.Mesh(hubGeometry, new THREE.MeshPhongMaterial({ color: 0x374151, shininess: 100 }));
                
                for (let i = 0; i < 3; i++) {
                    const bladeGeometry = new THREE.BoxGeometry(0.1, height/2, 0.05);
                    const bladeMesh = new THREE.Mesh(bladeGeometry, new THREE.MeshPhongMaterial({ color: partData.color, shininess: 80 }));
                    bladeMesh.position.y = height/4;
                    bladeMesh.rotation.z = (i * Math.PI * 2) / 3;
                    group.add(bladeMesh);
                }
                group.add(hubMesh);
                break;

            case 'pipe':
                // Exhaust pipe with flare
                const pipeGeometry = new THREE.CylinderGeometry(width/2, width/2, height * 0.8, 12);
                const flareGeometry = new THREE.CylinderGeometry(width/2 * 1.3, width/2, height * 0.2, 12);
                
                const pipeMesh = new THREE.Mesh(pipeGeometry, new THREE.MeshPhongMaterial({ color: partData.color, shininess: 100 }));
                const flareMesh = new THREE.Mesh(flareGeometry, new THREE.MeshPhongMaterial({ color: 0xef4444, shininess: 100 }));
                
                flareMesh.position.y = height * 0.4;
                group.add(pipeMesh);
                group.add(flareMesh);
                break;

            case 'tank':
                // Fuel tank with caps
                const tankGeometry = new THREE.CylinderGeometry(width/2, width/2, height, 16);
                const capGeometry = new THREE.CylinderGeometry(width/2 + 0.05, width/2 + 0.05, 0.1, 16);
                
                const tankMesh = new THREE.Mesh(tankGeometry, new THREE.MeshPhongMaterial({ color: partData.color, shininess: 60 }));
                const topCapMesh = new THREE.Mesh(capGeometry, new THREE.MeshPhongMaterial({ color: 0x374151, shininess: 100 }));
                const bottomCapMesh = new THREE.Mesh(capGeometry, new THREE.MeshPhongMaterial({ color: 0x374151, shininess: 100 }));
                
                topCapMesh.position.y = height/2 + 0.05;
                bottomCapMesh.position.y = -height/2 - 0.05;
                group.add(tankMesh);
                group.add(topCapMesh);
                group.add(bottomCapMesh);
                break;

            default:
                mainGeometry = new THREE.BoxGeometry(width, height, depth);
                materials = new THREE.MeshPhongMaterial({ color: partData.color, shininess: 80 });
        }

        if (mainGeometry) {
            const mesh = new THREE.Mesh(mainGeometry, materials);
            group.add(mesh);
        }

        group.position.set(...position);
        group.castShadow = true;
        group.receiveShadow = true;
        group.userData = { ...partData, params: { ...partData.params } };

        return group;
    };

    // Handle part placement
    const handlePartPlacement = (partData) => {
        if (!sceneRef.current) return;

        const randomX = (Math.random() - 0.5) * 10;
        const randomZ = (Math.random() - 0.5) * 10;
        const position = [randomX, 1, randomZ];

        const part = createPart(partData, position);
        sceneRef.current.add(part);

        const newPart = {
            id: Date.now(),
            mesh: part,
            type: partData.id,
            name: partData.name,
            position: position,
            params: { ...partData.params }
        };

        setPlacedParts(prev => [...prev, newPart]);
    };

    // Enhanced click handling with drag support
    const handleCanvasClick = (event) => {
        const rect = event.target.getBoundingClientRect();
        mouseRef.current.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
        mouseRef.current.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

        raycasterRef.current.setFromCamera(mouseRef.current, cameraRef.current);
        const intersects = raycasterRef.current.intersectObjects(sceneRef.current.children, true);

        if (intersects.length > 0) {
            let selectedMesh = intersects[0].object;
            
            // Find the parent group if clicking on a child mesh
            while (selectedMesh.parent && !selectedMesh.userData.id) {
                selectedMesh = selectedMesh.parent;
            }

            if (selectedMesh.userData.id) {
                setSelectedObject(selectedMesh);
                setShowProperties(true);
                
                // Setup for potential dragging
                const intersectionPoint = intersects[0].point;
                setDragOffset(selectedMesh.position.clone().sub(intersectionPoint));
            }
        } else {
            setSelectedObject(null);
            setShowProperties(false);
        }
    };

    // Update part parameters
    const updatePartParam = (paramName, value) => {
        if (!selectedObject) return;

        selectedObject.userData.params[paramName] = value;
        setPlacedParts(prev => 
            prev.map(part => 
                part.mesh === selectedObject 
                    ? { ...part, params: { ...part.params, [paramName]: value } }
                    : part
            )
        );
    };

    // Delete selected part
    const deleteSelectedPart = () => {
        if (!selectedObject || !sceneRef.current) return;

        sceneRef.current.remove(selectedObject);
        setPlacedParts(prev => prev.filter(part => part.mesh !== selectedObject));
        setSelectedObject(null);
        setShowProperties(false);
    };

    // Clear all parts
    const clearAllParts = () => {
        if (!sceneRef.current) return;

        placedParts.forEach(part => {
            sceneRef.current.remove(part.mesh);
        });
        setPlacedParts([]);
        setSelectedObject(null);
        setShowProperties(false);
    };

    return (
        <div className="w-full h-screen bg-gradient-to-br from-blue-50 to-white flex">
            {/* Left Sidebar - Parts Library */}
            <div className="w-80 bg-white shadow-xl border-r border-blue-100 overflow-y-auto">
                <div className="p-6 border-b border-blue-100 bg-gradient-to-r from-blue-500 to-blue-600">
                    <h3 className="text-xl font-bold text-white mb-2">Parts Library</h3>
                    <p className="text-blue-100 text-sm">Click to add parts to your design</p>
                </div>
                
                <div className="p-4 space-y-3">
                    {partLibrary.map(part => (
                        <div
                            key={part.id}
                            onClick={() => handlePartPlacement(part)}
                            className="group p-4 bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl cursor-pointer hover:from-blue-50 hover:to-blue-100 transition-all duration-300 border-2 border-transparent hover:border-blue-200 shadow-sm hover:shadow-md transform hover:scale-105"
                        >
                            <div className="flex items-center space-x-4">
                                <div className="p-2 rounded-lg bg-white shadow-sm group-hover:bg-blue-500 group-hover:text-white transition-colors">
                                    {part.icon}
                                </div>
                                <div className="flex-1">
                                    <span className="font-semibold text-gray-800 group-hover:text-blue-800">{part.name}</span>
                                    <div className="flex items-center space-x-2 mt-1">
                                        <div 
                                            className="w-3 h-3 rounded-full shadow-sm"
                                            style={{ backgroundColor: part.color }}
                                        ></div>
                                        <span className="text-xs text-gray-500">
                                            {part.size[0]}×{part.size[1]}×{part.size[2]}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Tools Section */}
                <div className="p-4 border-t border-blue-100">
                    <h4 className="font-semibold text-gray-800 mb-3 flex items-center">
                        <Settings className="w-4 h-4 mr-2 text-blue-500" />
                        Tools
                    </h4>
                    <div className="space-y-2">
                        <button
                            onClick={() => setActiveTool('select')}
                            className={`w-full p-3 rounded-lg font-medium transition-all duration-200 ${
                                activeTool === 'select' 
                                    ? 'bg-blue-500 text-white shadow-md' 
                                    : 'bg-gray-100 text-gray-700 hover:bg-blue-50 hover:text-blue-700'
                            }`}
                        >
                            Select & Move Tool
                        </button>
                        <button
                            onClick={clearAllParts}
                            className="w-full p-3 rounded-lg font-medium bg-red-500 text-white hover:bg-red-600 transition-colors shadow-sm hover:shadow-md flex items-center justify-center space-x-2"
                        >
                            <Trash2 className="w-4 h-4" />
                            <span>Clear All</span>
                        </button>
                    </div>
                </div>

                {/* Stats Section */}
                <div className="p-4 border-t border-blue-100">
                    <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-4 text-white">
                        <h4 className="font-semibold mb-3">Build Statistics</h4>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                            <div className="bg-white bg-opacity-20 rounded-lg p-2">
                                <div className="font-medium">Total Parts</div>
                                <div className="text-2xl font-bold">{placedParts.length}</div>
                            </div>
                            <div className="bg-white bg-opacity-20 rounded-lg p-2">
                                <div className="font-medium">Engines</div>
                                <div className="text-2xl font-bold">{placedParts.filter(p => p.type === 'engine').length}</div>
                            </div>
                            <div className="bg-white bg-opacity-20 rounded-lg p-2">
                                <div className="font-medium">Wheels</div>
                                <div className="text-2xl font-bold">{placedParts.filter(p => p.type === 'wheel').length}</div>
                            </div>
                            <div className="bg-white bg-opacity-20 rounded-lg p-2">
                                <div className="font-medium">Wings</div>
                                <div className="text-2xl font-bold">{placedParts.filter(p => p.type === 'wing').length}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col">
                {/* Header */}
                <div className="bg-white shadow-sm border-b border-blue-100 p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-800">Science Playground</h1>
                            <p className="text-gray-600 mt-1">Design and build your mechanical creations</p>
                        </div>
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                            <div className="flex items-center space-x-2">
                                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                                <span>Left Click: Select</span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <div className="w-3 h-3 bg-gray-500 rounded-full"></div>
                                <span>Right Click: Rotate View</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex-1 flex">
                    {/* 3D Viewport */}
                    <div className="flex-1 bg-gradient-to-br from-blue-50 to-white p-6">
                        <div className="h-full flex items-center justify-center">
                            <div 
                                ref={mountRef}
                                onClick={handleCanvasClick}
                                className="border-2 border-blue-200 rounded-2xl overflow-hidden cursor-pointer shadow-2xl bg-white"
                                style={{ filter: 'drop-shadow(0 25px 25px rgb(0 0 0 / 0.15))' }}
                            ></div>
                        </div>
                    </div>

                    {/* Properties Panel */}
                    {showProperties && selectedObject && (
                        <div className="w-96 bg-white shadow-xl border-l border-blue-100 overflow-y-auto">
                            <div className="p-6 border-b border-blue-100 bg-gradient-to-r from-blue-500 to-blue-600">
                                <h3 className="text-xl font-bold text-white mb-2">Properties</h3>
                                <p className="text-blue-100 text-sm">Configure selected part</p>
                            </div>
                            
                            <div className="p-6 space-y-6">
                                {/* Part Info */}
                                <div className="bg-blue-50 rounded-xl p-4">
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Part Type
                                    </label>
                                    <div className="flex items-center space-x-3">
                                        <div className="p-2 bg-white rounded-lg shadow-sm">
                                            {partLibrary.find(p => p.id === selectedObject.userData.id)?.icon}
                                        </div>
                                        <span className="font-medium text-gray-800">
                                            {selectedObject.userData.name}
                                        </span>
                                    </div>
                                </div>

                                {/* Parameters */}
                                <div className="space-y-4">
                                    {Object.entries(selectedObject.userData.params).map(([key, value]) => (
                                        <div key={key} className="space-y-2">
                                            <label className="block text-sm font-semibold text-gray-700">
                                                {key.charAt(0).toUpperCase() + key.slice(1)}
                                            </label>
                                            {typeof value === 'number' ? (
                                                <input
                                                    type="number"
                                                    value={value}
                                                    onChange={(e) => updatePartParam(key, parseFloat(e.target.value) || 0)}
                                                    className="w-full p-3 border-2 border-blue-200 rounded-lg focus:border-blue-500 focus:outline-none transition-colors bg-white"
                                                    step="0.1"
                                                />
                                            ) : (
                                                <input
                                                    type="text"
                                                    value={value}
                                                    onChange={(e) => updatePartParam(key, e.target.value)}
                                                    className="w-full p-3 border-2 border-blue-200 rounded-lg focus:border-blue-500 focus:outline-none transition-colors bg-white"
                                                />
                                            )}
                                        </div>
                                    ))}
                                </div>

                                {/* Actions */}
                                <div className="pt-4 border-t border-blue-100">
                                    <button
                                        onClick={deleteSelectedPart}
                                        className="w-full p-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-medium shadow-sm hover:shadow-md flex items-center justify-center space-x-2"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                        <span>Delete Part</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}