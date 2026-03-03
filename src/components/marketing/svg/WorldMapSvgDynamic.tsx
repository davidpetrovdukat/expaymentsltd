"use client";

import dynamic from 'next/dynamic';

/** Single map instance: loads WorldMapSvg on client only. No loading fallback that could show a second map. */
export const WorldMapSvgDynamic = dynamic(
    () => import('@/components/marketing/svg/WorldMapSvg'),
    { ssr: false }
);
