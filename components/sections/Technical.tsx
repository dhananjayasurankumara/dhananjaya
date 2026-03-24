'use client';

import { useEffect, useRef, useMemo } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

const defaultTech = [
    { name: 'JavaScript', type: 'Language' },
    { name: 'TypeScript', type: 'Language' },
    { name: 'React', type: 'Framework' },
    { name: 'Next.js', type: 'Framework' },
    { name: 'GSAP', type: 'Motion' },
    { name: 'Three.js', type: '3D/WebGL' },
    { name: 'Tailwind CSS', type: 'CSS' },
    { name: 'Figma', type: 'Design' },
    { name: 'Photoshop', type: 'Design' },
    { name: 'After Effects', type: 'Motion' },
    { name: 'Illustrator', type: 'Vector' },
];

interface TechnicalProps {
    data?: { name: string; type: string }[];
    bg?: { imageUrl: string | null; imagePosition: string; overlayOpacity: number };
}

export default function Technical({ data, bg }: TechnicalProps) {
    const outerRef = useRef<HTMLDivElement>(null);
    const stickyRef = useRef<HTMLDivElement>(null);
    const sectionRef = useRef<HTMLDivElement>(null);

    // Only show DB skills if they exist; otherwise fall back to defaults.
    // Deduplicate by name (case-insensitive).
    const technologies = useMemo(() => {
        const source = (data && data.length > 0) ? data : defaultTech;
        const seen = new Set<string>();
        return source.filter(t => {
            const key = t.name?.trim().toLowerCase();
            if (!key || seen.has(key)) return false;
            seen.add(key);
            return true;
        });
    }, [data]);

    useEffect(() => {
        gsap.registerPlugin(ScrollTrigger);

        const outer = outerRef.current;
        const sticky = stickyRef.current;
        const section = sectionRef.current;
        if (!outer || !sticky || !section) return;

        // Dynamically calculate the scroll height based on actual content width
        const computeHeight = () => {
            const totalScroll = section.scrollWidth - window.innerWidth;
            outer.style.height = `${Math.max(totalScroll, 0) + window.innerHeight}px`;
        };

        // Small delay to let the DOM fully paint before measuring
        const timer = setTimeout(computeHeight, 100);

        const ctx = gsap.context(() => {
            gsap.to(section, {
                x: () => -(section.scrollWidth - window.innerWidth),
                ease: 'none',
                scrollTrigger: {
                    trigger: outer,
                    start: 'top top',
                    end: 'bottom bottom',
                    scrub: 1,
                    invalidateOnRefresh: true,
                    onRefresh: computeHeight,
                },
            });
        }, outer);

        window.addEventListener('resize', computeHeight);

        return () => {
            clearTimeout(timer);
            ctx.revert();
            window.removeEventListener('resize', computeHeight);
        };
    }, [technologies]);

    return (
        <div
            id="tech"
            ref={outerRef}
            style={{
                background: 'var(--deep-black)',
                position: 'relative',
                zIndex: 1,
                // Height is set dynamically in useEffect; 100vh is just a fallback
                height: '100vh',
            }}
        >
            {/* CSS sticky keeps the viewport locked while the outer container scrolls */}
            <div
                ref={stickyRef}
                style={{
                    position: 'sticky',
                    top: 0,
                    height: '100vh',
                    width: '100%',
                    overflow: 'hidden',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            >
                {/* Dynamic Background Image */}
                {bg?.imageUrl && (
                    <div style={{
                        position: 'absolute', inset: 0,
                        backgroundImage: `url("${bg.imageUrl}")`,
                        backgroundSize: 'cover',
                        backgroundPosition: bg.imagePosition || 'center',
                        opacity: 0.08,
                        zIndex: 0, pointerEvents: 'none',
                    }} />
                )}

                {/* Overlay */}
                <div style={{
                    position: 'absolute', inset: 0,
                    background: `rgba(0,0,0,${bg?.overlayOpacity ?? 0.95})`,
                    zIndex: 0, pointerEvents: 'none',
                }} />

                {/* Horizontal strip — GSAP translates this */}
                <div
                    ref={sectionRef}
                    style={{
                        height: '100vh',
                        width: 'max-content',
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'center',
                        willChange: 'transform',
                        position: 'relative',
                        zIndex: 1,
                    }}
                >
                    {/* ── Intro Slide ── */}
                    <div style={{
                        width: '100vw', height: '100%',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        padding: '0 clamp(2rem, 8vw, 8rem)',
                        flexShrink: 0,
                    }}>
                        <div style={{ maxWidth: '800px', textAlign: 'center' }}>
                            <span style={{
                                color: 'var(--highlight)',
                                fontSize: 'clamp(0.6rem, 1vw, 0.75rem)',
                                letterSpacing: '0.6em',
                                textTransform: 'uppercase',
                                display: 'block',
                                marginBottom: '2rem',
                                opacity: 0.8,
                            }}>
                                Expertise &amp; Tools
                            </span>
                            <h2 style={{
                                fontSize: 'clamp(3rem, 10vw, 7.5rem)',
                                fontWeight: 200,
                                textTransform: 'uppercase',
                                lineHeight: 0.9,
                                letterSpacing: '-0.04em',
                                margin: 0,
                            }}>
                                Technical<br />
                                <span style={{ fontWeight: 600, color: 'var(--accent-white)' }}>Mastery</span>
                            </h2>
                            <p style={{
                                marginTop: '2rem',
                                color: 'rgba(255,255,255,0.35)',
                                fontSize: 'clamp(0.75rem, 1.2vw, 0.9rem)',
                                letterSpacing: '0.05em',
                            }}>
                                Scroll to explore →
                            </p>
                        </div>
                    </div>

                    {/* ── Tech Slides ── */}
                    {technologies.map((tech, index) => (
                        <div
                            key={`${tech.name}-${index}`}
                            style={{
                                width: '100vw',
                                height: '100%',
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'center',
                                alignItems: 'center',
                                position: 'relative',
                                padding: '0 clamp(2rem, 8vw, 8rem)',
                                flexShrink: 0,
                            }}
                        >
                            {/* Ghost number */}
                            <div style={{
                                position: 'absolute',
                                top: '50%', left: '50%',
                                transform: 'translate(-50%, -50%)',
                                fontSize: 'clamp(10rem, 30vw, 22rem)',
                                fontWeight: 900,
                                opacity: 0.018,
                                zIndex: 0,
                                pointerEvents: 'none',
                                userSelect: 'none',
                                lineHeight: 1,
                            }}>
                                {String(index + 1).padStart(2, '0')}
                            </div>

                            <div style={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
                                <span style={{
                                    color: 'var(--highlight)',
                                    fontSize: 'clamp(0.6rem, 1vw, 0.75rem)',
                                    marginBottom: '1.2rem',
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.4em',
                                    display: 'block',
                                }}>
                                    {tech.type}
                                </span>
                                <h3 style={{
                                    fontSize: 'clamp(2.5rem, 9vw, 6rem)',
                                    fontWeight: 200,
                                    margin: 0,
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.04em',
                                    lineHeight: 1,
                                }}>
                                    {tech.name}
                                </h3>
                                <div style={{
                                    width: 'clamp(40px, 10vw, 60px)',
                                    height: '1px',
                                    background: 'var(--highlight)',
                                    margin: 'clamp(1.5rem, 4vw, 3rem) auto 0',
                                    boxShadow: '0 0 20px rgba(229,9,20,0.3)',
                                }} />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
