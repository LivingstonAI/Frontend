import React, { useEffect, useState, useRef } from "react";
import * as THREE from 'three';

export default function ScientificPlayground() {
    const mountRef = useRef(null);
    const sceneRef = useRef(null);
    const rendererRef = useRef(null);
    const cameraRef = useRef(null);
    const controlsRef = useRef(null);
    const raycasterRef = useRef(new THREE.Raycaster());
    const mouseRef = useRef(new THREE.Vector2());
    const [selectedPart, setSelectedPart] = useState(null);
    const [placedParts, setPlacedParts] = useState([]);
    const [activeTool, setActiveTool] = useState('select');
    const [showProperties, setShowProperties] = useState(false);
    const [selectedObject, setSelectedObject] = useState(null);

    // Available parts library
    const partLibrary = [
        { id: 'engine', name: 'Engine', color: '#ff4444', size: [2, 1, 1], params: { power: 100, efficiency: 0.8 } },
        { id: 'wheel', name: 'Wheel', color: '#333333', size: [0.5, 0.5, 0.5], params: { diameter: 1, friction: 0.7 } },
        { id: 'wing', name: 'Wing', color: '#4444ff', size: [3, 0.1, 0.5], params: { liftCoeff: 0.5, dragCoeff: 0.02 } },
        { id: 'fuselage', name: 'Fuselage', color: '#888888', size: [4, 0.5, 0.5], params: { weight: 500, capacity: 100 } },
        { id: 'propeller', name: 'Propeller', color: '#666666', size: [0.2, 2, 0.1], params: { diameter: 2, pitch: 0.8 } },
        { id: 'tire', name: 'Tire', color: '#222222', size: [0.8, 0.8, 0.3], params: { pressure: 35, tread: 0.5 } },
        { id: 'pipe', name: 'Pipe', color: '#cd7f32', size: [0.2, 2, 0.2], params: { diameter: 0.2, material: 'steel' } },
        { id: 'tank', name: 'Fuel Tank', color: '#ff8800', size: [1, 2, 1], params: { capacity: 50, fuel: 'gasoline' } }
    ];

    // Initialize Three.js scene
    useEffect(() => {
        if (!mountRef.current) return;

        // Scene setup
        const scene = new THREE.Scene();
        scene.background = new THREE.Color(0xf0f0f0);
        sceneRef.current = scene;

        // Camera setup
        const camera = new THREE.PerspectiveCamera(75, 800 / 600, 0.1, 1000);
        camera.position.set(5, 5, 5);
        camera.lookAt(0, 0, 0);
        cameraRef.current = camera;

        // Renderer setup
        const renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setSize(800, 600);
        renderer.shadowMap.enabled = true;
        renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        rendererRef.current = renderer;

        // Ground plane
        const groundGeometry = new THREE.PlaneGeometry(20, 20);
        const groundMaterial = new THREE.MeshLambertMaterial({ color: 0xcccccc });
        const ground = new THREE.Mesh(groundGeometry, groundMaterial);
        ground.rotation.x = -Math.PI / 2;
        ground.receiveShadow = true;
        scene.add(ground);

        // Grid helper
        const gridHelper = new THREE.GridHelper(20, 20, 0x888888, 0xaaaaaa);
        scene.add(gridHelper);

        // Lighting
        const ambientLight = new THREE.AmbientLight(0x404040, 0.4);
        scene.add(ambientLight);

        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight.position.set(10, 10, 10);
        directionalLight.castShadow = true;
        directionalLight.shadow.mapSize.width = 2048;
        directionalLight.shadow.mapSize.height = 2048;
        scene.add(directionalLight);

        // Simple orbit controls
        let isDragging = false;
        let previousMousePosition = { x: 0, y: 0 };

        const onMouseDown = (event) => {
            isDragging = true;
            previousMousePosition = { x: event.clientX, y: event.clientY };
        };

        const onMouseMove = (event) => {
            if (isDragging) {
                const deltaMove = {
                    x: event.clientX - previousMousePosition.x,
                    y: event.clientY - previousMousePosition.y
                };

                const deltaRotationQuaternion = new THREE.Quaternion()
                    .setFromEuler(new THREE.Euler(
                        deltaMove.y * 0.01,
                        deltaMove.x * 0.01,
                        0,
                        'XYZ'
                    ));

                camera.quaternion.multiplyQuaternions(deltaRotationQuaternion, camera.quaternion);
                previousMousePosition = { x: event.clientX, y: event.clientY };
            }
        };

        const onMouseUp = () => {
            isDragging = false;
        };

        const onWheel = (event) => {
            const scale = event.deltaY > 0 ? 1.1 : 0.9;
            camera.position.multiplyScalar(scale);
        };

        renderer.domElement.addEventListener('mousedown', onMouseDown);
        renderer.domElement.addEventListener('mousemove', onMouseMove);
        renderer.domElement.addEventListener('mouseup', onMouseUp);
        renderer.domElement.addEventListener('wheel', onWheel);

        mountRef.current.appendChild(renderer.domElement);

        // Animation loop
        const animate = () => {
            requestAnimationFrame(animate);
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

    // Create 3D part from library item
    const createPart = (partData, position = [0, 0, 0]) => {
        let geometry;
        const [width, height, depth] = partData.size;

        switch (partData.id) {
            case 'wheel':
            case 'tire':
                geometry = new THREE.CylinderGeometry(width/2, width/2, depth, 16);
                break;
            case 'propeller':
                geometry = new THREE.BoxGeometry(width, height, depth);
                break;
            case 'pipe':
                geometry = new THREE.CylinderGeometry(width/2, width/2, height, 8);
                break;
            default:
                geometry = new THREE.BoxGeometry(width, height, depth);
        }

        const material = new THREE.MeshLambertMaterial({ color: partData.color });
        const mesh = new THREE.Mesh(geometry, material);
        mesh.position.set(...position);
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        mesh.userData = { ...partData, params: { ...partData.params } };

        return mesh;
    };

    // Handle part placement
    const handlePartPlacement = (partData) => {
        if (!sceneRef.current) return;

        const randomX = (Math.random() - 0.5) * 8;
        const randomZ = (Math.random() - 0.5) * 8;
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

    // Handle part selection
    const handleCanvasClick = (event) => {
        if (activeTool !== 'select') return;

        const rect = event.target.getBoundingClientRect();
        mouseRef.current.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
        mouseRef.current.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

        raycasterRef.current.setFromCamera(mouseRef.current, cameraRef.current);
        const intersects = raycasterRef.current.intersectObjects(sceneRef.current.children);

        if (intersects.length > 0) {
            const selectedMesh = intersects[0].object;
            if (selectedMesh.userData.id) {
                setSelectedObject(selectedMesh);
                setShowProperties(true);
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
        <div className="w-full h-screen bg-gray-100 flex">
            {/* Left Sidebar - Parts Library */}
            <div className="w-64 bg-white shadow-lg p-4 overflow-y-auto">
                <h3 className="text-lg font-bold mb-4 text-gray-800">Parts Library</h3>
                <div className="space-y-2">
                    {partLibrary.map(part => (
                        <div
                            key={part.id}
                            onClick={() => handlePartPlacement(part)}
                            className="p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-blue-50 transition-colors border-2 border-transparent hover:border-blue-300"
                        >
                            <div className="flex items-center space-x-3">
                                <div 
                                    className="w-4 h-4 rounded"
                                    style={{ backgroundColor: part.color }}
                                ></div>
                                <span className="text-sm font-medium">{part.name}</span>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Tools */}
                <div className="mt-6">
                    <h4 className="text-md font-semibold mb-3 text-gray-700">Tools</h4>
                    <div className="space-y-2">
                        <button
                            onClick={() => setActiveTool('select')}
                            className={`w-full p-2 rounded text-sm ${
                                activeTool === 'select' 
                                    ? 'bg-blue-500 text-white' 
                                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                            }`}
                        >
                            Select Tool
                        </button>
                        <button
                            onClick={clearAllParts}
                            className="w-full p-2 rounded text-sm bg-red-500 text-white hover:bg-red-600"
                        >
                            Clear All
                        </button>
                    </div>
                </div>

                {/* Stats */}
                <div className="mt-6 p-3 bg-gray-50 rounded-lg">
                    <h4 className="text-sm font-semibold text-gray-700 mb-2">Build Stats</h4>
                    <div className="text-xs text-gray-600">
                        <div>Parts: {placedParts.length}</div>
                        <div>Engines: {placedParts.filter(p => p.type === 'engine').length}</div>
                        <div>Wheels: {placedParts.filter(p => p.type === 'wheel').length}</div>
                    </div>
                </div>
            </div>

            {/* Main 3D Viewport */}
            <div className="flex-1 flex flex-col">
                <div className="bg-white shadow-sm p-4 border-b">
                    <h1 className="text-xl font-bold text-gray-800">Science Playground</h1>
                    <p className="text-sm text-gray-600">Click parts from the library to place them. Use select tool to modify properties.</p>
                </div>

                <div className="flex-1 flex">
                    <div className="flex-1 flex items-center justify-center bg-gray-50">
                        <div 
                            ref={mountRef}
                            onClick={handleCanvasClick}
                            className="border-2 border-gray-300 rounded-lg overflow-hidden cursor-pointer"
                        ></div>
                    </div>

                    {/* Right Properties Panel */}
                    {showProperties && selectedObject && (
                        <div className="w-80 bg-white shadow-lg p-4 border-l">
                            <h3 className="text-lg font-bold mb-4 text-gray-800">Properties</h3>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Part Type
                                    </label>
                                    <div className="p-2 bg-gray-50 rounded text-sm">
                                        {selectedObject.userData.name}
                                    </div>
                                </div>

                                {/* Dynamic parameter controls */}
                                {Object.entries(selectedObject.userData.params).map(([key, value]) => (
                                    <div key={key}>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            {key.charAt(0).toUpperCase() + key.slice(1)}
                                        </label>
                                        {typeof value === 'number' ? (
                                            <input
                                                type="number"
                                                value={value}
                                                onChange={(e) => updatePartParam(key, parseFloat(e.target.value) || 0)}
                                                className="w-full p-2 border border-gray-300 rounded text-sm"
                                                step="0.1"
                                            />
                                        ) : (
                                            <input
                                                type="text"
                                                value={value}
                                                onChange={(e) => updatePartParam(key, e.target.value)}
                                                className="w-full p-2 border border-gray-300 rounded text-sm"
                                            />
                                        )}
                                    </div>
                                ))}

                                <button
                                    onClick={deleteSelectedPart}
                                    className="w-full p-2 bg-red-500 text-white rounded hover:bg-red-600 text-sm"
                                >
                                    Delete Part
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}