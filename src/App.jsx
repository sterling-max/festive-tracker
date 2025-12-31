import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Sparkles, Gift, PartyPopper } from 'lucide-react';

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
    const burstCount = 12;
    return (
        <div className="absolute inset-0 z-0 flex items-center justify-center pointer-events-none">
            {Array.from({ length: burstCount }).map((_, i) => (
                <motion.div
                    key={i}
                    initial={{ opacity: 1, scale: 0, x: 0, y: 0 }}
                    animate={{
                        opacity: 0,
                        scale: Math.random() * 1.5 + 0.5,
                        x: (Math.random() - 0.5) * 200,
                        y: (Math.random() - 0.5) * 200,
                    }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="absolute w-2 h-2 rounded-full bg-gold shadow-[0_0_10px_#cfb53b]"
                />
            ))}
        </div>
    );
};

function App() {
    const [mode, setMode] = useState('christmas'); // 'christmas' or 'new-year'
    const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
    const [isTargetReached, setIsTargetReached] = useState(false);

    useEffect(() => {
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
            {/* Visual Background */}
            <div
                className="absolute inset-0 z-0 scale-105"
                style={{
                    backgroundImage: 'url(/bg.png?v=2)',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    filter: 'brightness(0.5) contrast(1.2)'
                }}
            />

            <div className="absolute inset-0 z-0 bg-gradient-to-t from-black via-transparent to-black/40"></div>

            <Snow />
            {mode === 'christmas' ? <FallingGifts /> : (
                <div className="fixed inset-0 pointer-events-none z-20 overflow-hidden">
                    {/* Placeholder for Fireworks - using a simple burst effect for now */}
                    <AnimatePresence>
                        {Array.from({ length: 5 }).map((_, i) => (
                            <motion.div
                                key={`firework-${i}`}
                                initial={{ opacity: 0, scale: 0 }}
                                animate={{ opacity: [0, 1, 0], scale: [0, 1.5, 2], x: [0, (i - 2) * 100], y: [0, -200] }}
                                transition={{ duration: 2, repeat: Infinity, delay: i * 0.4 }}
                                className="absolute left-1/2 bottom-0 text-4xl"
                            >
                                ✨
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            )}
            {mode === 'christmas' && <SantaFlightBar />}

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
                            initial={{ opacity: 0, scale: 0.5, filter: "blur(10px)" }}
                            animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
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
                            exit={{ opacity: 0, scale: 1.5, filter: "blur(20px)" }}
                            transition={{ delay: 0.3, duration: 0.8 }}
                            className="relative flex items-start justify-center gap-2 md:gap-8 w-full transform scale-110 md:scale-125"
                        >
                            {/* Pulse & Sparkle Wrapper */}
                            <motion.div
                                key={timeLeft.seconds}
                                animate={{ scale: [1, 1.02, 1] }}
                                transition={{ duration: 0.4, ease: "easeOut" }}
                                className="absolute inset-0 pointer-events-none flex items-center justify-center"
                            >
                                <SparkleBurst />
                            </motion.div>

                            {timeLeft.days > 0 && (
                                <div className="flex flex-col items-center z-10">
                                    <span className="text-7xl md:text-[10rem] leading-none font-mono text-white drop-shadow-[0_0_30px_rgba(207,181,59,0.4)] font-bold">
                                        {timeLeft.days}
                                    </span>
                                    <span className="text-gold/90 text-sm md:text-lg font-body uppercase tracking-[0.4em] mt-2 md:mt-4">Giorni</span>
                                </div>
                            )}

                            {/* Colon Separator */}
                            {timeLeft.days > 0 && <span className="text-6xl md:text-[8rem] text-gold/40 font-mono animate-pulse -mt-2 md:-mt-4 z-10">:</span>}

                            <div className="flex flex-col items-center z-10">
                                <span className="text-7xl md:text-[10rem] leading-none font-mono text-white drop-shadow-[0_0_30px_rgba(207,181,59,0.4)] font-bold tabular-nums">
                                    {String(timeLeft.hours).padStart(2, '0')}
                                </span>
                                <span className="text-gold/90 text-sm md:text-lg font-body uppercase tracking-[0.4em] mt-2 md:mt-4">Ore</span>
                            </div>

                            <span className="text-6xl md:text-[8rem] text-gold/40 font-mono animate-pulse -mt-2 md:-mt-4 z-10">:</span>

                            <div className="flex flex-col items-center z-10">
                                <span className="text-7xl md:text-[10rem] leading-none font-mono text-white drop-shadow-[0_0_30px_rgba(207,181,59,0.4)] font-bold tabular-nums">
                                    {String(timeLeft.minutes).padStart(2, '0')}
                                </span>
                                <span className="text-gold/90 text-sm md:text-lg font-body uppercase tracking-[0.4em] mt-2 md:mt-4">Minuti</span>
                            </div>

                            <span className="text-6xl md:text-[8rem] text-gold/40 font-mono animate-pulse -mt-2 md:-mt-4 z-10">:</span>

                            <div className="flex flex-col items-center relative z-10">
                                <span className="text-7xl md:text-[10rem] leading-none font-mono text-gradient-gold drop-shadow-[0_0_50px_rgba(207,181,59,0.6)] font-bold tabular-nums">
                                    {String(timeLeft.seconds).padStart(2, '0')}
                                </span>
                                <span className="text-gold/90 text-sm md:text-lg font-body uppercase tracking-[0.4em] mt-2 md:mt-4">Secondi</span>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.2, duration: 1 }}
                    className="absolute bottom-12 md:bottom-16 flex items-center gap-4 text-white/50 font-body text-xs md:text-sm tracking-[0.3em] uppercase"
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

                {/* Debug/Manual Toggle Button removed in favor of center switcher */}

            </main>
        </div >
    )
}

export default App
