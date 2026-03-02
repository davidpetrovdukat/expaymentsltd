"use client";

import { motion, useReducedMotion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';

export default function DataFlowSvg() {
    const shouldReduceMotion = useReducedMotion();
    const [isVisible, setIsVisible] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (shouldReduceMotion) return;

        // Intersection observer to pause animations when out of view
        const observer = new IntersectionObserver(
            (entries) => {
                setIsVisible(entries[0].isIntersecting);
            },
            { threshold: 0.1 }
        );

        if (containerRef.current) {
            observer.observe(containerRef.current);
        }

        return () => observer.disconnect();
    }, [shouldReduceMotion]);

    const BORDER_PATH = "M16,1 H584 Q599,1 599,16 V362 Q599,377 584,377 H16 Q1,377 1,362 V16 Q1,1 16,1 Z";

    if (shouldReduceMotion) {
        return (
            <div className="absolute inset-[-1px] pointer-events-none" aria-hidden="true">
                <svg className="w-full h-full" viewBox="0 0 600 380" preserveAspectRatio="none">
                    <rect x="1" y="1" width="598" height="378" rx="16" ry="16" fill="none" stroke="#1e3a5f" strokeWidth="1.5" />
                </svg>
            </div>
        );
    }

    return (
        <motion.div
            ref={containerRef}
            className="absolute inset-[-1px] pointer-events-none"
            aria-hidden="true"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 1 }}
            viewport={{ once: true }}
        >
            <svg className="w-full h-full" viewBox="0 0 600 380" preserveAspectRatio="none">
                <defs>
                    <path id="border-path" d={BORDER_PATH} />
                    <filter id="glow-blue" x="-20%" y="-20%" width="140%" height="140%">
                        <feGaussianBlur stdDeviation="3" result="blur" />
                        <feMerge>
                            <feMergeNode in="blur" />
                            <feMergeNode in="SourceGraphic" />
                        </feMerge>
                    </filter>
                    <filter id="glow-purple" x="-20%" y="-20%" width="140%" height="140%">
                        <feGaussianBlur stdDeviation="3" result="blur" />
                        <feMerge>
                            <feMergeNode in="blur" />
                            <feMergeNode in="SourceGraphic" />
                        </feMerge>
                    </filter>
                </defs>

                {/* Static Border */}
                <rect x="1" y="1" width="598" height="378" rx="16" ry="16" fill="none" stroke="#1e3a5f" strokeWidth="1.5" />

                {/* Signal 1 (Blue) */}
                {isVisible && (
                    <circle r="3" fill="#135bec" filter="url(#glow-blue)" style={{ willChange: 'transform' }}>
                        <animateMotion dur="4s" repeatCount="indefinite" rotate="auto">
                            <mpath href="#border-path" />
                        </animateMotion>
                    </circle>
                )}

                {/* Signal 2 (Purple) */}
                {isVisible && (
                    <circle r="3" fill="#7c3aed" filter="url(#glow-purple)" style={{ willChange: 'transform' }}>
                        <animateMotion dur="4s" begin="-2s" repeatCount="indefinite" rotate="auto">
                            <mpath href="#border-path" />
                        </animateMotion>
                    </circle>
                )}
            </svg>
        </motion.div>
    );
}
