'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Image from 'next/image';

interface AboutProps {
    data?: {
        title?: string;
        bio?: string;
        stat1Value?: string;
        stat1Label?: string;
        stat2Value?: string;
        stat2Label?: string;
        stat3Value?: string;
        stat3Label?: string;
    };
}

export default function About({ data }: AboutProps) {
    const sectionRef = useRef<HTMLDivElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);
    const imageRef = useRef<HTMLDivElement>(null);
    const auraRef = useRef<HTMLDivElement>(null);
    const bgRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        gsap.registerPlugin(ScrollTrigger);

        const ctx = gsap.context(() => {
            // Text Reveal Stagger
            if (contentRef.current) {
                const elements = contentRef.current.querySelectorAll('.reveal-item');
                gsap.fromTo(elements,
                    { opacity: 0, y: 50, filter: 'blur(15px)' },
                    {
                        opacity: 1,
                        y: 0,
                        filter: 'blur(0px)',
                        stagger: 0.2,
                        duration: 1.8,
                        ease: 'power4.out',
                        scrollTrigger: {
                            trigger: sectionRef.current,
                            start: 'top 60%',
                        }
                    }
                );
            }

            // Image Parallax and Scale
            if (imageRef.current) {
                gsap.fromTo(imageRef.current,
                    { y: -50, scale: 1.1 },
                    {
                        y: 50,
                        scale: 1,
                        scrollTrigger: {
                            trigger: sectionRef.current,
                            start: 'top bottom',
                            end: 'bottom top',
                            scrub: true,
                        }
                    }
                );
            }

            // Background Image Parallax
            if (bgRef.current) {
                gsap.fromTo(bgRef.current,
                    { y: '-10%', scale: 1.1 },
                    {
                        y: '10%',
                        scale: 1,
                        scrollTrigger: {
                            trigger: sectionRef.current,
                            start: 'top bottom',
                            end: 'bottom top',
                            scrub: true,
                        }
                    }
                );
            }

            // Aura Pulse Animation
            if (auraRef.current) {
                gsap.to(auraRef.current, {
                    scale: 1.2,
                    opacity: 0.15,
                    duration: 4,
                    repeat: -1,
                    yoyo: true,
                    ease: 'sine.inOut'
                });
            }
        });

        return () => ctx.revert();
    }, []);

    return (
        <section
            id="about"
            ref={sectionRef}
            style={{
                minHeight: '120vh', // Slightly reduced for mobile flexibility
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-end',
                justifyContent: 'flex-start',
                background: 'var(--deep-black)',
                position: 'relative',
                padding: 'clamp(5rem, 15vh, 15rem) var(--gutter)',
                overflow: 'hidden',
                textAlign: 'right'
            }}
        >
            {/* Background Image Layer */}
            <div
                ref={bgRef}
                style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '115%', // Adjusted for parallax
                    zIndex: 0,
                    opacity: 0.35,
                    pointerEvents: 'none'
                }}
            >
                <Image
                    src="/hero.png"
                    alt="Background"
                    fill
                    style={{
                        objectFit: 'cover',
                        objectPosition: 'center',
                        filter: 'grayscale(30%) brightness(0.6)'
                    }}
                />
                <div style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'linear-gradient(to bottom, var(--deep-black) 0%, transparent 15%, transparent 85%, var(--deep-black) 100%)'
                }} />
                {/* Secondary darkening overlay */}
                <div style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'rgba(0,0,0,0.6)'
                }} />
            </div>

            {/* Background Atmosphere */}
            <div
                ref={auraRef}
                style={{
                    position: 'absolute',
                    top: '30%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: '80vw',
                    height: '80vw',
                    background: 'radial-gradient(circle, rgba(255,255,255,0.03) 0%, transparent 70%)',
                    pointerEvents: 'none',
                    zIndex: 0,
                    opacity: 0.1
                }}
            />

            <div
                className="about-content-inner"
                style={{
                    maxWidth: '900px',
                    width: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'flex-end',
                    zIndex: 1
                }}
            >
                {/* Content Layer */}
                <div ref={contentRef}>
                    <span className="reveal-item" style={{
                        color: 'var(--highlight)',
                        fontSize: 'clamp(0.65rem, 1vw, 0.8rem)',
                        letterSpacing: '0.4em',
                        textTransform: 'uppercase',
                        display: 'block',
                        marginBottom: '1.2rem',
                        opacity: 0.7
                    }}>
                        Architect of Digital Experiences
                    </span>

                    <h2 className="reveal-item" style={{
                        fontSize: 'clamp(2.2rem, 6.5vw, 6rem)',
                        fontWeight: 300,
                        lineHeight: 1.0,
                        textTransform: 'uppercase',
                        letterSpacing: '-0.03em',
                        marginBottom: 'clamp(2rem, 5vw, 4rem)'
                    }}>
                        {data?.title ? (
                            <span dangerouslySetInnerHTML={{ __html: data.title }} />
                        ) : (
                            <>
                                Design with <span style={{ fontWeight: 600, color: 'var(--accent-white)' }}>Souls.</span><br />
                                Develop with <span style={{ fontWeight: 600, color: 'var(--highlight)' }}>Precision.</span>
                            </>
                        )}
                    </h2>

                    <div className="reveal-item about-description" style={{
                        fontSize: 'clamp(1rem, 1.5vw, 1.25rem)',
                        lineHeight: 1.6,
                        fontWeight: 300,
                        color: 'var(--soft-grey)',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '1.5rem',
                        maxWidth: '700px',
                        marginLeft: 'auto'
                    }}>
                        {data?.bio ? (
                            <p>{data.bio}</p>
                        ) : (
                            <>
                                <p>
                                    A creative force dedicated to the art of digital storytelling. With a foundation in graphic design and a passion for modern web technologies, I bridge the gap between imagination and execution.
                                </p>
                                <p>
                                    Every project is a journey into the aesthetic unknown. I don't just build websites; I craft digital signatures that resonate with purpose and visual authority.
                                </p>
                            </>
                        )}
                    </div>

                    <div className="reveal-item about-grid" style={{
                        marginTop: 'clamp(3rem, 8vw, 6rem)',
                        paddingTop: '3rem',
                        borderTop: '1px solid rgba(255,255,255,0.05)',
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                        gap: 'clamp(2rem, 5vw, 4rem)',
                        textAlign: 'left'
                    }}>
                        <div style={{ textAlign: 'right' }}>
                            <h4 style={{ fontSize: '0.7rem', letterSpacing: '0.15rem', textTransform: 'uppercase', marginBottom: '0.8rem', opacity: 0.4 }}>Creative Focus</h4>
                            <p style={{ fontSize: 'clamp(0.9rem, 1.2vw, 1.1rem)', fontWeight: 300 }}>Motion Architecture, Cinematic UI, Visual Narrative Design.</p>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                            <h4 style={{ fontSize: '0.7rem', letterSpacing: '0.15rem', textTransform: 'uppercase', marginBottom: '0.8rem', opacity: 0.4 }}>Core Belief</h4>
                            <p style={{ fontSize: 'clamp(0.9rem, 1.2vw, 1.1rem)', fontWeight: 300 }}>Minimalism isn't the absence of detail; it's the mastery of it.</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Scrolling Decorative Backdrop */}
            <div style={{
                position: 'absolute',
                bottom: '5%',
                right: '-2%',
                fontSize: 'clamp(10rem, 25vw, 20rem)',
                fontWeight: 900,
                opacity: 0.015,
                userSelect: 'none',
                pointerEvents: 'none',
                lineHeight: 1,
                fontFamily: 'Inter, sans-serif'
            }}>
                DNA
            </div>

            <style jsx>{`
                @media (max-width: 768px) {
                    section {
                        padding-top: 15vh !important;
                        text-align: right !important;
                        align-items: flex-end !important;
                    }
                    .about-grid {
                        grid-template-columns: 1fr !important;
                        gap: 2.5rem !important;
                    }
                    .about-description {
                        max-width: 100% !important;
                    }
                }
            `}</style>
        </section>
    );
}
