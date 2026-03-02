"use client";

import dynamic from 'next/dynamic';

export const DataFlowSvgDynamic = dynamic(
    () => import('@/components/marketing/svg/DataFlowSvg'),
    { ssr: false }
);
