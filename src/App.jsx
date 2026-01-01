import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Sparkles, Gift, PartyPopper, Play } from 'lucide-react';

const Snow = () => {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        let w = canvas.width = window.innerWidth;
        let h = canvas.height = window.innerHeight;

        const particles = [];
        const count = 300;

        for (let i = 0; i < count; i++) {
            particles.push({
                x: Math.random() * w,
                y: Math.random() * h,
                r: Math.random() * 2 + 0.5,
                d: Math.random() * count,
                vx: Math.random() * 0.5 - 0.25,
                vy: Math.random() * 1.5 + 0.5,
                opacity: Math.random() * 0.6 + 0.2
            })
        }

        const draw = () => {
            ctx.clearRect(0, 0, w, h);

            for (let i = 0; i < count; i++) {
                let p = particles[i];
                ctx.fillStyle = `rgba(255, 255, 255, ${p.opacity})`;
                ctx.beginPath();
                ctx.moveTo(p.x, p.y);
                ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2, true);
                ctx.fill();
            }
            update();
            requestAnimationFrame(draw);
        }

        let angle = 0;
        const update = () => {
            angle += 0.005;
            for (let i = 0; i < count; i++) {
                let p = particles[i];
                p.y += p.vy;
                p.x += Math.sin(angle + p.d) + p.vx;

                if (p.x > w + 5 || p.x < -5 || p.y > h) {
                    if (i % 3 > 0) {
                        particles[i] = { x: Math.random() * w, y: -10, r: p.r, d: p.d, vx: p.vx, vy: p.vy, opacity: p.opacity };
                    } else {
                        if (Math.sin(angle) > 0) {
                            particles[i] = { x: -5, y: Math.random() * h, r: p.r, d: p.d, vx: p.vx, vy: p.vy, opacity: p.opacity };
                        } else {
                            particles[i] = { x: w + 5, y: Math.random() * h, r: p.r, d: p.d, vx: p.vx, vy: p.vy, opacity: p.opacity };
                        }
                    }
                }
            }
        }

        draw();

        const handleResize = () => {
            w = canvas.width = window.innerWidth;
            h = canvas.height = window.innerHeight;
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-10" />;
};

