'use client';

import { useState } from 'react';

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

interface ProductFormProps {
    initialData?: Product;
    onSave: (data: Product) => void;
    onCancel: () => void;
    saving: boolean;
}

const inputStyle = { width: '100%', padding: '0.75rem 1rem', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '0.6rem', color: '#fff', fontSize: '0.85rem', outline: 'none', boxSizing: 'border-box' as const, fontFamily: 'inherit' };
const labelStyle = { display: 'block', fontSize: '0.6rem', letterSpacing: '0.15em', textTransform: 'uppercase' as const, color: 'rgba(255,255,255,0.35)', marginBottom: '0.4rem' };
const btnStyle = { padding: '0.6rem 1.25rem', background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '0.6rem', color: '#fff', fontSize: '0.65rem', fontWeight: 600 as const, letterSpacing: '0.15em', textTransform: 'uppercase' as const, cursor: 'pointer', fontFamily: 'inherit' };

export default function ProductForm({ initialData, onSave, onCancel, saving }: ProductFormProps) {
    const [form, setForm] = useState<Product>(initialData || {
        title: '',
        description: '',
        price: 0,
        imageUrl: '',
        category: '',
        stock: 0,
        featured: false,
    });

    return (
        <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '1rem', padding: '1.5rem', marginBottom: '1.5rem' }}>
            <h3 style={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#fff', margin: '0 0 1.5rem' }}>
                {initialData ? 'Edit Product' : 'New Product'}
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '1rem' }}>
                <div>
                    <label style={labelStyle}>Title</label>
                    <input type="text" value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} style={inputStyle} />
                </div>
                <div>
                    <label style={labelStyle}>Category</label>
                    <input type="text" value={form.category} onChange={e => setForm(p => ({ ...p, category: e.target.value }))} style={inputStyle} />
                </div>
                <div>
                    <label style={labelStyle}>Price ($)</label>
                    <input type="number" value={form.price} onChange={e => setForm(p => ({ ...p, price: Number(e.target.value) }))} style={inputStyle} />
                </div>
                <div>
                    <label style={labelStyle}>Stock</label>
                    <input type="number" value={form.stock} onChange={e => setForm(p => ({ ...p, stock: Number(e.target.value) }))} style={inputStyle} />
                </div>
                <div>
                    <label style={labelStyle}>Image URL</label>
                    <input type="text" value={form.imageUrl} onChange={e => setForm(p => ({ ...p, imageUrl: e.target.value }))} style={inputStyle} />
                </div>
                <div>
                    <label style={labelStyle}>Description</label>
                    <textarea value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} rows={3} style={{ ...inputStyle, resize: 'vertical' }} />
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <input type="checkbox" id="featured" checked={form.featured} onChange={e => setForm(p => ({ ...p, featured: e.target.checked }))} style={{ width: '16px', height: '16px', cursor: 'pointer' }} />
                    <label htmlFor="featured" style={{ ...labelStyle, marginBottom: 0, cursor: 'pointer' }}>Featured product</label>
                </div>
            </div>
            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.5rem' }}>
                <button onClick={() => onSave(form)} disabled={saving} style={btnStyle}>{saving ? 'Saving...' : initialData ? 'Update Product' : 'Create Product'}</button>
                <button onClick={onCancel} style={{ ...btnStyle, background: 'transparent', border: '1px solid rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.4)' }}>Cancel</button>
            </div>
        </div>
    );
}
