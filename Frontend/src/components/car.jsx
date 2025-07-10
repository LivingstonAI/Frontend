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
const Part3D = ({ part, isSelected, onClick, onDragStart }) => {
  const mountRef = useRef(null);
  const sceneRef = useRef(null);
  const rendererRef = useRef(null);
  const meshRef = useRef(null);

  useEffect(() => {
    if (!mountRef.current) return;

    // Scene setup with higher resolution
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ 
      alpha: true, 
      antialias: true,
      powerPreference: "high-performance"
    });
    
    // Higher resolution rendering
    renderer.setSize(80, 80);
    renderer.setPixelRatio(window.devicePixelRatio || 1);
    renderer.setClearColor(0x000000, 0);
    mountRef.current.appendChild(renderer.domElement);

    // Better lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1.0);
    directionalLight.position.set(2, 2, 2);
    scene.add(directionalLight);

    // Create realistic geometry based on part type
    let geometry, material;
    
    switch (part.type) {
      case 'engine':
        // Create detailed V8 engine block
        geometry = new THREE.BoxGeometry(1.2, 0.8, 1.4);
        material = new THREE.MeshPhongMaterial({ 
          color: part.color,
          shininess: 30,
          specular: 0x333333
        });
        
        // Add cylinder heads
        for (let i = 0; i < 8; i++) {
          const cylinderGeometry = new THREE.CylinderGeometry(0.08, 0.08, 0.15, 8);
          const cylinderMaterial = new THREE.MeshPhongMaterial({ 
            color: '#2a2a2a',
            shininess: 50,
            specular: 0x666666
          });
          const cylinder = new THREE.Mesh(cylinderGeometry, cylinderMaterial);
          cylinder.position.set(
            (i % 2 === 0 ? -0.25 : 0.25), 
            0.5, 
            -0.5 + (Math.floor(i / 2) * 0.33)
          );
          scene.add(cylinder);
        }
        
        // Add intake manifold
        const intakeGeometry = new THREE.BoxGeometry(0.8, 0.3, 1.0);
        const intakeMaterial = new THREE.MeshPhongMaterial({ 
          color: '#1a1a1a',
          shininess: 80
        });
        const intake = new THREE.Mesh(intakeGeometry, intakeMaterial);
        intake.position.set(0, 0.4, 0);
        scene.add(intake);
        break;
        
      case 'motor':
        // Create realistic electric motor
        geometry = new THREE.CylinderGeometry(0.5, 0.5, 1.2, 20);
        material = new THREE.MeshPhongMaterial({ 
          color: part.color,
          shininess: 60,
          specular: 0x444444
        });
        
        // Add cooling fins
        for (let i = 0; i < 12; i++) {
          const finGeometry = new THREE.BoxGeometry(0.52, 0.02, 0.1);
          const finMaterial = new THREE.MeshPhongMaterial({ 
            color: '#666666',
            shininess: 40
          });
          const fin = new THREE.Mesh(finGeometry, finMaterial);
          fin.position.set(0, -0.4 + (i * 0.08), 0);
          scene.add(fin);
        }
        
        // Add connector housing
        const connectorGeometry = new THREE.BoxGeometry(0.3, 0.2, 0.3);
        const connectorMaterial = new THREE.MeshPhongMaterial({ 
          color: '#333333',
          shininess: 20
        });
        const connector = new THREE.Mesh(connectorGeometry, connectorMaterial);
        connector.position.set(0.4, 0, 0);
        scene.add(connector);
        break;
        
      case 'jet':
        // Create realistic jet engine
        geometry = new THREE.CylinderGeometry(0.3, 0.5, 1.8, 16);
        material = new THREE.MeshPhongMaterial({ 
          color: part.color,
          shininess: 80,
          specular: 0x555555
        });
        
        // Add intake cone
        const intakeConeGeometry = new THREE.ConeGeometry(0.45, 0.4, 16);
        const intakeConeMaterial = new THREE.MeshPhongMaterial({ 
          color: '#1a1a1a',
          shininess: 100
        });
        const intakeCone = new THREE.Mesh(intakeConeGeometry, intakeConeMaterial);
        intakeCone.position.set(0, 0, 0.9);
        intakeCone.rotation.x = Math.PI;
        scene.add(intakeCone);
        
        // Add exhaust nozzle
        const exhaustGeometry = new THREE.CylinderGeometry(0.25, 0.35, 0.3, 16);
        const exhaustMaterial = new THREE.MeshPhongMaterial({ 
          color: '#444444',
          shininess: 90
        });
        const exhaust = new THREE.Mesh(exhaustGeometry, exhaustMaterial);
        exhaust.position.set(0, 0, -1.05);
        scene.add(exhaust);
        break;
        
      case 'wheel':
        // Create realistic car wheel with tire and rim
        geometry = new THREE.CylinderGeometry(0.6, 0.6, 0.35, 20);
        material = new THREE.MeshPhongMaterial({ 
          color: '#1a1a1a', // Tire color
          shininess: 10,
          specular: 0x111111
        });
        
        // Add tire tread pattern
        for (let i = 0; i < 24; i++) {
          const treadGeometry = new THREE.BoxGeometry(0.02, 0.02, 0.3);
          const treadMaterial = new THREE.MeshPhongMaterial({ color: '#0a0a0a' });
          const tread = new THREE.Mesh(treadGeometry, treadMaterial);
          const angle = (i / 24) * Math.PI * 2;
          tread.position.set(
            Math.cos(angle) * 0.61,
            Math.sin(angle) * 0.61,
            0
          );
          tread.rotation.z = angle;
          scene.add(tread);
        }
        
        // Add realistic rim
        const rimGeometry = new THREE.CylinderGeometry(0.45, 0.45, 0.25, 20);
        const rimMaterial = new THREE.MeshPhongMaterial({ 
          color: part.color,
          shininess: 90,
          specular: 0x888888
        });
        const rim = new THREE.Mesh(rimGeometry, rimMaterial);
        scene.add(rim);
        
        // Add rim spokes
        for (let i = 0; i < 5; i++) {
          const spokeGeometry = new THREE.BoxGeometry(0.05, 0.4, 0.2);
          const spokeMaterial = new THREE.MeshPhongMaterial({ 
            color: '#cccccc',
            shininess: 80
          });
          const spoke = new THREE.Mesh(spokeGeometry, spokeMaterial);
          const angle = (i / 5) * Math.PI * 2;
          spoke.position.set(
            Math.cos(angle) * 0.15,
            Math.sin(angle) * 0.15,
            0
          );
          spoke.rotation.z = angle;
          scene.add(spoke);
        }
        break;
        
      case 'wing':
        // Create realistic aircraft wing with airfoil shape
        const wingShape = new THREE.Shape();
        wingShape.moveTo(0, 0);
        wingShape.quadraticCurveTo(0.5, 0.15, 2, 0.05);
        wingShape.lineTo(2, -0.05);
        wingShape.quadraticCurveTo(0.5, -0.1, 0, 0);
        
        const extrudeSettings = {
          depth: 0.8,
          bevelEnabled: true,
          bevelSegments: 2,
          steps: 2,
          bevelSize: 0.02,
          bevelThickness: 0.02
        };
        
        geometry = new THREE.ExtrudeGeometry(wingShape, extrudeSettings);
        material = new THREE.MeshPhongMaterial({ 
          color: part.color,
          shininess: 70,
          specular: 0x666666
        });
        
        // Add wing tip
        const tipGeometry = new THREE.SphereGeometry(0.08, 8, 8);
        const tipMaterial = new THREE.MeshPhongMaterial({ 
          color: '#ff4444',
          shininess: 90
        });
        const tip = new THREE.Mesh(tipGeometry, tipMaterial);
        tip.position.set(2, 0, 0.4);
        scene.add(tip);
        break;
        
      case 'tank':
        // Create realistic fuel tank
        geometry = new THREE.CylinderGeometry(0.45, 0.45, 1.2, 16);
        material = new THREE.MeshPhongMaterial({ 
          color: part.color,
          shininess: 50,
          specular: 0x444444
        });
        
        // Add tank caps
        const capGeometry = new THREE.CylinderGeometry(0.46, 0.46, 0.05, 16);
        const capMaterial = new THREE.MeshPhongMaterial({ 
          color: '#666666',
          shininess: 70
        });
        const topCap = new THREE.Mesh(capGeometry, capMaterial);
        topCap.position.set(0, 0.625, 0);
        scene.add(topCap);
        
        const bottomCap = new THREE.Mesh(capGeometry, capMaterial);
        bottomCap.position.set(0, -0.625, 0);
        scene.add(bottomCap);
        
        // Add fuel gauge
        const gaugeGeometry = new THREE.CylinderGeometry(0.06, 0.06, 0.08, 8);
        const gaugeMaterial = new THREE.MeshPhongMaterial({ 
          color: '#333333',
          shininess: 60
        });
        const gauge = new THREE.Mesh(gaugeGeometry, gaugeMaterial);
        gauge.position.set(0.4, 0.2, 0);
        gauge.rotation.z = Math.PI / 2;
        scene.add(gauge);
        break;
        
      case 'chassis':
        // Create realistic chassis frame
        geometry = new THREE.BoxGeometry(2.2, 0.15, 1.2);
        material = new THREE.MeshPhongMaterial({ 
          color: part.color,
          shininess: 40,
          specular: 0x555555
        });
        
        // Add cross members
        for (let i = 0; i < 4; i++) {
          const crossGeometry = new THREE.BoxGeometry(0.08, 0.08, 1.2);
          const crossMaterial = new THREE.MeshPhongMaterial({ 
            color: '#444444',
            shininess: 30
          });
          const cross = new THREE.Mesh(crossGeometry, crossMaterial);
          cross.position.set(-0.8 + (i * 0.5), -0.1, 0);
          scene.add(cross);
        }
        
        // Add mounting points
        for (let i = 0; i < 6; i++) {
          const mountGeometry = new THREE.CylinderGeometry(0.04, 0.04, 0.1, 8);
          const mountMaterial = new THREE.MeshPhongMaterial({ 
            color: '#666666',
            shininess: 80
          });
          const mount = new THREE.Mesh(mountGeometry, mountMaterial);
          mount.position.set(
            -1 + (i % 3) * 1,
            0.12,
            i < 3 ? -0.4 : 0.4
          );
          scene.add(mount);
        }
        break;
        
      case 'propeller':
        // Create realistic propeller with hub
        const hubGeometry = new THREE.CylinderGeometry(0.15, 0.15, 0.2, 12);
        const hubMaterial = new THREE.MeshPhongMaterial({ 
          color: '#333333',
          shininess: 80,
          specular: 0x666666
        });
        const hub = new THREE.Mesh(hubGeometry, hubMaterial);
        hub.rotation.z = Math.PI / 2;
        scene.add(hub);
        
        // Create curved propeller blades
        for (let i = 0; i < 4; i++) {
          const bladeShape = new THREE.Shape();
          bladeShape.moveTo(0, 0);
          bladeShape.quadraticCurveTo(0.3, 0.08, 0.8, 0.02);
          bladeShape.lineTo(0.8, -0.02);
          bladeShape.quadraticCurveTo(0.3, -0.08, 0, 0);
          
          const bladeExtrudeSettings = {
            depth: 0.05,
            bevelEnabled: true,
            bevelSegments: 2,
            steps: 2,
            bevelSize: 0.01,
            bevelThickness: 0.01
          };
          
          const bladeGeometry = new THREE.ExtrudeGeometry(bladeShape, bladeExtrudeSettings);
          const bladeMaterial = new THREE.MeshPhongMaterial({ 
            color: part.color,
            shininess: 60,
            specular: 0x555555
          });
          const blade = new THREE.Mesh(bladeGeometry, bladeMaterial);
          
          blade.rotation.z = (i / 4) * Math.PI * 2;
          blade.position.set(0.15, 0, 0);
          scene.add(blade);
        }
        
        // Don't create main geometry for propeller as we built it from components
        geometry = null;
        material = null;
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

    // Static render - no rotation animation
    renderer.render(scene, camera);

    sceneRef.current = scene;
    rendererRef.current = renderer;

    return () => {
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [part.type, part.color]);

  const handleMouseDown = (e) => {
    e.preventDefault();
    const rect = e.currentTarget.getBoundingClientRect();
    const offset = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    };
    onDragStart(e, part, offset);
  };

  const containerStyle = {
    position: 'absolute',
    left: `${part.x}px`,
    top: `${part.y}px`,
    width: '80px',
    height: '80px',
    cursor: 'move',
    transform: `rotate(${part.rotation || 0}deg)`,
    transition: 'filter 0.2s ease',
    filter: isSelected ? 'drop-shadow(0 0 12px rgba(59, 130, 246, 0.8))' : 'none',
    zIndex: isSelected ? 10 : 1,
    userSelect: 'none'
  };

  return (
    <div 
      style={containerStyle} 
      onMouseDown={handleMouseDown}
      onClick={(e) => {
        e.stopPropagation();
        onClick(part);
      }}
    >
      <div ref={mountRef} style={{ width: '80px', height: '80px' }} />
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

  // Handle dragging from library
  const handleDragStart = (e, part) => {
    setIsDragging(true);
    const rect = e.currentTarget.getBoundingClientRect();
    setDragOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
    setSelectedPart(part);
  };

  // Handle dragging within playground
  const handlePartDragStart = (e, part, offset) => {
    setIsDragging(true);
    setDragOffset(offset);
    setSelectedPart(part);
    
    const handleMouseMove = (e) => {
      if (!canvasRef.current) return;
      
      const canvas = canvasRef.current;
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left - offset.x;
      const y = e.clientY - rect.top - offset.y;

      // Update part position
      setPlacedParts(parts =>
        parts.map(p =>
          p.id === part.id
            ? {
                ...p,
                x: Math.max(0, Math.min(x, rect.width - 80)),
                y: Math.max(0, Math.min(y, rect.height - 80))
              }
            : p
        )
      );
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    if (!selectedPart || !isDragging) return;

    // Only handle drops from library (new parts)
    if (placedParts.find(p => p.id === selectedPart.id)) {
      setIsDragging(false);
      return;
    }

    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left - dragOffset.x;
    const y = e.clientY - rect.top - dragOffset.y;

    const newPart = {
      ...selectedPart,
      id: `${selectedPart.id}-${Date.now()}`,
      x: Math.max(0, Math.min(x, rect.width - 80)),
      y: Math.max(0, Math.min(y, rect.height - 80)),
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
            <h1 style={{ fontSize: '24px', fontWeight: '700', color: '#1f2937', margin: 0 }}>Science Playground</h1>
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
                onClick={handlePartClick}
                onDragStart={handlePartDragStart}
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