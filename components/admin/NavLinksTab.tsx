'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { S, PageHeader, Toast } from './AdminShared';

interface NavLink { 
    id: number; 
    label: string; 
    href: string; 
    type: string; 
    displayOrder: number; 
    active: boolean; 
}

export default function NavLinksTab() {
    const [links, setLinks] = useState<NavLink[]>([]);
    const [form, setForm] = useState({ label: '', href: '', type: 'main', displayOrder: 0 });
    const [saving, setSaving] = useState(false);
    const [msg, setMsg] = useState('');

    const load = useCallback(() => { 
        fetch('/api/admin/nav-links').then(r => r.ok ? r.json() : []).then(setLinks); 
    }, []);

    useEffect(() => { load(); }, [load]);

    async function add(e: React.FormEvent) {
        e.preventDefault(); 
        setSaving(true);
        await fetch('/api/admin/nav-links', { 
            method: 'POST', 
            headers: { 'Content-Type': 'application/json' }, 
            body: JSON.stringify(form) 
        });
        setSaving(false); 
        setForm({ label: '', href: '', type: 'main', displayOrder: links.length + 1 }); 
        load(); 
        setMsg('Link added!'); 
        setTimeout(() => setMsg(''), 2500);
    }

    async function del(id: number) {
        if (!confirm('Delete this link?')) return;
        await fetch('/api/admin/nav-links', { 
            method: 'DELETE', 
            headers: { 'Content-Type': 'application/json' }, 
            body: JSON.stringify({ id }) 
        });
        load();
    }

    async function toggleActive(link: NavLink) {
        await fetch('/api/admin/nav-links', { 
            method: 'PUT', 
            headers: { 'Content-Type': 'application/json' }, 
            body: JSON.stringify({ id: link.id, active: !link.active }) 
        });
        load();
    }

    return (
        <div>
            <PageHeader title="Nav Links" subtitle="Manage header and footer navigation" />
            {msg && <Toast message={msg} />}
            
            <form onSubmit={add} style={{ ...S.card, display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
                <div style={{ flex: 2, minWidth: 160 }}><label style={S.label}>Label</label><input style={S.input} value={form.label} onChange={e => setForm(f => ({ ...f, label: e.target.value }))} placeholder="About" required /></div>
                <div style={{ flex: 2, minWidth: 160 }}><label style={S.label}>HREF</label><input style={S.input} value={form.href} onChange={e => setForm(f => ({ ...f, href: e.target.value }))} placeholder="/#about" required /></div>
                <div style={{ flex: 1, minWidth: 120 }}>
                    <label style={S.label}>Type</label>
                    <select style={S.input} value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value }))}>
                        <option value="main">Main Header</option>
                        <option value="footer">Footer</option>
                        <option value="social">Social Icon</option>
                    </select>
                </div>
                <div style={{ display: 'flex', alignItems: 'flex-end' }}>
                    <button type="submit" disabled={saving} style={{ ...S.btn, padding: '0.7rem 1.5rem' }}>{saving ? '…' : '+ Add'}</button>
                </div>
            </form>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                {links.map(link => (
                    <div key={link.id} style={{ ...S.card, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.8rem 1.25rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
                            <div style={{ fontSize: '0.85rem', fontWeight: 700, color: link.active ? '#fff' : 'rgba(255,255,255,0.3)' }}>{link.label}</div>
                            <code style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.4)', background: 'rgba(0,0,0,0.2)', padding: '0.2rem 0.5rem', borderRadius: '4px' }}>{link.href}</code>
                            <span style={{ fontSize: '0.55rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(255,50,50,0.7)' }}>{link.type}</span>
                        </div>
                        <div style={{ display: 'flex', gap: '0.6rem' }}>
                            <button onClick={() => toggleActive(link)} style={{ ...S.btn, padding: '0.4rem 0.8rem', fontSize: '0.6rem', background: link.active ? 'rgba(60,200,100,0.1)' : 'rgba(255,255,255,0.05)' }}>
                                {link.active ? 'Active' : 'Hidden'}
                            </button>
                            <button onClick={() => del(link.id)} style={S.danger}>Del</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
