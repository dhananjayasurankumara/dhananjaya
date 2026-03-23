'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface UserProfile {
    id: number;
    name: string;
    email: string;
    avatar?: string;
    bio?: string;
    role?: string;
    createdAt?: string;
}

export default function ProfilePage() {
    const [user, setUser] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const [editing, setEditing] = useState(false);
    const [saving, setSaving] = useState(false);
    const [saveMsg, setSaveMsg] = useState('');
    const [form, setForm] = useState({ name: '', bio: '', avatar: '' });
    const router = useRouter();

    useEffect(() => {
        fetch('/api/user/profile')
            .then(r => r.ok ? r.json() : Promise.reject(r))
            .then(data => { setUser(data); setForm({ name: data.name, bio: data.bio || '', avatar: data.avatar || '' }); })
            .catch(() => router.push('/login'))
            .finally(() => setLoading(false));
    }, []);

    async function handleSave(e: React.FormEvent) {
        e.preventDefault();
        setSaving(true);
        setSaveMsg('');
        const res = await fetch('/api/user/profile', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(form),
        });
        const data = await res.json();
        setSaving(false);
        if (res.ok) { setUser({ ...user!, ...data }); setEditing(false); setSaveMsg('Profile updated!'); }
    }

    async function handleLogout() {
        await fetch('/api/auth/logout', { method: 'POST' });
        router.push('/login');
    }

    if (loading) return (
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#050505' }}>
            <div style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.8rem', letterSpacing: '0.2em', textTransform: 'uppercase' }}>Loading...</div>
        </div>
    );

    return (
        <div style={{
            minHeight: '100vh',
            background: '#050505',
            paddingTop: '6rem',
            paddingBottom: '4rem',
            padding: '6rem 2rem 4rem',
        }}>
            <div style={{ maxWidth: '720px', margin: '0 auto' }}>
                {/* Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
                    <Link href="/" style={{ fontSize: '0.65rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.35)', textDecoration: 'none' }}>
                        ← Portfolio
                    </Link>
                    <button
                        onClick={handleLogout}
                        style={{ fontSize: '0.65rem', letterSpacing: '0.15em', textTransform: 'uppercase', background: 'none', border: '1px solid rgba(255,80,80,0.3)', color: 'rgba(255,80,80,0.7)', borderRadius: '2rem', padding: '0.4rem 1rem', cursor: 'pointer' }}
                    >
                        Logout
                    </button>
                </div>

                {/* Profile Card */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                    style={{
                        background: 'rgba(255,255,255,0.02)',
                        border: '1px solid rgba(255,255,255,0.06)',
                        borderRadius: '1.5rem',
                        overflow: 'hidden',
                    }}
                >
                    {/* Banner */}
                    <div style={{
                        height: '140px',
                        background: 'linear-gradient(135deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.01) 100%)',
                        borderBottom: '1px solid rgba(255,255,255,0.04)',
                        position: 'relative',
                    }} />

                    <div style={{ padding: '0 2.5rem 2.5rem', position: 'relative' }}>
                        {/* Avatar */}
                        <div style={{
                            width: '90px',
                            height: '90px',
                            borderRadius: '50%',
                            background: user?.avatar ? `url(${user.avatar}) center/cover` : 'linear-gradient(135deg, rgba(255,255,255,0.1), rgba(255,255,255,0.03))',
                            border: '3px solid #050505',
                            marginTop: '-45px',
                            marginBottom: '1.5rem',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '2rem',
                            color: 'rgba(255,255,255,0.5)',
                            overflow: 'hidden',
                        }}>
                            {!user?.avatar && (user?.name?.[0]?.toUpperCase() || '?')}
                        </div>

                        {!editing ? (
                            <>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
                                    <div>
                                        <h1 style={{ fontSize: '1.8rem', fontWeight: 700, letterSpacing: '0.05em', color: '#fff', margin: '0 0 0.3rem' }}>
                                            {user?.name}
                                        </h1>
                                        <p style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.35)', letterSpacing: '0.1em', margin: 0 }}>
                                            {user?.email}
                                        </p>
                                        {user?.role === 'admin' && (
                                            <span style={{ display: 'inline-block', marginTop: '0.5rem', fontSize: '0.6rem', letterSpacing: '0.2em', textTransform: 'uppercase', background: 'rgba(255,200,50,0.1)', border: '1px solid rgba(255,200,50,0.3)', color: 'rgba(255,200,50,0.8)', borderRadius: '2rem', padding: '0.2rem 0.7rem' }}>
                                                Admin
                                            </span>
                                        )}
                                    </div>
                                    <button
                                        onClick={() => setEditing(true)}
                                        style={{ fontSize: '0.65rem', letterSpacing: '0.15em', textTransform: 'uppercase', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.7)', borderRadius: '2rem', padding: '0.5rem 1.2rem', cursor: 'pointer' }}
                                    >
                                        Edit Profile
                                    </button>
                                </div>
                                <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.9rem', lineHeight: 1.7, minHeight: '3rem' }}>
                                    {user?.bio || 'No bio yet. Click Edit Profile to add one.'}
                                </p>
                                {saveMsg && <p style={{ color: '#aaffaa', fontSize: '0.75rem', marginTop: '1rem' }}>{saveMsg}</p>}
                            </>
                        ) : (
                            <motion.form
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                onSubmit={handleSave}
                                style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}
                            >
                                <h2 style={{ fontSize: '1rem', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#fff', margin: '0 0 0.5rem' }}>Edit Profile</h2>
                                <ProfileInput label="Display Name" value={form.name} onChange={v => setForm(f => ({ ...f, name: v }))} />
                                <ProfileInput label="Avatar URL" value={form.avatar} onChange={v => setForm(f => ({ ...f, avatar: v }))} placeholder="https://..." />
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.65rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', marginBottom: '0.5rem' }}>Bio</label>
                                    <textarea
                                        value={form.bio}
                                        onChange={e => setForm(f => ({ ...f, bio: e.target.value }))}
                                        rows={4}
                                        placeholder="Tell the world about yourself..."
                                        style={{ width: '100%', padding: '0.85rem 1rem', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '0.75rem', color: '#fff', fontSize: '0.9rem', outline: 'none', resize: 'vertical', fontFamily: 'inherit', boxSizing: 'border-box' }}
                                    />
                                </div>
                                <div style={{ display: 'flex', gap: '1rem' }}>
                                    <button type="submit" disabled={saving} style={{ flex: 1, padding: '0.8rem', background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '0.75rem', color: '#fff', fontSize: '0.7rem', fontWeight: 600, letterSpacing: '0.15em', textTransform: 'uppercase', cursor: 'pointer', fontFamily: 'inherit' }}>
                                        {saving ? 'Saving...' : 'Save Changes'}
                                    </button>
                                    <button type="button" onClick={() => setEditing(false)} style={{ padding: '0.8rem 1.5rem', background: 'transparent', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '0.75rem', color: 'rgba(255,255,255,0.4)', fontSize: '0.7rem', letterSpacing: '0.1em', textTransform: 'uppercase', cursor: 'pointer', fontFamily: 'inherit' }}>
                                        Cancel
                                    </button>
                                </div>
                            </motion.form>
                        )}
                    </div>
                </motion.div>

                {/* Quick links */}
                <div style={{ marginTop: '2rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <Link href="/shop" style={{ display: 'block', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '1rem', padding: '1.5rem', textDecoration: 'none', transition: 'border-color 0.3s' }}
                        onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)'}
                        onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)'}
                    >
                        <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>🛍️</div>
                        <div style={{ fontSize: '0.7rem', fontWeight: 600, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.7)' }}>Shop</div>
                        <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.3)', marginTop: '0.2rem' }}>Browse products</div>
                    </Link>
                    <Link href="/" style={{ display: 'block', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '1rem', padding: '1.5rem', textDecoration: 'none', transition: 'border-color 0.3s' }}
                        onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)'}
                        onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)'}
                    >
                        <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>🎨</div>
                        <div style={{ fontSize: '0.7rem', fontWeight: 600, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.7)' }}>Portfolio</div>
                        <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.3)', marginTop: '0.2rem' }}>View my work</div>
                    </Link>
                </div>
            </div>
        </div>
    );
}

function ProfileInput({ label, value, onChange, placeholder }: { label: string; value: string; onChange: (v: string) => void; placeholder?: string }) {
    return (
        <div>
            <label style={{ display: 'block', fontSize: '0.65rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', marginBottom: '0.5rem' }}>{label}</label>
            <input
                type="text"
                value={value}
                onChange={e => onChange(e.target.value)}
                placeholder={placeholder}
                style={{ width: '100%', padding: '0.85rem 1rem', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '0.75rem', color: '#fff', fontSize: '0.9rem', outline: 'none', boxSizing: 'border-box', fontFamily: 'inherit' }}
            />
        </div>
    );
}
