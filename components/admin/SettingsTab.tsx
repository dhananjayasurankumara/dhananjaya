'use client';

import React, { useEffect, useState } from 'react';
import { PageHeader, Toast } from './AdminShared';
import SiteSettingsForm from './SiteSettingsForm';

export default function SettingsTab() {
    const [data, setData] = useState<any>({});
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);

    useEffect(() => {
        fetch('/api/admin/content')
            .then(r => r.json())
            .then(d => setData(d.settings || {}))
            .finally(() => setLoading(false));
    }, []);

    const handleSave = async (updatedData: any) => {
        setSaving(true);
        try {
            const res = await fetch('/api/admin/content', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ type: 'settings', data: updatedData }),
            });
            if (res.ok) {
                setData(updatedData);
                setToast({ msg: 'Settings saved successfully', type: 'success' });
            } else {
                setToast({ msg: 'Failed to save settings', type: 'error' });
            }
        } catch (err) {
            setToast({ msg: 'An error occurred', type: 'error' });
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.7rem', letterSpacing: '0.2em' }}>LOADING SETTINGS...</div>;

    return (
        <div>
            <PageHeader title="Global Settings" subtitle="Logo, branding, SEO, and social data" />
            <SiteSettingsForm data={data} onSave={handleSave} saving={saving} />
            {toast && <Toast message={toast.msg} type={toast.type} onClose={() => setToast(null)} />}
        </div>
    );
}
