'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import gsap from 'gsap';
import Link from 'next/link';


const navItems = [
    { name: 'Philosophy', href: '#philosophy' },
    { name: 'About', href: '#about' },
    { name: 'Tech', href: '#tech' },
    { name: 'Work', href: '#work' },
];

interface NavbarProps {
    data?: {
        logoText?: string;
    };
}

export default function Navbar({ data }: NavbarProps) {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const navRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <>
            <motion.nav
                ref={navRef}
                initial={{ y: -100 }}
                animate={{ y: 0 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    width: '100%',
                    zIndex: 1000,
                    padding: isScrolled ? '1rem clamp(1.5rem, 4vw, 4rem)' : '2rem clamp(1.5rem, 4vw, 4rem)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    transition: 'padding 0.4s cubic-bezier(0.165, 0.84, 0.44, 1), background 0.4s ease, backdrop-filter 0.4s ease',
                    background: isScrolled ? 'rgba(5, 5, 5, 0.8)' : 'transparent',
                    backdropFilter: isScrolled ? 'blur(20px)' : 'none',
                    borderBottom: isScrolled ? '1px solid rgba(255, 255, 255, 0.05)' : 'none',
                }}
            >
                <Link href="/" style={{ fontSize: '1rem', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase' }}>
                    {data?.logoText || "DANANJAYA"}
                </Link>

                {/* Desktop Menu */}
                <div className="desktop-nav" style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
                    <div style={{ display: 'flex', gap: '2.5rem', alignItems: 'center' }}>
                        {navItems.map((item) => (
                            <MagneticLink key={item.name} href={item.href}>
                                {item.name}
                            </MagneticLink>
                        ))}
                    </div>

                    <span style={{ opacity: 0.2, fontWeight: 200, fontSize: '0.8rem' }}>|</span>

                    <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
                        <MagneticLink href="#support">
                            Support
                        </MagneticLink>

                        <span style={{ opacity: 0.2, fontWeight: 200, fontSize: '0.8rem' }}>|</span>

                        <Link
                            href="#contact"
                            style={{
                                padding: '0.6rem 1.4rem',
                                fontSize: '0.65rem',
                                fontWeight: 500,
                                letterSpacing: '0.2em',
                                textTransform: 'uppercase',
                                color: 'var(--accent-white)',
                                border: '1px solid rgba(255, 255, 255, 0.1)',
                                borderRadius: '2rem',
                                transition: 'all 0.4s cubic-bezier(0.165, 0.84, 0.44, 1)',
                                background: 'transparent',
                                position: 'relative',
                                overflow: 'hidden'
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.borderColor = 'var(--accent-white)';
                                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                                e.currentTarget.style.transform = 'translateY(-2px)';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                                e.currentTarget.style.background = 'transparent';
                                e.currentTarget.style.transform = 'translateY(0)';
                            }}
                        >
                            Let's Talk
                        </Link>
                    </div>
                </div>

                {/* Mobile Menu Toggle */}
                <button
                    className="mobile-toggle"
                    onClick={() => setIsMobileMenuOpen(true)}
                    style={{
                        display: 'none',
                        background: 'none',
                        border: 'none',
                        color: 'var(--accent-white)',
                        cursor: 'pointer',
                        padding: '0.5rem',
                        flexDirection: 'column',
                        gap: '6px'
                    }}
                >
                    <div style={{ width: '24px', height: '1px', background: 'currentColor' }} />
                    <div style={{ width: '24px', height: '1px', background: 'currentColor' }} />
                </button>
            </motion.nav>

            <style jsx>{`
                @media (max-width: 1024px) {
                    .desktop-nav { display: none !important; }
                    .mobile-toggle { display: flex !important; }
                }
            `}</style>

            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, x: '100%' }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: '100%' }}
                        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                        style={{
                            position: 'fixed',
                            inset: 0,
                            background: 'var(--deep-black)',
                            zIndex: 2000,
                            display: 'flex',
                            flexDirection: 'column',
                            padding: '2rem'
                        }}
                    >
                        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '4rem' }}>
                            <button
                                onClick={() => setIsMobileMenuOpen(false)}
                                style={{ background: 'none', border: 'none', color: 'var(--soft-grey)', fontSize: '2rem', cursor: 'pointer' }}
                            >
                                &times;
                            </button>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                            {navItems.map((item) => (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    style={{ fontSize: '2.5rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em' }}
                                >
                                    {item.name}
                                </Link>
                            ))}
                            <div style={{ width: '100%', height: '1px', background: 'rgba(255,255,255,0.1)', margin: '1rem 0' }} />
                            <Link
                                href="#support"
                                onClick={() => setIsMobileMenuOpen(false)}
                                style={{ fontSize: '1.5rem', color: 'var(--soft-grey)', textTransform: 'uppercase' }}
                            >
                                Support
                            </Link>
                            <Link
                                href="#contact"
                                onClick={() => setIsMobileMenuOpen(false)}
                                style={{ fontSize: '1.5rem', color: 'var(--highlight)', textTransform: 'uppercase' }}
                            >
                                Let's Talk
                            </Link>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}

function MagneticLink({ children, href }: { children: string; href: string }) {
    return (
        <Link
            href={href}
            style={{
                fontSize: '0.75rem',
                textTransform: 'uppercase',
                letterSpacing: '0.2em',
                color: 'var(--soft-grey)',
                transition: 'color 0.3s ease',
                display: 'inline-block',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--accent-white)')}
            onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--soft-grey)')}
        >
            {children}
        </Link>
    );
}
