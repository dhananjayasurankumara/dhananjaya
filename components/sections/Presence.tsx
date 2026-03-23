'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useLenis } from 'lenis/react';
import { ExternalLink } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const defaultPlatforms = [
    { name: 'Instagram', icon: <InstagramLogo />, color: '#E4405F', tagline: 'Visual Influence', platformId: 'instagram', url: '#' },
    { name: 'Behance', icon: <BehanceLogo />, color: '#0057FF', tagline: 'Creative Portfolio', platformId: 'behance', url: '#' },
    { name: 'Dribbble', icon: <DribbbleLogo />, color: '#EA4C89', tagline: 'Design Inspiration', platformId: 'dribbble', url: '#' },
    { name: 'TikTok', icon: <TikTokLogo />, color: '#EE1D52', tagline: 'Trend-Driven Motion', platformId: 'tiktok', url: '#' },
    { name: 'YouTube', icon: <YouTubeLogo />, color: '#FF0000', tagline: 'Moving Stories', platformId: 'youtube', url: '#' },
    { name: 'LinkedIn', icon: <LinkedInLogo />, color: '#0A66C2', tagline: 'Executive Networking', platformId: 'linkedin', url: '#' },
    { name: 'GitHub', icon: <GitHubLogo />, color: '#FFFFFF', tagline: 'Code Mastery', platformId: 'github', url: '#' },
    { name: 'Facebook', icon: <FacebookLogo />, color: '#1877F2', tagline: 'Social Ecosystem', platformId: 'facebook', url: '#' },
    { name: 'X', icon: <XLogo />, color: '#FFFFFF', tagline: 'Real-time Authority', platformId: 'x', url: '#' },
    { name: 'Telegram', icon: <TelegramLogo />, color: '#26A5E4', tagline: 'Encrypted Networks', platformId: 'telegram', url: '#' },
    { name: 'WhatsApp', icon: <WhatsAppLogo />, color: '#25D366', tagline: 'Instant Communication', platformId: 'whatsapp', url: '#' },
    { name: 'Fiverr', icon: <FiverrLogo />, color: '#1DBF73', tagline: 'Global Freelancing', platformId: 'fiverr', url: '#' },
    { name: 'Upwork', icon: <UpworkLogo />, color: '#14A800', tagline: 'Enterprise Solutions', platformId: 'upwork', url: '#' },
    { name: 'PeoplePerHour', icon: <PPHLogo />, color: '#FF7D00', tagline: 'Hourly Innovation', platformId: 'pph', url: '#' }
];

const iconMap: Record<string, React.ReactNode> = {
    instagram: <InstagramLogo />, behance: <BehanceLogo />, dribbble: <DribbbleLogo />, tiktok: <TikTokLogo />,
    youtube: <YouTubeLogo />, linkedin: <LinkedInLogo />, github: <GitHubLogo />, facebook: <FacebookLogo />,
    x: <XLogo />, telegram: <TelegramLogo />, whatsapp: <WhatsAppLogo />, fiverr: <FiverrLogo />,
    upwork: <UpworkLogo />, pph: <PPHLogo />
};

interface PresenceProps {
    data?: { name: string; platformId: string; url: string; color?: string; tagline?: string; }[];
    bg?: {
        imageUrl?: string | null;
        imagePosition?: string;
        overlayOpacity?: number;
    };
}

