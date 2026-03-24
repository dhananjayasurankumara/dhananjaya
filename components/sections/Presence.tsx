'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { ExternalLink } from 'lucide-react';

/* ─── Platform color & icon emoji map ───────────────────────────────────────── */
const PLATFORM_META: Record<string, { color: string; emoji: string; handle: string }> = {
    instagram:   { color: '#E4405F', emoji: '📸', handle: '@dhananjaya' },
    behance:     { color: '#0057FF', emoji: '🎨', handle: 'dhananjaya' },
    dribbble:    { color: '#EA4C89', emoji: '🏀', handle: '@dhananjaya' },
    tiktok:      { color: '#EE1D52', emoji: '🎵', handle: '@dhananjaya' },
    youtube:     { color: '#FF0000', emoji: '▶️', handle: '@dhananjaya' },
    linkedin:    { color: '#0A66C2', emoji: '💼', handle: 'dhananjaya' },
    github:      { color: '#e6edf3', emoji: '⚡', handle: '@dhananjaya' },
    facebook:    { color: '#1877F2', emoji: '👥', handle: 'dhananjaya' },
    x:           { color: '#e7e9ea', emoji: '𝕏', handle: '@dhananjaya' },
    twitter:     { color: '#e7e9ea', emoji: '𝕏', handle: '@dhananjaya' },
    telegram:    { color: '#26A5E4', emoji: '✈️', handle: '@dhananjaya' },
    whatsapp:    { color: '#25D366', emoji: '💬', handle: '+94 000 000 000' },
    fiverr:      { color: '#1DBF73', emoji: '⭐', handle: '@dhananjaya' },
    upwork:      { color: '#14A800', emoji: '💼', handle: 'dhananjaya' },
    pph:         { color: '#FF7D00', emoji: '⏱️', handle: 'dhananjaya' },
    peopleperhour:{ color: '#FF7D00', emoji: '⏱️', handle: 'dhananjaya' },
};

function getMeta(platformId: string) {
    return PLATFORM_META[platformId?.toLowerCase()] ?? { color: '#ffffff', emoji: '🌐', handle: '@dhananjaya' };
}

/* ─── Default platforms ──────────────────────────────────────────────────────── */
const defaultPlatforms = [
    { name: 'Instagram',     platformId: 'instagram', tagline: 'Visual Influence',       url: 'https://instagram.com' },
    { name: 'Behance',       platformId: 'behance',   tagline: 'Creative Portfolio',     url: 'https://behance.net' },
    { name: 'Dribbble',      platformId: 'dribbble',  tagline: 'Design Inspiration',     url: 'https://dribbble.com' },
    { name: 'TikTok',        platformId: 'tiktok',    tagline: 'Trend-Driven Motion',    url: 'https://tiktok.com' },
    { name: 'YouTube',       platformId: 'youtube',   tagline: 'Moving Stories',         url: 'https://youtube.com' },
    { name: 'LinkedIn',      platformId: 'linkedin',  tagline: 'Executive Networking',   url: 'https://linkedin.com' },
    { name: 'GitHub',        platformId: 'github',    tagline: 'Code Mastery',           url: 'https://github.com' },
    { name: 'Facebook',      platformId: 'facebook',  tagline: 'Social Ecosystem',       url: 'https://facebook.com' },
    { name: 'X',             platformId: 'x',         tagline: 'Real-time Authority',    url: 'https://x.com' },
    { name: 'Telegram',      platformId: 'telegram',  tagline: 'Encrypted Networks',     url: 'https://telegram.org' },
    { name: 'WhatsApp',      platformId: 'whatsapp',  tagline: 'Instant Communication',  url: 'https://whatsapp.com' },
    { name: 'Fiverr',        platformId: 'fiverr',    tagline: 'Global Freelancing',     url: 'https://fiverr.com' },
    { name: 'Upwork',        platformId: 'upwork',    tagline: 'Enterprise Solutions',   url: 'https://upwork.com' },
    { name: 'PeoplePerHour', platformId: 'pph',       tagline: 'Hourly Innovation',      url: 'https://peopleperhour.com' },
];

interface PresenceProps {
    data?: { name: string; platformId: string; url: string; color?: string; tagline?: string }[];
    bg?: { imageUrl?: string | null; imagePosition?: string; overlayOpacity?: number };
}

