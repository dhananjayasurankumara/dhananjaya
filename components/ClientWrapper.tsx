'use client';

import { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import LoadingScreen from './LoadingScreen';
import SmoothScrollProvider from '@/lib/lenis-provider';
import Navbar from './Navbar';
import CustomCursor from './CustomCursor';

export default function ClientWrapper({
    children,
    settings
}: {
    children: React.ReactNode;
    settings?: any;
}) {
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Disable scroll during loading
        if (isLoading) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
            // Global refresh after layout settles
            const timer = setTimeout(() => {
                gsap.registerPlugin(ScrollTrigger);
                ScrollTrigger.refresh();
            }, 600);
            return () => clearTimeout(timer);
        }
    }, [isLoading]);

    return (
        <>
            <AnimatePresence mode="wait">
                {isLoading && (
                    <LoadingScreen key="loader" onComplete={() => setIsLoading(false)} />
                )}
            </AnimatePresence>

            {!isLoading && (
                <>
                    <div className="noise-overlay" />
                    <CustomCursor />
                    <Navbar data={settings} />
                    <SmoothScrollProvider>
                        <main>{children}</main>
                    </SmoothScrollProvider>
                </>
            )}
        </>
    );
}
