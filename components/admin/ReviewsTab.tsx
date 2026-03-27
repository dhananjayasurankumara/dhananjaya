'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { S, PageHeader, Toast } from './AdminShared';

export default function ReviewsTab() {
    const [reviewList, setReviewList] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [msg, setMsg] = useState('');

    const load = useCallback(() => { 
        setLoading(true); 
        fetch('/api/admin/reviews')
            .then(r => r.ok ? r.json() : [])
            .then(d => { 
                setReviewList(d); 
                setLoading(false); 
            }); 
    }, []);

    useEffect(() => { load(); }, [load]);

    async function del(id: number) {
        if (!confirm('Delete this review?')) return;
        await fetch('/api/admin/reviews', { 
            method: 'DELETE', 
            headers: { 'Content-Type': 'application/json' }, 
            body: JSON.stringify({ id }) 
        });
        load(); 
        setMsg('Deleted!'); 
        setTimeout(() => setMsg(''), 2000);
    }

    const avg = reviewList.length ? (reviewList.reduce((s: number, r: any) => s + r.rating, 0) / reviewList.length).toFixed(1) : '—';
    const stars = (n: number) => Array.from({ length: 5 }, (_, i) => (
        <span key={i} style={{ color: i < n ? '#FFD700' : 'rgba(255,255,255,0.1)', fontSize: '0.8rem' }}>★</span>
    ));

    return (
        <div>
            <PageHeader title="Reviews" subtitle={`${reviewList.length} review${reviewList.length !== 1 ? 's' : ''} · Average ${avg} ★`} />
            {msg && <Toast message={msg} />}
            
            {loading ? (
                <div style={{ ...S.card, textAlign: 'center', padding: '4rem', color: 'rgba(255,255,255,0.25)' }}>Loading reviews…</div>
            ) : reviewList.length === 0 ? (
                <div style={{ ...S.card, textAlign: 'center', padding: '4rem', color: 'rgba(255,255,255,0.25)', fontSize: '0.8rem' }}>No reviews yet</div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                    {reviewList.map((r: any) => (
                        <div key={r.id} style={{ ...S.card, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1.25rem', padding: '1.25rem' }}>
                            <div style={{ flex: 1, minWidth: 0 }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.9rem', marginBottom: '0.75rem' }}>
                                    <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.9rem', fontWeight: 800, color: '#fff', flexShrink: 0 }}>
                                        {r.userName?.charAt(0).toUpperCase()}
                                    </div>
                                    <div>
                                        <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#fff' }}>{r.userName}</div>
                                        <div style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.3)', marginTop: '0.15rem' }}>
                                            {new Date(r.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                        </div>
                                    </div>
                                    <div style={{ display: 'flex', gap: '1px', marginLeft: 'auto' }}>
                                        {stars(r.rating)}
                                    </div>
                                </div>
                                <p style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.6)', lineHeight: 1.6, fontStyle: 'italic', margin: 0, paddingLeft: '3rem' }}>
                                    "{r.body}"
                                </p>
                            </div>
                            <button onClick={() => del(r.id)} style={{ ...S.danger, flexShrink: 0 }}>Delete</button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
