import { getIronSession, IronSession } from 'iron-session';
import { cookies } from 'next/headers';

export interface SessionData {
    id?: string | number;
    email?: string;
    name?: string;
    role?: string;
    isLoggedIn?: boolean;
}

const sessionOptions = {
    password: process.env.SESSION_SECRET || 'dananjaya-portfolio-admin-secret-key-2024-secure!!',
    cookieName: 'portfolio_session',
    cookieOptions: {
        secure: process.env.NODE_ENV === 'production',
        httpOnly: true,
        sameSite: 'lax' as const,
        maxAge: 60 * 60 * 24 * 7, // 7 days
    },
};

export async function getSession(): Promise<IronSession<SessionData>> {
    const cookieStore = await cookies();
    const session = await getIronSession<SessionData>(cookieStore, sessionOptions);
    return session;
}
