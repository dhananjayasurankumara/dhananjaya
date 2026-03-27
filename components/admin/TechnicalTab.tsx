'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { S, PageHeader, Toast } from './AdminShared';

export default function TechnicalTab() {
    const [skills, setSkills] = useState<any[]>([]);
    const [form, setForm] = useState({ name: '', type: '' });
    const [saving, setSaving] = useState(false);
    const [msg, setMsg] = useState('');

    const load = useCallback(() => { 
        fetch('/api/admin/content').then(r => r.ok ? r.json() : {}).then((d: any) => setSkills(d.skills || [])); 
    }, []);

    useEffect(() => { load(); }, [load]);

    async function add(e: React.FormEvent) {
        e.preventDefault(); 
        if (!form.name.trim()) return; 
        setSaving(true);
        await fetch('/api/admin/content', { 
            method: 'POST', 
            headers: { 'Content-Type': 'application/json' }, 
            body: JSON.stringify({ section: 'technicalSkills', data: form }) 
        });
        setSaving(false); 
        setForm({ name: '', type: '' }); 
        load(); 
        setMsg('Skill added!'); 
        setTimeout(() => setMsg(''), 2500);
    }

    async function del(id: number) {
        await fetch('/api/admin/content', { 
            method: 'DELETE', 
            headers: { 'Content-Type': 'application/json' }, 
            body: JSON.stringify({ section: 'technicalSkills', id }) 
        });
        load();
    }

    const types = ['Language', 'Framework', 'CSS', 'Design', 'Motion', '3D / WebGL', 'Backend', 'Database', 'DevOps', 'Tool'];

    return (
        <div>
            <PageHeader title="Technical Skills" subtitle={`${skills.length} skills in horizontal scroll strip`} />
            {msg && <Toast message={msg} />}
            
            <form onSubmit={add} style={{ ...S.card, display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
                <div style={{ flex: 2, minWidth: 160 }}>
                    <label style={S.label}>Skill Name</label>
                    <input style={S.input} value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="React" required />
                </div>
                <div style={{ flex: 1, minWidth: 140 }}>
                    <label style={S.label}>Type</label>
                    <select style={S.input} value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value }))}>
                        <option value="">Select type…</option>
                        {types.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                </div>
                <div style={{ display: 'flex', alignItems: 'flex-end' }}>
                    <button type="submit" disabled={saving} style={{ ...S.btn, padding: '0.7rem 1.5rem' }}>
                        {saving ? '…' : '+ Add'}
                    </button>
                </div>
            </form>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.6rem' }}>
                {skills.map(s => (
                    <div key={s.id} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.6rem', padding: '0.45rem 0.9rem', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '2rem' }}>
                        <span style={{ fontSize: '0.65rem', color: 'rgba(229,9,20,0.85)', letterSpacing: '0.15em', textTransform: 'uppercase' }}>{s.type}</span>
                        <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#fff' }}>{s.name}</span>
                        <button onClick={() => del(s.id)} style={{ background: 'none', border: 'none', color: 'rgba(255,80,80,0.7)', cursor: 'pointer', fontSize: '1.2rem', lineHeight: 1, padding: 0 }}>×</button>
                    </div>
                ))}
                {skills.length === 0 && (
                    <div style={{ ...S.card, width: '100%', textAlign: 'center', padding: '2rem', color: 'rgba(255,255,255,0.2)', fontSize: '0.8rem' }}>
                        No custom skills — defaults shown. Add yours here.
                    </div>
                )}
            </div>
        </div>
    );
}
