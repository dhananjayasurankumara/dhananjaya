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
    bg?: {
        imageUrl?: string | null;
        imagePosition?: string;
        overlayOpacity?: number;
    };
}

export default function Philosophy({ data, bg }: PhilosophyProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const line1Ref = useRef<HTMLHeadingElement>(null);
    const line2Ref = useRef<HTMLHeadingElement>(null);
    const labelRef = useRef<HTMLSpanElement>(null);
    const bioRef = useRef<HTMLDivElement>(null);
    const keywordRefs = useRef<(HTMLSpanElement | null)[]>([]);

    const label = data?.label || "Digital Alchemy / Creative Engineering";
    const line1 = data?.line1 || "I don't just build pixels.";
    const line2 = data?.line2 || "I architect digital souls.";
    const bio = data?.bio || "Architecture is the silence between the code. I operate at the intersection of aesthetic authority and technical precision, where every interaction is a deliberate narrative choice.";

    const keywords = ["PRECISION", "ALCHEMY", "KINETIC", "AESTHETIC", "AUTHORITY", "SOUUL"];

    useEffect(() => {
        gsap.registerPlugin(ScrollTrigger);

        if (!containerRef.current) return;

        const ctx = gsap.context(() => {
            // Label animation
            gsap.fromTo(labelRef.current,
                { opacity: 0, x: -30 },
                {
                    opacity: 0.6, x: 0, duration: 1.5, ease: "power4.out",
                    scrollTrigger: {
                        trigger: containerRef.current,
                        start: "top 80%",
                    }
                }
            );

            // Title Animation (Left Side)
            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: containerRef.current,
                    start: "top 60%",
                    toggleActions: "play none none reverse",
                }
            });

            tl.fromTo(line1Ref.current,
                { opacity: 0, x: -50, filter: 'blur(10px)' },
                { opacity: 1, x: 0, filter: 'blur(0px)', duration: 1.5, ease: "expo.out" }
            )
                .fromTo(line2Ref.current,
                    { opacity: 0, x: -30, filter: 'blur(10px)' },
                    { opacity: 1, x: 0, filter: 'blur(0px)', duration: 1.5, ease: "expo.out" },
                    "-=1.2"
                );

            // Right Side Content Reveal
            gsap.from('.philosophy-right-content > *', {
                x: 50,
                opacity: 0,
                stagger: 0.2,
                duration: 1.2,
                ease: 'power3.out',
                scrollTrigger: {
                    trigger: containerRef.current,
                    start: 'top 60%',
                }
            });
        }, containerRef);

        return () => ctx.revert();
    }, []);

    const splitIntoLines = (text: string) => {
        // Simple heuristic for line splitting or just wrap in spans
        return text.split('. ').map((line, i) => (
            <span key={i} className="bio-line" style={{ display: 'block', marginBottom: '1rem' }}>
                {line}{i < text.split('. ').length - 1 ? '.' : ''}
            </span>
        ));
    };

    return (
        <section
            id="philosophy"
            ref={containerRef}
            style={{
                minHeight: '140vh',
                background: 'var(--deep-black)',
                position: 'relative',
                zIndex: 5,
                padding: '15vh var(--gutter)',
                overflow: 'hidden',
                display: 'flex',
                alignItems: 'center'
            }}
        >
            {/* Dynamic Background Image */}
            {bg?.imageUrl && (
                <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    backgroundImage: `url("${bg.imageUrl}")`,
                    backgroundSize: 'cover',
                    backgroundPosition: bg.imagePosition || 'center',
                    opacity: 0.15, // Keep it subtle for philosophy
                    zIndex: 0,
                    pointerEvents: 'none',
                }} />
            )}

            {/* Dark Overlay based on admin setting */}
            <div style={{
                position: 'absolute',
                inset: 0,
                background: `rgba(0,0,0,${bg?.overlayOpacity || 0.9})`,
                zIndex: 0,
                pointerEvents: 'none'
            }} />
            {/* Background Kinetic Keywords */}
            {keywords.map((word, i) => (
                <span
                    key={i}
                    ref={el => { keywordRefs.current[i] = el; }}
                    style={{
                        position: 'absolute',
                        fontSize: '12vw',
                        fontWeight: 900,
                        color: 'rgba(255, 255, 255, 0.02)',
                        pointerEvents: 'none',
                        zIndex: 0,
                        whiteSpace: 'nowrap',
                        top: `${15 + (i * 15)}%`,
                        left: i % 2 === 0 ? '-5%' : 'auto',
                        right: i % 2 !== 0 ? '-5%' : 'auto',
                        letterSpacing: '0.2em'
                    }}
                >
                    {word}
                </span>
            ))}

            <div style={{ maxWidth: '1800px', width: '100%', position: 'relative', zIndex: 1 }}>
                {/* Grid Container */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: '1.2fr 0.8fr',
                    gap: '6rem',
                    alignItems: 'center'
                }} className="philosophy-grid">

                    {/* Left Column: Titles */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
                        <span ref={labelRef} style={{
                            color: 'var(--highlight)',
                            fontSize: 'clamp(0.7rem, 1vw, 0.8rem)',
                            letterSpacing: '0.4em',
                            textTransform: 'uppercase',
                            display: 'block',
                            fontWeight: 600,
                            opacity: 0.8
                        }}>
                            {label}
                        </span>

                        <div style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'flex-start',
                            textAlign: 'left'
                        }}>
                            <h2
                                ref={line1Ref}
                                style={{
                                    fontSize: 'clamp(3rem, 9vw, 9rem)',
                                    fontWeight: 900,
                                    lineHeight: 0.9,
                                    textTransform: 'uppercase',
                                    margin: 0,
                                    letterSpacing: '-0.04em',
                                    color: 'var(--accent-white)',
                                    position: 'relative',
                                    zIndex: 2
                                }}
                            >
                                {line1}
                            </h2>
                            <h2
                                ref={line2Ref}
                                style={{
                                    fontSize: 'clamp(1.5rem, 5vw, 3.5rem)',
                                    fontWeight: 700,
                                    lineHeight: 1,
                                    textTransform: 'uppercase',
                                    margin: '1.5rem 0 0 0',
                                    letterSpacing: '-0.02em',
                                    color: 'var(--highlight)',
                                    WebkitTextStroke: 'none',
                                    textAlign: 'left',
                                    position: 'relative',
                                    zIndex: 1
                                }}
                            >
                                {line2}
                            </h2>
                        </div>
                    </div>

                    {/* Right Column: Bio & Pillars */}
                    <div
                        className="philosophy-right-content"
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 'clamp(2rem, 5vw, 4rem)',
                            alignItems: 'flex-start'
                        }}
                    >
                        <div
                            ref={bioRef}
                            style={{
                                maxWidth: '550px',
                                textAlign: 'left'
                            }}
                        >
                            <div style={{
                                fontSize: 'clamp(1rem, 1.4vw, 1.4rem)',
                                fontWeight: 300,
                                lineHeight: 1.6,
                                color: 'var(--soft-grey)',
                                letterSpacing: '0.02em'
                            }}>
                                {splitIntoLines(bio)}
                            </div>

                            <div style={{
                                marginTop: '4rem',
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '1.2rem',
                                borderTop: '1px solid rgba(255, 255, 255, 0.1)',
                                paddingTop: '2.5rem'
                            }}>
                                {[
                                    "Intentional Minimalism",
                                    "Kinetic Precision",
                                    "Aesthetic Authority"
                                ].map((text, i) => (
                                    <div key={i} style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '1rem',
                                        fontSize: '0.65rem',
                                        textTransform: 'uppercase',
                                        letterSpacing: '0.4em',
                                        opacity: 0.3 + (i * 0.2)
                                    }}>
                                        <span style={{ width: '30px', height: '1px', background: 'var(--highlight)' }} />
                                        {text}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Cinematic Grain & Spotlight */}
            <div style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: '100%',
                height: '100%',
                background: 'radial-gradient(circle at 70% 30%, rgba(255, 255, 255, 0.02) 0%, transparent 50%)',
                pointerEvents: 'none',
                zIndex: 0
            }} />
        </section>
    );
}
