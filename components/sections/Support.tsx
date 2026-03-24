'use client';

import { useEffect, useRef } from 'react';

// These two ALWAYS show — no DB override, no GSAP risk
const FIXED_ITEMS = [
    {
        title: "Buy Me a Coffee",
        description: "Keep the caffeine flowing and the code compiling.",
        icon: "coffee",
        url: "https://buymeacoffee.com/dhananjaya",
    },
    {
        title: "Buy Me a Pizza",
        description: "Fuel the late-night sessions and creative breakthroughs.",
        icon: "pizza",
        url: "https://buymeacoffee.com/dhananjaya",
    },
];

interface SupportItem {
    title?: string | null;
    description?: string | null;
    icon?: string | null;
    url?: string | null;
}

interface SupportProps {
    data?: SupportItem[];
    bg?: {
        imageUrl?: string | null;
        imagePosition?: string;
        overlayOpacity?: number;
    };
}

export default function Support({ bg }: SupportProps) {
    const sectionRef = useRef<HTMLDivElement>(null);
    const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

    // Stagger reveal using IntersectionObserver — no GSAP opacity:0 risk
    useEffect(() => {
        const cards = cardsRef.current.filter(Boolean) as HTMLDivElement[];
        if (!cards.length) return;

        // Reset to hidden
        cards.forEach(c => {
            c.style.opacity = '0';
            c.style.transform = 'translateY(40px)';
            c.style.transition = 'none';
        });

        const observer = new IntersectionObserver(
            entries => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const el = entry.target as HTMLDivElement;
                        const i = cards.indexOf(el);
                        setTimeout(() => {
                            el.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
                            el.style.opacity = '1';
                            el.style.transform = 'translateY(0)';
                        }, i * 150);
                        observer.unobserve(el);
                    }
                });
            },
            { threshold: 0.15 }
        );

        cards.forEach(c => observer.observe(c));
        return () => observer.disconnect();
    }, []);

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
                <div style={{
                    position: 'absolute',
                    inset: -100,
                    backgroundImage: `url("${bg.imageUrl}")`,
                    backgroundSize: 'cover',
                    backgroundPosition: bg.imagePosition || 'center',
                    opacity: 0.1,
                    zIndex: 0,
                    pointerEvents: 'none',
                    filter: 'grayscale(1) brightness(0.4)',
                }} />
            )}

            {/* Dark Overlay */}
            <div style={{
                position: 'absolute',
                inset: 0,
                background: `rgba(0,0,0,${bg?.overlayOpacity ?? 0.95})`,
                zIndex: 0,
                pointerEvents: 'none',
            }} />

            <div style={{ position: 'relative', zIndex: 1, textAlign: 'center', maxWidth: '1000px', width: '100%' }}>
                <span style={{
                    fontSize: '0.7rem',
                    letterSpacing: '0.5em',
                    color: 'var(--highlight)',
                    textTransform: 'uppercase',
                    marginBottom: '1.5rem',
                    display: 'block',
                }}>
                    Fuel the Creative
                </span>

                <h2 style={{
                    fontSize: 'clamp(3rem, 10vw, 8rem)',
                    fontWeight: 100,
                    textTransform: 'uppercase',
                    margin: '0 0 4rem',
                    lineHeight: 0.9,
                    letterSpacing: '-0.04em',
                    color: '#fff',
                }}>
                    Support<br />
                    <span style={{ fontWeight: 600 }}>The Work</span>
                </h2>

                {/* Cards — always coffee + pizza */}
                <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '2rem' }}>
                    {FIXED_ITEMS.map((item, idx) => (
                        <div
                            key={idx}
                            ref={el => { cardsRef.current[idx] = el; }}
                            onClick={() => window.open(item.url, '_blank')}
                            style={{
                                background: 'rgba(255,255,255,0.03)',
                                border: '1px solid rgba(255,255,255,0.06)',
                                borderRadius: '2rem',
                                padding: '3rem 2.5rem',
                                width: 'min(100%, 380px)',
                                cursor: 'pointer',
                                transition: 'background 0.4s ease, border-color 0.4s ease, transform 0.4s ease',
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
                            <div style={{ color: 'var(--highlight)', marginBottom: '1.5rem', display: 'flex', justifyContent: 'center' }}>
                                {item.icon === 'coffee' ? <CoffeeIcon /> : <PizzaIcon />}
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
