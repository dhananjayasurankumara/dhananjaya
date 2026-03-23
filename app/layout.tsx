import type { Metadata } from 'next';
import './globals.css';

import ClientWrapper from '@/components/ClientWrapper';
import { db } from '@/lib/db';
import { siteSettings } from '@/lib/db/schema';

export const metadata: Metadata = {
    title: 'Dananjaya Suran Kumara | Graphic Designer / Creative Developer',
    description: 'Ultra dark cinematic digital presence. Premium visual stories + Aesthetic precision.',
};

import StyledJsxRegistry from '@/lib/registry';

export default async function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    let settingsData;
    try {
        settingsData = await db.select().from(siteSettings).limit(1).then(r => r[0]);
    } catch (error) {
        console.warn("DB settings fetch failed:", error);
    }

    return (
        <html lang="en" suppressHydrationWarning>
            <body>
                <StyledJsxRegistry>
                    <ClientWrapper settings={settingsData}>
                        {children}
                    </ClientWrapper>
                </StyledJsxRegistry>
            </body>
        </html>
    );
}
