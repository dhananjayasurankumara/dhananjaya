'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function LoginPage() {
    const [tab, setTab] = useState<'login' | 'signup'>('login');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const router = useRouter();

    // Login form
    const [loginEmail, setLoginEmail] = useState('');
    const [loginPassword, setLoginPassword] = useState('');

    // Signup form
    const [signupName, setSignupName] = useState('');
    const [signupEmail, setSignupEmail] = useState('');
    const [signupPassword, setSignupPassword] = useState('');

    useEffect(() => {
        fetch('/api/auth/me').then(r => {
            if (r.ok) router.replace('/profile');
        });
    }, []);

    async function handleLogin(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);
        setError('');
        const res = await fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: loginEmail, password: loginPassword }),
        });
        const data = await res.json();
        setLoading(false);
        if (!res.ok) return setError(data.error || 'Login failed');
        router.push('/profile');
    }

    async function handleSignup(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);
        setError('');
        const res = await fetch('/api/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: signupName, email: signupEmail, password: signupPassword }),
        });
        const data = await res.json();
        setLoading(false);
        if (!res.ok) return setError(data.error || 'Registration failed');
        router.push('/profile');
    }

    return (
        <div style={{
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #050505 0%, #0a0a0a 50%, #080808 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '2rem',
            position: 'relative',
            overflow: 'hidden',
        }}>
            {/* Ambient glow */}
            <div style={{
                position: 'absolute',
                width: '600px',
                height: '600px',
                borderRadius: '50%',
                background: 'radial-gradient(circle, rgba(255,255,255,0.03) 0%, transparent 70%)',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                pointerEvents: 'none',
            }} />

            <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                style={{
                    width: '100%',
                    maxWidth: '440px',
                    background: 'rgba(255,255,255,0.02)',
                    border: '1px solid rgba(255,255,255,0.06)',
                    borderRadius: '1.5rem',
                    padding: '2.5rem',
                    backdropFilter: 'blur(20px)',
                    boxShadow: '0 40px 80px rgba(0,0,0,0.6)',
                }}
            >
                {/* Back link */}
                <Link href="/" style={{ fontSize: '0.7rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.4rem', marginBottom: '2rem' }}>
                    ← Back to Portfolio
                </Link>

                {/* Logo */}
                <div style={{ marginBottom: '2rem' }}>
                    <h1 style={{ fontSize: '1.1rem', fontWeight: 700, letterSpacing: '0.3em', textTransform: 'uppercase', color: '#fff', margin: 0 }}>
                        DANANJAYA
                    </h1>
                    <p style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.3)', letterSpacing: '0.15em', textTransform: 'uppercase', marginTop: '0.3rem' }}>
                        {tab === 'login' ? 'Welcome back' : 'Create your account'}
                    </p>
                </div>

                {/* Tab toggle */}
                <div style={{ display: 'flex', gap: '0', background: 'rgba(255,255,255,0.03)', borderRadius: '0.75rem', padding: '0.25rem', marginBottom: '2rem', border: '1px solid rgba(255,255,255,0.05)' }}>
                    {(['login', 'signup'] as const).map(t => (
                        <button
                            key={t}
                            onClick={() => { setTab(t); setError(''); }}
                            style={{
                                flex: 1,
                                padding: '0.65rem',
                                background: tab === t ? 'rgba(255,255,255,0.08)' : 'transparent',
                                border: 'none',
                                borderRadius: '0.6rem',
                                color: tab === t ? '#fff' : 'rgba(255,255,255,0.35)',
                                fontSize: '0.7rem',
                                fontWeight: 600,
                                letterSpacing: '0.15em',
                                textTransform: 'uppercase',
                                cursor: 'pointer',
                                transition: 'all 0.3s ease',
                            }}
                        >
                            {t === 'login' ? 'Login' : 'Sign Up'}
                        </button>
                    ))}
                </div>

                {/* Error */}
                <AnimatePresence>
                    {error && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            style={{ background: 'rgba(255,80,80,0.1)', border: '1px solid rgba(255,80,80,0.2)', borderRadius: '0.75rem', padding: '0.75rem 1rem', fontSize: '0.75rem', color: '#ff6b6b', marginBottom: '1.5rem' }}
                        >
                            {error}
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Login Form */}
                <AnimatePresence mode="wait">
                    {tab === 'login' ? (
                        <motion.form
                            key="login"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            onSubmit={handleLogin}
                            style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}
                        >
                            <AuthInput label="Email" type="email" value={loginEmail} onChange={setLoginEmail} placeholder="you@email.com" />
                            <AuthInput label="Password" type="password" value={loginPassword} onChange={setLoginPassword} placeholder="••••••••" />
                            <AuthButton loading={loading}>Login</AuthButton>
                        </motion.form>
                    ) : (
                        <motion.form
                            key="signup"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            onSubmit={handleSignup}
                            style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}
                        >
                            <AuthInput label="Full Name" type="text" value={signupName} onChange={setSignupName} placeholder="Your Name" />
                            <AuthInput label="Email" type="email" value={signupEmail} onChange={setSignupEmail} placeholder="you@email.com" />
                            <AuthInput label="Password" type="password" value={signupPassword} onChange={setSignupPassword} placeholder="Min. 6 characters" />
                            <AuthButton loading={loading}>Create Account</AuthButton>
                        </motion.form>
                    )}
                </AnimatePresence>
            </motion.div>
        </div>
    );
}

function AuthInput({ label, type, value, onChange, placeholder }: {
    label: string; type: string; value: string; onChange: (v: string) => void; placeholder?: string;
}) {
    const [focused, setFocused] = useState(false);
    return (
        <div>
            <label style={{ display: 'block', fontSize: '0.65rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', marginBottom: '0.5rem' }}>
                {label}
            </label>
            <input
                type={type}
                value={value}
                onChange={e => onChange(e.target.value)}
                placeholder={placeholder}
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)}
                required
                style={{
                    width: '100%',
                    padding: '0.85rem 1rem',
                    background: 'rgba(255,255,255,0.03)',
                    border: `1px solid ${focused ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.07)'}`,
                    borderRadius: '0.75rem',
                    color: '#fff',
                    fontSize: '0.9rem',
                    outline: 'none',
                    transition: 'border-color 0.3s ease',
                    boxSizing: 'border-box',
                    fontFamily: 'inherit',
                }}
            />
        </div>
    );
}

function AuthButton({ children, loading }: { children: React.ReactNode; loading: boolean }) {
    return (
        <button
            type="submit"
            disabled={loading}
            style={{
                width: '100%',
                padding: '0.9rem',
                background: loading ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.08)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '0.75rem',
                color: loading ? 'rgba(255,255,255,0.4)' : '#fff',
                fontSize: '0.7rem',
                fontWeight: 600,
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
                cursor: loading ? 'not-allowed' : 'pointer',
                transition: 'all 0.3s ease',
                fontFamily: 'inherit',
                marginTop: '0.5rem',
            }}
            onMouseEnter={e => { if (!loading) e.currentTarget.style.background = 'rgba(255,255,255,0.12)'; }}
            onMouseLeave={e => { if (!loading) e.currentTarget.style.background = 'rgba(255,255,255,0.08)'; }}
        >
            {loading ? 'Please wait...' : children}
        </button>
    );
}
