'use client';

import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import gsap from 'gsap';

export default function LoadingScreen({ onComplete }: { onComplete: () => void }) {
    const containerRef = useRef<HTMLDivElement>(null);
    const logoRef = useRef<HTMLDivElement>(null);
    const helloRef = useRef<HTMLDivElement>(null);
    const nameRef = useRef<HTMLDivElement>(null);
    const welcomeRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            const tl = gsap.timeline({
                onComplete: () => {
                    onComplete();
                }
            });

            // 1. Initial Black Screen Delay
            tl.to({}, { duration: 0.5 });

            // 2. Logo Animation
            if (logoRef.current) {
                tl.fromTo(logoRef.current,
                    { scale: 2.5, opacity: 0, filter: 'blur(30px)' },
                    { scale: 1, opacity: 1, filter: 'blur(0px)', duration: 1.5, ease: "expo.out" }
                );
            }

            tl.to({}, { duration: 0.5 }); // Hold logo

            if (logoRef.current) {
                tl.to(logoRef.current, {
                    scale: 1.1, opacity: 0, filter: 'blur(15px)', duration: 0.8, ease: "power2.in"
                });
            }

            // 3. Welcome Sequence
            const welcomeTexts = [
                { ref: helloRef, hold: 0.8 },
                { ref: nameRef, hold: 1.0 },
                { ref: welcomeRef, hold: 1.5 }
            ];

            welcomeTexts.forEach((item) => {
                if (item.ref.current) {
                    tl.fromTo(item.ref.current,
                        { opacity: 0, y: 15, filter: 'blur(15px)' },
                        { opacity: 1, y: 0, filter: 'blur(0px)', duration: 1.2, ease: "power3.out" }
                    )
                        .to({}, { duration: item.hold })
                        .to(item.ref.current,
                            { opacity: 0, y: -15, filter: 'blur(15px)', duration: 1, ease: "power3.in" }
                        );
                }
            });
        });

        return () => ctx.revert();
    }, [onComplete]);

    const textStyle: React.CSSProperties = {
        position: 'absolute',
        fontSize: 'clamp(1.2rem, 3.5vw, 2rem)',
        fontWeight: 200,
        letterSpacing: '0.25em',
        textTransform: 'uppercase',
        textAlign: 'center',
        opacity: 0,
        width: '100%',
        padding: '0 20px',
        color: 'rgba(255, 255, 255, 0.8)'
    };

    return (
        <motion.div
            ref={containerRef}
            initial={{ opacity: 1 }}
            exit={{
                opacity: 0,
                transition: { duration: 1, ease: [0.76, 0, 0.24, 1] }
            }}
            style={{
                position: 'fixed',
                inset: 0,
                zIndex: 10005,
                background: 'var(--deep-black)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'hidden'
            }}
        >
            {/* Logo Mark */}
            <div
                ref={logoRef}
                style={{
                    width: 'clamp(60px, 10vw, 120px)',
                    height: 'auto',
                    opacity: 0,
                    zIndex: 2
                }}
            >
                <img src="/logo.png" alt="Logo" style={{ width: '100%', filter: 'brightness(1.1)' }} />
            </div>

            {/* Welcome Text Elements */}
            <div ref={helloRef} style={textStyle}>Hello</div>
            <div ref={nameRef} style={textStyle}>I'm Dhananjaya</div>
            <div ref={welcomeRef} style={textStyle}>
                WELCOME TO MY DIGITAL UNIVERSE
            </div>

            {/* Background Atmosphere */}
            <div style={{
                position: 'absolute',
                inset: 0,
                opacity: 0.05,
                backgroundImage: `radial-gradient(circle at center, rgba(255,255,255,0.05) 0%, transparent 70%)`,
                pointerEvents: 'none'
            }} />
        </motion.div>
    );
}
