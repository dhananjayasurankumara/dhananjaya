'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { S, PageHeader, Toast } from './AdminShared';

interface BgImage { 
    id: number; 
    section: string; 
    imageUrl: string | null; 
    overlayOpacity: number; 
    imagePosition: string; 
}

export default function MediaTab() {
    const [images, setImages] = useState<BgImage[]>([]);
    const [loading, setLoading] = useState(true);
    const [editing, setEditing] = useState<BgImage | null>(null);
    const [form, setForm] = useState({ imageUrl: '', overlayOpacity: 0.15, imagePosition: 'center' });
    const [msg, setMsg] = useState('');

    const load = useCallback(() => {
        fetch('/api/admin/media').then(r => r.ok ? r.json() : []).then(d => {
            setImages(d);
            setLoading(false);
        });
    }, []);

    useEffect(() => { load(); }, [load]);

    async function handleSave(e: React.FormEvent) {
        e.preventDefault();
        if (!editing) return;
        const res = await fetch('/api/admin/media', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: editing.id, ...form }),
        });
        if (res.ok) {
            setEditing(null);
            load();
            setMsg('Background updated!');
            setTimeout(() => setMsg(''), 3000);
        }
    }

    return (
        <div>
            <PageHeader title="Media / Backgrounds" subtitle="Manage background images and overlays per section" />
            {msg && <Toast message={msg} />}

            {editing && (
                <div style={{ ...S.card, marginBottom: '2rem' }}>
                    <div style={{ fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: '1.25rem', color: 'rgba(255,255,255,0.6)' }}>
                        Editing {editing.section} Background
                    </div>
                    <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem' }}>
                            <div>
                                <label style={S.label}>Image URL</label>
                                <input style={S.input} value={form.imageUrl} onChange={e => setForm(f => ({ ...f, imageUrl: e.target.value }))} placeholder="/images/bg.jpg" />
                            </div>
                            <div>
                                <label style={S.label}>Overlay Opacity ({Math.round(form.overlayOpacity * 100)}%)</label>
                                <input type="range" min="0" max="1" step="0.05" style={{ width: '100%', accentColor: '#ff3333' }} value={form.overlayOpacity} onChange={e => setForm(f => ({ ...f, overlayOpacity: parseFloat(e.target.value) }))} />
                            </div>
                            <div>
                                <label style={S.label}>Position</label>
                                <select style={S.input} value={form.imagePosition} onChange={e => setForm(f => ({ ...f, imagePosition: e.target.value }))}>
                                    <option value="center">Center</option>
                                    <option value="top">Top</option>
                                    <option value="bottom">Bottom</option>
                                    <option value="left">Left</option>
                                    <option value="right">Right</option>
                                </select>
                            </div>
                        </div>
                        <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
                            <button type="submit" style={S.btn}>✓ Save Changes</button>
                            <button type="button" onClick={() => setEditing(null)} style={{ ...S.btn, opacity: 0.5 }}>Cancel</button>
                        </div>
                    </form>
                </div>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1rem' }}>
                {images.map(img => (
                    <div key={img.id} style={{ ...S.card, padding: '1rem' }}>
                        <div style={{ height: 140, borderRadius: '8px', background: img.imageUrl ? `url(${img.imageUrl}) ${img.imagePosition}/cover` : 'rgba(255,255,255,0.02)', position: 'relative', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.05)', marginBottom: '1rem' }}>
                            {/* Overlay preview */}
                            <div style={{ position: 'absolute', inset: 0, background: 'black', opacity: img.overlayOpacity }} />
                            <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <div style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.2em', color: '#fff', textShadow: '0 2px 10px rgba(0,0,0,0.5)' }}>{img.section}</div>
                            </div>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.3)', letterSpacing: '0.1em' }}>
                                Opacity: {Math.round(img.overlayOpacity * 100)}% · Pos: {img.imagePosition}
                            </div>
                            <button onClick={() => { setEditing(img); setForm({ imageUrl: img.imageUrl || '', overlayOpacity: img.overlayOpacity, imagePosition: img.imagePosition }); }} style={{ ...S.btn, padding: '0.4rem 0.8rem' }}>Edit</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
