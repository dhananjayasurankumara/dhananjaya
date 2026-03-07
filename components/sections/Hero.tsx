'use client';

import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import MagneticText from '@/components/MagneticText';

interface HeroProps {
    data?: {
        headline?: string;
        subheadline?: string;
        ctaText?: string;
    };
}

export default function Hero({ data }: HeroProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const textRef = useRef<HTMLDivElement>(null);

    const bgImageRef = useRef<HTMLDivElement>(null);

    const line1Ref = useRef<HTMLDivElement>(null);
    const line2Ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        gsap.registerPlugin(ScrollTrigger);

        if (containerRef.current && textRef.current && bgImageRef.current) {
            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: containerRef.current,
                    start: 'top top',
                    end: 'bottom top',
                    scrub: 1, // Smoother scrub
                    pin: true,
                },
            });

            // Parallax movement for background image
            tl.to(bgImageRef.current, {
                y: '15%',
                scale: 1.15,
                ease: 'none'
            }, 0);

            // Text Exit Animations
            tl.to(textRef.current, {
                opacity: 0,
                y: -200,
                scale: 0.85,
                filter: 'blur(30px)',
                duration: 1,
            }, 0);

            // Advanced Horizontal and Liquid Movement
            if (line1Ref.current && line2Ref.current) {
                // Moving in opposite directions with subtle skew
                tl.to(line1Ref.current, {
                    x: '-10vw',
                    skewX: -5,
                    opacity: 0.2,
                    duration: 1
                }, 0);

                tl.to(line2Ref.current, {
                    x: '10vw',
                    skewX: 5,
                    opacity: 0.1,
                    duration: 1
                }, 0);
            }

            // Initial Reveal Animation
            const revealTl = gsap.timeline({ delay: 1 });

            revealTl.fromTo('.hero-title-container',
                { opacity: 0, x: -80, filter: 'blur(20px)' },
                {
                    opacity: 1,
                    x: 0,
                    filter: 'blur(0px)',
                    duration: 2.5,
                    ease: 'expo.out',
                }
            );

            const scrollChars = document.querySelectorAll('.scroll-char');
            if (scrollChars.length > 0) {
                revealTl.to(scrollChars, {
                    opacity: 1,
                    filter: 'blur(0px)',
                    stagger: 0.02,
                    duration: 0.8,
                    ease: 'power2.out',
                }, "-=1.2");
            }
        }

        return () => {
            ScrollTrigger.getAll().forEach(t => t.kill());
        };
    }, []);

    return (
        <section
            ref={containerRef}
            style={{
                height: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'flex-start', // Align to left
                position: 'relative',
                background: 'var(--deep-black)',
                overflow: 'hidden',
            }}
        >
            {/* Background Image Layer */}
            <div
                ref={bgImageRef}
                style={{
                    position: 'absolute',
                    top: '-10%',
                    left: 0,
                    width: '100%',
                    height: '120%',
                    backgroundImage: 'url("/hero%202.png")',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    opacity: 0.4,
                    zIndex: 0,
                }}
            />

            {/* Readability Overlay */}
            <div
                style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    background: 'linear-gradient(to bottom, rgba(0,0,0,0.8) 0%, transparent 40%, transparent 60%, rgba(0,0,0,0.9) 100%)',
                    zIndex: 1,
                }}
            />

            <div
                className="hero-lighting"
                style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    width: '60vw',
                    height: '60vw',
                    background: 'radial-gradient(circle, rgba(255,255,255,0.03) 0%, transparent 70%)',
                    transform: 'translate(-50%, -50%)',
                    pointerEvents: 'none',
                }}
            />

            <div ref={textRef} style={{
                textAlign: 'left',
                zIndex: 10,
                width: '100%',
                padding: '0 var(--gutter)'
            }}>
                <motion.div
                    className="hero-title-container"
                    style={{ opacity: 0 }}
                >
                    <span style={{
                        color: 'var(--highlight)',
                        fontSize: 'clamp(0.6rem, 1vw, 0.8rem)',
                        letterSpacing: '0.4em',
                        textTransform: 'uppercase',
                        display: 'block',
                        marginBottom: 'clamp(1rem, 3vw, 2rem)',
                        opacity: 0.8
                    }}>
                        {data?.headline ? data.headline.split('\n')[0] || "Graphic Designer / Creative Developer" : "Graphic Designer / Creative Developer"}
                    </span>
                    <h1
                        style={{
                            fontSize: 'clamp(2rem, 7.5vw, 6.5rem)',
                            fontWeight: 900,
                            lineHeight: 0.9,
                            margin: 0,
                            letterSpacing: '-0.04em',
                            textTransform: 'uppercase',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'flex-start',
                            maxWidth: '100%'
                        }}
                    >
                        <div ref={line1Ref} className="line-1" style={{
                            position: 'relative',
                            breakInside: 'avoid',
                            display: 'inline-block'
                        }}>
                            {data?.headline || "Designing Visual Stories."}
                        </div>
                        <div ref={line2Ref} className="line-2" style={{
                            fontWeight: 200,
                            opacity: 0.5,
                            marginTop: '0.5rem',
                            position: 'relative',
                            display: 'inline-block'
                        }}>
                            {data?.subheadline || "Developing Digital Experiences."}
                        </div>
                    </h1>
                </motion.div>
            </div>

            <style jsx>{`
                @media (max-width: 768px) {
                    .line-1, .line-2 { 
                        white-space: normal !important; 
                        word-break: break-word;
                    }
                }
                @media (min-width: 769px) {
                    .line-1, .line-2 { 
                        white-space: nowrap !important;
                    }
                }
            `}</style>

            <div style={{
                position: 'absolute',
                bottom: 'var(--spacing-lg)',
                left: 'var(--gutter)', // Align scroll text to left as well
                zIndex: 10
            }}>
                <motion.div
                    style={{
                        color: 'var(--soft-grey)',
                        fontSize: '0.65rem',
                        letterSpacing: '0.3em',
                        textTransform: 'uppercase',
                        textAlign: 'left',
                    }}
                    animate={{ y: [0, 10, 0] }}
                    transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                >
                    {"Scroll to explore".split('').map((char, i) => (
                        <span key={i} className="scroll-char" style={{ display: 'inline-block', opacity: 0, filter: 'blur(10px)' }}>
                            {char === ' ' ? '\u00A0' : char}
                        </span>
                    ))}
                </motion.div>
            </div>
        </section>
    );
}
