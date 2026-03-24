'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { ExternalLink } from 'lucide-react';
import {
    SiInstagram, SiBehance, SiDribbble, SiTiktok, SiYoutube,
    SiLinkedin, SiGithub, SiFacebook, SiX, SiTelegram,
    SiWhatsapp, SiFiverr, SiUpwork
} from 'react-icons/si';
import { MdAccessTime } from 'react-icons/md'; // placeholder for PPH

/* ─── Platform registry ───────────────────────────────────────────────────── */
const PLATFORMS = [
    { name: 'Instagram',     platformId: 'instagram', color: '#E4405F', tagline: 'Visual Influence',       url: '#', Icon: SiInstagram },
    { name: 'Behance',       platformId: 'behance',   color: '#1769FF', tagline: 'Creative Portfolio',     url: '#', Icon: SiBehance },
    { name: 'Dribbble',      platformId: 'dribbble',  color: '#EA4C89', tagline: 'Design Inspiration',     url: '#', Icon: SiDribbble },
    { name: 'TikTok',        platformId: 'tiktok',    color: '#ffffff', tagline: 'Trend-Driven Motion',    url: '#', Icon: SiTiktok },
    { name: 'YouTube',       platformId: 'youtube',   color: '#FF0000', tagline: 'Moving Stories',         url: '#', Icon: SiYoutube },
    { name: 'LinkedIn',      platformId: 'linkedin',  color: '#0A66C2', tagline: 'Executive Networking',   url: '#', Icon: SiLinkedin },
    { name: 'GitHub',        platformId: 'github',    color: '#ffffff', tagline: 'Code Mastery',           url: '#', Icon: SiGithub },
    { name: 'Facebook',      platformId: 'facebook',  color: '#1877F2', tagline: 'Social Ecosystem',       url: '#', Icon: SiFacebook },
    { name: 'X',             platformId: 'x',         color: '#ffffff', tagline: 'Real-time Authority',    url: '#', Icon: SiX },
    { name: 'Telegram',      platformId: 'telegram',  color: '#26A5E4', tagline: 'Encrypted Networks',     url: '#', Icon: SiTelegram },
    { name: 'WhatsApp',      platformId: 'whatsapp',  color: '#25D366', tagline: 'Instant Communication',  url: '#', Icon: SiWhatsapp },
    { name: 'Fiverr',        platformId: 'fiverr',    color: '#1DBF73', tagline: 'Global Freelancing',     url: '#', Icon: SiFiverr },
    { name: 'Upwork',        platformId: 'upwork',    color: '#6FDA44', tagline: 'Enterprise Solutions',   url: '#', Icon: SiUpwork },
    { name: 'PeoplePerHour', platformId: 'pph',       color: '#FF7D00', tagline: 'Hourly Innovation',      url: '#', Icon: MdAccessTime },
];

interface PresenceProps {
    data?: { name: string; platformId: string; url: string; color?: string; tagline?: string }[];
    bg?: { imageUrl?: string | null; imagePosition?: string; overlayOpacity?: number };
}

