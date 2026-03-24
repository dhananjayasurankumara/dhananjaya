'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
    const [activeTag, setActiveTag] = useState('all');
    const [selected, setSelected] = useState<Project | null>(null);
    const [bg, setBg] = useState<any>(null);

    useEffect(() => {
        fetch('/api/projects')
            .then(r => r.json())
            .then((d: Project[]) => { setProjects(Array.isArray(d) ? d : []); setLoading(false); })
            .catch(() => setLoading(false));

        // Match shop background loading
        fetch('/api/content').then(r => r.json()).then(data => {
            if (data.backgrounds) {
                const projBg = data.backgrounds.find((b: any) => b.section === 'work');
                setBg(projBg);
            }
        }).catch(() => {});
    }, []);

    // Close popup with Escape
    useEffect(() => {
        const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') setSelected(null); };
        window.addEventListener('keydown', handler);
        return () => window.removeEventListener('keydown', handler);
    }, []);

    // Unique tags from all projects
    const allTags = ['all', ...Array.from(new Set(
        projects.flatMap(p => (p.tags || '').split(',').map(t => t.trim())).filter(Boolean)
    ))];

    const filtered = activeTag === 'all'
        ? projects
        : projects.filter(p => (p.tags || '').toLowerCase().includes(activeTag.toLowerCase()));

    return (
        <div style={{ minHeight: '100vh', background: '#050505', paddingTop: '5rem', position: 'relative', overflow: 'hidden' }}>

            {/* Dynamic Background */}
            {bg?.imageUrl && (
                <div style={{
                    position: 'absolute', inset: 0,
                    backgroundImage: `url("${bg.imageUrl}")`,
                    backgroundSize: 'cover',
                    backgroundPosition: bg.imagePosition || 'center',
                    opacity: 0.15, zIndex: 0, pointerEvents: 'none',
                    filter: 'blur(10px)',
                }} />
            )}
            <div style={{
                position: 'absolute', inset: 0,
                background: `rgba(0,0,0,${bg?.overlayOpacity || 0.9})`,
                zIndex: 0, pointerEvents: 'none',
            }} />

            {/* Content Wrap */}
            <div style={{ position: 'relative', zIndex: 1 }}>

                {/* ── Project Detail Popup ── */}
                <AnimatePresence>
                    {selected && (
                        <motion.div
                            key="popup-overlay"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            style={{ position: 'fixed', inset: 0, zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}
                        >
                            {/* Backdrop */}
                            <div
                                onClick={() => setSelected(null)}
                                style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(8px)' }}
                            />

                            {/* Modal */}
                            <motion.div
                                initial={{ opacity: 0, scale: 0.92, y: 24 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.92, y: 24 }}
                                transition={{ type: 'spring', damping: 28, stiffness: 300 }}
                                style={{
                                    position: 'relative',
                                    width: '100%', maxWidth: 680,
                                    background: '#0a0a0a',
                                    border: '1px solid rgba(255,255,255,0.08)',
                                    borderRadius: '1.5rem',
                                    overflow: 'hidden',
                                    boxShadow: '0 40px 80px rgba(0,0,0,0.6)',
                                }}
                            >
                                {/* Image */}
                                {selected.imageUrl && (
                                    <div style={{ position: 'relative', height: 300, width: '100%' }}>
                                        <Image src={selected.imageUrl} alt={selected.title} fill style={{ objectFit: 'cover' }} />
                                        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, transparent 50%, #0a0a0a)' }} />
                                    </div>
                                )}

                                {/* Body */}
                                <div style={{ padding: '2rem' }}>
                                    {/* Close */}
                                    <button
                                        onClick={() => setSelected(null)}
                                        style={{
                                            position: 'absolute', top: '1.25rem', right: '1.25rem',
                                            background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)',
                                            borderRadius: '50%', width: 36, height: 36, cursor: 'pointer',
                                            color: 'rgba(255,255,255,0.6)', fontSize: '1.1rem', lineHeight: 1,
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        }}
                                    >
                                        ×
                                    </button>

                                    {selected.tags && (
                                        <span style={{
                                            fontSize: '0.6rem', letterSpacing: '0.3em', textTransform: 'uppercase',
                                            color: 'rgba(229,9,20,0.85)', display: 'block', marginBottom: '0.75rem',
                                        }}>
                                            {selected.tags}
                                        </span>
                                    )}
                                    <h2 style={{
                                        fontSize: 'clamp(1.5rem, 4vw, 2.2rem)', fontWeight: 700, color: '#fff',
                                        margin: '0 0 1rem', letterSpacing: '-0.02em', lineHeight: 1.2,
                                    }}>
                                        {selected.title}
                                    </h2>
                                    {selected.description && (
                                        <p style={{
                                            fontSize: '0.9rem', color: 'rgba(255,255,255,0.45)',
                                            lineHeight: 1.75, margin: '0 0 1.75rem',
                                        }}>
                                            {selected.description}
                                        </p>
                                    )}
                                    {selected.link ? (
                                        <a
                                            href={selected.link}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            style={{
                                                display: 'inline-flex', alignItems: 'center', gap: '0.6rem',
                                                padding: '0.85rem 2rem',
                                                background: 'rgba(255,255,255,0.07)',
                                                border: '1px solid rgba(255,255,255,0.12)',
                                                borderRadius: '2rem', color: '#fff',
                                                fontSize: '0.7rem', fontWeight: 700,
                                                letterSpacing: '0.2em', textTransform: 'uppercase', textDecoration: 'none',
                                                transition: 'all 0.25s',
                                            }}
                                            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.12)'; }}
                                            onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.07)'; }}
                                        >
                                            View Project ↗
                                        </a>
                                    ) : (
                                        <span style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.2)', letterSpacing: '0.15em', textTransform: 'uppercase' }}>
                                            No link provided
                                        </span>
                                    )}
                                </div>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* ── Header ── */}
                <div style={{ padding: '2rem clamp(1.5rem, 5vw, 5rem) 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Link href="/" style={{ fontSize: '0.65rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.35)', textDecoration: 'none' }}>
                        ← Portfolio
                    </Link>
                </div>

                {/* ── Hero ── */}
                <div style={{ padding: '4rem clamp(1.5rem, 5vw, 5rem) 3rem', textAlign: 'center' }}>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                        style={{ fontSize: '0.65rem', letterSpacing: '0.4em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)', marginBottom: '1rem' }}
                    >
                        Portfolio Showcase
                    </motion.p>
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                        style={{ fontSize: 'clamp(2.5rem, 6vw, 5rem)', fontWeight: 800, letterSpacing: '-0.02em', color: '#fff', lineHeight: 1, margin: '0 0 1rem' }}
                    >
                        ALL WORKS
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
                        style={{ color: 'rgba(255,255,255,0.35)', maxWidth: '500px', margin: '0 auto', lineHeight: 1.7 }}
                    >
                        A complete collection spanning motion design, web development, branding, and creative direction.
                    </motion.p>
                </div>

                {/* ── Tag Filter ── */}
                <div style={{ padding: '0 clamp(1.5rem, 5vw, 5rem)', display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '3rem' }}>
                    {allTags.map(tag => (
                        <button
                            key={tag}
                            onClick={() => setActiveTag(tag)}
                            style={{
                                padding: '0.5rem 1.25rem',
                                background: activeTag === tag ? 'rgba(255,255,255,0.08)' : 'transparent',
                                border: `1px solid ${activeTag === tag ? 'rgba(255,255,255,0.15)' : 'rgba(255,255,255,0.06)'}`,
                                borderRadius: '2rem',
                                color: activeTag === tag ? '#fff' : 'rgba(255,255,255,0.4)',
                                fontSize: '0.65rem', fontWeight: 600,
                                letterSpacing: '0.2em', textTransform: 'uppercase',
                                cursor: 'pointer', transition: 'all 0.25s', fontFamily: 'inherit',
                            }}
                        >
                            {tag}
                        </button>
                    ))}
                </div>

                {/* ── Grid ── */}
                <div style={{ padding: '0 clamp(1.5rem, 5vw, 5rem) 6rem' }}>
                    {loading ? (
                        <div style={{ textAlign: 'center', color: 'rgba(255,255,255,0.3)', fontSize: '0.8rem', letterSpacing: '0.2em', textTransform: 'uppercase', padding: '5rem 0' }}>
                            Loading projects…
                        </div>
                    ) : filtered.length === 0 ? (
                        <div style={{ textAlign: 'center', color: 'rgba(255,255,255,0.25)', padding: '5rem 0' }}>
                            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🎨</div>
                            <p style={{ fontSize: '0.8rem', letterSpacing: '0.2em', textTransform: 'uppercase' }}>
                                {activeTag !== 'all' ? `No projects tagged "${activeTag}"` : 'No projects yet. Check back soon.'}
                            </p>
                        </div>
                    ) : (
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
                            {filtered.map((project, i) => (
                                <motion.div
                                    key={project.id ?? i}
                                    initial={{ opacity: 0, y: 30 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.07, duration: 0.5 }}
                                    style={{
                                        background: 'rgba(255,255,255,0.02)',
                                        border: '1px solid rgba(255,255,255,0.06)',
                                        borderRadius: '1.25rem',
                                        overflow: 'hidden',
                                        position: 'relative',
                                        cursor: 'pointer',
                                        transition: 'transform 0.3s ease, border-color 0.3s ease',
                                    }}
                                    onClick={() => setSelected(project)}
                                    onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.14)'; e.currentTarget.style.transform = 'translateY(-4px)'; }}
                                    onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)'; e.currentTarget.style.transform = 'translateY(0)'; }}
                                >
                                    {/* Thumbnail */}
                                    <div style={{
                                        height: '200px',
                                        background: project.imageUrl
                                            ? `url(${project.imageUrl}) center/cover`
                                            : 'linear-gradient(135deg, rgba(255,255,255,0.04), rgba(255,255,255,0.01))',
                                        position: 'relative',
                                    }}>
                                        {/* Hover Overlay */}
                                        <div style={{
                                            position: 'absolute', inset: 0,
                                            background: 'rgba(0,0,0,0)',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            transition: 'background 0.3s',
                                        }}
                                            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(0,0,0,0.35)'; }}
                                            onMouseLeave={e => { e.currentTarget.style.background = 'rgba(0,0,0,0)'; }}
                                        >
                                            <span style={{
                                                fontSize: '0.6rem', letterSpacing: '0.25em', textTransform: 'uppercase',
                                                color: '#fff', opacity: 0, transition: 'opacity 0.3s',
                                                padding: '0.5rem 1rem', border: '1px solid rgba(255,255,255,0.3)', borderRadius: '2rem',
                                                background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(8px)',
                                            }}>
                                                View Details
                                            </span>
                                        </div>
                                    </div>

                                    {/* Info */}
                                    <div style={{ padding: '1.5rem' }}>
                                        {project.tags && (
                                            <span style={{ fontSize: '0.6rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(229,9,20,0.8)' }}>
                                                {project.tags.split(',')[0].trim()}
                                            </span>
                                        )}
                                        <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#fff', margin: '0.4rem 0 0.5rem', lineHeight: 1.3 }}>
                                            {project.title}
                                        </h3>
                                        {project.description && (
                                            <p style={{
                                                fontSize: '0.8rem', color: 'rgba(255,255,255,0.4)',
                                                lineHeight: 1.6, marginBottom: '0',
                                                display: '-webkit-box', WebkitLineClamp: 2,
                                                WebkitBoxOrient: 'vertical', overflow: 'hidden',
                                            } as any}>
                                                {project.description}
                                            </p>
                                        )}
                                        <div style={{
                                            marginTop: '1.25rem', fontSize: '0.6rem',
                                            letterSpacing: '0.2em', textTransform: 'uppercase',
                                            color: 'rgba(255,255,255,0.25)',
                                            display: 'flex', alignItems: 'center', gap: '0.4rem',
                                        }}>
                                            Click to view ↗
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
