'use client';

import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

interface HeroProps {
    data?: {
        headline?: string;
        subheadline?: string;
        ctaText?: string;
    };
    bg?: {
        imageUrl?: string | null;
        imagePosition?: string;
        overlayOpacity?: number;
    };
}

// Framer Motion variants for staggered entrance
const containerVariants = {
    hidden: {},
    visible: {
        transition: { staggerChildren: 0.18, delayChildren: 0.6 },
    },
};

const lineVariants = {
    hidden: { y: '110%', opacity: 0, skewY: 3 },
    visible: {
        y: '0%',
        opacity: 1,
        skewY: 0,
        transition: { duration: 1.1, ease: [0.16, 1, 0.3, 1] },
    },
};

const eyebrowVariants = {
    hidden: { opacity: 0, letterSpacing: '1em' },
    visible: {
        opacity: 0.7,
        letterSpacing: '0.55em',
        transition: { duration: 1.4, ease: 'easeOut' },
    },
};

const scrollVariants = {
    hidden: { opacity: 0, y: 12 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 1, delay: 1.6, ease: 'easeOut' },
    },
};

const bgVariants = {
    hidden: { opacity: 0, scale: 1.08 },
    visible: {
        opacity: 0.45,
        scale: 1,
        transition: { duration: 2, ease: 'easeOut' },
    },
};

