'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

const technologies = [
    { name: 'JavaScript', type: 'Language' },
    { name: 'TypeScript', type: 'Language' },
    { name: 'React', type: 'Framework' },
    { name: 'Next.js', type: 'Framework' },
    { name: 'GSAP', type: 'Motion' },
    { name: 'Three.js', type: '3D/WebGL' },
    { name: 'Tailwind', type: 'CSS' },
    { name: 'Figma', type: 'Design' },
    { name: 'Photoshop', type: 'Design' },
    { name: 'After Effects', type: 'Motion' },
    { name: 'Illustrator', type: 'Vector' },
];

export default function Technical() {
    const sectionRef = useRef<HTMLDivElement>(null);
    const triggerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        gsap.registerPlugin(ScrollTrigger);

        // Total number of horizontal panels (Intro + Techno cards)
        const totalPanels = technologies.length + 1;

        const ctx = gsap.context(() => {
            gsap.to(sectionRef.current, {
                x: () => -(sectionRef.current!.scrollWidth - window.innerWidth),
                ease: 'none',
                scrollTrigger: {
                    trigger: triggerRef.current,
                    pin: true,
                    scrub: 0.5,
                    start: 'top top',
                    end: () => `+=${sectionRef.current!.scrollWidth - window.innerWidth}`,
                    invalidateOnRefresh: true
                },
            });
        });

        return () => ctx.revert();
    }, []);

    return (
        <div id="tech" ref={triggerRef} style={{ overflow: 'hidden', background: 'var(--deep-black)' }}>
            <div
                ref={sectionRef}
                style={{
                    height: '100vh',
                    width: 'fit-content',
                    display: 'flex',
                    flexDirection: 'row',
                    position: 'relative',
                    alignItems: 'center',
                }}
            >
                {/* Intro Slide */}
                <div style={{ width: '100vw', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 var(--gutter)' }}>
                    <div className="section-content">
                        <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
                            <span style={{
                                color: 'var(--highlight)',
                                fontSize: 'clamp(0.65rem, 1vw, 0.75rem)',
                                letterSpacing: '0.6em',
                                textTransform: 'uppercase',
                                display: 'block',
                                marginBottom: '2rem',
                                opacity: 0.8
                            }}>
                                Expertise & Tools
                            </span>
                            <h2 style={{
                                fontSize: 'clamp(3rem, 10vw, 7.5rem)',
                                fontWeight: 200,
                                textTransform: 'uppercase',
                                lineHeight: 0.9,
                                letterSpacing: '-0.04em'
                            }}>
                                Technical<br />
                                <span style={{ fontWeight: 600, color: 'var(--accent-white)' }}>Mastery</span>
                            </h2>
                        </div>
                    </div>
                </div>

                {/* Tech Slides */}
                {technologies.map((tech, index) => (
                    <div
                        key={index}
                        style={{
                            width: '100vw',
                            height: '100%',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center',
                            alignItems: 'center',
                            position: 'relative',
                            padding: '0 var(--gutter)'
                        }}
                    >
                        <div className="tech-bg-number" style={{
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            fontSize: 'clamp(10rem, 30vw, 22rem)',
                            fontWeight: 900,
                            opacity: 0.015,
                            zIndex: 0,
                            pointerEvents: 'none',
                            userSelect: 'none'
                        }}>
                            {index + 1}
                        </div>

                        <div style={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
                            <span style={{
                                color: 'var(--highlight)',
                                fontSize: 'clamp(0.7rem, 1vw, 0.8rem)',
                                marginBottom: '1.2rem',
                                textTransform: 'uppercase',
                                letterSpacing: '0.3em',
                                display: 'block'
                            }}>
                                {tech.type}
                            </span>
                            <h3 style={{
                                fontSize: 'clamp(2rem, 8vw, 5rem)',
                                fontWeight: 300,
                                margin: 0,
                                textTransform: 'uppercase',
                                letterSpacing: '0.05em',
                                lineHeight: 1
                            }}>
                                {tech.name}
                            </h3>
                            <div style={{
                                width: 'min(60px, 15vw)',
                                height: '2px',
                                background: 'var(--highlight)',
                                margin: 'clamp(2rem, 5vw, 3.5rem) auto 0',
                                boxShadow: '0 0 15px rgba(229, 9, 20, 0.2)'
                            }} />
                        </div>
                    </div>
                ))}
            </div>

            <style jsx>{`
                @media (max-width: 768px) {
                    .tech-bg-number {
                        display: none !important;
                    }
                    .section-content {
                        padding: 0 1rem !important;
                    }
                }
            `}</style>
        </div>
    );
}
