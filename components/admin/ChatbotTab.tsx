'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { S, PageHeader, Toast } from './AdminShared';

interface Trigger { 
    id: number; 
    keyword: string; 
    reply: string; 
}

export default function ChatbotTab() {
    const [triggers, setTriggers] = useState<Trigger[]>([]);
    const [form, setForm] = useState({ keyword: '', reply: '' });
    const [saving, setSaving] = useState(false);
    const [msg, setMsg] = useState('');

    const load = useCallback(() => {
        fetch('/api/admin/chatbot').then(r => r.ok ? r.json() : []).then(setTriggers);
    }, []);

    useEffect(() => { load(); }, [load]);

    async function add(e: React.FormEvent) {
        e.preventDefault(); 
        setSaving(true);
        await fetch('/api/admin/chatbot', { 
            method: 'POST', 
            headers: { 'Content-Type': 'application/json' }, 
            body: JSON.stringify(form) 
        });
        setSaving(false); 
        setForm({ keyword: '', reply: '' }); 
        load(); 
        setMsg('Trigger added!'); 
        setTimeout(() => setMsg(''), 2500);
    }

    async function del(id: number) {
        if (!confirm('Delete trigger?')) return;
        await fetch('/api/admin/chatbot', { 
            method: 'DELETE', 
            headers: { 'Content-Type': 'application/json' }, 
            body: JSON.stringify({ id }) 
        });
        load();
    }

    return (
        <div>
            <PageHeader title="Chatbot Intelligence" subtitle="Configure automated replies for specific keywords" />
            {msg && <Toast message={msg} />}
            
            <form onSubmit={add} style={{ ...S.card, display: 'flex', flexDirection: 'column', gap: '0.9rem', marginBottom: '1.5rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '1rem' }}>
                    <div><label style={S.label}>Keyword / Trigger</label><input style={S.input} value={form.keyword} onChange={e => setForm(f => ({ ...f, keyword: e.target.value }))} placeholder="price, contact, portfolio" required /></div>
                    <div><label style={S.label}>Bot Reply</label><input style={S.input} value={form.reply} onChange={e => setForm(f => ({ ...f, reply: e.target.value }))} placeholder="My pricing starts at $500..." required /></div>
                </div>
                <div><button type="submit" disabled={saving} style={{ ...S.btn, padding: '0.75rem 2rem' }}>{saving ? 'Saving…' : '+ Add Trigger'}</button></div>
            </form>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                {triggers.map(t => (
                    <div key={t.id} style={{ ...S.card, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1.25rem', padding: '1rem 1.25rem' }}>
                        <div style={{ flex: 1 }}>
                            <div style={{ fontSize: '0.65rem', fontWeight: 800, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', marginBottom: '0.2rem' }}>If user says: <span style={{ color: '#fff' }}>{t.keyword}</span></div>
                            <div style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.8)', fontStyle: 'italic' }}>"{t.reply}"</div>
                        </div>
                        <button onClick={() => del(t.id)} style={S.danger}>Delete</button>
                    </div>
                ))}
            </div>
        </div>
    );
}
