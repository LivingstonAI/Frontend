import React, { useState, useRef, useEffect } from 'react';
import { Wrench, Car, Plane, Settings, Trash2, RotateCcw, Play, Pause, Zap, Gauge, Cog, Wind, Fuel, Cpu, Square, Circle, Triangle } from 'lucide-react';

const PARTS_LIBRARY = {
  engines: [
    { id: 'engine-1', name: 'V8 Engine', icon: Zap, color: 'bg-red-500', params: { power: 300, weight: 150, efficiency: 0.8 } },
    { id: 'engine-2', name: 'Electric Motor', icon: Cpu, color: 'bg-blue-500', params: { power: 200, weight: 50, efficiency: 0.95 } },
    { id: 'engine-3', name: 'Jet Engine', icon: Wind, color: 'bg-orange-500', params: { power: 1000, weight: 200, efficiency: 0.7 } }
  ],
  wheels: [
    { id: 'wheel-1', name: 'Car Wheel', icon: Circle, color: 'bg-gray-600', params: { diameter: 24, width: 8, grip: 0.8 } },
    { id: 'wheel-2', name: 'Motorcycle Wheel', icon: Circle, color: 'bg-gray-800', params: { diameter: 18, width: 4, grip: 0.9 } },
    { id: 'wheel-3', name: 'Truck Wheel', icon: Circle, color: 'bg-gray-500', params: { diameter: 32, width: 12, grip: 0.7 } }
  ],
  wings: [
    { id: 'wing-1', name: 'Aircraft Wing', icon: Triangle, color: 'bg-sky-500', params: { span: 200, chord: 50, angle: 0 } },
    { id: 'wing-2', name: 'Fighter Wing', icon: Triangle, color: 'bg-slate-600', params: { span: 150, chord: 40, angle: 5 } },
    { id: 'wing-3', name: 'Glider Wing', icon: Triangle, color: 'bg-green-500', params: { span: 300, chord: 60, angle: -2 } }
  ],
  misc: [
    { id: 'fuel-tank', name: 'Fuel Tank', icon: Fuel, color: 'bg-yellow-500', params: { capacity: 50, weight: 10, type: 'gasoline' } },
    { id: 'chassis', name: 'Chassis', icon: Square, color: 'bg-zinc-600', params: { length: 150, width: 60, strength: 100 } },
    { id: 'propeller', name: 'Propeller', icon: Cog, color: 'bg-amber-600', params: { diameter: 80, blades: 4, pitch: 45 } }
  ]
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
      x: Math.max(0, Math.min(x, rect.width - 60)),
      y: Math.max(0, Math.min(y, rect.height - 60)),
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
    const engines = placedParts.filter(part => part.id.startsWith('engine'));
    const wheels = placedParts.filter(part => part.id.startsWith('wheel'));
    const wings = placedParts.filter(part => part.id.startsWith('wing'));
    
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

  return (
    <div className="w-full h-screen bg-gray-100 flex">
      {/* Parts Library Sidebar */}
      <div className="w-80 bg-white shadow-lg border-r border-gray-200 flex flex-col">
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Parts Library</h2>
          
          {/* Category Tabs */}
          <div className="flex flex-wrap gap-2 mb-4">
            {Object.keys(PARTS_LIBRARY).map(category => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                  selectedCategory === category
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Parts Grid */}
        <div className="flex-1 overflow-y-auto p-4">
          <div className="grid grid-cols-1 gap-3">
            {PARTS_LIBRARY[selectedCategory].map(part => {
              const IconComponent = part.icon;
              return (
                <div
                  key={part.id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, part)}
                  className="bg-white border border-gray-200 rounded-lg p-3 cursor-move hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 rounded-lg ${part.color} flex items-center justify-center`}>
                      <IconComponent className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-800">{part.name}</h3>
                      <p className="text-sm text-gray-500">
                        {Object.entries(part.params).slice(0, 2).map(([key, value]) => (
                          `${key}: ${value}`
                        )).join(', ')}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Machine Stats */}
        <div className="p-4 border-t border-gray-200 bg-gray-50">
          <h3 className="font-medium text-gray-800 mb-2">Machine Stats</h3>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div>Power: {stats.power}hp</div>
            <div>Weight: {stats.weight}kg</div>
            <div>Efficiency: {(stats.efficiency * 100).toFixed(1)}%</div>
            <div>Parts: {stats.parts}</div>
          </div>
        </div>
      </div>

      {/* Main Canvas Area */}
      <div className="flex-1 flex flex-col">
        {/* Toolbar */}
        <div className="bg-white border-b border-gray-200 p-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-bold text-gray-800">Science Playground</h1>
            <div className="flex items-center gap-2">
              <Car className="w-5 h-5 text-gray-600" />
              <Plane className="w-5 h-5 text-gray-600" />
              <Wrench className="w-5 h-5 text-gray-600" />
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsSimulating(!isSimulating)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                isSimulating
                  ? 'bg-red-500 text-white hover:bg-red-600'
                  : 'bg-green-500 text-white hover:bg-green-600'
              }`}
            >
              {isSimulating ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              {isSimulating ? 'Stop' : 'Simulate'}
            </button>
            <button
              onClick={clearCanvas}
              className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Canvas */}
        <div className="flex-1 relative">
          <div
            ref={canvasRef}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            className="w-full h-full bg-gradient-to-br from-blue-50 to-indigo-100 relative overflow-hidden"
            style={{
              backgroundImage: `
                radial-gradient(circle at 25% 25%, rgba(255,255,255,0.2) 1px, transparent 1px),
                radial-gradient(circle at 75% 75%, rgba(255,255,255,0.2) 1px, transparent 1px)
              `,
              backgroundSize: '50px 50px'
            }}
          >
            {/* Grid Pattern */}
            <div className="absolute inset-0 opacity-20">
              <svg width="100%" height="100%">
                <defs>
                  <pattern id="grid" width="50" height="50" patternUnits="userSpaceOnUse">
                    <path d="M 50 0 L 0 0 0 50" fill="none" stroke="#4F46E5" strokeWidth="1"/>
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#grid)" />
              </svg>
            </div>

            {/* Placed Parts */}
            {placedParts.map(part => {
              const IconComponent = part.icon;
              return (
                <div
                  key={part.id}
                  onClick={() => handlePartClick(part)}
                  className={`absolute w-16 h-16 rounded-lg ${part.color} flex items-center justify-center cursor-pointer transition-all hover:scale-110 ${
                    selectedPart?.id === part.id ? 'ring-4 ring-blue-400 ring-opacity-50' : ''
                  } ${isSimulating ? 'animate-pulse' : ''}`}
                  style={{
                    left: part.x,
                    top: part.y,
                    transform: `rotate(${part.rotation}deg)`
                  }}
                >
                  <IconComponent className="w-8 h-8 text-white" />
                </div>
              );
            })}

            {/* Instructions */}
            {placedParts.length === 0 && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center text-gray-500">
                  <Wrench className="w-16 h-16 mx-auto mb-4 opacity-50" />
                  <h3 className="text-xl font-medium mb-2">Start Building!</h3>
                  <p>Drag and drop parts from the library to build your machine</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Parameter Panel */}
      {showParameters && selectedPart && (
        <div className="w-80 bg-white shadow-lg border-l border-gray-200">
          <div className="p-4 border-b border-gray-200 flex items-center justify-between">
            <h3 className="font-bold text-gray-800">Part Parameters</h3>
            <button
              onClick={() => setShowParameters(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              ×
            </button>
          </div>
          
          <div className="p-4">
            <div className="flex items-center gap-3 mb-4">
              <div className={`w-12 h-12 rounded-lg ${selectedPart.color} flex items-center justify-center`}>
                <selectedPart.icon className="w-6 h-6 text-white" />
              </div>
              <div>
                <h4 className="font-medium text-gray-800">{selectedPart.name}</h4>
                <p className="text-sm text-gray-500">ID: {selectedPart.id}</p>
              </div>
            </div>

            <div className="space-y-4">
              {Object.entries(selectedPart.params).map(([param, value]) => (
                <div key={param}>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {param.charAt(0).toUpperCase() + param.slice(1)}
                  </label>
                  {typeof value === 'number' ? (
                    <input
                      type="number"
                      value={value}
                      onChange={(e) => updatePartParameter(selectedPart.id, param, parseFloat(e.target.value) || 0)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      step="0.1"
                    />
                  ) : (
                    <input
                      type="text"
                      value={value}
                      onChange={(e) => updatePartParameter(selectedPart.id, param, e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  )}
                </div>
              ))}
            </div>

            <div className="mt-6 pt-4 border-t border-gray-200">
              <button
                onClick={() => deletePart(selectedPart.id)}
                className="w-full px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors flex items-center justify-center gap-2"
              >
                <Trash2 className="w-4 h-4" />
                Delete Part
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}