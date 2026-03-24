'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import SiteSettingsForm from '@/components/admin/SiteSettingsForm';
import ProductForm from '@/components/admin/ProductForm';
import UserList from '@/components/admin/UserList';

/* ─── Types ──────────────────────────────────────────────────────────────── */
interface Product { id?: number; title: string; description: string; price: number; imageUrl: string; category: string; stock: number; featured: boolean; }
interface UserRow { id: number; name: string; email: string; role: string; bio?: string; passwordHash?: string; createdAt: string; }
interface Message { id: number; name: string; email: string; message: string; createdAt: string; }
interface ChatCmd { id: number; trigger: string; response: string; category: string; active: boolean; }
interface ContentData { hero?: any; about?: any; settings?: any; philosophy?: any; skills?: any[]; presence?: any[]; support?: any[]; projects?: any[]; }
interface NavLink { id: number; label: string; href: string; type: string; displayOrder: number; active: boolean; }
interface BgImage { id: number; section: string; imageUrl: string | null; overlayOpacity: number; imagePosition: string; }

/* ─── Design tokens ──────────────────────────────────────────────────────── */
const S = {
    bg: '#0a0a0a',
    sidebar: '#0f0f0f',
    card: { background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '12px', padding: '1.5rem' } as React.CSSProperties,
    input: { width: '100%', padding: '0.7rem 0.9rem', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#fff', fontSize: '0.875rem', outline: 'none', boxSizing: 'border-box' as const, fontFamily: 'inherit', transition: 'border-color 0.2s' } as React.CSSProperties,
    label: { display: 'block', fontSize: '0.6rem', letterSpacing: '0.15em', textTransform: 'uppercase' as const, color: 'rgba(255,255,255,0.4)', marginBottom: '0.4rem' } as React.CSSProperties,
    btn: { padding: '0.55rem 1.1rem', background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '8px', color: '#fff', fontSize: '0.7rem', fontWeight: 600 as const, letterSpacing: '0.1em', textTransform: 'uppercase' as const, cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.2s' } as React.CSSProperties,
    danger: { padding: '0.5rem 0.9rem', background: 'rgba(255,60,60,0.07)', border: '1px solid rgba(255,60,60,0.2)', borderRadius: '8px', color: 'rgba(255,110,110,0.9)', fontSize: '0.65rem', fontWeight: 600 as const, letterSpacing: '0.1em', textTransform: 'uppercase' as const, cursor: 'pointer', fontFamily: 'inherit' } as React.CSSProperties,
    success: { padding: '0.5rem 0.9rem', background: 'rgba(60,200,100,0.07)', border: '1px solid rgba(60,200,100,0.2)', borderRadius: '8px', color: 'rgba(80,220,120,0.9)', fontSize: '0.65rem', fontWeight: 600 as const, letterSpacing: '0.1em', textTransform: 'uppercase' as const, cursor: 'pointer', fontFamily: 'inherit' } as React.CSSProperties,
};

/* ─── Nav items ──────────────────────────────────────────────────────────── */
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

/* ═══════════════════════════════════════════════════════════════════════════
   ROOT COMPONENT
══════════════════════════════════════════════════════════════════════════════ */
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

            {/* ─── Sidebar ─────────────────────────────────────────── */}
            <aside style={{
                width: SIDEBAR_W, flexShrink: 0,
                background: S.sidebar,
                borderRight: '1px solid rgba(255,255,255,0.055)',
                display: 'flex', flexDirection: 'column',
                position: 'fixed', top: 0, bottom: 0, left: 0,
                zIndex: 200, transition: 'width 0.25s ease',
                overflow: 'hidden',
            }}>
                {/* Logo */}
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

                {/* Nav items */}
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

                {/* Bottom actions */}
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

            {/* ─── Main content ─────────────────────────────────────── */}
            <div style={{ flex: 1, marginLeft: SIDEBAR_W, transition: 'margin-left 0.25s ease', minWidth: 0, display: 'flex', flexDirection: 'column' }}>

                {/* Top bar */}
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

                {/* Page content */}
                <main style={{ flex: 1, padding: '2rem', overflowX: 'hidden', maxWidth: '100%' }}>
                    {activeTab === 'dashboard' && <DashboardTab onNavigate={setActiveTab} />}
                    {activeTab === 'hero'       && <HeroTab />}
                    {(activeTab === 'content' || activeTab === 'about') && <AboutTab />}
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

/* ═══════════════════════════════════════════════════════════════════════════
   LOGIN SCREEN
══════════════════════════════════════════════════════════════════════════════ */
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

                <p style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.65rem', color: 'rgba(255,255,255,0.2)', letterSpacing: '0.1em' }}>
                    Authorized personnel only
                </p>
            </div>
        </div>
    );
}

/* ═══════════════════════════════════════════════════════════════════════════
   DASHBOARD TAB
══════════════════════════════════════════════════════════════════════════════ */
function DashboardTab({ onNavigate }: { onNavigate: (tab: string) => void }) {
    const [stats, setStats] = useState<Record<string, number>>({});
    useEffect(() => {
        Promise.all([
            fetch('/api/admin/products').then(r => r.ok ? r.json() : []),
            fetch('/api/admin/users').then(r => r.ok ? r.json() : []),
            fetch('/api/admin/content').then(r => r.ok ? r.json() : {}),
            fetch('/api/admin/reviews').then(r => r.ok ? r.json() : []),
            fetch('/api/admin/messages').then(r => r.ok ? r.json() : []),
        ]).then(([prods, usrs, contentRaw, revs, msgs]) => {
            const content = contentRaw as any;
            setStats({
                products: (prods || []).length,
                users: (usrs || []).length,
                projects: (content.projects || []).length,
                skills: (content.skills || []).length,
                presence: (content.presence || []).length,
                support: (content.support || []).length,
                reviews: (revs || []).length,
                messages: (msgs || []).length,
            });
        });
    }, []);

    const statCards = [
        { label: 'Products',  key: 'products',  tab: 'shop',      color: '#818cf8' },
        { label: 'Users',     key: 'users',     tab: 'users',     color: '#34d399' },
        { label: 'Projects',  key: 'projects',  tab: 'projects',  color: '#fb923c' },
        { label: 'Skills',    key: 'skills',    tab: 'technical', color: '#38bdf8' },
        { label: 'Platforms', key: 'presence',  tab: 'presence',  color: '#e879f9' },
        { label: 'Support',   key: 'support',   tab: 'support',   color: '#facc15' },
        { label: 'Reviews',   key: 'reviews',   tab: 'reviews',   color: '#4ade80' },
        { label: 'Messages',  key: 'messages',  tab: 'messages',  color: '#f87171' },
    ];

    const sectionLinks = [
        { label: 'Hero',        tab: 'hero',        icon: '◉', desc: 'Headline, sub-headline, CTA' },
        { label: 'About',       tab: 'about',       icon: '👤', desc: 'Bio, title, stats' },
        { label: 'Philosophy',  tab: 'philosophy',  icon: '💡', desc: 'Creative philosophy statement' },
        { label: 'Technical',   tab: 'technical',   icon: '⚡', desc: 'Skills shown in scroll strip' },
        { label: 'Projects',    tab: 'projects',    icon: '🗂', desc: 'Portfolio work cards' },
        { label: 'Presence',    tab: 'presence',    icon: '🔗', desc: 'Social / platform carousel' },
        { label: 'Support',     tab: 'support',     icon: '🛟', desc: 'Donation & support links' },
        { label: 'Reviews',     tab: 'reviews',     icon: '⭐', desc: 'User reviews & ratings' },
        { label: 'Shop',        tab: 'shop',        icon: '⬡', desc: 'Products & orders' },
        { label: 'Nav Links',   tab: 'navlinks',    icon: '🧭', desc: 'Navbar links management' },
        { label: 'Media / BG',  tab: 'media',       icon: '🖼', desc: 'Background images per section' },
        { label: 'Users',       tab: 'users',       icon: '◇', desc: 'Registered accounts' },
        { label: 'Messages',    tab: 'messages',    icon: '✉', desc: 'Contact form inbox' },
        { label: 'Chatbot',     tab: 'chatbot',     icon: '🤖', desc: 'Bot replies & triggers' },
        { label: 'Settings',    tab: 'settings',    icon: '⚙', desc: 'Logo, colors, SEO, social' },
    ];

    return (
        <div>
            <PageHeader title="Dashboard" subtitle={`Welcome back, OHansani · ${new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}`} />

            {/* All-section stats */}
            <div style={{ fontSize: '0.6rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)', marginBottom: '0.75rem' }}>Site Overview</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '0.75rem', marginBottom: '2rem' }}>
                {statCards.map(s => (
                    <button key={s.key} onClick={() => onNavigate(s.tab)} style={{ ...S.card, position: 'relative', overflow: 'hidden', cursor: 'pointer', textAlign: 'left', width: '100%', fontFamily: 'inherit', transition: 'border-color 0.2s' }}>
                        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '2px', background: s.color, opacity: 0.6 }} />
                        <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#fff', lineHeight: 1, marginBottom: '0.3rem' }}>
                            {stats[s.key] ?? '—'}
                        </div>
                        <div style={{ fontSize: '0.58rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: s.color, opacity: 0.8 }}>{s.label}</div>
                    </button>
                ))}
            </div>

            {/* All editable sections */}
            <div style={{ fontSize: '0.6rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)', marginBottom: '0.75rem' }}>All Sections</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '0.65rem' }}>
                {sectionLinks.map(a => (
                    <button key={a.tab} onClick={() => onNavigate(a.tab)} style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '12px', padding: '1rem 1.1rem', cursor: 'pointer', textAlign: 'left', fontFamily: 'inherit', display: 'flex', alignItems: 'flex-start', gap: '0.75rem', transition: 'border-color 0.2s, background 0.2s', width: '100%' }}>
                        <span style={{ fontSize: '1.1rem', opacity: 0.75, flexShrink: 0 }}>{a.icon}</span>
                        <div>
                            <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#fff', marginBottom: '0.2rem' }}>{a.label}</div>
                            <div style={{ fontSize: '0.62rem', color: 'rgba(255,255,255,0.28)', lineHeight: 1.4 }}>{a.desc}</div>
                        </div>
                    </button>
                ))}
            </div>
        </div>
    );
}

