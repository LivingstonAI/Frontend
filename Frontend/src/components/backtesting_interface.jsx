import React, { useEffect, useState, useRef } from "react";
import Header from "./header";
import SideNavs from "./side_navs";
import Cookies from 'js-cookie';
import { embed } from '@bokeh/bokehjs';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import * as THREE from 'three';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

export default function BacktestedResults() {
  const baseUrl = 'https://backend-production-c0ab.up.railway.app';
  const [backtestData, setBacktestData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedModel, setExpandedModel] = useState(null);
  const [expandedResult, setExpandedResult] = useState(null);
  const [debugInfo, setDebugInfo] = useState({});
  const [deleteInProgress, setDeleteInProgress] = useState(false);
  const plotRefs = useRef({});
  
  // New state for filters and search
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    minReturn: '',
    maxReturn: '',
    minSharpe: '',
    maxSharpe: '',
    minProfitFactor: '',
    maxProfitFactor: '',
    minWinRate: '',
    maxWinRate: '',
  });
  const [showFilters, setShowFilters] = useState(false);

  // New state for charts
  const [showCharts, setShowCharts] = useState(false);
  const [chartTypes, setChartTypes] = useState({
    performance: true,
    riskMetrics: true,
    tradeStats: true,
    distribution: true,
  });
  
  // State for 3D visualizations
  const [show3D, setShow3D] = useState(false);
  const [threeDTypes, setThreeDTypes] = useState({
    performanceSurface: true,
    riskCube: true,
    tradeOrbs: true,
    portfolioLandscape: true,
  });
  const threeDRefs = useRef({});

  useEffect(() => {
    fetchBacktestResults();
  }, []);

  // Apply filters and search whenever data, filters, or search term changes
  useEffect(() => {
    applyFiltersAndSearch();
  }, [backtestData, filters, searchTerm]);

  useEffect(() => {
    // Render plots for expanded results
    if (expandedResult !== null && expandedModel !== null && 
        filteredData[expandedModel]?.results[expandedResult]?.has_plot) {
      
      const resultData = filteredData[expandedModel].results[expandedResult];
      const plotId = `plot-${expandedModel}-${expandedResult}`;
      const plotRef = plotRefs.current[plotId];
      
      // Debug information collection
      const newDebugInfo = { 
        timestamp: new Date().toISOString(),
        plotId,
        hasPlotRef: !!plotRef,
        hasPlotJSON: !!resultData.plot_json,
        plotJSONType: typeof resultData.plot_json,
        plotJSONLength: typeof resultData.plot_json === 'string' ? 
          resultData.plot_json.length : 'not a string'
      };
      
      setDebugInfo(prev => ({ ...prev, [plotId]: newDebugInfo }));
      
      if (plotRef && resultData.plot_json) {
        console.log(`Attempting to render plot ${plotId}`);
        
        // Clear any existing plot
        while (plotRef.firstChild) {
          plotRef.removeChild(plotRef.firstChild);
        }
        
        try {
          let plotData;
          
          // Safely parse the plot JSON if it's a string
          if (typeof resultData.plot_json === 'string') {
            try {
              plotData = JSON.parse(resultData.plot_json);
              console.log(`Successfully parsed plot JSON for ${plotId}`);
            } catch (parseError) {
              console.error(`JSON parse error for ${plotId}:`, parseError);
              setDebugInfo(prev => ({ 
                ...prev, 
                [plotId]: { ...prev[plotId], parseError: parseError.message, jsonSample: resultData.plot_json.substring(0, 100) + '...' } 
              }));
              return;
            }
          } else {
            plotData = resultData.plot_json;
          }
          
          // Validate that plotData has the expected structure
          if (!plotData || !plotData.doc || !plotData.doc.roots) {
            console.error(`Invalid plot data format for ${plotId}`, plotData);
            setDebugInfo(prev => ({ 
              ...prev, 
              [plotId]: { ...prev[plotId], error: 'Invalid plot data format', plotDataKeys: Object.keys(plotData || {}).join(', ') } 
            }));
            return;
          }
          
          // Delay rendering the plot slightly to allow the DOM to stabilize
          setTimeout(() => {
            try {
              console.log(`Embedding plot ${plotId}`);
              embed.embed_item(plotData, plotId);
              console.log(`Successfully embedded plot ${plotId}`);
              setDebugInfo(prev => ({ ...prev, [plotId]: { ...prev[plotId], status: 'success' } }));
            } catch (embedError) {
              console.error(`Embedding error for ${plotId}:`, embedError);
              setDebugInfo(prev => ({ 
                ...prev, 
                [plotId]: { ...prev[plotId], embedError: embedError.message } 
              }));
            }
          }, 300); // Increased delay for DOM stability
        } catch (e) {
          console.error(`Failed to render plot ${plotId}:`, e);
          setDebugInfo(prev => ({ 
            ...prev, 
            [plotId]: { ...prev[plotId], generalError: e.message } 
          }));
        }
      }
    }
  }, [expandedResult, expandedModel, filteredData]);

  const fetchBacktestResults = async () => {
    setLoading(true);
    try {
      console.log('Fetching backtest results...');
      const response = await fetch(`${baseUrl}/fetch-backtested-results`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': Cookies.get('csrftoken')
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Backtest data received:', data.status);
      
      if (data.status === 'success') {
        // Preprocess the data to ensure plot_json is properly formatted
        const processedData = data.data.map(model => ({
          ...model,
          results: model.results.map(result => ({
            ...result,
            has_plot: !!result.plot_json, // Ensure has_plot is set correctly based on actual presence of plot_json
          }))
        }));
        
        setBacktestData(processedData);
        setFilteredData(processedData); // Initialize filtered data with all data
        console.log(`Loaded ${processedData.length} backtest models`);
        console.log(processedData[0].model_info.code_snippet);
      } else {
        setError(data.message || 'Failed to fetch backtest results');
      }
    } catch (error) {
      setError(`Error fetching backtest results: ${error.message}`);
      console.error('Error fetching backtest results:', error);
    } finally {
      setLoading(false);
    }
  };

  // Function to apply filters and search
  const applyFiltersAndSearch = () => {
    if (!backtestData.length) return;
    
    console.log('Applying filters and search');
    
    // Filter models based on search term (dataset name or any text in code snippet)
    let filtered = backtestData.filter(model => {
      const datasetMatch = model.model_info.dataset.toLowerCase().includes(searchTerm.toLowerCase());
      const codeMatch = model.model_info.code_snippet?.toLowerCase().includes(searchTerm.toLowerCase());
      return searchTerm === '' || datasetMatch || codeMatch;
    });
    
    // Apply numeric filters to results within each model
    filtered = filtered.map(model => {
      const filteredResults = model.results.filter(result => {
        // Check each metric against min/max filters
        const meetsReturnFilter = 
          (filters.minReturn === '' || (result.return_percent >= parseFloat(filters.minReturn))) &&
          (filters.maxReturn === '' || (result.return_percent <= parseFloat(filters.maxReturn)));
          
        const meetsSharpeFilter = 
          (filters.minSharpe === '' || (result.sharpe_ratio >= parseFloat(filters.minSharpe))) &&
          (filters.maxSharpe === '' || (result.sharpe_ratio <= parseFloat(filters.maxSharpe)));
          
        const meetsProfitFactorFilter = 
          (filters.minProfitFactor === '' || (result.profit_factor >= parseFloat(filters.minProfitFactor))) &&
          (filters.maxProfitFactor === '' || (result.profit_factor <= parseFloat(filters.maxProfitFactor)));
          
        const meetsWinRateFilter = 
          (filters.minWinRate === '' || (result.win_rate >= parseFloat(filters.minWinRate))) &&
          (filters.maxWinRate === '' || (result.win_rate <= parseFloat(filters.maxWinRate)));
          
        return meetsReturnFilter && meetsSharpeFilter && meetsProfitFactorFilter && meetsWinRateFilter;
      });
      
      return {
        ...model,
        results: filteredResults
      };
    });
    
    // Remove models with no matching results
    filtered = filtered.filter(model => model.results.length > 0);
    
    setFilteredData(filtered);
    
    // Reset expanded selections if the filtered data changes significantly
    if (expandedModel !== null && (expandedModel >= filtered.length || filtered[expandedModel]?.model_info.id !== backtestData[expandedModel]?.model_info.id)) {
      setExpandedModel(null);
      setExpandedResult(null);
    }
    
    if (expandedResult !== null && expandedModel !== null && 
        (expandedResult >= filtered[expandedModel]?.results.length)) {
      setExpandedResult(null);
    }
  };

  // Handle input change for filters
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Reset all filters
  const resetFilters = () => {
    setFilters({
      minReturn: '',
      maxReturn: '',
      minSharpe: '',
      maxSharpe: '',
      minProfitFactor: '',
      maxProfitFactor: '',
      minWinRate: '',
      maxWinRate: '',
    });
    setSearchTerm('');
  };

  // Chart data preparation functions
  const getPerformanceChartData = () => {
    const allResults = filteredData.flatMap(model => 
      model.results.map(result => ({
        ...result,
        dataset: model.model_info.dataset,
        modelId: model.model_info.id
      }))
    );

    return {
      labels: allResults.map((_, index) => `Result ${index + 1}`),
      datasets: [
        {
          label: 'Return %',
          data: allResults.map(result => result.return_percent),
          borderColor: 'rgb(75, 192, 192)',
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          tension: 0.1,
        },
        {
          label: 'Buy & Hold Return %',
          data: allResults.map(result => result.buy_hold_return),
          borderColor: 'rgb(255, 99, 132)',
          backgroundColor: 'rgba(255, 99, 132, 0.2)',
          tension: 0.1,
        }
      ]
    };
  };

  const getRiskMetricsChartData = () => {
    const allResults = filteredData.flatMap(model => 
      model.results.map(result => ({
        ...result,
        dataset: model.model_info.dataset
      }))
    );

    return {
      labels: allResults.map((_, index) => `Result ${index + 1}`),
      datasets: [
        {
          label: 'Sharpe Ratio',
          data: allResults.map(result => result.sharpe_ratio),
          backgroundColor: 'rgba(54, 162, 235, 0.8)',
        },
        {
          label: 'Sortino Ratio',
          data: allResults.map(result => result.sortino_ratio),
          backgroundColor: 'rgba(255, 206, 86, 0.8)',
        },
        {
          label: 'Calmar Ratio',
          data: allResults.map(result => result.calmar_ratio),
          backgroundColor: 'rgba(75, 192, 192, 0.8)',
        }
      ]
    };
  };

  const getTradeStatsChartData = () => {
    const allResults = filteredData.flatMap(model => 
      model.results.map(result => ({
        ...result,
        dataset: model.model_info.dataset
      }))
    );

    return {
      labels: allResults.map((_, index) => `Result ${index + 1}`),
      datasets: [
        {
          label: 'Win Rate %',
          data: allResults.map(result => result.win_rate),
          backgroundColor: 'rgba(153, 102, 255, 0.8)',
        },
        {
          label: 'Profit Factor',
          data: allResults.map(result => result.profit_factor * 10), // Scale for visibility
          backgroundColor: 'rgba(255, 159, 64, 0.8)',
        }
      ]
    };
  };

  const getDistributionChartData = () => {
    const allResults = filteredData.flatMap(model => model.results);
    const positivePnL = allResults.filter(result => result.return_percent > 0).length;
    const negativePnL = allResults.filter(result => result.return_percent <= 0).length;

    return {
      labels: ['Positive Returns', 'Negative/Zero Returns'],
      datasets: [{
        data: [positivePnL, negativePnL],
        backgroundColor: [
          'rgba(75, 192, 192, 0.8)',
          'rgba(255, 99, 132, 0.8)',
        ],
        borderColor: [
          'rgba(75, 192, 192, 1)',
          'rgba(255, 99, 132, 1)',
        ],
        borderWidth: 1,
      }]
    };
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Backtest Results Analysis',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  const deleteBacktestModel = async (modelId) => {
    // Prevent multiple delete operations at once
    if (deleteInProgress) return;
    
    if (!window.confirm('Are you sure you want to delete this model and all associated results?')) {
      return;
    }
    
    setDeleteInProgress(true);
    
    try {
      console.log(`Deleting backtest model ${modelId}...`);
      const response = await fetch(`${baseUrl}/delete-backtest-model`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': Cookies.get('csrftoken')
        },
        body: JSON.stringify({ model_id: modelId }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.status === 'success') {
        console.log('Model deleted successfully');
        // If the model was expanded, close it
        if (expandedModel !== null) {
          setExpandedModel(null);
          setExpandedResult(null);
        }
        // Refresh the data
        fetchBacktestResults();
      } else {
        setError(data.message || 'Failed to delete backtest model');
        console.error('Failed to delete backtest model:', data.message);
      }
    } catch (error) {
      setError(`Error deleting backtest model: ${error.message}`);
      console.error('Error deleting backtest model:', error);
    } finally {
      setDeleteInProgress(false);
    }
  };

  const handleModelClick = (index) => {
    setExpandedModel(expandedModel === index ? null : index);
    setExpandedResult(null); // Close any expanded result when toggling model
  };

  const handleResultClick = (index) => {
    setExpandedResult(expandedResult === index ? null : index);
  };

  const formatValue = (value, isPercentage = false) => {
    if (typeof value === 'number') {
      return isPercentage 
        ? `${value.toFixed(2)}%` 
        : value.toFixed(2);
    }
    return value;
  };

  // Function to manually retry rendering a plot
  const retryRenderPlot = (modelIndex, resultIndex) => {
    if (filteredData[modelIndex]?.results[resultIndex]?.has_plot) {
      const plotId = `plot-${modelIndex}-${resultIndex}`;
      console.log(`Manually retrying plot render for ${plotId}`);
      
      // Force re-render by temporarily changing state
      setExpandedResult(null);
      setTimeout(() => {
        setExpandedResult(resultIndex);
      }, 100);
    }
  };

  const toggleChartType = (chartType) => {
    setChartTypes(prev => ({
      ...prev,
      [chartType]: !prev[chartType]
    }));
  };

  const toggle3DType = (type) => {
    setThreeDTypes(prev => ({
      ...prev,
      [type]: !prev[type]
    }));
  };

  // 3D Visualization Functions
  const create3DVisualization = (containerId, type) => {
    const container = document.getElementById(containerId);
    if (!container) return;

    // Clear existing content
    while (container.firstChild) {
      container.removeChild(container.firstChild);
    }

    const width = container.clientWidth;
    const height = 400;

    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0a0a0a);
    
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.appendChild(renderer.domElement);

    // Enhanced lighting setup
    const ambientLight = new THREE.AmbientLight(0x404040, 0.4);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0x00ffff, 1);
    directionalLight.position.set(15, 20, 10);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 2048;
    directionalLight.shadow.mapSize.height = 2048;
    scene.add(directionalLight);
    
    const pointLight = new THREE.PointLight(0xff4444, 0.5, 100);
    pointLight.position.set(-10, 10, -10);
    scene.add(pointLight);

    // Get all results for visualization
    const allResults = filteredData.flatMap(model => 
      model.results.map(result => ({
        ...result,
        dataset: model.model_info.dataset,
        modelId: model.model_info.id
      }))
    );

    if (allResults.length === 0) return;

    let controls = {
      mouseX: 0,
      mouseY: 0,
      isMouseDown: false,
      autoRotate: true
    };

    switch (type) {
      case 'performanceSurface':
        createPerformanceSurface(scene, allResults);
        camera.position.set(15, 12, 15);
        break;
      case 'riskCube':
        createRiskCube(scene, allResults);
        camera.position.set(20, 15, 20);
        break;
      case 'tradeOrbs':
        createTradeOrbs(scene, allResults);
        camera.position.set(25, 20, 25);
        break;
      case 'portfolioLandscape':
        createPortfolioLandscape(scene, allResults);
        camera.position.set(30, 25, 30);
        break;
    }

    camera.lookAt(0, 0, 0);

    // Enhanced mouse controls with momentum
    const handleMouseMove = (event) => {
      if (!controls.isMouseDown) return;
      
      const rect = container.getBoundingClientRect();
      const newMouseX = ((event.clientX - rect.left) / width) * 2 - 1;
      const newMouseY = -((event.clientY - rect.top) / height) * 2 + 1;
      
      controls.mouseX = newMouseX;
      controls.mouseY = newMouseY;
      controls.autoRotate = false;
      
      const radius = 30;
      camera.position.x = Math.sin(newMouseX * Math.PI) * radius;
      camera.position.z = Math.cos(newMouseX * Math.PI) * radius;
      camera.position.y = Math.max(5, newMouseY * 15 + 20);
      camera.lookAt(0, 0, 0);
    };

    const handleMouseDown = () => { 
      controls.isMouseDown = true;
      controls.autoRotate = false;
    };
    
    const handleMouseUp = () => { 
      controls.isMouseDown = false;
      setTimeout(() => { controls.autoRotate = true; }, 3000);
    };
    
    const handleMouseLeave = () => { 
      controls.isMouseDown = false;
      controls.autoRotate = true;
    };

    container.addEventListener('mousemove', handleMouseMove);
    container.addEventListener('mousedown', handleMouseDown);
    container.addEventListener('mouseup', handleMouseUp);
    container.addEventListener('mouseleave', handleMouseLeave);

    // Animation loop with enhanced effects
    const animate = () => {
      if (!container.contains(renderer.domElement)) return;
      
      requestAnimationFrame(animate);
      
      const time = Date.now() * 0.001;
      
      // Auto rotation when not being controlled
      if (controls.autoRotate && !controls.isMouseDown) {
        camera.position.x = Math.sin(time * 0.5) * 25;
        camera.position.z = Math.cos(time * 0.5) * 25;
        camera.position.y = 15 + Math.sin(time * 0.3) * 5;
        camera.lookAt(0, 0, 0);
      }
      
      // Animate scene objects
      scene.traverse((object) => {
        if (object.userData.pulseSpeed) {
          const scale = 1 + Math.sin(time * object.userData.pulseSpeed * 8) * 0.15;
          object.scale.setScalar(scale);
        }
        
        if (object.userData.floatSpeed) {
          object.position.y = object.userData.originalY + Math.sin(time * object.userData.floatSpeed * 15) * 0.8;
        }
        
        if (object.userData.rotationSpeed) {
          object.rotation.x += object.userData.rotationSpeed;
          object.rotation.y += object.userData.rotationSpeed * 0.7;
        }
        
        if (object.userData.colorShift) {
          const hue = (time * 0.5 + object.userData.colorShift) % 1;
          object.material.color.setHSL(hue, 0.8, 0.6);
        }
      });
      
      renderer.render(scene, camera);
    };
    
    animate();

    // Store cleanup function
    threeDRefs.current[containerId] = () => {
      container.removeEventListener('mousemove', handleMouseMove);
      container.removeEventListener('mousedown', handleMouseDown);
      container.removeEventListener('mouseup', handleMouseUp);
      container.removeEventListener('mouseleave', handleMouseLeave);
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  };

  const createPerformanceSurface = (scene, results) => {
    const segments = 64;
    const geometry = new THREE.PlaneGeometry(25, 25, segments, segments);
    const vertices = geometry.attributes.position.array;
    
    // Create complex height map based on multiple metrics
    for (let i = 0; i < vertices.length; i += 3) {
      const x = vertices[i];
      const y = vertices[i + 1];
      
      // Base mathematical surface
      const baseHeight = Math.sin(x * 0.2) * Math.cos(y * 0.2) * 3 +
                        Math.sin(x * 0.1 + y * 0.1) * 2;
      
      // Data-driven modulation
      if (results.length > 0) {
        const dataIndex = Math.floor((i / 3) % results.length);
        const result = results[dataIndex];
        const returnMod = (result.return_percent / 50) * 4;
        const sharpeMod = (result.sharpe_ratio || 0) * 1.5;
        vertices[i + 2] = baseHeight + returnMod + sharpeMod;
      } else {
        vertices[i + 2] = baseHeight;
      }
    }
    
    geometry.attributes.position.needsUpdate = true;
    geometry.computeVertexNormals();
    
    // Gradient material
    const material = new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 }
      },
      vertexShader: `
        varying vec3 vPosition;
        varying vec3 vNormal;
        void main() {
          vPosition = position;
          vNormal = normal;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform float time;
        varying vec3 vPosition;
        varying vec3 vNormal;
        void main() {
          float height = vPosition.z + 5.0;
          vec3 color1 = vec3(0.0, 1.0, 0.5); // Cyan
          vec3 color2 = vec3(1.0, 0.2, 0.8); // Magenta
          vec3 color3 = vec3(1.0, 1.0, 0.0); // Yellow
          
          float mixer = (height / 10.0) + sin(time + vPosition.x * 0.1) * 0.3;
          vec3 finalColor = mix(mix(color1, color2, mixer), color3, max(0.0, mixer - 0.5));
          
          gl_FragColor = vec4(finalColor, 0.9);
        }
      `,
      transparent: true,
      side: THREE.DoubleSide
    });
    
    const surface = new THREE.Mesh(geometry, material);
    surface.rotation.x = -Math.PI / 2;
    surface.receiveShadow = true;
    surface.userData.timeUniform = material.uniforms.time;
    scene.add(surface);
    
    // Add particle system above surface
    const particleCount = 100;
    const particleGeometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    
    for (let i = 0; i < particleCount * 3; i += 3) {
      positions[i] = (Math.random() - 0.5) * 30;
      positions[i + 1] = Math.random() * 10 + 5;
      positions[i + 2] = (Math.random() - 0.5) * 30;
    }
    
    particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const particleMaterial = new THREE.PointsMaterial({
      color: 0x00ffff,
      size: 0.3,
      transparent: true,
      opacity: 0.6
    });
    
    const particles = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(particles);
  };

  const createRiskCube = (scene, results) => {
    const group = new THREE.Group();
    
    results.forEach((result, index) => {
      const size = Math.abs(result.sharpe_ratio || 1) * 1.5 + 0.8;
      const geometry = new THREE.BoxGeometry(size, size, size);
      
      // Enhanced material with gradients
      const color = result.return_percent > 0 ? 
        new THREE.Color().setHSL(0.3, 0.8, 0.6) :  // Green for positive
        new THREE.Color().setHSL(0.0, 0.8, 0.6);   // Red for negative
      
      const material = new THREE.MeshPhongMaterial({ 
        color: color,
        transparent: true,
        opacity: 0.85,
        shininess: 100
      });
      
      const cube = new THREE.Mesh(geometry, material);
      
      // Advanced positioning in 3D spiral
      const angle = (index / results.length) * Math.PI * 4;
      const heightOffset = index * 0.5;
      const radius = 8 + Math.abs(result.volatility_annual || 0) * 0.3;
      
      cube.position.x = Math.cos(angle) * radius;
      cube.position.z = Math.sin(angle) * radius;
      cube.position.y = (result.return_percent / 8) + heightOffset;
      
      cube.rotation.x = angle;
      cube.rotation.y = angle * 0.5;
      cube.userData.rotationSpeed = 0.01 + Math.abs(result.sharpe_ratio || 0) * 0.005;
      
      cube.castShadow = true;
      cube.receiveShadow = true;
      group.add(cube);
      
      // Add wireframe outline
      const wireGeometry = geometry.clone();
      const wireMaterial = new THREE.MeshBasicMaterial({ 
        color: 0x00ffff, 
        wireframe: true,
        transparent: true,
        opacity: 0.4
      });
      const wireframe = new THREE.Mesh(wireGeometry, wireMaterial);
      wireframe.position.copy(cube.position);
      wireframe.rotation.copy(cube.rotation);
      wireframe.scale.multiplyScalar(1.02);
      group.add(wireframe);
    });
    
    scene.add(group);
    
    // Add central glowing core
    const coreGeometry = new THREE.SphereGeometry(2, 16, 16);
    const coreMaterial = new THREE.MeshBasicMaterial({ 
      color: 0x00ffff,
      transparent: true,
      opacity: 0.3
    });
    const core = new THREE.Mesh(coreGeometry, coreMaterial);
    core.userData.pulseSpeed = 0.02;
    scene.add(core);
  };

  const createTradeOrbs = (scene, results) => {
    const orbGroup = new THREE.Group();
    
    results.forEach((result, index) => {
      const radius = (result.win_rate / 100) * 2.5 + 0.3;
      const geometry = new THREE.SphereGeometry(radius, 20, 20);
      
      // Enhanced gradient material based on profit factor
      const profitFactor = Math.max(0, Math.min(3, result.profit_factor || 1));
      const hue = profitFactor * 0.15; // Green spectrum for better performance
      const color = new THREE.Color().setHSL(hue, 0.9, 0.7);
      
      const material = new THREE.MeshPhongMaterial({ 
        color: color,
        transparent: true,
        opacity: 0.8,
        shininess: 150,
        emissive: color.clone().multiplyScalar(0.2)
      });
      
      const orb = new THREE.Mesh(geometry, material);
      
      // Complex 3D positioning based on multiple metrics
      const sharpeNormalized = Math.max(-3, Math.min(3, result.sharpe_ratio || 0));
      const returnNormalized = Math.max(-50, Math.min(50, result.return_percent || 0));
      const drawdownNormalized = Math.max(-30, Math.min(0, result.max_drawdown || 0));
      
      orb.position.x = sharpeNormalized * 4;
      orb.position.y = returnNormalized / 3;
      orb.position.z = drawdownNormalized * 0.8;
      
      // Add complex animation data
      orb.userData = {
        originalScale: orb.scale.clone(),
        pulseSpeed: 0.02 + (result.num_trades || 0) * 0.0001,
        originalY: orb.position.y,
        floatSpeed: 0.01 + index * 0.002,
        colorShift: index * 0.1
      };
      
      orb.castShadow = true;
      orbGroup.add(orb);
      
      // Enhanced connecting lines with gradient
      const lineGeometry = new THREE.BufferGeometry();
      const linePositions = new Float32Array([
        0, 0, 0,
        orb.position.x, orb.position.y, orb.position.z
      ]);
      const lineColors = new Float32Array([
        0, 1, 1,  // Cyan at origin
        color.r, color.g, color.b  // Orb color at end
      ]);
      
      lineGeometry.setAttribute('position', new THREE.BufferAttribute(linePositions, 3));
      lineGeometry.setAttribute('color', new THREE.BufferAttribute(lineColors, 3));
      
      const lineMaterial = new THREE.LineBasicMaterial({ 
        vertexColors: true,
        transparent: true,
        opacity: 0.6,
        linewidth: 2
      });
      const line = new THREE.Line(lineGeometry, lineMaterial);
      orbGroup.add(line);
      
      // Add orbital rings around high-performing orbs
      if (result.return_percent > 10) {
        const ringGeometry = new THREE.RingGeometry(radius + 0.5, radius + 0.8, 16);
        const ringMaterial = new THREE.MeshBasicMaterial({ 
          color: 0xffff00,
          transparent: true,
          opacity: 0.5,
          side: THREE.DoubleSide
        });
        const ring = new THREE.Mesh(ringGeometry, ringMaterial);
        ring.position.copy(orb.position);
        ring.lookAt(0, 0, 0);
        ring.userData.rotationSpeed = 0.02;
        orbGroup.add(ring);
      }
    });
    
    scene.add(orbGroup);
  };

  const createPortfolioLandscape = (scene, results) => {
    const gridSize = Math.ceil(Math.sqrt(Math.max(results.length, 9)));
    const spacing = 4;
    const landscapeGroup = new THREE.Group();
    
    results.forEach((result, index) => {
      const row = Math.floor(index / gridSize);
      const col = index % gridSize;
      
      // Multi-segment tower based on performance
      const baseHeight = Math.max(1, (result.return_percent / 8) + 3);
      const segments = Math.min(8, Math.max(2, Math.floor(baseHeight / 2)));
      
      for (let seg = 0; seg < segments; seg++) {
        const segmentHeight = baseHeight / segments;
        const segmentRadius = 0.8 - (seg * 0.1);
        const geometry = new THREE.CylinderGeometry(
          segmentRadius, 
          segmentRadius + 0.2, 
          segmentHeight, 
          12
        );
        
        // Color gradient based on segment and performance
        const riskAdjusted = result.return_percent / Math.max(result.volatility_annual || 1, 1);
        const baseHue = Math.max(0, Math.min(0.35, riskAdjusted * 0.05 + 0.1));
        const segmentHue = baseHue + (seg / segments) * 0.1;
        const color = new THREE.Color().setHSL(segmentHue, 0.9, 0.7 - seg * 0.05);
        
        const material = new THREE.MeshPhongMaterial({ 
          color: color,
          shininess: 100,
          emissive: color.clone().multiplyScalar(0.1)
        });
        
        const tower = new THREE.Mesh(geometry, material);
        
        tower.position.x = (col - gridSize / 2) * spacing;
        tower.position.z = (row - gridSize / 2) * spacing;
        tower.position.y = (seg + 0.5) * segmentHeight;
        
        tower.castShadow = true;
        tower.receiveShadow = true;
        landscapeGroup.add(tower);
      }
      
      // Add glowing top indicator
      const capGeometry = new THREE.SphereGeometry(0.3, 8, 8);
      const capMaterial = new THREE.MeshBasicMaterial({ 
        color: result.return_percent > 0 ? 0x00ff00 : 0xff4444,
        transparent: true,
        opacity: 0.9
      });
      const cap = new THREE.Mesh(capGeometry, capMaterial);
      cap.position.x = (col - gridSize / 2) * spacing;
      cap.position.z = (row - gridSize / 2) * spacing;
      cap.position.y = baseHeight + 0.5;
      
      cap.userData = {
        originalY: cap.position.y,
        floatSpeed: 0.008 + index * 0.001,
        pulseSpeed: 0.03
      };
      
      landscapeGroup.add(cap);
    });
    
    scene.add(landscapeGroup);
    
    // Enhanced ground with grid pattern
    const groundSize = gridSize * spacing + 8;
    const groundGeometry = new THREE.PlaneGeometry(groundSize, groundSize, 32, 32);
    const groundMaterial = new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 }
      },
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform float time;
        varying vec2 vUv;
        void main() {
          vec2 grid = fract(vUv * 20.0);
          float line = smoothstep(0.0, 0.1, min(grid.x, grid.y)) * 
                      smoothstep(0.9, 1.0, max(grid.x, grid.y));
          
          vec3 baseColor = vec3(0.05, 0.05, 0.1);
          vec3 lineColor = vec3(0.0, 0.5, 1.0) * (0.5 + sin(time * 2.0) * 0.3);
          
          gl_FragColor = vec4(mix(baseColor, lineColor, line), 0.8);
        }
      `,
      transparent: true,
      side: THREE.DoubleSide
    });
    
    const ground = new THREE.Mesh(groundGeometry, groundMaterial);
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -0.1;
    ground.receiveShadow = true;
    ground.userData.timeUniform = groundMaterial.uniforms.time;
    scene.add(ground);
  };

  // Effect to create 3D visualizations when section is expanded
  useEffect(() => {
    if (show3D && filteredData.length > 0) {
      setTimeout(() => {
        if (threeDTypes.performanceSurface) {
          create3DVisualization('performance-surface-3d', 'performanceSurface');
        }
        if (threeDTypes.riskCube) {
          create3DVisualization('risk-cube-3d', 'riskCube');
        }
        if (threeDTypes.tradeOrbs) {
          create3DVisualization('trade-orbs-3d', 'tradeOrbs');
        }
        if (threeDTypes.portfolioLandscape) {
          create3DVisualization('portfolio-landscape-3d', 'portfolioLandscape');
        }
      }, 100);
    }
  }, [show3D, threeDTypes, filteredData]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      Object.values(threeDRefs.current).forEach(cleanup => {
        if (typeof cleanup === 'function') cleanup();
      });
    };
  }, []);

  return (
    <div>
      <div className="header">
        <Header />
      </div>
      <div className="main-page-body">
        <SideNavs />
        <div className="main-body-info">
          <h5 className="major-upcoming-news-events-header">Backtested Results</h5><br /><br />
          
          {/* Search and Filter Section */}
          <div className="search-filter-section">
            <div className="search-container">
              <input
                type="text"
                className="form-control search-input"
                placeholder="Search by account name or code..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <br />
              <button 
                className="btn btn-primary filter-toggle-btn"
                onClick={() => setShowFilters(!showFilters)}
              >
                {showFilters ? 'Hide Filters' : 'Show Filters'}
              </button>
              <br /><br />
              <button 
                className="btn btn-primary reset-btn"
                onClick={resetFilters}
              >
                Reset
              </button>
            </div>
            
            {showFilters && (
              <div className="filters-container">
                <div className="filter-group">
                  <h6>Return (%)</h6>
                  <div className="filter-inputs">
                    <input
                      type="number"
                      name="minReturn"
                      placeholder="Min"
                      value={filters.minReturn}
                      onChange={handleFilterChange}
                      className="filter-input"
                    />
                    <span>to</span>
                    <input
                      type="number"
                      name="maxReturn"
                      placeholder="Max"
                      value={filters.maxReturn}
                      onChange={handleFilterChange}
                      className="filter-input"
                    />
                  </div>
                </div>
                
                <div className="filter-group">
                  <h6>Sharpe Ratio</h6>
                  <div className="filter-inputs">
                    <input
                      type="number"
                      name="minSharpe"
                      placeholder="Min"
                      value={filters.minSharpe}
                      onChange={handleFilterChange}
                      className="filter-input"
                    />
                    <span>to</span>
                    <input
                      type="number"
                      name="maxSharpe"
                      placeholder="Max"
                      value={filters.maxSharpe}
                      onChange={handleFilterChange}
                      className="filter-input"
                    />
                  </div>
                </div>
                
                <div className="filter-group">
                  <h6>Profit Factor</h6>
                  <div className="filter-inputs">
                    <input
                      type="number"
                      name="minProfitFactor"
                      placeholder="Min"
                      value={filters.minProfitFactor}
                      onChange={handleFilterChange}
                      className="filter-input"
                    />
                    <span>to</span>
                    <input
                      type="number"
                      name="maxProfitFactor"
                      placeholder="Max"
                      value={filters.maxProfitFactor}
                      onChange={handleFilterChange}
                      className="filter-input"
                    />
                  </div>
                </div>
                
                <div className="filter-group">
                  <h6>Win Rate (%)</h6>
                  <div className="filter-inputs">
                    <input
                      type="number"
                      name="minWinRate"
                      placeholder="Min"
                      value={filters.minWinRate}
                      onChange={handleFilterChange}
                      className="filter-input"
                    />
                    <span>to</span>
                    <input
                      type="number"
                      name="maxWinRate"
                      placeholder="Max"
                      value={filters.maxWinRate}
                      onChange={handleFilterChange}
                      className="filter-input"
                    />
                  </div>
                </div>
              </div>
            )}
            
            {/* Results count and applied filters summary */}
            <div className="filter-summary">
              <div className="results-count">
                {filteredData.length} model{filteredData.length !== 1 ? 's' : ''} found <br />
                 {filteredData.reduce((total, model) => total + model.results.length, 0)} result{filteredData.reduce((total, model) => total + model.results.length, 0) !== 1 ? 's' : ''}
              </div>
              {Object.values(filters).some(val => val !== '') && (
                <div className="applied-filters">
                  Filters applied
                </div>
              )}
            </div>
          </div><br />

          {/* Charts Section */}
          {filteredData.length > 0 && (
            <div className="charts-section">
              <div className="charts-header">
                <button 
                  className="btn btn-primary charts-toggle-btn"
                  onClick={() => setShowCharts(!showCharts)}
                >
                  {showCharts ? 'Hide Charts' : 'Show Analytics Charts'}
                </button>
                
                <button 
                  className="btn btn-primary charts-toggle-btn"
                  onClick={() => setShow3D(!show3D)}
                  style={{ marginLeft: '10px' }}
                >
                  {show3D ? 'Hide 3D Views' : 'Show 3D Visualizations'}
                </button>
              </div>
              
              {showCharts && (
                <div className="charts-container">
                  <div className="chart-controls">
                    <h6>Chart Types:</h6>
                    <div className="chart-toggles">
                      <label>
                        <input
                          type="checkbox"
                          checked={chartTypes.performance}
                          onChange={() => toggleChartType('performance')}
                        />
                        Performance Comparison
                      </label>
                      <label>
                        <input
                          type="checkbox"
                          checked={chartTypes.riskMetrics}
                          onChange={() => toggleChartType('riskMetrics')}
                        />
                        Risk Metrics
                      </label>
                      <label>
                        <input
                          type="checkbox"
                          checked={chartTypes.tradeStats}
                          onChange={() => toggleChartType('tradeStats')}
                        />
                        Trade Statistics
                      </label>
                      <label>
                        <input
                          type="checkbox"
                          checked={chartTypes.distribution}
                          onChange={() => toggleChartType('distribution')}
                        />
                        P&L Distribution
                      </label>
                    </div>
                  </div>
                  
                  <div className="charts-grid">
                    {chartTypes.performance && (
                      <div className="chart-item">
                        <h6>Performance Comparison</h6>
                        <div className="chart-wrapper">
                          <Line data={getPerformanceChartData()} options={chartOptions} />
                        </div>
                      </div>
                    )}
                    
                    {chartTypes.riskMetrics && (
                      <div className="chart-item">
                        <h6>Risk Metrics</h6>
                        <div className="chart-wrapper">
                          <Bar data={getRiskMetricsChartData()} options={chartOptions} />
                        </div>
                      </div>
                    )}
                    
                    {chartTypes.tradeStats && (
                      <div className="chart-item">
                        <h6>Trade Statistics</h6>
                        <div className="chart-wrapper">
                          <Bar data={getTradeStatsChartData()} options={{
                            ...chartOptions,
                            plugins: {
                              ...chartOptions.plugins,
                              tooltip: {
                                callbacks: {
                                  label: function(context) {
                                    let label = context.dataset.label || '';
                                    if (label === 'Profit Factor') {
                                      return `${label}: ${(context.parsed.y / 10).toFixed(2)}`;
                                    }
                                    return `${label}: ${context.parsed.y.toFixed(2)}`;
                                  }
                                }
                              }
                            }
                          }} />
                        </div>
                      </div>
                    )}
                    
                    {chartTypes.distribution && (
                      <div className="chart-item">
                        <h6>P&L Distribution</h6>
                        <div className="chart-wrapper">
                          <Doughnut data={getDistributionChartData()} options={{
                            responsive: true,
                            maintainAspectRatio: false,
                            plugins: {
                              legend: {
                                position: 'bottom',
                              },
                              title: {
                                display: true,
                                text: 'Positive vs Negative Returns',
                              },
                            },
                          }} />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {show3D && (
                <div className="threed-container">
                  <div className="threed-controls">
                    <h6>3D Visualization Types:</h6>
                    <div className="threed-toggles">
                      <label>
                        <input
                          type="checkbox"
                          checked={threeDTypes.performanceSurface}
                          onChange={() => toggle3DType('performanceSurface')}
                        />
                        Performance Surface
                      </label>
                      <label>
                        <input
                          type="checkbox"
                          checked={threeDTypes.riskCube}
                          onChange={() => toggle3DType('riskCube')}
                        />
                        Risk Cube Matrix
                      </label>
                      <label>
                        <input
                          type="checkbox"
                          checked={threeDTypes.tradeOrbs}
                          onChange={() => toggle3DType('tradeOrbs')}
                        />
                        Trade Orb Galaxy
                      </label>
                      <label>
                        <input
                          type="checkbox"
                          checked={threeDTypes.portfolioLandscape}
                          onChange={() => toggle3DType('portfolioLandscape')}
                        />
                        Portfolio Landscape
                      </label>
                    </div>
                  </div>
                  
                  <div className="threed-grid">
                    {threeDTypes.performanceSurface && (
                      <div className="threed-item">
                        <h6>Performance Surface</h6>
                        <p className="threed-description">Interactive 3D surface showing return patterns. Height represents performance, colors show profitability.</p>
                        <div id="performance-surface-3d" className="threed-wrapper"></div>
                      </div>
                    )}
                    
                    {threeDTypes.riskCube && (
                      <div className="threed-item">
                        <h6>Risk Cube Matrix</h6>
                        <p className="threed-description">Rotating cubes sized by Sharpe ratio, positioned by volatility, colored by returns.</p>
                        <div id="risk-cube-3d" className="threed-wrapper"></div>
                      </div>
                    )}
                    
                    {threeDTypes.tradeOrbs && (
                      <div className="threed-item">
                        <h6>Trade Orb Galaxy</h6>
                        <p className="threed-description">Pulsing spheres sized by win rate, positioned by risk metrics, with animated connections.</p>
                        <div id="trade-orbs-3d" className="threed-wrapper"></div>
                      </div>
                    )}
                    
                    {threeDTypes.portfolioLandscape && (
                      <div className="threed-item">
                        <h6>Portfolio Landscape</h6>
                        <p className="threed-description">3D city of performance towers. Height shows returns, color indicates risk-adjusted performance.</p>
                        <div id="portfolio-landscape-3d" className="threed-wrapper"></div>
                      </div>
                    )}
                  </div>
                  
                  <div className="threed-instructions">
                    <p><strong>Controls:</strong> Click and drag to rotate the view. Visualizations auto-rotate when not being controlled.</p>
                  </div>
                </div>
              )}
            </div>
          )}
          
          {/* Debug Panel (Toggle Button) */}
          <div className="debug-section">
            <button 
              className="btn btn-primary debug-toggle-btn"
              onClick={() => {
                const debugPanel = document.getElementById('plot-debug-panel');
                if (debugPanel) {
                  debugPanel.style.display = debugPanel.style.display === 'none' ? 'block' : 'none';
                }
              }}
            >
              Toggle Debug Panel
            </button>
            
            {/* Debug Information Display */}
            <div id="plot-debug-panel" className="debug-panel" style={{ display: 'none' }}>
              <h6>Debug Information</h6>
              <button className='btn btn-primary' onClick={fetchBacktestResults}>Refresh Data</button>
              <div className="debug-info">
                <pre>{JSON.stringify(debugInfo, null, 2)}</pre>
              </div>
              <div className="bokeh-status">
                <h6>Bokeh Status</h6>
                <p>Bokeh Version: {embed?.version || 'Unknown'}</p>
                <p>Embed Available: {typeof embed?.embed_item === 'function' ? 'Yes' : 'No'}</p>
              </div>
            </div>
          </div><br />
          
          {loading ? (
            <div className="loading">Loading backtest results...</div>
          ) : error ? (
            <div className="error">{error}</div>
          ) : filteredData.length === 0 ? (
            <div className="no-data">
              {backtestData.length === 0 ? 
                "No backtest results found" : 
                "No results match your current filters. Try adjusting your search criteria."}
            </div>
          ) : (
            <div className="backtest-models">
              {filteredData.map((modelData, modelIndex) => (
                <div key={modelIndex} className="backtest-model">
                  <div className="model-header-container">
                    <div 
                      className={`model-header ${expandedModel === modelIndex ? '' : ''}`}
                      onClick={() => handleModelClick(modelIndex)}
                    >
                      <div className="model-title">
                        {modelData.model_info.dataset} ({modelData.model_info.start_date} to {modelData.model_info.end_date})
                      </div>
                      <span className="expand-icon">
                        {expandedModel === modelIndex ? '▼' : '▶'}
                      </span>
                    </div>
                    
                    {/* Add Delete Button */}
                    <button 
                      className="delete-model-btn" 
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteBacktestModel(modelData.model_info.id);
                      }}
                      disabled={deleteInProgress}
                    >
                      {deleteInProgress ? 'Deleting...' : 'Delete Model'}
                    </button>
                  </div><br />
                  
                  {expandedModel === modelIndex && (
                    <div className="model-details">
                      <div className="model-info">
                        <p><strong>Initial Capital:</strong> ${modelData.model_info.initial_capital}</p>
                        <div className="code-snippet">
                          <p><strong>Strategy Code:</strong></p>
                          <pre className="code-content">{modelData.model_info.code_snippet}</pre>
                        </div>
                      </div>
                      
                      <h6>Backtest Results ({modelData.results.length})</h6><br />
                      
                      <div className="results-list">
                        {modelData.results.map((result, resultIndex) => (
                          <div key={resultIndex} className="result-item">
                            <div 
                              className={`result-header ${expandedResult === resultIndex ? '' : ''}`}
                              onClick={() => handleResultClick(resultIndex)}
                            >
                              <div className="result-header-content">
                                <span className="result-date">Run on: {new Date(result.created_at).toLocaleString()}</span>
                                <div className="metrics-preview">
                                  <span>Return: {formatValue(result.return_percent, true)}</span>
                                  <span>Sharpe: {formatValue(result.sharpe_ratio)}</span>
                                  <span>Win Rate: {formatValue(result.win_rate, true)}</span>
                                </div>
                              </div>
                              <span className="expand-icon">
                                {expandedResult === resultIndex ? '▼' : '▶'}
                              </span>
                            </div><br />
                            
                            {expandedResult === resultIndex && (
                              <div className="result-details">
                                <div className="metrics-grid">
                                  <div className="metric-group">
                                    <h6>Performance</h6>
                                    <div className="metric">
                                      <span>Return:</span>
                                      <span>{formatValue(result.return_percent, true)}</span>
                                    </div>
                                    <div className="metric">
                                      <span>Buy & Hold Return:</span>
                                      <span>{formatValue(result.buy_hold_return, true)}</span>
                                    </div>
                                    <div className="metric">
                                      <span>Annual Return:</span>
                                      <span>{formatValue(result.annual_return, true)}</span>
                                    </div>
                                    <div className="metric">
                                      <span>Exposure Time:</span>
                                      <span>{formatValue(result.exposure_time, true)}</span>
                                    </div>
                                  </div>
                                  
                                  <div className="metric-group">
                                    <h6>Risk Metrics</h6>
                                    <div className="metric">
                                      <span>Sharpe Ratio:</span>
                                      <span>{formatValue(result.sharpe_ratio)}</span>
                                    </div>
                                    <div className="metric">
                                      <span>Sortino Ratio:</span>
                                      <span>{formatValue(result.sortino_ratio)}</span>
                                    </div>
                                    <div className="metric">
                                      <span>Calmar Ratio:</span>
                                      <span>{formatValue(result.calmar_ratio)}</span>
                                    </div>
                                    <div className="metric">
                                      <span>Volatility (Ann.):</span>
                                      <span>{formatValue(result.volatility_annual, true)}</span>
                                    </div>
                                  </div>
                                  
                                  <div className="metric-group">
                                    <h6>Drawdowns</h6>
                                    <div className="metric">
                                      <span>Max Drawdown:</span>
                                      <span>{formatValue(result.max_drawdown, true)}</span>
                                    </div>
                                    <div className="metric">
                                      <span>Avg Drawdown:</span>
                                      <span>{formatValue(result.avg_drawdown, true)}</span>
                                    </div>
                                    <div className="metric">
                                      <span>Max Drawdown Duration:</span>
                                      <span>{result.max_drawdown_duration}</span>
                                    </div>
                                    <div className="metric">
                                      <span>Avg Drawdown Duration:</span>
                                      <span>{result.avg_drawdown_duration}</span>
                                    </div>
                                  </div>
                                  
                                  <div className="metric-group">
                                    <h6>Trade Statistics</h6>
                                    <div className="metrics-scrollable">
                                      <div className="metric">
                                        <span>Number of Trades:</span>
                                        <span>{result.num_trades}</span>
                                      </div>
                                      <div className="metric">
                                        <span>Win Rate:</span>
                                        <span>{formatValue(result.win_rate, true)}</span>
                                      </div>
                                      <div className="metric">
                                        <span>Best Trade:</span>
                                        <span>{formatValue(result.best_trade, true)}</span>
                                      </div>
                                      <div className="metric">
                                        <span>Worst Trade:</span>
                                        <span>{formatValue(result.worst_trade, true)}</span>
                                      </div>
                                      <div className="metric">
                                        <span>Avg Trade:</span>
                                        <span>{formatValue(result.avg_trade, true)}</span>
                                      </div>
                                      <div className="metric">
                                        <span>Max Trade Duration:</span>
                                        <span>{result.max_trade_duration}</span>
                                      </div>
                                      <div className="metric">
                                        <span>Avg Trade Duration:</span>
                                        <span>{result.avg_trade_duration}</span>
                                      </div>
                                      <div className="metric">
                                        <span>Profit Factor:</span>
                                        <span>{formatValue(result.profit_factor)}</span>
                                      </div>
                                      <div className="metric">
                                        <span>Expectancy:</span>
                                        <span>{formatValue(result.expectancy, true)}</span>
                                      </div>
                                    </div>
                                  </div>
                                </div><br />
                                
                                {result.has_plot && (
                                  <div className="plot-container">
                                    <div className="plot-header">
                                      <h6>Performance Chart</h6>
                                      <button 
                                        className="retry-plot-btn"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          retryRenderPlot(modelIndex, resultIndex);
                                        }}
                                      >
                                        Retry Loading Plot
                                      </button>
                                    </div>
                                    <div 
                                      id={`plot-${modelIndex}-${resultIndex}`}
                                      className="bk-root" 
                                      ref={el => {
                                        if (el) plotRefs.current[`plot-${modelIndex}-${resultIndex}`] = el;
                                      }}
                                    ></div>
                                    {debugInfo[`plot-${modelIndex}-${resultIndex}`]?.generalError && (
                                      <div className="plot-error">
                                        Error rendering plot. Check debug panel for details.
                                      </div>
                                    )}
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* CSS styles */}
      <style jsx>{`
        .charts-section {
          margin-bottom: 30px;
          padding: 20px;
          background-color: #f8f9fa;
          border-radius: 8px;
          border: 1px solid #dee2e6;
        }
        
        .charts-header {
          margin-bottom: 20px;
        }
        
        .charts-toggle-btn {
          background-color: #28a745;
          color: white;
          border: none;
          padding: 10px 20px;
          border-radius: 4px;
          cursor: pointer;
          font-size: 14px;
        }
        
        .charts-toggle-btn:hover {
          background-color: #218838;
        }
        
        .charts-container {
          margin-top: 20px;
        }
        
        .chart-controls {
          margin-bottom: 20px;
          padding: 15px;
          background-color: white;
          border-radius: 4px;
          border: 1px solid #dee2e6;
        }
        
        .chart-toggles {
          display: flex;
          flex-wrap: wrap;
          gap: 15px;
          margin-top: 10px;
        }
        
        .chart-toggles label {
          display: flex;
          align-items: center;
          gap: 5px;
          cursor: pointer;
          font-size: 14px;
        }
        
        .chart-toggles input[type="checkbox"] {
          margin: 0;
        }
        
        .charts-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(500px, 1fr));
          gap: 20px;
        }
        
        .chart-item {
          background-color: white;
          padding: 20px;
          border-radius: 8px;
          border: 1px solid #dee2e6;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        
        .chart-item h6 {
          margin-bottom: 15px;
          color: #495057;
          font-weight: 600;
        }
        
        .chart-wrapper {
          height: 300px;
          position: relative;
        }
        
        @media (max-width: 768px) {
          .charts-grid {
            grid-template-columns: 1fr;
          }
          
          .chart-toggles {
            flex-direction: column;
          }
        }
        
        .debug-section {
          margin-bottom: 20px;
        }
        
        .debug-toggle-btn {
          border: 1px solid #ccc;
          padding: 5px 10px;
          cursor: pointer;
          border-radius: 4px;
        }
        
        .debug-panel {
          background-color: #f8f8f8;
          border: 1px solid #ddd;
          padding: 15px;
          margin-top: 10px;
          border-radius: 4px;
          max-height: 400px;
          overflow-y: auto;
        }
        
        .debug-info {
          font-family: monospace;
          font-size: 12px;
          white-space: pre-wrap;
          background-color: #eee;
          padding: 10px;
          border-radius: 4px;
          max-height: 200px;
          overflow-y: auto;
          margin-top: 10px;
        }
        
        .bokeh-status {
          margin-top: 15px;
          padding-top: 15px;
          border-top: 1px solid #ddd;
        }
        
        .plot-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 10px;
        }
        
        .retry-plot-btn {
          background-color: rgb(12, 128, 236);
          border: 1px solid #ccc;
          padding: 3px 8px;
          font-size: 12px;
          cursor: pointer;
          border-radius: 4px;
          color: white;
        }
        
        .plot-error {
          color: #d9534f;
          background-color: #f9f2f2;
          padding: 10px;
          margin-top: 10px;
          border-radius: 4px;
          border-left: 3px solid #d9534f;
        }
        
        .bk-root {
          min-height: 400px;
          border: 1px solid #eee;
          background-color: white;
          border-radius: 4px;
          padding: 10px;
        }
        
        /* New styles for delete functionality */
        .model-header-container {
          display: flex;
          justify-content: space-between;
          align-items: center;
          width: 100%;
          flex-wrap: wrap; /* Allow wrapping on small screens */
        }
        
        .model-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-grow: 1;
          cursor: pointer;
          padding: 10px;
          background-color: #f5f5f5;
          border-radius: 4px;
          min-width: 0; /* Allow text to be truncated */
          margin-right: 10px; /* Space for the delete button */
        }
        
        .model-title {
          white-space: normal; /* Allow text to wrap */
          overflow: hidden;
          text-overflow: ellipsis;
          word-break: break-word; /* Break long words if needed */
          flex: 1;
        }
        
        .delete-model-btn {
          background-color: #dc3545;
          color: white;
          border: none;
          padding: 5px 10px;
          border-radius: 4px;
          cursor: pointer;
          font-size: 14px;
          align-self: flex-start;
          margin-top: 10px; /* Space when wrapped to next line */
        }
        
        @media (min-width: 768px) {
          .delete-model-btn {
            margin-top: 0; /* Reset margin on larger screens */
          }
        }
        
        .delete-model-btn:disabled {
          background-color: #6c757d;
          cursor: not-allowed;
        }
        
        .delete-model-btn:hover:not(:disabled) {
          background-color: #c82333;
        }
        
        /* Code snippet improvements */
        .code-snippet {
          margin-top: 8px;
          position: relative;
        }
        
        .code-content {
          background-color: #f0f0f0;
          padding: 8px;
          border-radius: 4px;
          font-size: 12px;
          overflow-x: auto;
          max-height: none; /* Remove the height limit to show all content */
          border: 1px solid #ddd;
          white-space: pre-wrap; /* Allow wrapping of long lines */
          word-break: break-word; /* Break long words if needed */
        }
        
        /* Result header improvements */
        .result-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 10px 14px;
          cursor: pointer;
          background-color: #f5f5f5;
          transition: background-color 0.2s;
          flex-wrap: wrap; /* Allow content to wrap on mobile */
        }
        
        .result-header-content {
          display: flex;
          flex-direction: column; /* Stack date and metrics vertically */
          flex: 1;
          min-width: 0; /* Allow content to be truncated */
        }
        
        .result-date {
          margin-bottom: 5px;
          font-weight: 500;
        }
        
        .metrics-preview {
          display: flex;
          flex-wrap: wrap; /* Allow metrics to wrap */
          gap: 10px; /* Space between metrics */
          color: #555;
          font-size: 13px;
        }
        
        /* Mobile improvements */
        @media (max-width: 767px) {
          .metrics-grid {
            grid-template-columns: 1fr; /* Single column on mobile */
          }
          
          .model-header-container {
            flex-direction: column;
          }
          
          .model-header {
            width: 100%;
            margin-right: 0;
            margin-bottom: 8px;
          }
          
          .delete-model-btn {
            align-self: flex-end;
          }
        }
        
        /* Make the metrics scrollable on mobile for Trade Statistics */
        .metrics-scrollable {
          max-height: 200px;
          overflow-y: auto;
          padding-right: 5px;
        }
        
        /* Main wrapper responsive adjustments */
        .main-body-info {
          padding: 15px;
          overflow-x: hidden; /* Prevent horizontal scrolling */
        }
      `}</style>
    </div>
  );
}