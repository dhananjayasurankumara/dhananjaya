import type { Metadata } from 'next';
import './globals.css';

import ClientWrapper from '@/components/ClientWrapper';
import { client } from '@/sanity/lib/client';
import { siteSettingsQuery } from '@/sanity/lib/queries';

export const metadata: Metadata = {
    title: 'Dananjaya Suran Kumara | Graphic Designer / Creative Developer',
    description: 'Ultra dark cinematic digital presence. Premium visual stories + Aesthetic precision.',
};

export default async function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    let settingsData;
    try {
        settingsData = await client.fetch(siteSettingsQuery);
    } catch (error) {
        console.warn("Sanity settings fetch failed:", error);
    }

    return (
        <html lang="en" suppressHydrationWarning>
            <body>
                <ClientWrapper settings={settingsData}>
                    {children}
                </ClientWrapper>
            </body>
        </html>
    );
}