/* ═══════════════════════════════════════════════════════════════════════════
   HERO TAB (dedicated)
══════════════════════════════════════════════════════════════════════════════ */
function HeroTab() {
    const [data, setData] = useState<any>(null);
    const [form, setForm] = useState({ headline: '', subheadline: '', ctaText: '' });
    const [saving, setSaving] = useState(false);
    const [msg, setMsg] = useState('');

    useEffect(() => {
        fetch('/api/admin/content').then(r => r.ok ? r.json() : {}).then((d: any) => {
            if (d.hero) { setData(d.hero); setForm({ headline: d.hero.headline || '', subheadline: d.hero.subheadline || '', ctaText: d.hero.ctaText || '' }); }
        });
    }, []);

    async function handleSave(e: React.FormEvent) {
        e.preventDefault();
        setSaving(true);
        const res = await fetch('/api/admin/content', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ section: 'heroContent', id: data?.id, data: form }) });
        setSaving(false);
        if (res.ok) { setMsg('Hero saved!'); setTimeout(() => setMsg(''), 3000); }
    }

    return (
        <div>
            <PageHeader title="Hero Section" subtitle="Edit the main headline and animation text" />
            {msg && <Toast message={msg} />}
            <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
                    <div style={S.card}>
                        <label style={S.label}>Main Headline</label>
                        <input style={S.input} value={form.headline} onChange={e => setForm(f => ({ ...f, headline: e.target.value }))} placeholder="Designing Visual Stories." />
                        <p style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.25)', marginTop: '0.5rem', lineHeight: 1.5 }}>The bold large text. Use \n for a new line.</p>
                    </div>
                    <div style={S.card}>
                        <label style={S.label}>Sub-headline</label>
                        <input style={S.input} value={form.subheadline} onChange={e => setForm(f => ({ ...f, subheadline: e.target.value }))} placeholder="Developing Digital Experiences." />
                        <p style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.25)', marginTop: '0.5rem', lineHeight: 1.5 }}>The lighter text below the main headline.</p>
                    </div>
                    <div style={S.card}>
                        <label style={S.label}>CTA / Eyebrow Label</label>
                        <input style={S.input} value={form.ctaText} onChange={e => setForm(f => ({ ...f, ctaText: e.target.value }))} placeholder="Graphic Designer / Creative Developer" />
                        <p style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.25)', marginTop: '0.5rem', lineHeight: 1.5 }}>Small caption above the headline.</p>
                    </div>
                </div>

                {/* Live preview */}
                <div style={{ ...S.card, background: '#050505', padding: '3rem', textAlign: 'center' }}>
                    <div style={{ fontSize: '0.55rem', letterSpacing: '0.5em', textTransform: 'uppercase', color: 'rgba(255,50,50,0.7)', marginBottom: '1rem' }}>{form.ctaText || 'Graphic Designer / Creative Developer'}</div>
                    <div style={{ fontSize: 'clamp(1.5rem,4vw,3rem)', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '-0.03em', lineHeight: 1 }}>{form.headline || 'Designing Visual Stories.'}</div>
                    <div style={{ fontSize: 'clamp(1rem,2.5vw,2rem)', fontWeight: 200, opacity: 0.4, marginTop: '0.3rem', textTransform: 'uppercase', letterSpacing: '-0.02em' }}>{form.subheadline || 'Developing Digital Experiences.'}</div>
                    <div style={{ fontSize: '0.55rem', color: 'rgba(255,255,255,0.2)', letterSpacing: '0.3em', textTransform: 'uppercase', marginTop: '2rem' }}>↑ Live Preview ↑</div>
                </div>

                <div>
                    <button type="submit" disabled={saving} style={{ ...S.btn, padding: '0.75rem 2rem', fontSize: '0.75rem' }}>
                        {saving ? 'Saving…' : '✓ Save Hero'}
                    </button>
                </div>
            </form>
        </div>
    );
}

