'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

// Modular Tab Components
import DashboardTab from '@/components/admin/DashboardTab';
import HeroTab from '@/components/admin/HeroTab';
import AboutTab from '@/components/admin/AboutTab';
import PhilosophyTab from '@/components/admin/PhilosophyTab';
import TechnicalTab from '@/components/admin/TechnicalTab';
import ProjectsTab from '@/components/admin/ProjectsTab';
import PresenceTab from '@/components/admin/PresenceTab';
import SupportTab from '@/components/admin/SupportTab';
import ReviewsTab from '@/components/admin/ReviewsTab';
import ShopTab from '@/components/admin/ShopTab';
import NavLinksTab from '@/components/admin/NavLinksTab';
import MediaTab from '@/components/admin/MediaTab';
import UsersTab from '@/components/admin/UsersTab';
import MessagesTab from '@/components/admin/MessagesTab';
import ChatbotTab from '@/components/admin/ChatbotTab';
import SettingsTab from '@/components/admin/SettingsTab';

/* ─── Shared Theme (Keep for base layout) ────────────────────────────────── */
const S = {
    bg: '#0a0a0a',
    sidebar: '#0f0f0f',
    card: { background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '12px', padding: '1.5rem' } as React.CSSProperties,
    input: { width: '100%', padding: '0.7rem 0.9rem', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#fff', fontSize: '0.875rem', outline: 'none', boxSizing: 'border-box' as const, fontFamily: 'inherit', transition: 'border-color 0.2s' } as React.CSSProperties,
    label: { display: 'block', fontSize: '0.6rem', letterSpacing: '0.15em', textTransform: 'uppercase' as const, color: 'rgba(255,255,255,0.4)', marginBottom: '0.4rem' } as React.CSSProperties,
    btn: { padding: '0.55rem 1.1rem', background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '8px', color: '#fff', fontSize: '0.7rem', fontWeight: 600 as const, letterSpacing: '0.1em', textTransform: 'uppercase' as const, cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.2s' } as React.CSSProperties,
};

const NAV = [
    { id: 'dashboard', icon: '⊞', label: 'Dashboard' },
    { id: 'hero',      icon: '◉', label: 'Hero' },
    { id: 'about',     icon: '👤', label: 'About' },
    { id: 'philosophy',icon: '💡', label: 'Philosophy' },
    { id: 'technical', icon: '⚡', label: 'Technical' },
    { id: 'projects',  icon: '🗂', label: 'Projects' },
    { id: 'presence',  icon: '🔗', label: 'Presence' },
    { id: 'support',   icon: '🛟', label: 'Support' },
    { id: 'reviews',   icon: '⭐', label: 'Reviews' },
    { id: 'shop',      icon: '⬡', label: 'Shop' },
    { id: 'navlinks',  icon: '🧭', label: 'Nav Links' },
    { id: 'media',     icon: '🖼', label: 'Media / BG' },
    { id: 'users',     icon: '◇', label: 'Users' },
    { id: 'messages',  icon: '✉', label: 'Messages' },
    { id: 'chatbot',   icon: '🤖', label: 'Chatbot' },
    { id: 'settings',  icon: '⚙', label: 'Settings' },
];

export default function AdminPage() {
    const [authed, setAuthed] = useState(false);
    const [checking, setChecking] = useState(true);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loginError, setLoginError] = useState('');
    const [loginLoading, setLoginLoading] = useState(false);
    const [activeTab, setActiveTab] = useState('dashboard');
    const [sidebarOpen, setSidebarOpen] = useState(true);

    useEffect(() => {
        fetch('/api/auth/me')
            .then(r => r.ok ? r.json() : null)
            .then(d => { if (d?.user?.role === 'admin') setAuthed(true); })
            .finally(() => setChecking(false));
    }, []);

    async function handleAdminLogin(e: React.FormEvent) {
        e.preventDefault();
        setLoginLoading(true);
        setLoginError('');
        const res = await fetch('/api/admin/login', {
            method: 'POST', headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password }),
        });
        const data = await res.json();
        setLoginLoading(false);
        if (!res.ok) return setLoginError(data.error || 'Invalid credentials');
        setAuthed(true);
    }

    async function handleLogout() {
        await fetch('/api/auth/logout', { method: 'POST' });
        setAuthed(false);
    }

    if (checking) return (
        <div style={{ minHeight: '100vh', background: S.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.75rem', letterSpacing: '0.3em', textTransform: 'uppercase' }}>Loading…</div>
        </div>
    );

    if (!authed) return <LoginScreen username={username} password={password} setUsername={setUsername} setPassword={setPassword} onSubmit={handleAdminLogin} loading={loginLoading} error={loginError} />;

    const SIDEBAR_W = sidebarOpen ? 240 : 64;

    return (
        <div style={{ minHeight: '100vh', background: S.bg, display: 'flex', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
            {/* Sidebar */}
            <aside style={{
                width: SIDEBAR_W, flexShrink: 0,
                background: S.sidebar,
                borderRight: '1px solid rgba(255,255,255,0.055)',
                display: 'flex', flexDirection: 'column',
                position: 'fixed', top: 0, bottom: 0, left: 0,
                zIndex: 200, transition: 'width 0.25s ease',
                overflow: 'hidden',
            }}>
                <div style={{ padding: '1.5rem 1.25rem', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', minHeight: 72 }}>
                    {sidebarOpen && (
                        <div>
                            <div style={{ fontSize: '0.75rem', fontWeight: 800, letterSpacing: '0.25em', color: '#fff', textTransform: 'uppercase' }}>DANANJAYA</div>
                            <div style={{ fontSize: '0.5rem', letterSpacing: '0.2em', color: 'rgba(255,255,255,0.28)', textTransform: 'uppercase', marginTop: '2px' }}>Admin Panel</div>
                        </div>
                    )}
                    <button onClick={() => setSidebarOpen(p => !p)} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.35)', cursor: 'pointer', fontSize: '1rem', lineHeight: 1, padding: '4px', borderRadius: '6px', flexShrink: 0, marginLeft: sidebarOpen ? 0 : 'auto', marginRight: sidebarOpen ? 0 : 'auto' }}>
                        {sidebarOpen ? '‹' : '›'}
                    </button>
                </div>

                <nav style={{ flex: 1, padding: '1rem 0.75rem', display: 'flex', flexDirection: 'column', gap: '4px', overflowY: 'auto' }}>
                    {NAV.map(tab => {
                        const active = activeTab === tab.id;
                        return (
                            <button key={tab.id} onClick={() => setActiveTab(tab.id)} title={tab.label} style={{
                                display: 'flex', alignItems: 'center', gap: '0.75rem',
                                padding: sidebarOpen ? '0.65rem 0.9rem' : '0.65rem',
                                justifyContent: sidebarOpen ? 'flex-start' : 'center',
                                borderRadius: '8px',
                                background: active ? 'rgba(255,255,255,0.08)' : 'transparent',
                                border: `1px solid ${active ? 'rgba(255,255,255,0.12)' : 'transparent'}`,
                                color: active ? '#fff' : 'rgba(255,255,255,0.42)',
                                fontSize: '0.7rem', fontWeight: active ? 700 : 500,
                                letterSpacing: '0.08em', textTransform: 'uppercase',
                                cursor: 'pointer', textAlign: 'left', width: '100%', fontFamily: 'inherit',
                                transition: 'all 0.18s',
                            }}>
                                <span style={{ fontSize: '0.9rem', flexShrink: 0, opacity: active ? 1 : 0.65 }}>{tab.icon}</span>
                                {sidebarOpen && <span>{tab.label}</span>}
                                {active && sidebarOpen && <span style={{ marginLeft: 'auto', width: 5, height: 5, borderRadius: '50%', background: 'rgba(255,255,255,0.5)', flexShrink: 0 }} />}
                            </button>
                        );
                    })}
                </nav>

                <div style={{ padding: '0.75rem', borderTop: '1px solid rgba(255,255,255,0.05)', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <Link href="/" target="_blank" style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', padding: sidebarOpen ? '0.6rem 0.9rem' : '0.6rem', justifyContent: sidebarOpen ? 'flex-start' : 'center', borderRadius: '8px', color: 'rgba(255,255,255,0.4)', fontSize: '0.65rem', letterSpacing: '0.08em', textTransform: 'uppercase', textDecoration: 'none', transition: 'all 0.2s' }}>
                        <span style={{ fontSize: '0.85rem' }}>↗</span>
                        {sidebarOpen && 'View Site'}
                    </Link>
                    <button onClick={handleLogout} style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', padding: sidebarOpen ? '0.6rem 0.9rem' : '0.6rem', justifyContent: sidebarOpen ? 'flex-start' : 'center', borderRadius: '8px', background: 'rgba(255,60,60,0.06)', border: '1px solid rgba(255,60,60,0.12)', color: 'rgba(255,100,100,0.8)', fontSize: '0.65rem', letterSpacing: '0.08em', textTransform: 'uppercase', cursor: 'pointer', fontFamily: 'inherit', width: '100%', transition: 'all 0.2s' }}>
                        <span style={{ fontSize: '0.85rem' }}>⏻</span>
                        {sidebarOpen && 'Logout'}
                    </button>
                </div>
            </aside>

            {/* Main Area */}
            <div style={{ flex: 1, marginLeft: SIDEBAR_W, transition: 'margin-left 0.25s ease', minWidth: 0, display: 'flex', flexDirection: 'column' }}>
                <header style={{ position: 'sticky', top: 0, zIndex: 100, background: `${S.bg}ee`, backdropFilter: 'blur(12px)', borderBottom: '1px solid rgba(255,255,255,0.05)', padding: '0 2rem', height: 56, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
                    <div>
                        <span style={{ fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#fff' }}>
                            {NAV.find(n => n.id === activeTab)?.label}
                        </span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#4ade80', boxShadow: '0 0 8px #4ade80' }} />
                        <span style={{ fontSize: '0.6rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)' }}>Live</span>
                        <div style={{ width: '1px', height: 16, background: 'rgba(255,255,255,0.08)' }} />
                        <div style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.35)', letterSpacing: '0.1em' }}>OHansani</div>
                    </div>
                </header>

                <main style={{ flex: 1, padding: '2rem', overflowX: 'hidden', maxWidth: '100%' }}>
                    {activeTab === 'dashboard' && <DashboardTab onNavigate={setActiveTab} />}
                    {activeTab === 'hero'       && <HeroTab />}
                    {activeTab === 'about'      && <AboutTab />}
                    {activeTab === 'philosophy' && <PhilosophyTab />}
                    {activeTab === 'technical'  && <TechnicalTab />}
                    {activeTab === 'projects'   && <ProjectsTab />}
                    {activeTab === 'presence'   && <PresenceTab />}
                    {activeTab === 'support'    && <SupportTab />}
                    {activeTab === 'reviews'    && <ReviewsTab />}
                    {activeTab === 'shop'       && <ShopTab />}
                    {activeTab === 'navlinks'   && <NavLinksTab />}
                    {activeTab === 'media'      && <MediaTab />}
                    {activeTab === 'users'      && <UsersTab />}
                    {activeTab === 'messages'   && <MessagesTab />}
                    {activeTab === 'chatbot'    && <ChatbotTab />}
                    {activeTab === 'settings'   && <SettingsTab />}
                </main>
            </div>
        </div>
    );
}

function LoginScreen({ username, password, setUsername, setPassword, onSubmit, loading, error }: any) {
    return (
        <div style={{ minHeight: '100vh', background: S.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
            <div style={{ width: '100%', maxWidth: 400 }}>
                <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
                    <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 56, height: 56, borderRadius: '16px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', fontSize: '1.5rem', marginBottom: '1.25rem' }}>⚙</div>
                    <div style={{ fontSize: '0.55rem', letterSpacing: '0.45em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.22)', marginBottom: '0.6rem' }}>Restricted Area</div>
                    <h1 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#fff', margin: 0, letterSpacing: '-0.01em' }}>Admin Panel</h1>
                </div>

                <form onSubmit={onSubmit} style={{ ...S.card, display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
                    {error && <div style={{ padding: '0.75rem 1rem', background: 'rgba(255,60,60,0.08)', border: '1px solid rgba(255,60,60,0.2)', borderRadius: '8px', color: '#ff8080', fontSize: '0.8rem' }}>{error}</div>}
                    <div>
                        <label style={S.label}>Username</label>
                        <input style={S.input} type="text" value={username} onChange={e => setUsername(e.target.value)} placeholder="OHansani" required autoFocus />
                    </div>
                    <div>
                        <label style={S.label}>Password</label>
                        <input style={S.input} type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" required />
                    </div>
                    <button type="submit" disabled={loading} style={{ ...S.btn, padding: '0.85rem', textAlign: 'center', width: '100%', background: loading ? 'rgba(255,255,255,0.04)' : 'rgba(255,255,255,0.1)', fontSize: '0.75rem' }}>
                        {loading ? 'Verifying…' : 'Enter Admin Panel'}
                    </button>
                </form>
            </div>
        </div>
    );
}
