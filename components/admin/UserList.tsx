'use client';

interface UserRow {
    id: number;
    name: string;
    email: string;
    role: string;
    createdAt: string;
}

interface UserListProps {
    users: UserRow[];
    loading: boolean;
    onDelete: (id: number) => void;
}

const cardStyle = { background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '1rem', padding: '1rem 1.5rem' };
const dangerBtnStyle = { padding: '0.6rem 1.25rem', background: 'rgba(255,60,60,0.08)', border: '1px solid rgba(255,60,60,0.2)', borderRadius: '0.6rem', color: 'rgba(255,100,100,0.8)', fontSize: '0.65rem', fontWeight: 600 as const, letterSpacing: '0.15em', textTransform: 'uppercase' as const, cursor: 'pointer', fontFamily: 'inherit' };

export default function UserList({ users, loading, onDelete }: UserListProps) {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {loading ? (
                <div style={{ ...cardStyle, textAlign: 'center', padding: '2rem', color: 'rgba(255,255,255,0.3)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Loading...</div>
            ) : users.length === 0 ? (
                <div style={{ ...cardStyle, textAlign: 'center', padding: '3rem', color: 'rgba(255,255,255,0.25)', fontSize: '0.8rem', letterSpacing: '0.1em', textTransform: 'uppercase' }}>No users registered yet</div>
            ) : users.map(u => (
                <div key={u.id} style={{ ...cardStyle, display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'linear-gradient(135deg, rgba(255,255,255,0.08), rgba(255,255,255,0.02))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem', color: 'rgba(255,255,255,0.5)', flexShrink: 0 }}>
                        {u.name?.[0]?.toUpperCase()}
                    </div>
                    <div style={{ flex: 1 }}>
                        <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#fff' }}>{u.name}</div>
                        <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.35)', marginTop: '0.1rem' }}>{u.email}</div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <span style={{ fontSize: '0.6rem', letterSpacing: '0.15em', textTransform: 'uppercase', padding: '0.25rem 0.7rem', borderRadius: '2rem', background: u.role === 'admin' ? 'rgba(255,200,50,0.1)' : 'rgba(255,255,255,0.05)', color: u.role === 'admin' ? 'rgba(255,200,50,0.8)' : 'rgba(255,255,255,0.35)', border: `1px solid ${u.role === 'admin' ? 'rgba(255,200,50,0.2)' : 'rgba(255,255,255,0.06)'}` }}>
                            {u.role}
                        </span>
                        <span style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.2)' }}>
                            {new Date(u.createdAt).toLocaleDateString()}
                        </span>
                        <button onClick={() => onDelete(u.id)} style={dangerBtnStyle}>Delete</button>
                    </div>
                </div>
            ))}
        </div>
    );
}
