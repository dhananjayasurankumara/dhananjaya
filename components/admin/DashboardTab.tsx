'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { S, PageHeader } from './AdminShared';

export default function DashboardTab({ onNavigate }: { onNavigate: (tab: string) => void }) {
    const [stats, setStats] = useState<Record<string, number>>({});

    const fetchStats = useCallback(() => {
        Promise.all([
            fetch('/api/admin/products').then(r => r.ok ? r.json() : []),
            fetch('/api/admin/users').then(r => r.ok ? r.json() : []),
            fetch('/api/admin/content').then(r => r.ok ? r.json() : {}),
            fetch('/api/admin/reviews').then(r => r.ok ? r.json() : []),
            fetch('/api/admin/messages').then(r => r.ok ? r.json() : []),
        ]).then(([prods, usrs, contentRaw, revs, msgs]) => {
            const content = contentRaw as any;
            setStats({
                products: (prods || []).length,
                users: (usrs || []).length,
                projects: (content.projects || []).length,
                skills: (content.skills || []).length,
                presence: (content.presence || []).length,
                support: (content.support || []).length,
                reviews: (revs || []).length,
                messages: (msgs || []).length,
            });
        });
    }, []);

    useEffect(() => {
        fetchStats();
    }, [fetchStats]);

    const statCards = [
        { label: 'Products',  key: 'products',  tab: 'shop',      color: '#818cf8' },
        { label: 'Users',     key: 'users',     tab: 'users',     color: '#34d399' },
        { label: 'Projects',  key: 'projects',  tab: 'projects',  color: '#fb923c' },
        { label: 'Skills',    key: 'skills',    tab: 'technical', color: '#38bdf8' },
        { label: 'Platforms', key: 'presence',  tab: 'presence',  color: '#e879f9' },
        { label: 'Support',   key: 'support',   tab: 'support',   color: '#facc15' },
        { label: 'Reviews',   key: 'reviews',   tab: 'reviews',   color: '#4ade80' },
        { label: 'Messages',  key: 'messages',  tab: 'messages',  color: '#f87171' },
    ];

    const sectionLinks = [
        { label: 'Hero',        tab: 'hero',        icon: '◉', desc: 'Headline, sub-headline, CTA' },
        { label: 'About',       tab: 'about',       icon: '👤', desc: 'Bio, title, stats' },
        { label: 'Philosophy',  tab: 'philosophy',  icon: '💡', desc: 'Creative philosophy statement' },
        { label: 'Technical',   tab: 'technical',   icon: '⚡', desc: 'Skills shown in scroll strip' },
        { label: 'Projects',    tab: 'projects',    icon: '🗂', desc: 'Portfolio work cards' },
        { label: 'Presence',    tab: 'presence',    icon: '🔗', desc: 'Social / platform carousel' },
        { label: 'Support',     tab: 'support',     icon: '🛟', desc: 'Donation & support links' },
        { label: 'Reviews',     tab: 'reviews',     icon: '⭐', desc: 'User reviews & ratings' },
        { label: 'Shop',        tab: 'shop',        icon: '⬡', desc: 'Products & orders' },
        { label: 'Nav Links',   tab: 'navlinks',    icon: '🧭', desc: 'Navbar links management' },
        { label: 'Media / BG',  tab: 'media',       icon: '🖼', desc: 'Background images per section' },
        { label: 'Users',       tab: 'users',       icon: '◇', desc: 'Registered accounts' },
        { label: 'Messages',    tab: 'messages',    icon: '✉', desc: 'Contact form inbox' },
        { label: 'Chatbot',     tab: 'chatbot',     icon: '🤖', desc: 'Bot replies & triggers' },
        { label: 'Settings',    tab: 'settings',    icon: '⚙', desc: 'Logo, colors, SEO, social' },
    ];

    return (
        <div>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <PageHeader title="Dashboard" subtitle={`Welcome back, OHansani · ${new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}`} />
            </div>

            {/* All-section stats */}
            <div style={{ fontSize: '0.6rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)', marginBottom: '0.75rem' }}>Site Overview</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '0.75rem', marginBottom: '2rem' }}>
                {statCards.map(s => (
                    <button key={s.key} onClick={() => onNavigate(s.tab)} style={{ ...S.card, position: 'relative', overflow: 'hidden', cursor: 'pointer', textAlign: 'left', width: '100%', fontFamily: 'inherit', transition: 'border-color 0.2s' }}>
                        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '2px', background: s.color, opacity: 0.6 }} />
                        <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#fff', lineHeight: 1, marginBottom: '0.3rem' }}>
                            {stats[s.key] ?? '—'}
                        </div>
                        <div style={{ fontSize: '0.58rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: s.color, opacity: 0.8 }}>{s.label}</div>
                    </button>
                ))}
            </div>

            {/* All editable sections */}
            <div style={{ fontSize: '0.6rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)', marginBottom: '0.75rem' }}>All Sections</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '0.65rem' }}>
                {sectionLinks.map(a => (
                    <button key={a.tab} onClick={() => onNavigate(a.tab)} style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '12px', padding: '1rem 1.1rem', cursor: 'pointer', textAlign: 'left', fontFamily: 'inherit', display: 'flex', alignItems: 'flex-start', gap: '0.75rem', transition: 'border-color 0.2s, background 0.2s', width: '100%' }}>
                        <span style={{ fontSize: '1.1rem', opacity: 0.75, flexShrink: 0 }}>{a.icon}</span>
                        <div>
                            <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#fff', marginBottom: '0.2rem' }}>{a.label}</div>
                            <div style={{ fontSize: '0.62rem', color: 'rgba(255,255,255,0.28)', lineHeight: 1.4 }}>{a.desc}</div>
                        </div>
                    </button>
                ))}
            </div>
        </div>
    );
}
