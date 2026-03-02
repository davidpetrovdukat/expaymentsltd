"use client";

import dynamic from 'next/dynamic';

export const WorldMapSvgDynamic = dynamic(
    () => import('@/components/marketing/svg/WorldMapSvg'),
    { ssr: false }
);
