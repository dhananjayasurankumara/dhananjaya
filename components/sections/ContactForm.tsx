'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const inputStyles = {
    width: '100%',
    background: 'rgba(255, 255, 255, 0.03)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '12px',
    padding: '1rem 1.5rem',
    color: 'white',
    fontSize: '1rem',
    outline: 'none',
    transition: 'all 0.3s ease',
    marginBottom: '1.5rem'
};

export default function ContactForm() {
    const [formData, setFormData] = useState({ name: '', email: '', message: '' });
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('loading');

        try {
            const res = await fetch('/api/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            if (res.ok) {
                setStatus('success');
                setFormData({ name: '', email: '', message: '' });
            } else {
                setStatus('error');
            }
        } catch (err) {
            setStatus('error');
        }
    };

    return (
        <form onSubmit={handleSubmit} style={{ width: '100%', maxWidth: '500px' }}>
            <div style={{ position: 'relative' }}>
                <input
                    type="text"
                    placeholder="YOUR NAME"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    style={inputStyles}
                    onFocus={(e) => (e.currentTarget.style.borderColor = 'var(--highlight)')}
                    onBlur={(e) => (e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)')}
                />
                <input
                    type="email"
                    placeholder="EMAIL ADDRESS"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                    style={inputStyles}
                    onFocus={(e) => (e.currentTarget.style.borderColor = 'var(--highlight)')}
                    onBlur={(e) => (e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)')}
                />
                <textarea
                    placeholder="HOW CAN I HELP?"
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    required
                    rows={5}
                    style={{ ...inputStyles, resize: 'none' }}
                    onFocus={(e) => (e.currentTarget.style.borderColor = 'var(--highlight)')}
                    onBlur={(e) => (e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)')}
                />
            </div>

            <button
                type="submit"
                disabled={status === 'loading'}
                style={{
                    width: '100%',
                    padding: '1.2rem',
                    background: 'var(--accent-white)',
                    color: 'black',
                    border: 'none',
                    borderRadius: '100px',
                    fontWeight: 800,
                    textTransform: 'uppercase',
                    letterSpacing: '0.2em',
                    cursor: status === 'loading' ? 'not-allowed' : 'pointer',
                    opacity: status === 'loading' ? 0.7 : 1,
                    transition: 'transform 0.3s ease'
                }}
                onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.02)')}
                onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
            >
                {status === 'loading' ? 'SENDING...' : 'SEND MESSAGE'}
            </button>

            <AnimatePresence>
                {status === 'success' && (
                    <motion.p
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        style={{ color: 'var(--highlight)', fontSize: '0.9rem', marginTop: '1rem', textAlign: 'center' }}
                    >
                        Message sent successfully. I'll get back to you soon.
                    </motion.p>
                )}
                {status === 'error' && (
                    <motion.p
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        style={{ color: '#ff4444', fontSize: '0.9rem', marginTop: '1rem', textAlign: 'center' }}
                    >
                        Something went wrong. Please try again or email directly.
                    </motion.p>
                )}
            </AnimatePresence>
        </form>
    );
}
bitumen
