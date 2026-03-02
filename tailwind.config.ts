import type { Config } from 'tailwindcss'

const config: Config = {
    darkMode: 'class',
    content: [
        './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
        './src/components/**/*.{js,ts,jsx,tsx,mdx}',
        './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    theme: {
        extend: {
            colors: {
                // --- Primary Brand Color (extracted from homepage.html) ---
                primary: '#135bec',

                // --- Background Scale ---
                background: {
                    light: '#ffffff',
                    subtle: '#f6f9fc',
                    dark: '#101622',
                },

                // --- Text Scale ---
                text: {
                    main: '#0a2540',
                    muted: '#425466',
                },

                // --- Semantic Feedback Colors (from PROJECT.md ADRs) ---
                success: '#10b981',
                warning: '#f59e0b',
                error: '#ef4444',
            },

            fontFamily: {
                display: ['Inter', 'sans-serif'],
                sans: ['Inter', 'sans-serif'],
            },

            boxShadow: {
                soft: '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)',
                hover: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
                glow: '0 0 15px rgba(19, 91, 236, 0.3)',
            },

            borderRadius: {
                // Shadcn base + design-specific overrides
                sm: '4px',
                md: '8px',
                lg: '12px',  // inputs (per PROJECT.md ADR)
                xl: '12px',
                '2xl': '16px', // cards (per PROJECT.md ADR)
                '3xl': '24px', // large feature cards
                full: '9999px',
            },

            // Max width for content areas - mirrors the raw HTML's max-w-7xl
            maxWidth: {
                content: '80rem', // 1280px = max-w-7xl
            },
        },
    },
    plugins: [],
}

export default config
