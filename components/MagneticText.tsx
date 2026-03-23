'use client';

import { useRef, useEffect } from 'react';
import gsap from 'gsap';

interface MagneticTextProps {
    children: string;
    className?: string;
    style?: React.CSSProperties;
}

export default function MagneticText({ children, className, style }: MagneticTextProps) {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            const container = containerRef.current;
            if (!container) return;

            const chars = container.querySelectorAll('.mag-char');

            const onMouseMove = (e: MouseEvent) => {
                const { clientX, clientY } = e;

                chars.forEach((char: any) => {
                    const rect = char.getBoundingClientRect();
                    const charX = rect.left + rect.width / 2;
                    const charY = rect.top + rect.height / 2;

                    const distX = clientX - charX;
                    const distY = clientY - charY;
                    const distance = Math.sqrt(distX * distX + distY * distY);

                    if (distance < 100) {
                        const power = (100 - distance) / 100;
                        gsap.to(char, {
                            x: -distX * 0.2 * power,
                            y: -distY * 0.2 * power,
                            duration: 0.4,
                            ease: 'power2.out',
                        });
                    } else {
                        gsap.to(char, {
                            x: 0,
                            y: 0,
                            duration: 0.6,
                            ease: 'elastic.out(1, 0.3)',
                        });
                    }
                });
            };

            window.addEventListener('mousemove', onMouseMove);
            return () => {
                window.removeEventListener('mousemove', onMouseMove);
                gsap.killTweensOf(chars);
            };
        });

        return () => ctx.revert();
    }, []);

    return (
        <div ref={containerRef} className={className} style={{ ...style, display: 'inline-block' }}>
            {children.split('').map((char, i) => (
                <span
                    key={i}
                    className="mag-char"
                    style={{ display: 'inline-block', whiteSpace: char === ' ' ? 'pre' : 'normal' }}
                >
                    {char}
                </span>
            ))}
        </div>
    );
}
