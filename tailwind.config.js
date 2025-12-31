/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            fontFamily: {
                heading: ['Cinzel', 'serif'],
                subheading: ['Playfair Display', 'serif'],
                body: ['Quicksand', 'sans-serif'],
                mono: ['Cutive Mono', 'monospace'],
            },
            colors: {
                gold: '#cfb53b',
                'gold-glow': '#aa8e1b',
                snow: '#f0f4f8',
            },
            animation: {
                'fade-in': 'fadeIn 1s ease-out',
                'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
            },
            keyframes: {
                fadeIn: {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                }
            }
        },
    },
    plugins: [],
}
