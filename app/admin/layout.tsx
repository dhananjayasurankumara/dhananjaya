import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Admin Panel | Dananjaya',
};

// This layout intentionally omits ClientWrapper (and therefore the Navbar)
// so the admin panel has its own isolated shell.
export default function AdminLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
