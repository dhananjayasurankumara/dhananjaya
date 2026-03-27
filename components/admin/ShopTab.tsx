'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { S, PageHeader, Toast } from './AdminShared';
import ProductForm from './ProductForm';

interface Product { 
    id?: number; 
    title: string; 
    description: string; 
    price: number; 
    imageUrl: string; 
    category: string; 
    stock: number; 
    featured: boolean; 
}

export default function ShopTab() {
    const [products, setProducts] = useState<Product[]>([]);
    const [showForm, setShowForm] = useState(false);
    const [editing, setEditing] = useState<Product | null>(null);
    const [saving, setSaving] = useState(false);
    const [filter, setFilter] = useState('');
    const [msg, setMsg] = useState('');

    const load = useCallback(() => {
        fetch('/api/admin/products').then(r => r.ok ? r.json() : []).then(setProducts);
    }, []);

    useEffect(() => { load(); }, [load]);

    async function handleSave(form: Product) {
        setSaving(true);
        const method = editing?.id ? 'PUT' : 'POST';
        const body = editing?.id ? { id: editing.id, ...form } : form;
        const res = await fetch('/api/admin/products', { 
            method, 
            headers: { 'Content-Type': 'application/json' }, 
            body: JSON.stringify(body) 
        });
        setSaving(false); 
        if (res.ok) {
            setShowForm(false); 
            setEditing(null); 
            load();
            setMsg(editing ? 'Product updated!' : 'Product added!');
            setTimeout(() => setMsg(''), 3000);
        }
    }

    async function handleDelete(id: number) {
        if (!confirm('Delete this product?')) return;
        await fetch('/api/admin/products', { 
            method: 'DELETE', 
            headers: { 'Content-Type': 'application/json' }, 
            body: JSON.stringify({ id }) 
        });
        load();
        setMsg('Product deleted!');
        setTimeout(() => setMsg(''), 3000);
    }

    async function toggleFeatured(p: Product) {
        await fetch('/api/admin/products', { 
            method: 'PUT', 
            headers: { 'Content-Type': 'application/json' }, 
            body: JSON.stringify({ id: p.id, ...p, featured: !p.featured }) 
        });
        load();
    }

    const filtered = products.filter(p => 
        !filter || 
        p.title.toLowerCase().includes(filter.toLowerCase()) || 
        p.category?.toLowerCase().includes(filter.toLowerCase())
    );

    return (
        <div>
            <PageHeader 
                title="Shop" 
                subtitle={`${products.length} product${products.length !== 1 ? 's' : ''}`} 
                action={
                    <button onClick={() => { setEditing(null); setShowForm(true); }} style={{ ...S.btn, padding: '0.6rem 1.25rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                        + Add Product
                    </button>
                } 
            />
            {msg && <Toast message={msg} />}

            {showForm && (
                <div style={{ marginBottom: '1.5rem' }}>
                    <ProductForm initialData={editing || undefined} onSave={handleSave} onCancel={() => { setShowForm(false); setEditing(null); }} saving={saving} />
                </div>
            )}

            <div style={{ marginBottom: '1.25rem' }}>
                <input style={{ ...S.input, maxWidth: 320 }} placeholder="🔍  Search products…" value={filter} onChange={e => setFilter(e.target.value)} />
            </div>

            {filtered.length === 0 ? (
                <div style={{ ...S.card, textAlign: 'center', padding: '4rem', color: 'rgba(255,255,255,0.2)', fontSize: '0.8rem', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                    {filter ? 'No products match your search' : 'No products yet — add your first one'}
                </div>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem' }}>
                    {filtered.map(p => (
                        <div key={p.id} style={{ ...S.card, display: 'flex', flexDirection: 'column', gap: '1.25rem', padding: '1.25rem' }}>
                            <div style={{ height: 160, borderRadius: '8px', background: p.imageUrl ? `url(${p.imageUrl}) center/cover` : 'rgba(255,255,255,0.04)', position: 'relative', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.05)' }}>
                                {p.featured && (
                                    <span style={{ position: 'absolute', top: 8, right: 8, fontSize: '0.55rem', letterSpacing: '0.15em', textTransform: 'uppercase', background: 'rgba(255,200,50,0.1)', border: '1px solid rgba(255,200,50,0.3)', color: 'rgba(255,200,50,0.9)', borderRadius: '20px', padding: '0.2rem 0.6rem' }}>
                                        ★ Featured
                                    </span>
                                )}
                            </div>
                            <div>
                                <div style={{ fontSize: '1rem', fontWeight: 700, color: '#fff', marginBottom: '0.2rem' }}>{p.title}</div>
                                <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.35)', marginBottom: '0.75rem' }}>{p.category || 'No category'} · Stock: {p.stock}</div>
                                <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#fff' }}>${Number(p.price).toFixed(2)}</div>
                            </div>
                            <div style={{ display: 'flex', gap: '0.5rem', marginTop: 'auto' }}>
                                <button onClick={() => { setEditing(p); setShowForm(true); }} style={{ ...S.btn, flex: 1, textAlign: 'center' }}>Edit</button>
                                <button onClick={() => toggleFeatured(p)} style={{ ...S.btn, padding: '0.5rem 0.75rem', opacity: p.featured ? 1 : 0.5 }} title="Toggle featured">★</button>
                                <button onClick={() => handleDelete(p.id!)} style={S.danger}>Del</button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