/* ═══════════════════════════════════════════════════════════════════════════
   CONTENT TAB
══════════════════════════════════════════════════════════════════════════════ */
function ContentTab() {
    const [content, setContent] = useState<ContentData>({});
    const [saving, setSaving] = useState('');
    const [saveMsg, setSaveMsg] = useState('');
    const [activeSection, setActiveSection] = useState('about');

    const load = useCallback(() => {
        fetch('/api/admin/content').then(r => r.ok ? r.json() : {}).then(setContent);
    }, []);
    useEffect(() => { load(); }, [load]);

    async function save(section: string, id: number, data: any) {
        setSaving(section);
        await fetch('/api/admin/content', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ section, id, data }) });
        setSaving(''); setSaveMsg(`${section} saved!`); setTimeout(() => setSaveMsg(''), 3000);
    }

    async function listAction(section: string, method: string, id?: number, data?: any) {
        setSaving(section);
        await fetch('/api/admin/content', { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ section, id, data }) });
        setSaving(''); load(); setSaveMsg('Updated!'); setTimeout(() => setSaveMsg(''), 2000);
    }

    const sections = [
        { id: 'about', label: '👤 About' },
        { id: 'philosophy', label: '💡 Philosophy' },
        { id: 'projects', label: '🗂 Work' },
        { id: 'skills', label: '⚡ Technical' },
        { id: 'presence', label: '🔗 Presence' },
        { id: 'support', label: '🛟 Support' },
    ];

    return (
        <div>
            <PageHeader title="Content" subtitle="Manage all portfolio sections" />
            {saveMsg && <Toast message={saveMsg} />}

            {/* Section tabs */}
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
                {sections.map(s => (
                    <button key={s.id} onClick={() => setActiveSection(s.id)} style={{ padding: '0.5rem 1rem', background: activeSection === s.id ? 'rgba(255,255,255,0.1)' : 'transparent', border: `1px solid ${activeSection === s.id ? 'rgba(255,255,255,0.18)' : 'rgba(255,255,255,0.07)'}`, borderRadius: '8px', color: activeSection === s.id ? '#fff' : 'rgba(255,255,255,0.45)', fontSize: '0.7rem', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', letterSpacing: '0.05em', transition: 'all 0.18s' }}>
                        {s.label}
                    </button>
                ))}
            </div>

            {activeSection === 'about' && content.about && (
                <ContentForm title="About Section" fields={[
                    { key: 'title', label: 'Title' },
                    { key: 'bio', label: 'Bio / Description', textarea: true },
                    { key: 'stat1Label', label: 'Stat 1 Label' }, { key: 'stat1Value', label: 'Stat 1 Value' },
                    { key: 'stat2Label', label: 'Stat 2 Label' }, { key: 'stat2Value', label: 'Stat 2 Value' },
                    { key: 'stat3Label', label: 'Stat 3 Label' }, { key: 'stat3Value', label: 'Stat 3 Value' },
                ]} data={content.about} onSave={d => save('aboutContent', content.about.id, d)} saving={saving === 'aboutContent'} />
            )}
            {activeSection === 'philosophy' && content.philosophy && (
                <ContentForm title="Philosophy Section" fields={[
                    { key: 'label', label: 'Eyebrow Label' },
                    { key: 'line1', label: 'Line 1 (Bold)' },
                    { key: 'line2', label: 'Line 2 (Light)' },
                    { key: 'bio', label: 'Description Text', textarea: true },
                ]} data={content.philosophy} onSave={d => save('philosophyContent', content.philosophy.id, d)} saving={saving === 'philosophyContent'} />
            )}
            {activeSection === 'projects' && (
                <ListEditor title="Projects" fields={[
                    { key: 'title', label: 'Project Title' },
                    { key: 'description', label: 'Description' },
                    { key: 'tags', label: 'Tags (comma separated)' },
                    { key: 'link', label: 'Project Link' },
                    { key: 'imageUrl', label: 'Image URL' },
                ]} items={content.projects || []} onAdd={d => listAction('projects', 'POST', undefined, d)} onDelete={id => listAction('projects', 'DELETE', id)} saving={saving === 'projects'} />
            )}
            {activeSection === 'skills' && (
                <ListEditor title="Technical Skills" fields={[
                    { key: 'name', label: 'Skill Name' },
                    { key: 'type', label: 'Type (Language / Framework / Design…)' },
                ]} items={content.skills || []} onAdd={d => listAction('technicalSkills', 'POST', undefined, d)} onDelete={id => listAction('technicalSkills', 'DELETE', id)} saving={saving === 'skills'} />
            )}
            {activeSection === 'presence' && (
                <ListEditor title="Presence Links" fields={[
                    { key: 'name', label: 'Platform Name' },
                    { key: 'url', label: 'URL' },
                    { key: 'tagline', label: 'Tagline' },
                    { key: 'platformId', label: 'Icon ID' },
                ]} items={content.presence || []} onAdd={d => listAction('presenceLinks', 'POST', undefined, d)} onDelete={id => listAction('presenceLinks', 'DELETE', id)} saving={saving === 'presence'} />
            )}
            {activeSection === 'support' && (
                <ListEditor title="Support Items" fields={[
                    { key: 'title', label: 'Title' },
                    { key: 'description', label: 'Description' },
                    { key: 'url', label: 'URL' },
                    { key: 'icon', label: 'Icon (emoji)' },
                ]} items={content.support || []} onAdd={d => listAction('supportItems', 'POST', undefined, d)} onDelete={id => listAction('supportItems', 'DELETE', id)} saving={saving === 'support'} />
            )}
        </div>
    );
}

/* ═══════════════════════════════════════════════════════════════════════════
   SHOP TAB
══════════════════════════════════════════════════════════════════════════════ */
function ShopTab() {
    const [products, setProducts] = useState<Product[]>([]);
    const [showForm, setShowForm] = useState(false);
    const [editing, setEditing] = useState<Product | null>(null);
    const [saving, setSaving] = useState(false);
    const [filter, setFilter] = useState('');

    const load = useCallback(() => {
        fetch('/api/admin/products').then(r => r.ok ? r.json() : []).then(setProducts);
    }, []);
    useEffect(() => { load(); }, [load]);

    async function handleSave(form: Product) {
        setSaving(true);
        const method = editing?.id ? 'PUT' : 'POST';
        const body = editing?.id ? { id: editing.id, ...form } : form;
        await fetch('/api/admin/products', { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
        setSaving(false); setShowForm(false); setEditing(null); load();
    }

    async function handleDelete(id: number) {
        if (!confirm('Delete this product?')) return;
        await fetch('/api/admin/products', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id }) });
        load();
    }

    async function toggleFeatured(p: Product) {
        await fetch('/api/admin/products', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: p.id, ...p, featured: !p.featured }) });
        load();
    }

    const filtered = products.filter(p => !filter || p.title.toLowerCase().includes(filter.toLowerCase()) || p.category?.toLowerCase().includes(filter.toLowerCase()));

    return (
        <div>
            <PageHeader title="Shop" subtitle={`${products.length} product${products.length !== 1 ? 's' : ''}`} action={
                <button onClick={() => { setEditing(null); setShowForm(true); }} style={{ ...S.btn, padding: '0.6rem 1.25rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    + Add Product
                </button>
            } />

            {showForm && (
                <div style={{ marginBottom: '1.5rem' }}>
                    <ProductForm initialData={editing || undefined} onSave={handleSave} onCancel={() => { setShowForm(false); setEditing(null); }} saving={saving} />
                </div>
            )}

            {/* Search */}
            <div style={{ marginBottom: '1.25rem' }}>
                <input style={{ ...S.input, maxWidth: 320 }} placeholder="🔍  Search products…" value={filter} onChange={e => setFilter(e.target.value)} />
            </div>

            {filtered.length === 0 ? (
                <div style={{ ...S.card, textAlign: 'center', padding: '4rem', color: 'rgba(255,255,255,0.2)', fontSize: '0.8rem', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                    {filter ? 'No products match your search' : 'No products yet — add your first one'}
                </div>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem' }}>
                    {filtered.map(p => (
                        <div key={p.id} style={{ ...S.card, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            {/* Image */}
                            <div style={{ height: 160, borderRadius: '8px', background: p.imageUrl ? `url(${p.imageUrl}) center/cover` : 'rgba(255,255,255,0.04)', position: 'relative', overflow: 'hidden' }}>
                                {p.featured && <span style={{ position: 'absolute', top: 8, right: 8, fontSize: '0.55rem', letterSpacing: '0.15em', textTransform: 'uppercase', background: 'rgba(255,200,50,0.15)', border: '1px solid rgba(255,200,50,0.3)', color: 'rgba(255,200,50,0.9)', borderRadius: '20px', padding: '0.2rem 0.6rem' }}>★ Featured</span>}
                            </div>
                            {/* Info */}
                            <div>
                                <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#fff', marginBottom: '0.2rem' }}>{p.title}</div>
                                <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.35)', marginBottom: '0.5rem' }}>{p.category || 'No category'} · Stock: {p.stock}</div>
                                <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#fff' }}>${Number(p.price).toFixed(2)}</div>
                            </div>
                            {/* Actions */}
                            <div style={{ display: 'flex', gap: '0.5rem', marginTop: 'auto' }}>
                                <button onClick={() => { setEditing(p); setShowForm(true); }} style={{ ...S.btn, flex: 1, textAlign: 'center' }}>Edit</button>
                                <button onClick={() => toggleFeatured(p)} style={{ ...S.btn, padding: '0.5rem 0.75rem', opacity: p.featured ? 1 : 0.5 }} title="Toggle featured">★</button>
                                <button onClick={() => handleDelete(p.id!)} style={S.danger}>Del</button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

/* ═══════════════════════════════════════════════════════════════════════════
   USERS TAB — enhanced with edit + password reset
══════════════════════════════════════════════════════════════════════════════ */
function UsersTab() {
    const [users, setUsers] = useState<UserRow[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('');
    const [editing, setEditing] = useState<UserRow | null>(null);
    const [editForm, setEditForm] = useState({ name: '', email: '', role: 'user', bio: '', newPassword: '' });
    const [saving, setSaving] = useState(false);
    const [showPass, setShowPass] = useState<Record<number,boolean>>({});
    const [addMode, setAddMode] = useState(false);
    const [newUser, setNewUser] = useState({ name: '', email: '', password: '', role: 'user' });
    const [msg, setMsg] = useState('');

    const load = useCallback(() => {
        fetch('/api/admin/users').then(r => r.ok ? r.json() : []).then(d => { setUsers(d); setLoading(false); });
    }, []);
    useEffect(() => { load(); }, [load]);

    function openEdit(u: UserRow) {
        setEditing(u);
        setEditForm({ name: u.name, email: u.email, role: u.role, bio: u.bio || '', newPassword: '' });
    }

    async function saveEdit() {
        if (!editing) return;
        setSaving(true);
        const res = await fetch('/api/admin/users', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: editing.id, ...editForm }) });
        setSaving(false);
        if (res.ok) { setEditing(null); load(); setMsg('User updated!'); setTimeout(() => setMsg(''), 3000); }
    }

    async function deleteUser(id: number) {
        if (!confirm('Delete this user? This cannot be undone.')) return;
        await fetch('/api/admin/users', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id }) });
        load();
    }

    async function createUser() {
        if (!newUser.name || !newUser.email || !newUser.password) return;
        setSaving(true);
        await fetch('/api/admin/users', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(newUser) });
        setSaving(false); setAddMode(false); setNewUser({ name: '', email: '', password: '', role: 'user' }); load();
        setMsg('User created!'); setTimeout(() => setMsg(''), 3000);
    }

    const filtered = users.filter(u => !filter || u.name.toLowerCase().includes(filter.toLowerCase()) || u.email.toLowerCase().includes(filter.toLowerCase()));

    return (
        <div>
            <PageHeader title="Users" subtitle={`${users.length} registered account${users.length !== 1 ? 's' : ''}`} action={
                <button onClick={() => setAddMode(m => !m)} style={{ ...S.btn, padding: '0.6rem 1.25rem' }}>+ Add User</button>
            } />

            {msg && <Toast message={msg} />}

            {/* Add user form */}
            {addMode && (
                <div style={{ ...S.card, marginBottom: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div style={{ fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.5)' }}>Create New User</div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px,1fr))', gap: '0.75rem' }}>
                        {[['Name','name','text'],['Email','email','email'],['Password','password','password']].map(([lbl,key,type]) => (
                            <div key={key}><label style={S.label}>{lbl}</label><input type={type} style={S.input} value={(newUser as any)[key]} onChange={e => setNewUser(p => ({...p, [key]: e.target.value}))} /></div>
                        ))}
                        <div><label style={S.label}>Role</label><select style={{...S.input}} value={newUser.role} onChange={e => setNewUser(p=>({...p,role:e.target.value}))}><option value="user">User</option><option value="admin">Admin</option></select></div>
                    </div>
                    <div style={{ display: 'flex', gap: '0.75rem' }}>
                        <button onClick={createUser} disabled={saving} style={{ ...S.btn }}>Create User</button>
                        <button onClick={() => setAddMode(false)} style={{ ...S.btn, opacity: 0.5 }}>Cancel</button>
                    </div>
                </div>
            )}

            {/* Edit modal */}
            {editing && (
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.65)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
                    <div style={{ ...S.card, width: '100%', maxWidth: 520, display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div style={{ fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#fff' }}>Edit User</div>
                            <button onClick={() => setEditing(null)} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)', cursor: 'pointer', fontSize: '1.2rem' }}>×</button>
                        </div>
                        {[['Name','name','text'],['Email','email','email']].map(([lbl,key,type]) => (
                            <div key={key}><label style={S.label}>{lbl}</label><input type={type} style={S.input} value={(editForm as any)[key]} onChange={e => setEditForm(p=>({...p,[key]:e.target.value}))} /></div>
                        ))}
                        <div><label style={S.label}>Bio</label><textarea rows={2} style={{...S.input, resize:'vertical'}} value={editForm.bio} onChange={e=>setEditForm(p=>({...p,bio:e.target.value}))} /></div>
                        <div><label style={S.label}>Role</label><select style={{...S.input}} value={editForm.role} onChange={e=>setEditForm(p=>({...p,role:e.target.value}))}><option value="user">User</option><option value="admin">Admin</option></select></div>
                        <div><label style={S.label}>New Password (leave blank to keep current)</label><input type="password" style={S.input} placeholder="••••••••" value={editForm.newPassword} onChange={e=>setEditForm(p=>({...p,newPassword:e.target.value}))} /></div>
                        <div style={{ display: 'flex', gap: '0.75rem' }}>
                            <button onClick={saveEdit} disabled={saving} style={{ ...S.btn, flex: 1, textAlign: 'center', padding: '0.75rem' }}>{saving ? 'Saving…' : '✓ Save Changes'}</button>
                            <button onClick={() => setEditing(null)} style={{ ...S.btn, opacity: 0.4 }}>Cancel</button>
                        </div>
                    </div>
                </div>
            )}

            <input style={{ ...S.input, maxWidth: 320, marginBottom: '1.25rem' }} placeholder="🔍  Search users…" value={filter} onChange={e => setFilter(e.target.value)} />

            {loading ? (
                <div style={{ ...S.card, textAlign: 'center', padding: '3rem', color: 'rgba(255,255,255,0.25)', fontSize: '0.75rem', letterSpacing: '0.15em', textTransform: 'uppercase' }}>Loading…</div>
            ) : filtered.length === 0 ? (
                <div style={{ ...S.card, textAlign: 'center', padding: '3rem', color: 'rgba(255,255,255,0.25)', fontSize: '0.8rem' }}>No users found</div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    {filtered.map(u => (
                        <div key={u.id} style={{ ...S.card, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.75rem' }}>
                                <div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.25rem' }}>
                                        <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.85rem', fontWeight: 700, color: '#fff', flexShrink: 0 }}>{u.name.charAt(0).toUpperCase()}</div>
                                        <div>
                                            <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#fff' }}>{u.name}</div>
                                            <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.4)' }}>{u.email}</div>
                                        </div>
                                        <span style={{ fontSize: '0.55rem', letterSpacing: '0.15em', textTransform: 'uppercase', padding: '0.2rem 0.6rem', borderRadius: '20px', background: u.role === 'admin' ? 'rgba(255,200,50,0.1)' : 'rgba(255,255,255,0.05)', border: `1px solid ${u.role === 'admin' ? 'rgba(255,200,50,0.25)' : 'rgba(255,255,255,0.08)'}`, color: u.role === 'admin' ? 'rgba(255,200,50,0.9)' : 'rgba(255,255,255,0.45)' }}>{u.role}</span>
                                    </div>
                                    <div style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.25)', paddingLeft: '40px' }}>Joined: {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : '—'} · ID: {u.id}</div>
                                </div>
                                <div style={{ display: 'flex', gap: '0.5rem', flexShrink: 0 }}>
                                    <button onClick={() => openEdit(u)} style={S.btn}>✏ Edit</button>
                                    <button onClick={() => deleteUser(u.id)} style={S.danger}>Delete</button>
                                </div>
                            </div>
                            {/* Password hash preview */}
                            {u.passwordHash && (
                                <div style={{ background: 'rgba(0,0,0,0.3)', borderRadius: '6px', padding: '0.5rem 0.75rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                    <span style={{ fontSize: '0.55rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.25)' }}>Password Hash</span>
                                    <code style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.35)', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontFamily: 'monospace' }}>
                                        {showPass[u.id] ? u.passwordHash : '••••••••••••••••••••••••••••••••••••••'}
                                    </code>
                                    <button onClick={() => setShowPass(p => ({...p,[u.id]:!p[u.id]}))} style={{ ...S.btn, padding: '0.25rem 0.6rem', fontSize: '0.6rem', opacity: 0.6 }}>{showPass[u.id] ? 'Hide' : 'Show'}</button>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

/* ═══════════════════════════════════════════════════════════════════════════
   MESSAGES TAB — contact form inbox
══════════════════════════════════════════════════════════════════════════════ */
function MessagesTab() {
    const [messages, setMessages] = useState<Message[]>([]);
    const [loading, setLoading] = useState(true);
    const [open, setOpen] = useState<Message | null>(null);

    useEffect(() => {
        fetch('/api/admin/messages').then(r => r.ok ? r.json() : []).then(d => { setMessages(d); setLoading(false); });
    }, []);

    return (
        <div>
            <PageHeader title="Messages" subtitle={`${messages.length} contact submission${messages.length !== 1 ? 's' : ''}`} />

            {/* Message detail modal */}
            {open && (
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
                    <div style={{ ...S.card, width: '100%', maxWidth: 560, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div style={{ fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#fff' }}>Message from {open.name}</div>
                            <button onClick={() => setOpen(null)} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)', cursor: 'pointer', fontSize: '1.4rem' }}>×</button>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                            <div><div style={S.label}>From</div><div style={{ color: '#fff', fontSize: '0.85rem' }}>{open.name}</div></div>
                            <div><div style={S.label}>Email</div><a href={`mailto:${open.email}`} style={{ color: '#818cf8', fontSize: '0.85rem' }}>{open.email}</a></div>
                        </div>
                        <div><div style={S.label}>Date</div><div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.8rem' }}>{new Date(open.createdAt).toLocaleString()}</div></div>
                        <div>
                            <div style={S.label}>Message</div>
                            <div style={{ ...S.input, minHeight: '8rem', lineHeight: 1.7, whiteSpace: 'pre-wrap', pointerEvents: 'none', color: 'rgba(255,255,255,0.8)', fontSize: '0.875rem' }}>{open.message}</div>
                        </div>
                        <a href={`mailto:${open.email}?subject=Re: Your message&body=Hi ${open.name},%0A%0A`} style={{ ...S.btn, textDecoration: 'none', textAlign: 'center', display: 'block', padding: '0.75rem' }}>↩ Reply via Email</a>
                    </div>
                </div>
            )}

            {loading ? (
                <div style={{ ...S.card, textAlign: 'center', padding: '3rem', color: 'rgba(255,255,255,0.25)', fontSize: '0.75rem' }}>Loading…</div>
            ) : messages.length === 0 ? (
                <div style={{ ...S.card, textAlign: 'center', padding: '3rem', color: 'rgba(255,255,255,0.25)' }}>No messages yet</div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    {messages.map(m => (
                        <div key={m.id} onClick={() => setOpen(m)} style={{ ...S.card, cursor: 'pointer', display: 'grid', gridTemplateColumns: 'auto 1fr auto', gap: '1rem', alignItems: 'center', transition: 'all 0.2s' }}>
                            <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'rgba(129,140,248,0.15)', border: '1px solid rgba(129,140,248,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.9rem', fontWeight: 700, color: '#818cf8', flexShrink: 0 }}>{m.name.charAt(0).toUpperCase()}</div>
                            <div style={{ minWidth: 0 }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.2rem' }}>
                                    <span style={{ fontSize: '0.875rem', fontWeight: 700, color: '#fff' }}>{m.name}</span>
                                    <span style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.3)' }}>{m.email}</span>
                                </div>
                                <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.45)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{m.message}</div>
                            </div>
                            <div style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.25)', flexShrink: 0 }}>{new Date(m.createdAt).toLocaleDateString()}</div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

/* ═══════════════════════════════════════════════════════════════════════════
   CHATBOT TAB — manage chatbot commands
══════════════════════════════════════════════════════════════════════════════ */
function ChatbotTab() {
    const [cmds, setCmds] = useState<ChatCmd[]>([]);
    const [loading, setLoading] = useState(true);
    const [form, setForm] = useState({ trigger: '', response: '', category: 'general' });
    const [editing, setEditing] = useState<ChatCmd | null>(null);
    const [editForm, setEditForm] = useState({ trigger: '', response: '', category: 'general', active: true });
    const [saving, setSaving] = useState(false);
    const [msg, setMsg] = useState('');

    const load = useCallback(() => {
        fetch('/api/admin/chatbot').then(r => r.ok ? r.json() : []).then(d => { setCmds(d); setLoading(false); });
    }, []);
    useEffect(() => { load(); }, [load]);

    async function addCmd() {
        if (!form.trigger || !form.response) return;
        setSaving(true);
        await fetch('/api/admin/chatbot', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
        setSaving(false); setForm({ trigger: '', response: '', category: 'general' }); load();
        setMsg('Command added!'); setTimeout(() => setMsg(''), 2500);
    }

    async function saveEdit() {
        if (!editing) return;
        setSaving(true);
        await fetch('/api/admin/chatbot', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: editing.id, ...editForm }) });
        setSaving(false); setEditing(null); load();
        setMsg('Command updated!'); setTimeout(() => setMsg(''), 2500);
    }

    async function deleteCmd(id: number) {
        await fetch('/api/admin/chatbot', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id }) });
        load();
    }

    async function toggleActive(cmd: ChatCmd) {
        await fetch('/api/admin/chatbot', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...cmd, active: !cmd.active }) });
        load();
    }

    const categories = ['greeting', 'info', 'business', 'general'];
    const catColors: Record<string,string> = { greeting: '#4ade80', info: '#818cf8', business: '#fb923c', general: 'rgba(255,255,255,0.4)' };
    const grouped = categories.map(cat => ({ cat, items: cmds.filter(c => c.category === cat) })).filter(g => g.items.length > 0);
    const others = cmds.filter(c => !categories.includes(c.category));

    return (
        <div>
            <PageHeader title="Chatbot" subtitle="Manage chatbot commands and responses" />
            {msg && <Toast message={msg} />}

            {/* Edit modal */}
            {editing && (
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
                    <div style={{ ...S.card, width: '100%', maxWidth: 520, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <div style={{ fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#fff' }}>Edit Command</div>
                            <button onClick={() => setEditing(null)} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)', cursor: 'pointer', fontSize: '1.4rem' }}>×</button>
                        </div>
                        <div><label style={S.label}>Trigger (keyword user types)</label><input style={S.input} value={editForm.trigger} onChange={e=>setEditForm(p=>({...p,trigger:e.target.value}))} /></div>
                        <div><label style={S.label}>Response</label><textarea rows={3} style={{...S.input, resize:'vertical'}} value={editForm.response} onChange={e=>setEditForm(p=>({...p,response:e.target.value}))} /></div>
                        <div><label style={S.label}>Category</label>
                            <select style={{...S.input}} value={editForm.category} onChange={e=>setEditForm(p=>({...p,category:e.target.value}))}>
                                {categories.map(c => <option key={c} value={c}>{c}</option>)}
                            </select>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                            <label style={{ ...S.label, margin: 0 }}>Active</label>
                            <input type="checkbox" checked={editForm.active} onChange={e=>setEditForm(p=>({...p,active:e.target.checked}))} />
                        </div>
                        <div style={{ display: 'flex', gap: '0.75rem' }}>
                            <button onClick={saveEdit} disabled={saving} style={{ ...S.btn, flex: 1, textAlign: 'center', padding: '0.75rem' }}>{saving ? 'Saving…' : '✓ Save'}</button>
                            <button onClick={() => setEditing(null)} style={{ ...S.btn, opacity: 0.4 }}>Cancel</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Add command */}
            <div style={{ ...S.card, marginBottom: '1.5rem' }}>
                <div style={{ fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.5)', marginBottom: '1rem' }}>+ Add Command</div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr 1fr auto', gap: '0.75rem', alignItems: 'flex-end' }}>
                    <div><label style={S.label}>Trigger Keyword</label><input style={S.input} placeholder="e.g. hello" value={form.trigger} onChange={e=>setForm(p=>({...p,trigger:e.target.value}))} /></div>
                    <div><label style={S.label}>Response Text</label><input style={S.input} placeholder="Bot reply…" value={form.response} onChange={e=>setForm(p=>({...p,response:e.target.value}))} /></div>
                    <div><label style={S.label}>Category</label><select style={{...S.input}} value={form.category} onChange={e=>setForm(p=>({...p,category:e.target.value}))}>{categories.map(c=><option key={c} value={c}>{c}</option>)}</select></div>
                    <button onClick={addCmd} disabled={saving} style={{ ...S.btn, padding: '0.7rem 1rem' }}>Add</button>
                </div>
            </div>

            {/* Commands list grouped by category */}
            {loading ? (
                <div style={{ ...S.card, textAlign: 'center', padding: '2rem', color: 'rgba(255,255,255,0.25)' }}>Loading…</div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                    {[...grouped, ...(others.length ? [{ cat: 'other', items: others }] : [])].map(({ cat, items }) => (
                        <div key={cat}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                                <div style={{ width: 6, height: 6, borderRadius: '50%', background: catColors[cat] || 'rgba(255,255,255,0.4)' }} />
                                <span style={{ fontSize: '0.55rem', letterSpacing: '0.25em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)' }}>{cat}</span>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                {items.map(cmd => (
                                    <div key={cmd.id} style={{ ...S.card, padding: '0.9rem 1.25rem', display: 'grid', gridTemplateColumns: 'auto 1fr 2fr auto auto auto', gap: '1rem', alignItems: 'center', opacity: cmd.active ? 1 : 0.45 }}>
                                        <div style={{ width: 6, height: 6, borderRadius: '50%', background: cmd.active ? '#4ade80' : 'rgba(255,255,255,0.2)' }} />
                                        <code style={{ fontSize: '0.75rem', fontFamily: 'monospace', color: catColors[cat] || '#fff', fontWeight: 700 }}>/{cmd.trigger}</code>
                                        <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{cmd.response}</div>
                                        <button onClick={() => toggleActive(cmd)} style={{ ...S.btn, padding: '0.3rem 0.75rem', fontSize: '0.6rem', opacity: 0.7 }}>{cmd.active ? 'Disable' : 'Enable'}</button>
                                        <button onClick={() => { setEditing(cmd); setEditForm({ trigger: cmd.trigger, response: cmd.response, category: cmd.category, active: cmd.active }); }} style={{ ...S.btn, padding: '0.3rem 0.75rem', fontSize: '0.6rem' }}>Edit</button>
                                        <button onClick={() => deleteCmd(cmd.id)} style={{ ...S.danger, padding: '0.3rem 0.75rem', fontSize: '0.6rem' }}>Del</button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                    {cmds.length === 0 && <div style={{ ...S.card, textAlign: 'center', padding: '3rem', color: 'rgba(255,255,255,0.2)' }}>No commands yet — add your first above</div>}
                </div>
            )}
        </div>
    );
}


/* ═══════════════════════════════════════════════════════════════════════════
   NAV LINKS TAB
══════════════════════════════════════════════════════════════════════════════ */
function NavLinksTab() {
    const [links, setLinks] = useState<NavLink[]>([]);
    const [loading, setLoading] = useState(true);
    const [form, setForm] = useState({ label: '', href: '', type: 'internal', displayOrder: 0 });
    const [editing, setEditing] = useState<NavLink | null>(null);
    const [editForm, setEditForm] = useState({ label: '', href: '', type: 'internal', displayOrder: 0, active: true });
    const [saving, setSaving] = useState(false);
    const [msg, setMsg] = useState('');

    const load = useCallback(() => {
        fetch('/api/admin/nav-links').then(r => r.ok ? r.json() : []).then(d => { setLinks(Array.isArray(d) ? d : []); setLoading(false); });
    }, []);
    useEffect(() => { load(); }, [load]);

    async function addLink() {
        if (!form.label || !form.href) return;
        setSaving(true);
        await fetch('/api/admin/nav-links', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
        setSaving(false); setForm({ label: '', href: '', type: 'internal', displayOrder: 0 }); load();
        setMsg('Link added!'); setTimeout(() => setMsg(''), 2500);
    }

    async function saveEdit() {
        if (!editing) return;
        setSaving(true);
        await fetch('/api/admin/nav-links', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: editing.id, ...editForm }) });
        setSaving(false); setEditing(null); load();
        setMsg('Link updated!'); setTimeout(() => setMsg(''), 2500);
    }

    async function deleteLink(id: number) {
        if (!confirm('Delete this nav link?')) return;
        await fetch('/api/admin/nav-links', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id }) });
        load();
    }

    async function toggleLink(link: NavLink) {
        await fetch('/api/admin/nav-links', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...link, active: !link.active }) });
        load();
    }

    const linkTypeColor: Record<string, string> = { internal: '#818cf8', hash: '#4ade80', external: '#fb923c' };

    return (
        <div>
            <PageHeader title="Nav Links" subtitle="Manage navbar links shown on your portfolio" />
            {msg && <Toast message={msg} />}

            {/* Edit modal */}
            {editing && (
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
                    <div style={{ ...S.card, width: '100%', maxWidth: 500, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <div style={{ fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#fff' }}>Edit Link</div>
                            <button onClick={() => setEditing(null)} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)', cursor: 'pointer', fontSize: '1.4rem' }}>×</button>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                            <div><label style={S.label}>Label</label><input style={S.input} value={editForm.label} onChange={e => setEditForm(p => ({ ...p, label: e.target.value }))} /></div>
                            <div><label style={S.label}>Href / URL</label><input style={S.input} value={editForm.href} onChange={e => setEditForm(p => ({ ...p, href: e.target.value }))} placeholder="#section or /page or https://..." /></div>
                            <div><label style={S.label}>Type</label>
                                <select style={{ ...S.input }} value={editForm.type} onChange={e => setEditForm(p => ({ ...p, type: e.target.value }))}>
                                    <option value="hash">Hash (#section)</option>
                                    <option value="internal">Internal (/page)</option>
                                    <option value="external">External (https://)</option>
                                </select>
                            </div>
                            <div><label style={S.label}>Order</label><input type="number" style={S.input} value={editForm.displayOrder} onChange={e => setEditForm(p => ({ ...p, displayOrder: Number(e.target.value) }))} /></div>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                            <label style={{ ...S.label, margin: 0 }}>Active</label>
                            <input type="checkbox" checked={editForm.active} onChange={e => setEditForm(p => ({ ...p, active: e.target.checked }))} />
                        </div>
                        <div style={{ display: 'flex', gap: '0.75rem' }}>
                            <button onClick={saveEdit} disabled={saving} style={{ ...S.btn, flex: 1, textAlign: 'center', padding: '0.75rem' }}>{saving ? 'Saving…' : '✓ Save'}</button>
                            <button onClick={() => setEditing(null)} style={{ ...S.btn, opacity: 0.4 }}>Cancel</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Add form */}
            <div style={{ ...S.card, marginBottom: '1.5rem' }}>
                <div style={{ fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.5)', marginBottom: '1rem' }}>+ Add Nav Link</div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 0.5fr auto', gap: '0.75rem', alignItems: 'flex-end' }}>
                    <div><label style={S.label}>Label</label><input style={S.input} placeholder="Shop" value={form.label} onChange={e => setForm(p => ({ ...p, label: e.target.value }))} /></div>
                    <div><label style={S.label}>Href</label><input style={S.input} placeholder="/shop or #section" value={form.href} onChange={e => setForm(p => ({ ...p, href: e.target.value }))} /></div>
                    <div><label style={S.label}>Type</label>
                        <select style={{ ...S.input }} value={form.type} onChange={e => setForm(p => ({ ...p, type: e.target.value }))}>
                            <option value="hash">Hash</option><option value="internal">Internal</option><option value="external">External</option>
                        </select>
                    </div>
                    <div><label style={S.label}>Order</label><input type="number" style={S.input} value={form.displayOrder} onChange={e => setForm(p => ({ ...p, displayOrder: Number(e.target.value) }))} /></div>
                    <button onClick={addLink} disabled={saving} style={{ ...S.btn, padding: '0.7rem 1rem' }}>Add</button>
                </div>
            </div>

            {/* Link list */}
            {loading ? (
                <div style={{ ...S.card, textAlign: 'center', padding: '2rem', color: 'rgba(255,255,255,0.25)' }}>Loading…</div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    {links.sort((a, b) => a.displayOrder - b.displayOrder).map(link => (
                        <div key={link.id} style={{ ...S.card, padding: '0.9rem 1.25rem', display: 'grid', gridTemplateColumns: 'auto 1fr 1fr auto auto auto auto', gap: '1rem', alignItems: 'center', opacity: link.active ? 1 : 0.45 }}>
                            <div style={{ width: 6, height: 6, borderRadius: '50%', background: link.active ? '#4ade80' : 'rgba(255,255,255,0.2)' }} />
                            <div style={{ fontWeight: 700, color: '#fff', fontSize: '0.85rem' }}>{link.label}</div>
                            <code style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.4)', fontFamily: 'monospace' }}>{link.href}</code>
                            <span style={{ fontSize: '0.55rem', letterSpacing: '0.12em', textTransform: 'uppercase', padding: '0.2rem 0.55rem', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.1)', color: linkTypeColor[link.type] || '#fff' }}>{link.type}</span>
                            <span style={{ fontSize: '0.6rem', color: 'rgba(255,255,255,0.25)' }}>#{link.displayOrder}</span>
                            <button onClick={() => toggleLink(link)} style={{ ...S.btn, padding: '0.3rem 0.75rem', fontSize: '0.6rem', opacity: 0.7 }}>{link.active ? 'Hide' : 'Show'}</button>
                            <button onClick={() => { setEditing(link); setEditForm({ label: link.label, href: link.href, type: link.type, displayOrder: link.displayOrder, active: link.active }); }} style={{ ...S.btn, padding: '0.3rem 0.75rem', fontSize: '0.6rem' }}>Edit</button>
                            <button onClick={() => deleteLink(link.id)} style={{ ...S.danger, padding: '0.3rem 0.75rem', fontSize: '0.6rem' }}>Del</button>
                        </div>
                    ))}
                    {links.length === 0 && <div style={{ ...S.card, textAlign: 'center', padding: '3rem', color: 'rgba(255,255,255,0.2)' }}>No links yet — add above or visit /api/admin/setup to seed defaults</div>}
                </div>
            )}
        </div>
    );
}

/* ═══════════════════════════════════════════════════════════════════════════
   MEDIA / BACKGROUND IMAGES TAB
══════════════════════════════════════════════════════════════════════════════ */
function MediaTab() {
    const SECTIONS = ['hero', 'philosophy', 'about', 'skills', 'work', 'presence', 'support', 'contact'];
    const [images, setImages] = useState<BgImage[]>([]);
    const [saving, setSaving] = useState('');
    const [msg, setMsg] = useState('');
    const [forms, setForms] = useState<Record<string, { imageUrl: string; overlayOpacity: number; imagePosition: string }>>({});

    useEffect(() => {
        fetch('/api/admin/background').then(r => r.ok ? r.json() : []).then((data: BgImage[]) => {
            const arr = Array.isArray(data) ? data : [];
            setImages(arr);
            const init: Record<string, any> = {};
            SECTIONS.forEach(s => {
                const found = arr.find(i => i.section === s);
                init[s] = { imageUrl: found?.imageUrl || '', overlayOpacity: found?.overlayOpacity ?? 0.5, imagePosition: found?.imagePosition || 'center' };
            });
            setForms(init);
        });
    }, []);

    async function saveSection(section: string) {
        setSaving(section);
        await fetch('/api/admin/background', {
            method: 'PUT', headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ section, ...forms[section] }),
        });
        setSaving(''); setMsg(`${section} background saved!`); setTimeout(() => setMsg(''), 3000);
    }

    const positions = ['center', 'top', 'bottom', 'left', 'right', 'center top', 'center bottom'];

    return (
        <div>
            <PageHeader title="Media / Backgrounds" subtitle="Set background images for each page section" />
            {msg && <Toast message={msg} />}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '1.25rem' }}>
                {SECTIONS.map(section => (
                    <div key={section} style={{ ...S.card, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {/* Preview */}
                        <div style={{ height: 140, borderRadius: '8px', background: forms[section]?.imageUrl ? `url(${forms[section].imageUrl}) ${forms[section].imagePosition}/cover` : 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', position: 'relative', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            {forms[section]?.imageUrl && <div style={{ position: 'absolute', inset: 0, background: `rgba(0,0,0,${forms[section].overlayOpacity})` }} />}
                            <span style={{ position: 'relative', fontSize: '0.65rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: forms[section]?.imageUrl ? '#fff' : 'rgba(255,255,255,0.2)' }}>
                                {section.toUpperCase()}
                            </span>
                        </div>

                        <div style={{ fontWeight: 700, fontSize: '0.8rem', color: '#fff', textTransform: 'capitalize' }}>{section} Section</div>

                        <div><label style={S.label}>Image URL</label>
                            <input style={S.input} placeholder="https://... or /images/bg.jpg" value={forms[section]?.imageUrl || ''} onChange={e => setForms(p => ({ ...p, [section]: { ...p[section], imageUrl: e.target.value } }))} />
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                            <div>
                                <label style={S.label}>Overlay Opacity ({Math.round((forms[section]?.overlayOpacity || 0) * 100)}%)</label>
                                <input type="range" min="0" max="1" step="0.05" style={{ width: '100%', accentColor: '#818cf8' }} value={forms[section]?.overlayOpacity || 0.5} onChange={e => setForms(p => ({ ...p, [section]: { ...p[section], overlayOpacity: Number(e.target.value) } }))} />
                            </div>
                            <div>
                                <label style={S.label}>Position</label>
                                <select style={{ ...S.input }} value={forms[section]?.imagePosition || 'center'} onChange={e => setForms(p => ({ ...p, [section]: { ...p[section], imagePosition: e.target.value } }))}>
                                    {positions.map(pos => <option key={pos} value={pos}>{pos}</option>)}
                                </select>
                            </div>
                        </div>

                        <button onClick={() => saveSection(section)} disabled={saving === section} style={{ ...S.btn, padding: '0.65rem', textAlign: 'center' as const }}>
                            {saving === section ? 'Saving…' : '✓ Save Background'}
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}

/* ═══════════════════════════════════════════════════════════════════════════
   SETTINGS TAB — expanded with social, SEO, theme
══════════════════════════════════════════════════════════════════════════════ */
function SettingsTab() {
    const [content, setContent] = useState<any>(null);
    const [saving, setSaving] = useState(false);
    const [msg, setMsg] = useState('');
    const [activeSection, setActiveSection] = useState('general');

    useEffect(() => {
        fetch('/api/admin/content').then(r => r.ok ? r.json() : {}).then((d: any) => setContent(d.settings || null));
    }, []);

    async function handleSave(data: any) {
        setSaving(true);
        const res = await fetch('/api/admin/content', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ section: 'siteSettings', id: content?.id, data }) });
        setSaving(false);
        if (res.ok) { setMsg('Settings saved!'); setTimeout(() => setMsg(''), 3000); fetch('/api/admin/content').then(r => r.ok ? r.json() : {}).then((d: any) => setContent(d.settings || null)); }
    }

    const settingSections = [
        { id: 'general', label: '⚙ General' },
        { id: 'social', label: '🔗 Social' },
        { id: 'seo', label: '🔍 SEO' },
        { id: 'contact', label: '📬 Contact' },
    ];

    if (!content) return <div style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.8rem' }}>Loading settings…</div>;

    return (
        <div>
            <PageHeader title="Settings" subtitle="Site-wide configuration" />
            {msg && <Toast message={msg} />}

            {/* Sub-tabs */}
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
                {settingSections.map(s => (
                    <button key={s.id} onClick={() => setActiveSection(s.id)} style={{ padding: '0.5rem 1rem', background: activeSection === s.id ? 'rgba(255,255,255,0.1)' : 'transparent', border: `1px solid ${activeSection === s.id ? 'rgba(255,255,255,0.18)' : 'rgba(255,255,255,0.07)'}`, borderRadius: '8px', color: activeSection === s.id ? '#fff' : 'rgba(255,255,255,0.45)', fontSize: '0.7rem', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', letterSpacing: '0.05em', transition: 'all 0.18s' }}>
                        {s.label}
                    </button>
                ))}
            </div>

            {activeSection === 'general' && (
                <ContentForm title="General Settings" fields={[
                    { key: 'logoText', label: 'Logo Text' },
                    { key: 'footerText', label: 'Footer Text' },
                    { key: 'themeColor', label: 'Theme / Accent Color (hex)' },
                ]} data={content} onSave={handleSave} saving={saving} />
            )}

            {activeSection === 'social' && (
                <ContentForm title="Social Media Links" fields={[
                    { key: 'linkedin', label: 'LinkedIn URL' },
                    { key: 'github', label: 'GitHub URL' },
                    { key: 'twitter', label: 'Twitter / X URL' },
                    { key: 'instagram', label: 'Instagram URL' },
                ]} data={content} onSave={handleSave} saving={saving} />
            )}

            {activeSection === 'seo' && (
                <ContentForm title="SEO Settings" fields={[
                    { key: 'metaDescription', label: 'Meta Description', textarea: true },
                    { key: 'metaKeywords', label: 'Meta Keywords (comma-separated)' },
                ]} data={content} onSave={handleSave} saving={saving} />
            )}

            {activeSection === 'contact' && (
                <ContentForm title="Contact Details" fields={[
                    { key: 'email', label: 'Contact Email' },
                    { key: 'whatsapp', label: 'WhatsApp Number' },
                    { key: 'phone', label: 'Phone Number' },
                    { key: 'address', label: 'Address / Location' },
                ]} data={content} onSave={handleSave} saving={saving} />
            )}
        </div>
    );
}


/* ═══════════════════════════════════════════════════════════════════════════
   SHARED COMPONENTS
══════════════════════════════════════════════════════════════════════════════ */
function PageHeader({ title, subtitle, action }: { title: string; subtitle?: string; action?: React.ReactNode }) {
    return (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
                <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#fff', margin: 0, letterSpacing: '-0.02em' }}>{title}</h1>
                {subtitle && <p style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.32)', margin: '0.3rem 0 0', letterSpacing: '0.05em' }}>{subtitle}</p>}
            </div>
            {action}
        </div>
    );
}

function Toast({ message }: { message: string }) {
    return (
        <div style={{ padding: '0.7rem 1rem', background: 'rgba(60,200,100,0.08)', border: '1px solid rgba(60,200,100,0.2)', borderRadius: '8px', color: 'rgba(80,220,120,0.9)', fontSize: '0.75rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            ✓ {message}
        </div>
    );
}

function ContentForm({ title, fields, data, onSave, saving }: { title: string; fields: { key: string; label: string; textarea?: boolean }[]; data: any; onSave: (d: any) => void; saving: boolean }) {
    const [form, setForm] = useState<any>(() => { const f: any = {}; fields.forEach(field => { f[field.key] = data[field.key] ?? ''; }); return f; });
    return (
        <div style={S.card}>
            <h3 style={{ fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#fff', margin: '0 0 1.5rem', paddingBottom: '0.75rem', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>{title}</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1rem' }}>
                {fields.map(f => (
                    <div key={f.key}>
                        <label style={S.label}>{f.label}</label>
                        {f.textarea ? (
                            <textarea value={form[f.key]} onChange={e => setForm((p: any) => ({ ...p, [f.key]: e.target.value }))} rows={4} style={{ ...S.input, resize: 'vertical' }} />
                        ) : (
                            <input type="text" value={form[f.key]} onChange={e => setForm((p: any) => ({ ...p, [f.key]: e.target.value }))} style={S.input} />
                        )}
                    </div>
                ))}
            </div>
            <button onClick={() => onSave(form)} disabled={saving} style={{ ...S.btn, marginTop: '1.5rem', padding: '0.65rem 1.5rem' }}>
                {saving ? 'Saving…' : '✓ Save Changes'}
            </button>
        </div>
    );
}

function ListEditor({ title, fields, items, onAdd, onDelete, saving }: { title: string; fields: any[]; items: any[]; onAdd: (d: any) => void; onDelete: (id: number) => void; saving: boolean }) {
    const [form, setForm] = useState<any>({});
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {/* Add form */}
            <div style={S.card}>
                <h3 style={{ fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#fff', margin: '0 0 1.25rem', opacity: 0.8 }}>+ Add {title}</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '0.75rem' }}>
                    {fields.map(f => (
                        <div key={f.key}>
                            <label style={S.label}>{f.label}</label>
                            <input type="text" value={form[f.key] || ''} onChange={e => setForm({ ...form, [f.key]: e.target.value })} style={S.input} />
                        </div>
                    ))}
                </div>
                <button onClick={() => { onAdd(form); setForm({}); }} disabled={saving} style={{ ...S.btn, marginTop: '1rem' }}>
                    {saving ? 'Adding…' : '+ Add Item'}
                </button>
            </div>

            {/* Item list */}
            {items.length > 0 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    {items.map((item, i) => (
                        <div key={item.id || i} style={{ ...S.card, padding: '0.9rem 1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
                            <div style={{ minWidth: 0 }}>
                                <div style={{ fontSize: '0.875rem', fontWeight: 600, color: '#fff' }}>{item.title || item.name}</div>
                                <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.3)', marginTop: '2px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '500px' }}>
                                    {item.description || item.type || item.url || item.tagline || ''}
                                </div>
                            </div>
                            <button onClick={() => onDelete(item.id)} style={{ ...S.danger, flexShrink: 0 }}>Delete</button>
                        </div>
                    ))}
                </div>
            )}

            {items.length === 0 && (
                <div style={{ ...S.card, textAlign: 'center', padding: '2.5rem', color: 'rgba(255,255,255,0.2)', fontSize: '0.75rem', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                    No items yet
                </div>
            )}
        </div>
    );
}

/* ═══════════════════════════════════════════════════════════════════════════
   ABOUT TAB
══════════════════════════════════════════════════════════════════════════════ */
function AboutTab() {
    const [data, setData] = useState<any>(null);
    const [form, setForm] = useState({ title: '', bio: '', stat1Label: '', stat1Value: '', stat2Label: '', stat2Value: '', stat3Label: '', stat3Value: '' });
    const [saving, setSaving] = useState(false);
    const [msg, setMsg] = useState('');
    useEffect(() => {
        fetch('/api/admin/content').then(r => r.ok ? r.json() : {}).then((d: any) => {
            if (d.about) { setData(d.about); setForm({ title: d.about.title || '', bio: d.about.bio || '', stat1Label: d.about.stat1Label || '', stat1Value: d.about.stat1Value || '', stat2Label: d.about.stat2Label || '', stat2Value: d.about.stat2Value || '', stat3Label: d.about.stat3Label || '', stat3Value: d.about.stat3Value || '' }); }
        });
    }, []);
    async function save(e: React.FormEvent) {
        e.preventDefault(); setSaving(true);
        await fetch('/api/admin/content', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ section: 'aboutContent', id: data?.id, data: form }) });
        setSaving(false); setMsg('About saved!'); setTimeout(() => setMsg(''), 3000);
    }
    return (
        <div>
            <PageHeader title="About Section" subtitle="Edit bio, title, and stats" />
            {msg && <Toast message={msg} />}
            <form onSubmit={save} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <div style={S.card}><label style={S.label}>Title / Your Name</label><input style={S.input} value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="Dhananjaya Suran Kumara" /></div>
                <div style={S.card}><label style={S.label}>Bio / Description</label><textarea rows={5} style={{ ...S.input, resize: 'vertical' }} value={form.bio} onChange={e => setForm(f => ({ ...f, bio: e.target.value }))} /></div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '1rem' }}>
                    {(['stat1', 'stat2', 'stat3'] as const).map(s => (
                        <div key={s} style={S.card}>
                            <div style={{ fontSize: '0.6rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.35)', marginBottom: '0.75rem' }}>{s.replace('stat', 'Stat ')}</div>
                            <label style={S.label}>Label</label>
                            <input style={{ ...S.input, marginBottom: '0.5rem' }} value={(form as any)[`${s}Label`]} onChange={e => setForm(f => ({ ...f, [`${s}Label`]: e.target.value }))} placeholder="Years Experience" />
                            <label style={S.label}>Value</label>
                            <input style={S.input} value={(form as any)[`${s}Value`]} onChange={e => setForm(f => ({ ...f, [`${s}Value`]: e.target.value }))} placeholder="5+" />
                        </div>
                    ))}
                </div>
                <div><button type="submit" disabled={saving} style={{ ...S.btn, padding: '0.75rem 2rem' }}>{saving ? 'Saving…' : '✓ Save About'}</button></div>
            </form>
        </div>
    );
}

/* ═══════════════════════════════════════════════════════════════════════════
   PHILOSOPHY TAB
══════════════════════════════════════════════════════════════════════════════ */
function PhilosophyTab() {
    const [data, setData] = useState<any>(null);
    const [form, setForm] = useState({ label: '', line1: '', line2: '', bio: '' });
    const [saving, setSaving] = useState(false);
    const [msg, setMsg] = useState('');
    useEffect(() => {
        fetch('/api/admin/content').then(r => r.ok ? r.json() : {}).then((d: any) => {
            if (d.philosophy) { setData(d.philosophy); setForm({ label: d.philosophy.label || '', line1: d.philosophy.line1 || '', line2: d.philosophy.line2 || '', bio: d.philosophy.bio || '' }); }
        });
    }, []);
    async function save(e: React.FormEvent) {
        e.preventDefault(); setSaving(true);
        await fetch('/api/admin/content', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ section: 'philosophyContent', id: data?.id, data: form }) });
        setSaving(false); setMsg('Philosophy saved!'); setTimeout(() => setMsg(''), 3000);
    }
    return (
        <div>
            <PageHeader title="Philosophy Section" subtitle="Edit your creative philosophy statement" />
            {msg && <Toast message={msg} />}
            <form onSubmit={save} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
                    <div style={S.card}><label style={S.label}>Eyebrow Label</label><input style={S.input} value={form.label} onChange={e => setForm(f => ({ ...f, label: e.target.value }))} placeholder="Design Philosophy" /></div>
                    <div style={S.card}><label style={S.label}>Line 1 (Bold)</label><input style={S.input} value={form.line1} onChange={e => setForm(f => ({ ...f, line1: e.target.value }))} /></div>
                    <div style={S.card}><label style={S.label}>Line 2 (Light)</label><input style={S.input} value={form.line2} onChange={e => setForm(f => ({ ...f, line2: e.target.value }))} /></div>
                </div>
                <div style={S.card}><label style={S.label}>Description Text</label><textarea rows={4} style={{ ...S.input, resize: 'vertical' }} value={form.bio} onChange={e => setForm(f => ({ ...f, bio: e.target.value }))} /></div>
                <div style={{ ...S.card, background: '#050505', padding: '2.5rem' }}>
                    <div style={{ fontSize: '0.55rem', letterSpacing: '0.4em', textTransform: 'uppercase', color: 'rgba(229,9,20,0.7)', marginBottom: '0.75rem' }}>{form.label || 'Design Philosophy'}</div>
                    <div style={{ fontSize: 'clamp(1.5rem,3vw,2.5rem)', fontWeight: 900, textTransform: 'uppercase' }}>{form.line1 || 'Line 1 Preview'}</div>
                    <div style={{ fontSize: 'clamp(1rem,2vw,1.75rem)', fontWeight: 200, opacity: 0.5, textTransform: 'uppercase' }}>{form.line2 || 'Line 2 Preview'}</div>
                    <p style={{ marginTop: '1rem', fontSize: '0.8rem', color: 'rgba(255,255,255,0.4)', lineHeight: 1.7 }}>{form.bio || 'Description preview…'}</p>
                    <div style={{ fontSize: '0.5rem', color: 'rgba(255,255,255,0.12)', letterSpacing: '0.3em', textTransform: 'uppercase', marginTop: '1rem' }}>↑ Live Preview ↑</div>
                </div>
                <div><button type="submit" disabled={saving} style={{ ...S.btn, padding: '0.75rem 2rem' }}>{saving ? 'Saving…' : '✓ Save Philosophy'}</button></div>
            </form>
        </div>
    );
}

/* ═══════════════════════════════════════════════════════════════════════════
   TECHNICAL TAB
══════════════════════════════════════════════════════════════════════════════ */
function TechnicalTab() {
    const [skills, setSkills] = useState<any[]>([]);
    const [form, setForm] = useState({ name: '', type: '' });
    const [saving, setSaving] = useState(false);
    const [msg, setMsg] = useState('');
    const load = useCallback(() => { fetch('/api/admin/content').then(r => r.ok ? r.json() : {}).then((d: any) => setSkills(d.skills || [])); }, []);
    useEffect(() => { load(); }, [load]);
    async function add(e: React.FormEvent) {
        e.preventDefault(); if (!form.name.trim()) return; setSaving(true);
        await fetch('/api/admin/content', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ section: 'technicalSkills', data: form }) });
        setSaving(false); setForm({ name: '', type: '' }); load(); setMsg('Skill added!'); setTimeout(() => setMsg(''), 2500);
    }
    async function del(id: number) {
        await fetch('/api/admin/content', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ section: 'technicalSkills', id }) });
        load();
    }
    const types = ['Language', 'Framework', 'CSS', 'Design', 'Motion', '3D / WebGL', 'Backend', 'Database', 'DevOps', 'Tool'];
    return (
        <div>
            <PageHeader title="Technical Skills" subtitle={`${skills.length} skills in horizontal scroll strip`} />
            {msg && <Toast message={msg} />}
            <form onSubmit={add} style={{ ...S.card, display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
                <div style={{ flex: 2, minWidth: 160 }}><label style={S.label}>Skill Name</label><input style={S.input} value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="React" required /></div>
                <div style={{ flex: 1, minWidth: 140 }}><label style={S.label}>Type</label><select style={S.input} value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value }))}><option value="">Select type…</option>{types.map(t => <option key={t} value={t}>{t}</option>)}</select></div>
                <div style={{ display: 'flex', alignItems: 'flex-end' }}><button type="submit" disabled={saving} style={{ ...S.btn, padding: '0.7rem 1.5rem' }}>{saving ? '…' : '+ Add'}</button></div>
            </form>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.6rem' }}>
                {skills.map(s => (<div key={s.id} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.6rem', padding: '0.45rem 0.9rem', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '2rem' }}><span style={{ fontSize: '0.65rem', color: 'rgba(229,9,20,0.85)', letterSpacing: '0.15em', textTransform: 'uppercase' }}>{s.type}</span><span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#fff' }}>{s.name}</span><button onClick={() => del(s.id)} style={{ background: 'none', border: 'none', color: 'rgba(255,80,80,0.7)', cursor: 'pointer', fontSize: '0.9rem', lineHeight: 1, padding: 0 }}>×</button></div>))}
                {skills.length === 0 && <div style={{ ...S.card, width: '100%', textAlign: 'center', padding: '2rem', color: 'rgba(255,255,255,0.2)', fontSize: '0.8rem' }}>No custom skills — defaults shown. Add yours here.</div>}
            </div>
        </div>
    );
}

/* ═══════════════════════════════════════════════════════════════════════════
   PROJECTS TAB
══════════════════════════════════════════════════════════════════════════════ */
function ProjectsTab() {
    const [items, setItems] = useState<any[]>([]);
    const [form, setForm] = useState({ title: '', description: '', tags: '', link: '', imageUrl: '' });
    const [editing, setEditing] = useState<any>(null);
    const [saving, setSaving] = useState(false);
    const [msg, setMsg] = useState('');
    const [showForm, setShowForm] = useState(false);
    const load = useCallback(() => { fetch('/api/admin/content').then(r => r.ok ? r.json() : {}).then((d: any) => setItems(d.projects || [])); }, []);
    useEffect(() => { load(); }, [load]);
    function openAdd() { setEditing(null); setForm({ title: '', description: '', tags: '', link: '', imageUrl: '' }); setShowForm(true); }
    function openEdit(p: any) { setEditing(p); setForm({ title: p.title || '', description: p.description || '', tags: p.tags || '', link: p.link || '', imageUrl: p.imageUrl || '' }); setShowForm(true); }
    async function save(e: React.FormEvent) {
        e.preventDefault(); setSaving(true);
        const method = editing ? 'PUT' : 'POST';
        const body = editing ? { section: 'projects', id: editing.id, data: form } : { section: 'projects', data: form };
        await fetch('/api/admin/content', { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
        setSaving(false); setShowForm(false); load(); setMsg(editing ? 'Updated!' : 'Added!'); setTimeout(() => setMsg(''), 2500);
    }
    async function del(id: number) {
        if (!confirm('Delete?')) return;
        await fetch('/api/admin/content', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ section: 'projects', id }) });
        load();
    }
    return (
        <div>
            <PageHeader title="Projects / Work" subtitle={`${items.length} project${items.length !== 1 ? 's' : ''} — latest 3 shown on homepage`} action={<button onClick={openAdd} style={{ ...S.btn, padding: '0.6rem 1.25rem' }}>+ Add Project</button>} />
            {msg && <Toast message={msg} />}
            {showForm && (
                <div style={{ ...S.card, marginBottom: '1.5rem' }}>
                    <div style={{ fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.5)', marginBottom: '1rem' }}>{editing ? 'Edit Project' : 'New Project'}</div>
                    <form onSubmit={save} style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.9rem' }}>
                            <div><label style={S.label}>Title *</label><input style={S.input} value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} required /></div>
                            <div><label style={S.label}>Tags (comma separated)</label><input style={S.input} value={form.tags} onChange={e => setForm(f => ({ ...f, tags: e.target.value }))} placeholder="Branding, Motion" /></div>
                            <div><label style={S.label}>Link URL</label><input style={S.input} value={form.link} onChange={e => setForm(f => ({ ...f, link: e.target.value }))} /></div>
                            <div><label style={S.label}>Image URL</label><input style={S.input} value={form.imageUrl} onChange={e => setForm(f => ({ ...f, imageUrl: e.target.value }))} /></div>
                        </div>
                        <div><label style={S.label}>Description</label><textarea rows={3} style={{ ...S.input, resize: 'vertical' }} value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} /></div>
                        <div style={{ display: 'flex', gap: '0.75rem' }}><button type="submit" disabled={saving} style={S.btn}>{saving ? 'Saving…' : editing ? '✓ Update' : '+ Add'}</button><button type="button" onClick={() => setShowForm(false)} style={{ ...S.btn, opacity: 0.4 }}>Cancel</button></div>
                    </form>
                </div>
            )}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '1rem' }}>
                {items.map(p => (
                    <div key={p.id} style={S.card}>
                        {p.imageUrl && <div style={{ height: 130, borderRadius: '8px', background: `url(${p.imageUrl}) center/cover`, marginBottom: '0.9rem' }} />}
                        <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#fff', marginBottom: '0.25rem' }}>{p.title}</div>
                        <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.35)', marginBottom: '0.65rem', lineHeight: 1.5 }}>{p.description}</div>
                        {p.tags && <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.3rem', marginBottom: '0.65rem' }}>{String(p.tags).split(',').map((t: string) => <span key={t} style={{ fontSize: '0.55rem', padding: '0.15rem 0.45rem', background: 'rgba(229,9,20,0.09)', border: '1px solid rgba(229,9,20,0.2)', borderRadius: '20px', color: 'rgba(229,9,20,0.8)' }}>{t.trim()}</span>)}</div>}
                        <div style={{ display: 'flex', gap: '0.5rem' }}><button onClick={() => openEdit(p)} style={{ ...S.btn, flex: 1 }}>✏ Edit</button><button onClick={() => del(p.id)} style={S.danger}>Delete</button></div>
                    </div>
                ))}
                {items.length === 0 && <div style={{ ...S.card, gridColumn: '1/-1', textAlign: 'center', padding: '3rem', color: 'rgba(255,255,255,0.2)', fontSize: '0.8rem' }}>No projects — click + Add Project to start</div>}
            </div>
        </div>
    );
}

/* ═══════════════════════════════════════════════════════════════════════════
   PRESENCE TAB
══════════════════════════════════════════════════════════════════════════════ */
function PresenceTab() {
    const [items, setItems] = useState<any[]>([]);
    const [form, setForm] = useState({ name: '', platformId: '', url: '', tagline: '', color: '#ffffff' });
    const [saving, setSaving] = useState(false);
    const [msg, setMsg] = useState('');
    const [showForm, setShowForm] = useState(false);
    const load = useCallback(() => { fetch('/api/admin/content').then(r => r.ok ? r.json() : {}).then((d: any) => setItems(d.presence || [])); }, []);
    useEffect(() => { load(); }, [load]);
    async function add(e: React.FormEvent) {
        e.preventDefault(); setSaving(true);
        await fetch('/api/admin/content', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ section: 'presenceLinks', data: form }) });
        setSaving(false); setShowForm(false); setForm({ name: '', platformId: '', url: '', tagline: '', color: '#ffffff' }); load(); setMsg('Added!'); setTimeout(() => setMsg(''), 2000);
    }
    async function del(id: number) {
        await fetch('/api/admin/content', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ section: 'presenceLinks', id }) });
        load();
    }
    const suggestions = ['instagram', 'behance', 'dribbble', 'tiktok', 'youtube', 'linkedin', 'github', 'facebook', 'x', 'telegram', 'whatsapp', 'fiverr', 'upwork', 'pph'];
    return (
        <div>
            <PageHeader title="Presence / Platforms" subtitle={`${items.length} custom platform${items.length !== 1 ? 's' : ''} (14 defaults when empty)`} action={<button onClick={() => setShowForm(s => !s)} style={{ ...S.btn, padding: '0.6rem 1.25rem' }}>+ Add Platform</button>} />
            {msg && <Toast message={msg} />}
            {showForm && (
                <form onSubmit={add} style={{ ...S.card, display: 'flex', flexDirection: 'column', gap: '0.9rem', marginBottom: '1.5rem' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px,1fr))', gap: '0.75rem' }}>
                        <div><label style={S.label}>Name *</label><input style={S.input} value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Instagram" required /></div>
                        <div><label style={S.label}>Platform ID</label><select style={S.input} value={form.platformId} onChange={e => setForm(f => ({ ...f, platformId: e.target.value }))}><option value="">Select…</option>{suggestions.map(s => <option key={s} value={s}>{s}</option>)}</select></div>
                        <div><label style={S.label}>URL</label><input style={S.input} value={form.url} onChange={e => setForm(f => ({ ...f, url: e.target.value }))} /></div>
                        <div><label style={S.label}>Tagline</label><input style={S.input} value={form.tagline} onChange={e => setForm(f => ({ ...f, tagline: e.target.value }))} /></div>
                        <div><label style={S.label}>Color</label><input type="color" style={{ ...S.input, padding: '0.25rem', height: '2.4rem', cursor: 'pointer' }} value={form.color} onChange={e => setForm(f => ({ ...f, color: e.target.value }))} /></div>
                    </div>
                    <div style={{ display: 'flex', gap: '0.75rem' }}><button type="submit" disabled={saving} style={S.btn}>{saving ? '…' : '+ Add'}</button><button type="button" onClick={() => setShowForm(false)} style={{ ...S.btn, opacity: 0.4 }}>Cancel</button></div>
                </form>
            )}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                {items.map(p => (<div key={p.id} style={{ ...S.card, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}><div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}><div style={{ width: 10, height: 10, borderRadius: '50%', background: p.color || '#fff', flexShrink: 0 }} /><div><div style={{ fontSize: '0.875rem', fontWeight: 700, color: '#fff' }}>{p.name}</div><div style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.3)' }}>{p.tagline} · {p.url}</div></div></div><button onClick={() => del(p.id)} style={{ ...S.danger, flexShrink: 0 }}>Delete</button></div>))}
                {items.length === 0 && <div style={{ ...S.card, textAlign: 'center', padding: '2rem', color: 'rgba(255,255,255,0.2)', fontSize: '0.8rem' }}>Empty — 14 default platforms shown on site</div>}
            </div>
        </div>
    );
}

/* ═══════════════════════════════════════════════════════════════════════════
   SUPPORT TAB
══════════════════════════════════════════════════════════════════════════════ */
function SupportTab() {
    const [items, setItems] = useState<any[]>([]);
    const [form, setForm] = useState({ title: '', description: '', url: '', icon: '' });
    const [saving, setSaving] = useState(false);
    const [msg, setMsg] = useState('');
    const [showForm, setShowForm] = useState(false);
    const load = useCallback(() => { fetch('/api/admin/content').then(r => r.ok ? r.json() : {}).then((d: any) => setItems(d.support || [])); }, []);
    useEffect(() => { load(); }, [load]);
    async function add(e: React.FormEvent) {
        e.preventDefault(); setSaving(true);
        await fetch('/api/admin/content', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ section: 'supportItems', data: form }) });
        setSaving(false); setShowForm(false); setForm({ title: '', description: '', url: '', icon: '' }); load(); setMsg('Added!'); setTimeout(() => setMsg(''), 2000);
    }
    async function del(id: number) {
        await fetch('/api/admin/content', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ section: 'supportItems', id }) });
        load();
    }
    return (
        <div>
            <PageHeader title="Support Items" subtitle="Manage support / donation links on the site" action={<button onClick={() => setShowForm(s => !s)} style={{ ...S.btn, padding: '0.6rem 1.25rem' }}>+ Add Item</button>} />
            {msg && <Toast message={msg} />}
            {showForm && (
                <form onSubmit={add} style={{ ...S.card, display: 'flex', flexDirection: 'column', gap: '0.9rem', marginBottom: '1.5rem' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px,1fr))', gap: '0.75rem' }}>
                        <div><label style={S.label}>Title *</label><input style={S.input} value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="Buy Me a Coffee" required /></div>
                        <div><label style={S.label}>URL</label><input style={S.input} value={form.url} onChange={e => setForm(f => ({ ...f, url: e.target.value }))} /></div>
                        <div><label style={S.label}>Icon (emoji)</label><input style={S.input} value={form.icon} onChange={e => setForm(f => ({ ...f, icon: e.target.value }))} placeholder="☕" /></div>
                        <div><label style={S.label}>Description</label><input style={S.input} value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} /></div>
                    </div>
                    <div style={{ display: 'flex', gap: '0.75rem' }}><button type="submit" disabled={saving} style={S.btn}>{saving ? '…' : '+ Add'}</button><button type="button" onClick={() => setShowForm(false)} style={{ ...S.btn, opacity: 0.4 }}>Cancel</button></div>
                </form>
            )}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                {items.map(p => (<div key={p.id} style={{ ...S.card, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}><div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}><span style={{ fontSize: '1.4rem' }}>{p.icon || '⭐'}</span><div><div style={{ fontSize: '0.875rem', fontWeight: 700, color: '#fff' }}>{p.title}</div><div style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.3)' }}>{p.description} · <a href={p.url} target="_blank" rel="noopener noreferrer" style={{ color: 'rgba(229,9,20,0.7)' }}>{p.url}</a></div></div></div><button onClick={() => del(p.id)} style={{ ...S.danger, flexShrink: 0 }}>Delete</button></div>))}
                {items.length === 0 && <div style={{ ...S.card, textAlign: 'center', padding: '2rem', color: 'rgba(255,255,255,0.2)', fontSize: '0.8rem' }}>Empty — defaults (Coffee / Pizza) shown on site</div>}
            </div>
        </div>
    );
}

