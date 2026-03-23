'use client';

import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Mail } from 'lucide-react';
import ContactForm from './ContactForm';

gsap.registerPlugin(ScrollTrigger);

interface ContactProps {
    data?: {
        email?: string;
        whatsapp?: string;
        linkedin?: string;
        footerText?: string;
    };
    bg?: {
        imageUrl?: string | null;
        imagePosition?: string;
        overlayOpacity?: number;
    };
}

export default function Contact({ data, bg }: ContactProps) {
    const sectionRef = useRef<HTMLDivElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const leftTitleRef = useRef<HTMLDivElement>(null);
    const bgRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            // Split Title Reveal - Left Side
            const chars = leftTitleRef.current?.querySelectorAll('.char');
            if (chars && chars.length > 0) {
                gsap.from(chars, {
                    y: 100,
                    opacity: 0,
                    rotateX: -90,
                    stagger: 0.02,
                    duration: 1.5,
                    ease: 'power4.out',
                    scrollTrigger: {
                        trigger: sectionRef.current,
                        start: 'top 60%',
                    }
                });
            }

            // Right Side Content Reveal
            gsap.from('.contact-right-suite > *', {
                x: 50,
                opacity: 0,
                stagger: 0.1,
                duration: 1.2,
                ease: 'power3.out',
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: 'top 60%',
                }
            });

            const onWindowMouseMove = (e: MouseEvent) => {
                const { clientX, clientY } = e;
                const moveX = (clientX - window.innerWidth / 2) * 0.02;
                const moveY = (clientY - window.innerHeight / 2) * 0.02;

                gsap.to(bgRef.current, {
                    x: moveX,
                    y: moveY,
                    duration: 2,
                    ease: 'power2.out'
                });
            };

            window.addEventListener('mousemove', onWindowMouseMove);
            return () => {
                window.removeEventListener('mousemove', onWindowMouseMove);
            };
        });

        return () => ctx.revert();
    }, []);

    return (
        <section
            id="contact"
            ref={sectionRef}
            style={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                background: 'var(--deep-black)',
                position: 'relative',
                zIndex: 20,
                overflow: 'hidden',
                padding: '10vh var(--gutter)'
            }}
        >
            {/* Dynamic Background Image */}
            {bg?.imageUrl && (
                <div style={{
                    position: 'absolute',
                    inset: 0,
                    backgroundImage: `url("${bg.imageUrl}")`,
                    backgroundSize: 'cover',
                    backgroundPosition: bg.imagePosition || 'center',
                    opacity: 0.15,
                    zIndex: 0,
                    pointerEvents: 'none'
                }} />
            )}

            <div
                ref={bgRef}
                style={{
                    position: 'absolute',
                    top: '-30%',
                    left: '-30%',
                    width: '160%',
                    height: '160%',
                    background: `radial-gradient(circle at center, rgba(255, 255, 255, ${Math.max(0.015, 0.05 - (bg?.overlayOpacity || 0.5) * 0.05)}) 0%, transparent 70%)`,
                    zIndex: 0,
                    pointerEvents: 'none',
                    filter: 'blur(120px)'
                }}
            />

            {/* Dark Overlay based on admin setting */}
            <div style={{
                position: 'absolute',
                inset: 0,
                background: `rgba(0,0,0,${bg?.overlayOpacity || 0.8})`,
                zIndex: 0,
                pointerEvents: 'none'
            }} />

            <div
                ref={containerRef}
                style={{
                    width: '100%',
                    maxWidth: '1800px',
                    margin: '0 auto',
                    display: 'grid',
                    gridTemplateColumns: '1.2fr 0.8fr',
                    gap: '6rem',
                    alignItems: 'center',
                    position: 'relative',
                    zIndex: 1
                }}
                className="contact-grid-container"
            >
                <div ref={leftTitleRef} style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
                    <h2
                        style={{
                            fontSize: 'clamp(4rem, 12vw, 10rem)',
                            fontWeight: 900,
                            textTransform: 'uppercase',
                            lineHeight: 0.85,
                            letterSpacing: '-0.03em',
                            margin: 0,
                            color: 'var(--accent-white)',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'flex-start',
                        }}
                    >
                        <div className="line line-1" style={{ opacity: 0.9 }}>
                            {"HAVE".split('').map((char, i) => (
                                <span key={`l1-${i}`} className="char" style={{ display: 'inline-block' }}>
                                    {char}
                                </span>
                            ))}
                        </div>
                        <div className="line line-2" style={{ opacity: 0.8 }}>
                            {"A PROJECT".split('').map((char, i) => (
                                <span key={`l2-${i}`} className="char" style={{ display: 'inline-block' }}>
                                    {char === ' ' ? '\u00A0' : char}
                                </span>
                            ))}
                        </div>
                        <div className="line line-3" style={{ opacity: 0.7 }}>
                            {"IN MIND?".split('').map((char, i) => (
                                <span key={`l3-${i}`} className="char" style={{ display: 'inline-block' }}>
                                    {char === ' ' ? '\u00A0' : char}
                                </span>
                            ))}
                        </div>
                    </h2>

                    <div>
                        <h2 style={{
                            fontSize: 'clamp(2rem, 5vw, 3.5rem)',
                            fontWeight: 700,
                            textTransform: 'uppercase',
                            lineHeight: 1,
                            letterSpacing: '-0.02em',
                            color: 'rgba(255, 255, 255, 0.4)',
                            margin: 0
                        }}>
                            LET'S CREATE THE<br />
                            EXTRAORDINARY.
                        </h2>
                    </div>
                </div>

                <div
                    className="contact-right-suite"
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 'clamp(2rem, 5vw, 4rem)',
                        alignItems: 'flex-start'
                    }}
                >
                    <div style={{ maxWidth: '450px' }}>
                        <p style={{
                            fontSize: 'clamp(1rem, 1.25vw, 1.2rem)',
                            color: 'var(--soft-grey)',
                            lineHeight: 1.6,
                            letterSpacing: '0.02em',
                        }}>
                            Available for high-impact digital products and creative engineering partnerships worldwide.
                        </p>
                    </div>

                    <div style={{ position: 'relative', width: '100%' }}>
                        <ContactForm />
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
                        <span style={{ fontSize: '0.6rem', textTransform: 'uppercase', letterSpacing: '0.4em', opacity: 0.3, display: 'block' }}>Connect Directly</span>

                        <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
                            {[
                                { name: 'Gmail', icon: <Mail size={22} />, href: `mailto:${data?.email || "dhananjayasurankumara@gmail.com"}` },
                                { name: 'WhatsApp', icon: <WhatsAppLogo />, href: `https://wa.me/${data?.whatsapp || "94702096510"}` },
                                { name: 'LinkedIn', icon: <LinkedInLogo />, href: data?.linkedin || 'https://linkedin.com/in/dananjaya-suran-kumara' },
                            ].map((social) => (
                                <a
                                    key={social.name}
                                    href={social.href}
                                    title={social.name}
                                    style={{
                                        color: 'var(--soft-grey)',
                                        transition: 'all 0.4s ease',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.color = 'var(--accent-white)';
                                        e.currentTarget.style.transform = 'translateY(-3px)';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.color = 'var(--soft-grey)';
                                        e.currentTarget.style.transform = 'translateY(0)';
                                    }}
                                >
                                    {social.icon}
                                </a>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <div style={{
                position: 'absolute',
                bottom: '3rem',
                left: 'var(--gutter)',
                color: 'rgba(255,255,255,0.08)',
                fontSize: '0.65rem',
                letterSpacing: '0.3em',
                textTransform: 'uppercase'
            }}>
                {data?.footerText || `© ${new Date().getFullYear()} Dananjaya. Portfolio Experience.`}
            </div>
        </section>
    );
}

function WhatsAppLogo() { return <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" /></svg>; }
function LinkedInLogo() { return <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor"><path d="M4.98 3.5c0 1.381-1.11 2.5-2.48 2.5s-2.48-1.119-2.48-2.5c0-1.38 1.11-2.5 2.48-2.5s2.48 1.12 2.48 2.5zm.02 4.5h-5v16h5v-16zm7.982 0h-4.968v16h4.969v-8.399c0-4.67 6.029-5.052 6.029 0v8.399h4.988v-10.131c0-7.88-8.922-7.593-11.018-3.714v-2.155z" /></svg>; }