export default function Presence({ data, bg }: PresenceProps) {
    const sectionRef = useRef<HTMLDivElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    const platforms = (data && data.length > 0)
        ? data.map(p => ({
            ...p,
            icon: iconMap[p.platformId?.toLowerCase()] || <ExternalLink size={32} />,
            color: p.color || '#FFFFFF',
            tagline: p.tagline || 'Digital Influence'
        }))
        : defaultPlatforms;

    useEffect(() => {
        const timer = setTimeout(() => { ScrollTrigger.refresh(); }, 150);

        const ctx = gsap.context(() => {
            const titleElements = sectionRef.current?.querySelectorAll('.presence-title > *');
            if (titleElements && titleElements.length > 0) {
                gsap.from(titleElements, {
                    y: 50, opacity: 0, duration: 1, stagger: 0.1, ease: 'power3.out',
                    scrollTrigger: { trigger: sectionRef.current, start: 'top 85%', toggleActions: 'play none none reverse' }
                });
            }

            const gridItems = sectionRef.current?.querySelectorAll('.platform-grid-item');
            if (gridItems && gridItems.length > 0) {
                gsap.fromTo(gridItems,
                    { scale: 0.9, opacity: 0, y: 30 },
                    {
                        scale: 1, opacity: 1, y: 0, duration: 1, stagger: 0.04, ease: 'power4.out',
                        scrollTrigger: { trigger: containerRef.current, start: 'top 90%', toggleActions: 'play none none reverse' }
                    }
                );
            }

            if (bg?.imageUrl) {
                gsap.fromTo('.presence-dynamic-bg',
                    { y: -80 },
                    { y: 80, scrollTrigger: { trigger: sectionRef.current, start: 'top bottom', end: 'bottom top', scrub: true } }
                );
            }
        }, sectionRef);

        return () => { ctx.revert(); clearTimeout(timer); };
    }, [bg]);

    return (
        <section
            id="presence"
            ref={sectionRef}
            style={{
                minHeight: '100vh',
                background: 'black',
                padding: '12vh var(--gutter) 20vh',
                position: 'relative',
                overflow: 'hidden',
                zIndex: 5
            }}
        >
            {/* Dynamic Background */}
            {bg?.imageUrl && (
                <div className="presence-dynamic-bg" style={{
                    position: 'absolute',
                    inset: -150,
                    backgroundImage: `url("${bg.imageUrl}")`,
                    backgroundSize: 'cover',
                    backgroundPosition: bg.imagePosition || 'center',
                    opacity: 0.1,
                    zIndex: 0,
                    pointerEvents: 'none',
                    filter: 'grayscale(1) brightness(0.6)'
                }} />
            )}

            {/* Dark Overlay */}
            <div style={{
                position: 'absolute',
                inset: 0,
                background: `rgba(0,0,0,${bg?.overlayOpacity || 0.95})`,
                zIndex: 0,
                pointerEvents: 'none'
            }} />

            <div className="section-content" style={{ position: 'relative', zIndex: 1, maxWidth: '1400px', margin: '0 auto' }}>
                <div className="presence-title" style={{ textAlign: 'center', marginBottom: 'clamp(4rem, 10vh, 8rem)' }}>
                    <span style={{
                        fontSize: 'clamp(0.65rem, 1vw, 0.8rem)',
                        letterSpacing: '0.65em',
                        color: 'var(--highlight)',
                        textTransform: 'uppercase',
                        marginBottom: '1.5rem',
                        display: 'block',
                        opacity: 0.8
                    }}>
                        Global Ecosystem
                    </span>
                    <h2 style={{
                        fontSize: 'clamp(2.8rem, 9vw, 8rem)',
                        fontWeight: 100,
                        textTransform: 'uppercase',
                        lineHeight: 0.95,
                        letterSpacing: '-0.04em',
                        margin: 0,
                        color: '#fff'
                    }}>
                        Available<br />
                        <span style={{ fontWeight: 800 }}>Everywhere</span>
                    </h2>
                </div>

                <div
                    ref={containerRef}
                    style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 300px), 1fr))',
                        gap: '1.25rem',
                        position: 'relative',
                    }}
                >
                    {platforms.map((platform, index) => (
                        <a
                            key={index}
                            href={(platform as any).url || '#'}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="platform-grid-item"
                            style={{
                                background: 'rgba(255,255,255,0.02)',
                                backdropFilter: 'blur(10px)',
                                border: '1px solid rgba(255,255,255,0.06)',
                                borderRadius: '1.75rem',
                                padding: '2.5rem',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center',
                                transition: 'all 0.5s cubic-bezier(0.2, 0, 0, 1)',
                                cursor: 'pointer',
                                position: 'relative',
                                textDecoration: 'none'
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.borderColor = `${platform.color}40`;
                                e.currentTarget.style.background = 'rgba(255,255,255,0.04)';
                                e.currentTarget.style.transform = 'translateY(-10px) scale(1.02)';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)';
                                e.currentTarget.style.background = 'rgba(255,255,255,0.02)';
                                e.currentTarget.style.transform = 'translateY(0) scale(1)';
                            }}
                        >
                            <div style={{
                                color: platform.color,
                                marginBottom: '1.5rem',
                                filter: `drop-shadow(0 0 15px ${platform.color}30)`
                            }}>
                                {platform.icon}
                            </div>

                            <div style={{ textAlign: 'center' }}>
                                <h3 style={{ fontSize: '1.25rem', fontWeight: 700, margin: '0 0 0.5rem 0', color: '#fff' }}>
                                    {platform.name}
                                </h3>
                                <p style={{ fontSize: '0.65rem', opacity: 0.4, letterSpacing: '0.2em', textTransform: 'uppercase', margin: 0 }}>
                                    {platform.tagline}
                                </p>
                            </div>

                            <div style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', opacity: 0.15 }}>
                                <ExternalLink size={14} color="#fff" />
                            </div>
                        </a>
                    ))}
                </div>
            </div>

            <div style={{ marginTop: '12vh', textAlign: 'center', opacity: 0.35, position: 'relative', zIndex: 1 }}>
                <p style={{ fontSize: '0.75rem', letterSpacing: '0.25em', textTransform: 'uppercase', color: '#fff' }}>
                    Click to explore the digital footprint
                </p>
            </div>
        </section>
    );
}

