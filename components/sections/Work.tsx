'use client';

import { useEffect, useRef } from 'react';
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
        description: 'A cinematic brand identity built around the art of precision engineering.',
        imageUrl: '/images/project-1.png',
        link: '',
    },
    {
        title: 'Architectural Void',
        tags: 'Visual Identity / Editorial',
        description: 'Minimal editorial design exploring negative space and typographic tension.',
        imageUrl: '/images/project-2.png',
        link: '',
    },
    {
        title: 'Technological Glow',
        tags: 'Cinematic Design / WebGL',
        description: 'An immersive WebGL experience that blurs the line between art and technology.',
        imageUrl: '/images/project-3.png',
        link: '',
    },
];

export default function Work({ data, bg }: WorkProps) {
    const sectionRef = useRef<HTMLDivElement>(null);
    const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

    // Show the 3 most recent projects
    const allProjects = (data && data.length > 0) ? data : defaultProjects;
    const displayProjects = allProjects.slice(0, 3);

    // Stagger reveal with IntersectionObserver
    useEffect(() => {
        const cards = cardRefs.current.filter(Boolean) as HTMLDivElement[];
        if (!cards.length) return;

        cards.forEach(c => {
            c.style.opacity = '0';
            c.style.transform = 'translateY(32px)';
            c.style.transition = 'none';
        });

        const observer = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const el = entry.target as HTMLDivElement;
                    const i = cards.indexOf(el);
                    setTimeout(() => {
                        el.style.transition = 'opacity 0.7s ease, transform 0.7s ease';
                        el.style.opacity = '1';
                        el.style.transform = 'translateY(0)';
                    }, i * 120);
                    observer.unobserve(el);
                }
            });
        }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

        cards.forEach(c => observer.observe(c));
        return () => observer.disconnect();
    }, [displayProjects]);

    return (
        <section
            id="work"
            ref={sectionRef}
            style={{
                background: 'var(--deep-black)',
                position: 'relative',
                padding: 'clamp(5rem, 12vh, 9rem) clamp(1.5rem, 6vw, 6rem)',
                overflow: 'hidden',
            }}
        >
            {/* Background */}
            {bg?.imageUrl && (
                <div style={{
                    position: 'absolute', inset: 0,
                    backgroundImage: `url("${bg.imageUrl}")`,
                    backgroundSize: 'cover',
                    backgroundPosition: bg.imagePosition || 'center',
                    opacity: 0.07, zIndex: 0, pointerEvents: 'none',
                    filter: 'blur(20px)',
                }} />
            )}
            <div style={{
                position: 'absolute', inset: 0,
                background: `rgba(0,0,0,${bg?.overlayOpacity ?? 0.92})`,
                zIndex: 0, pointerEvents: 'none',
            }} />

            <div style={{ position: 'relative', zIndex: 1, maxWidth: '1400px', margin: '0 auto' }}>

                {/* ── Header row ── */}
                <div style={{
                    display: 'flex',
                    alignItems: 'flex-end',
                    justifyContent: 'space-between',
                    marginBottom: 'clamp(2.5rem, 6vh, 4rem)',
                    flexWrap: 'wrap',
                    gap: '1.5rem',
                }}>
                    <div>
                        <span style={{
                            color: 'var(--highlight)',
                            fontSize: 'clamp(0.6rem, 1vw, 0.7rem)',
                            letterSpacing: '0.6em',
                            textTransform: 'uppercase',
                            display: 'block',
                            marginBottom: '1rem',
                            opacity: 0.85,
                        }}>
                            Portfolio Showcase
                        </span>
                        <h2 style={{
                            fontSize: 'clamp(2.5rem, 7vw, 5.5rem)',
                            fontWeight: 200,
                            textTransform: 'uppercase',
                            lineHeight: 0.9,
                            letterSpacing: '-0.04em',
                            margin: 0,
                        }}>
                            Selected<br />
                            <span style={{ fontWeight: 700, color: 'var(--accent-white)' }}>Works</span>
                        </h2>
                    </div>

                    <Link
                        href="/projects"
                        style={{
                            display: 'inline-flex', alignItems: 'center', gap: '0.6rem',
                            padding: '0.9rem 2rem',
                            border: '1px solid rgba(255,255,255,0.15)',
                            borderRadius: '3rem',
                            fontSize: '0.7rem', letterSpacing: '0.2em',
                            textTransform: 'uppercase', color: '#fff',
                            textDecoration: 'none', background: 'rgba(255,255,255,0.03)',
                            transition: 'all 0.3s ease',
                            flexShrink: 0,
                        }}
                        onMouseEnter={e => {
                            e.currentTarget.style.background = 'rgba(255,255,255,0.08)';
                            e.currentTarget.style.borderColor = 'rgba(255,255,255,0.3)';
                        }}
                        onMouseLeave={e => {
                            e.currentTarget.style.background = 'rgba(255,255,255,0.03)';
                            e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)';
                        }}
                    >
                        Show All Works <span style={{ opacity: 0.6 }}>→</span>
                    </Link>
                </div>

                {/* ── Projects Grid ── */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(min(340px, 100%), 1fr))',
                    gap: '1.25rem',
                }}>
                    {displayProjects.map((project, index) => (
                        <div
                            key={project.id ?? index}
                            ref={el => { cardRefs.current[index] = el; }}
                            style={{
                                background: 'rgba(255,255,255,0.025)',
                                border: '1px solid rgba(255,255,255,0.06)',
                                borderRadius: '1.25rem',
                                overflow: 'hidden',
                                cursor: project.link ? 'pointer' : 'default',
                                transition: 'border-color 0.3s ease, transform 0.3s ease',
                            }}
                            onClick={() => project.link && window.open(project.link, '_blank')}
                            onMouseEnter={e => {
                                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.16)';
                                e.currentTarget.style.transform = 'translateY(-4px)';
                            }}
                            onMouseLeave={e => {
                                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)';
                                e.currentTarget.style.transform = 'translateY(0)';
                            }}
                        >
                            {/* Thumbnail */}
                            <div style={{ position: 'relative', height: 220, overflow: 'hidden', background: 'rgba(255,255,255,0.03)' }}>
                                {project.imageUrl ? (
                                    <Image
                                        src={project.imageUrl}
                                        alt={project.title}
                                        fill
                                        style={{ objectFit: 'cover', transition: 'transform 0.5s ease' }}
                                        onMouseOver={e => { (e.currentTarget as HTMLImageElement).style.transform = 'scale(1.06)'; }}
                                        onMouseOut={e => { (e.currentTarget as HTMLImageElement).style.transform = 'scale(1)'; }}
                                    />
                                ) : (
                                    <div style={{
                                        width: '100%', height: '100%',
                                        background: 'linear-gradient(135deg, rgba(255,255,255,0.04), rgba(255,255,255,0.01))',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        fontSize: '3rem', opacity: 0.15,
                                    }}>
                                        🎨
                                    </div>
                                )}

                                {/* Index badge */}
                                <div style={{
                                    position: 'absolute', top: 12, left: 14,
                                    fontSize: '0.58rem', letterSpacing: '0.12em',
                                    color: 'rgba(255,255,255,0.5)',
                                    background: 'rgba(0,0,0,0.55)',
                                    backdropFilter: 'blur(8px)',
                                    padding: '0.2rem 0.6rem', borderRadius: '20px',
                                    border: '1px solid rgba(255,255,255,0.07)',
                                }}>
                                    {String(index + 1).padStart(2, '0')}
                                </div>

                                {/* Latest badge on first card */}
                                {index === 0 && (
                                    <div style={{
                                        position: 'absolute', top: 12, right: 14,
                                        fontSize: '0.55rem', letterSpacing: '0.15em', textTransform: 'uppercase',
                                        color: 'rgba(229,9,20,0.9)',
                                        background: 'rgba(229,9,20,0.1)',
                                        border: '1px solid rgba(229,9,20,0.25)',
                                        padding: '0.2rem 0.65rem', borderRadius: '20px',
                                    }}>
                                        Latest
                                    </div>
                                )}
                            </div>

                            {/* Info */}
                            <div style={{ padding: '1.4rem 1.5rem 1.6rem' }}>
                                <span style={{
                                    fontSize: '0.6rem', letterSpacing: '0.25em',
                                    textTransform: 'uppercase', color: 'rgba(229,9,20,0.8)',
                                    display: 'block', marginBottom: '0.5rem',
                                }}>
                                    {project.tags || 'Creative / Digital'}
                                </span>
                                <h3 style={{
                                    fontSize: 'clamp(1rem, 2.5vw, 1.25rem)',
                                    fontWeight: 600, color: '#fff',
                                    margin: '0 0 0.6rem', lineHeight: 1.2,
                                    textTransform: 'uppercase', letterSpacing: '0.02em',
                                }}>
                                    {project.title}
                                </h3>
                                {project.description && (
                                    <p style={{
                                        fontSize: '0.8rem', color: 'rgba(255,255,255,0.38)',
                                        margin: 0, lineHeight: 1.65,
                                        display: '-webkit-box', WebkitLineClamp: 2,
                                        WebkitBoxOrient: 'vertical', overflow: 'hidden',
                                    } as React.CSSProperties}>
                                        {project.description}
                                    </p>
                                )}
                                {project.link && (
                                    <div style={{
                                        marginTop: '1rem', fontSize: '0.6rem',
                                        letterSpacing: '0.2em', textTransform: 'uppercase',
                                        color: 'rgba(255,255,255,0.22)',
                                        display: 'flex', alignItems: 'center', gap: '0.4rem',
                                    }}>
                                        View Project ↗
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>

                {/* ── Bottom count + show all ── */}
                <div style={{
                    marginTop: '2.5rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: '1rem',
                    paddingTop: '2rem',
                    borderTop: '1px solid rgba(255,255,255,0.05)',
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <div style={{ width: 32, height: '1px', background: 'rgba(255,255,255,0.12)' }} />
                        <span style={{
                            fontSize: '0.65rem', letterSpacing: '0.25em',
                            textTransform: 'uppercase', color: 'rgba(255,255,255,0.22)',
                        }}>
                            Showing {displayProjects.length} of {allProjects.length} projects
                        </span>
                    </div>
                    <Link
                        href="/projects"
                        style={{
                            fontSize: '0.65rem', letterSpacing: '0.2em',
                            textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)',
                            textDecoration: 'none', transition: 'color 0.2s',
                        }}
                        onMouseEnter={e => { e.currentTarget.style.color = '#fff'; }}
                        onMouseLeave={e => { e.currentTarget.style.color = 'rgba(255,255,255,0.4)'; }}
                    >
                        View all projects →
                    </Link>
                </div>
            </div>
        </section>
    );
}