const BorgoPanorama = () => {
    return (
        <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
            {/* 1. Deep Night Sky - Darker background to make terrain pop */}
            <div className="absolute inset-0 z-0 bg-gradient-to-b from-[#020617] via-[#0f172a] to-[#1e293b]" />
            <div className="absolute inset-0 opacity-20 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] mix-blend-soft-light" />

            <motion.div
                animate={{ x: ["0%", "-50%"] }}
                transition={{ duration: 120, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 flex w-[200%] h-full"
            >
                {/* 360 Loop Container - render twice for seamless scrolling */}
                {[0, 1].map((i) => (
                    <div key={i} className="relative w-1/2 h-full flex items-end">
                        <svg className="absolute bottom-0 w-full h-full" viewBox="0 0 1000 400" preserveAspectRatio="none">

                            {/* --- LAYER 1: SKY & SEA (Background) --- */}
                            <defs>
                                <linearGradient id={`seaGlow-${i}`} x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor="#2563eb" />
                                    <stop offset="100%" stopColor="#1e3a8a" />
                                </linearGradient>
                            </defs>

                            {/* The Sea (East: 600-700) - Positioning it behind everything */}
                            <rect x="600" y="380" width="100" height="20" fill={`url(#seaGlow-${i})`} />

                            {/* --- LAYER 2: COASTAL PLAINS & LOW HILLS (Mid) --- */}
                            {/* Connecting terrain. Low near sea (600-700), rising to mountains (0/1000) */}
                            <path d="M0,400 L0,350 L300,350 C380,350 450,320 550,390 L600,390 L700,390 C800,320 900,350 1000,350 L1000,400 Z" fill="#475569" stroke="none" />

                            {/* --- LAYER 3: MOUNTAINS (West: 0-300) --- */}
                            {/* Single Apennine Block. High peaks. */}
                            <path d="M-50,400 L-50,200 L50,140 L120,220 L180,160 L240,240 L300,400 Z" fill="#64748b" stroke="none" />
                            {/* Wrap-around mountain part (end of loop) */}
                            <path d="M950,400 L1000,240 L1050,160 L1050,400 Z" fill="#64748b" stroke="none" />

                            {/* Snow Caps */}
                            <path d="M40,155 L50,140 L60,155 Z" fill="#f8fafc" />
                            <path d="M170,175 L180,160 L190,175 Z" fill="#f8fafc" />

                            {/* --- LAYER 4: FOREGROUND (Continuous) --- */}
                            <path d="M0,400 L0,380 C150,385 300,370 500,390 C700,370 850,385 1000,380 L1000,400 Z" fill="#334155" stroke="none" />

                        </svg>
                    </div>
                ))}
            </motion.div>
            {/* Vignette */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_50%,rgba(0,0,0,0.6))] pointer-events-none" />
        </div>
    );
};

const DroneShow = ({ isCelebration }) => {
    const canvasRef = useRef(null);
    const celebrationRef = useRef(isCelebration);

    useEffect(() => {
        celebrationRef.current = isCelebration;
    }, [isCelebration]);

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        let w = canvas.width = window.innerWidth;
        let h = canvas.height = window.innerHeight;

        const droneCount = 200;
        const drones = [];

        const shapes = {
            random: () => ({ x: 0.1 + Math.random() * 0.8, y: 0.05 + Math.random() * 0.3 }),
            tree: (i, total) => {
                const side = 0.85;
                const height = 0.25, width = 0.18, yBase = 0.38;
                const row = Math.floor(Math.sqrt(i)), col = i - row * row;
                const totalRows = Math.floor(Math.sqrt(total));
                return { x: side + (col / (row || 1) - 0.5) * ((row / totalRows) * width), y: yBase - (row / totalRows) * height, hue: 142 };
            },
            heart: (i, total) => {
                const side = 0.15;
                // Concentric Hearts Logic for density
                const layer = Math.floor(i / (total / 4)); // 4 layers
                const progress = (i % (total / 4)) / (total / 4);
                const t = progress * Math.PI * 2;
                const scale = 0.03 + layer * 0.025; // Growing scale

                const lx = scale * Math.pow(Math.sin(t), 3);
                const ly = -scale * (13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t)) / 16;
                return { x: side + lx, y: 0.25 + ly, hue: 350 };
            },
            bigstar: (i, total) => {
                const side = 0.85;
                const angle = (i / total) * Math.PI * 2;
                const r = i % 2 === 0 ? 0.1 : 0.04;
                return { x: side + Math.cos(angle) * r, y: 0.25 + Math.sin(angle) * r, hue: 50 };
            },
            diamond: (i, total) => {
                const side = 0.85;
                const t = (i / total) * 1.0;
                const p = (t * 4) % 1;
                const points = [{ x: 0, y: -0.08 }, { x: 0.06, y: 0 }, { x: 0, y: 0.08 }, { x: -0.06, y: 0 }];
                const p1 = points[Math.floor(t * 4) % 4], p2 = points[(Math.floor(t * 4) + 1) % 4];
                return { x: side + p1.x + (p2.x - p1.x) * p, y: 0.25 + p1.y + (p2.y - p1.y) * p, hue: 190 };
            },
            toast: (i, total) => {
                const isLeft = i < total / 2;
                const side = isLeft ? 0.12 : 0.88;
                const p = (i % (total / 2)) / (total / 2);

                // Optimized: Simple pulse
                const pulse = 1 + Math.sin(Date.now() * 0.003) * 0.08;
                const h = (48 + Math.sin(Date.now() * 0.002) * 50 + 360) % 360;

                if (isLeft) { // --- OPTIMIZED STAR ---
                    const points = 5;
                    const step = p * points * 2;
                    const segment = Math.floor(step);
                    const localP = step % 1;

                    const outerR = 0.1 * pulse;
                    const innerR = 0.04 * pulse;

                    // Simple edges
                    const a1 = (segment * Math.PI) / points - Math.PI / 2;
                    const a2 = ((segment + 1) * Math.PI) / points - Math.PI / 2;
                    const r1 = segment % 2 === 0 ? outerR : innerR;
                    const r2 = (segment + 1) % 2 === 0 ? outerR : innerR;

                    const x = side + (Math.cos(a1) * r1 * (1 - localP) + Math.cos(a2) * r2 * localP);
                    const y = 0.32 + (Math.sin(a1) * r1 * (1 - localP) + Math.sin(a2) * r2 * localP);
                    return { x: x, y: y, hue: h };
                } else { // --- OPTIMIZED FLUTE ---
                    const s = pulse * 0.9;
                    // Pseudo-random angle for cylindrical scatter using index
                    // Avoid Math.random() inside loop for stability, use index math
                    const angle = i * 2.39996; // Golden angle approx in radians
                    const cosA = Math.cos(angle);

                    if (p < 0.70) { // Bowl
                        const t = p / 0.70;
                        const w = (0.045 - t * 0.015) * s;
                        const x = side + cosA * w;
                        const y = 0.10 + t * 0.30 * s;
                        return { x, y, hue: t > 0.25 ? 48 : 60 };
                    } else if (p < 0.90) { // Stem
                        const t = (p - 0.70) / 0.2;
                        const w = 0.005 * s;
                        const x = side + cosA * w;
                        return { x, y: 0.10 + 0.30 * s + t * 0.12, hue: 60 };
                    } else { // Base
                        const ang = i * 0.5; // Simple ring
                        const w = 0.045 * s;
                        const x = side + Math.cos(ang) * w;
                        return { x, y: 0.52 + Math.sin(ang) * 0.01 * s, hue: 60 };
                    }
                }
            },
            stars: () => ({ x: 0.05 + Math.random() * 0.9, y: 0.05 + Math.random() * 0.35, hue: 210 })
        };

        const shapeConfigs = {
            random: { hue: 200, sat: 50, lum: 50 },
            tree: { hue: 142, sat: 80, lum: 45 },
            heart: { hue: 350, sat: 90, lum: 55 },
            newyear: { hue: 48, sat: 100, lum: 55 },
            bigstar: { hue: 50, sat: 100, lum: 60 },
            // smile removed
            diamond: { hue: 190, sat: 70, lum: 60 },
            stars: { hue: 210, sat: 20, lum: 90 },
            toast: { hue: null, sat: 100, lum: 60 }
        };

        let currentShape = 'random';
        const interval = setInterval(() => {
            if (celebrationRef.current) {
                currentShape = 'toast';
            } else {
                const exclude = ['toast', 'stars', 'tree'];
                const availableKeys = Object.keys(shapes).filter(k => !exclude.includes(k));
                currentShape = availableKeys[Math.floor(Math.random() * availableKeys.length)];
            }
        }, 6000);

        for (let i = 0; i < droneCount; i++) {
            drones.push({ x: Math.random() * w, y: Math.random() * h, targetX: 0, targetY: 0, hue: Math.random() * 360, sat: 100, lum: 70, vx: 0, vy: 0, noise: Math.random() * 100 });
        }

        const animate = () => {
            if (celebrationRef.current) currentShape = 'toast';
            ctx.clearRect(0, 0, w, h);
            const time = Date.now() * 0.001;
            const config = shapeConfigs[currentShape] || shapeConfigs.random;

            drones.forEach((d, i) => {
                const target = shapes[currentShape](i, droneCount);
                d.targetX = target.x * w; d.targetY = target.y * h;

                // Calculate distance to target for stability and lighting logic
                const dx = d.targetX - d.x;
                const dy = d.targetY - d.y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                // Lighting Logic: Unlit (dim) when moving, lit when close
                const targetBrightness = dist < 40 ? (config.lum || 70) : 5; // Low luminosity when far
                d.lum += (targetBrightness - d.lum) * 0.05;

                const targetHue = target.hue ?? config.hue ?? 200;
                let diff = targetHue - d.hue;
                while (diff > 180) diff -= 360;
                while (diff < -180) diff += 360;
                d.hue += diff * 0.03;
                d.sat += (config.sat - d.sat) * 0.03;

                // Movement Logic: Smooth damping as they arrive
                if (dist > 1) {
                    d.vx = dx * 0.03;
                    d.vy = dy * 0.03;
                    d.x += d.vx;
                    d.y += d.vy;
                } else {
                    // Lock to position when very close for perfect stability
                    d.x = d.targetX;
                    d.y = d.targetY;
                    d.vx = 0;
                    d.vy = 0;
                }

                // Add subtle "flight" noise ONLY when far, stable when close
                const jiggleScale = Math.min(dist / 50, 1.0);
                d.x += Math.sin(time + d.noise) * 0.2 * jiggleScale;
                d.y += Math.cos(time + d.noise) * 0.2 * jiggleScale;

                const color = `hsl(${d.hue}, ${d.sat}%, ${d.lum}%)`;

                // Restore blur (safe now that leak is fixed)
                ctx.shadowBlur = 10;
                ctx.shadowColor = color;
                ctx.fillStyle = color;

                ctx.beginPath();
                ctx.arc(d.x, d.y, 2, 0, Math.PI * 2);
                ctx.fill();
            });
            animId = requestAnimationFrame(animate);
        };

        let animId = requestAnimationFrame(animate);

        const handleResize = () => { w = canvas.width = window.innerWidth; h = canvas.height = window.innerHeight; };
        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
            clearInterval(interval);
            cancelAnimationFrame(animId); // Fix accumulation leak
        };
    }, []);

    return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-10" />;
};

