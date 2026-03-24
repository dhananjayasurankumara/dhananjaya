'use client';

import { useEffect, useRef, useMemo } from 'react';

const defaultTech = [
    { name: 'JavaScript', type: 'Language' },
    { name: 'TypeScript', type: 'Language' },
    { name: 'React', type: 'Framework' },
    { name: 'Next.js', type: 'Framework' },
    { name: 'GSAP', type: 'Motion' },
    { name: 'Three.js', type: '3D / WebGL' },
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
    const sectionRef = useRef<HTMLDivElement>(null);
    const itemRefs = useRef<(HTMLDivElement | null)[]>([]);

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

    // Staggered reveal with IntersectionObserver — no GSAP, no scroll bugs
    useEffect(() => {
        const items = itemRefs.current.filter(Boolean) as HTMLDivElement[];
        if (!items.length) return;

        // Start hidden
        items.forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(40px)';
            el.style.transition = 'none';
        });

        const observer = new IntersectionObserver(
            entries => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const el = entry.target as HTMLDivElement;
                        const i = items.indexOf(el);
                        setTimeout(() => {
                            el.style.transition = 'opacity 0.7s ease, transform 0.7s ease';
                            el.style.opacity = '1';
                            el.style.transform = 'translateY(0)';
                        }, i * 60);
                        observer.unobserve(el);
                    }
                });
            },
            { threshold: 0.1, rootMargin: '0px 0px -60px 0px' }
        );

        items.forEach(el => observer.observe(el));
        return () => observer.disconnect();
    }, [technologies]);

    const overlayOpacity = bg?.overlayOpacity ?? 0.92;

    return (
        <section
            id="tech"
            ref={sectionRef}
            style={{
                background: 'var(--deep-black)',
                position: 'relative',
                padding: 'clamp(6rem, 14vh, 10rem) clamp(2rem, 8vw, 8rem)',
                minHeight: '100vh',
                zIndex: 1,
                overflow: 'hidden',
            }}
        >
            {/* Background image */}
            {bg?.imageUrl && (
                <div style={{
                    position: 'absolute', inset: 0,
                    backgroundImage: `url("${bg.imageUrl}")`,
                    backgroundSize: 'cover',
                    backgroundPosition: bg.imagePosition || 'center',
                    opacity: 0.07,
                    zIndex: 0, pointerEvents: 'none',
                }} />
            )}

            {/* Dark overlay */}
            <div style={{
                position: 'absolute', inset: 0,
                background: `rgba(0,0,0,${overlayOpacity})`,
                zIndex: 0, pointerEvents: 'none',
            }} />

            {/* Content */}
            <div style={{ position: 'relative', zIndex: 1, maxWidth: '1400px', margin: '0 auto' }}>

                {/* Header */}
                <div style={{ marginBottom: 'clamp(3rem, 8vh, 6rem)' }}>
                    <span style={{
                        color: 'var(--highlight)',
                        fontSize: 'clamp(0.6rem, 1vw, 0.75rem)',
                        letterSpacing: '0.6em',
                        textTransform: 'uppercase',
                        display: 'block',
                        marginBottom: '1.5rem',
                        opacity: 0.8,
                    }}>
                        Expertise &amp; Tools
                    </span>
                    <h2 style={{
                        fontSize: 'clamp(2.5rem, 8vw, 6rem)',
                        fontWeight: 200,
                        textTransform: 'uppercase',
                        lineHeight: 0.95,
                        letterSpacing: '-0.03em',
                        margin: 0,
                    }}>
                        Technical<br />
                        <span style={{ fontWeight: 700, color: 'var(--accent-white)' }}>Mastery</span>
                    </h2>
                </div>

                {/* Skills Grid */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(min(280px, 100%), 1fr))',
                    gap: '1px',
                    border: '1px solid rgba(255,255,255,0.06)',
                }}>
                    {technologies.map((tech, i) => (
                        <div
                            key={`${tech.name}-${i}`}
                            ref={el => { itemRefs.current[i] = el; }}
                            style={{
                                padding: 'clamp(1.5rem, 4vw, 2.5rem)',
                                borderRight: '1px solid rgba(255,255,255,0.06)',
                                borderBottom: '1px solid rgba(255,255,255,0.06)',
                                position: 'relative',
                                cursor: 'default',
                                transition: 'background 0.3s ease',
                            }}
                            onMouseEnter={e => {
                                (e.currentTarget as HTMLDivElement).style.background = 'rgba(255,255,255,0.03)';
                            }}
                            onMouseLeave={e => {
                                (e.currentTarget as HTMLDivElement).style.background = 'transparent';
                            }}
                        >
                            {/* Index number */}
                            <span style={{
                                position: 'absolute',
                                top: 'clamp(1rem, 2vw, 1.5rem)',
                                right: 'clamp(1rem, 2vw, 1.5rem)',
                                fontSize: '0.65rem',
                                color: 'rgba(255,255,255,0.15)',
                                letterSpacing: '0.1em',
                                fontWeight: 400,
                            }}>
                                {String(i + 1).padStart(2, '0')}
                            </span>

                            {/* Type badge */}
                            <span style={{
                                display: 'inline-block',
                                fontSize: 'clamp(0.55rem, 0.9vw, 0.65rem)',
                                letterSpacing: '0.3em',
                                textTransform: 'uppercase',
                                color: 'var(--highlight)',
                                marginBottom: '0.8rem',
                                opacity: 0.9,
                            }}>
                                {tech.type}
                            </span>

                            {/* Skill name */}
                            <h3 style={{
                                fontSize: 'clamp(1.2rem, 3vw, 1.8rem)',
                                fontWeight: 300,
                                margin: 0,
                                textTransform: 'uppercase',
                                letterSpacing: '0.05em',
                                lineHeight: 1.1,
                                color: '#fff',
                            }}>
                                {tech.name}
                            </h3>

                            {/* Red accent line */}
                            <div style={{
                                marginTop: '1.2rem',
                                width: '32px',
                                height: '1px',
                                background: 'var(--highlight)',
                                opacity: 0.6,
                                transition: 'width 0.3s ease, opacity 0.3s ease',
                            }} />
                        </div>
                    ))}
                </div>

                {/* Count */}
                <div style={{
                    marginTop: '3rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1rem',
                }}>
                    <div style={{ width: '40px', height: '1px', background: 'rgba(255,255,255,0.15)' }} />
                    <span style={{
                        fontSize: '0.7rem',
                        letterSpacing: '0.3em',
                        textTransform: 'uppercase',
                        color: 'rgba(255,255,255,0.25)',
                    }}>
                        {technologies.length} Technologies
                    </span>
                </div>
            </div>
        </section>
    );
}
