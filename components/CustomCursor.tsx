'use client';

import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

export default function CustomCursor() {
    const cursorRef = useRef<HTMLDivElement>(null);
    const followerRef = useRef<HTMLDivElement>(null);
    const [isTouch, setIsTouch] = useState(false);

    useEffect(() => {
        // Detect touch device — hide cursor on mobile/tablet
        const hasTouch = () =>
            'ontouchstart' in window ||
            navigator.maxTouchPoints > 0 ||
            window.matchMedia('(pointer: coarse)').matches;

        setIsTouch(hasTouch());

        // Also listen in case pointer type changes (e.g., hybrid devices)
        const mq = window.matchMedia('(pointer: coarse)');
        const onMqChange = (e: MediaQueryListEvent) => setIsTouch(e.matches);
        mq.addEventListener('change', onMqChange);

        return () => mq.removeEventListener('change', onMqChange);
    }, []);

    useEffect(() => {
        if (isTouch) return;

        const cursor = cursorRef.current;
        const follower = followerRef.current;
        if (!cursor || !follower) return;

        const onMouseMove = (e: MouseEvent) => {
            gsap.to(cursor, { x: e.clientX, y: e.clientY, duration: 0.1 });
            gsap.to(follower, { x: e.clientX, y: e.clientY, duration: 0.3 });
        };

        window.addEventListener('mousemove', onMouseMove);
        return () => {
            window.removeEventListener('mousemove', onMouseMove);
            gsap.killTweensOf([cursor, follower]);
        };
    }, [isTouch]);

    // On touch device: render nothing, and restore native cursor
    if (isTouch) return null;

    return (
        <>
            <div
                ref={cursorRef}
                style={{
                    position: 'fixed', top: 0, left: 0,
                    width: '8px', height: '8px',
                    backgroundColor: 'var(--highlight)',
                    borderRadius: '50%', pointerEvents: 'none',
                    zIndex: 9999, transform: 'translate(-50%, -50%)',
                    boxShadow: '0 0 10px var(--highlight)',
                }}
            />
            <div
                ref={followerRef}
                style={{
                    position: 'fixed', top: 0, left: 0,
                    width: '40px', height: '40px',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    borderRadius: '50%', pointerEvents: 'none',
                    zIndex: 9998, transform: 'translate(-50%, -50%)',
                    transition: 'width 0.3s, height 0.3s, background 0.3s',
                }}
            />
        </>
    );
}
