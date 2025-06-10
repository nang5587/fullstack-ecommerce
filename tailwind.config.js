// tailwind.config.js

const defaultTheme = require('tailwindcss/defaultTheme');

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    // extend가 아닌 theme 바로 아래에 fontFamily를 설정합니다.
    fontFamily: {
      // 'sans' 기본 폰트 그룹을 네이버 스타일로 덮어쓰고,
      // 뒤에 Tailwind의 기본 sans-serif 폴백을 추가해 안정성을 높입니다.
      'sans': [
        '-apple-system', 
        'BlinkMacSystemFont', 
        '"Apple SD Gothic Neo"', 
        '"Malgun Gothic"', 
        '"맑은 고딕"', 
        'helvetica', 
        '"AppleGothic"', 
        'sans-serif',
        ...defaultTheme.fontFamily.sans, // Tailwind 기본 폴백 추가
      ],
      // 다른 폰트 그룹(serif, mono)은 그대로 유지하거나 추가할 수 있습니다.
      // 'serif': [...],
    },
    extend: {
      // 다른 extend 설정들은 여기에 유지
    },
  },
  plugins: [],
}