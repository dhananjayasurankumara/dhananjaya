'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

interface PhilosophyProps {
    data?: {
        label?: string;
        line1?: string;
        line2?: string;
        bio?: string;
    };
}

export default function Philosophy({ data }: PhilosophyProps) {
    const textRef1 = useRef<HTMLHeadingElement>(null);
    const textRef2 = useRef<HTMLHeadingElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const labelRef = useRef<HTMLSpanElement>(null);

    const label = data?.label || "Digital Alchemy / Creative Engineering";
    const line1 = data?.line1 || "I don't just build pixels.";
    const line2 = data?.line2 || "I architect digital souls.";
    const bio = data?.bio || "Architecture is the silence between the code. I operate at the intersection of aesthetic authority and technical precision, where every interaction is a deliberate narrative choice.";

    useEffect(() => {
        gsap.registerPlugin(ScrollTrigger);

        if (textRef1.current && textRef2.current) {
            const chars1 = textRef1.current.querySelectorAll('.char');
            const chars2 = textRef2.current.querySelectorAll('.char');

            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: containerRef.current,
                    start: 'top 70%',
                    toggleActions: 'play none none reverse',
                }
            });

            tl.fromTo(chars1,
                { opacity: 0, filter: 'blur(20px)', y: 20 },
                { opacity: 1, filter: 'blur(0px)', y: 0, stagger: 0.02, duration: 1.2, ease: 'expo.out' }
            )
                .fromTo(chars2,
                    { opacity: 0, filter: 'blur(20px)', y: 20 },
                    { opacity: 1, filter: 'blur(0px)', y: 0, stagger: 0.02, duration: 1.2, ease: 'expo.out' },
                    "-=0.8"
                );

            // Horizontal drift on scroll
            const getDrift = (val: string) => {
                return window.innerWidth < 768 ? (parseFloat(val) * 0.3) + 'vw' : val;
            };

            gsap.to(textRef1.current, {
                x: getDrift('-5vw'),
                scrollTrigger: {
                    trigger: containerRef.current,
                    start: 'top bottom',
                    end: 'bottom top',
                    scrub: true,
                }
            });

            gsap.to(textRef2.current, {
                x: getDrift('5vw'),
                scrollTrigger: {
                    trigger: containerRef.current,
                    start: 'top bottom',
                    end: 'bottom top',
                    scrub: true,
                }
            });

            // Label horizontal scrub
            if (labelRef.current) {
                gsap.to(labelRef.current, {
                    x: getDrift('8vw'),
                    scrollTrigger: {
                        trigger: containerRef.current,
                        start: 'top bottom',
                        end: 'bottom top',
                        scrub: true,
                    }
                });
            }
        }
    }, []);

    const splitText = (text: string) => {
        return text.split(' ').map((word, i, arr) => (
            <span key={i} style={{ display: 'inline-block', whiteSpace: 'nowrap' }}>
                {word.split('').map((char, j) => (
                    <span key={j} className="char" style={{ display: 'inline-block' }}>
                        {char}
                    </span>
                ))}
                {i < arr.length - 1 && '\u00A0'}
            </span>
        ));
    };

    return (
        <section
            id="philosophy"
            ref={containerRef}
            style={{
                minHeight: '160vh', // Slightly taller for more narrative
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'flex-start',
                background: 'var(--deep-black)',
                position: 'relative',
                zIndex: 5,
                padding: '0 var(--gutter)',
                overflow: 'hidden'
            }}
        >
            {/* Ambient Spotlight */}
            <div style={{
                position: 'absolute',
                top: '20%',
                right: '10%',
                width: '50vw',
                height: '50vw',
                background: 'radial-gradient(circle, rgba(255, 255, 255, 0.03) 0%, transparent 70%)',
                pointerEvents: 'none',
                filter: 'blur(100px)',
                opacity: 0.3,
                zIndex: 0
            }} />

            <div style={{ maxWidth: '1400px', width: '100%', position: 'relative', zIndex: 1, textAlign: 'left' }}>
                <div style={{ overflow: 'hidden', marginBottom: '3rem' }}>
                    <span ref={labelRef} className="philosophy-label" style={{
                        color: 'var(--highlight)',
                        fontSize: 'clamp(0.65rem, 1vw, 0.8rem)',
                        letterSpacing: '0.6em',
                        textTransform: 'uppercase',
                        display: 'block',
                        opacity: 0.6
                    }}>
                        {label}
                    </span>
                </div>

                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 'clamp(0.5rem, 2vh, 1.5rem)', // Better gap control
                    marginBottom: 'clamp(3rem, 10vh, 6rem)'
                }}>
                    <h2
                        ref={textRef1}
                        className="p-title p-line-1"
                        style={{
                            fontSize: 'clamp(1.8rem, 9vw, 8.5rem)', // Scaled down for mobile, up for desktop
                            fontWeight: 900,
                            lineHeight: 0.85,
                            textTransform: 'uppercase',
                            margin: 0,
                            letterSpacing: '-0.04em',
                            color: 'var(--accent-white)',
                        }}
                    >
                        {splitText(line1)}
                    </h2>
                    <h2
                        ref={textRef2}
                        className="p-title p-line-2"
                        style={{
                            fontSize: 'clamp(1.8rem, 9vw, 8.5rem)',
                            fontWeight: 200,
                            lineHeight: 0.85,
                            textTransform: 'uppercase',
                            margin: 0,
                            letterSpacing: '-0.04em',
                            color: 'var(--accent-white)',
                            opacity: 0.3,
                        }}
                    >
                        {splitText(line2)}
                    </h2>
                </div>

                <div className="philosophy-content-grid" style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                    gap: '4rem',
                    alignItems: 'start'
                }}>
                    <div style={{
                        maxWidth: '850px',
                        fontSize: 'clamp(1rem, 2.2vw, 1.8rem)',
                        fontWeight: 300,
                        lineHeight: 1.4,
                        color: 'var(--soft-grey)',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '2.5rem'
                    }}>
                        <p className="philosophy-text" style={{ opacity: 0.9 }}>
                            {bio}
                        </p>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                            <p style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', fontSize: '0.85em' }}>
                                <span style={{ width: 'clamp(30px, 5vw, 60px)', height: '1px', background: 'var(--highlight)', display: 'block' }}></span>
                                <span>The resonance of high-fidelity precision.</span>
                            </p>
                            <p style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', opacity: 0.5, fontSize: '0.85em' }}>
                                <span style={{ width: 'clamp(30px, 5vw, 60px)', height: '1px', background: 'var(--soft-grey)', display: 'block' }}></span>
                                <span>Surgical execution of digital interfaces.</span>
                            </p>
                            <p style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', opacity: 0.3, fontSize: '0.85em' }}>
                                <span style={{ width: 'clamp(30px, 5vw, 60px)', height: '1px', background: 'rgba(255,255,255,0.2)', display: 'block' }}></span>
                                <span>Transcending utility for emotional impact.</span>
                            </p>
                        </div>
                    </div>

                    <div style={{
                        fontSize: 'clamp(0.85rem, 1.2vw, 1.1rem)',
                        opacity: 0.5,
                        lineHeight: 1.8,
                        paddingTop: '1rem',
                        borderLeft: '1px solid rgba(255,255,255,0.05)',
                        paddingLeft: '2rem'
                    }}>
                        <p style={{ marginBottom: '1.5rem', fontWeight: 600, color: 'var(--accent-white)', letterSpacing: '0.1em', textTransform: 'uppercase', fontSize: '0.7em' }}>
                            Operational Directives
                        </p>
                        <p>
                            My methodology is rooted in the belief that digital experiences should feel inevitable. Every pixel is audited for visual weight, every transition for kinetic intent. We don't just solve problems; we define experiences that persist in the user's subconscious.
                        </p>
                    </div>
                </div>
            </div>

            <style jsx>{`
                @media (max-width: 1024px) {
                    .p-title {
                        white-space: normal !important;
                        word-break: normal !important;
                    }
                    .philosophy-content-grid {
                        grid-template-columns: 1fr !important;
                        gap: 2rem !important;
                    }
                    div[style*="borderLeft"] {
                        border-left: none !important;
                        border-top: 1px solid rgba(255,255,255,0.05) !important;
                        padding-left: 0 !important;
                        padding-top: 2rem !important;
                    }
                }
                @media (min-width: 1025px) {
                    .p-title {
                        white-space: nowrap !important;
                    }
                }
            `}</style>

            {/* Cinematic Grain Overlay */}
            <div style={{
                position: 'absolute',
                inset: 0,
                backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
                opacity: 0.04,
                pointerEvents: 'none'
            }} />
        </section>
    );
}