/* ─── Social card preview component ── */
function SocialCard({ platform, meta }: {
    platform: typeof defaultPlatforms[0];
    meta: { color: string; emoji: string; handle: string };
}) {
    return (
        <div style={{
            width: 'clamp(280px, 85vw, 360px)',
            borderRadius: '1.5rem',
            overflow: 'hidden',
            border: `1px solid ${meta.color}30`,
            background: '#0a0a0a',
            boxShadow: `0 20px 60px ${meta.color}20, 0 0 0 1px ${meta.color}15`,
            flexShrink: 0,
        }}>
            {/* Card header — colored banner */}
            <div style={{
                height: 80,
                background: `linear-gradient(135deg, ${meta.color}22 0%, ${meta.color}08 100%)`,
                borderBottom: `1px solid ${meta.color}20`,
                display: 'flex', alignItems: 'center',
                padding: '0 1.5rem', gap: '0.75rem',
                position: 'relative',
            }}>
                {/* Platform emoji icon */}
                <div style={{
                    width: 44, height: 44, borderRadius: '12px',
                    background: `${meta.color}20`,
                    border: `1.5px solid ${meta.color}50`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '1.4rem', flexShrink: 0,
                }}>
                    {meta.emoji}
                </div>
                <div>
                    <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#fff' }}>
                        {platform.name}
                    </div>
                    <div style={{ fontSize: '0.65rem', color: meta.color, letterSpacing: '0.05em' }}>
                        {meta.handle}
                    </div>
                </div>
                {/* Live badge */}
                <div style={{
                    position: 'absolute', top: '1rem', right: '1rem',
                    display: 'flex', alignItems: 'center', gap: '0.3rem',
                    fontSize: '0.5rem', letterSpacing: '0.2em', textTransform: 'uppercase',
                    color: meta.color, opacity: 0.7,
                }}>
                    <div style={{
                        width: 5, height: 5, borderRadius: '50%',
                        background: meta.color, boxShadow: `0 0 6px ${meta.color}`,
                    }} />
                    Active
                </div>
            </div>

            {/* Card body */}
            <div style={{ padding: '1.25rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                {/* Tagline */}
                <p style={{
                    fontSize: '0.78rem', color: 'rgba(255,255,255,0.55)',
                    lineHeight: 1.55, margin: 0,
                    fontStyle: 'italic',
                }}>
                    "{platform.tagline} — find me on {platform.name} for my latest work and updates."
                </p>

                {/* Stats row */}
                <div style={{ display: 'flex', gap: '1.5rem', paddingTop: '0.5rem', borderTop: `1px solid ${meta.color}12` }}>
                    {[['Follow', 'On Platform'], ['Connect', `/${platform.name.toLowerCase()}`], ['Works', 'Portfolio']].map(([label, val]) => (
                        <div key={label}>
                            <div style={{ fontSize: '0.58rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)', marginBottom: '0.2rem' }}>
                                {label}
                            </div>
                            <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.65)', fontWeight: 600 }}>
                                {val}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Visit button */}
                <a
                    href={platform.url !== '#' ? platform.url : undefined}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={e => { if (!platform.url || platform.url === '#') e.preventDefault(); }}
                    style={{
                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
                        padding: '0.75rem 1.25rem',
                        background: `${meta.color}15`,
                        border: `1px solid ${meta.color}40`,
                        borderRadius: '0.75rem',
                        color: meta.color,
                        fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase',
                        textDecoration: 'none',
                        transition: 'all 0.25s',
                        cursor: platform.url && platform.url !== '#' ? 'pointer' : 'default',
                        opacity: platform.url && platform.url !== '#' ? 1 : 0.45,
                    }}
                >
                    <ExternalLink size={11} />
                    Visit {platform.name}
                </a>
            </div>
        </div>
    );
}

export default function Presence({ data, bg }: PresenceProps) {
    const platforms = (data && data.length > 0) ? data : defaultPlatforms;
    const [active, setActive] = useState(0);
    const stripRef = useRef<HTMLDivElement>(null);

    const current = platforms[active];
    const currentMeta = getMeta(current.platformId);

    const prev = useCallback(() => setActive(i => (i - 1 + platforms.length) % platforms.length), [platforms.length]);
    const next = useCallback(() => setActive(i => (i + 1) % platforms.length), [platforms.length]);

    // Keyboard nav
    useEffect(() => {
        const handler = (e: KeyboardEvent) => {
            if (e.key === 'ArrowLeft') prev();
            if (e.key === 'ArrowRight') next();
        };
        window.addEventListener('keydown', handler);
        return () => window.removeEventListener('keydown', handler);
    }, [prev, next]);

    // Auto-scroll active card to center
    useEffect(() => {
        const strip = stripRef.current;
        if (!strip) return;
        // Use scroll-snap so the card snaps; also manually center via scrollTo
        const cards = Array.from(strip.children) as HTMLElement[];
        const card = cards[active];
        if (!card) return;
        const stripW = strip.offsetWidth;
        const cardL = card.offsetLeft;
        const cardW = card.offsetWidth;
        strip.scrollTo({ left: cardL - (stripW - cardW) / 2, behavior: 'smooth' });
    }, [active]);

    // Touch swipe
    const touchStart = useRef(0);
    const touchScroll = useRef(0);
    const onTouchStart = (e: React.TouchEvent) => {
        touchStart.current = e.touches[0].clientX;
        touchScroll.current = stripRef.current?.scrollLeft ?? 0;
    };
    const onTouchMove = (e: React.TouchEvent) => {
        if (!stripRef.current) return;
        const dx = touchStart.current - e.touches[0].clientX;
        stripRef.current.scrollLeft = touchScroll.current + dx;
    };
    // On touch end, snap to nearest card
    const onTouchEnd = () => {
        const strip = stripRef.current;
        if (!strip) return;
        const cards = Array.from(strip.children) as HTMLElement[];
        const stripCenter = strip.scrollLeft + strip.offsetWidth / 2;
        let closest = 0;
        let minDist = Infinity;
        cards.forEach((card, i) => {
            const cardCenter = card.offsetLeft + card.offsetWidth / 2;
            const dist = Math.abs(cardCenter - stripCenter);
            if (dist < minDist) { minDist = dist; closest = i; }
        });
        setActive(closest);
    };

    // Mouse drag
    const isDrag = useRef(false);
    const dragX = useRef(0);
    const dragSL = useRef(0);
    const onMouseDown = (e: React.MouseEvent) => { isDrag.current = true; dragX.current = e.clientX; dragSL.current = stripRef.current?.scrollLeft ?? 0; };
    const onMouseMove = (e: React.MouseEvent) => { if (!isDrag.current || !stripRef.current) return; stripRef.current.scrollLeft = dragSL.current - (e.clientX - dragX.current); };
    const onMouseUp = () => { isDrag.current = false; };

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
                    opacity: 0.07, zIndex: 0, pointerEvents: 'none',
                    filter: 'grayscale(1)',
                }} />
            )}
            <div style={{ position: 'absolute', inset: 0, background: `rgba(0,0,0,${bg?.overlayOpacity ?? 0.95})`, zIndex: 0, pointerEvents: 'none' }} />

            {/* Content */}
            <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', flex: 1, padding: 'clamp(4rem,10vh,8rem) 0 clamp(3rem,8vh,6rem)' }}>

                {/* ── Header ── */}
                <div style={{ textAlign: 'center', marginBottom: 'clamp(2rem, 5vh, 4rem)', padding: '0 var(--gutter)' }}>
                    <span style={{ fontSize: 'clamp(0.55rem, 1vw, 0.7rem)', letterSpacing: '0.6em', color: 'var(--highlight)', textTransform: 'uppercase', display: 'block', marginBottom: '1rem', opacity: 0.85 }}>
                        Global Ecosystem
                    </span>
                    <h2 style={{ fontSize: 'clamp(2.2rem, 8vw, 7rem)', fontWeight: 100, textTransform: 'uppercase', lineHeight: 0.9, letterSpacing: '-0.04em', margin: 0, color: '#fff' }}>
                        Available<br />
                        <span style={{ fontWeight: 800 }}>Everywhere</span>
                    </h2>
                </div>

                {/* ── Social Card Preview ── */}
                <div style={{
                    display: 'flex', justifyContent: 'center',
                    padding: '0 var(--gutter)',
                    marginBottom: 'clamp(2rem, 5vh, 3.5rem)',
                    transition: 'all 0.4s ease',
                }}>
                    <SocialCard platform={current as any} meta={currentMeta} />
                </div>

                {/* ── Arrow nav + strip row ── */}
                <div style={{ position: 'relative' }}>
                    {/* Arrows */}
                    {['left', 'right'].map(dir => (
                        <button
                            key={dir}
                            onClick={dir === 'left' ? prev : next}
                            aria-label={dir === 'left' ? 'Previous platform' : 'Next platform'}
                            style={{
                                position: 'absolute',
                                [dir]: 'clamp(0.25rem, 2vw, 1.5rem)',
                                top: '50%', transform: 'translateY(-50%)',
                                zIndex: 10, background: 'rgba(255,255,255,0.05)',
                                border: '1px solid rgba(255,255,255,0.1)', borderRadius: '50%',
                                width: 'clamp(32px, 5vw, 40px)', height: 'clamp(32px, 5vw, 40px)',
                                cursor: 'pointer', color: '#fff', fontSize: '1.1rem',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                transition: 'all 0.2s',
                            }}
                        >
                            {dir === 'left' ? '‹' : '›'}
                        </button>
                    ))}

                    {/* Fade edges */}
                    <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: '8vw', background: 'linear-gradient(to right, black, transparent)', zIndex: 5, pointerEvents: 'none' }} />
                    <div style={{ position: 'absolute', right: 0, top: 0, bottom: 0, width: '8vw', background: 'linear-gradient(to left, black, transparent)', zIndex: 5, pointerEvents: 'none' }} />

                    {/* Scrollable strip */}
                    <div
                        ref={stripRef}
                        onMouseDown={onMouseDown}
                        onMouseMove={onMouseMove}
                        onMouseUp={onMouseUp}
                        onMouseLeave={onMouseUp}
                        onTouchStart={onTouchStart}
                        onTouchMove={onTouchMove}
                        onTouchEnd={onTouchEnd}
                        style={{
                            display: 'flex', flexDirection: 'row',
                            alignItems: 'center', gap: 'clamp(0.6rem, 2vw, 1.5rem)',
                            overflowX: 'auto', padding: '1rem 12vw',
                            scrollbarWidth: 'none', cursor: 'grab',
                            userSelect: 'none',
                        }}
                    >
                        {platforms.map((platform, i) => {
                            const dist = Math.abs(i - active);
                            const isActive = i === active;
                            const scale = isActive ? 1 : dist === 1 ? 0.75 : dist === 2 ? 0.6 : 0.5;
                            const opacity = isActive ? 1 : dist === 1 ? 0.5 : dist === 2 ? 0.28 : 0.14;
                            const meta = getMeta(platform.platformId);

                            return (
                                <div
                                    key={i}
                                    onClick={() => setActive(i)}
                                    style={{
                                        flexShrink: 0,
                                        display: 'flex', flexDirection: 'column',
                                        alignItems: 'center', justifyContent: 'center',
                                        gap: '0.5rem',
                                        padding: isActive ? '1.25rem 1.75rem' : '0.85rem 1.1rem',
                                        border: `1px solid ${isActive ? `${meta.color}40` : 'rgba(255,255,255,0.06)'}`,
                                        borderRadius: '1.1rem',
                                        background: isActive ? `${meta.color}10` : 'rgba(255,255,255,0.02)',
                                        cursor: 'pointer',
                                        transform: `scale(${scale})`,
                                        opacity,
                                        transition: 'all 0.45s cubic-bezier(0.25, 0, 0, 1)',
                                        minWidth: isActive ? 'clamp(7rem, 14vw, 9rem)' : 'clamp(5rem, 9vw, 6.5rem)',
                                    }}
                                >
                                    {/* Emoji icon */}
                                    <span style={{ fontSize: isActive ? '1.4rem' : '1.1rem', transition: 'font-size 0.3s' }}>
                                        {meta.emoji}
                                    </span>
                                    <span style={{
                                        fontSize: isActive ? '0.72rem' : '0.58rem',
                                        fontWeight: isActive ? 700 : 400,
                                        color: '#fff', letterSpacing: '0.06em',
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

                {/* ── Dots ── */}
                <div style={{ display: 'flex', justifyContent: 'center', gap: '0.35rem', marginTop: '1.5rem', flexWrap: 'wrap', padding: '0 2rem' }}>
                    {platforms.map((_, i) => (
                        <div
                            key={i}
                            onClick={() => setActive(i)}
                            style={{
                                width: i === active ? 18 : 5, height: 5, borderRadius: '3px',
                                background: i === active ? currentMeta.color : 'rgba(255,255,255,0.15)',
                                cursor: 'pointer', transition: 'all 0.35s ease',
                            }}
                        />
                    ))}
                </div>

                {/* ── Hint ── */}
                <p style={{ textAlign: 'center', marginTop: '1.25rem', fontSize: '0.58rem', letterSpacing: '0.25em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.18)' }}>
                    ← swipe or click to explore →
                </p>
            </div>

            <style>{`div::-webkit-scrollbar { display: none; }`}</style>
        </section>
    );
}
