"use client";

import dynamic from 'next/dynamic';

export const HeroNetworkSvgDynamic = dynamic(
    () => import('@/components/marketing/svg/HeroNetworkSvg'),
    { ssr: false }
);