const Fireworks = ({ isCelebration }) => {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        let w = canvas.width = window.innerWidth;
        let h = canvas.height = window.innerHeight;

        let fireworks = [];
        let particles = [];

        class Firework {
            constructor(forceCelebration = false) {
                this.x = Math.random() * w;
                this.y = h;
                this.targetY = Math.random() * (h * 0.4) + (h * 0.1);
                this.isCelebration = forceCelebration;
                this.velocity = this.isCelebration ? (Math.random() * 4 + 6) : (Math.random() * 3 + 3);
                this.hue = Math.random() * 360;
                this.dead = false;
            }
            update() {
                this.y -= this.velocity;
                if (this.y <= this.targetY) {
                    this.explode();
                    this.dead = true;
                }
            }
            explode() {
                const count = this.isCelebration ? (80 + Math.random() * 50) : (30 + Math.random() * 20);
                const speedMult = this.isCelebration ? 8 : 4;
                for (let i = 0; i < count; i++) {
                    const angle = Math.random() * Math.PI * 2;
                    const speed = Math.random() * speedMult + 1;
                    particles.push({
                        x: this.x,
                        y: this.y,
                        vx: Math.cos(angle) * speed,
                        vy: Math.sin(angle) * speed,
                        opacity: 1,
                        hue: this.hue + (Math.random() - 0.5) * 40,
                        size: this.isCelebration ? (Math.random() * 2 + 1) : 1.5,
                        friction: this.isCelebration ? 0.96 : 0.98,
                        gravity: 0.1
                    });
                }
            }
            draw() {
                ctx.fillStyle = `hsl(${this.hue}, 100%, 70%)`;
                ctx.beginPath(); ctx.arc(this.x, this.y, 2, 0, Math.PI * 2); ctx.fill();
            }
        }

        let lastSpawn = 0;
        const animate = () => {
            ctx.clearRect(0, 0, w, h);

            const now = Date.now();
            const spawnRate = isCelebration ? 400 : 4000; // Fever fireworks normally
            if (now - lastSpawn > spawnRate) {
                fireworks.push(new Firework(isCelebration));
                lastSpawn = now;
            }

            for (let i = fireworks.length - 1; i >= 0; i--) {
                fireworks[i].update();
                if (fireworks[i].dead) fireworks.splice(i, 1);
                else fireworks[i].draw();
            }

            for (let i = particles.length - 1; i >= 0; i--) {
                const p = particles[i];
                p.vx *= p.friction;
                p.vy *= p.friction;
                p.vy += p.gravity;
                p.x += p.vx;
                p.y += p.vy;
                p.opacity -= isCelebration ? 0.02 : 0.03; // Faster fadeout

                if (p.opacity <= 0) {
                    particles.splice(i, 1);
                } else {
                    ctx.globalCompositeOperation = 'lighter'; // Cheap glow effect
                    ctx.fillStyle = `hsla(${p.hue}, 100%, ${isCelebration ? 80 : 70}%, ${p.opacity})`;
                    ctx.beginPath();
                    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                    ctx.fill();
                }
            }
            ctx.globalCompositeOperation = 'source-over';

            requestAnimationFrame(animate);
        };

        const animId = requestAnimationFrame(animate);
        const handleResize = () => { w = canvas.width = window.innerWidth; h = canvas.height = window.innerHeight; };
        window.addEventListener('resize', handleResize);
        return () => {
            cancelAnimationFrame(animId);
            window.removeEventListener('resize', handleResize);
        };
    }, [isCelebration]);

    return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-15" />;
};

