'use client';

import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useLenis } from 'lenis/react';

gsap.registerPlugin(ScrollTrigger);

export default function Support() {
    const sectionRef = useRef<HTMLDivElement>(null);
    const bgRef = useRef<HTMLDivElement>(null);
    const lenis = useLenis();

    useEffect(() => {
        // Force refresh after a short delay to account for layout settling
        const timer = setTimeout(() => {
            ScrollTrigger.refresh();
        }, 100);

        const ctx = gsap.context(() => {
            // Main Heading Reveal
            const titleChars = sectionRef.current?.querySelectorAll('.support-title .char');
            if (titleChars && titleChars.length > 0) {
                gsap.from(titleChars, {
                    y: 50,
                    opacity: 0,
                    rotateX: -90,
                    stagger: 0.03,
                    duration: 1.2,
                    ease: 'power4.out',
                    scrollTrigger: {
                        trigger: sectionRef.current,
                        start: 'top 80%',
                        toggleActions: 'play none none none'
                    }
                });
            }

            // Cards Reveal
            const cards = sectionRef.current?.querySelectorAll('.support-card');
            if (cards && cards.length > 0) {
                gsap.fromTo(cards,
                    { y: 40, opacity: 0 },
                    {
                        y: 0,
                        opacity: 1,
                        stagger: 0.15,
                        duration: 1,
                        ease: 'power3.out',
                        scrollTrigger: {
                            trigger: sectionRef.current,
                            start: 'top 75%',
                            toggleActions: 'play none none none'
                        }
                    }
                );
            }

            // Ambient background movement
            const onMouseMove = (e: MouseEvent) => {
                const { clientX, clientY } = e;
                const x = (clientX - window.innerWidth / 2) * 0.01;
                const y = (clientY - window.innerHeight / 2) * 0.01;
                gsap.to(bgRef.current, { x, y, duration: 2, ease: 'power2.out' });
            };

            window.addEventListener('mousemove', onMouseMove);
            return () => window.removeEventListener('mousemove', onMouseMove);
        });

        return () => ctx.revert();
    }, []);

    return (
        <section
            id="support"
            ref={sectionRef}
            style={{
                minHeight: '60vh',
                display: 'flex',
                alignItems: 'center',
                background: 'var(--deep-black)',
                position: 'relative',
                overflow: 'hidden',
                padding: 'clamp(5rem, 15vh, 10rem) var(--gutter)',
                borderTop: '1px solid rgba(255, 255, 255, 0.03)'
            }}
        >
            {/* Ambient Background */}
            <div
                ref={bgRef}
                style={{
                    position: 'absolute',
                    top: '-20%',
                    left: '-20%',
                    width: '140%',
                    height: '140%',
                    background: 'radial-gradient(circle at center, rgba(255, 255, 255, 0.01) 0%, transparent 60%)',
                    zIndex: 0,
                    pointerEvents: 'none'
                }}
            />

            <div style={{ position: 'relative', zIndex: 1, width: '100%', maxWidth: '1400px', margin: '0 auto' }}>
                <div style={{ textAlign: 'center', marginBottom: 'clamp(3rem, 8vh, 5rem)' }}>
                    <h2
                        className="support-title"
                        style={{
                            fontSize: 'clamp(2.5rem, 8vw, 6rem)',
                            fontWeight: 900,
                            textTransform: 'uppercase',
                            letterSpacing: '-0.02em',
                            color: 'var(--accent-white)',
                            lineHeight: 1
                        }}
                    >
                        {"SUPPORT THE CRAFT".split('').map((char, i) => (
                            <span key={i} className="char" style={{ display: 'inline-block' }}>
                                {char === ' ' ? '\u00A0' : char}
                            </span>
                        ))}
                    </h2>
                    <p style={{
                        marginTop: '1.2rem',
                        fontSize: 'clamp(0.8rem, 1.2vw, 1rem)',
                        color: 'var(--soft-grey)',
                        letterSpacing: '0.1em',
                        textTransform: 'uppercase',
                        opacity: 0.6
                    }}>
                        Fueling creative engineering & digital high-fidelity
                    </p>
                </div>

                <div
                    className="support-grid"
                    style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 350px), 1fr))',
                        gap: '2rem',
                        justifyContent: 'center'
                    }}
                >
                    <SupportCard
                        icon={<Coffee size={32} />}
                        title="Buy me a coffee"
                        description="Keep the caffeine flowing and the code compiling."
                        href="https://buymeacoffee.com/your-username"
                    />
                    <SupportCard
                        icon={<Pizza size={32} />}
                        title="Buy me a pizza"
                        description="Fuel the late-night sessions and creative breakthroughs."
                        href="https://buymeacoffee.com/your-username"
                    />
                </div>
            </div>

            <style jsx>{`
                @media (max-width: 768px) {
                    .support-grid {
                        grid-template-columns: 1fr !important;
                    }
                }
            `}</style>
        </section>
    );
}

