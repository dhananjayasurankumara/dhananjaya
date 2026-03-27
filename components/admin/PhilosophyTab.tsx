'use client';

import React, { useState, useEffect } from 'react';
import { S, PageHeader, Toast } from './AdminShared';

export default function PhilosophyTab() {
    const [data, setData] = useState<any>(null);
    const [form, setForm] = useState({ label: '', line1: '', line2: '', bio: '' });
    const [saving, setSaving] = useState(false);
    const [msg, setMsg] = useState('');

    useEffect(() => {
        fetch('/api/admin/content').then(r => r.ok ? r.json() : {}).then((d: any) => {
            if (d.philosophy) { 
                setData(d.philosophy); 
                setForm({ 
                    label: d.philosophy.label || '', 
                    line1: d.philosophy.line1 || '', 
                    line2: d.philosophy.line2 || '', 
                    bio: d.philosophy.bio || '' 
                }); 
            }
        });
    }, []);

    async function save(e: React.FormEvent) {
        e.preventDefault(); 
        setSaving(true);
        await fetch('/api/admin/content', { 
            method: 'PUT', 
            headers: { 'Content-Type': 'application/json' }, 
            body: JSON.stringify({ section: 'philosophyContent', id: data?.id, data: form }) 
        });
        setSaving(false); 
        setMsg('Philosophy saved!'); 
        setTimeout(() => setMsg(''), 3000);
    }

    return (
        <div>
            <PageHeader title="Philosophy Section" subtitle="Edit your creative philosophy statement" />
            {msg && <Toast message={msg} />}
            <form onSubmit={save} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1.25rem' }}>
                    <div style={S.card}>
                        <label style={S.label}>Eyebrow Label</label>
                        <input style={S.input} value={form.label} onChange={e => setForm(f => ({ ...f, label: e.target.value }))} placeholder="Design Philosophy" />
                    </div>
                    <div style={S.card}>
                        <label style={S.label}>Line 1 (Bold)</label>
                        <input style={S.input} value={form.line1} onChange={e => setForm(f => ({ ...f, line1: e.target.value }))} />
                    </div>
                    <div style={S.card}>
                        <label style={S.label}>Line 2 (Light)</label>
                        <input style={S.input} value={form.line2} onChange={e => setForm(f => ({ ...f, line2: e.target.value }))} />
                    </div>
                </div>
                <div style={S.card}>
                    <label style={S.label}>Description Text</label>
                    <textarea rows={4} style={{ ...S.input, resize: 'vertical' }} value={form.bio} onChange={e => setForm(f => ({ ...f, bio: e.target.value }))} />
                </div>
                
                {/* Visual Preview */}
                <div style={{ ...S.card, background: '#050505', padding: '2.5rem' }}>
                    <div style={{ fontSize: '0.55rem', letterSpacing: '0.4em', textTransform: 'uppercase', color: 'rgba(229,9,20,0.7)', marginBottom: '0.75rem' }}>{form.label || 'Design Philosophy'}</div>
                    <div style={{ fontSize: 'clamp(1.5rem,3vw,2.5rem)', fontWeight: 900, textTransform: 'uppercase' }}>{form.line1 || 'Line 1 Preview'}</div>
                    <div style={{ fontSize: 'clamp(1rem,2vw,1.75rem)', fontWeight: 200, opacity: 0.5, textTransform: 'uppercase' }}>{form.line2 || 'Line 2 Preview'}</div>
                    <p style={{ marginTop: '1rem', fontSize: '0.8rem', color: 'rgba(255,255,255,0.4)', lineHeight: 1.7 }}>{form.bio || 'Description preview…'}</p>
                    <div style={{ fontSize: '0.5rem', color: 'rgba(255,255,255,0.12)', letterSpacing: '0.3em', textTransform: 'uppercase', marginTop: '1rem' }}>↑ Live Preview ↑</div>
                </div>

                <div>
                    <button type="submit" disabled={saving} style={{ ...S.btn, padding: '0.75rem 2rem' }}>
                        {saving ? 'Saving…' : '✓ Save Philosophy'}
                    </button>
                </div>
            </form>
        </div>
    );
}
