'use client';

import { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

interface Product {
    id: number;
    title: string;
    description?: string;
    price: number;
    imageUrl?: string;
    category?: string;
    stock?: number;
    featured?: boolean;
}

interface CartItem {
    id: number;
    productId: number;
    quantity: number;
    title?: string;
    price?: number;
    imageUrl?: string;
}

export default function ShopPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [cart, setCart] = useState<CartItem[]>([]);
    const [categories, setCategories] = useState<string[]>([]);
    const [activeCategory, setActiveCategory] = useState('all');
    const [cartOpen, setCartOpen] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [loading, setLoading] = useState(true);
    const [addingId, setAddingId] = useState<number | null>(null);
    const [orderMsg, setOrderMsg] = useState('');
    const [bg, setBg] = useState<any>(null);

    useEffect(() => {
        loadProducts();
        // Check auth
        fetch('/api/auth/me').then(r => {
            if (r.ok) { setIsLoggedIn(true); loadCart(); }
        });
        // Fetch background
        fetch('/api/content').then(r => r.json()).then(data => {
            if (data.backgrounds) {
                const shopBg = data.backgrounds.find((b: any) => b.section === 'shop');
                setBg(shopBg);
            }
        });
    }, []);

    async function loadProducts() {
        const res = await fetch('/api/shop/products');
        if (res.ok) {
            const data: Product[] = await res.json();
            setProducts(data);
            const cats = Array.from(new Set(data.map(p => p.category).filter(Boolean) as string[]));
            setCategories(cats);
        }
        setLoading(false);
    }

    async function loadCart() {
        const res = await fetch('/api/shop/cart');
        if (res.ok) setCart(await res.json());
    }

    async function addToCart(productId: number) {
        if (!isLoggedIn) { window.location.href = '/login'; return; }
        setAddingId(productId);
        await fetch('/api/shop/cart', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ productId, quantity: 1 }),
        });
        await loadCart();
        setAddingId(null);
        setCartOpen(true);
    }

    async function removeFromCart(cartItemId: number) {
        await fetch('/api/shop/cart', {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ cartItemId }),
        });
        await loadCart();
    }

    async function placeOrder() {
        const res = await fetch('/api/shop/orders', { method: 'POST' });
        if (res.ok) { setCart([]); setCartOpen(false); setOrderMsg('🎉 Order placed successfully! We\'ll be in touch.'); }
    }

    const filtered = activeCategory === 'all' ? products : products.filter(p => p.category === activeCategory);
    const cartTotal = cart.reduce((s, c) => s + (c.price || 0) * c.quantity, 0);

    return (
        <div style={{ minHeight: '100vh', background: '#050505', paddingTop: '5rem', position: 'relative', overflow: 'hidden' }}>
            
            {/* Dynamic Background */}
            {bg?.imageUrl && (
                <div style={{
                    position: 'absolute',
                    inset: 0,
                    backgroundImage: `url("${bg.imageUrl}")`,
                    backgroundSize: 'cover',
                    backgroundPosition: bg.imagePosition || 'center',
                    opacity: 0.15,
                    zIndex: 0,
                    pointerEvents: 'none',
                    filter: 'blur(10px)'
                }} />
            )}

            {/* Dark Overlay */}
            <div style={{
                position: 'absolute',
                inset: 0,
                background: `rgba(0,0,0,${bg?.overlayOpacity || 0.9})`,
                zIndex: 0,
                pointerEvents: 'none'
            }} />

            {/* Content Wrap */}
            <div style={{ position: 'relative', zIndex: 1 }}>
                {/* Cart Drawer */}
                <AnimatePresence>
                    {cartOpen && (
                        <motion.div
                            key="cart-overlay-wrapper"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            style={{ position: 'fixed', inset: 0, zIndex: 1000 }}
                        >
                            <div
                                onClick={() => setCartOpen(false)}
                                style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)' }}
                            />
                            <motion.div
                                initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
                                transition={{ type: 'spring', damping: 30, stiffness: 300 }}
                                style={{
                                    position: 'absolute', right: 0, top: 0, bottom: 0, width: 'min(400px, 90vw)',
                                    background: '#0a0a0a', border: '1px solid rgba(255,255,255,0.06)',
                                    display: 'flex', flexDirection: 'column', padding: '2rem',
                                }}
                            >
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                                    <h2 style={{ fontSize: '0.8rem', fontWeight: 700, letterSpacing: '0.25em', textTransform: 'uppercase', color: '#fff', margin: 0 }}>
                                        Cart ({cart.length})
                                    </h2>
                                    <button onClick={() => setCartOpen(false)} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)', fontSize: '1.5rem', cursor: 'pointer' }}>×</button>
                                </div>

                                {cart.length === 0 ? (
                                    <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(255,255,255,0.3)', fontSize: '0.8rem', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                                        Cart is empty
                                    </div>
                                ) : (
                                    <>
                                        <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                            {cart.map(item => (
                                                <div key={item.id} style={{ display: 'flex', gap: '1rem', alignItems: 'center', padding: '1rem', background: 'rgba(255,255,255,0.02)', borderRadius: '0.75rem', border: '1px solid rgba(255,255,255,0.05)' }}>
                                                    <div style={{ width: '50px', height: '50px', borderRadius: '0.5rem', background: item.imageUrl ? `url(${item.imageUrl}) center/cover` : 'rgba(255,255,255,0.05)', flexShrink: 0 }} />
                                                    <div style={{ flex: 1, minWidth: 0 }}>
                                                        <div style={{ fontSize: '0.8rem', fontWeight: 600, color: '#fff', marginBottom: '0.2rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.title}</div>
                                                        <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)' }}>Qty: {item.quantity} × ${item.price?.toFixed(2)}</div>
                                                    </div>
                                                    <button onClick={() => removeFromCart(item.id)} style={{ background: 'none', border: 'none', color: 'rgba(255,80,80,0.6)', cursor: 'pointer', fontSize: '1.1rem' }}>×</button>
                                                </div>
                                            ))}
                                        </div>
                                        <div style={{ paddingTop: '1.5rem', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                                                <span style={{ fontSize: '0.7rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)' }}>Total</span>
                                                <span style={{ fontSize: '1.1rem', fontWeight: 700, color: '#fff' }}>${cartTotal.toFixed(2)}</span>
                                            </div>
                                            <button onClick={placeOrder} style={{ width: '100%', padding: '1rem', background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '0.75rem', color: '#fff', fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', cursor: 'pointer', fontFamily: 'inherit' }}>
                                                Place Order
                                            </button>
                                        </div>
                                    </>
                                )}
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Header */}
                <div style={{ padding: '2rem clamp(1.5rem, 5vw, 5rem) 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Link href="/" style={{ fontSize: '0.65rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.35)', textDecoration: 'none' }}>← Portfolio</Link>
                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                        {isLoggedIn ? (
                            <Link href="/profile" style={{ fontSize: '0.65rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.5)', textDecoration: 'none' }}>Profile</Link>
                        ) : (
                            <Link href="/login" style={{ fontSize: '0.65rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.5)', textDecoration: 'none' }}>Login</Link>
                        )}
                        <button
                            onClick={() => setCartOpen(true)}
                            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '2rem', padding: '0.5rem 1rem', color: '#fff', cursor: 'pointer', fontSize: '0.7rem', letterSpacing: '0.1em', textTransform: 'uppercase' }}
                        >
                            🛍️ {cart.length > 0 && <span style={{ background: 'rgba(255,255,255,0.15)', borderRadius: '50%', width: '18px', height: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.6rem' }}>{cart.length}</span>}
                            Cart
                        </button>
                    </div>
                </div>

                {/* Hero */}
                <div style={{ padding: '4rem clamp(1.5rem, 5vw, 5rem) 3rem', textAlign: 'center' }}>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        style={{ fontSize: '0.65rem', letterSpacing: '0.4em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)', marginBottom: '1rem' }}
                    >
                        Creative Store
                    </motion.p>
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        style={{ fontSize: 'clamp(2.5rem, 6vw, 5rem)', fontWeight: 800, letterSpacing: '-0.02em', color: '#fff', lineHeight: 1, margin: '0 0 1rem' }}
                    >
                        THE SHOP
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        style={{ color: 'rgba(255,255,255,0.35)', maxWidth: '500px', margin: '0 auto', lineHeight: 1.7 }}
                    >
                        Premium digital products, design assets, and templates crafted with meticulous attention to detail.
                    </motion.p>
                </div>

                {/* Order message */}
                <AnimatePresence>
                    {orderMsg && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                            style={{ margin: '0 clamp(1.5rem, 5vw, 5rem) 2rem', padding: '1rem 1.5rem', background: 'rgba(80,200,80,0.1)', border: '1px solid rgba(80,200,80,0.2)', borderRadius: '0.75rem', color: '#aaffaa', fontSize: '0.85rem' }}
                        >
                            {orderMsg}
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Category Filter */}
                <div style={{ padding: '0 clamp(1.5rem, 5vw, 5rem)', display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '3rem' }}>
                    {['all', ...categories].map(cat => (
                        <button
                            key={cat}
                            onClick={() => setActiveCategory(cat)}
                            style={{
                                padding: '0.5rem 1.25rem',
                                background: activeCategory === cat ? 'rgba(255,255,255,0.08)' : 'transparent',
                                border: `1px solid ${activeCategory === cat ? 'rgba(255,255,255,0.15)' : 'rgba(255,255,255,0.06)'}`,
                                borderRadius: '2rem',
                                color: activeCategory === cat ? '#fff' : 'rgba(255,255,255,0.4)',
                                fontSize: '0.65rem',
                                fontWeight: 600,
                                letterSpacing: '0.2em',
                                textTransform: 'uppercase',
                                cursor: 'pointer',
                                transition: 'all 0.25s',
                                fontFamily: 'inherit',
                            }}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                {/* Products Grid */}
                <div style={{ padding: '0 clamp(1.5rem, 5vw, 5rem) 6rem' }}>
                    {loading ? (
                        <div style={{ textAlign: 'center', color: 'rgba(255,255,255,0.3)', fontSize: '0.8rem', letterSpacing: '0.2em', textTransform: 'uppercase', padding: '5rem 0' }}>
                            Loading products...
                        </div>
                    ) : filtered.length === 0 ? (
                        <div style={{ textAlign: 'center', color: 'rgba(255,255,255,0.25)', padding: '5rem 0' }}>
                            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🛍️</div>
                            <p style={{ fontSize: '0.8rem', letterSpacing: '0.2em', textTransform: 'uppercase' }}>
                                No products yet. Check back soon.
                            </p>
                        </div>
                    ) : (
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                            gap: '1.5rem',
                        }}>
                            {filtered.map((product, i) => (
                                <motion.div
                                    key={product.id}
                                    initial={{ opacity: 0, y: 30 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.07, duration: 0.5 }}
                                    style={{
                                        background: 'rgba(255,255,255,0.02)',
                                        border: '1px solid rgba(255,255,255,0.06)',
                                        borderRadius: '1.25rem',
                                        overflow: 'hidden',
                                        position: 'relative',
                                        transition: 'transform 0.3s ease, border-color 0.3s ease',
                                        cursor: 'default',
                                    }}
                                    onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)'; e.currentTarget.style.transform = 'translateY(-4px)'; }}
                                    onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)'; e.currentTarget.style.transform = 'translateY(0)'; }}
                                >
                                    {/* Image */}
                                    <div style={{
                                        height: '200px',
                                        background: product.imageUrl
                                            ? `url(${product.imageUrl}) center/cover`
                                            : 'linear-gradient(135deg, rgba(255,255,255,0.04), rgba(255,255,255,0.01))',
                                        position: 'relative',
                                    }}>
                                        {product.featured && (
                                            <span style={{ position: 'absolute', top: '1rem', left: '1rem', fontSize: '0.55rem', letterSpacing: '0.2em', textTransform: 'uppercase', background: 'rgba(255,200,50,0.15)', border: '1px solid rgba(255,200,50,0.3)', color: 'rgba(255,200,50,0.9)', borderRadius: '2rem', padding: '0.3rem 0.7rem' }}>
                                                Featured
                                            </span>
                                        )}
                                        {product.stock === 0 && (
                                            <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                <span style={{ fontSize: '0.65rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.5)' }}>Out of Stock</span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Info */}
                                    <div style={{ padding: '1.5rem' }}>
                                        {product.category && (
                                            <span style={{ fontSize: '0.6rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)' }}>
                                                {product.category}
                                            </span>
                                        )}
                                        <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#fff', margin: '0.4rem 0 0.5rem', lineHeight: 1.3 }}>
                                            {product.title}
                                        </h3>
                                        {product.description && (
                                            <p style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.4)', lineHeight: 1.6, marginBottom: '1.25rem', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' } as any}>
                                                {product.description}
                                            </p>
                                        )}
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem' }}>
                                            <span style={{ fontSize: '1.3rem', fontWeight: 800, color: '#fff' }}>
                                                ${product.price.toFixed(2)}
                                            </span>
                                            <button
                                                onClick={() => addToCart(product.id)}
                                                disabled={addingId === product.id || product.stock === 0}
                                                style={{
                                                    padding: '0.6rem 1.2rem',
                                                    background: addingId === product.id ? 'rgba(255,255,255,0.03)' : 'rgba(255,255,255,0.07)',
                                                    border: '1px solid rgba(255,255,255,0.1)',
                                                    borderRadius: '2rem',
                                                    color: product.stock === 0 ? 'rgba(255,255,255,0.2)' : '#fff',
                                                    fontSize: '0.65rem',
                                                    fontWeight: 600,
                                                    letterSpacing: '0.15em',
                                                    textTransform: 'uppercase',
                                                    cursor: product.stock === 0 ? 'not-allowed' : 'pointer',
                                                    fontFamily: 'inherit',
                                                    transition: 'all 0.25s',
                                                }}
                                            >
                                                {addingId === product.id ? '...' : product.stock === 0 ? 'Sold Out' : 'Add to Cart'}
                                            </button>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
