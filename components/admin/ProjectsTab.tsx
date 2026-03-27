'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { S, PageHeader, Toast } from './AdminShared';

export default function ProjectsTab() {
    const [items, setItems] = useState<any[]>([]);
    const [form, setForm] = useState({ title: '', description: '', tags: '', link: '', imageUrl: '' });
    const [editing, setEditing] = useState<any>(null);
    const [saving, setSaving] = useState(false);
    const [msg, setMsg] = useState('');
    const [showForm, setShowForm] = useState(false);

    const load = useCallback(() => { 
        fetch('/api/admin/content').then(r => r.ok ? r.json() : {}).then((d: any) => setItems(d.projects || [])); 
    }, []);

    useEffect(() => { load(); }, [load]);

    function openAdd() { 
        setEditing(null); 
        setForm({ title: '', description: '', tags: '', link: '', imageUrl: '' }); 
        setShowForm(true); 
    }

    function openEdit(p: any) { 
        setEditing(p); 
        setForm({ 
            title: p.title || '', 
            description: p.description || '', 
            tags: p.tags || '', 
            link: p.link || '', 
            imageUrl: p.imageUrl || '' 
        }); 
        setShowForm(true); 
    }

    async function save(e: React.FormEvent) {
        e.preventDefault(); 
        setSaving(true);
        const method = editing ? 'PUT' : 'POST';
        const body = editing ? { section: 'projects', id: editing.id, data: form } : { section: 'projects', data: form };
        await fetch('/api/admin/content', { 
            method, 
            headers: { 'Content-Type': 'application/json' }, 
            body: JSON.stringify(body) 
        });
        setSaving(false); 
        setShowForm(false); 
        load(); 
        setMsg(editing ? 'Updated!' : 'Added!'); 
        setTimeout(() => setMsg(''), 2500);
    }

    async function del(id: number) {
        if (!confirm('Delete this project?')) return;
        await fetch('/api/admin/content', { 
            method: 'DELETE', 
            headers: { 'Content-Type': 'application/json' }, 
            body: JSON.stringify({ section: 'projects', id }) 
        });
        load();
    }

    return (
        <div>
            <PageHeader 
                title="Projects / Work" 
                subtitle={`${items.length} project${items.length !== 1 ? 's' : ''} — latest 3 shown on homepage`} 
                action={<button onClick={openAdd} style={{ ...S.btn, padding: '0.6rem 1.25rem' }}>+ Add Project</button>} 
            />
            {msg && <Toast message={msg} />}
            
            {showForm && (
                <div style={{ ...S.card, marginBottom: '1.5rem' }}>
                    <div style={{ fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.5)', marginBottom: '1rem' }}>
                        {editing ? 'Edit Project' : 'New Project'}
                    </div>
                    <form onSubmit={save} style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '0.9rem' }}>
                            <div><label style={S.label}>Title *</label><input style={S.input} value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} required /></div>
                            <div><label style={S.label}>Tags (comma separated)</label><input style={S.input} value={form.tags} onChange={e => setForm(f => ({ ...f, tags: e.target.value }))} placeholder="Branding, Motion" /></div>
                            <div><label style={S.label}>Link URL</label><input style={S.input} value={form.link} onChange={e => setForm(f => ({ ...f, link: e.target.value }))} /></div>
                            <div><label style={S.label}>Image URL</label><input style={S.input} value={form.imageUrl} onChange={e => setForm(f => ({ ...f, imageUrl: e.target.value }))} /></div>
                        </div>
                        <div>
                            <label style={S.label}>Description</label>
                            <textarea rows={3} style={{ ...S.input, resize: 'vertical' }} value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} />
                        </div>
                        <div style={{ display: 'flex', gap: '0.75rem' }}>
                            <button type="submit" disabled={saving} style={S.btn}>{saving ? 'Saving…' : editing ? '✓ Update' : '+ Add'}</button>
                            <button type="button" onClick={() => setShowForm(false)} style={{ ...S.btn, opacity: 0.4 }}>Cancel</button>
                        </div>
                    </form>
                </div>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem' }}>
                {items.map(p => (
                    <div key={p.id} style={S.card}>
                        {p.imageUrl && <div style={{ height: 160, borderRadius: '8px', background: `url(${p.imageUrl}) center/cover`, marginBottom: '0.9rem', border: '1px solid rgba(255,255,255,0.05)' }} />}
                        <div style={{ fontSize: '1rem', fontWeight: 700, color: '#fff', marginBottom: '0.25rem' }}>{p.title}</div>
                        <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)', marginBottom: '0.8rem', lineHeight: 1.5, minHeight: '3rem' }}>{p.description}</div>
                        {p.tags && (
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginBottom: '1rem' }}>
                                {String(p.tags).split(',').map((t: string) => (
                                    <span key={t} style={{ fontSize: '0.55rem', padding: '0.2rem 0.6rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '20px', color: 'rgba(255,255,255,0.6)' }}>
                                        {t.trim()}
                                    </span>
                                ))}
                            </div>
                        )}
                        <div style={{ display: 'flex', gap: '0.5rem', marginTop: 'auto' }}>
                            <button onClick={() => openEdit(p)} style={{ ...S.btn, flex: 1, textAlign: 'center' }}>✏ Edit</button>
                            <button onClick={() => del(p.id)} style={{ ...S.danger, padding: '0.5rem 0.75rem' }}>Delete</button>
                        </div>
                    </div>
                ))}
                {items.length === 0 && (
                    <div style={{ ...S.card, gridColumn: '1/-1', textAlign: 'center', padding: '4rem', color: 'rgba(255,255,255,0.2)', fontSize: '0.8rem' }}>
                        No projects — click + Add Project to start
                    </div>
                )}
            </div>
        </div>
    );
}
