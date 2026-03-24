'use client';

import { useEffect, useRef, useMemo, useCallback } from 'react';

const defaultTech = [
    { name: 'JavaScript',   type: 'Language' },
    { name: 'TypeScript',   type: 'Language' },
    { name: 'React',        type: 'Framework' },
    { name: 'Next.js',      type: 'Framework' },
    { name: 'GSAP',         type: 'Motion' },
    { name: 'Three.js',     type: '3D / WebGL' },
    { name: 'Tailwind CSS', type: 'CSS' },
    { name: 'Figma',        type: 'Design' },
    { name: 'Photoshop',    type: 'Design' },
    { name: 'After Effects',type: 'Motion' },
    { name: 'Illustrator',  type: 'Vector' },
    { name: 'Node.js',      type: 'Backend' },
    { name: 'PostgreSQL',   type: 'Database' },
    { name: 'Drizzle ORM',  type: 'Database' },
];

interface TechnicalProps {
    data?: { name: string; type: string }[];
    bg?: { imageUrl: string | null; imagePosition: string; overlayOpacity: number };
}

export default function Technical({ data, bg }: TechnicalProps) {
    const sectionRef  = useRef<HTMLDivElement>(null);
    const stripRef    = useRef<HTMLDivElement>(null);
    const isDragging  = useRef(false);
    const dragStartX  = useRef(0);
    const dragScroll  = useRef(0);

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

    // Scroll left / right
    const scrollBy = useCallback((dir: 'left' | 'right') => {
        const strip = stripRef.current;
        if (!strip) return;
        strip.scrollBy({ left: dir === 'right' ? 360 : -360, behavior: 'smooth' });
    }, []);

    // Drag scroll
    const onMouseDown = (e: React.MouseEvent) => {
        isDragging.current = true;
        dragStartX.current = e.clientX;
        dragScroll.current = stripRef.current?.scrollLeft ?? 0;
        if (stripRef.current) stripRef.current.style.cursor = 'grabbing';
    };
    const onMouseMove = (e: React.MouseEvent) => {
        if (!isDragging.current || !stripRef.current) return;
        stripRef.current.scrollLeft = dragScroll.current - (e.clientX - dragStartX.current);
    };
    const onMouseUp = () => {
        isDragging.current = false;
        if (stripRef.current) stripRef.current.style.cursor = 'grab';
    };

    // Touch support
    const touchStartX = useRef(0);
    const touchScroll = useRef(0);
    const onTouchStart = (e: React.TouchEvent) => {
        touchStartX.current = e.touches[0].clientX;
        touchScroll.current = stripRef.current?.scrollLeft ?? 0;
    };
    const onTouchMove = (e: React.TouchEvent) => {
        if (!stripRef.current) return;
        stripRef.current.scrollLeft = touchScroll.current - (e.touches[0].clientX - touchStartX.current);
    };

    // Animate cards in when strip enters viewport
    useEffect(() => {
        const strip = stripRef.current;
        if (!strip) return;
        const cards = Array.from(strip.querySelectorAll<HTMLDivElement>('.tech-card'));

        cards.forEach(c => {
            c.style.opacity = '0';
            c.style.transform = 'translateY(30px)';
            c.style.transition = 'none';
        });

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    cards.forEach((c, i) => {
                        setTimeout(() => {
                            c.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
                            c.style.opacity = '1';
                            c.style.transform = 'translateY(0)';
                        }, i * 55);
                    });
                    observer.disconnect();
                }
            },
            { threshold: 0.1 }
        );
        observer.observe(strip);
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
                padding: 'clamp(6rem, 15vh, 11rem) 0',
                minHeight: '100vh',
                zIndex: 1,
                overflow: 'hidden',
            }}
        >
            {/* Background */}
            {bg?.imageUrl && (
                <div style={{
                    position: 'absolute', inset: 0,
                    backgroundImage: `url("${bg.imageUrl}")`,
                    backgroundSize: 'cover',
                    backgroundPosition: bg.imagePosition || 'center',
                    opacity: 0.07, zIndex: 0, pointerEvents: 'none',
                }} />
            )}
            <div style={{
                position: 'absolute', inset: 0,
                background: `rgba(0,0,0,${overlayOpacity})`,
                zIndex: 0, pointerEvents: 'none',
            }} />

            <div style={{ position: 'relative', zIndex: 1 }}>

                {/* ── Header + arrows ── */}
                <div style={{
                    display: 'flex', alignItems: 'flex-end',
                    justifyContent: 'space-between', flexWrap: 'wrap',
                    gap: '1.5rem', marginBottom: 'clamp(2.5rem, 6vh, 4rem)',
                    padding: '0 clamp(2rem, 6vw, 6rem)',
                }}>
                    <div>
                        <span style={{
                            color: 'var(--highlight)',
                            fontSize: 'clamp(0.6rem, 1vw, 0.75rem)',
                            letterSpacing: '0.6em', textTransform: 'uppercase',
                            display: 'block', marginBottom: '1.2rem', opacity: 0.8,
                        }}>
                            Expertise &amp; Tools
                        </span>
                        <h2 style={{
                            fontSize: 'clamp(2.5rem, 7vw, 5.5rem)', fontWeight: 200,
                            textTransform: 'uppercase', lineHeight: 0.95,
                            letterSpacing: '-0.03em', margin: 0,
                        }}>
                            Technical<br />
                            <span style={{ fontWeight: 700, color: 'var(--accent-white)' }}>Mastery</span>
                        </h2>
                    </div>

                    {/* Arrow buttons */}
                    <div style={{ display: 'flex', gap: '0.6rem', alignItems: 'center' }}>
                        <button
                            onClick={() => scrollBy('left')}
                            style={{
                                width: 44, height: 44, borderRadius: '50%',
                                background: 'rgba(255,255,255,0.05)',
                                border: '1px solid rgba(255,255,255,0.1)',
                                color: '#fff', cursor: 'pointer', fontSize: '1.1rem',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                transition: 'all 0.2s',
                            }}
                            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.12)'; }}
                            onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; }}
                            aria-label="Scroll left"
                        >
                            ‹
                        </button>
                        <button
                            onClick={() => scrollBy('right')}
                            style={{
                                width: 44, height: 44, borderRadius: '50%',
                                background: 'rgba(255,255,255,0.05)',
                                border: '1px solid rgba(255,255,255,0.1)',
                                color: '#fff', cursor: 'pointer', fontSize: '1.1rem',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                transition: 'all 0.2s',
                            }}
                            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.12)'; }}
                            onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; }}
                            aria-label="Scroll right"
                        >
                            ›
                        </button>
                    </div>
                </div>

                {/* ── Scroll Strip ── */}
                <div style={{ position: 'relative' }}>
                    {/* Fade edges */}
                    <div style={{
                        position: 'absolute', left: 0, top: 0, bottom: 0, width: '8vw', zIndex: 5,
                        background: 'linear-gradient(to right, var(--deep-black), transparent)',
                        pointerEvents: 'none',
                    }} />
                    <div style={{
                        position: 'absolute', right: 0, top: 0, bottom: 0, width: '8vw', zIndex: 5,
                        background: 'linear-gradient(to left, var(--deep-black), transparent)',
                        pointerEvents: 'none',
                    }} />

                    <div
                        ref={stripRef}
                        onMouseDown={onMouseDown}
                        onMouseMove={onMouseMove}
                        onMouseUp={onMouseUp}
                        onMouseLeave={onMouseUp}
                        onTouchStart={onTouchStart}
                        onTouchMove={onTouchMove}
                        style={{
                            display: 'flex', flexDirection: 'row',
                            gap: '0', overflowX: 'auto',
                            padding: '0.5rem clamp(2rem, 6vw, 6rem)',
                            scrollbarWidth: 'none', cursor: 'grab',
                            userSelect: 'none',
                        }}
                    >
                        {technologies.map((tech, i) => (
                            <div
                                key={`${tech.name}-${i}`}
                                className="tech-card"
                                style={{
                                    flexShrink: 0,
                                    width: 'clamp(180px, 22vw, 260px)',
                                    padding: 'clamp(1.5rem, 3vw, 2rem)',
                                    borderRight: '1px solid rgba(255,255,255,0.07)',
                                    borderTop: '1px solid rgba(255,255,255,0.07)',
                                    borderBottom: '1px solid rgba(255,255,255,0.07)',
                                    position: 'relative',
                                    transition: 'background 0.3s ease',
                                    background: 'transparent',
                                }}
                                onMouseEnter={e => {
                                    e.currentTarget.style.background = 'rgba(255,255,255,0.03)';
                                }}
                                onMouseLeave={e => {
                                    e.currentTarget.style.background = 'transparent';
                                }}
                            >
                                {/* Index */}
                                <span style={{
                                    position: 'absolute', top: '1rem', right: '1rem',
                                    fontSize: '0.6rem', color: 'rgba(255,255,255,0.15)',
                                    letterSpacing: '0.1em',
                                }}>
                                    {String(i + 1).padStart(2, '0')}
                                </span>

                                {/* Type badge */}
                                <span style={{
                                    display: 'block',
                                    fontSize: '0.58rem', letterSpacing: '0.3em',
                                    textTransform: 'uppercase', color: 'var(--highlight)',
                                    marginBottom: '0.75rem', opacity: 0.9,
                                }}>
                                    {tech.type}
                                </span>

                                {/* Name */}
                                <h3 style={{
                                    fontSize: 'clamp(1rem, 2.5vw, 1.5rem)', fontWeight: 300,
                                    margin: 0, textTransform: 'uppercase',
                                    letterSpacing: '0.04em', lineHeight: 1.15, color: '#fff',
                                }}>
                                    {tech.name}
                                </h3>

                                {/* Red accent rule */}
                                <div style={{
                                    marginTop: '1.2rem', width: '28px', height: '1px',
                                    background: 'var(--highlight)', opacity: 0.5,
                                    transition: 'width 0.3s ease',
                                }} />
                            </div>
                        ))}

                        {/* Left border on first card */}
                        <style>{`
                            .tech-card:first-child { border-left: 1px solid rgba(255,255,255,0.07); }
                            div::-webkit-scrollbar { display: none; }
                        `}</style>
                    </div>
                </div>

                {/* ── Count + hint ── */}
                <div style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    flexWrap: 'wrap', gap: '1rem',
                    margin: 'clamp(1.5rem, 4vh, 2.5rem) clamp(2rem, 6vw, 6rem) 0',
                    paddingTop: '1.5rem',
                    borderTop: '1px solid rgba(255,255,255,0.05)',
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <div style={{ width: 32, height: '1px', background: 'rgba(255,255,255,0.15)' }} />
                        <span style={{
                            fontSize: '0.65rem', letterSpacing: '0.3em',
                            textTransform: 'uppercase', color: 'rgba(255,255,255,0.25)',
                        }}>
                            {technologies.length} Technologies
                        </span>
                    </div>
                    <span style={{
                        fontSize: '0.6rem', letterSpacing: '0.25em',
                        textTransform: 'uppercase', color: 'rgba(255,255,255,0.18)',
                    }}>
                        ← drag or use arrows to explore →
                    </span>
                </div>
            </div>
        </section>
    );
}
