'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';

interface NavbarProps {
    data?: { logoText?: string; };
}

// Nav items - hash links only work on home page
const portfolioItems = [
    { name: 'Philosophy', href: '#philosophy' },
    { name: 'About', href: '#about' },
    { name: 'Tech', href: '#tech' },
    { name: 'Work', href: '#work' },
];

export default function Navbar({ data }: NavbarProps) {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [currentUser, setCurrentUser] = useState<{ name: string; role: string } | null>(null);
    const [navLinks, setNavLinks] = useState<any[]>([]);
    const [isMounted, setIsMounted] = useState(false);
    const router = useRouter();
    const pathname = usePathname();
    const isHome = pathname === '/';

    useEffect(() => {
        setIsMounted(true);
        const handleScroll = () => setIsScrolled(window.scrollY > 50);
        window.addEventListener('scroll', handleScroll);

        // Fetch user session
        fetch('/api/auth/me')
            .then(r => r.ok ? r.json() : null)
            .then(d => { setCurrentUser(d?.user ?? null); });

        // Fetch navigation links from public endpoint (no auth required)
        fetch('/api/nav-links')
            .then(r => r.ok ? r.json() : [])
            .then(d => {
                const links = Array.isArray(d) ? d : [];
                setNavLinks(links.sort((a: any, b: any) => (a.displayOrder || 0) - (b.displayOrder || 0)));
            });

        return () => window.removeEventListener('scroll', handleScroll);
    }, [pathname]);

    async function handleLogout() {
        await fetch('/api/auth/logout', { method: 'POST' });
        setCurrentUser(null);
        router.push('/');
    }

    const linkStyle = {
        fontSize: '0.75rem',
        textTransform: 'uppercase' as const,
        letterSpacing: '0.2em',
        color: 'rgba(255,255,255,0.55)',
        transition: 'color 0.3s ease',
        display: 'inline-block',
        textDecoration: 'none',
    };

    return (
        <>
            <motion.nav
                initial={{ y: -100 }}
                animate={{ y: 0 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                style={{
                    position: 'fixed', top: 0, left: 0, width: '100%', zIndex: 1000,
                    padding: isScrolled ? '1rem clamp(1.5rem, 4vw, 4rem)' : '2rem clamp(1.5rem, 4vw, 4rem)',
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    transition: 'padding 0.4s ease, background 0.4s ease, backdrop-filter 0.4s ease',
                    background: isScrolled ? 'rgba(5,5,5,0.85)' : 'transparent',
                    backdropFilter: isScrolled ? 'blur(20px)' : 'none',
                    borderBottom: isScrolled ? '1px solid rgba(255,255,255,0.05)' : 'none',
                }}
            >
                {/* Logo */}
                <Link href="/" style={{ fontSize: '1rem', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', textDecoration: 'none', color: '#fff' }}>
                    {data?.logoText || 'DANANJAYA'}
                </Link>

                {/* Desktop nav */}
                <div className="desktop-nav" style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
                    
                    {/* Dynamic Links from DB */}
                    <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
                        {navLinks.map((link, idx) => {
                            const isExternal = link.type === 'external' || link.href.startsWith('http');
                            const isHash = link.type === 'hash' || link.href.startsWith('#');
                            
                            // For hash links, only show on home page OR if it's already on home
                            if (isHash && !isHome) return null;

                            if (isHash) {
                                return (
                                    <a key={link.id} href={link.href} style={linkStyle}
                                        onMouseEnter={e => (e.currentTarget.style.color = '#fff')}
                                        onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.55)')}>
                                        {link.label}
                                    </a>
                                );
                            }

                            return (
                                <Link key={link.id} href={link.href} style={linkStyle}
                                    target={isExternal ? "_blank" : undefined}
                                    onMouseEnter={e => (e.currentTarget.style.color = '#fff')}
                                    onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.55)')}>
                                    {link.label}
                                </Link>
                            );
                        })}
                    </div>

                    {navLinks.length > 0 && <span style={{ opacity: 0.15, fontWeight: 200, fontSize: '0.8rem' }}>|</span>}

                    {/* Auth area */}
                    {isMounted && (
                        currentUser ? (
                            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                                <Link href="/profile" style={linkStyle}
                                    onMouseEnter={e => (e.currentTarget.style.color = '#fff')}
                                    onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.55)')}>
                                    {currentUser.name}
                                </Link>
                                <button onClick={handleLogout} style={{
                                    padding: '0.5rem 1.1rem', fontSize: '0.6rem', fontWeight: 500,
                                    letterSpacing: '0.15em', textTransform: 'uppercase',
                                    color: 'rgba(255,255,255,0.45)', border: '1px solid rgba(255,255,255,0.08)',
                                    borderRadius: '2rem', background: 'transparent', cursor: 'pointer',
                                    transition: 'all 0.3s', fontFamily: 'inherit',
                                }}
                                    onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(255,80,80,0.3)'; e.currentTarget.style.color = 'rgba(255,100,100,0.8)'; }}
                                    onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; e.currentTarget.style.color = 'rgba(255,255,255,0.45)'; }}>
                                    Logout
                                </button>
                            </div>
                        ) : (
                            <Link href="/login" style={{
                                padding: '0.6rem 1.4rem', fontSize: '0.65rem', fontWeight: 600,
                                letterSpacing: '0.2em', textTransform: 'uppercase', color: '#fff',
                                border: '1px solid rgba(255,255,255,0.15)', borderRadius: '2rem',
                                transition: 'all 0.3s ease', background: 'transparent', textDecoration: 'none', display: 'inline-block',
                            }}
                                onMouseEnter={e => { e.currentTarget.style.borderColor = '#fff'; e.currentTarget.style.background = 'rgba(255,255,255,0.07)'; }}
                                onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)'; e.currentTarget.style.background = 'transparent'; }}>
                                Login
                            </Link>
                        )
                    )}
                </div>

                {/* Mobile toggle */}
                <button className="mobile-toggle" onClick={() => setIsMobileMenuOpen(true)} style={{
                    display: 'none', background: 'none', border: 'none', color: '#fff',
                    cursor: 'pointer', padding: '0.5rem', flexDirection: 'column', gap: '6px',
                }}>
                    <div style={{ width: '24px', height: '1px', background: 'currentColor' }} />
                    <div style={{ width: '24px', height: '1px', background: 'currentColor' }} />
                </button>
            </motion.nav>

            {/* Mobile menu */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div key="mobile-menu" initial={{ opacity: 0, x: '100%' }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: '100%' }}
                        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                        style={{ position: 'fixed', inset: 0, background: '#050505', zIndex: 2000, display: 'flex', flexDirection: 'column', padding: '2rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '4rem' }}>
                            <button onClick={() => setIsMobileMenuOpen(false)} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.5)', fontSize: '2rem', cursor: 'pointer' }}>×</button>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                            {navLinks.map((link) => {
                                const isExternal = link.type === 'external' || link.href.startsWith('http');
                                const isHash = link.type === 'hash' || link.href.startsWith('#');

                                if (isHash && !isHome) return null;

                                if (isHash) {
                                    return (
                                        <a key={link.id} href={link.href} onClick={() => setIsMobileMenuOpen(false)}
                                            style={{ fontSize: '2.5rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#fff', textDecoration: 'none' }}>
                                            {link.label}
                                        </a>
                                    );
                                }

                                return (
                                    <Link key={link.id} href={link.href} onClick={() => setIsMobileMenuOpen(false)}
                                        target={isExternal ? "_blank" : undefined}
                                        style={{ fontSize: '2.5rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#fff', textDecoration: 'none' }}>
                                        {link.label}
                                    </Link>
                                );
                            })}
                            
                            <div style={{ width: '100%', height: '1px', background: 'rgba(255,255,255,0.08)' }} />
                            {isMounted && (
                                currentUser ? (
                                    <>
                                        <Link href="/profile" onClick={() => setIsMobileMenuOpen(false)}
                                            style={{ fontSize: '1.5rem', color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase', textDecoration: 'none' }}>
                                            {currentUser.name}
                                        </Link>
                                        <button onClick={() => { handleLogout(); setIsMobileMenuOpen(false); }}
                                            style={{ fontSize: '1.2rem', textTransform: 'uppercase', background: 'none', border: 'none', color: 'rgba(255,80,80,0.7)', cursor: 'pointer', textAlign: 'left', fontFamily: 'inherit' }}>
                                            Logout
                                        </button>
                                    </>
                                ) : (
                                    <Link href="/login" onClick={() => setIsMobileMenuOpen(false)}
                                        style={{ fontSize: '1.5rem', color: 'rgba(255,255,255,0.7)', textTransform: 'uppercase', textDecoration: 'none' }}>
                                        Login
                                    </Link>
                                )
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