const FallingGifts = () => {
    const [gifts, setGifts] = useState([]);

    useEffect(() => {
        const spawnGift = () => {
            const id = Date.now();
            // Start roughly within the middle third of the screen 
            const startX = Math.random() * 30 + 35; // 35-65% screen width

            setGifts(prev => [...prev, { id, left: startX }]);

            // Clean up after 15 seconds
            setTimeout(() => {
                setGifts(prev => prev.filter(g => g.id !== id));
            }, 15000);
        };

        const interval = setInterval(spawnGift, 5000); // New gift every 5s
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="fixed inset-0 pointer-events-none z-20 overflow-hidden">
            {gifts.map(gift => (
                <motion.div
                    key={gift.id}
                    initial={{ y: -50, opacity: 1, rotate: 0 }}
                    animate={{ y: window.innerHeight + 100, rotate: 360 }}
                    transition={{ duration: 10, ease: "linear" }}
                    className="absolute text-2xl"
                    style={{ left: `${gift.left}%` }}
                >
                    🎁
                </motion.div>
            ))}
        </div>
    );
};

const SantaFlightBar = () => {
    const [location, setLocation] = useState("Lapponia");
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        const updateState = () => {
            const now = new Date();
            const hour = now.getHours();
            const minutes = now.getMinutes();

            // Location Text Logic
            if (hour >= 20 && hour < 21) setLocation("Emirati Arabi & Oman");
            else if (hour >= 21 && hour < 22) setLocation("Mosca & San Pietroburgo");
            else if (hour >= 22 && hour < 23) setLocation("Helsinki & Atene");
            else if (hour >= 23) setLocation("In volo verso l'Italia...");
            else if (hour >= 0 && hour < 1) setLocation("CARASSAI");
            else setLocation("Polo Nord");

            // Progress Logic (Starts at 20:00, Ends at 00:00)
            // Total minutes = 4 hours * 60 = 240 minutes
            const startHour = 20;
            const totalMinutes = 4 * 60;

            let currentMinutesPastStart = 0;

            if (hour >= startHour) {
                currentMinutesPastStart = ((hour - startHour) * 60) + minutes;
            } else if (hour < 5) { // Handle post-midnight (00:00 - 05:00)
                currentMinutesPastStart = totalMinutes; // Arrived
            } else {
                currentMinutesPastStart = 0; // Not started
            }

            const rawPercent = (currentMinutesPastStart / totalMinutes) * 100;
            setProgress(Math.min(Math.max(rawPercent, 0), 100)); // Clamp 0-100
        };

        updateState();
        const timer = setInterval(updateState, 1000); // 1s update for smooth movement if needed
        return () => clearInterval(timer);
    }, []);

    return (
        <div className="absolute top-0 left-0 w-full p-4 md:p-8 flex items-center justify-between z-30 pointer-events-none">
            {/* Left: Current Location */}
            <div className="pointer-events-auto flex items-center gap-3 md:gap-4 animate-fade-in bg-black/40 backdrop-blur-xl px-4 py-2 md:px-8 md:py-4 rounded-full border border-white/10 shadow-2xl max-w-[45%]">
                <div className="relative shrink-0">
                    <span className="absolute inset-0 w-full h-full bg-red-500 rounded-full animate-ping opacity-50"></span>
                    <div className="relative bg-red-600/80 rounded-full p-2 md:p-3 shadow-lg shadow-red-500/50">
                        <MapPin className="w-4 h-4 md:w-6 md:h-6 text-white" />
                    </div>
                </div>
                <div className="text-left overflow-hidden">
                    <p className="text-[10px] md:text-xs text-gold uppercase tracking-[0.2em] font-bold mb-0.5 md:mb-1 truncate">Babbo Natale è a</p>
                    <p className="text-sm md:text-xl text-white font-heading leading-tight drop-shadow-lg truncate">{location}</p>
                </div>
            </div>

            {/* Middle: Sleigh Path (Visible on desktop +) */}
            <div className="hidden md:flex flex-1 mx-4 md:mx-12 items-center relative">
                <div className="w-full border-t-4 border-dotted border-white/30"></div>

                {/* Santa Face - Dynamic Position */}
                <motion.div
                    animate={{
                        left: `${progress}%`,
                        x: "-50%" // Center on the percentage point
                    }}
                    transition={{ duration: 1, ease: "linear" }} // Smooth transition between updates
                    className="absolute -top-8 text-6xl filter drop-shadow-[0_0_15px_rgba(255,255,255,0.6)]"
                >
                    <motion.div
                        animate={{ y: [0, -5, 0] }} // Adding bobbing effect separately
                        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    >
                        🎅
                    </motion.div>
                </motion.div>
            </div>

            {/* Right: Destination */}
            <div className="pointer-events-auto flex items-center gap-3 md:gap-4 animate-fade-in bg-black/40 backdrop-blur-xl px-4 py-2 md:px-8 md:py-4 rounded-full border border-gold/20 shadow-2xl max-w-[45%]">
                <div className="text-right overflow-hidden">
                    <p className="text-[10px] md:text-xs text-gold uppercase tracking-[0.2em] font-bold mb-0.5 md:mb-1 truncate">Destinazione</p>
                    <p className="text-sm md:text-xl text-white font-heading leading-tight drop-shadow-lg truncate">Carassai</p>
                </div>
                <div className="relative shrink-0 bg-gold/20 rounded-full p-2 md:p-3 border border-gold/50 shadow-[0_0_15px_rgba(207,181,59,0.3)]">
                    <MapPin className="w-4 h-4 md:w-6 md:h-6 text-gold" />
                </div>
            </div>
        </div>
    )
}

