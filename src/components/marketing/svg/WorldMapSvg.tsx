"use client";

import { motion, useReducedMotion, Variants } from 'framer-motion';
import { useSearchParams } from 'next/navigation';
import { useCallback, useState } from 'react';
import type { MapPoint } from './worldMapPoints';
import { HUB, DESTINATIONS } from './worldMapPoints';

// Match public/world-map.svg intrinsic dimensions (no viewBox in file)
const MAP_W = 2754;
const MAP_H = 1398;

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

/** Map percentage into calibration bounds, then to viewBox coordinates (2754×1398). */
function pctToViewBox(xPct: number, yPct: number): { x: number; y: number } {
    const spanX = MAP_RIGHT - MAP_LEFT;
    const spanY = MAP_BOTTOM - MAP_TOP;
    const x = ((xPct - MAP_LEFT) / spanX) * MAP_W;
    const y = ((yPct - MAP_TOP) / spanY) * MAP_H;
    return { x, y };
}

function latLonToViewBox(lat: number, lon: number): { x: number; y: number } {
    const { xPct, yPct } = latLonToPct(lat, lon);
    return pctToViewBox(xPct, yPct);
}

/** Resolve point to viewBox coords: use xPct/yPct when set, else lat/lon projection. */
function pointToViewBox(p: MapPoint): { x: number; y: number } {
    if (p.xPct != null && p.yPct != null) {
        return { x: p.xPct * MAP_W, y: p.yPct * MAP_H };
    }
    return latLonToViewBox(p.lat, p.lon);
}