/* ═══════════════════════════════════════════════════════════════════════════
   REVIEWS TAB
══════════════════════════════════════════════════════════════════════════════ */
function ReviewsTab() {
    const [reviewList, setReviewList] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [msg, setMsg] = useState('');
    const load = useCallback(() => { setLoading(true); fetch('/api/admin/reviews').then(r => r.ok ? r.json() : []).then(d => { setReviewList(d); setLoading(false); }); }, []);
    useEffect(() => { load(); }, [load]);
    async function del(id: number) {
        if (!confirm('Delete?')) return;
        await fetch('/api/admin/reviews', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id }) });
        load(); setMsg('Deleted!'); setTimeout(() => setMsg(''), 2000);
    }
    const avg = reviewList.length ? (reviewList.reduce((s: number, r: any) => s + r.rating, 0) / reviewList.length).toFixed(1) : '—';
    const stars = (n: number) => Array.from({ length: 5 }, (_, i) => <span key={i} style={{ color: i < n ? '#FFD700' : 'rgba(255,255,255,0.15)', fontSize: 13 }}>★</span>);
    return (
        <div>
            <PageHeader title="Reviews" subtitle={`${reviewList.length} review${reviewList.length !== 1 ? 's' : ''} · Average ${avg} ★`} />
            {msg && <Toast message={msg} />}
            {loading ? (<div style={{ ...S.card, textAlign: 'center', padding: '3rem', color: 'rgba(255,255,255,0.25)' }}>Loading…</div>)
            : reviewList.length === 0 ? (<div style={{ ...S.card, textAlign: 'center', padding: '3rem', color: 'rgba(255,255,255,0.25)', fontSize: '0.8rem' }}>No reviews yet</div>)
            : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    {reviewList.map((r: any) => (
                        <div key={r.id} style={{ ...S.card, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem', flexWrap: 'wrap' }}>
                            <div style={{ flex: 1, minWidth: 0 }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                                    <div style={{ width: 30, height: 30, borderRadius: '50%', background: 'rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', fontWeight: 700 }}>{r.userName?.charAt(0).toUpperCase()}</div>
                                    <div><div style={{ fontSize: '0.875rem', fontWeight: 700, color: '#fff' }}>{r.userName}</div><div style={{ fontSize: '0.6rem', color: 'rgba(255,255,255,0.3)' }}>{new Date(r.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</div></div>
                                    <div style={{ display: 'flex', gap: '1px' }}>{stars(r.rating)}</div>
                                </div>
                                <p style={{ fontSize: '0.825rem', color: 'rgba(255,255,255,0.55)', lineHeight: 1.6, fontStyle: 'italic', margin: 0 }}>"{r.body}"</p>
                            </div>
                            <button onClick={() => del(r.id)} style={{ ...S.danger, flexShrink: 0 }}>Delete</button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
