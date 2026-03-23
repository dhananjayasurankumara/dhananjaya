'use client';

import { useState } from 'react';

interface SiteSettingsFormProps {
    data: any;
    onSave: (data: any) => void;
    saving: boolean;
}

const inputStyle = {
    width: '100%',
    padding: '0.75rem 1rem',
    background: 'rgba(255,255,255,0.03)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: '0.6rem',
    color: '#fff',
    fontSize: '0.85rem',
    outline: 'none',
    boxSizing: 'border-box' as const,
    fontFamily: 'inherit',
};

const labelStyle = {
    display: 'block',
    fontSize: '0.6rem',
    letterSpacing: '0.15em',
    textTransform: 'uppercase' as const,
    color: 'rgba(255,255,255,0.35)',
    marginBottom: '0.4rem',
};

const btnStyle = {
    padding: '0.6rem 1.25rem',
    background: 'rgba(255,255,255,0.07)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '0.6rem',
    color: '#fff',
    fontSize: '0.65rem',
    fontWeight: 600 as const,
    letterSpacing: '0.15em',
    textTransform: 'uppercase' as const,
    cursor: 'pointer',
    fontFamily: 'inherit',
};

export default function SiteSettingsForm({ data, onSave, saving }: SiteSettingsFormProps) {
    const [form, setForm] = useState({
        logoText: data.logoText || '',
        email: data.email || '',
        whatsapp: data.whatsapp || '',
        linkedin: data.linkedin || '',
    });

    return (
        <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '1rem', padding: '1.5rem' }}>
            <h3 style={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#fff', margin: '0 0 1.5rem' }}>Site Settings</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1rem' }}>
                <div>
                    <label style={labelStyle}>Logo Text</label>
                    <input type="text" value={form.logoText} onChange={e => setForm(f => ({ ...f, logoText: e.target.value }))} style={inputStyle} />
                </div>
                <div>
                    <label style={labelStyle}>Email</label>
                    <input type="text" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} style={inputStyle} />
                </div>
                <div>
                    <label style={labelStyle}>WhatsApp Number</label>
                    <input type="text" value={form.whatsapp} onChange={e => setForm(f => ({ ...f, whatsapp: e.target.value }))} style={inputStyle} />
                </div>
                <div>
                    <label style={labelStyle}>LinkedIn URL</label>
                    <input type="text" value={form.linkedin} onChange={e => setForm(f => ({ ...f, linkedin: e.target.value }))} style={inputStyle} />
                </div>
            </div>
            <button onClick={() => onSave(form)} disabled={saving} style={{ ...btnStyle, marginTop: '1.5rem' }}>
                {saving ? 'Saving...' : 'Save Site Settings'}
            </button>
        </div>
    );
}
