// src/components/QnaCard.js

import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const pastelColors = [
    'bg-rose-100/70',
    'bg-sky-100/70',
    'bg-teal-100/70',
    'bg-amber-100/70',
    'bg-violet-100/70',
    'bg-lime-100/70',
];

const getCategoryFromQuestion = (questionText) => {
    if (!questionText) return '기타';
    const q = questionText.toLowerCase();
    if (q.includes('사이즈') || q.includes('키') || q.includes('핏') || q.includes('크기')) return '사이즈/핏';
    if (q.includes('배송') || q.includes('언제') || q.includes('출고') || q.includes('도착')) return '배송';
    if (q.includes('재입고') || q.includes('품절')) return '재입고';
    return '상품정보';
};

export default function QnaCard({ qna, isHovered, onMouseEnter, onMouseLeave, onClick }) {
    const category = getCategoryFromQuestion(qna.question);
    const status = qna.answer ? '답변 완료' : '답변 대기';
    const statusColor = qna.answer ? 'bg-[#806050]' : 'bg-black';

    return (
        <motion.div
            layout
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
            onClick={onClick}
            className="relative rounded-3xl p-4 cursor-pointer aspect-square flex flex-col justify-between bg-white/60 backdrop-blur-md border border-white/30"
            whileHover={{ y: -5, transition: { type: 'spring', stiffness: 300 } }}
        >
            <div className={`absolute top-3 right-3 text-xs text-white px-2 py-1 rounded-full shadow-sm ${statusColor}`}>
                {status}
            </div>

            <div>
                <p className="font-semibold text-gray-800 line-clamp-1 text-xl" style={{ minHeight: '3rem' }}>
                    <span className="font-bold text-5xl">Q.</span> {qna.question}
                </p>
            </div>

            <div className="self-start">
                <span className="text-xs font-semibold text-black px-2 py-1">
                    #{category}
                </span>
            </div>
            
            <AnimatePresence>
                {isHovered && (
                    <motion.div
                        className="absolute bottom-0 left-0 right-0 bg-white/90 rounded-b-3xl p-4 pt-2 overflow-hidden"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: 'easeInOut' }}
                    >
                        <p className="text-sm text-gray-700 line-clamp-3 leading-snug">
                            <span className="font-bold text-black">A .</span> {qna.answer || '답변을 기다리고 있습니다.'}
                        </p>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
}