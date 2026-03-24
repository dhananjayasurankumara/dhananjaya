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
    { name: 'Tailwind', type: 'CSS' },
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
    const outerRef = useRef<HTMLDivElement>(null);   // tall outer container
    const stickyRef = useRef<HTMLDivElement>(null);  // sticky viewport
    const sectionRef = useRef<HTMLDivElement>(null); // horizontal strip

    // Merge default skills with DB skills and deduplicate by name
    const technologies = useMemo(() => {
        const combined = [...defaultTech, ...(data || [])];
        const seen = new Set<string>();
        return combined.filter(t => {
            const key = t.name?.toLowerCase();
            if (!key || seen.has(key)) return false;
            seen.add(key);
            return true;
        });
    }, [data]);

    useEffect(() => {
        gsap.registerPlugin(ScrollTrigger);
        ScrollTrigger.refresh(); // Ensure accurate calculations after data update

        const outer = outerRef.current;
        const sticky = stickyRef.current;
        const section = sectionRef.current;
        if (!outer || !sticky || !section) return;

        // Set outer height = total horizontal scroll distance + 1 viewport height
        const setHeight = () => {
            const totalWidth = section.scrollWidth - window.innerWidth;
            outer.style.height = `${totalWidth + window.innerHeight}px`;
        };
        setHeight();

        const ctx = gsap.context(() => {
            // Translate the strip horizontally as the user scrolls vertically.
            // No pin:true — we use CSS sticky instead, so GSAP never moves the DOM.
            gsap.to(section, {
                x: () => -(section.scrollWidth - window.innerWidth),
                ease: 'none',
                scrollTrigger: {
                    trigger: outer,
                    start: 'top top',
                    end: 'bottom bottom',
                    scrub: 0.5,
                    invalidateOnRefresh: true,
                },
            });
        });

        window.addEventListener('resize', setHeight);
        return () => {
            ctx.revert();
            window.removeEventListener('resize', setHeight);
        };
    }, [technologies]);

    return (
        // Tall outer container creates the scroll distance
        <div
            id="tech"
            ref={outerRef}
            style={{
                height: '500vh',
                background: 'var(--deep-black)',
                position: 'relative',
                zIndex: 1
            }}
        >
            {/* CSS sticky keeps the viewport in place while outer scrolls */}
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
                    justifyContent: 'center'
                }}
            >
                {/* Dynamic Background Image */}
                {bg?.imageUrl && (
                    <div style={{
                        position: 'absolute',
                        inset: 0,
                        backgroundImage: `url("${bg.imageUrl}")`,
                        backgroundSize: 'cover',
                        backgroundPosition: bg.imagePosition || 'center',
                        opacity: 0.1, // Keep it very subtle for a technical feel
                        zIndex: 0,
                        pointerEvents: 'none'
                    }} />
                )}

                {/* Dark Overlay based on admin setting */}
                <div style={{
                    position: 'absolute',
                    inset: 0,
                    background: `rgba(0,0,0,${bg?.overlayOpacity || 0.95})`,
                    zIndex: 0,
                    pointerEvents: 'none'
                }} />
                {/* Horizontal strip — translated by GSAP (no DOM relocation) */}
                <div
                    ref={sectionRef}
                    style={{
                        height: '100vh',
                        width: 'fit-content',
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'center',
                    }}
                >
                    {/* Intro Slide */}
                    <div style={{ width: '100vw', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 var(--gutter)' }}>
                        <div className="section-content">
                            <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
                                <span style={{
                                    color: 'var(--highlight)',
                                    fontSize: 'clamp(0.65rem, 1vw, 0.75rem)',
                                    letterSpacing: '0.6em',
                                    textTransform: 'uppercase',
                                    display: 'block',
                                    marginBottom: '2rem',
                                    opacity: 0.8
                                }}>
                                    Expertise &amp; Tools
                                </span>
                                <h2 style={{
                                    fontSize: 'clamp(3rem, 10vw, 7.5rem)',
                                    fontWeight: 200,
                                    textTransform: 'uppercase',
                                    lineHeight: 0.9,
                                    letterSpacing: '-0.04em'
                                }}>
                                    Technical<br />
                                    <span style={{ fontWeight: 600, color: 'var(--accent-white)' }}>Mastery</span>
                                </h2>
                            </div>
                        </div>
                    </div>

                    {/* Tech Slides */}
                    {technologies.map((tech, index) => (
                        <div
                            key={index}
                            style={{
                                width: '100vw',
                                height: '100%',
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'center',
                                alignItems: 'center',
                                position: 'relative',
                                padding: '0 var(--gutter)'
                            }}
                        >
                            <div className="tech-bg-number" style={{
                                position: 'absolute',
                                top: '50%',
                                left: '50%',
                                transform: 'translate(-50%, -50%)',
                                fontSize: 'clamp(10rem, 30vw, 22rem)',
                                fontWeight: 900,
                                opacity: 0.015,
                                zIndex: 0,
                                pointerEvents: 'none',
                                userSelect: 'none'
                            }}>
                                {index + 1}
                            </div>

                            <div style={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
                                <span style={{
                                    color: 'var(--highlight)',
                                    fontSize: 'clamp(0.7rem, 1vw, 0.8rem)',
                                    marginBottom: '1.2rem',
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.3em',
                                    display: 'block'
                                }}>
                                    {tech.type}
                                </span>
                                <h3 style={{
                                    fontSize: 'clamp(2rem, 8vw, 5rem)',
                                    fontWeight: 300,
                                    margin: 0,
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.05em',
                                    lineHeight: 1
                                }}>
                                    {tech.name}
                                </h3>
                                <div style={{
                                    width: 'min(60px, 15vw)',
                                    height: '2px',
                                    background: 'var(--highlight)',
                                    margin: 'clamp(2rem, 5vw, 3.5rem) auto 0',
                                    boxShadow: '0 0 15px rgba(229, 9, 20, 0.2)'
                                }} />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
