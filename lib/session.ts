import { SessionOptions } from 'iron-session';

export interface SessionData {
    userId?: number;
    username?: string;
    isLoggedIn: boolean;
}

export const sessionOptions: SessionOptions = {
    password: process.env.SESSION_SECRET || 'complex-secret-key-min-32-chars-long!!',
    cookieName: 'portfolio-admin-session',
    cookieOptions: {
        secure: process.env.NODE_ENV === 'production',
        httpOnly: true,
        sameSite: 'lax',
        maxAge: 60 * 60 * 8, // 8 hours
    },
};
