'use client';

import React, { useState, useEffect } from 'react';
import { S, PageHeader, Toast } from './AdminShared';

export default function AboutTab() {
    const [data, setData] = useState<any>(null);
    const [form, setForm] = useState({ 
        title: '', bio: '', 
        stat1Label: '', stat1Value: '', 
        stat2Label: '', stat2Value: '', 
        stat3Label: '', stat3Value: '' 
    });
    const [saving, setSaving] = useState(false);
    const [msg, setMsg] = useState('');

    useEffect(() => {
        fetch('/api/admin/content').then(r => r.ok ? r.json() : {}).then((d: any) => {
            if (d.about) { 
                setData(d.about); 
                setForm({ 
                    title: d.about.title || '', 
                    bio: d.about.bio || '', 
                    stat1Label: d.about.stat1Label || '', 
                    stat1Value: d.about.stat1Value || '', 
                    stat2Label: d.about.stat2Label || '', 
                    stat2Value: d.about.stat2Value || '', 
                    stat3Label: d.about.stat3Label || '', 
                    stat3Value: d.about.stat3Value || '' 
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
            body: JSON.stringify({ section: 'aboutContent', id: data?.id, data: form }) 
        });
        setSaving(false); 
        setMsg('About saved!'); 
        setTimeout(() => setMsg(''), 3000);
    }

    return (
        <div>
            <PageHeader title="About Section" subtitle="Edit bio, title, and stats" />
            {msg && <Toast message={msg} />}
            <form onSubmit={save} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <div style={S.card}>
                    <label style={S.label}>Title / Your Name</label>
                    <input style={S.input} value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="Dhananjaya Suran Kumara" />
                </div>
                <div style={S.card}>
                    <label style={S.label}>Bio / Description</label>
                    <textarea rows={5} style={{ ...S.input, resize: 'vertical' }} value={form.bio} onChange={e => setForm(f => ({ ...f, bio: e.target.value }))} />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '1rem' }}>
                    {(['stat1', 'stat2', 'stat3'] as const).map(s => (
                        <div key={s} style={S.card}>
                            <div style={{ fontSize: '0.6rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.35)', marginBottom: '0.75rem' }}>{s.replace('stat', 'Stat ')}</div>
                            <label style={S.label}>Label</label>
                            <input style={{ ...S.input, marginBottom: '0.5rem' }} value={(form as any)[`${s}Label`]} onChange={e => setForm(f => ({ ...f, [`${s}Label`]: e.target.value }))} placeholder="Years Experience" />
                            <label style={S.label}>Value</label>
                            <input style={S.input} value={(form as any)[`${s}Value`]} onChange={e => setForm(f => ({ ...f, [`${s}Value`]: e.target.value }))} placeholder="5+" />
                        </div>
                    ))}
                </div>
                <div>
                    <button type="submit" disabled={saving} style={{ ...S.btn, padding: '0.75rem 2rem' }}>
                        {saving ? 'Saving…' : '✓ Save About'}
                    </button>
                </div>
            </form>
        </div>
    );
}
