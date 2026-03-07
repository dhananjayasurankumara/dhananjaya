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

// --- Official Brand Logos (High-Fidelity SVGs) ---
function InstagramLogo() { return <svg viewBox="0 0 24 24" width="32" height="32" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.266.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.848 0-3.204.012-3.584.07-4.849.149-3.225 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.981 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.058-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" /></svg>; }
function BehanceLogo() { return <svg viewBox="0 0 24 24" width="32" height="32" fill="currentColor"><path d="M22 7h-7v-2h7v2zm-11.5 5c0 3-.9 4-4.2 4h-4.3v-9h4.5c2.8 0 4 .8 4 2.5 0 1.2-.6 2-1.5 2.5 1.4.3 1.5 1.5 1.5 2.5v.5zm-6.5-4.5h2.2c1.2 0 1.8.3 1.8 1.2 0 .8-.6 1-1.8 1h-2.2v-2.2zm4.3 4.2h-4.3v2.3h4.3c1.3 0 2-.4 2-1.2 0-.7-.7-1.1-2-1.1zm11.7-.2c0 2.7-2 3.5-4.5 3.5s-4.5-1.1-4.5-3.5 1.8-3.5 4.5-3.5 4.5.8 4.5 3.5zm-2.2-.2c0-1.4-.6-1.5-2.2-1.5s-2.2.1-2.2 1.5.6 1.5 2.2 1.5 2.2-.1 2.2-1.5z" /></svg>; }
function DribbbleLogo() { return <svg viewBox="0 0 24 24" width="32" height="32" fill="currentColor"><path d="M12 24C5.385 24 0 18.615 0 12S5.385 0 12 0s12 5.385 12 12-5.385 12-12 12zm10.12-10.358c-.35-.11-4.17-.815-8.15.19 1.286 2.274 2.41 4.584 2.41 4.584.053-.027.104-.057.156-.086 4.14-2.27 5.18-4.17 5.584-4.688zM4.717 18.232l.012-.01s1.39-3.5 6.075-4.5c.18-.04.364-.076.55-.108-.266-.67-.544-1.348-.838-2.022-4.2.825-8.324.78-9.022.774-.1.6-.145 1.21-.145 1.833 0 1.774.407 3.447 1.127 4.935l2.24-1.102zm1.86-12.03C4.85 7.6 3.91 9.49 3.39 10.966c.88.01 4.41.047 8.35-.615C9.8 8.1 8 6.1 6.577 6.202zm7.15.54c1.47 1.96 2.5 4.1 3.1 5.4.15-.05.3-.11.4-.17 3.6-2 4.1-3.8 4.3-4.3l-.01.01c-.13-.24-1.04-1.92-4.13-2.65-.24-.05-.47-.1-.71-.14zm-5.69-.94c.1-.21.21-.42.32-.62a11.96 11.96 0 014.28-.96c-.32.02-.65.04-.98.07-1.35.12-2.58.6-3.62 1.34l.004.004c-.004 0-.004 0 0 .166zm5.1 1.63c.27.67.54 1.34.78 2.02l.01.01c4.15-1.05 8.1-1.28 8.65-1.3l.01-.01c.06-.47.1-.94.1-1.42 0-.61-.05-1.21-.14-1.8 0 0-1.4 0-5.18.66.44.8.84 1.57 1.18 2.3zm-7.42 3.82c.44 1.64.91 3.28 1.42 4.92.13.43.27.85.41 1.28l.01-.01c3.27.87 4.58 2.42 5.1 3.26l.01.01a9.58 9.58 0 005.07-2.57c-.1-.23-.97-1.93-3.1-2.36h-.04l.55-.26c.72-.34 1.48-.62 2.24-.8-.02-.04-.03-.09-.05-.13a11.84 11.84 0 00-4.08 2.2z" /></svg>; }
function TikTokLogo() { return <svg viewBox="0 0 24 24" width="32" height="32" fill="currentColor"><path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-3.3 2.97-5.98 6.27-6.13.1-.01.21-.01.31-.01v4.03c-1.31.02-2.31.83-2.61 1.63-.3 1.14.34 3.19 1.46 3.26h.04c.05-.15.11-.31.17-.46 1.03-2.64 3.19-4.83 5.4-6.38.16-.11.33-.21.49-.31z" /></svg>; }
function YouTubeLogo() { return <svg viewBox="0 0 24 24" width="32" height="32" fill="currentColor"><path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" /></svg>; }
function LinkedInLogo() { return <svg viewBox="0 0 24 24" width="32" height="32" fill="currentColor"><path d="M4.98 3.5c0 1.381-1.11 2.5-2.48 2.5s-2.48-1.119-2.48-2.5c0-1.38 1.11-2.5 2.48-2.5s2.48 1.12 2.48 2.5zm.02 4.5h-5v16h5v-16zm7.982 0h-4.968v16h4.969v-8.399c0-4.67 6.029-5.052 6.029 0v8.399h4.988v-10.131c0-7.88-8.922-7.593-11.018-3.714v-2.155z" /></svg>; }
function GitHubLogo() { return <svg viewBox="0 0 24 24" width="32" height="32" fill="currentColor"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.43.372.82 1.102.82 2.222 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" /></svg>; }
function FacebookLogo() { return <svg viewBox="0 0 24 24" width="32" height="32" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" /></svg>; }
function XLogo() { return <svg viewBox="0 0 24 24" width="32" height="32" fill="currentColor"><path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932 6.064-6.932zm-1.292 19.49h2.039L6.486 3.24h-2.19l13.313 17.403z" /></svg>; }
function TelegramLogo() { return <svg viewBox="0 0 24 24" width="32" height="32" fill="currentColor"><path d="M11.944 0C5.346 0 0 5.346 0 11.944c0 6.598 5.346 11.944 11.944 11.944 6.598 0 11.944-5.346 11.944-11.944C23.888 5.346 18.542 0 11.944 0zm5.83 7.025l-2.02 9.51c-.15.68-.558.85-1.13.528l-3.08-2.268-1.486 1.43c-.164.164-.303.303-.622.303l.222-3.14 5.717-5.166c.248-.22-.054-.343-.385-.122L7.96 11.83.9 9.618c-1.536-.48-1.564-1.536.32-2.268l27.57-10.627c1.277-.468 2.4.298 1.984 1.302z" /></svg>; }
function WhatsAppLogo() { return <svg viewBox="0 0 24 24" width="32" height="32" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" /></svg>; }
function FiverrLogo() { return <svg viewBox="0 0 24 24" width="32" height="32" fill="currentColor"><path d="M12 0c6.627 0 12 5.373 12 12s-5.373 12-12 12S0 18.627 0 12 5.373 0 12 0zm5.1 7.8c0-1.1-.9-1.9-1.9-1.9-1.1 0-1.9.9-1.9 1.9 0 1.1.9 1.9 1.9 1.9 1.1 0 1.9-.9 1.9-1.9zm-4.4 3.2V7.8h-2v6.2c0 .9.5 1.3 1.1 1.3.6 0 1.1-.4 1.1-1.3l-2.1-.2h.4v6.1h.4zm-6.1-3.2l.7 2.1.7-2.1h.2l.8 2.3-.8 2.3h.2l.7-2.1.7 2.1h.2l-.8-2.3.8-2.3zM2.8 12h-.4c-.5 0-.7-.2-.7-.7V7h-.2v4.3c0 .9.5 1.3 1.1 1.3h.4c.5 0 .7-.2.7-.7s-.2-.7-.7-.7z" /></svg>; }
function UpworkLogo() { return <svg viewBox="0 0 24 24" width="32" height="32" fill="currentColor"><path d="M18.561 3.322c-2.544 0-4.502 1.948-4.512 4.49v5.127l-2.301-7.859H8.641v5.992c0 1.636-1.332 2.968-2.968 2.968a2.97 2.97 0 0 1-2.968-2.968V5.08H0v5.992c0 3.264 2.656 5.92 5.92 5.92 1.396 0 2.678-.488 3.687-1.303l.974 3.324h3.181l-1.635-5.58c1.623-1.42 2.924-3.526 3.682-5.918 1.056 1.144 2.455 1.83 4 1.83 2.544 0 4.502-1.948 4.512-4.49S21.104 3.322 18.561 3.322zm0 6.06c-.846 0-1.531-.685-1.531-1.53 0-.846.685-1.531 1.531-1.531.846 0 1.531.685 1.531 1.531 0 .845-.685 1.53-1.531 1.53z" /></svg>; }
function PPHLogo() { return <svg viewBox="0 0 24 24" width="32" height="32" fill="currentColor"><path d="M12 0c6.627 0 12 5.373 12 12s-5.373 12-12 12S0 18.627 0 12 5.373 0 12 0zm1 4v3h3v2h-3v7h-2v-7H8V9h3V6h2z" /></svg>; }

interface PresenceProps {
    data?: { name: string; platformId: string; url: string; color?: string; tagline?: string; }[];
}

export default function Presence({ data }: PresenceProps) {
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

    const lenis = useLenis();

    useEffect(() => {
        // Force refresh after a short delay to account for layout settling
        const timer = setTimeout(() => {
            ScrollTrigger.refresh();
        }, 150);

        const ctx = gsap.context(() => {
            const titleElements = sectionRef.current?.querySelectorAll('.presence-title > *');
            if (titleElements && titleElements.length > 0) {
                gsap.from(titleElements, {
                    y: 50,
                    opacity: 0,
                    duration: 1,
                    stagger: 0.1,
                    ease: 'power3.out',
                    scrollTrigger: {
                        trigger: sectionRef.current,
                        start: 'top 85%',
                        toggleActions: 'play none none none'
                    }
                });
            }

            const gridItems = sectionRef.current?.querySelectorAll('.platform-grid-item');
            if (gridItems && gridItems.length > 0) {
                gsap.fromTo(gridItems,
                    { scale: 0.9, opacity: 0, y: 30 },
                    {
                        scale: 1,
                        opacity: 1,
                        y: 0,
                        duration: 1,
                        stagger: 0.04,
                        ease: 'power4.out',
                        scrollTrigger: {
                            trigger: containerRef.current,
                            start: 'top 90%',
                            toggleActions: 'play none none none'
                        }
                    }
                );
            }
        });

        return () => {
            ctx.revert();
            clearTimeout(timer);
        };
    }, []);

    return (
        <section
            id="presence"
            ref={sectionRef}
            style={{
                background: 'var(--deep-black)',
                padding: 'clamp(5rem, 15vh, 12rem) var(--gutter)',
                position: 'relative',
                zIndex: 10,
                overflow: 'hidden'
            }}
        >
            <div className="presence-title" style={{ textAlign: 'center', marginBottom: 'clamp(3rem, 8vh, 6rem)' }}>
                <span style={{
                    fontSize: 'clamp(0.65rem, 1vw, 0.8rem)',
                    letterSpacing: '0.6em',
                    color: 'var(--highlight)',
                    textTransform: 'uppercase',
                    marginBottom: '1.2rem',
                    display: 'block',
                    opacity: 0.7
                }}>
                    Global Ecosystem
                </span>
                <h2 style={{
                    fontSize: 'clamp(2.5rem, 8vw, 7rem)',
                    fontWeight: 100,
                    textTransform: 'uppercase',
                    lineHeight: 0.95,
                    letterSpacing: '-0.04em',
                    margin: 0
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
                    gap: '1.2rem',
                    maxWidth: '1400px',
                    margin: '0 auto',
                    position: 'relative',
                    zIndex: 1
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
                            border: '1px solid rgba(255,255,255,0.05)',
                            borderRadius: '1.5rem',
                            padding: '2.5rem',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            transition: 'all 0.5s cubic-bezier(0.25, 1, 0.5, 1)',
                            cursor: 'pointer',
                            position: 'relative',
                            textDecoration: 'none'
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.borderColor = `${platform.color}30`;
                            e.currentTarget.style.background = 'rgba(255,255,255,0.04)';
                            e.currentTarget.style.transform = 'translateY(-5px) scale(1.02)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.borderColor = 'rgba(255,255,255,0.05)';
                            e.currentTarget.style.background = 'rgba(255,255,255,0.02)';
                            e.currentTarget.style.transform = 'translateY(0) scale(1)';
                        }}
                    >
                        <div style={{
                            color: platform.color,
                            marginBottom: '1.5rem',
                            zIndex: 1,
                            filter: `drop-shadow(0 0 10px ${platform.color}20)`
                        }}>
                            {platform.icon}
                        </div>

                        <div style={{ textAlign: 'center', zIndex: 1 }}>
                            <h3 style={{
                                fontSize: '1.2rem',
                                fontWeight: 700,
                                margin: '0 0 0.4rem 0',
                                color: 'var(--accent-white)'
                            }}>
                                {platform.name}
                            </h3>
                            <p style={{
                                fontSize: '0.65rem',
                                opacity: 0.3,
                                letterSpacing: '0.2em',
                                textTransform: 'uppercase',
                                margin: 0
                            }}>
                                {platform.tagline}
                            </p>
                        </div>

                        <div style={{
                            position: 'absolute',
                            top: '1.5rem',
                            right: '1.5rem',
                            opacity: 0.1
                        }}>
                            <ExternalLink size={14} />
                        </div>
                    </a>
                ))}
            </div>

            <div style={{ marginTop: '10vh', textAlign: 'center', opacity: 0.4 }}>
                <p style={{ fontSize: '0.8rem', letterSpacing: '0.2em', textTransform: 'uppercase' }}>
                    Click to explore the digital footprint
                </p>
            </div>
        </section>
    );
}
