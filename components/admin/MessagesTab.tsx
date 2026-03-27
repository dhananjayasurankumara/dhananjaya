'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { S, PageHeader, Toast } from './AdminShared';

interface Message { 
    id: number; 
    name: string; 
    email: string; 
    subject: string; 
    message: string; 
    read: boolean; 
    createdAt: string; 
}

export default function MessagesTab() {
    const [msgs, setMsgs] = useState<Message[]>([]);
    const [loading, setLoading] = useState(true);
    const [msg, setMsg] = useState('');

    const load = useCallback(() => {
        fetch('/api/admin/messages').then(r => r.ok ? r.json() : []).then(d => { setMsgs(d); setLoading(false); });
    }, []);

    useEffect(() => { load(); }, [load]);

    async function toggleRead(id: number, current: boolean) {
        await fetch('/api/admin/messages', { 
            method: 'PUT', 
            headers: { 'Content-Type': 'application/json' }, 
            body: JSON.stringify({ id, read: !current }) 
        });
        load();
    }

    async function del(id: number) {
        if (!confirm('Delete message?')) return;
        await fetch('/api/admin/messages', { 
            method: 'DELETE', 
            headers: { 'Content-Type': 'application/json' }, 
            body: JSON.stringify({ id }) 
        });
        load();
        setMsg('Deleted!'); 
        setTimeout(() => setMsg(''), 2500);
    }

    return (
        <div>
            <PageHeader title="Messages" subtitle={`${msgs.filter(m => !m.read).length} unread · ${msgs.length} total`} />
            {msg && <Toast message={msg} />}
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {msgs.map(m => (
                    <div key={m.id} style={{ ...S.card, padding: '1.25rem', borderLeft: m.read ? '1px solid rgba(255,255,255,0.07)' : '3px solid #ff3333', background: m.read ? 'rgba(255,255,255,0.015)' : 'rgba(255,50,50,0.03)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                            <div>
                                <div style={{ fontSize: '0.9rem', fontWeight: 800, color: '#fff' }}>{m.subject || '(No Subject)'}</div>
                                <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.4)', marginTop: '0.15rem' }}>
                                    From: <span style={{ color: '#fff' }}>{m.name}</span> ({m.email}) · {new Date(m.createdAt).toLocaleString()}
                                </div>
                            </div>
                            <div style={{ display: 'flex', gap: '0.6rem' }}>
                                <button onClick={() => toggleRead(m.id, m.read)} style={{ ...S.btn, padding: '0.4rem 0.8rem', fontSize: '0.6rem', opacity: 0.6 }}>
                                    Mark as {m.read ? 'Unread' : 'Read'}
                                </button>
                                <button onClick={() => del(m.id)} style={S.danger}>Del</button>
                            </div>
                        </div>
                        <p style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.65)', lineHeight: 1.6, margin: 0, whiteSpace: 'pre-wrap' }}>{m.message}</p>
                    </div>
                ))}
                {msgs.length === 0 && !loading && (
                    <div style={{ ...S.card, textAlign: 'center', padding: '4rem', color: 'rgba(255,255,255,0.2)', fontSize: '0.8rem' }}>No messages yet</div>
                )}
            </div>
        </div>
    );
}