const SparkleBurst = () => {
    const burstCount = 15;
    const sparkles = React.useMemo(() => {
        return Array.from({ length: burstCount }).map(() => ({
            scale: Math.random() * 1.5 + 0.5,
            x: (Math.random() - 0.5) * 300,
            y: (Math.random() - 0.5) * 300,
            delay: Math.random() * 2
        }));
    }, []);

    return (
        <div className="absolute inset-0 z-0 flex items-center justify-center pointer-events-none">
            {sparkles.map((s, i) => (
                <motion.div
                    key={i}
                    initial={{ opacity: 0, scale: 0, x: 0, y: 0 }}
                    animate={{
                        opacity: [0, 1, 0],
                        scale: [0, s.scale, 0],
                        x: s.x,
                        y: s.y,
                    }}
                    transition={{
                        duration: 1.5,
                        repeat: Infinity,
                        delay: s.delay,
                        ease: "easeOut"
                    }}
                    className="absolute w-2 h-2 rounded-full bg-gold shadow-[0_0_15px_#cfb53b]"
                />
            ))}
        </div>
    );
};


function App() {
    // Auto-detect mode based on date: After Dec 25, default to New Year
    const getInitialMode = () => {
        const now = new Date();
        const month = now.getMonth();
        const day = now.getDate();
        if ((month === 11 && day > 25) || month === 0) return 'new-year';
        return 'christmas';
    };

    const [mode, setMode] = useState(getInitialMode());
    const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
    const [isTargetReached, setIsTargetReached] = useState(false);

    useEffect(() => {
        // Reset state when mode changes
        setIsTargetReached(false);

        const calculateTarget = () => {
            const target = new Date();
            if (mode === 'christmas') {
                target.setFullYear(2025, 11, 25);
            } else {
                target.setFullYear(2026, 0, 1);
            }
            target.setHours(0, 0, 0, 0);
            return target;
        };

        const target = calculateTarget();

        const interval = setInterval(() => {
            const now = new Date();
            const diff = target - now;

            if (diff <= 0) {
                clearInterval(interval);
                setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
                setIsTargetReached(true);
            } else {
                const days = Math.floor(diff / (1000 * 60 * 60 * 24));
                const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
                const minutes = Math.floor((diff / 1000 / 60) % 60);
                const seconds = Math.floor((diff / 1000) % 60);
                setTimeLeft({ days, hours, minutes, seconds });
            }
        }, 1000);

        return () => clearInterval(interval);
    }, [mode]);

    const toggleMode = () => {
        setMode(prev => prev === 'christmas' ? 'new-year' : 'christmas');
        setIsTargetReached(false);
    }

    return (
        <div className="relative h-screen w-screen overflow-hidden flex flex-col items-center justify-center bg-black">
            {/* Visual Background - Only for Christmas */}
            {mode === 'christmas' && (
                <div
                    className="absolute inset-0 z-0 scale-105"
                    style={{
                        backgroundImage: 'url(/bg.png?v=2)',
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        filter: 'brightness(0.5) contrast(1.2)'
                    }}
                />
            )}

            <div className="absolute inset-0 z-0 bg-gradient-to-t from-black via-transparent to-black/40"></div>

            <Snow />
            {mode === 'christmas' ? (
                <>
                    <FallingGifts />
                    <SantaFlightBar />
                </>
            ) : (
                <>
                    <div className="fixed inset-0 z-[1]">
                        <BorgoPanorama />
                    </div>
                    <DroneShow isCelebration={isTargetReached} />
                    <div className="fixed inset-0 z-40 pointer-events-none">
                        <Fireworks isCelebration={isTargetReached} />
                    </div>
                </>
            )}

            <main className="relative z-20 flex flex-col items-center justify-center w-full h-full text-center px-4">


                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                    className="flex flex-col items-center mb-8 md:mb-12"
                >
                    <h2 className="text-xl md:text-2xl text-gold-glow mb-2 font-subheading italic tracking-[0.2em] font-light drop-shadow-custom opacity-80">
                        {isTargetReached
                            ? (mode === 'christmas' ? "È Arrivato il Natale a" : "È Arrivato il 2026 a")
                            : (mode === 'christmas' ? "Il Natale a" : "Il Capodanno a")
                        }
                    </h2>
                    <h1 className="text-5xl md:text-7xl text-white font-heading font-bold uppercase tracking-widest drop-shadow-[0_2px_15px_rgba(255,255,255,0.2)]">
                        Carassai
                    </h1>
                </motion.div>

                <AnimatePresence mode='wait'>
                    {isTargetReached ? (
                        <motion.div
                            key="target-reached"
                            initial={{ opacity: 0, scale: 0.5 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 1, type: "spring" }}
                            className="flex flex-col items-center"
                        >
                            <h1 className="text-6xl md:text-[8rem] lg:text-[10rem] font-heading font-bold text-gradient-gold text-center leading-none drop-shadow-[0_0_50px_rgba(207,181,59,0.8)] animate-pulse-slow">
                                {mode === 'christmas' ? "BUON\nNATALE!" : "BUON\n2026!"}
                            </h1>
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 1 }}
                                className="mt-8 text-2xl text-white font-subheading italic tracking-widest"
                            >
                                {mode === 'christmas' ? "Auguri a tutti!" : "Felice Anno Nuovo!"}
                            </motion.div>
                        </motion.div>
                    ) : (
                        /* Huge Countdown - Primary Focus */
                        <motion.div
                            key="countdown"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 1.5 }}
                            transition={{ delay: 0.3, duration: 0.8 }}
                            className="relative flex items-start justify-center gap-4 md:gap-12 w-full max-w-full mx-auto"
                        >
                            {/* Continuous Subtle Pulse */}
                            <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                                <SparkleBurst />
                            </div>

                            {[
                                { val: timeLeft.days, label: "Giorni", show: timeLeft.days > 0 },
                                { val: timeLeft.hours, label: "Ore", show: true },
                                { val: timeLeft.minutes, label: "Minuti", show: true },
                                { val: timeLeft.seconds, label: "Secondi", show: true, isSeconds: true }
                            ].filter(u => u.show).map((unit, idx, arr) => (
                                <React.Fragment key={unit.label}>
                                    <div className="flex flex-col items-center shrink-0">
                                        <div className="relative flex items-center justify-center overflow-visible">
                                            {/* Ghost anchor to keep width stable */}
                                            <span className="text-7xl md:text-[min(18rem,20vw)] leading-none font-heading font-black invisible select-none tabular-nums">
                                                88
                                            </span>
                                            {/* Actual numbers */}
                                            <span className={`absolute flex items-center justify-center text-7xl md:text-[min(18rem,20vw)] leading-none font-heading font-black tabular-nums transition-all ${unit.isSeconds ? 'text-gradient-gold drop-shadow-[0_0_50px_rgba(207,181,59,0.6)]' : 'text-white drop-shadow-[0_0_30px_rgba(207,181,59,0.4)]'}`}>
                                                {String(unit.val).padStart(2, '0')}
                                            </span>
                                        </div>
                                        <span className="text-gold/90 text-sm md:text-2xl font-body uppercase tracking-[0.4em] mt-2 md:mt-4">{unit.label}</span>
                                    </div>
                                    {idx < arr.length - 1 && (
                                        <span className="text-5xl md:text-[10rem] text-gold/40 font-heading animate-pulse mt-4 md:mt-8 shrink-0">:</span>
                                    )}
                                </React.Fragment>
                            ))}
                        </motion.div>
                    )}
                </AnimatePresence>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.2, duration: 1 }}
                    className="absolute bottom-24 md:bottom-28 flex items-center gap-4 text-white/50 font-body text-xs md:text-sm tracking-[0.3em] uppercase"
                >
                    <Sparkles className="w-4 h-4 text-gold" />
                    <span>
                        {isTargetReached
                            ? (mode === 'christmas' ? "Babbo Natale è Arrivato" : "Il 2026 è Qui")
                            : (mode === 'christmas' ? "La slitta è in arrivo" : "Il brindisi si avvicina")
                        }
                    </span>
                    <Sparkles className="w-4 h-4 text-gold" />
                </motion.div>

                {/* Mode Switcher UI */}
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-black/40 backdrop-blur-xl px-4 py-2 rounded-full border border-white/10 shadow-2xl z-50">
                    <button
                        onClick={() => setMode('christmas')}
                        className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-300 ${mode === 'christmas' ? 'bg-red-600 text-white shadow-lg' : 'text-white/40 hover:text-white/70'}`}
                    >
                        <Gift className="w-4 h-4" />
                        <span className="text-xs font-bold uppercase tracking-wider">Natale</span>
                    </button>
                    <button
                        onClick={() => setMode('new-year')}
                        className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-300 ${mode === 'new-year' ? 'bg-gold text-black shadow-lg' : 'text-white/40 hover:text-white/70'}`}
                    >
                        <PartyPopper className="w-4 h-4" />
                        <span className="text-xs font-bold uppercase tracking-wider">Capodanno</span>
                    </button>
                </div>

                {/* Debug/Manual Trigger Button for Testing Animation */}
                <div className="absolute bottom-6 right-6 z-50">
                    <button
                        onClick={() => setIsTargetReached(!isTargetReached)}
                        className="p-3 bg-white/5 hover:bg-white/10 text-white/20 hover:text-white/60 rounded-full transition-all duration-300 backdrop-blur-sm border border-white/5"
                        title="Test Animation"
                    >
                        <Play className="w-4 h-4" />
                    </button>
                </div>

            </main>
        </div >
    )
}

export default App