export default function Presence({ data, bg }: PresenceProps) {
    // Merge DB URLs into the canonical platform list
    const platforms = PLATFORMS.map(p => {
        const dbEntry = data?.find(d => d.platformId?.toLowerCase() === p.platformId);
        return {
            ...p,
            url: dbEntry?.url || p.url,
            tagline: dbEntry?.tagline || p.tagline,
            color: dbEntry?.color || p.color,
        };
    });

    const [active, setActive] = useState(0);
    const stripRef = useRef<HTMLDivElement>(null);
    const isDragging = useRef(false);
    const dragStartX = useRef(0);
    const dragStartScroll = useRef(0);

    const current = platforms[active];

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

    // Scroll active card into center of strip
    useEffect(() => {
        const strip = stripRef.current;
        if (!strip) return;
        const card = strip.children[active] as HTMLElement;
        if (!card) return;
        const centerOffset = card.offsetLeft + card.offsetWidth / 2 - strip.offsetWidth / 2;
        strip.scrollTo({ left: centerOffset, behavior: 'smooth' });
    }, [active]);

    // Drag to scroll
    const onMouseDown = (e: React.MouseEvent) => {
        isDragging.current = true;
        dragStartX.current = e.clientX;
        dragStartScroll.current = stripRef.current?.scrollLeft ?? 0;
    };
    const onMouseMove = (e: React.MouseEvent) => {
        if (!isDragging.current || !stripRef.current) return;
        stripRef.current.scrollLeft = dragStartScroll.current - (e.clientX - dragStartX.current);
    };
    const onMouseUp = () => { isDragging.current = false; };

    const ActiveIcon = current.Icon;

    return (
        <section
            id="presence"
            style={{
                minHeight: '100vh', background: 'black',
                position: 'relative', overflow: 'hidden', zIndex: 5,
                display: 'flex', flexDirection: 'column',
            }}
        >
            {bg?.imageUrl && (
                <div style={{
                    position: 'absolute', inset: -150,
                    backgroundImage: `url("${bg.imageUrl}")`,
                    backgroundSize: 'cover', backgroundPosition: bg.imagePosition || 'center',
                    opacity: 0.08, zIndex: 0, pointerEvents: 'none', filter: 'grayscale(1) brightness(0.5)',
                }} />
            )}
            <div style={{
                position: 'absolute', inset: 0,
                background: `rgba(0,0,0,${bg?.overlayOpacity ?? 0.95})`,
                zIndex: 0, pointerEvents: 'none',
            }} />

            <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', flex: 1, padding: '10vh 0 8vh' }}>

                {/* ── Header ── */}
                <div style={{ textAlign: 'center', marginBottom: 'clamp(2.5rem, 6vh, 4rem)', padding: '0 var(--gutter)' }}>
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

                {/* ── Featured platform ── */}
                <div style={{
                    textAlign: 'center', padding: '0 var(--gutter)',
                    minHeight: 'clamp(10rem, 20vh, 15rem)',
                    display: 'flex', flexDirection: 'column',
                    alignItems: 'center', justifyContent: 'center',
                    marginBottom: 'clamp(2rem, 5vh, 3.5rem)',
                }}>
                    <div style={{
                        color: current.color,
                        filter: `drop-shadow(0 0 48px ${current.color}60)`,
                        marginBottom: '1.25rem',
                        transition: 'color 0.35s ease, filter 0.35s ease',
                        lineHeight: 1,
                    }}>
                        <ActiveIcon size={80} />
                    </div>

                    <h3 style={{
                        fontSize: 'clamp(1.8rem, 5vw, 3.5rem)', fontWeight: 700,
                        color: '#fff', margin: '0 0 0.4rem',
                        textTransform: 'uppercase', letterSpacing: '0.04em',
                        transition: 'all 0.3s ease',
                    }}>
                        {current.name}
                    </h3>

                    <p style={{
                        fontSize: 'clamp(0.6rem, 1vw, 0.75rem)', letterSpacing: '0.35em',
                        textTransform: 'uppercase', color: 'rgba(255,255,255,0.38)',
                        margin: '0 0 1.5rem', transition: 'all 0.3s ease',
                    }}>
                        {current.tagline}
                    </p>

                    <a
                        href={current.url !== '#' ? current.url : undefined}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={e => { if (!current.url || current.url === '#') e.preventDefault(); }}
                        style={{
                            display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
                            padding: '0.65rem 1.75rem',
                            border: `1px solid ${current.color}50`,
                            borderRadius: '3rem', color: current.color,
                            fontSize: '0.62rem', fontWeight: 600,
                            letterSpacing: '0.2em', textTransform: 'uppercase',
                            textDecoration: 'none', background: `${current.color}10`,
                            transition: 'all 0.3s ease',
                            opacity: current.url && current.url !== '#' ? 1 : 0.45,
                            cursor: current.url && current.url !== '#' ? 'pointer' : 'default',
                        }}
                    >
                        <ExternalLink size={11} />
                        Visit {current.name}
                    </a>
                </div>

                {/* ── Scrollable strip ── */}
                <div style={{ position: 'relative' }}>
                    {/* Left / Right arrows */}
                    {(['left', 'right'] as const).map(side => (
                        <button
                            key={side}
                            onClick={side === 'left' ? prev : next}
                            style={{
                                position: 'absolute', [side]: 'clamp(0.5rem, 2vw, 1.5rem)',
                                top: '50%', transform: 'translateY(-50%)',
                                zIndex: 10, background: 'rgba(255,255,255,0.05)',
                                border: '1px solid rgba(255,255,255,0.1)', borderRadius: '50%',
                                width: 38, height: 38, cursor: 'pointer', color: '#fff',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                fontSize: '1.1rem', transition: 'all 0.2s',
                            }}
                            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.12)'; }}
                            onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; }}
                        >
                            {side === 'left' ? '‹' : '›'}
                        </button>
                    ))}

                    {/* Gradient fade edges */}
                    <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: '12vw', background: 'linear-gradient(to right, black, transparent)', zIndex: 5, pointerEvents: 'none' }} />
                    <div style={{ position: 'absolute', right: 0, top: 0, bottom: 0, width: '12vw', background: 'linear-gradient(to left, black, transparent)', zIndex: 5, pointerEvents: 'none' }} />

                    {/* Cards strip */}
                    <div
                        ref={stripRef}
                        onMouseDown={onMouseDown}
                        onMouseMove={onMouseMove}
                        onMouseUp={onMouseUp}
                        onMouseLeave={onMouseUp}
                        style={{
                            display: 'flex', alignItems: 'center',
                            gap: 'clamp(0.75rem, 2vw, 1.5rem)',
                            overflowX: 'auto', padding: '1rem 15vw',
                            scrollbarWidth: 'none', cursor: 'grab', userSelect: 'none',
                        }}
                    >
                        {platforms.map((platform, i) => {
                            const dist = Math.abs(i - active);
                            const isActive = i === active;
                            const scale = isActive ? 1 : dist === 1 ? 0.72 : dist === 2 ? 0.58 : 0.46;
                            const opacity = isActive ? 1 : dist === 1 ? 0.45 : dist === 2 ? 0.22 : 0.1;
                            const PIcon = platform.Icon;

                            return (
                                <div
                                    key={i}
                                    onClick={() => setActive(i)}
                                    style={{
                                        flexShrink: 0,
                                        display: 'flex', flexDirection: 'column',
                                        alignItems: 'center', justifyContent: 'center', gap: '0.55rem',
                                        padding: isActive ? '1.4rem 1.8rem' : '0.9rem 1.2rem',
                                        border: `1px solid ${isActive ? `${platform.color}40` : 'rgba(255,255,255,0.06)'}`,
                                        borderRadius: '1.1rem',
                                        background: isActive ? `${platform.color}12` : 'rgba(255,255,255,0.02)',
                                        cursor: 'pointer',
                                        transform: `scale(${scale})`,
                                        opacity,
                                        transition: 'all 0.4s cubic-bezier(0.25, 0, 0, 1)',
                                        minWidth: isActive ? '8rem' : '5.5rem',
                                        boxShadow: isActive ? `0 0 30px ${platform.color}20` : 'none',
                                    }}
                                >
                                    <div style={{ color: platform.color, lineHeight: 1, transition: 'color 0.3s' }}>
                                        <PIcon size={isActive ? 34 : 26} />
                                    </div>
                                    <span style={{
                                        fontSize: isActive ? '0.7rem' : '0.58rem',
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

                {/* ── Dot indicators ── */}
                <div style={{ display: 'flex', justifyContent: 'center', gap: '0.4rem', marginTop: '1.75rem' }}>
                    {platforms.map((p, i) => (
                        <div
                            key={i}
                            onClick={() => setActive(i)}
                            style={{
                                width: i === active ? 22 : 5, height: 5, borderRadius: '3px',
                                background: i === active ? current.color : 'rgba(255,255,255,0.15)',
                                cursor: 'pointer', transition: 'all 0.35s ease',
                            }}
                        />
                    ))}
                </div>

                <p style={{
                    textAlign: 'center', marginTop: '1.25rem',
                    fontSize: '0.58rem', letterSpacing: '0.3em',
                    textTransform: 'uppercase', color: 'rgba(255,255,255,0.18)',
                }}>
                    ← scroll or use arrow keys →
                </p>
            </div>

            <style>{`div::-webkit-scrollbar{display:none;}`}</style>
        </section>
    );
}
