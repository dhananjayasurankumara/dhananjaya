'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useLenis } from 'lenis/react';

gsap.registerPlugin(ScrollTrigger);

const defaultItems = [
    {
        title: "Buy Me a Coffee",
        description: "Keep the caffeine flowing and the code compiling.",
        icon: "coffee",
        url: "https://buymeacoffee.com/dhananjaya"
    },
    {
        title: "Buy Me a Pizza",
        description: "Fuel the late-night sessions and creative breakthroughs.",
        icon: "pizza",
        url: "https://buymeacoffee.com/dhananjaya"
    }
];

interface SupportProps {
    data?: { title?: string | null; description?: string | null; icon?: string | null; url?: string | null; }[];
    bg?: {
        imageUrl?: string | null;
        imagePosition?: string;
        overlayOpacity?: number;
    };
}

export default function Support({ data, bg }: SupportProps) {
    const sectionRef = useRef<HTMLDivElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    useLenis();

    // Use DB items ONLY if they have a valid title and url — otherwise fall back to defaults
    const validDb = (data || []).filter(d => d?.title?.trim() && d?.url?.trim());
    const items = validDb.length > 0 ? validDb : defaultItems;

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.from('.support-card', {
                y: 50, opacity: 0, duration: 1, stagger: 0.15, ease: 'power3.out',
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: 'top 80%',
                    toggleActions: 'play none none reverse',
                }
            });

            if (bg?.imageUrl) {
                gsap.fromTo('.support-dynamic-bg',
                    { y: -50 },
                    {
                        y: 50,
                        scrollTrigger: {
                            trigger: sectionRef.current,
                            start: 'top bottom',
                            end: 'bottom top',
                            scrub: true,
                        }
                    }
                );
            }
        }, sectionRef);
        return () => ctx.revert();
    }, [bg, items]);

    return (
        <section
            id="support"
            ref={sectionRef}
            style={{
                minHeight: '100vh',
                background: 'black',
                padding: '15vh var(--gutter)',
                position: 'relative',
                overflow: 'hidden',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
            }}
        >
            {/* Dynamic Background */}
            {bg?.imageUrl && (
                <div className="support-dynamic-bg" style={{
                    position: 'absolute', inset: -100,
                    backgroundImage: `url("${bg.imageUrl}")`,
                    backgroundSize: 'cover',
                    backgroundPosition: bg.imagePosition || 'center',
                    opacity: 0.1, zIndex: 0, pointerEvents: 'none',
                    filter: 'grayscale(1) brightness(0.4)',
                }} />
            )}
            <div style={{
                position: 'absolute', inset: 0,
                background: `rgba(0,0,0,${bg?.overlayOpacity ?? 0.95})`,
                zIndex: 0, pointerEvents: 'none',
            }} />

            <div className="section-content" style={{ position: 'relative', zIndex: 1, textAlign: 'center', maxWidth: '1000px' }}>
                <span style={{
                    fontSize: '0.7rem', letterSpacing: '0.5em',
                    color: 'var(--highlight)', textTransform: 'uppercase',
                    marginBottom: '1.5rem', display: 'block',
                }}>
                    Fuel the Creative
                </span>
                <h2 style={{
                    fontSize: 'clamp(3rem, 10vw, 8rem)', fontWeight: 100,
                    textTransform: 'uppercase', margin: '0 0 4rem',
                    lineHeight: 0.9, letterSpacing: '-0.04em', color: '#fff',
                }}>
                    Support<br />
                    <span style={{ fontWeight: 600 }}>The Work</span>
                </h2>

                <div ref={containerRef} style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '2rem' }}>
                    {items.map((item, idx) => (
                        <div
                            key={idx}
                            className="support-card"
                            onClick={() => item.url && window.open(item.url, '_blank')}
                            style={{
                                background: 'rgba(255,255,255,0.03)',
                                border: '1px solid rgba(255,255,255,0.06)',
                                borderRadius: '2rem',
                                padding: '3rem 2.5rem',
                                width: 'min(100%, 380px)',
                                cursor: 'pointer',
                                transition: 'all 0.4s cubic-bezier(0.2, 0, 0, 1)',
                            }}
                            onMouseEnter={e => {
                                e.currentTarget.style.background = 'rgba(255,255,255,0.06)';
                                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)';
                                e.currentTarget.style.transform = 'translateY(-10px)';
                            }}
                            onMouseLeave={e => {
                                e.currentTarget.style.background = 'rgba(255,255,255,0.03)';
                                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)';
                                e.currentTarget.style.transform = 'translateY(0)';
                            }}
                        >
                            {/* Icon — always renders based on keyword matching */}
                            <div style={{ color: 'var(--highlight)', marginBottom: '1.5rem', display: 'flex', justifyContent: 'center' }}>
                                {getIcon(item.icon)}
                            </div>
                            <h3 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#fff', margin: '0 0 1rem' }}>
                                {item.title}
                            </h3>
                            <p style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.5)', lineHeight: 1.6, margin: 0 }}>
                                {item.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

/** Returns an icon SVG — matches 'coffee', 'pizza', or any gift/heart keyword, defaults to a heart */
function getIcon(icon?: string | null) {
    const k = (icon || '').toLowerCase();
    if (k.includes('coffee')) return <CoffeeIcon />;
    if (k.includes('pizza')) return <PizzaIcon />;
    if (k.includes('gift') || k.includes('present')) return <GiftIcon />;
    if (k.includes('heart') || k.includes('love')) return <HeartIcon />;
    // Default: coffee
    return <CoffeeIcon />;
}

function CoffeeIcon() {
    return (
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M17 8h1a4 4 0 1 1 0 8h-1" />
            <path d="M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4Z" />
            <line x1="6" x2="6" y1="2" y2="4" />
            <line x1="10" x2="10" y1="2" y2="4" />
            <line x1="14" x2="14" y1="2" y2="4" />
        </svg>
    );
}

function PizzaIcon() {
    return (
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 11h.01" />
            <path d="M11 15h.01" />
            <path d="M16 16h.01" />
            <path d="m2 16 20 6-6-20A20 20 0 0 0 2 16Z" />
            <path d="M7 14h.01" />
        </svg>
    );
}

function GiftIcon() {
    return (
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 12 20 22 4 22 4 12" />
            <rect x="2" y="7" width="20" height="5" />
            <line x1="12" y1="22" x2="12" y2="7" />
            <path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z" />
            <path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z" />
        </svg>
    );
}

function HeartIcon() {
    return (
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
        </svg>
    );
}
