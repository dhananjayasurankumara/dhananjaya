'use client';

import React from 'react';

/* ─── Shared Styles ──────────────────────────────────────────────────────── */
export const S = {
    bg: '#0a0a0a',
    sidebar: '#0f0f0f',
    card: { 
        background: 'rgba(255,255,255,0.025)', 
        border: '1px solid rgba(255,255,255,0.07)', 
        borderRadius: '12px', 
        padding: '1.5rem' 
    } as React.CSSProperties,
    input: { 
        width: '100%', 
        padding: '0.7rem 0.9rem', 
        background: 'rgba(255,255,255,0.04)', 
        border: '1px solid rgba(255,255,255,0.1)', 
        borderRadius: '8px', 
        color: '#fff', 
        fontSize: '0.875rem', 
        outline: 'none', 
        boxSizing: 'border-box' as const, 
        fontFamily: 'inherit', 
        transition: 'border-color 0.2s' 
    } as React.CSSProperties,
    label: { 
        display: 'block', 
        fontSize: '0.6rem', 
        letterSpacing: '0.15em', 
        textTransform: 'uppercase' as const, 
        color: 'rgba(255,255,255,0.4)', 
        marginBottom: '0.4rem' 
    } as React.CSSProperties,
    btn: { 
        padding: '0.55rem 1.1rem', 
        background: 'rgba(255,255,255,0.08)', 
        border: '1px solid rgba(255,255,255,0.12)', 
        borderRadius: '8px', 
        color: '#fff', 
        fontSize: '0.7rem', 
        fontWeight: 600 as const, 
        letterSpacing: '0.1em', 
        textTransform: 'uppercase' as const, 
        cursor: 'pointer', 
        fontFamily: 'inherit', 
        transition: 'all 0.2s' 
    } as React.CSSProperties,
    danger: { 
        padding: '0.5rem 0.9rem', 
        background: 'rgba(255,60,60,0.07)', 
        border: '1px solid rgba(255,60,60,0.2)', 
        borderRadius: '8px', 
        color: 'rgba(255,110,110,0.9)', 
        fontSize: '0.65rem', 
        fontWeight: 600 as const, 
        letterSpacing: '0.1em', 
        textTransform: 'uppercase' as const, 
        cursor: 'pointer', 
        fontFamily: 'inherit' 
    } as React.CSSProperties,
    success: { 
        padding: '0.5rem 0.9rem', 
        background: 'rgba(60,200,100,0.07)', 
        border: '1px solid rgba(60,200,100,0.2)', 
        borderRadius: '8px', 
        color: 'rgba(80,220,120,0.9)', 
        fontSize: '0.65rem', 
        fontWeight: 600 as const, 
        letterSpacing: '0.1em', 
        textTransform: 'uppercase' as const, 
        cursor: 'pointer', 
        fontFamily: 'inherit' 
    } as React.CSSProperties,
};

/* ─── Shared Components ──────────────────────────────────────────────────── */

export function PageHeader({ title, subtitle, action }: { title: string, subtitle?: string, action?: React.ReactNode }) {
    return (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', gap: '1rem', flexWrap: 'wrap' }}>
            <div>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#fff', margin: 0, letterSpacing: '-0.01em' }}>{title}</h2>
                {subtitle && <p style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.3)', margin: '0.25rem 0 0' }}>{subtitle}</p>}
            </div>
            {action && <div style={{ flexShrink: 0 }}>{action}</div>}
        </div>
    );
}

export function Toast({ message, type = 'success', onClose }: { message: string, type?: 'success' | 'error', onClose?: () => void }) {
    React.useEffect(() => {
        const timer = setTimeout(() => {
            if (onClose) onClose();
        }, 3000);
        return () => clearTimeout(timer);
    }, [onClose]);

    const bg = type === 'success' ? '#10b981' : '#ef4444';

    return (
        <div style={{ 
            position: 'fixed', bottom: '2rem', right: '2rem', zIndex: 2000, 
            background: bg, color: '#fff', padding: '0.75rem 1.25rem', 
            borderRadius: '10px', fontSize: '0.75rem', fontWeight: 700, 
            boxShadow: '0 10px 30px rgba(0,0,0,0.3)', animation: 'slideIn 0.3s ease-out' 
        }}>
            {message}
            <style>{`
                @keyframes slideIn {
                    from { transform: translateX(100%); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }
            `}</style>
        </div>
    );
}
