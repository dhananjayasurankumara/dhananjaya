'use client';

import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface Project {
    id?: number;
    title: string;
    description?: string;
    tags?: string;
    link?: string;
    imageUrl?: string;
}

export default function ProjectsPage() {
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('All');
    const headerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        fetch('/api/projects')
            .then(r => r.json())
            .then((d: Project[]) => {
                setProjects(Array.isArray(d) ? d : []);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, []);

    // Stagger reveal on load
    useEffect(() => {
        if (loading) return;
        const cards = document.querySelectorAll<HTMLElement>('.project-card');
        cards.forEach((card, i) => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(30px)';
            setTimeout(() => {
                card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, i * 80);
        });
    }, [projects, loading, filter]);

    // Unique tag categories
    const allTags = ['All', ...Array.from(new Set(
        projects.flatMap(p => (p.tags || '').split(',').map(t => t.trim())).filter(Boolean)
    ))];

    const displayed = filter === 'All'
        ? projects
        : projects.filter(p => (p.tags || '').toLowerCase().includes(filter.toLowerCase()));

    return (
        <div style={{ minHeight: '100vh', background: '#0a0a0a', color: '#fff', fontFamily: 'system-ui, -apple-system, sans-serif' }}>

            {/* ── Top Nav ── */}
            <nav style={{
                position: 'sticky', top: 0, zIndex: 100,
                background: 'rgba(10,10,10,0.9)',
                backdropFilter: 'blur(16px)',
                borderBottom: '1px solid rgba(255,255,255,0.05)',
                padding: '0 clamp(1.5rem, 5vw, 4rem)',
                height: 60,
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            }}>
                <Link href="/" style={{
                    fontSize: '0.7rem', fontWeight: 800, letterSpacing: '0.3em',
                    textTransform: 'uppercase', color: '#fff', textDecoration: 'none',
                }}>
                    ← DANANJAYA
                </Link>
                <span style={{
                    fontSize: '0.6rem', letterSpacing: '0.3em', textTransform: 'uppercase',
                    color: 'rgba(255,255,255,0.3)',
                }}>
                    All Projects
                </span>
            </nav>

            <main style={{ maxWidth: 1400, margin: '0 auto', padding: 'clamp(3rem, 8vh, 6rem) clamp(1.5rem, 5vw, 4rem)' }}>

                {/* ── Header ── */}
                <div ref={headerRef} style={{ marginBottom: 'clamp(3rem, 6vh, 5rem)' }}>
                    <span style={{
                        color: 'rgba(229,9,20,0.9)', fontSize: '0.65rem', letterSpacing: '0.6em',
                        textTransform: 'uppercase', display: 'block', marginBottom: '1.5rem', opacity: 0.85,
                    }}>
                        Portfolio Showcase
                    </span>
                    <h1 style={{
                        fontSize: 'clamp(2.5rem, 8vw, 6rem)', fontWeight: 200,
                        textTransform: 'uppercase', margin: 0,
                        lineHeight: 0.9, letterSpacing: '-0.03em',
                    }}>
                        All<br />
                        <span style={{ fontWeight: 700 }}>Works</span>
                    </h1>
                    <p style={{
                        marginTop: '1.5rem', color: 'rgba(255,255,255,0.3)',
                        fontSize: 'clamp(0.75rem, 1.2vw, 0.9rem)',
                        maxWidth: 500, lineHeight: 1.7,
                    }}>
                        A complete collection of projects spanning motion design, web development, branding, and creative direction.
                    </p>
                </div>

                {/* ── Filter Tags ── */}
                {!loading && allTags.length > 1 && (
                    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '3rem' }}>
                        {allTags.map(tag => (
                            <button
                                key={tag}
                                onClick={() => setFilter(tag)}
                                style={{
                                    padding: '0.45rem 1.1rem',
                                    borderRadius: '3rem',
                                    border: `1px solid ${filter === tag ? 'rgba(255,255,255,0.3)' : 'rgba(255,255,255,0.07)'}`,
                                    background: filter === tag ? 'rgba(255,255,255,0.08)' : 'transparent',
                                    color: filter === tag ? '#fff' : 'rgba(255,255,255,0.4)',
                                    fontSize: '0.65rem', fontWeight: 600,
                                    letterSpacing: '0.15em', textTransform: 'uppercase',
                                    cursor: 'pointer', fontFamily: 'inherit',
                                    transition: 'all 0.2s',
                                }}
                            >
                                {tag}
                            </button>
                        ))}
                    </div>
                )}

                {/* ── Loading state ── */}
                {loading && (
                    <div style={{ textAlign: 'center', padding: '6rem', color: 'rgba(255,255,255,0.2)', fontSize: '0.75rem', letterSpacing: '0.3em', textTransform: 'uppercase' }}>
                        Loading projects…
                    </div>
                )}

                {/* ── Empty state ── */}
                {!loading && displayed.length === 0 && (
                    <div style={{
                        textAlign: 'center', padding: '6rem 2rem',
                        border: '1px solid rgba(255,255,255,0.06)', borderRadius: '16px',
                    }}>
                        <div style={{ fontSize: '2rem', marginBottom: '1rem', opacity: 0.4 }}>🗂</div>
                        <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.85rem', letterSpacing: '0.1em' }}>
                            {filter !== 'All' ? `No projects tagged "${filter}"` : 'No projects added yet — add them from the admin panel.'}
                        </p>
                        <Link href="/admin" style={{
                            display: 'inline-block', marginTop: '1.5rem',
                            padding: '0.65rem 1.5rem', border: '1px solid rgba(255,255,255,0.12)',
                            borderRadius: '8px', color: 'rgba(255,255,255,0.5)', fontSize: '0.7rem',
                            letterSpacing: '0.15em', textTransform: 'uppercase', textDecoration: 'none',
                        }}>
                            → Open Admin Panel
                        </Link>
                    </div>
                )}

                {/* ── Projects Grid ── */}
                {!loading && displayed.length > 0 && (
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(min(360px, 100%), 1fr))',
                        gap: '1.5rem',
                    }}>
                        {displayed.map((project, i) => (
                            <div
                                key={project.id ?? i}
                                className="project-card"
                                style={{
                                    background: 'rgba(255,255,255,0.025)',
                                    border: '1px solid rgba(255,255,255,0.06)',
                                    borderRadius: '16px',
                                    overflow: 'hidden',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    cursor: 'pointer',
                                    transition: 'border-color 0.3s ease, transform 0.3s ease',
                                }}
                                onMouseEnter={e => {
                                    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.18)';
                                    e.currentTarget.style.transform = 'translateY(-4px)';
                                }}
                                onMouseLeave={e => {
                                    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)';
                                    e.currentTarget.style.transform = 'translateY(0)';
                                }}
                                onClick={() => project.link && window.open(project.link, '_blank')}
                            >
                                {/* Image */}
                                <div style={{
                                    position: 'relative', height: 220,
                                    background: 'rgba(255,255,255,0.03)',
                                    flexShrink: 0,
                                    overflow: 'hidden',
                                }}>
                                    {project.imageUrl ? (
                                        <Image
                                            src={project.imageUrl}
                                            alt={project.title}
                                            fill
                                            style={{ objectFit: 'cover', transition: 'transform 0.4s ease' }}
                                            onMouseOver={e => { (e.currentTarget as HTMLImageElement).style.transform = 'scale(1.05)'; }}
                                            onMouseOut={e => { (e.currentTarget as HTMLImageElement).style.transform = 'scale(1)'; }}
                                        />
                                    ) : (
                                        <div style={{
                                            width: '100%', height: '100%',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            fontSize: '3rem', opacity: 0.15,
                                        }}>
                                            🎨
                                        </div>
                                    )}

                                    {/* Index badge */}
                                    <div style={{
                                        position: 'absolute', top: 12, left: 14,
                                        fontSize: '0.6rem', letterSpacing: '0.15em',
                                        color: 'rgba(255,255,255,0.4)',
                                        background: 'rgba(0,0,0,0.5)',
                                        backdropFilter: 'blur(8px)',
                                        padding: '0.2rem 0.6rem',
                                        borderRadius: '20px',
                                        border: '1px solid rgba(255,255,255,0.06)',
                                    }}>
                                        {String(i + 1).padStart(2, '0')}
                                    </div>
                                </div>

                                {/* Content */}
                                <div style={{ padding: '1.5rem', flex: 1, display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                                    {project.tags && (
                                        <span style={{
                                            fontSize: '0.6rem', letterSpacing: '0.25em',
                                            textTransform: 'uppercase', color: 'rgba(229,9,20,0.85)',
                                        }}>
                                            {project.tags}
                                        </span>
                                    )}
                                    <h2 style={{
                                        fontSize: 'clamp(1rem, 2.5vw, 1.3rem)',
                                        fontWeight: 600, margin: 0,
                                        color: '#fff', letterSpacing: '-0.01em', lineHeight: 1.2,
                                    }}>
                                        {project.title}
                                    </h2>
                                    {project.description && (
                                        <p style={{
                                            fontSize: '0.8rem', color: 'rgba(255,255,255,0.4)',
                                            margin: 0, lineHeight: 1.6,
                                            display: '-webkit-box',
                                            WebkitLineClamp: 2,
                                            WebkitBoxOrient: 'vertical',
                                            overflow: 'hidden',
                                        }}>
                                            {project.description}
                                        </p>
                                    )}
                                    {project.link && (
                                        <div style={{
                                            marginTop: 'auto', paddingTop: '1rem',
                                            fontSize: '0.65rem', letterSpacing: '0.2em',
                                            textTransform: 'uppercase', color: 'rgba(255,255,255,0.35)',
                                            display: 'flex', alignItems: 'center', gap: '0.5rem',
                                        }}>
                                            View Project <span>↗</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* ── Count ── */}
                {!loading && displayed.length > 0 && (
                    <div style={{
                        marginTop: '3rem', display: 'flex', alignItems: 'center', gap: '1rem',
                        borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '2rem',
                    }}>
                        <div style={{ width: 32, height: '1px', background: 'rgba(255,255,255,0.12)' }} />
                        <span style={{ fontSize: '0.65rem', letterSpacing: '0.25em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.25)' }}>
                            {displayed.length} Project{displayed.length !== 1 ? 's' : ''}
                        </span>
                    </div>
                )}
            </main>
        </div>
    );
}
