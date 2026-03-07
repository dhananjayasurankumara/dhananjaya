'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Image from 'next/image';

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

export default function Work({ data }: WorkProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const displayProjects = data && data.length > 0 ? data : defaultProjects;

    useEffect(() => {
        gsap.registerPlugin(ScrollTrigger);

        const panels = gsap.utils.toArray('.project-panel');

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
        });
    }, [displayProjects]);

    return (
        <section id="work" ref={containerRef} style={{ background: 'var(--deep-black)' }}>
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
                    padding: 'var(--spacing-xl) var(--gutter)'
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
                    <p style={{
                        maxWidth: '500px',
                        margin: 'clamp(2rem, 5vw, 4rem) auto 0',
                        fontSize: 'clamp(0.9rem, 1.2vw, 1.1rem)',
                        lineHeight: 1.6,
                        opacity: 0.5,
                        fontWeight: 300,
                        letterSpacing: '0.02em'
                    }}>
                        A curated collection of digital experiences where cinematic aesthetics meet technical precision.
                    </p>
                </div>
            </div>

            {displayProjects.map((project, index) => (
                <div
                    key={index}
                    className="project-panel"
                    style={{
                        minHeight: '100vh', // Changed to minHeight
                        width: '100%',
                        position: 'relative',
                        overflow: 'hidden',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: '10vh var(--gutter)'
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
                            {project.tags}
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
                            padding: '1rem 3rem', // Larger touch area
                            border: '1px solid rgba(255,255,255,0.3)',
                            fontSize: 'clamp(0.65rem, 1vw, 0.75rem)',
                            textTransform: 'uppercase',
                            letterSpacing: '0.2em',
                            cursor: 'pointer',
                            transition: 'var(--transition-smooth)',
                            borderRadius: '3rem' // More modern pill shape
                        }}
                            className="view-project-btn"
                            onClick={() => project.link && window.open(project.link, '_blank')}
                        >
                            View Project
                        </div>
                    </div>
                </div>
            ))}

            <style jsx>{`
                @media (max-width: 768px) {
                    .project-panel {
                        min-height: 80vh !important;
                    }
                    .project-content-wrapper {
                        padding: 0 1rem !important;
                    }
                }
            `}</style>
        </section>
    );
}