/* ─── Social Icons ────────────────────────────────────────────────────────── */
function InstagramLogo() { return <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>; }
function BehanceLogo() { return <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 12H4.5M9 15H4.5M20 12h-7M20 15h-7M3 18h6c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2H3c-1.1 0-2 .9-2 2v8c0 1.1.9 2 2 2zM13 18h7c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2h-7c-1.1 0-2 .9-2 2v8c0 1.1.9 2 2 2z"/></svg>; }
function DribbbleLogo() { return <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M8.56 2.75c4.37 6.03 6.02 9.42 8.03 17.72m2.54-15.38c-3.72 4.35-8.94 5.66-16.13 4.75m1.01 7.15c6.51 0 11.01-1.35 15.63-7.15"/></svg>; }
function TikTokLogo() { return <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5"/></svg>; }
function YouTubeLogo() { return <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="15" x="2" y="4.5" rx="2.18" ry="2.18"/><path d="m10 9.5 5 2.5-5 2.5v-5z"/></svg>; }
function LinkedInLogo() { return <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/></svg>; }
function GitHubLogo() { return <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/><path d="M9 18c-4.51 2-5-2-7-2"/></svg>; }
function FacebookLogo() { return <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>; }
function XLogo() { return <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4l11.733 16h4.267l-11.733 -16z" /><path d="M4 20l6.768 -6.768m2.46 -2.46l6.772 -6.772" /></svg>; }
function TelegramLogo() { return <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>; }
function WhatsAppLogo() { return <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 1 1-7.6-14.1 8.38 8.38 0 0 1 3.8.9L21 1.5z"/></svg>; }
function FiverrLogo() { return <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="4"/><path d="M12 8v8"/><path d="M16 12H8"/></svg>; }
function UpworkLogo() { return <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M15 12h-5"/><path d="M12 9v6"/></svg>; }
function PPHLogo() { return <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 8v8"/><path d="M8 12h8"/></svg>; }
