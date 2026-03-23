'use client';

import { useState, useEffect, useLayoutEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import LoadingScreen from './LoadingScreen';
import SmoothScrollProvider from '@/lib/lenis-provider';
import Navbar from './Navbar';
import CustomCursor from './CustomCursor';
import ChatBot from './ChatBot';
import { usePathname } from 'next/navigation';

export default function ClientWrapper({
    children,
    settings
}: {
    children: React.ReactNode;
    settings?: any;
}) {
    const [isLoading, setIsLoading] = useState(true);
    const pathname = usePathname();
    const isAdmin = pathname?.startsWith('/admin');

    useEffect(() => {
        if (isAdmin) {
            document.body.classList.add('admin-mode');
        } else {
            document.body.classList.remove('admin-mode');
            // Apply theme color from settings
            if (settings?.themeColor) {
                document.documentElement.style.setProperty('--highlight', settings.themeColor);
            } else {
                document.documentElement.style.setProperty('--highlight', '#ff3333'); // Default
            }
        }
    }, [pathname, isAdmin, settings]);

    // Kill ALL ScrollTriggers before the new page's components mount.
    useLayoutEffect(() => {
        if (isAdmin) return; // Still want to follow hooks order, but skip logic if admin
        gsap.registerPlugin(ScrollTrigger);
        ScrollTrigger.getAll().forEach(st => st.kill(true));
        gsap.killTweensOf('*');
    }, [pathname, isAdmin]);

    useEffect(() => {
        if (isAdmin) return; 
        if (!isLoading) {
            document.body.style.overflow = 'unset';
            const timer = setTimeout(() => ScrollTrigger.refresh(), 300);
            return () => clearTimeout(timer);
        } else {
            document.body.style.overflow = 'hidden';
        }
    }, [isLoading, isAdmin]);

    // ── Skip ALL wrapper chrome for admin routes ──────────────────────────────
    if (isAdmin) {
        return <>{children}</>;
    }

    if (isLoading) {
        return <LoadingScreen onComplete={() => setIsLoading(false)} />;
    }

    return (
        <SmoothScrollProvider>
            <div className="noise-overlay" />
            <CustomCursor />
            <Navbar data={settings} />
            <main>
                {children}
            </main>
            <ChatBot />
        </SmoothScrollProvider>
    );
}