export default function WorldMapSvg() {
    const shouldReduceMotion = useReducedMotion();
    const searchParams = useSearchParams();
    const mapDebug =
        process.env.NODE_ENV !== 'production' && searchParams.get('mapDebug') === '1';
    const [lastClick, setLastClick] = useState<{ x: number; y: number } | null>(null);

    const hubCoord = pointToViewBox(HUB);
    const destCoords = DESTINATIONS.map((d) => ({
        ...pointToViewBox(d),
        name: d.name,
    }));

    const handleSvgClick = useCallback(
        (e: React.MouseEvent<SVGSVGElement>) => {
            if (!mapDebug) return;
            const svg = e.currentTarget;
            const rect = svg.getBoundingClientRect();
            const xPixel = e.clientX - rect.left;
            const yPixel = e.clientY - rect.top;
            const xPct = rect.width > 0 ? xPixel / rect.width : 0;
            const yPct = rect.height > 0 ? yPixel / rect.height : 0;
            const viewBoxX = xPct * MAP_W;
            const viewBoxY = yPct * MAP_H;
            console.log({ xPct, yPct });
            setLastClick({ x: viewBoxX, y: viewBoxY });
        },
        [mapDebug]
    );

    // Curved paths from hub to each destination (control point offset for arc)
    const curveOffset = 140;
    const paths = destCoords.map((dest) => {
        const midX = (hubCoord.x + dest.x) / 2;
        const midY = (hubCoord.y + dest.y) / 2;
        const offset = dest.x > hubCoord.x ? -curveOffset : curveOffset;
        return `M${hubCoord.x},${hubCoord.y} Q${midX},${midY + offset} ${dest.x},${dest.y}`;
    });

    // Scaled radii/stroke for 2754×1398 viewBox (≈3.44× from 800×400)
    const rHub = 21;
    const rHubOuter = 48;
    const rDest = 10;
    const rPulse = 14;
    const strokeW = 5;
    const strokePulse = 4;

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
            r: [rPulse, rPulse * 3],
            opacity: [0.8, 0],
            transition: {
                duration: 2,
                repeat: Infinity,
                ease: 'easeOut' as const,
                delay: i * 0.1 + 1.2,
            },
        }),
    };

    const viewBox = `0 0 ${MAP_W} ${MAP_H}`;

    /* Single map render path: only place world-map.svg is used (no CSS background elsewhere). */
    const mapImage = (
        <image
            href="/world-map.svg"
            x={0}
            y={0}
            width={MAP_W}
            height={MAP_H}
            preserveAspectRatio="xMidYMid meet"
            opacity="0.30"
        />
    );

    const svgPointerClass = mapDebug ? 'pointer-events-auto' : 'pointer-events-none';
    const crosshairSize = 24;

    if (shouldReduceMotion) {
        return (
            <svg
                className={`w-full h-full absolute inset-0 text-gray-300 ${svgPointerClass}`}
                viewBox={viewBox}
                preserveAspectRatio="xMidYMid meet"
                aria-hidden
                {...(mapDebug && { onClick: handleSvgClick })}
            >
                {mapImage}
                {paths.map((d, i) => (
                    <path
                        key={`static-path-${i}`}
                        d={d}
                        stroke="#135bec"
                        strokeWidth={strokeW}
                        strokeDasharray="14 14"
                        fill="none"
                        opacity="0.4"
                        strokeLinecap="round"
                    />
                ))}
                <circle cx={hubCoord.x} cy={hubCoord.y} r={rHub} fill="#135bec" data-testid="node-canada" />
                {destCoords.map((n, i) => (
                    <circle key={`static-node-${i}`} cx={n.x} cy={n.y} r={rDest} fill="#135bec" opacity="0.8" />
                ))}
                {mapDebug && lastClick && (
                    <g data-testid="map-debug-crosshair">
                        <circle cx={lastClick.x} cy={lastClick.y} r={8} fill="none" stroke="red" strokeWidth={2} />
                        <line x1={lastClick.x - crosshairSize} y1={lastClick.y} x2={lastClick.x + crosshairSize} y2={lastClick.y} stroke="red" strokeWidth={1} />
                        <line x1={lastClick.x} y1={lastClick.y - crosshairSize} x2={lastClick.x} y2={lastClick.y + crosshairSize} stroke="red" strokeWidth={1} />
                    </g>
                )}
            </svg>
        );
    }

    return (
        <motion.svg
            className={`w-full h-full absolute inset-0 text-gray-300 ${svgPointerClass}`}
            viewBox={viewBox}
            preserveAspectRatio="xMidYMid meet"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            aria-hidden
            {...(mapDebug && { onClick: handleSvgClick })}
        >
            {mapImage}
            {paths.map((d, i) => (
                <motion.path
                    key={`path-${i}`}
                    d={d}
                    custom={i}
                    variants={pathVariants}
                    stroke="#135bec"
                    strokeWidth={strokeW}
                    strokeDasharray="14 14"
                    fill="none"
                    strokeLinecap="round"
                    style={{ willChange: 'transform, opacity' }}
                />
            ))}

            <circle cx={hubCoord.x} cy={hubCoord.y} r={rHub} fill="#135bec" data-testid="node-canada" />
            <circle cx={hubCoord.x} cy={hubCoord.y} r={rHubOuter} fill="#135bec" opacity="0.2" />

            {destCoords.map((n, i) => (
                <g key={`node-group-${i}`}>
                    <circle cx={n.x} cy={n.y} r={rDest} fill="#135bec" opacity="0.8" />
                    <motion.circle
                        cx={n.x}
                        cy={n.y}
                        r={rPulse}
                        custom={i}
                        variants={pulseVariants}
                        animate="animate"
                        stroke="#135bec"
                        strokeWidth={strokePulse}
                        fill="none"
                        style={{ willChange: 'transform, opacity' }}
                    />
                </g>
            ))}
            {mapDebug && lastClick && (
                <g data-testid="map-debug-crosshair">
                    <circle cx={lastClick.x} cy={lastClick.y} r={8} fill="none" stroke="red" strokeWidth={2} />
                    <line x1={lastClick.x - crosshairSize} y1={lastClick.y} x2={lastClick.x + crosshairSize} y2={lastClick.y} stroke="red" strokeWidth={1} />
                    <line x1={lastClick.x} y1={lastClick.y - crosshairSize} x2={lastClick.x} y2={lastClick.y + crosshairSize} stroke="red" strokeWidth={1} />
                </g>
            )}
        </motion.svg>
    );
}
