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

    // Use DB skills if populated, otherwise use defaults. Deduplicate by name.
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

        let ctx: gsap.Context;

        // Double rAF ensures the browser has fully laid out the horizontal strip
        // before we measure scrollWidth — this is why the scroll was starting mid-way.
        const raf1 = requestAnimationFrame(() => {
            const raf2 = requestAnimationFrame(() => {
                const computeHeight = () => {
                    const totalScroll = section.scrollWidth - window.innerWidth;
                    outer.style.height = `${Math.max(totalScroll, 0) + window.innerHeight}px`;
                };

                // Set height FIRST, then create the ScrollTrigger
                computeHeight();

                ctx = gsap.context(() => {
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
            });
        });

        const handleResize = () => ScrollTrigger.refresh();
        window.addEventListener('resize', handleResize);

        return () => {
            cancelAnimationFrame(raf1);
            ctx?.revert();
            window.removeEventListener('resize', handleResize);
        };
    }, [technologies]);

    // Pre-calculate a rough initial height so the page layout
    // reserves enough space before JS runs (avoids layout shift)
    const estimatedSlides = technologies.length + 1; // +1 for intro slide
    const initialHeight = `${estimatedSlides * 100}vw`;

    return (
        <div
            id="tech"
            ref={outerRef}
            style={{
                height: initialHeight,
                background: 'var(--deep-black)',
                position: 'relative',
                zIndex: 1,
            }}
        >
            {/* CSS sticky keeps the viewport locked while outer scrolls */}
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
                {/* Dynamic Background */}
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
                    background: `rgba(0,0,0,${bg?.overlayOpacity ?? 0.92})`,
                    zIndex: 0, pointerEvents: 'none',
                }} />

                {/* Horizontal strip — GSAP translates this on X axis */}
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
                        width: '100vw',
                        height: '100%',
                        flexShrink: 0,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: '0 clamp(2rem, 8vw, 8rem)',
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
                                color: 'rgba(255,255,255,0.3)',
                                fontSize: 'clamp(0.7rem, 1.1vw, 0.85rem)',
                                letterSpacing: '0.1em',
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
                                flexShrink: 0,
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'center',
                                alignItems: 'center',
                                position: 'relative',
                                padding: '0 clamp(2rem, 8vw, 8rem)',
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
