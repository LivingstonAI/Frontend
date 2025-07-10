import React, { useState, useRef, useEffect } from 'react';
import { Wrench, Car, Plane, Settings, Trash2, RotateCcw, Play, Pause, Zap, Gauge, Cog, Wind, Fuel, Cpu, Square, Circle, Triangle } from 'lucide-react';
import * as THREE from 'three';

const PARTS_LIBRARY = {
  engines: [
    { id: 'engine-1', name: 'V8 Engine', type: 'engine', color: '#dc2626', params: { power: 300, weight: 150, efficiency: 0.8 } },
    { id: 'engine-2', name: 'Electric Motor', type: 'motor', color: '#2563eb', params: { power: 200, weight: 50, efficiency: 0.95 } },
    { id: 'engine-3', name: 'Jet Engine', type: 'jet', color: '#ea580c', params: { power: 1000, weight: 200, efficiency: 0.7 } }
  ],
  wheels: [
    { id: 'wheel-1', name: 'Car Wheel', type: 'wheel', color: '#374151', params: { diameter: 24, width: 8, grip: 0.8 } },
    { id: 'wheel-2', name: 'Motorcycle Wheel', type: 'wheel', color: '#1f2937', params: { diameter: 18, width: 4, grip: 0.9 } },
    { id: 'wheel-3', name: 'Truck Wheel', type: 'wheel', color: '#6b7280', params: { diameter: 32, width: 12, grip: 0.7 } }
  ],
  wings: [
    { id: 'wing-1', name: 'Aircraft Wing', type: 'wing', color: '#0ea5e9', params: { span: 200, chord: 50, angle: 0 } },
    { id: 'wing-2', name: 'Fighter Wing', type: 'wing', color: '#64748b', params: { span: 150, chord: 40, angle: 5 } },
    { id: 'wing-3', name: 'Glider Wing', type: 'wing', color: '#16a34a', params: { span: 300, chord: 60, angle: -2 } }
  ],
  misc: [
    { id: 'fuel-tank', name: 'Fuel Tank', type: 'tank', color: '#eab308', params: { capacity: 50, weight: 10, type: 'gasoline' } },
    { id: 'chassis', name: 'Chassis', type: 'chassis', color: '#71717a', params: { length: 150, width: 60, strength: 100 } },
    { id: 'propeller', name: 'Propeller', type: 'propeller', color: '#d97706', params: { diameter: 80, blades: 4, pitch: 45 } }
  ]
};

