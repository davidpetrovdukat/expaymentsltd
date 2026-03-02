"use client";

import { motion } from 'framer-motion';
import { TrendingUp, CheckCircle } from 'lucide-react';

export function HeroDashboardMock() {
    return (
        <div className="relative w-full max-w-lg aspect-square lg:aspect-auto h-full min-h-[400px]">
            <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full glass-card rounded-2xl p-6 shadow-2xl transform transition-transform hover:scale-[1.02] duration-500"
            >
                <div className="flex justify-between items-center mb-6">
                    <div className="flex flex-col">
                        <span className="text-xs text-text-muted uppercase font-semibold">Total Revenue</span>
                        <span className="text-3xl font-bold text-text-main">$1,240,500.00</span>
                    </div>
                    <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                        <TrendingUp strokeWidth={3} className="w-3 h-3" /> +12.5%
                    </span>
                </div>
                <div className="h-32 flex items-end justify-between gap-2">
                    {[40, 60, 30, 80, 50, 90, 70].map((height, i) => (
                        <div
                            key={i}
                            className={`w-full rounded-t-sm relative group cursor-pointer ${i === 5 ? 'bg-primary' : 'bg-primary/20'
                                }`}
                            style={{ height: `${height}%` }}
                        >
                            {i === 5 && (
                                <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-text-main text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                                    $45k
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </motion.div>

            {/* Floating Badge 1 */}
            <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute top-10 -right-4 lg:-right-12 bg-white rounded-xl p-4 shadow-hover border border-gray-100 w-48 z-10"
            >
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                        <CheckCircle className="w-5 h-5" />
                    </div>
                    <div>
                        <p className="text-xs text-text-muted">Transaction Approved</p>
                        <p className="text-sm font-bold text-text-main">$4,250.00</p>
                    </div>
                </div>
            </motion.div>

            {/* Floating Badge 2 */}
            <motion.div
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
                className="absolute bottom-10 -left-4 lg:-left-12 bg-white rounded-xl p-4 shadow-hover border border-gray-100 w-56 z-10"
            >
                <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold text-text-muted">Active Countries</span>
                    <span className="text-gray-400 text-sm">🌍</span>
                </div>
                <div className="flex -space-x-2">
                    {['🇬🇧', '🇺🇸', '🇩🇪'].map((flag, i) => (
                        <div
                            key={i}
                            className="w-8 h-8 rounded-full bg-gray-100 border-2 border-white flex items-center justify-center text-sm overflow-hidden"
                        >
                            {flag}
                        </div>
                    ))}
                    <div className="w-8 h-8 rounded-full border-2 border-white flex items-center justify-center text-[10px] bg-primary text-white font-bold">
                        +12
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
