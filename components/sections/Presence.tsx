'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { ExternalLink } from 'lucide-react';

/* ─── Default platforms ───────────────────────────────────────────────────── */
const defaultPlatforms = [
    { name: 'Instagram',     platformId: 'instagram', color: '#E4405F', tagline: 'Visual Influence',       url: '#' },
    { name: 'Behance',       platformId: 'behance',   color: '#0057FF', tagline: 'Creative Portfolio',     url: '#' },
    { name: 'Dribbble',      platformId: 'dribbble',  color: '#EA4C89', tagline: 'Design Inspiration',     url: '#' },
    { name: 'TikTok',        platformId: 'tiktok',    color: '#EE1D52', tagline: 'Trend-Driven Motion',    url: '#' },
    { name: 'YouTube',       platformId: 'youtube',   color: '#FF0000', tagline: 'Moving Stories',         url: '#' },
    { name: 'LinkedIn',      platformId: 'linkedin',  color: '#0A66C2', tagline: 'Executive Networking',   url: '#' },
    { name: 'GitHub',        platformId: 'github',    color: '#ffffff', tagline: 'Code Mastery',           url: '#' },
    { name: 'Facebook',      platformId: 'facebook',  color: '#1877F2', tagline: 'Social Ecosystem',       url: '#' },
    { name: 'X',             platformId: 'x',         color: '#ffffff', tagline: 'Real-time Authority',    url: '#' },
    { name: 'Telegram',      platformId: 'telegram',  color: '#26A5E4', tagline: 'Encrypted Networks',     url: '#' },
    { name: 'WhatsApp',      platformId: 'whatsapp',  color: '#25D366', tagline: 'Instant Communication',  url: '#' },
    { name: 'Fiverr',        platformId: 'fiverr',    color: '#1DBF73', tagline: 'Global Freelancing',     url: '#' },
    { name: 'Upwork',        platformId: 'upwork',    color: '#14A800', tagline: 'Enterprise Solutions',   url: '#' },
    { name: 'PeoplePerHour', platformId: 'pph',       color: '#FF7D00', tagline: 'Hourly Innovation',      url: '#' },
];

interface PresenceProps {
    data?: { name: string; platformId: string; url: string; color?: string; tagline?: string }[];
    bg?: { imageUrl?: string | null; imagePosition?: string; overlayOpacity?: number };
}

