'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { S, PageHeader, Toast } from './AdminShared';

interface UserRow { 
    id: number; 
    name: string; 
    email: string; 
    role: string; 
    bio?: string; 
    passwordHash?: string; 
    createdAt: string; 
}

export default function UsersTab() {
    const [users, setUsers] = useState<UserRow[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('');
    const [editing, setEditing] = useState<UserRow | null>(null);
    const [editForm, setEditForm] = useState({ name: '', email: '', role: 'user', bio: '', newPassword: '' });
    const [saving, setSaving] = useState(false);
    const [showPass, setShowPass] = useState<Record<number,boolean>>({});
    const [addMode, setAddMode] = useState(false);
    const [newUser, setNewUser] = useState({ name: '', email: '', password: '', role: 'user' });
    const [msg, setMsg] = useState('');

    const load = useCallback(() => {
        fetch('/api/admin/users').then(r => r.ok ? r.json() : []).then(d => { 
            setUsers(d); 
            setLoading(false); 
        });
    }, []);

    useEffect(() => { load(); }, [load]);

    function openEdit(u: UserRow) {
        setEditing(u);
        setEditForm({ name: u.name, email: u.email, role: u.role, bio: u.bio || '', newPassword: '' });
    }

    async function saveEdit() {
        if (!editing) return;
        setSaving(true);
        const res = await fetch('/api/admin/users', { 
            method: 'PUT', 
            headers: { 'Content-Type': 'application/json' }, 
            body: JSON.stringify({ id: editing.id, ...editForm }) 
        });
        setSaving(false);
        if (res.ok) { 
            setEditing(null); 
            load(); 
            setMsg('User updated!'); 
            setTimeout(() => setMsg(''), 3000); 
        }
    }

    async function deleteUser(id: number) {
        if (!confirm('Delete this user? This cannot be undone.')) return;
        await fetch('/api/admin/users', { 
            method: 'DELETE', 
            headers: { 'Content-Type': 'application/json' }, 
            body: JSON.stringify({ id }) 
        });
        load();
    }

    async function createUser() {
        if (!newUser.name || !newUser.email || !newUser.password) return;
        setSaving(true);
        await fetch('/api/admin/users', { 
            method: 'POST', 
            headers: { 'Content-Type': 'application/json' }, 
            body: JSON.stringify(newUser) 
        });
        setSaving(false); 
        setAddMode(false); 
        setNewUser({ name: '', email: '', password: '', role: 'user' }); 
        load();
        setMsg('User created!'); 
        setTimeout(() => setMsg(''), 3000);
    }

    const filtered = users.filter(u => 
        !filter || 
        u.name.toLowerCase().includes(filter.toLowerCase()) || 
        u.email.toLowerCase().includes(filter.toLowerCase())
    );

    return (
        <div>
            <PageHeader title="Users" subtitle={`${users.length} registered account${users.length !== 1 ? 's' : ''}`} action={
                <button onClick={() => setAddMode(m => !m)} style={{ ...S.btn, padding: '0.6rem 1.25rem' }}>+ Add User</button>
            } />

            {msg && <Toast message={msg} />}

            {addMode && (
                <div style={{ ...S.card, marginBottom: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div style={{ fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.5)' }}>Create New User</div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px,1fr))', gap: '0.75rem' }}>
                        <div><label style={S.label}>Name</label><input type="text" style={S.input} value={newUser.name} onChange={e => setNewUser(p => ({...p, name: e.target.value}))} /></div>
                        <div><label style={S.label}>Email</label><input type="email" style={S.input} value={newUser.email} onChange={e => setNewUser(p => ({...p, email: e.target.value}))} /></div>
                        <div><label style={S.label}>Password</label><input type="password" style={S.input} value={newUser.password} onChange={e => setNewUser(p => ({...p, password: e.target.value}))} /></div>
                        <div><label style={S.label}>Role</label><select style={{...S.input}} value={newUser.role} onChange={e => setNewUser(p=>({...p,role:e.target.value}))}><option value="user">User</option><option value="admin">Admin</option></select></div>
                    </div>
                    <div style={{ display: 'flex', gap: '0.75rem' }}>
                        <button onClick={createUser} disabled={saving} style={{ ...S.btn }}>Create User</button>
                        <button onClick={() => setAddMode(false)} style={{ ...S.btn, opacity: 0.5 }}>Cancel</button>
                    </div>
                </div>
            )}

            {editing && (
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem', backdropFilter: 'blur(10px)' }}>
                    <div style={{ ...S.card, width: '100%', maxWidth: 520, display: 'flex', flexDirection: 'column', gap: '1.25rem', background: '#0a0a0a', border: '1px solid rgba(255,255,255,0.1)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div style={{ fontSize: '0.8rem', fontWeight: 800, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#fff' }}>Edit User</div>
                            <button onClick={() => setEditing(null)} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)', cursor: 'pointer', fontSize: '1.5rem' }}>×</button>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                            <div><label style={S.label}>Name</label><input type="text" style={S.input} value={editForm.name} onChange={e => setEditForm(p=>({...p,name:e.target.value}))} /></div>
                            <div><label style={S.label}>Email</label><input type="email" style={S.input} value={editForm.email} onChange={e => setEditForm(p=>({...p,email:e.target.value}))} /></div>
                        </div>
                        <div><label style={S.label}>Bio</label><textarea rows={3} style={{...S.input, resize:'vertical'}} value={editForm.bio} onChange={e=>setEditForm(p=>({...p,bio:e.target.value}))} /></div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                            <div><label style={S.label}>Role</label><select style={{...S.input}} value={editForm.role} onChange={e=>setEditForm(p=>({...p,role:e.target.value}))}><option value="user">User</option><option value="admin">Admin</option></select></div>
                            <div><label style={S.label}>New Password (blank to keep)</label><input type="password" style={S.input} placeholder="••••••••" value={editForm.newPassword} onChange={e=>setEditForm(p=>({...p,newPassword:e.target.value}))} /></div>
                        </div>
                        <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
                            <button onClick={saveEdit} disabled={saving} style={{ ...S.btn, flex: 1, padding: '0.85rem' }}>{saving ? 'Saving…' : '✓ Save Changes'}</button>
                            <button onClick={() => setEditing(null)} style={{ ...S.btn, opacity: 0.4 }}>Cancel</button>
                        </div>
                    </div>
                </div>
            )}

            <input style={{ ...S.input, maxWidth: 320, marginBottom: '1.25rem' }} placeholder="🔍  Search users…" value={filter} onChange={e => setFilter(e.target.value)} />

            {loading ? (
                <div style={{ ...S.card, textAlign: 'center', padding: '4rem', color: 'rgba(255,255,255,0.25)' }}>Loading users…</div>
            ) : filtered.length === 0 ? (
                <div style={{ ...S.card, textAlign: 'center', padding: '4rem', color: 'rgba(255,255,255,0.25)', fontSize: '0.8rem' }}>No users found</div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    {filtered.map(u => (
                        <div key={u.id} style={{ ...S.card, display: 'flex', flexDirection: 'column', gap: '0.8rem', padding: '1.25rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                    <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem', fontWeight: 800, color: '#fff', flexShrink: 0 }}>
                                        {u.name.charAt(0).toUpperCase()}
                                    </div>
                                    <div>
                                        <div style={{ fontSize: '1rem', fontWeight: 700, color: '#fff' }}>{u.name}</div>
                                        <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)', marginTop: '0.2rem' }}>{u.email}</div>
                                    </div>
                                    <span style={{ fontSize: '0.55rem', fontWeight: 800, letterSpacing: '0.15em', textTransform: 'uppercase', padding: '0.25rem 0.75rem', borderRadius: '4px', background: u.role === 'admin' ? 'rgba(255,200,50,0.1)' : 'rgba(255,255,255,0.05)', color: u.role === 'admin' ? 'rgba(255,200,50,0.9)' : 'rgba(255,255,255,0.4)' }}>
                                        {u.role}
                                    </span>
                                </div>
                                <div style={{ display: 'flex', gap: '0.6rem' }}>
                                    <button onClick={() => openEdit(u)} style={S.btn}>✏ Edit</button>
                                    <button onClick={() => deleteUser(u.id)} style={S.danger}>Delete</button>
                                </div>
                            </div>
                            
                            {u.passwordHash && (
                                <div style={{ background: 'rgba(0,0,0,0.2)', borderRadius: '8px', padding: '0.6rem 1rem', display: 'flex', alignItems: 'center', gap: '1rem', border: '1px solid rgba(255,255,255,0.03)' }}>
                                    <span style={{ fontSize: '0.55rem', fontWeight: 800, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.2)' }}>Hash</span>
                                    <code style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.3)', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontFamily: 'monospace' }}>
                                        {showPass[u.id] ? u.passwordHash : '••••••••••••••••••••••••••••••••••••••••••••••'}
                                    </code>
                                    <button onClick={() => setShowPass(p => ({...p,[u.id]:!p[u.id]}))} style={{ ...S.btn, padding: '0.3rem 0.6rem', fontSize: '0.6rem', opacity: 0.5 }}>
                                        {showPass[u.id] ? 'Hide' : 'Show'}
                                    </button>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
