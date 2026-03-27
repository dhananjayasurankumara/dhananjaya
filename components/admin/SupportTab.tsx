'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { S, PageHeader, Toast } from './AdminShared';

export default function SupportTab() {
    const [items, setItems] = useState<any[]>([]);
    const [form, setForm] = useState({ title: '', description: '', url: '', icon: '' });
    const [saving, setSaving] = useState(false);
    const [msg, setMsg] = useState('');
    const [showForm, setShowForm] = useState(false);

    const load = useCallback(() => { 
        fetch('/api/admin/content').then(r => r.ok ? r.json() : {}).then((d: any) => setItems(d.support || [])); 
    }, []);

    useEffect(() => { load(); }, [load]);

    async function add(e: React.FormEvent) {
        e.preventDefault(); 
        setSaving(true);
        await fetch('/api/admin/content', { 
            method: 'POST', 
            headers: { 'Content-Type': 'application/json' }, 
            body: JSON.stringify({ section: 'supportItems', data: form }) 
        });
        setSaving(false); 
        setShowForm(false); 
        setForm({ title: '', description: '', url: '', icon: '' }); 
        load(); 
        setMsg('Added!'); 
        setTimeout(() => setMsg(''), 2000);
    }

    async function del(id: number) {
        if (!confirm('Delete this item?')) return;
        await fetch('/api/admin/content', { 
            method: 'DELETE', 
            headers: { 'Content-Type': 'application/json' }, 
            body: JSON.stringify({ section: 'supportItems', id }) 
        });
        load();
    }

    return (
        <div>
            <PageHeader 
                title="Support Items" 
                subtitle="Manage support / donation links on the site" 
                action={<button onClick={() => setShowForm(s => !s)} style={{ ...S.btn, padding: '0.6rem 1.25rem' }}>+ Add Item</button>} 
            />
            {msg && <Toast message={msg} />}
            
            {showForm && (
                <form onSubmit={add} style={{ ...S.card, display: 'flex', flexDirection: 'column', gap: '0.9rem', marginBottom: '1.5rem' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '0.75rem' }}>
                        <div><label style={S.label}>Title *</label><input style={S.input} value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="Buy Me a Coffee" required /></div>
                        <div><label style={S.label}>URL</label><input style={S.input} value={form.url} onChange={e => setForm(f => ({ ...f, url: e.target.value }))} placeholder="https://..." /></div>
                        <div><label style={S.label}>Icon (emoji)</label><input style={S.input} value={form.icon} onChange={e => setForm(f => ({ ...f, icon: e.target.value }))} placeholder="☕" /></div>
                        <div><label style={S.label}>Description</label><input style={S.input} value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} /></div>
                    </div>
                    <div style={{ display: 'flex', gap: '0.75rem' }}>
                        <button type="submit" disabled={saving} style={S.btn}>{saving ? '…' : '+ Add'}</button>
                        <button type="button" onClick={() => setShowForm(false)} style={{ ...S.btn, opacity: 0.4 }}>Cancel</button>
                    </div>
                </form>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                {items.map(p => (
                    <div key={p.id} style={{ ...S.card, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', padding: '1.25rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <span style={{ fontSize: '1.75rem' }}>{p.icon || '⭐'}</span>
                            <div>
                                <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#fff' }}>{p.title}</div>
                                <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.4)', lineHeight: 1.5 }}>
                                    {p.description} · <a href={p.url} target="_blank" rel="noopener noreferrer" style={{ color: 'rgba(229,9,20,0.7)', textDecoration: 'none' }}>{p.url}</a>
                                </div>
                            </div>
                        </div>
                        <button onClick={() => del(p.id)} style={S.danger}>Delete</button>
                    </div>
                ))}
                {items.length === 0 && (
                    <div style={{ ...S.card, textAlign: 'center', padding: '3rem', color: 'rgba(255,255,255,0.2)', fontSize: '0.8rem' }}>
                        No support items found
                    </div>
                )}
            </div>
        </div>
    );
}