export default function Presence({ data, bg }: PresenceProps) {
    const platforms = (data && data.length > 0)
        ? data.map(p => ({ ...p, color: p.color || '#ffffff', tagline: p.tagline || 'Digital Presence' }))
        : defaultPlatforms;

    const [active, setActive] = useState(0);
    const stripRef = useRef<HTMLDivElement>(null);
    const isDragging = useRef(false);
    const dragStartX = useRef(0);
    const dragStartScroll = useRef(0);

    const current = platforms[active];

    // Arrow navigation
    const prev = useCallback(() => setActive(i => (i - 1 + platforms.length) % platforms.length), [platforms.length]);
    const next = useCallback(() => setActive(i => (i + 1) % platforms.length), [platforms.length]);

    // Keyboard navigation
    useEffect(() => {
        const handler = (e: KeyboardEvent) => {
            if (e.key === 'ArrowLeft') prev();
            if (e.key === 'ArrowRight') next();
        };
        window.addEventListener('keydown', handler);
        return () => window.removeEventListener('keydown', handler);
    }, [prev, next]);

    // Scroll active card into view when active changes
    useEffect(() => {
        const strip = stripRef.current;
        if (!strip) return;
        const card = strip.children[active] as HTMLElement;
        if (!card) return;
        const stripCenter = strip.offsetWidth / 2;
        const cardCenter = card.offsetLeft + card.offsetWidth / 2;
        strip.scrollTo({ left: cardCenter - stripCenter, behavior: 'smooth' });
    }, [active]);

    // Mouse drag to scroll
    const onMouseDown = (e: React.MouseEvent) => {
        isDragging.current = true;
        dragStartX.current = e.clientX;
        dragStartScroll.current = stripRef.current?.scrollLeft ?? 0;
    };
    const onMouseMove = (e: React.MouseEvent) => {
        if (!isDragging.current || !stripRef.current) return;
        const dx = e.clientX - dragStartX.current;
        stripRef.current.scrollLeft = dragStartScroll.current - dx;
    };
    const onMouseUp = () => { isDragging.current = false; };

    return (
        <section
            id="presence"
            style={{
                minHeight: '100vh', background: 'black',
                position: 'relative', overflow: 'hidden', zIndex: 5,
                display: 'flex', flexDirection: 'column',
            }}
        >
            {/* Background */}
            {bg?.imageUrl && (
                <div style={{
                    position: 'absolute', inset: -150,
                    backgroundImage: `url("${bg.imageUrl}")`,
                    backgroundSize: 'cover', backgroundPosition: bg.imagePosition || 'center',
                    opacity: 0.08, zIndex: 0, pointerEvents: 'none',
                    filter: 'grayscale(1) brightness(0.5)',
                }} />
            )}
            <div style={{
                position: 'absolute', inset: 0,
                background: `rgba(0,0,0,${bg?.overlayOpacity ?? 0.95})`,
                zIndex: 0, pointerEvents: 'none',
            }} />

            {/* Content */}
            <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', flex: 1, padding: '10vh 0 8vh' }}>

                {/* ── Header ── */}
                <div style={{ textAlign: 'center', marginBottom: 'clamp(3rem, 7vh, 5rem)', padding: '0 var(--gutter)' }}>
                    <span style={{
                        fontSize: 'clamp(0.6rem, 1vw, 0.7rem)', letterSpacing: '0.6em',
                        color: 'var(--highlight)', textTransform: 'uppercase',
                        display: 'block', marginBottom: '1rem', opacity: 0.85,
                    }}>
                        Global Ecosystem
                    </span>
                    <h2 style={{
                        fontSize: 'clamp(2.5rem, 8vw, 7rem)', fontWeight: 100,
                        textTransform: 'uppercase', lineHeight: 0.9,
                        letterSpacing: '-0.04em', margin: 0, color: '#fff',
                    }}>
                        Available<br />
                        <span style={{ fontWeight: 800 }}>Everywhere</span>
                    </h2>
                </div>

                {/* ── Featured selected platform ── */}
                <div style={{
                    textAlign: 'center', marginBottom: 'clamp(2.5rem, 6vh, 4rem)',
                    padding: '0 var(--gutter)', minHeight: 'clamp(8rem, 16vh, 12rem)',
                    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                    transition: 'all 0.4s ease',
                }}>
                        <h3 style={{
                        fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: 700,
                        color: '#fff', margin: '0 0 0.5rem',
                        textTransform: 'uppercase', letterSpacing: '0.04em',
                        transition: 'all 0.3s ease',
                    }}>
                        {current.name}
                    </h3>

                    <p style={{
                        fontSize: 'clamp(0.65rem, 1.1vw, 0.8rem)', letterSpacing: '0.35em',
                        textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', margin: '0 0 1.5rem',
                    }}>
                        {current.tagline}
                    </p>

                    <a
                        href={current.url !== '#' ? current.url : undefined}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                            display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
                            padding: '0.7rem 1.8rem',
                            border: `1px solid ${current.color}55`,
                            borderRadius: '3rem', color: current.color,
                            fontSize: '0.65rem', letterSpacing: '0.2em', textTransform: 'uppercase',
                            textDecoration: 'none', background: `${current.color}10`,
                            transition: 'all 0.3s ease',
                            cursor: current.url && current.url !== '#' ? 'pointer' : 'default',
                            opacity: current.url && current.url !== '#' ? 1 : 0.4,
                        }}
                        onClick={e => { if (!current.url || current.url === '#') e.preventDefault(); }}
                    >
                        <ExternalLink size={12} />
                        Visit {current.name}
                    </a>
                </div>

                {/* ── Scrollable strip ── */}
                <div style={{ position: 'relative' }}>
                    {/* Left arrow */}
                    <button
                        onClick={prev}
                        style={{
                            position: 'absolute', left: 'clamp(0.5rem, 2vw, 2rem)',
                            top: '50%', transform: 'translateY(-50%)',
                            zIndex: 10, background: 'rgba(255,255,255,0.05)',
                            border: '1px solid rgba(255,255,255,0.1)', borderRadius: '50%',
                            width: 40, height: 40, cursor: 'pointer', color: '#fff',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: '1rem', transition: 'all 0.2s',
                        }}
                        onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.12)'; }}
                        onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; }}
                    >
                        ‹
                    </button>

                    {/* Right arrow */}
                    <button
                        onClick={next}
                        style={{
                            position: 'absolute', right: 'clamp(0.5rem, 2vw, 2rem)',
                            top: '50%', transform: 'translateY(-50%)',
                            zIndex: 10, background: 'rgba(255,255,255,0.05)',
                            border: '1px solid rgba(255,255,255,0.1)', borderRadius: '50%',
                            width: 40, height: 40, cursor: 'pointer', color: '#fff',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: '1rem', transition: 'all 0.2s',
                        }}
                        onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.12)'; }}
                        onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; }}
                    >
                        ›
                    </button>

                    {/* Gradient fade edges */}
                    <div style={{
                        position: 'absolute', left: 0, top: 0, bottom: 0, width: '10vw',
                        background: 'linear-gradient(to right, black, transparent)',
                        zIndex: 5, pointerEvents: 'none',
                    }} />
                    <div style={{
                        position: 'absolute', right: 0, top: 0, bottom: 0, width: '10vw',
                        background: 'linear-gradient(to left, black, transparent)',
                        zIndex: 5, pointerEvents: 'none',
                    }} />

                    {/* The scrollable strip */}
                    <div
                        ref={stripRef}
                        onMouseDown={onMouseDown}
                        onMouseMove={onMouseMove}
                        onMouseUp={onMouseUp}
                        onMouseLeave={onMouseUp}
                        style={{
                            display: 'flex', flexDirection: 'row',
                            alignItems: 'center', gap: 'clamp(1rem, 2.5vw, 2rem)',
                            overflowX: 'auto', padding: '1.5rem 15vw',
                            scrollbarWidth: 'none', cursor: 'grab',
                            userSelect: 'none',
                        }}
                    >
                        {platforms.map((platform, i) => {
                            const dist = Math.abs(i - active);
                            const isActive = i === active;
                            const scale = isActive ? 1 : dist === 1 ? 0.72 : dist === 2 ? 0.58 : 0.48;
                            const opacity = isActive ? 1 : dist === 1 ? 0.45 : dist === 2 ? 0.25 : 0.12;

                            return (
                                <div
                                    key={i}
                                    onClick={() => setActive(i)}
                                    style={{
                                        flexShrink: 0,
                                        display: 'flex', flexDirection: 'column',
                                        alignItems: 'center', justifyContent: 'center',
                                        gap: '0.6rem',
                                        padding: isActive ? '1.5rem 2rem' : '1rem 1.25rem',
                                        border: `1px solid ${isActive ? `${platform.color}35` : 'rgba(255,255,255,0.06)'}`,
                                        borderRadius: '1.25rem',
                                        background: isActive ? `${platform.color}0d` : 'rgba(255,255,255,0.02)',
                                        cursor: 'pointer',
                                        transform: `scale(${scale})`,
                                        opacity,
                                        transition: 'all 0.45s cubic-bezier(0.25, 0, 0, 1)',
                                        minWidth: isActive ? '9rem' : '6rem',
                                    }}
                                >
                                    <span style={{
                                        fontSize: isActive ? '0.75rem' : '0.6rem',
                                        fontWeight: isActive ? 700 : 400,
                                        color: '#fff', letterSpacing: '0.08em',
                                        textTransform: 'uppercase', textAlign: 'center',
                                        whiteSpace: 'nowrap', transition: 'all 0.3s',
                                    }}>
                                        {platform.name}
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* ── Position indicator dots ── */}
                <div style={{
                    display: 'flex', justifyContent: 'center', gap: '0.4rem',
                    marginTop: '2rem',
                }}>
                    {platforms.map((_, i) => (
                        <div
                            key={i}
                            onClick={() => setActive(i)}
                            style={{
                                width: i === active ? 20 : 5,
                                height: 5, borderRadius: '3px',
                                background: i === active ? current.color : 'rgba(255,255,255,0.18)',
                                cursor: 'pointer',
                                transition: 'all 0.35s ease',
                            }}
                        />
                    ))}
                </div>

                {/* ── Navigation hint ── */}
                <p style={{
                    textAlign: 'center', marginTop: '1.5rem',
                    fontSize: '0.6rem', letterSpacing: '0.3em',
                    textTransform: 'uppercase', color: 'rgba(255,255,255,0.2)',
                }}>
                    ← scroll or click to explore →
                </p>
            </div>

            {/* hide scrollbar */}
            <style>{`
                div::-webkit-scrollbar { display: none; }
            `}</style>
        </section>
    );
}


