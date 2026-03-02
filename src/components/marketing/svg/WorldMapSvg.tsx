"use client";

import { motion, useReducedMotion, Variants } from 'framer-motion';

// Equirectangular viewBox (2:1 aspect to match world map)
const VIEWBOX_WIDTH = 800;
const VIEWBOX_HEIGHT = 400;

// Calibration: map lat/lon % into visible map rectangle (if SVG has internal padding/mask).
// Full globe = 0, 100, 0, 100.
const MAP_LEFT = 0;
const MAP_RIGHT = 100;
const MAP_TOP = 0;
const MAP_BOTTOM = 100;

/** Convert lat/lon to percentage (equirectangular). */
function latLonToPct(lat: number, lon: number): { xPct: number; yPct: number } {
    const xPct = ((lon + 180) / 360) * 100;
    const yPct = ((90 - lat) / 180) * 100;
    return { xPct, yPct };
}

/** Map percentage into calibration bounds, then to viewBox coordinates. */
function pctToViewBox(xPct: number, yPct: number): { x: number; y: number } {
    const spanX = MAP_RIGHT - MAP_LEFT;
    const spanY = MAP_BOTTOM - MAP_TOP;
    const x = ((xPct - MAP_LEFT) / spanX) * VIEWBOX_WIDTH;
    const y = ((yPct - MAP_TOP) / spanY) * VIEWBOX_HEIGHT;
    return { x, y };
}

function latLonToViewBox(lat: number, lon: number): { x: number; y: number } {
    const { xPct, yPct } = latLonToPct(lat, lon);
    return pctToViewBox(xPct, yPct);
}

// Hub: Canada (Vancouver)
const HUB = { lat: 49.2827, lon: -123.1207, name: 'Vancouver' };

// Destinations: major cities (lat, lon)
const DESTINATIONS: { lat: number; lon: number; name: string }[] = [
    { lat: 40.7128, lon: -74.006, name: 'New York' },
    { lat: 34.0522, lon: -118.2437, name: 'Los Angeles' },
    { lat: 51.5074, lon: -0.1278, name: 'London' },
    { lat: 50.1109, lon: 8.6821, name: 'Frankfurt' },
    { lat: 48.8566, lon: 2.3522, name: 'Paris' },
    { lat: 25.2048, lon: 55.2708, name: 'Dubai' },
    { lat: 1.3521, lon: 103.8198, name: 'Singapore' },
    { lat: 35.6762, lon: 139.6503, name: 'Tokyo' },
    { lat: 6.5244, lon: 3.3792, name: 'Lagos' },
    { lat: -1.2921, lon: 36.8219, name: 'Nairobi' },
    { lat: -26.2041, lon: 28.0473, name: 'Johannesburg' },
    { lat: -33.8688, lon: 151.2093, name: 'Sydney' },
];

export default function WorldMapSvg() {
    const shouldReduceMotion = useReducedMotion();

    const hubCoord = latLonToViewBox(HUB.lat, HUB.lon);
    const destCoords = DESTINATIONS.map((d) => ({
        ...latLonToViewBox(d.lat, d.lon),
        name: d.name,
    }));

    // Curved paths from hub to each destination (control point offset for arc)
    const paths = destCoords.map((dest) => {
        const midX = (hubCoord.x + dest.x) / 2;
        const midY = (hubCoord.y + dest.y) / 2;
        const curveOffset = dest.x > hubCoord.x ? -40 : 40;
        return `M${hubCoord.x},${hubCoord.y} Q${midX},${midY + curveOffset} ${dest.x},${dest.y}`;
    });

    const pathVariants: Variants = {
        hidden: { pathLength: 0, opacity: 0 },
        visible: (i: number) => ({
            pathLength: 1,
            opacity: 0.6,
            transition: {
                pathLength: { delay: i * 0.1, duration: 1.2, ease: [0.43, 0.13, 0.23, 0.96] },
                opacity: { delay: i * 0.1, duration: 0.5 },
            },
        }),
    };

    const pulseVariants: Variants = {
        animate: (i: number) => ({
            r: [4, 12],
            opacity: [0.8, 0],
            transition: {
                duration: 2,
                repeat: Infinity,
                ease: 'easeOut' as const,
                delay: i * 0.1 + 1.2,
            },
        }),
    };

    const viewBox = `0 0 ${VIEWBOX_WIDTH} ${VIEWBOX_HEIGHT}`;

    if (shouldReduceMotion) {
        return (
            <svg
                className="w-full h-full absolute inset-0 text-gray-300"
                viewBox={viewBox}
                preserveAspectRatio="xMidYMid meet"
                aria-hidden
            >
                {paths.map((d, i) => (
                    <path
                        key={`static-path-${i}`}
                        d={d}
                        stroke="#135bec"
                        strokeWidth="1.5"
                        strokeDasharray="4 4"
                        fill="none"
                        opacity="0.4"
                        strokeLinecap="round"
                    />
                ))}
                <circle cx={hubCoord.x} cy={hubCoord.y} r="6" fill="#135bec" data-testid="node-canada" />
                {destCoords.map((n, i) => (
                    <circle key={`static-node-${i}`} cx={n.x} cy={n.y} r="3" fill="#135bec" opacity="0.8" />
                ))}
            </svg>
        );
    }

    return (
        <motion.svg
            className="w-full h-full absolute inset-0 text-gray-300 pointer-events-none"
            viewBox={viewBox}
            preserveAspectRatio="xMidYMid meet"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            aria-hidden
        >
            {paths.map((d, i) => (
                <motion.path
                    key={`path-${i}`}
                    d={d}
                    custom={i}
                    variants={pathVariants}
                    stroke="#135bec"
                    strokeWidth="1.5"
                    strokeDasharray="4 4"
                    fill="none"
                    strokeLinecap="round"
                    style={{ willChange: 'transform, opacity' }}
                />
            ))}

            <circle cx={hubCoord.x} cy={hubCoord.y} r="6" fill="#135bec" data-testid="node-canada" />
            <circle cx={hubCoord.x} cy={hubCoord.y} r="14" fill="#135bec" opacity="0.2" />

            {destCoords.map((n, i) => (
                <g key={`node-group-${i}`}>
                    <circle cx={n.x} cy={n.y} r="3" fill="#135bec" opacity="0.8" />
                    <motion.circle
                        cx={n.x}
                        cy={n.y}
                        r="4"
                        custom={i}
                        variants={pulseVariants}
                        animate="animate"
                        stroke="#135bec"
                        strokeWidth="1"
                        fill="none"
                        style={{ willChange: 'transform, opacity' }}
                    />
                </g>
            ))}
        </motion.svg>
    );
}