function SupportCard({ icon, title, description, href }: { icon: React.ReactNode, title: string, description: string, href: string }) {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className="support-card"
            style={{
                padding: '3rem',
                background: 'rgba(255, 255, 255, 0.02)',
                border: '1px solid rgba(255, 255, 255, 0.05)',
                borderRadius: '2rem',
                textDecoration: 'none',
                transition: 'all 0.5s cubic-bezier(0.165, 0.84, 0.44, 1)',
                display: 'flex',
                flexDirection: 'column',
                gap: '1.5rem',
                alignItems: 'center',
                textAlign: 'center',
                transform: isHovered ? 'translateY(-10px)' : 'translateY(0)',
                boxShadow: isHovered ? '0 30px 60px rgba(0,0,0,0.5), 0 0 20px rgba(255,255,255,0.02)' : 'none'
            }}
        >
            <div style={{
                color: isHovered ? 'var(--accent-white)' : 'rgba(255, 255, 255, 0.4)',
                transform: isHovered ? 'scale(1.1)' : 'scale(1)',
                transition: 'all 0.4s ease'
            }}>
                {icon}
            </div>
            <div>
                <h3 style={{
                    fontSize: '1.2rem',
                    fontWeight: 800,
                    color: 'var(--accent-white)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.1em',
                    marginBottom: '0.5rem'
                }}>
                    {title}
                </h3>
                <p style={{
                    fontSize: '0.9rem',
                    color: 'var(--soft-grey)',
                    lineHeight: 1.6,
                    opacity: 0.6
                }}>
                    {description}
                </p>
            </div>

            <div style={{
                marginTop: '1rem',
                fontSize: '0.7rem',
                fontWeight: 900,
                textTransform: 'uppercase',
                letterSpacing: '0.3em',
                color: 'var(--accent-white)',
                opacity: isHovered ? 1 : 0,
                transform: isHovered ? 'translateY(0)' : 'translateY(10px)',
                transition: 'all 0.4s ease'
            }}>
                Fuel Up →
            </div>
        </a>
    );
}

// Icons
function Coffee({ size }: { size: number }) { return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8h1a4 4 0 0 1 0 8h-1" /><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z" /><line x1="6" y1="1" x2="6" y2="4" /><line x1="10" y1="1" x2="10" y2="4" /><line x1="14" y1="1" x2="14" y2="4" /></svg>; }
function Pizza({ size }: { size: number }) { return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M15 11h.01" /><path d="M11 15h.01" /><path d="M16 16h.01" /><path d="M2 20a5 5 0 0 0 4.9 5H17.1a5 5 0 0 0 4.9-5" /><path d="M22 13V5a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v8l.24 1.25A1 1 0 0 0 3.23 15H20.77a1 1 0 0 0 .99-.75L22 13z" /><path d="M7 11h.01" /><path d="M7 7h.01" /><path d="M11 7h.01" /></svg>; }
