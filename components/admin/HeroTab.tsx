'use client';

import React, { useState, useEffect } from 'react';
import { S, PageHeader, Toast } from './AdminShared';

export default function HeroTab() {
    const [data, setData] = useState<any>(null);
    const [form, setForm] = useState({ headline: '', subheadline: '', ctaText: '' });
    const [saving, setSaving] = useState(false);
    const [msg, setMsg] = useState('');

    useEffect(() => {
        fetch('/api/admin/content').then(r => r.ok ? r.json() : {}).then((d: any) => {
            if (d.hero) { 
                setData(d.hero); 
                setForm({ 
                    headline: d.hero.headline || '', 
                    subheadline: d.hero.subheadline || '', 
                    ctaText: d.hero.ctaText || '' 
                }); 
            }
        });
    }, []);

    async function handleSave(e: React.FormEvent) {
        e.preventDefault();
        setSaving(true);
        const res = await fetch('/api/admin/content', { 
            method: 'PUT', 
            headers: { 'Content-Type': 'application/json' }, 
            body: JSON.stringify({ section: 'heroContent', id: data?.id, data: form }) 
        });
        setSaving(false);
        if (res.ok) { 
            setMsg('Hero saved!'); 
            setTimeout(() => setMsg(''), 3000); 
        }
    }

    return (
        <div>
            <PageHeader title="Hero Section" subtitle="Edit the main headline and animation text" />
            {msg && <Toast message={msg} />}
            <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.25rem' }}>
                    <div style={S.card}>
                        <label style={S.label}>Main Headline</label>
                        <input style={S.input} value={form.headline} onChange={e => setForm(f => ({ ...f, headline: e.target.value }))} placeholder="Designing Visual Stories." />
                        <p style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.25)', marginTop: '0.5rem', lineHeight: 1.5 }}>The bold large text. Use \n for a new line.</p>
                    </div>
                    <div style={S.card}>
                        <label style={S.label}>Sub-headline</label>
                        <input style={S.input} value={form.subheadline} onChange={e => setForm(f => ({ ...f, subheadline: e.target.value }))} placeholder="Developing Digital Experiences." />
                        <p style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.25)', marginTop: '0.5rem', lineHeight: 1.5 }}>The lighter text below the main headline.</p>
                    </div>
                    <div style={S.card}>
                        <label style={S.label}>CTA / Eyebrow Label</label>
                        <input style={S.input} value={form.ctaText} onChange={e => setForm(f => ({ ...f, ctaText: e.target.value }))} placeholder="Graphic Designer / Creative Developer" />
                        <p style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.25)', marginTop: '0.5rem', lineHeight: 1.5 }}>Small caption above the headline.</p>
                    </div>
                </div>

                {/* Live preview */}
                <div style={{ ...S.card, background: '#050505', padding: '3rem', textAlign: 'center' }}>
                    <div style={{ fontSize: '0.55rem', letterSpacing: '0.5em', textTransform: 'uppercase', color: 'rgba(255,50,50,0.7)', marginBottom: '1rem' }}>{form.ctaText || 'Graphic Designer / Creative Developer'}</div>
                    <div style={{ fontSize: 'clamp(1.5rem,4vw,3rem)', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '-0.03em', lineHeight: 1 }}>{form.headline || 'Designing Visual Stories.'}</div>
                    <div style={{ fontSize: 'clamp(1rem,2.5vw,2rem)', fontWeight: 200, opacity: 0.4, marginTop: '0.3rem', textTransform: 'uppercase', letterSpacing: '-0.02em' }}>{form.subheadline || 'Developing Digital Experiences.'}</div>
                    <div style={{ fontSize: '0.55rem', color: 'rgba(255,255,255,0.2)', letterSpacing: '0.3em', textTransform: 'uppercase', marginTop: '2rem' }}>↑ Live Preview ↑</div>
                </div>

                <div>
                    <button type="submit" disabled={saving} style={{ ...S.btn, padding: '0.75rem 2rem', fontSize: '0.75rem' }}>
                        {saving ? 'Saving…' : '✓ Save Hero'}
                    </button>
                </div>
            </form>
        </div>
    );
}
