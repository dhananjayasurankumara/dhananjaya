'use client';

import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Review {
    id: number;
    userId: number;
    userName: string;
    userAvatar?: string | null;
    rating: number;
    body: string;
    createdAt: string;
}

interface Me {
    id: number;
    name: string;
    avatar?: string | null;
}

export default function Reviews() {
    const [reviews, setReviews] = useState<Review[]>([]);
    const [me, setMe] = useState<Me | null>(null);
    const [showModal, setShowModal] = useState(false);
    const [rating, setRating] = useState(5);
    const [body, setBody] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');
    const textRef = useRef<HTMLTextAreaElement>(null);

    const myReview = me ? reviews.find(r => r.userId === me.id) ?? null : null;

    async function load() {
        const res = await fetch('/api/reviews');
        if (res.ok) setReviews(await res.json());
    }

    useEffect(() => {
        load();
        fetch('/api/auth/me').then(r => r.ok ? r.json() : null).then(u => setMe(u));
    }, []);

    // Prefill when editing
    useEffect(() => {
        if (showModal && myReview) {
            setRating(myReview.rating);
            setBody(myReview.body);
        } else if (showModal && !myReview) {
            setRating(5);
            setBody('');
        }
        if (showModal) setTimeout(() => textRef.current?.focus(), 100);
    }, [showModal]);

    async function submit() {
        if (!body.trim()) { setError('Please write something!'); return; }
        setSubmitting(true); setError('');
        const res = await fetch('/api/reviews', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ rating, body }),
        });
        setSubmitting(false);
        if (res.ok) { await load(); setShowModal(false); }
        else { const d = await res.json(); setError(d.error || 'Failed'); }
    }

    async function remove() {
        if (!confirm('Delete your review?')) return;
        await fetch('/api/reviews', { method: 'DELETE' });
        await load();
        setShowModal(false);
    }

    const stars = (n: number, size = 14) =>
        Array.from({ length: 5 }, (_, i) => (
            <span key={i} style={{ color: i < n ? '#FFD700' : 'rgba(255,255,255,0.15)', fontSize: size }}>★</span>
        ));

    return (
        <section id="reviews" style={{
            background: '#050505', padding: 'clamp(5rem, 12vh, 9rem) clamp(1.5rem, 5vw, 5rem)',
            position: 'relative', overflow: 'hidden',
        }}>
            {/* ── Write Review Modal ── */}
            <AnimatePresence>
                {showModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        style={{
                            position: 'fixed', inset: 0, zIndex: 1000,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            padding: '1rem',
                        }}
                    >
                        {/* Backdrop */}
                        <div
                            onClick={() => setShowModal(false)}
                            style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)' }}
                        />

                        {/* Modal box */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.93, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.93, y: 20 }}
                            transition={{ type: 'spring', damping: 28, stiffness: 300 }}
                            style={{
                                position: 'relative', width: '100%', maxWidth: 540,
                                background: '#0a0a0a', border: '1px solid rgba(255,255,255,0.08)',
                                borderRadius: '1.5rem', padding: '2.5rem',
                                boxShadow: '0 40px 80px rgba(0,0,0,0.6)',
                            }}
                        >
                            {/* Close */}
                            <button
                                onClick={() => setShowModal(false)}
                                style={{
                                    position: 'absolute', top: '1.25rem', right: '1.25rem',
                                    background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)',
                                    borderRadius: '50%', width: 34, height: 34, cursor: 'pointer',
                                    color: 'rgba(255,255,255,0.5)', fontSize: '1rem',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                }}
                            >×</button>

                            <h3 style={{
                                fontSize: '1.1rem', fontWeight: 700, color: '#fff',
                                margin: '0 0 0.4rem', textTransform: 'uppercase', letterSpacing: '0.05em',
                            }}>
                                {myReview ? 'Edit Your Review' : 'Write a Review'}
                            </h3>
                            <p style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.3)', margin: '0 0 2rem', letterSpacing: '0.05em' }}>
                                Reviewing as <strong style={{ color: 'rgba(255,255,255,0.6)' }}>{me?.name}</strong>
                            </p>

                            {/* Star rating picker */}
                            <div style={{ marginBottom: '1.5rem' }}>
                                <label style={{ fontSize: '0.65rem', letterSpacing: '0.25em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', display: 'block', marginBottom: '0.6rem' }}>
                                    Rating
                                </label>
                                <div style={{ display: 'flex', gap: '0.4rem' }}>
                                    {Array.from({ length: 5 }, (_, i) => (
                                        <button
                                            key={i}
                                            onClick={() => setRating(i + 1)}
                                            style={{
                                                background: 'none', border: 'none', cursor: 'pointer',
                                                fontSize: '1.8rem', padding: '0 2px',
                                                color: i < rating ? '#FFD700' : 'rgba(255,255,255,0.15)',
                                                transition: 'color 0.15s',
                                            }}
                                        >★</button>
                                    ))}
                                </div>
                            </div>

                            {/* Text */}
                            <div style={{ marginBottom: '1.5rem' }}>
                                <label style={{ fontSize: '0.65rem', letterSpacing: '0.25em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', display: 'block', marginBottom: '0.6rem' }}>
                                    Your Review
                                </label>
                                <textarea
                                    ref={textRef}
                                    value={body}
                                    onChange={e => { setBody(e.target.value); setError(''); }}
                                    placeholder="Share your experience working with me..."
                                    rows={4}
                                    style={{
                                        width: '100%', background: 'rgba(255,255,255,0.03)',
                                        border: `1px solid ${error ? 'rgba(220,60,60,0.5)' : 'rgba(255,255,255,0.08)'}`,
                                        borderRadius: '0.75rem', color: '#fff',
                                        fontSize: '0.875rem', padding: '0.9rem 1rem',
                                        lineHeight: 1.6, resize: 'vertical',
                                        fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box',
                                    }}
                                />
                                {error && <p style={{ color: 'rgba(220,60,60,0.9)', fontSize: '0.75rem', marginTop: '0.4rem' }}>{error}</p>}
                            </div>

                            {/* Actions */}
                            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                                <button
                                    onClick={submit}
                                    disabled={submitting}
                                    style={{
                                        flex: 1, padding: '0.85rem 1.5rem',
                                        background: 'rgba(255,255,255,0.08)',
                                        border: '1px solid rgba(255,255,255,0.12)',
                                        borderRadius: '0.75rem', color: '#fff',
                                        fontSize: '0.7rem', fontWeight: 700,
                                        letterSpacing: '0.2em', textTransform: 'uppercase',
                                        cursor: submitting ? 'not-allowed' : 'pointer',
                                        fontFamily: 'inherit', transition: 'all 0.2s',
                                    }}
                                    onMouseEnter={e => { if (!submitting) e.currentTarget.style.background = 'rgba(255,255,255,0.14)'; }}
                                    onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.08)'; }}
                                >
                                    {submitting ? 'Saving…' : myReview ? 'Update Review' : 'Submit Review'}
                                </button>

                                {myReview && (
                                    <button
                                        onClick={remove}
                                        style={{
                                            padding: '0.85rem 1.2rem',
                                            background: 'rgba(220,60,60,0.08)',
                                            border: '1px solid rgba(220,60,60,0.2)',
                                            borderRadius: '0.75rem', color: 'rgba(220,100,100,0.9)',
                                            fontSize: '0.7rem', fontWeight: 700,
                                            letterSpacing: '0.15em', textTransform: 'uppercase',
                                            cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.2s',
                                        }}
                                        onMouseEnter={e => { e.currentTarget.style.background = 'rgba(220,60,60,0.15)'; }}
                                        onMouseLeave={e => { e.currentTarget.style.background = 'rgba(220,60,60,0.08)'; }}
                                    >
                                        Delete
                                    </button>
                                )}
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* ── Section content ── */}
            <div style={{ maxWidth: 1400, margin: '0 auto' }}>

                {/* Header row */}
                <div style={{
                    display: 'flex', alignItems: 'flex-end',
                    justifyContent: 'space-between', flexWrap: 'wrap',
                    gap: '1.5rem', marginBottom: 'clamp(2.5rem, 6vh, 4rem)',
                }}>
                    <div>
                        <span style={{
                            color: 'var(--highlight)', fontSize: '0.65rem',
                            letterSpacing: '0.6em', textTransform: 'uppercase',
                            display: 'block', marginBottom: '1rem', opacity: 0.85,
                        }}>
                            Testimonials
                        </span>
                        <h2 style={{
                            fontSize: 'clamp(2.5rem, 7vw, 5.5rem)', fontWeight: 200,
                            textTransform: 'uppercase', lineHeight: 0.9,
                            letterSpacing: '-0.04em', margin: 0,
                        }}>
                            Client<br />
                            <span style={{ fontWeight: 700 }}>Reviews</span>
                        </h2>
                    </div>

                    {/* Write review button */}
                    {me ? (
                        <button
                            onClick={() => setShowModal(true)}
                            style={{
                                display: 'inline-flex', alignItems: 'center', gap: '0.6rem',
                                padding: '0.9rem 2rem',
                                border: '1px solid rgba(255,255,255,0.15)',
                                borderRadius: '3rem', fontSize: '0.7rem',
                                letterSpacing: '0.2em', textTransform: 'uppercase',
                                color: '#fff', background: 'rgba(255,255,255,0.04)',
                                cursor: 'pointer', fontFamily: 'inherit',
                                transition: 'all 0.3s ease',
                            }}
                            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.09)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.3)'; }}
                            onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)'; }}
                        >
                            {myReview ? '✏️ Edit Your Review' : '✍️ Write a Review'}
                        </button>
                    ) : (
                        <a
                            href="/login"
                            style={{
                                display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
                                padding: '0.9rem 2rem',
                                border: '1px solid rgba(255,255,255,0.1)',
                                borderRadius: '3rem', fontSize: '0.7rem',
                                letterSpacing: '0.2em', textTransform: 'uppercase',
                                color: 'rgba(255,255,255,0.4)', background: 'transparent',
                                textDecoration: 'none',
                            }}
                        >
                            Login to Review
                        </a>
                    )}
                </div>

                {/* Reviews grid */}
                {reviews.length === 0 ? (
                    <div style={{
                        textAlign: 'center', padding: '5rem 2rem',
                        border: '1px solid rgba(255,255,255,0.06)', borderRadius: '1.25rem',
                    }}>
                        <div style={{ fontSize: '2rem', marginBottom: '1rem', opacity: 0.3 }}>💬</div>
                        <p style={{ color: 'rgba(255,255,255,0.25)', fontSize: '0.8rem', letterSpacing: '0.15em', textTransform: 'uppercase' }}>
                            No reviews yet — be the first!
                        </p>
                    </div>
                ) : (
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(min(320px, 100%), 1fr))',
                        gap: '1.25rem',
                    }}>
                        {reviews.map((review, i) => (
                            <motion.div
                                key={review.id}
                                initial={{ opacity: 0, y: 24 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.07, duration: 0.5 }}
                                style={{
                                    background: 'rgba(255,255,255,0.025)',
                                    border: `1px solid ${me && review.userId === me.id ? 'rgba(255,255,255,0.12)' : 'rgba(255,255,255,0.06)'}`,
                                    borderRadius: '1.25rem', padding: '1.75rem',
                                    position: 'relative',
                                    cursor: me && review.userId === me.id ? 'pointer' : 'default',
                                    transition: 'border-color 0.3s',
                                }}
                                onClick={() => { if (me && review.userId === me.id) setShowModal(true); }}
                                title={me && review.userId === me.id ? 'Click to edit your review' : ''}
                            >
                                {/* "Your review" badge */}
                                {me && review.userId === me.id && (
                                    <div style={{
                                        position: 'absolute', top: 14, right: 14,
                                        fontSize: '0.55rem', letterSpacing: '0.15em',
                                        textTransform: 'uppercase', color: 'rgba(229,9,20,0.8)',
                                        background: 'rgba(229,9,20,0.09)',
                                        border: '1px solid rgba(229,9,20,0.2)',
                                        padding: '0.2rem 0.6rem', borderRadius: '20px',
                                    }}>
                                        Your Review
                                    </div>
                                )}

                                {/* Stars */}
                                <div style={{ display: 'flex', gap: '2px', marginBottom: '1rem' }}>
                                    {stars(review.rating)}
                                </div>

                                {/* Body */}
                                <p style={{
                                    fontSize: '0.9rem', color: 'rgba(255,255,255,0.7)',
                                    lineHeight: 1.7, margin: '0 0 1.5rem',
                                    fontStyle: 'italic',
                                }}>
                                    &ldquo;{review.body}&rdquo;
                                </p>

                                {/* Author */}
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                    <div style={{
                                        width: 36, height: 36, borderRadius: '50%',
                                        background: review.userAvatar ? `url(${review.userAvatar}) center/cover` : 'rgba(255,255,255,0.08)',
                                        border: '1px solid rgba(255,255,255,0.1)',
                                        flexShrink: 0, overflow: 'hidden',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        fontSize: '0.9rem', color: 'rgba(255,255,255,0.5)',
                                    }}>
                                        {!review.userAvatar && review.userName.charAt(0).toUpperCase()}
                                    </div>
                                    <div>
                                        <div style={{ fontSize: '0.8rem', fontWeight: 600, color: '#fff' }}>{review.userName}</div>
                                        <div style={{ fontSize: '0.6rem', color: 'rgba(255,255,255,0.3)', letterSpacing: '0.1em' }}>
                                            {new Date(review.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}

                {/* Review count + avg */}
                {reviews.length > 0 && (
                    <div style={{
                        marginTop: '2.5rem', display: 'flex', alignItems: 'center',
                        gap: '1rem', flexWrap: 'wrap',
                        paddingTop: '2rem', borderTop: '1px solid rgba(255,255,255,0.05)',
                    }}>
                        <div style={{ width: 32, height: '1px', background: 'rgba(255,255,255,0.12)' }} />
                        <span style={{ fontSize: '0.65rem', letterSpacing: '0.25em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.25)' }}>
                            {reviews.length} Review{reviews.length !== 1 ? 's' : ''} ·{' '}
                            Avg {(reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1)} ★
                        </span>
                    </div>
                )}
            </div>
        </section>
    );
}
