'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// ─────────────── Types ───────────────
interface Project { id?: number; title: string; description: string; tags: string; link: string; imageUrl: string; }
interface HeroData { headline: string; subheadline: string; ctaText: string; }
interface AboutData { title: string; bio: string; stat1Value: string; stat1Label: string; stat2Value: string; stat2Label: string; stat3Value: string; stat3Label: string; }
interface Settings { logoText: string; email: string; whatsapp: string; linkedin: string; }
interface Message { id: number; name: string; email: string; message: string; createdAt: string; }

type Tab = 'hero' | 'about' | 'projects' | 'settings' | 'messages';

// ─────────────── Styles ───────────────
const inputStyle: React.CSSProperties = {
    width: '100%', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '8px', padding: '0.75rem 1rem', color: 'white', fontSize: '0.9rem',
    outline: 'none', marginBottom: '1rem', boxSizing: 'border-box',
};
const labelStyle: React.CSSProperties = { fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.2em', opacity: 0.4, display: 'block', marginBottom: '0.4rem' };
const btnStyle: React.CSSProperties = { padding: '0.75rem 2rem', background: 'white', color: 'black', border: 'none', borderRadius: '100px', fontWeight: 700, cursor: 'pointer', fontSize: '0.8rem', letterSpacing: '0.15em', textTransform: 'uppercase' };
const dangerBtn: React.CSSProperties = { ...btnStyle, background: 'transparent', color: '#ff4444', border: '1px solid #ff4444' };
const cardStyle: React.CSSProperties = { background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', padding: '1.5rem', marginBottom: '1rem' };

// ─────────────── Save Banner ───────────────
function SaveBanner({ msg }: { msg: string }) {
    return (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            style={{ position: 'fixed', bottom: '2rem', right: '2rem', background: '#0f0', color: '#000', padding: '0.75rem 1.5rem', borderRadius: '100px', fontWeight: 700, fontSize: '0.8rem', zIndex: 9999 }}>
            {msg}
        </motion.div>
    );
}

// ─────────────── Hero Editor ───────────────
function HeroEditor() {
    const [data, setData] = useState<HeroData>({ headline: '', subheadline: '', ctaText: '' });
    const [saved, setSaved] = useState('');
    useEffect(() => { fetch('/api/admin/hero').then(r => r.json()).then(setData); }, []);
    const save = async () => {
        await fetch('/api/admin/hero', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
        setSaved('Saved!'); setTimeout(() => setSaved(''), 2000);
    };
    return (
        <div>
            <h2 style={{ margin: '0 0 2rem', fontWeight: 300, opacity: 0.6, fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.2em' }}>Hero Section</h2>
            <label style={labelStyle}>Headline</label>
            <input style={inputStyle} value={data.headline || ''} onChange={e => setData({ ...data, headline: e.target.value })} />
            <label style={labelStyle}>Subheadline</label>
            <input style={inputStyle} value={data.subheadline || ''} onChange={e => setData({ ...data, subheadline: e.target.value })} />
            <label style={labelStyle}>CTA Button Text</label>
            <input style={inputStyle} value={data.ctaText || ''} onChange={e => setData({ ...data, ctaText: e.target.value })} />
            <button style={btnStyle} onClick={save}>Save Hero</button>
            <AnimatePresence>{saved && <SaveBanner msg={saved} />}</AnimatePresence>
        </div>
    );
}

// ─────────────── About Editor ───────────────
function AboutEditor() {
    const [data, setData] = useState<AboutData>({ title: '', bio: '', stat1Value: '', stat1Label: '', stat2Value: '', stat2Label: '', stat3Value: '', stat3Label: '' });
    const [saved, setSaved] = useState('');
    useEffect(() => { fetch('/api/admin/about').then(r => r.json()).then(setData); }, []);
    const save = async () => {
        await fetch('/api/admin/about', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
        setSaved('Saved!'); setTimeout(() => setSaved(''), 2000);
    };
    const f = (key: keyof AboutData) => <><label style={labelStyle}>{key.replace(/([A-Z])/g, ' $1').toUpperCase()}</label>
        {key === 'bio' ? <textarea style={{ ...inputStyle, resize: 'vertical', minHeight: '100px' }} value={data[key] || ''} onChange={e => setData({ ...data, [key]: e.target.value })} /> : <input style={inputStyle} value={data[key] || ''} onChange={e => setData({ ...data, [key]: e.target.value })} />}</>;
    return (
        <div>
            <h2 style={{ margin: '0 0 2rem', fontWeight: 300, opacity: 0.6, fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.2em' }}>About Section</h2>
            {f('title')}{f('bio')}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 1rem' }}>
                {f('stat1Value')}{f('stat1Label')}{f('stat2Value')}{f('stat2Label')}{f('stat3Value')}{f('stat3Label')}
            </div>
            <button style={btnStyle} onClick={save}>Save About</button>
            <AnimatePresence>{saved && <SaveBanner msg={saved} />}</AnimatePresence>
        </div>
    );
}

// ─────────────── Projects Manager ───────────────
function ProjectsManager() {
    const [list, setList] = useState<Project[]>([]);
    const [form, setForm] = useState<Project>({ title: '', description: '', tags: '', link: '', imageUrl: '' });
    const [saved, setSaved] = useState('');
    const load = () => fetch('/api/admin/projects').then(r => r.json()).then(setList);
    useEffect(() => { load(); }, []);
    const add = async () => {
        await fetch('/api/admin/projects', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
        setForm({ title: '', description: '', tags: '', link: '', imageUrl: '' });
        load(); setSaved('Project Added!'); setTimeout(() => setSaved(''), 2000);
    };
    const del = async (id: number) => {
        await fetch('/api/admin/projects', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id }) });
        load();
    };
    return (
        <div>
            <h2 style={{ margin: '0 0 2rem', fontWeight: 300, opacity: 0.6, fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.2em' }}>Projects</h2>
            <div style={cardStyle}>
                <p style={{ ...labelStyle, marginBottom: '1rem' }}>Add New Project</p>
                {(['title', 'description', 'tags', 'link', 'imageUrl'] as const).map(k => (
                    <div key={k}><label style={labelStyle}>{k.replace(/([A-Z])/g, ' $1').toUpperCase()}</label>
                        <input style={inputStyle} value={form[k]} onChange={e => setForm({ ...form, [k]: e.target.value })} /></div>
                ))}
                <button style={btnStyle} onClick={add}>Add Project</button>
            </div>
            {list.map(p => (
                <div key={p.id} style={{ ...cardStyle, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div><p style={{ margin: 0, fontWeight: 600 }}>{p.title}</p><p style={{ margin: '0.25rem 0 0', opacity: 0.4, fontSize: '0.8rem' }}>{p.tags}</p></div>
                    <button style={dangerBtn} onClick={() => p.id && del(p.id)}>Delete</button>
                </div>
            ))}
            <AnimatePresence>{saved && <SaveBanner msg={saved} />}</AnimatePresence>
        </div>
    );
}

// ─────────────── Settings Editor ───────────────
function SettingsEditor() {
    const [data, setData] = useState<Settings>({ logoText: '', email: '', whatsapp: '', linkedin: '' });
    const [saved, setSaved] = useState('');
    useEffect(() => { fetch('/api/admin/settings').then(r => r.json()).then(setData); }, []);
    const save = async () => {
        await fetch('/api/admin/settings', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
        setSaved('Saved!'); setTimeout(() => setSaved(''), 2000);
    };
    return (
        <div>
            <h2 style={{ margin: '0 0 2rem', fontWeight: 300, opacity: 0.6, fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.2em' }}>Site Settings</h2>
            {(['logoText', 'email', 'whatsapp', 'linkedin'] as const).map(k => (
                <div key={k}><label style={labelStyle}>{k.replace(/([A-Z])/g, ' $1').toUpperCase()}</label>
                    <input style={inputStyle} value={data[k] || ''} onChange={e => setData({ ...data, [k]: e.target.value })} /></div>
            ))}
            <button style={btnStyle} onClick={save}>Save Settings</button>
            <AnimatePresence>{saved && <SaveBanner msg={saved} />}</AnimatePresence>
        </div>
    );
}

// ─────────────── Messages Viewer ───────────────
function MessagesViewer() {
    const [msgs, setMsgs] = useState<Message[]>([]);
    useEffect(() => { fetch('/api/admin/messages').then(r => r.json()).then(setMsgs); }, []);
    return (
        <div>
            <h2 style={{ margin: '0 0 2rem', fontWeight: 300, opacity: 0.6, fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.2em' }}>Contact Messages ({msgs.length})</h2>
            {msgs.length === 0 && <p style={{ opacity: 0.3 }}>No messages yet.</p>}
            {msgs.map(m => (
                <div key={m.id} style={cardStyle}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                        <p style={{ margin: 0, fontWeight: 700 }}>{m.name}</p>
                        <p style={{ margin: 0, opacity: 0.3, fontSize: '0.7rem' }}>{new Date(m.createdAt).toLocaleDateString()}</p>
                    </div>
                    <p style={{ margin: '0 0 0.5rem', opacity: 0.5, fontSize: '0.8rem' }}>{m.email}</p>
                    <p style={{ margin: 0, lineHeight: 1.6, opacity: 0.8 }}>{m.message}</p>
                </div>
            ))}
        </div>
    );
}

// ─────────────── Main Admin Page ───────────────
export default function AdminPage() {
    const [loggedIn, setLoggedIn] = useState(false);
    const [checking, setChecking] = useState(true);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loginError, setLoginError] = useState('');
    const [activeTab, setActiveTab] = useState<Tab>('hero');

    useEffect(() => {
        fetch('/api/auth/me').then(r => r.json()).then(d => { setLoggedIn(d.isLoggedIn); setChecking(false); });
    }, []);

    const login = async (e: React.FormEvent) => {
        e.preventDefault();
        const res = await fetch('/api/auth/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ username, password }) });
        if (res.ok) { setLoggedIn(true); setLoginError(''); }
        else { setLoginError('Invalid username or password'); }
    };

    const logout = async () => {
        await fetch('/api/auth/logout', { method: 'POST' });
        setLoggedIn(false);
    };

    if (checking) return (
        <div style={{ minHeight: '100vh', background: '#050505', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ width: '40px', height: '40px', border: '1px solid rgba(255,255,255,0.2)', borderTopColor: 'white', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
        </div>
    );

    if (!loggedIn) return (
        <div style={{ minHeight: '100vh', background: '#050505', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'system-ui, sans-serif', color: 'white' }}>
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} style={{ width: '100%', maxWidth: '380px', padding: '2rem' }}>
                <div style={{ marginBottom: '3rem', textAlign: 'center' }}>
                    <p style={{ fontSize: '0.6rem', letterSpacing: '0.4em', textTransform: 'uppercase', opacity: 0.3, margin: '0 0 0.5rem' }}>Admin Panel</p>
                    <h1 style={{ fontSize: '2rem', fontWeight: 900, margin: 0, letterSpacing: '-0.03em' }}>DANANJAYA</h1>
                </div>
                <form onSubmit={login}>
                    <label style={labelStyle}>Username</label>
                    <input style={inputStyle} type="text" value={username} onChange={e => setUsername(e.target.value)} autoComplete="username" />
                    <label style={labelStyle}>Password</label>
                    <input style={inputStyle} type="password" value={password} onChange={e => setPassword(e.target.value)} autoComplete="current-password" />
                    {loginError && <p style={{ color: '#ff4444', fontSize: '0.8rem', margin: '-0.5rem 0 1rem' }}>{loginError}</p>}
                    <button type="submit" style={{ ...btnStyle, width: '100%', padding: '1rem' }}>Login</button>
                </form>
            </motion.div>
        </div>
    );

    const tabs: { id: Tab; label: string }[] = [
        { id: 'hero', label: 'Hero' }, { id: 'about', label: 'About' },
        { id: 'projects', label: 'Projects' }, { id: 'settings', label: 'Settings' }, { id: 'messages', label: 'Messages' },
    ];

    return (
        <div style={{ minHeight: '100vh', background: '#050505', color: 'white', fontFamily: 'system-ui, sans-serif', display: 'flex' }}>
            <style>{`@keyframes spin { to { transform: rotate(360deg); } } * { box-sizing: border-box; } input, textarea, button { font-family: inherit; }`}</style>
            {/* Sidebar */}
            <aside style={{ width: '220px', minHeight: '100vh', background: 'rgba(255,255,255,0.02)', borderRight: '1px solid rgba(255,255,255,0.05)', padding: '2rem 1rem', display: 'flex', flexDirection: 'column', flexShrink: 0 }}>
                <div style={{ marginBottom: '3rem' }}>
                    <p style={{ fontSize: '0.55rem', letterSpacing: '0.4em', textTransform: 'uppercase', opacity: 0.25, margin: '0 0 0.25rem' }}>Portfolio</p>
                    <p style={{ fontSize: '0.85rem', fontWeight: 700, margin: 0, letterSpacing: '0.1em' }}>ADMIN PANEL</p>
                </div>
                <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', flex: 1 }}>
                    {tabs.map(t => (
                        <button key={t.id} onClick={() => setActiveTab(t.id)} style={{ background: activeTab === t.id ? 'rgba(255,255,255,0.08)' : 'transparent', border: 'none', color: activeTab === t.id ? 'white' : 'rgba(255,255,255,0.4)', padding: '0.75rem 1rem', borderRadius: '8px', cursor: 'pointer', textAlign: 'left', fontSize: '0.8rem', fontWeight: activeTab === t.id ? 600 : 400, letterSpacing: '0.05em', transition: 'all 0.2s ease' }}>
                            {t.label}
                        </button>
                    ))}
                </nav>
                <button onClick={logout} style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.4)', padding: '0.6rem 1rem', borderRadius: '8px', cursor: 'pointer', fontSize: '0.75rem', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                    Logout
                </button>
            </aside>
            {/* Main Content */}
            <main style={{ flex: 1, padding: '3rem', maxWidth: '800px', overflowY: 'auto' }}>
                <AnimatePresence mode="wait">
                    <motion.div key={activeTab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
                        {activeTab === 'hero' && <HeroEditor />}
                        {activeTab === 'about' && <AboutEditor />}
                        {activeTab === 'projects' && <ProjectsManager />}
                        {activeTab === 'settings' && <SettingsEditor />}
                        {activeTab === 'messages' && <MessagesViewer />}
                    </motion.div>
                </AnimatePresence>
            </main>
        </div>
    );
}
