// src/pages/SignUpSuccess.js

import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

// 애니메이션 Variants 정의
const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.2, // 자식 요소들을 0.2초 간격으로 애니메이션
            delayChildren: 0.3,   // 0.3초 후에 자식 애니메이션 시작
        },
    },
};

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.5,
            ease: 'easeOut',
        },
    },
};

const checkVariants = {
    hidden: { pathLength: 0 },
    visible: {
        pathLength: 1,
        transition: {
            duration: 0.5,
            ease: 'easeInOut',
        },
    },
};

export default function SignUpSuccess() {
    return (
        // --- 1. 배경 레이어 ---
        <div className="relative flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-orange-50 via-rose-50 to-amber-50 overflow-hidden">
            {/* 야자수 잎 그림자 (장식 요소) */}
            <img
                src="/palm-leaf.png" // public 폴더에 이미지 필요
                alt="Palm leaf shadow"
                className="absolute -top-20 -left-40 w-[600px] h-auto opacity-10 mix-blend-multiply rotate-[50deg] pointer-events-none"
            />
            <img
                src="/palm-leaf.png"
                alt="Palm leaf shadow"
                className="absolute -bottom-40 -right-40 w-[600px] h-auto opacity-10 mix-blend-multiply -rotate-[120deg] scale-x-[-1] pointer-events-none"
            />

            {/* --- 2. 애니메이션 컨테이너 카드 --- */}
            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="relative bg-white/70 backdrop-blur-xl p-10 md:p-12 rounded-3xl shadow-2xl text-center w-full max-w-md border border-white/50"
            >
                {/* 3. 체크마크 아이콘 애니메이션 */}
                <motion.div
                    variants={itemVariants}
                    className="mx-auto w-20 h-20 mb-6 bg-kalani-gold rounded-full flex items-center justify-center"
                >
                    <svg className="w-12 h-12" viewBox="0 0 24 24">
                        <motion.path
                            d="M5 13l4 4L19 7"
                            fill="transparent"
                            strokeWidth="3"
                            stroke="white"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            variants={checkVariants}
                        />
                    </svg>
                </motion.div>

                {/* 4. 텍스트 애니메이션 */}
                <motion.h1
                    variants={itemVariants}
                    className="text-3xl font-bold text-kalani-navy mb-3"
                >
                    환영합니다!
                </motion.h1>

                <motion.p
                    variants={itemVariants}
                    className="text-gray-600 mb-8"
                >
                    회원가입이 성공적으로 완료되었습니다.
                </motion.p>

                {/* 5. 버튼 애니메이션 */}
                <motion.div variants={itemVariants}>
                    <Link
                        to="/login"
                        className="w-full inline-block bg-kalani-navy text-white font-bold py-3 px-8 rounded-xl shadow-lg hover:bg-kalani-navy/90 focus:outline-none focus:ring-2 focus:ring-kalani-gold focus:ring-offset-2 transition-all duration-300 transform hover:scale-105"
                    >
                        로그인하러 가기
                    </Link>
                </motion.div>
            </motion.div>
        </div>
    );
}