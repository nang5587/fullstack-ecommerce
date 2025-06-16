/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    safelist: [
        "scale-105",
        "scale-110",
        "scale-125",
        "scale-150",
    ],
    theme: {
        extend: {
            fontFamily: {
                'aggro': ['SBAggro', 'sans-serif'],
            },
            colors: {
                'naver': '#03C75A',
                'store': '#7346F3',
            },
            fontWeight: {
                'light': '300',
                'medium': '500',
                'bold': '700',
            },
        },
    },
    plugins: [],
}
