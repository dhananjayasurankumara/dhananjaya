'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { S, PageHeader, Toast } from './AdminShared';

export default function PresenceTab() {
    const [items, setItems] = useState<any[]>([]);
    const [form, setForm] = useState({ name: '', platformId: '', url: '', tagline: '', color: '#ffffff' });
    const [saving, setSaving] = useState(false);
    const [msg, setMsg] = useState('');
    const [showForm, setShowForm] = useState(false);

    const load = useCallback(() => { 
        fetch('/api/admin/content').then(r => r.ok ? r.json() : {}).then((d: any) => setItems(d.presence || [])); 
    }, []);

    useEffect(() => { load(); }, [load]);

    async function add(e: React.FormEvent) {
        e.preventDefault(); 
        setSaving(true);
        await fetch('/api/admin/content', { 
            method: 'POST', 
            headers: { 'Content-Type': 'application/json' }, 
            body: JSON.stringify({ section: 'presenceLinks', data: form }) 
        });
        setSaving(false); 
        setShowForm(false); 
        setForm({ name: '', platformId: '', url: '', tagline: '', color: '#ffffff' }); 
        load(); 
        setMsg('Added!'); 
        setTimeout(() => setMsg(''), 2000);
    }

    async function del(id: number) {
        if (!confirm('Delete this platform?')) return;
        await fetch('/api/admin/content', { 
            method: 'DELETE', 
            headers: { 'Content-Type': 'application/json' }, 
            body: JSON.stringify({ section: 'presenceLinks', id }) 
        });
        load();
    }

    const suggestions = ['instagram', 'behance', 'dribbble', 'tiktok', 'youtube', 'linkedin', 'github', 'facebook', 'x', 'telegram', 'whatsapp', 'fiverr', 'upwork', 'pph'];

    return (
        <div>
            <PageHeader 
                title="Presence / Platforms" 
                subtitle={`${items.length} custom platform${items.length !== 1 ? 's' : ''} (14 defaults when empty)`} 
                action={<button onClick={() => setShowForm(s => !s)} style={{ ...S.btn, padding: '0.6rem 1.25rem' }}>+ Add Platform</button>} 
            />
            {msg && <Toast message={msg} />}
            
            {showForm && (
                <form onSubmit={add} style={{ ...S.card, display: 'flex', flexDirection: 'column', gap: '0.9rem', marginBottom: '1.5rem' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '0.75rem' }}>
                        <div><label style={S.label}>Name *</label><input style={S.input} value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Instagram" required /></div>
                        <div>
                            <label style={S.label}>Platform ID</label>
                            <select style={S.input} value={form.platformId} onChange={e => setForm(f => ({ ...f, platformId: e.target.value }))}>
                                <option value="">Select…</option>
                                {suggestions.map(s => <option key={s} value={s}>{s}</option>)}
                            </select>
                        </div>
                        <div><label style={S.label}>URL</label><input style={S.input} value={form.url} onChange={e => setForm(f => ({ ...f, url: e.target.value }))} placeholder="https://..." /></div>
                        <div><label style={S.label}>Tagline</label><input style={S.input} value={form.tagline} onChange={e => setForm(f => ({ ...f, tagline: e.target.value }))} /></div>
                        <div><label style={S.label}>Color</label><input type="color" style={{ ...S.input, padding: '0.25rem', height: '2.4rem', cursor: 'pointer' }} value={form.color} onChange={e => setForm(f => ({ ...f, color: e.target.value }))} /></div>
                    </div>
                    <div style={{ display: 'flex', gap: '0.75rem' }}>
                        <button type="submit" disabled={saving} style={S.btn}>{saving ? '…' : '+ Add'}</button>
                        <button type="button" onClick={() => setShowForm(false)} style={{ ...S.btn, opacity: 0.4 }}>Cancel</button>
                    </div>
                </form>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                {items.map(p => (
                    <div key={p.id} style={{ ...S.card, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', padding: '1rem 1.25rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <div style={{ width: 12, height: 12, borderRadius: '50%', background: p.color || '#fff', flexShrink: 0, boxShadow: `0 0 10px ${p.color || '#fff'}44` }} />
                            <div>
                                <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#fff' }}>{p.name}</div>
                                <div style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.35)', letterSpacing: '0.02em' }}>{p.tagline} · {p.url}</div>
                            </div>
                        </div>
                        <button onClick={() => del(p.id)} style={S.danger}>Delete</button>
                    </div>
                ))}
                {items.length === 0 && (
                    <div style={{ ...S.card, textAlign: 'center', padding: '3rem', color: 'rgba(255,255,255,0.2)', fontSize: '0.8rem' }}>
                        Empty — default platforms shown on site
                    </div>
                )}
            </div>
        </div>
    );
}
