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

            // Staggered Title Animation
            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: containerRef.current,
                    start: "top 60%",
                    toggleActions: "play none none reverse",
                }
            });

            tl.fromTo(line1Ref.current,
                { opacity: 0, x: -30, filter: 'blur(10px)' },
                { opacity: 1, x: 0, filter: 'blur(0px)', duration: 1.5, ease: "expo.out" }
            )
                .fromTo(line2Ref.current,
                    { opacity: 0, x: 30, filter: 'blur(10px)' },
                    { opacity: 1, x: 0, filter: 'blur(0px)', duration: 1.5, ease: "expo.out" },
                    "-=1.2"
                );

            // Parallax Scroll for Titles
            gsap.to(line1Ref.current, {
                x: "-5vw",
                scrollTrigger: {
                    trigger: containerRef.current,
                    start: "top bottom",
                    end: "bottom top",
                    scrub: true
                }
            });

            gsap.to(line2Ref.current, {
                x: "5vw",
                scrollTrigger: {
                    trigger: containerRef.current,
                    start: "top bottom",
                    end: "bottom top",
                    scrub: true
                }
            });

            // Parallax Keywords
            keywordRefs.current.forEach((ref, i) => {
                if (!ref) return;
                const speed = (i + 1) * 0.2;
                gsap.to(ref, {
                    y: `${-100 * speed}px`,
                    x: `${(i % 2 === 0 ? 1 : -1) * 50}px`,
                    scrollTrigger: {
                        trigger: containerRef.current,
                        start: "top bottom",
                        end: "bottom top",
                        scrub: true
                    }
                });
            });

            // Bio Reveal
            if (bioRef.current) {
                const lines = bioRef.current.querySelectorAll('.bio-line');
                gsap.fromTo(lines,
                    { opacity: 0, y: 20, filter: 'blur(5px)' },
                    {
                        opacity: 1, y: 0, filter: 'blur(0px)',
                        stagger: 0.2,
                        duration: 1.2,
                        ease: "power3.out",
                        scrollTrigger: {
                            trigger: bioRef.current,
                            start: "top 85%",
                        }
                    }
                );
            }
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

            <div style={{ maxWidth: '1400px', width: '100%', position: 'relative', zIndex: 1 }}>
                {/* Asymmetric Header */}
                <div style={{ marginBottom: '10vh' }}>
                    <span ref={labelRef} style={{
                        color: 'var(--highlight)',
                        fontSize: 'clamp(0.7rem, 1vw, 0.9rem)',
                        letterSpacing: '0.5em',
                        textTransform: 'uppercase',
                        display: 'block',
                        marginBottom: '4rem',
                        fontWeight: 600
                    }}>
                        {label}
                    </span>

                    <div style={{ position: 'relative' }}>
                        <h2
                            ref={line1Ref}
                            style={{
                                fontSize: 'clamp(2.5rem, 10vw, 10rem)',
                                fontWeight: 900,
                                lineHeight: 1,
                                textTransform: 'uppercase',
                                margin: 0,
                                letterSpacing: '-0.05em',
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
                                fontSize: 'clamp(2.5rem, 10vw, 10rem)',
                                fontWeight: 900,
                                lineHeight: 1,
                                textTransform: 'uppercase',
                                margin: '-2vh 0 0 0',
                                letterSpacing: '-0.05em',
                                color: 'var(--accent-white)',
                                WebkitTextStroke: 'none',
                                textAlign: 'right',
                                position: 'relative',
                                zIndex: 1
                            }}
                        >
                            {line2}
                        </h2>
                    </div>
                </div>

                {/* Editorial Bio Content */}
                <div style={{
                    display: 'flex',
                    justifyContent: 'flex-end',
                    marginTop: '5vh'
                }}>
                    <div
                        ref={bioRef}
                        style={{
                            maxWidth: '700px',
                            textAlign: 'left'
                        }}
                    >
                        <div style={{
                            fontSize: 'clamp(1.1rem, 2vw, 1.8rem)',
                            fontWeight: 300,
                            lineHeight: 1.6,
                            color: 'var(--soft-grey)',
                        }}>
                            {splitIntoLines(bio)}
                        </div>

                        <div style={{
                            marginTop: '4rem',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '1rem',
                            borderTop: '1px solid rgba(255, 255, 255, 0.1)',
                            paddingTop: '2rem'
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
                                    fontSize: '0.75rem',
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.3em',
                                    opacity: 0.4 + (i * 0.2)
                                }}>
                                    <span style={{ width: '40px', height: '1px', background: 'var(--highlight)' }} />
                                    {text}
                                </div>
                            ))}
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
