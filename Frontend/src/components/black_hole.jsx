import React, { useEffect, useState, useRef } from "react";

export default function BlackHole() {
    const canvasRef = useRef(null);
    const [physicsMode, setPhysicsMode] = useState('schwarzschild');
    const [rotationSpeed, setRotationSpeed] = useState(0);
    const [observerDistance, setObserverDistance] = useState(10);
    const [timeDilation, setTimeDilation] = useState({ distant: 1, close: 1 });
    const [isAnimating, setIsAnimating] = useState(true);
    const [colorTheme, setColorTheme] = useState('purple');
    const animationRef = useRef(null);

    const themes = {
        purple: {
            primary: '#8a2be2',
            secondary: '#9d4edd',
            accent: '#b967ff',
            glow: 'rgba(138, 43, 226, 0.5)',
            glowBright: 'rgba(138, 43, 226, 0.8)',
            gradient: 'linear-gradient(135deg, #0a0a0a 0%, #1a0a2e 50%, #0a0a0a 100%)',
            rgb: { r: 138, g: 43, b: 226 },
        },
        cyan: {
            primary: '#00bcd4',
            secondary: '#26c6da',
            accent: '#4dd0e1',
            glow: 'rgba(0, 188, 212, 0.5)',
            glowBright: 'rgba(0, 188, 212, 0.8)',
            gradient: 'linear-gradient(135deg, #0a0a0a 0%, #0a1a2e 50%, #0a0a0a 100%)',
            rgb: { r: 0, g: 188, b: 212 },
        }
    };

    const theme = themes[colorTheme];

    const styles = {
        container: {
            width: '100%',
            minHeight: '100vh',
            background: theme.gradient,
            padding: '2rem',
            fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
            transition: 'background 0.5s ease',
        },
        header: {
            textAlign: 'center',
            marginBottom: '2rem',
        },
        title: {
            color: '#fff',
            fontSize: '2.5rem',
            fontWeight: '700',
            marginBottom: '0.5rem',
            textShadow: `0 0 20px ${theme.glow}`,
        },
        subtitle: {
            color: '#b8b8d4',
            fontSize: '1rem',
            fontWeight: '300',
        },
        mainGrid: {
            display: 'grid',
            gridTemplateColumns: '1fr 350px',
            gap: '2rem',
            maxWidth: '1600px',
            margin: '0 auto',
        },
        canvasContainer: {
            background: 'rgba(0, 0, 0, 0.6)',
            borderRadius: '20px',
            padding: '1.5rem',
            boxShadow: `0 8px 32px ${theme.glow}`,
            border: `1px solid ${theme.primary}33`,
        },
        canvas: {
            width: '100%',
            height: '600px',
            borderRadius: '12px',
            background: '#000',
            cursor: 'crosshair',
        },
        controlPanel: {
            display: 'flex',
            flexDirection: 'column',
            gap: '1.5rem',
        },
        card: {
            background: 'rgba(20, 20, 40, 0.8)',
            borderRadius: '16px',
            padding: '1.5rem',
            border: `1px solid ${theme.primary}4d`,
            boxShadow: '0 4px 16px rgba(0, 0, 0, 0.4)',
        },
        cardTitle: {
            color: '#fff',
            fontSize: '1.2rem',
            fontWeight: '600',
            marginBottom: '1rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
        },
        buttonGroup: {
            display: 'flex',
            gap: '0.5rem',
            marginBottom: '1rem',
        },
        button: {
            flex: 1,
            padding: '0.75rem',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '0.9rem',
            fontWeight: '600',
            transition: 'all 0.3s ease',
            background: `${theme.primary}33`,
            color: '#b8b8d4',
            border: `1px solid ${theme.primary}4d`,
        },
        buttonActive: {
            background: `linear-gradient(135deg, ${theme.primary} 0%, ${theme.secondary} 100%)`,
            color: '#fff',
            boxShadow: `0 4px 12px ${theme.glow}`,
        },
        sliderContainer: {
            marginBottom: '1rem',
        },
        label: {
            color: '#b8b8d4',
            fontSize: '0.9rem',
            marginBottom: '0.5rem',
            display: 'block',
        },
        slider: {
            width: '100%',
            height: '6px',
            borderRadius: '3px',
            background: `${theme.primary}33`,
            outline: 'none',
            WebkitAppearance: 'none',
        },
        valueDisplay: {
            color: '#fff',
            fontSize: '1rem',
            fontWeight: '600',
            marginTop: '0.5rem',
        },
        timeDilationDisplay: {
            background: `${theme.primary}1a`,
            padding: '1rem',
            borderRadius: '8px',
            marginBottom: '0.5rem',
        },
        timeDilationLabel: {
            color: theme.primary,
            fontSize: '0.85rem',
            fontWeight: '600',
            marginBottom: '0.25rem',
        },
        timeDilationValue: {
            color: '#fff',
            fontSize: '1.5rem',
            fontWeight: '700',
        },
        infoText: {
            color: '#7c7c9e',
            fontSize: '0.85rem',
            lineHeight: '1.4',
            marginTop: '0.5rem',
        },
        themeToggle: {
            display: 'flex',
            gap: '0.5rem',
            marginBottom: '1rem',
        },
        themeButton: {
            flex: 1,
            padding: '0.5rem',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '0.85rem',
            fontWeight: '600',
            transition: 'all 0.3s ease',
        },
    };

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;

        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        const blackHoleRadius = 50;
        let angle = 0;

        // Generate static stars once
        const stars = [];
        for (let i = 0; i < 500; i++) {
            stars.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                size: Math.random() * 2,
                brightness: Math.random(),
                twinkleSpeed: Math.random() * 0.02 + 0.01,
                twinkleOffset: Math.random() * Math.PI * 2,
                color: Math.random() > 0.8 ? { r: 255, g: 200, b: 150 } : { r: 255, g: 255, b: 255 }
            });
        }

        // Calculate time dilation
        const calculateTimeDilation = () => {
            const rs = 2;
            const distantR = observerDistance;
            const closeR = 3;

            const distantDilation = 1 / Math.sqrt(Math.max(0.01, 1 - rs / distantR));
            const closeDilation = 1 / Math.sqrt(Math.max(0.01, 1 - rs / closeR));

            setTimeDilation({
                distant: distantDilation.toFixed(3),
                close: closeDilation.toFixed(3),
            });
        };

        // Enhanced gravitational lensing calculation
        const applyGravitationalLensing = (x, y) => {
            const dx = x - centerX;
            const dy = y - centerY;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < blackHoleRadius * 1.5) return null; // Inside photon sphere
            
            // More realistic lensing based on Schwarzschild solution
            const rs = blackHoleRadius * 2; // Schwarzschild radius
            const bendingAngle = rs / distance * 1.5;
            const angle = Math.atan2(dy, dx);
            
            const lensedX = x + Math.cos(angle + Math.PI / 2) * bendingAngle * 30;
            const lensedY = y + Math.sin(angle + Math.PI / 2) * bendingAngle * 30;
            
            return { lensedX, lensedY, distance };
        };

        // Draw stars with enhanced lensing
        const drawStars = (frame) => {
            stars.forEach(star => {
                const lensed = applyGravitationalLensing(star.x, star.y);
                if (!lensed) return;
                
                const { lensedX, lensedY, distance } = lensed;
                const lensingStrength = Math.max(0, 1 - distance / (blackHoleRadius * 8));
                
                // Twinkling effect
                const twinkle = Math.sin(frame * star.twinkleSpeed + star.twinkleOffset) * 0.5 + 0.5;
                const alpha = star.brightness * twinkle * (1 - lensingStrength * 0.8);
                
                // Gravitational redshift for very close stars
                const redshift = lensingStrength * 50;
                const r = Math.min(255, star.color.r + redshift);
                const g = Math.max(0, star.color.g - redshift * 0.3);
                const b = Math.max(0, star.color.b - redshift * 0.5);
                
                // Draw star with glow
                ctx.shadowBlur = star.size * 4;
                ctx.shadowColor = `rgba(${r}, ${g}, ${b}, ${alpha})`;
                ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${alpha})`;
                ctx.beginPath();
                ctx.arc(lensedX, lensedY, star.size, 0, Math.PI * 2);
                ctx.fill();
            });
            ctx.shadowBlur = 0;
        };

        // Enhanced Einstein ring effect
        const drawEinsteinRing = () => {
            for (let i = 0; i < 2; i++) {
                const ringRadius = blackHoleRadius * (2.6 + i * 0.3);
                const gradient = ctx.createRadialGradient(
                    centerX, centerY, ringRadius - 5,
                    centerX, centerY, ringRadius + 5
                );
                
                gradient.addColorStop(0, 'rgba(255, 255, 255, 0)');
                gradient.addColorStop(0.5, `rgba(${theme.rgb.r}, ${theme.rgb.g}, ${theme.rgb.b}, ${0.3 - i * 0.1})`);
                gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');

                ctx.strokeStyle = gradient;
                ctx.lineWidth = 3;
                ctx.shadowBlur = 10;
                ctx.shadowColor = theme.glow;
                ctx.beginPath();
                ctx.arc(centerX, centerY, ringRadius, 0, Math.PI * 2);
                ctx.stroke();
            }
            ctx.shadowBlur = 0;
        };

        // Enhanced accretion disk with Doppler shifting
        const drawAccretionDisk = () => {
            const particles = [];
            
            // Generate all particles with depth and velocity
            for (let layer = 0; layer < 5; layer++) {
                const layerOffset = layer * 15;
                for (let i = 0; i < 500; i++) {
                    const diskAngle = (i + angle * (40 + rotationSpeed * 80)) * Math.PI / 180;
                    const baseRadius = blackHoleRadius * 2 + layerOffset;
                    const radiusVariation = Math.sin(i * 0.3 + angle * 2) * 5;
                    const distance = baseRadius + radiusVariation;
                    
                    const x = centerX + Math.cos(diskAngle) * distance;
                    const sinAngle = Math.sin(diskAngle);
                    const y = centerY + sinAngle * distance * 0.25;
                    const z = sinAngle; // Depth for sorting
                    
                    // Orbital velocity for Doppler shift
                    const velocity = Math.sqrt(1 / distance) * (1 + rotationSpeed);
                    const approaching = Math.cos(diskAngle) > 0;

                    // Temperature based on distance
                    const temp = 1 - (distance - blackHoleRadius * 2) / (blackHoleRadius * 3);
                    
                    particles.push({ x, y, z, distance, temp, angle: diskAngle, velocity, approaching });
                }
            }

            // Sort particles: back to front
            particles.sort((a, b) => a.z - b.z);

            // Draw particles
            particles.forEach(p => {
                // Skip particles behind the black hole
                if (p.z > 0.75) return;
                
                // Doppler shift calculation
                const dopplerShift = p.approaching ? p.velocity * 30 : -p.velocity * 30;
                
                // Base temperature color
                let hue = 15 + p.temp * 50 + dopplerShift;
                hue = Math.max(0, Math.min(65, hue));
                
                const lightness = 35 + p.temp * 50 + Math.sin(p.angle * 5 + angle * 3) * 15;
                const saturation = 85 + p.temp * 15;
                
                // Relativistic beaming - approaching side appears brighter
                let alpha = 0.15 + p.temp * 0.4;
                if (p.approaching) {
                    alpha *= (1 + p.velocity * 0.5);
                } else {
                    alpha *= (1 - p.velocity * 0.3);
                }
                
                // Fade particles behind the black hole
                if (p.z > 0) alpha *= (1 - p.z) * 0.4;
                
                // Gravitational brightening near event horizon
                const brightening = Math.max(0, (1 - (p.distance - blackHoleRadius * 2) / (blackHoleRadius * 2)));
                alpha *= (1 + brightening * 0.5);
                
                ctx.fillStyle = `hsla(${hue}, ${saturation}%, ${lightness}%, ${alpha})`;
                ctx.shadowBlur = 8 + p.temp * 15 + (p.approaching ? 5 : 0);
                ctx.shadowColor = `hsla(${hue}, 100%, 70%, ${0.7 * alpha})`;
                
                const particleSize = 1.5 + p.temp * 3 + Math.random() * 0.5;
                ctx.beginPath();
                ctx.arc(p.x, p.y, particleSize, 0, Math.PI * 2);
                ctx.fill();
            });
            
            ctx.shadowBlur = 0;

            // Enhanced jets for Kerr black holes
            if (physicsMode === 'kerr' && rotationSpeed > 0.3) {
                const jetHeight = blackHoleRadius * 5 * rotationSpeed;
                const jetWidth = 12 * (1 + rotationSpeed * 0.5);
                
                // Upper jet
                const jetGradient = ctx.createLinearGradient(centerX, centerY - jetHeight, centerX, centerY);
                jetGradient.addColorStop(0, 'rgba(100, 150, 255, 0)');
                jetGradient.addColorStop(0.2, `rgba(150, 200, 255, ${0.2 * rotationSpeed})`);
                jetGradient.addColorStop(0.5, `rgba(${theme.rgb.r}, ${theme.rgb.g}, ${theme.rgb.b}, ${0.15 * rotationSpeed})`);
                jetGradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
                
                ctx.fillStyle = jetGradient;
                ctx.fillRect(centerX - jetWidth / 2, centerY - jetHeight, jetWidth, jetHeight);
                
                // Lower jet
                const jetGradient2 = ctx.createLinearGradient(centerX, centerY, centerX, centerY + jetHeight);
                jetGradient2.addColorStop(0, 'rgba(0, 0, 0, 0)');
                jetGradient2.addColorStop(0.5, `rgba(${theme.rgb.r}, ${theme.rgb.g}, ${theme.rgb.b}, ${0.15 * rotationSpeed})`);
                jetGradient2.addColorStop(0.8, `rgba(150, 200, 255, ${0.2 * rotationSpeed})`);
                jetGradient2.addColorStop(1, 'rgba(100, 150, 255, 0)');
                
                ctx.fillStyle = jetGradient2;
                ctx.fillRect(centerX - jetWidth / 2, centerY, jetWidth, jetHeight);
            }
        };

        // Enhanced gravitational lensing effect
        const drawLensing = () => {
            // Multiple gradient layers for realistic light bending
            for (let i = 0; i < 4; i++) {
                const gradient = ctx.createRadialGradient(
                    centerX, centerY, blackHoleRadius + i * 15,
                    centerX, centerY, blackHoleRadius * 5 + i * 25
                );
                
                const alpha1 = 0.35 - i * 0.08;
                const alpha2 = 0.18 - i * 0.04;
                const alpha3 = 0.1 - i * 0.02;
                
                gradient.addColorStop(0, `rgba(${theme.rgb.r}, ${theme.rgb.g}, ${theme.rgb.b}, ${alpha1})`);
                gradient.addColorStop(0.3, `rgba(${Math.floor(theme.rgb.r * 0.7)}, ${Math.floor(theme.rgb.g * 0.5)}, ${Math.floor(theme.rgb.b * 0.8)}, ${alpha2})`);
                gradient.addColorStop(0.7, `rgba(${Math.floor(theme.rgb.r * 0.4)}, ${Math.floor(theme.rgb.g * 0.3)}, ${Math.floor(theme.rgb.b * 0.6)}, ${alpha3})`);
                gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');

                ctx.fillStyle = gradient;
                ctx.beginPath();
                ctx.arc(centerX, centerY, blackHoleRadius * 6, 0, Math.PI * 2);
                ctx.fill();
            }
        };

        // Enhanced event horizon
        const drawEventHorizon = () => {
            // Pure black center
            ctx.fillStyle = '#000000';
            ctx.beginPath();
            ctx.arc(centerX, centerY, blackHoleRadius * 0.96, 0, Math.PI * 2);
            ctx.fill();

            // Multi-layered event horizon glow
            for (let i = 0; i < 3; i++) {
                const gradient = ctx.createRadialGradient(
                    centerX, centerY, blackHoleRadius * (0.96 + i * 0.05),
                    centerX, centerY, blackHoleRadius * (1.15 + i * 0.05)
                );
                gradient.addColorStop(0, `rgba(${theme.rgb.r}, ${theme.rgb.g}, ${theme.rgb.b}, ${0.9 - i * 0.25})`);
                gradient.addColorStop(0.5, `rgba(${theme.rgb.r}, ${theme.rgb.g}, ${theme.rgb.b}, ${0.5 - i * 0.15})`);
                gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');

                ctx.fillStyle = gradient;
                ctx.beginPath();
                ctx.arc(centerX, centerY, blackHoleRadius * (1.15 + i * 0.05), 0, Math.PI * 2);
                ctx.fill();
            }

            // Enhanced pulsing edge effect
            const pulseIntensity = 0.5 + Math.sin(angle * 2) * 0.3;
            ctx.strokeStyle = `rgba(${theme.rgb.r}, ${theme.rgb.g}, ${theme.rgb.b}, ${pulseIntensity})`;
            ctx.lineWidth = 2.5;
            ctx.shadowBlur = 20;
            ctx.shadowColor = theme.glowBright;
            ctx.beginPath();
            ctx.arc(centerX, centerY, blackHoleRadius, 0, Math.PI * 2);
            ctx.stroke();
            ctx.shadowBlur = 0;
        };

        // Enhanced photon sphere with multiple unstable orbits
        const drawPhotonSphere = () => {
            // Inner photon sphere
            ctx.strokeStyle = `rgba(100, 200, 255, ${0.25 + Math.sin(angle) * 0.1})`;
            ctx.lineWidth = 2;
            ctx.setLineDash([8, 8]);
            ctx.shadowBlur = 10;
            ctx.shadowColor = 'rgba(100, 200, 255, 0.5)';
            ctx.beginPath();
            ctx.arc(centerX, centerY, blackHoleRadius * 1.5, -Math.PI * 0.5, Math.PI * 0.5);
            ctx.stroke();
            
            // Outer unstable orbit
            ctx.strokeStyle = `rgba(100, 200, 255, ${0.15 + Math.sin(angle * 0.7) * 0.05})`;
            ctx.lineWidth = 1.5;
            ctx.setLineDash([12, 12]);
            ctx.shadowBlur = 8;
            ctx.beginPath();
            ctx.arc(centerX, centerY, blackHoleRadius * 1.8, -Math.PI * 0.5, Math.PI * 0.5);
            ctx.stroke();
            
            ctx.setLineDash([]);
            ctx.shadowBlur = 0;
        };

        // Enhanced ergosphere for Kerr black hole
        const drawErgosphere = () => {
            if (physicsMode === 'kerr') {
                const ergoFactor = 1 + rotationSpeed * 0.5;
                
                // Main ergosphere boundary
                ctx.strokeStyle = `rgba(255, 100, 100, ${0.3 + Math.sin(angle * 1.5) * 0.12})`;
                ctx.lineWidth = 2.5;
                ctx.setLineDash([15, 10]);
                ctx.shadowBlur = 15;
                ctx.shadowColor = 'rgba(255, 100, 100, 0.6)';
                ctx.beginPath();
                ctx.ellipse(centerX, centerY, blackHoleRadius * 2.5 * ergoFactor, blackHoleRadius * 2.2, 0, -Math.PI * 0.5, Math.PI * 0.5);
                ctx.stroke();
                
                // Inner ergosphere boundary
                ctx.strokeStyle = `rgba(255, 120, 120, ${0.2 + Math.sin(angle * 1.8) * 0.08})`;
                ctx.lineWidth = 1.5;
                ctx.setLineDash([10, 8]);
                ctx.shadowBlur = 10;
                ctx.beginPath();
                ctx.ellipse(centerX, centerY, blackHoleRadius * 2 * ergoFactor, blackHoleRadius * 1.8, 0, -Math.PI * 0.5, Math.PI * 0.5);
                ctx.stroke();
                
                ctx.setLineDash([]);
                ctx.shadowBlur = 0;
            }
        };

        let frame = 0;
        const animate = () => {
            ctx.fillStyle = '#000';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            drawStars(frame);
            drawLensing();
            drawEinsteinRing();
            
            // Draw back parts of rings first
            drawErgosphere();
            drawPhotonSphere();
            
            // Then the accretion disk
            drawAccretionDisk();
            
            // Finally the black hole on top
            drawEventHorizon();

            // Rotation indicator
            if (physicsMode === 'kerr' && rotationSpeed > 0) {
                ctx.fillStyle = 'rgba(255, 100, 100, 0.9)';
                ctx.font = 'bold 16px monospace';
                ctx.shadowBlur = 8;
                ctx.shadowColor = 'rgba(255, 100, 100, 0.9)';
                ctx.fillText(`↻ ${(rotationSpeed * 100).toFixed(0)}%`, 15, 30);
                ctx.shadowBlur = 0;
            }

            angle += 0.015;
            frame++;
            calculateTimeDilation();

            if (isAnimating) {
                animationRef.current = requestAnimationFrame(animate);
            }
        };

        animate();

        return () => {
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current);
            }
        };
    }, [physicsMode, rotationSpeed, observerDistance, isAnimating, colorTheme]);

    return (
        <div style={styles.container}>
            <div style={styles.header}>
                <h1 style={styles.title}>⚫ Black Hole Simulator</h1>
                <p style={styles.subtitle}>Explore the extremes of spacetime curvature</p>
            </div>

            <div style={styles.mainGrid}>
                <div style={styles.canvasContainer}>
                    <canvas ref={canvasRef} style={styles.canvas} />
                </div>

                <div style={styles.controlPanel}>
                    <div style={styles.card}>
                        <h3 style={styles.cardTitle}>🎨 Color Theme</h3>
                        <div style={styles.themeToggle}>
                            <button
                                style={{
                                    ...styles.themeButton,
                                    background: colorTheme === 'purple' ? 'linear-gradient(135deg, #8a2be2 0%, #9d4edd 100%)' : 'rgba(138, 43, 226, 0.2)',
                                    color: colorTheme === 'purple' ? '#fff' : '#b8b8d4',
                                    border: '1px solid rgba(138, 43, 226, 0.3)',
                                    boxShadow: colorTheme === 'purple' ? '0 4px 12px rgba(138, 43, 226, 0.5)' : 'none',
                                }}
                                onClick={() => setColorTheme('purple')}
                            >
                                Purple
                            </button>
                            <button
                                style={{
                                    ...styles.themeButton,
                                    background: colorTheme === 'cyan' ? 'linear-gradient(135deg, #00bcd4 0%, #26c6da 100%)' : 'rgba(0, 188, 212, 0.2)',
                                    color: colorTheme === 'cyan' ? '#fff' : '#b8b8d4',
                                    border: '1px solid rgba(0, 188, 212, 0.3)',
                                    boxShadow: colorTheme === 'cyan' ? '0 4px 12px rgba(0, 188, 212, 0.5)' : 'none',
                                }}
                                onClick={() => setColorTheme('cyan')}
                            >
                                Cyan
                            </button>
                        </div>
                    </div>

                    <div style={styles.card}>
                        <h3 style={styles.cardTitle}>🌀 Physics Mode</h3>
                        <div style={styles.buttonGroup}>
                            <button
                                style={{
                                    ...styles.button,
                                    ...(physicsMode === 'schwarzschild' ? styles.buttonActive : {})
                                }}
                                onClick={() => {
                                    setPhysicsMode('schwarzschild');
                                    setRotationSpeed(0);
                                }}
                            >
                                Schwarzschild
                            </button>
                            <button
                                style={{
                                    ...styles.button,
                                    ...(physicsMode === 'kerr' ? styles.buttonActive : {})
                                }}
                                onClick={() => setPhysicsMode('kerr')}
                            >
                                Kerr
                            </button>
                        </div>
                        <p style={styles.infoText}>
                            {physicsMode === 'schwarzschild' 
                                ? 'Non-rotating black hole with spherical symmetry'
                                : 'Rotating black hole with frame-dragging effects'}
                        </p>
                    </div>

                    {physicsMode === 'kerr' && (
                        <div style={styles.card}>
                            <h3 style={styles.cardTitle}>🌪️ Rotation Speed</h3>
                            <div style={styles.sliderContainer}>
                                <input
                                    type="range"
                                    min="0"
                                    max="1"
                                    step="0.01"
                                    value={rotationSpeed}
                                    onChange={(e) => setRotationSpeed(parseFloat(e.target.value))}
                                    style={styles.slider}
                                />
                                <div style={styles.valueDisplay}>
                                    {(rotationSpeed * 100).toFixed(0)}% of maximum
                                </div>
                            </div>
                            <p style={styles.infoText}>
                                Angular momentum affects the ergosphere and accretion disk dynamics
                            </p>
                        </div>
                    )}

                    <div style={styles.card}>
                        <h3 style={styles.cardTitle}>⏱️ Time Dilation</h3>
                        
                        <div style={styles.timeDilationDisplay}>
                            <div style={styles.timeDilationLabel}>Distant Observer (10 Rs)</div>
                            <div style={styles.timeDilationValue}>{timeDilation.distant}×</div>
                        </div>

                        <div style={styles.timeDilationDisplay}>
                            <div style={styles.timeDilationLabel}>Close Observer (3 Rs)</div>
                            <div style={styles.timeDilationValue}>{timeDilation.close}×</div>
                        </div>

                        <p style={styles.infoText}>
                            Time flows slower closer to the black hole. A factor of {timeDilation.close}× means 1 second 
                            for the close observer equals {timeDilation.close} seconds for a distant observer.
                        </p>
                    </div>

                    <div style={styles.card}>
                        <h3 style={styles.cardTitle}>📏 Observer Distance</h3>
                        <div style={styles.sliderContainer}>
                            <input
                                type="range"
                                min="3"
                                max="20"
                                step="0.5"
                                value={observerDistance}
                                onChange={(e) => setObserverDistance(parseFloat(e.target.value))}
                                style={styles.slider}
                            />
                            <div style={styles.valueDisplay}>
                                {observerDistance.toFixed(1)} Schwarzschild radii
                            </div>
                        </div>
                    </div>

                    <div style={styles.card}>
                        <h3 style={styles.cardTitle}>ℹ️ Features</h3>
                        <p style={styles.infoText}>
                            • <strong>Event Horizon:</strong> Colored boundary of no return<br/>
                            • <strong>Photon Sphere:</strong> Blue dashed circles where light orbits<br/>
                            • <strong>Einstein Ring:</strong> Gravitational lensing ring effect<br/>
                            • <strong>Accretion Disk:</strong> Superheated matter with Doppler shifting<br/>
                            • <strong>Relativistic Beaming:</strong> Approaching side appears brighter<br/>
                            {physicsMode === 'kerr' && '• Ergosphere: Red dashed region where spacetime is dragged<br/>'}
                            {physicsMode === 'kerr' && rotationSpeed > 0.3 && '• Relativistic Jets: High-energy particle streams'}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}