// 3D Part Component
const Part3D = ({ part, isSelected, onClick }) => {
  const mountRef = useRef(null);
  const sceneRef = useRef(null);
  const rendererRef = useRef(null);
  const meshRef = useRef(null);

  useEffect(() => {
    if (!mountRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    
    renderer.setSize(64, 64);
    renderer.setClearColor(0x000000, 0);
    mountRef.current.appendChild(renderer.domElement);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(1, 1, 1);
    scene.add(directionalLight);

    // Create geometry based on part type
    let geometry, material;
    
    switch (part.type) {
      case 'engine':
        geometry = new THREE.BoxGeometry(1, 0.8, 1.2);
        material = new THREE.MeshPhongMaterial({ color: part.color });
        // Add cylinder for engine block detail
        const cylinderGeometry = new THREE.CylinderGeometry(0.3, 0.3, 0.6, 8);
        const cylinderMaterial = new THREE.MeshPhongMaterial({ color: '#444444' });
        const cylinder = new THREE.Mesh(cylinderGeometry, cylinderMaterial);
        cylinder.position.set(0, 0.2, 0);
        cylinder.rotation.x = Math.PI / 2;
        scene.add(cylinder);
        break;
        
      case 'motor':
        geometry = new THREE.CylinderGeometry(0.5, 0.5, 1, 16);
        material = new THREE.MeshPhongMaterial({ color: part.color });
        break;
        
      case 'jet':
        geometry = new THREE.ConeGeometry(0.4, 1.5, 16);
        material = new THREE.MeshPhongMaterial({ color: part.color });
        break;
        
      case 'wheel':
        geometry = new THREE.CylinderGeometry(0.6, 0.6, 0.3, 16);
        material = new THREE.MeshPhongMaterial({ color: part.color });
        // Add rim detail
        const rimGeometry = new THREE.TorusGeometry(0.4, 0.1, 8, 16);
        const rimMaterial = new THREE.MeshPhongMaterial({ color: '#888888' });
        const rim = new THREE.Mesh(rimGeometry, rimMaterial);
        rim.rotation.x = Math.PI / 2;
        scene.add(rim);
        break;
        
      case 'wing':
        geometry = new THREE.BoxGeometry(2, 0.1, 0.5);
        material = new THREE.MeshPhongMaterial({ color: part.color });
        break;
        
      case 'tank':
        geometry = new THREE.CylinderGeometry(0.4, 0.4, 1, 16);
        material = new THREE.MeshPhongMaterial({ color: part.color });
        break;
        
      case 'chassis':
        geometry = new THREE.BoxGeometry(2, 0.2, 1);
        material = new THREE.MeshPhongMaterial({ color: part.color });
        break;
        
      case 'propeller':
        geometry = new THREE.BoxGeometry(1.5, 0.05, 0.2);
        material = new THREE.MeshPhongMaterial({ color: part.color });
        // Add second blade
        const blade2Geometry = new THREE.BoxGeometry(0.2, 0.05, 1.5);
        const blade2Material = new THREE.MeshPhongMaterial({ color: part.color });
        const blade2 = new THREE.Mesh(blade2Geometry, blade2Material);
        scene.add(blade2);
        break;
        
      default:
        geometry = new THREE.BoxGeometry(1, 1, 1);
        material = new THREE.MeshPhongMaterial({ color: part.color });
    }

    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);
    meshRef.current = mesh;

    camera.position.set(2, 2, 2);
    camera.lookAt(0, 0, 0);

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      if (meshRef.current) {
        meshRef.current.rotation.y += 0.01;
      }
      renderer.render(scene, camera);
    };
    animate();

    sceneRef.current = scene;
    rendererRef.current = renderer;

    return () => {
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [part.type, part.color]);

  const containerStyle = {
    position: 'absolute',
    left: `${part.x}px`,
    top: `${part.y}px`,
    width: '64px',
    height: '64px',
    cursor: 'pointer',
    transform: `rotate(${part.rotation}deg)`,
    transition: 'all 0.2s ease',
    filter: isSelected ? 'drop-shadow(0 0 8px rgba(59, 130, 246, 0.8))' : 'none',
    zIndex: isSelected ? 10 : 1
  };

  return (
    <div style={containerStyle} onClick={onClick}>
      <div ref={mountRef} style={{ width: '64px', height: '64px' }} />
    </div>
  );
};

export default function ScientificPlayground() {
  const [selectedCategory, setSelectedCategory] = useState('engines');
  const [placedParts, setPlacedParts] = useState([]);
  const [selectedPart, setSelectedPart] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [isSimulating, setIsSimulating] = useState(false);
  const [showParameters, setShowParameters] = useState(false);
  const canvasRef = useRef(null);

  const handleDragStart = (e, part) => {
    setIsDragging(true);
    const rect = e.currentTarget.getBoundingClientRect();
    setDragOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
    setSelectedPart(part);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    if (!selectedPart || !isDragging) return;

    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left - dragOffset.x;
    const y = e.clientY - rect.top - dragOffset.y;

    const newPart = {
      ...selectedPart,
      id: `${selectedPart.id}-${Date.now()}`,
      x: Math.max(0, Math.min(x, rect.width - 64)),
      y: Math.max(0, Math.min(y, rect.height - 64)),
      rotation: 0
    };

    setPlacedParts([...placedParts, newPart]);
    setIsDragging(false);
    setSelectedPart(null);
  };

  const handlePartClick = (part) => {
    setSelectedPart(part);
    setShowParameters(true);
  };

  const updatePartParameter = (partId, param, value) => {
    setPlacedParts(parts =>
      parts.map(part =>
        part.id === partId
          ? { ...part, params: { ...part.params, [param]: value } }
          : part
      )
    );
  };

  const deletePart = (partId) => {
    setPlacedParts(parts => parts.filter(part => part.id !== partId));
    setSelectedPart(null);
    setShowParameters(false);
  };

  const clearCanvas = () => {
    setPlacedParts([]);
    setSelectedPart(null);
    setShowParameters(false);
  };

  const calculateMachineStats = () => {
    const engines = placedParts.filter(part => part.id.includes('engine'));
    const wheels = placedParts.filter(part => part.id.includes('wheel'));
    const wings = placedParts.filter(part => part.id.includes('wing'));
    
    const totalPower = engines.reduce((sum, engine) => sum + engine.params.power, 0);
    const totalWeight = placedParts.reduce((sum, part) => sum + (part.params.weight || 10), 0);
    const efficiency = engines.length > 0 ? engines.reduce((sum, engine) => sum + engine.params.efficiency, 0) / engines.length : 0;
    
    return {
      power: totalPower,
      weight: totalWeight,
      efficiency: efficiency,
      wheels: wheels.length,
      wings: wings.length,
      parts: placedParts.length
    };
  };

  const stats = calculateMachineStats();

  const sidebarStyle = {
    width: '320px',
    backgroundColor: '#ffffff',
    boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    borderRight: '1px solid #e5e7eb',
    display: 'flex',
    flexDirection: 'column',
    height: '100vh'
  };

  const headerStyle = {
    padding: '16px',
    borderBottom: '1px solid #e5e7eb'
  };

  const titleStyle = {
    fontSize: '20px',
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: '16px'
  };

  const categoryTabsStyle = {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '8px',
    marginBottom: '16px'
  };

  const categoryButtonStyle = (isActive) => ({
    padding: '6px 12px',
    borderRadius: '20px',
    fontSize: '14px',
    fontWeight: '500',
    border: 'none',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    backgroundColor: isActive ? '#3b82f6' : '#f3f4f6',
    color: isActive ? '#ffffff' : '#374151'
  });

  const partsGridStyle = {
    flex: 1,
    overflowY: 'auto',
    padding: '16px'
  };

  const partItemStyle = {
    backgroundColor: '#ffffff',
    border: '1px solid #e5e7eb',
    borderRadius: '8px',
    padding: '12px',
    cursor: 'move',
    marginBottom: '12px',
    transition: 'all 0.2s ease',
    display: 'flex',
    alignItems: 'center',
    gap: '12px'
  };

  const partIconStyle = (color) => ({
    width: '48px',
    height: '48px',
    borderRadius: '8px',
    backgroundColor: color,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#ffffff',
    fontSize: '20px'
  });

  const statsStyle = {
    padding: '16px',
    borderTop: '1px solid #e5e7eb',
    backgroundColor: '#f9fafb'
  };

  const statsGridStyle = {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '8px',
    fontSize: '14px'
  };

  const toolbarStyle = {
    backgroundColor: '#ffffff',
    borderBottom: '1px solid #e5e7eb',
    padding: '16px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between'
  };

  const toolbarLeftStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '16px'
  };

  const toolbarRightStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
  };

  const buttonStyle = (variant = 'primary') => ({
    padding: '8px 16px',
    borderRadius: '8px',
    fontWeight: '500',
    border: 'none',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    backgroundColor: variant === 'primary' ? '#3b82f6' : variant === 'danger' ? '#ef4444' : '#6b7280',
    color: '#ffffff'
  });

  const canvasStyle = {
    flex: 1,
    position: 'relative'
  };

  const canvasInnerStyle = {
    width: '100%',
    height: '100%',
    background: 'linear-gradient(135deg, #dbeafe 0%, #c7d2fe 100%)',
    position: 'relative',
    overflow: 'hidden'
  };

  const instructionsStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    textAlign: 'center',
    color: '#6b7280'
  };

  const parameterPanelStyle = {
    width: '320px',
    backgroundColor: '#ffffff',
    boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    borderLeft: '1px solid #e5e7eb',
    height: '100vh',
    display: 'flex',
    flexDirection: 'column'
  };

  const parameterHeaderStyle = {
    padding: '16px',
    borderBottom: '1px solid #e5e7eb',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between'
  };

  const parameterContentStyle = {
    padding: '16px',
    flex: 1,
    overflowY: 'auto'
  };

  const inputStyle = {
    width: '100%',
    padding: '8px 12px',
    border: '1px solid #d1d5db',
    borderRadius: '6px',
    fontSize: '14px',
    marginTop: '4px',
    outline: 'none'
  };

  const labelStyle = {
    display: 'block',
    fontSize: '14px',
    fontWeight: '500',
    color: '#374151',
    marginBottom: '4px'
  };

  return (
    <div style={{ width: '100%', height: '100vh', backgroundColor: '#f3f4f6', display: 'flex' }}>
      {/* Parts Library Sidebar */}
      <div style={sidebarStyle}>
        <div style={headerStyle}>
          <h2 style={titleStyle}>Parts Library</h2>
          
          {/* Category Tabs */}
          <div style={categoryTabsStyle}>
            {Object.keys(PARTS_LIBRARY).map(category => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                style={categoryButtonStyle(selectedCategory === category)}
              >
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Parts Grid */}
        <div style={partsGridStyle}>
          {PARTS_LIBRARY[selectedCategory].map(part => (
            <div
              key={part.id}
              draggable
              onDragStart={(e) => handleDragStart(e, part)}
              style={partItemStyle}
            >
              <div style={partIconStyle(part.color)}>
                {part.type === 'engine' && '🔧'}
                {part.type === 'motor' && '⚡'}
                {part.type === 'jet' && '🚀'}
                {part.type === 'wheel' && '⚙️'}
                {part.type === 'wing' && '✈️'}
                {part.type === 'tank' && '⛽'}
                {part.type === 'chassis' && '🏗️'}
                {part.type === 'propeller' && '🌪️'}
              </div>
              <div style={{ flex: 1 }}>
                <h3 style={{ fontWeight: '500', color: '#1f2937', margin: '0 0 4px 0' }}>{part.name}</h3>
                <p style={{ fontSize: '12px', color: '#6b7280', margin: 0 }}>
                  {Object.entries(part.params).slice(0, 2).map(([key, value]) => (
                    `${key}: ${value}`
                  )).join(', ')}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Machine Stats */}
        <div style={statsStyle}>
          <h3 style={{ fontWeight: '500', color: '#1f2937', margin: '0 0 8px 0' }}>Machine Stats</h3>
          <div style={statsGridStyle}>
            <div>Power: {stats.power}hp</div>
            <div>Weight: {stats.weight}kg</div>
            <div>Efficiency: {(stats.efficiency * 100).toFixed(1)}%</div>
            <div>Parts: {stats.parts}</div>
          </div>
        </div>
      </div>

      {/* Main Canvas Area */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {/* Toolbar */}
        <div style={toolbarStyle}>
          <div style={toolbarLeftStyle}>
            <h1 style={{ fontSize: '24px', fontWeight: '700', color: '#1f2937', margin: 0 }}>3D Parts Playground</h1>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Car size={20} color="#6b7280" />
              <Plane size={20} color="#6b7280" />
              <Wrench size={20} color="#6b7280" />
            </div>
          </div>
          
          <div style={toolbarRightStyle}>
            <button
              onClick={() => setIsSimulating(!isSimulating)}
              style={buttonStyle(isSimulating ? 'danger' : 'primary')}
            >
              {isSimulating ? <Pause size={16} /> : <Play size={16} />}
              {isSimulating ? 'Stop' : 'Simulate'}
            </button>
            <button
              onClick={clearCanvas}
              style={buttonStyle('secondary')}
            >
              <RotateCcw size={16} />
            </button>
          </div>
        </div>

        {/* Canvas */}
        <div style={canvasStyle}>
          <div
            ref={canvasRef}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            style={canvasInnerStyle}
          >
            {/* Placed Parts */}
            {placedParts.map(part => (
              <Part3D
                key={part.id}
                part={part}
                isSelected={selectedPart?.id === part.id}
                onClick={() => handlePartClick(part)}
              />
            ))}

            {/* Instructions */}
            {placedParts.length === 0 && (
              <div style={instructionsStyle}>
                <Wrench size={64} style={{ opacity: 0.5, marginBottom: '16px' }} />
                <h3 style={{ fontSize: '20px', fontWeight: '500', margin: '0 0 8px 0' }}>Start Building!</h3>
                <p style={{ margin: 0 }}>Drag and drop 3D parts from the library to build your machine</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Parameter Panel */}
      {showParameters && selectedPart && (
        <div style={parameterPanelStyle}>
          <div style={parameterHeaderStyle}>
            <h3 style={{ fontWeight: '700', color: '#1f2937', margin: 0 }}>Part Parameters</h3>
            <button
              onClick={() => setShowParameters(false)}
              style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer', color: '#6b7280' }}
            >
              ×
            </button>
          </div>
          
          <div style={parameterContentStyle}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
              <div style={partIconStyle(selectedPart.color)}>
                {selectedPart.type === 'engine' && '🔧'}
                {selectedPart.type === 'motor' && '⚡'}
                {selectedPart.type === 'jet' && '🚀'}
                {selectedPart.type === 'wheel' && '⚙️'}
                {selectedPart.type === 'wing' && '✈️'}
                {selectedPart.type === 'tank' && '⛽'}
                {selectedPart.type === 'chassis' && '🏗️'}
                {selectedPart.type === 'propeller' && '🌪️'}
              </div>
              <div>
                <h4 style={{ fontWeight: '500', color: '#1f2937', margin: '0 0 4px 0' }}>{selectedPart.name}</h4>
                <p style={{ fontSize: '12px', color: '#6b7280', margin: 0 }}>ID: {selectedPart.id}</p>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {Object.entries(selectedPart.params).map(([param, value]) => (
                <div key={param}>
                  <label style={labelStyle}>
                    {param.charAt(0).toUpperCase() + param.slice(1)}
                  </label>
                  {typeof value === 'number' ? (
                    <input
                      type="number"
                      value={value}
                      onChange={(e) => updatePartParameter(selectedPart.id, param, parseFloat(e.target.value) || 0)}
                      style={inputStyle}
                      step="0.1"
                    />
                  ) : (
                    <input
                      type="text"
                      value={value}
                      onChange={(e) => updatePartParameter(selectedPart.id, param, e.target.value)}
                      style={inputStyle}
                    />
                  )}
                </div>
              ))}
            </div>

            <div style={{ marginTop: '24px', paddingTop: '16px', borderTop: '1px solid #e5e7eb' }}>
              <button
                onClick={() => deletePart(selectedPart.id)}
                style={{ ...buttonStyle('danger'), width: '100%', justifyContent: 'center' }}
              >
                <Trash2 size={16} />
                Delete Part
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}