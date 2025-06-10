// tailwind.config.js (v4 환경의 올바른 설정)

/** @type {import('tailwindcss').Config} */
export default {
    // content 경로는 그대로 유지합니다.
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    // theme.extend를 사용하여 커스텀 값을 추가합니다.
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