export default function Hero({ data, bg }: HeroProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const textRef = useRef<HTMLDivElement>(null);
    const bgImageRef = useRef<HTMLDivElement>(null);
    const line1Ref = useRef<HTMLDivElement>(null);
    const line2Ref = useRef<HTMLDivElement>(null);

    // GSAP — scroll-driven parallax only (no entrance)
    useEffect(() => {
        gsap.registerPlugin(ScrollTrigger);
        const ctx = gsap.context(() => {
            if (!containerRef.current || !textRef.current || !bgImageRef.current) return;

            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: containerRef.current,
                    start: 'top top',
                    end: 'bottom top',
                    scrub: 1.2,
                },
            });
            // Background slow zoom + drift
            tl.to(bgImageRef.current, { y: '18%', scale: 1.12, ease: 'none' }, 0);
            // Text drifts up and dissolves
            tl.to(textRef.current, { opacity: 0, y: -140, filter: 'blur(20px)', ease: 'none' }, 0);
            // Lines split apart horizontally
            if (line1Ref.current && line2Ref.current) {
                tl.to(line1Ref.current, { x: '-8vw', skewX: -3, ease: 'none' }, 0);
                tl.to(line2Ref.current, { x: '8vw', skewX: 3, ease: 'none' }, 0);
            }
        });
        return () => ctx.revert();
    }, []);

    return (
        <section
            ref={containerRef}
            style={{
                height: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
                background: 'var(--deep-black)',
                overflow: 'hidden',
            }}
        >
            {/* Background — fades + scales in */}
            <motion.div
                ref={bgImageRef as any}
                variants={bgVariants}
                initial="hidden"
                animate="visible"
                style={{
                    position: 'absolute',
                    top: '-10%',
                    left: 0,
                    width: '100%',
                    height: '120%',
                    backgroundImage: `url("${bg?.imageUrl || "/hero%202.png"}")`,
                    backgroundSize: 'cover',
                    backgroundPosition: bg?.imagePosition || 'center',
                    zIndex: 0,
                }}
            />

            {/* Dark gradient overlay */}
            <div style={{
                position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
                background: `linear-gradient(to bottom, rgba(0,0,0,${Math.min(0.95, (bg?.overlayOpacity || 0.7) + 0.15)}) 0%, rgba(0,0,0,${bg?.overlayOpacity || 0.2}) 40%, rgba(0,0,0,${bg?.overlayOpacity || 0.2}) 60%, rgba(0,0,0,${Math.min(1, (bg?.overlayOpacity || 0.8) + 0.2)}) 100%)`,
                zIndex: 1,
            }} />

            {/* Center vignette glow */}
            <div style={{
                position: 'absolute', top: '50%', left: '50%',
                width: '70vw', height: '70vw',
                background: 'radial-gradient(circle, rgba(255,255,255,0.04) 0%, transparent 65%)',
                transform: 'translate(-50%, -50%)',
                pointerEvents: 'none', zIndex: 2,
            }} />

            {/* Text block */}
            <div ref={textRef} style={{ textAlign: 'center', zIndex: 10, width: '100%', padding: '0 var(--gutter)' }}>
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0 }}
                >
                    {/* Eyebrow — expands letter-spacing in */}
                    <motion.span
                        variants={eyebrowVariants}
                        style={{
                            color: 'var(--highlight)',
                            fontSize: 'clamp(0.55rem, 0.9vw, 0.75rem)',
                            textTransform: 'uppercase',
                            display: 'block',
                            marginBottom: 'clamp(1.5rem, 3vw, 2.5rem)',
                            fontWeight: 400,
                        }}
                    >
                        {data?.headline
                            ? data.headline.split('\n')[0] || 'Graphic Designer / Creative Developer'
                            : 'Graphic Designer / Creative Developer'}
                    </motion.span>

                    {/* Headline: each line masked from below */}
                    <h1 style={{
                        fontSize: 'clamp(2.2rem, 7.5vw, 7rem)',
                        fontWeight: 900,
                        lineHeight: 0.92,
                        margin: '0 auto',
                        letterSpacing: '-0.04em',
                        textTransform: 'uppercase',
                        maxWidth: '1100px',
                    }}>
                        {/* Clip mask wrapper — hides overflowing text during slide-up */}
                        <div style={{ overflow: 'hidden', display: 'block', paddingBottom: '0.06em' }}>
                            <motion.div ref={line1Ref as any} variants={lineVariants} style={{ display: 'block', fontWeight: 900, color: 'var(--accent-white)' }}>
                                {data?.headline || 'Designing Visual Stories.'}
                            </motion.div>
                        </div>

                        <div style={{ overflow: 'hidden', display: 'block', paddingBottom: '0.06em' }}>
                            <motion.div ref={line2Ref as any} variants={lineVariants} style={{
                                display: 'block', fontWeight: 200,
                                opacity: 0.45, fontSize: '0.9em', letterSpacing: '-0.02em',
                            }}>
                                {data?.subheadline || 'Developing Digital Experiences.'}
                            </motion.div>
                        </div>
                    </h1>
                </motion.div>
            </div>

            {/* ── Scroll indicator ── */}
            <motion.div
                variants={scrollVariants}
                initial="hidden"
                animate="visible"
                style={{
                    position: 'absolute',
                    bottom: 'clamp(1.5rem, 4vh, 3rem)',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    zIndex: 10,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '0.5rem',
                    textAlign: 'center',
                }}
            >
                {/* Bouncing pill */}
                <motion.div
                    animate={{ y: [0, 10, 0] }}
                    transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '0.5rem',
                    }}
                >
                    {/* Scroll track */}
                    <div style={{
                        width: 24, height: 40,
                        border: '1.5px solid rgba(255,255,255,0.2)',
                        borderRadius: '20px',
                        display: 'flex',
                        alignItems: 'flex-start',
                        justifyContent: 'center',
                        padding: '5px',
                        boxSizing: 'border-box',
                    }}>
                        {/* Scrolling dot */}
                        <motion.div
                            animate={{ y: [0, 14, 0], opacity: [1, 0.2, 1] }}
                            transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
                            style={{
                                width: 5, height: 5,
                                borderRadius: '50%',
                                background: 'rgba(255,255,255,0.55)',
                            }}
                        />
                    </div>

                    {/* Label */}
                    <span style={{
                        color: 'rgba(255,255,255,0.3)',
                        fontSize: '0.5rem',
                        letterSpacing: '0.45em',
                        textTransform: 'uppercase',
                        textAlign: 'center',
                        display: 'block',
                    }}>
                        Scroll
                    </span>
                </motion.div>
            </motion.div>
        </section>
    );
}
