/**
 * World map points for "Global Coverage with No Borders".
 * Optional xPct/yPct (0..1) override lat/lon projection when set.
 */

export type MapPoint = {
    lat: number;
    lon: number;
    name: string;
    /** Optional: manual position 0..1 of viewBox width (overrides lat/lon when set). */
    xPct?: number;
    /** Optional: manual position 0..1 of viewBox height (overrides lat/lon when set). */
    yPct?: number;
};

export const HUB: MapPoint = {
    lat: 49.2827,
    lon: -120.1207,
    name: 'Vancouver',
};

export const DESTINATIONS: MapPoint[] = [
    { lat: 36.651070, lon: -85.347015, name: 'New York' },
    { lat: 34.0522, lon: -118.2437, name: 'Los Angeles' },
    { lat: 55.5074, lon: -10.1278, name: 'London' },
    { lat: 50.1109, lon: -5.6821, name: 'Frankfurt' },
    { lat: 48.8566, lon: 0.3522, name: 'Paris' },
    { lat: 27.2048, lon: 44.2708, name: 'Dubai' },
    { lat: 1.3521, lon: 90.8198, name: 'Singapore' },
    { lat: 38.6762, lon: 117.6503, name: 'Tokyo' },
    { lat: 6.5244, lon: 3.3792, name: 'Lagos' },
    { lat: -1.2921, lon: 30.8219, name: 'Nairobi' },
    { lat: -33.2041, lon: 17.0473, name: 'Johannesburg' },
    { lat: -33.8688, lon: 135.2093, name: 'Sydney' },
];
