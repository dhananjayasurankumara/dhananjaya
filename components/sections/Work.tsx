'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Image from 'next/image';
import Link from 'next/link';

interface Project {
    id?: number;
    title: string;
    description?: string;
    tags?: string;
    link?: string;
    imageUrl?: string;
}

interface WorkProps {
    data?: Project[];
    bg?: {
        imageUrl?: string | null;
        imagePosition?: string;
        overlayOpacity?: number;
    };
}

const defaultProjects: Project[] = [
    {
        title: 'Precision Timepiece',
        tags: 'Motion Branding / GSAP',
        imageUrl: '/images/project-1.png',
        link: '',
    },
    {
        title: 'Architectural Void',
        tags: 'Visual Identity / Editorial',
        imageUrl: '/images/project-2.png',
        link: '',
    },
    {
        title: 'Technological Glow',
        tags: 'Cinematic Design / WebGL',
        imageUrl: '/images/project-3.png',
        link: '',
    },
];

export default function Work({ data, bg }: WorkProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const displayProjects = (data && data.length > 0) ? data : defaultProjects;

    useEffect(() => {
        gsap.registerPlugin(ScrollTrigger);

        const ctx = gsap.context(() => {
            const panels = containerRef.current?.querySelectorAll('.project-panel');
            if (!panels) return;

            panels.forEach((panel: any) => {
                const img = panel.querySelector('img');
                const content = panel.querySelector('.project-content-wrapper');

                if (img) {
                    gsap.fromTo(img,
                        { scale: 1.2 },
                        {
                            scale: 1,
                            ease: 'none',
                            scrollTrigger: {
                                trigger: panel,
                                start: 'top bottom',
                                end: 'bottom top',
                                scrub: true,
                            }
                        }
                    );
                }

                if (content) {
                    gsap.fromTo(content,
                        { y: 100, opacity: 0 },
                        {
                            y: 0,
                            opacity: 1,
                            duration: 1,
                            ease: 'power3.out',
                            scrollTrigger: {
                                trigger: panel,
                                start: 'top 60%',
                                toggleActions: 'play none none reverse'
                            }
                        }
                    );
                }
            });
        }, containerRef);

        return () => ctx.revert();
    }, [displayProjects]);

    return (
        <section id="work" ref={containerRef} style={{ background: 'var(--deep-black)', position: 'relative' }}>
            
            {/* Dynamic Background Image for the whole section */}
            {bg?.imageUrl && (
                <div style={{
                    position: 'absolute',
                    inset: 0,
                    backgroundImage: `url("${bg.imageUrl}")`,
                    backgroundSize: 'cover',
                    backgroundPosition: bg.imagePosition || 'center',
                    opacity: 0.15,
                    zIndex: 0,
                    pointerEvents: 'none',
                    filter: 'blur(20px)'
                }} />
            )}

            {/* Dark Overlay based on admin setting */}
           <div style={{
                position: 'absolute',
                inset: 0,
                background: `rgba(0,0,0,${bg?.overlayOpacity || 0.9})`,
                zIndex: 0,
                pointerEvents: 'none'
            }} />

            {/* Intro Title Panel */}
            <div
                className="project-panel intro-panel"
                style={{
                    minHeight: '100vh',
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    position: 'relative',
                    overflow: 'hidden',
                    borderBottom: '1px solid rgba(255,255,255,0.05)',
                    padding: 'var(--spacing-xl) var(--gutter)',
                    zIndex: 1
                }}
            >
                <div className="section-content project-content-wrapper" style={{ textAlign: 'center', maxWidth: '800px' }}>
                    <span style={{
                        color: 'var(--highlight)',
                        fontSize: 'clamp(0.65rem, 1vw, 0.8rem)',
                        letterSpacing: '0.6em',
                        textTransform: 'uppercase',
                        display: 'block',
                        marginBottom: '2rem',
                        opacity: 0.8
                    }}>
                        Portfolio Showcase
                    </span>
                    <h2 style={{
                        fontSize: 'clamp(3rem, 10vw, 8.5rem)',
                        fontWeight: 200,
                        textTransform: 'uppercase',
                        lineHeight: 0.9,
                        letterSpacing: '-0.04em'
                    }}>
                        Selected<br />
                        <span style={{ fontWeight: 600, color: 'var(--accent-white)' }}>Works</span>
                    </h2>
                </div>
            </div>

            {displayProjects.map((project, index) => (
                <div
                    key={index}
                    className="project-panel"
                    style={{
                        minHeight: '100vh',
                        width: '100%',
                        position: 'relative',
                        overflow: 'hidden',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: '10vh var(--gutter)',
                        zIndex: 1
                    }}
                >
                    <div style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        zIndex: 0,
                    }}>
                        <Image
                            src={project.imageUrl || '/images/project-1.png'}
                            alt={project.title || "Project"}
                            fill
                            style={{ objectFit: 'cover', opacity: 0.4 }}
                        />
                    </div>

                    <div className="section-content project-content-wrapper" style={{
                        position: 'relative',
                        zIndex: 1,
                        textAlign: 'center',
                        maxWidth: '900px'
                    }}>
                        <span style={{
                            color: 'var(--highlight)',
                            fontSize: 'clamp(0.65rem, 1vw, 0.75rem)',
                            letterSpacing: '0.4em',
                            textTransform: 'uppercase',
                            display: 'block',
                            marginBottom: '1rem'
                        }}>
                            {project.tags || 'Creative / Interaction'}
                        </span>
                        <h3 style={{
                            fontSize: 'clamp(2.5rem, 7vw, 6rem)',
                            fontWeight: 200,
                            textTransform: 'uppercase',
                            margin: 0,
                            letterSpacing: '-0.02em',
                            lineHeight: 1
                        }}>
                            {project.title}
                        </h3>
                        <div style={{
                            marginTop: 'clamp(2rem, 5vw, 4rem)',
                            display: 'inline-block',
                            padding: '1rem 3rem',
                            border: '1px solid rgba(255,255,255,0.3)',
                            fontSize: 'clamp(0.65rem, 1vw, 0.75rem)',
                            textTransform: 'uppercase',
                            letterSpacing: '0.2em',
                            cursor: 'pointer',
                            transition: 'var(--transition-smooth)',
                            borderRadius: '3rem'
                        }}
                            className="view-project-btn"
                            onClick={() => project.link && window.open(project.link, '_blank')}
                        >
                            View Project
                        </div>
                    </div>
                </div>
            ))}

            {/* ── Show All Works CTA ── */}
            <div style={{
                padding: 'clamp(4rem, 8vh, 6rem) var(--gutter)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '2rem',
                position: 'relative',
                zIndex: 1,
                borderTop: '1px solid rgba(255,255,255,0.05)',
            }}>
                <span style={{
                    fontSize: 'clamp(0.6rem, 1vw, 0.7rem)',
                    letterSpacing: '0.5em',
                    textTransform: 'uppercase',
                    color: 'rgba(255,255,255,0.3)',
                }}>
                    There&apos;s more
                </span>
                <Link
                    href="/projects"
                    style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '1rem',
                        padding: '1.2rem 3.5rem',
                        border: '1px solid rgba(255,255,255,0.18)',
                        borderRadius: '4rem',
                        fontSize: 'clamp(0.7rem, 1.1vw, 0.85rem)',
                        textTransform: 'uppercase',
                        letterSpacing: '0.25em',
                        color: '#fff',
                        textDecoration: 'none',
                        transition: 'all 0.3s ease',
                        background: 'rgba(255,255,255,0.03)',
                    }}
                    onMouseEnter={e => {
                        (e.currentTarget as HTMLAnchorElement).style.background = 'rgba(255,255,255,0.08)';
                        (e.currentTarget as HTMLAnchorElement).style.borderColor = 'rgba(255,255,255,0.35)';
                    }}
                    onMouseLeave={e => {
                        (e.currentTarget as HTMLAnchorElement).style.background = 'rgba(255,255,255,0.03)';
                        (e.currentTarget as HTMLAnchorElement).style.borderColor = 'rgba(255,255,255,0.18)';
                    }}
                >
                    Show All Works
                    <span style={{ fontSize: '1rem', opacity: 0.7 }}>→</span>
                </Link>
            </div>

        </section>
    );
}
