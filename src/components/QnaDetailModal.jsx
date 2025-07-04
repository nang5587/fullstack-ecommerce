// src/components/QnaDetailModal.js

import React from 'react';
import { motion } from 'framer-motion';
import { X, Trash2 } from 'lucide-react';

export default function QnaDetailModal({ qna, onClose, onDelete }) {
    if (!qna) return null;

    return (
        <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
        >
            <motion.div
                className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl p-8 relative flex flex-col"
                style={{ maxHeight: '85vh' }}
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 50, opacity: 0 }}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                onClick={e => e.stopPropagation()}
            >
                <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-black">
                    <X size={28} />
                </button>

                <h2 className="text-2xl font-bold mb-6 text-center text-gray-800"></h2>

                {/* 상품 정보 */}
                <div className="flex items-center gap-4 p-4 bg-gray-100 rounded-lg mb-6 flex-shrink-0">
                    {/* <img src={qna.productImageUrl} alt={qna.productName} className="w-16 h-16 rounded-md object-cover" /> */}
                    <div>
                        <p className="text-sm text-gray-500">문의 상품</p>
                        <h3 className="font-semibold text-gray-800">{qna.productName}</h3>
                    </div>
                </div>

                {/* 질문 & 답변 내용 */}
                <div className="flex-grow overflow-y-auto space-y-6 pr-2 scrollbar-hide">
                    {/* 질문 섹션 */}
                    <div>
                        <div className="flex items-baseline gap-2">
                            <span className="text-2xl font-bold text-[#806050]">Q.</span>
                            <p className="text-sm text-gray-500">작성일 {new Date(qna.createdAt).toLocaleDateString()}</p>
                        </div>
                        <p className="mt-2 pl-8 text-gray-700 whitespace-pre-wrap leading-relaxed">{qna.question}</p>
                    </div>

                    {/* 답변 섹션 */}
                    {qna.answer ? (
                        <div className="bg-cyan-50/70 p-4 rounded-lg">
                            <div className="flex items-baseline gap-2">
                                <span className="text-2xl font-bold text-black">A.</span>
                                <p className="text-sm text-gray-500">
                                    답변일 {new Date(qna.answeredAt).toLocaleDateString()} ({qna.answerUsername})
                                </p>
                            </div>
                            <p className="mt-2 pl-8 text-gray-800 whitespace-pre-wrap leading-relaxed">{qna.answer}</p>
                        </div>
                    ) : (
                        <div className="text-center py-8 text-gray-400">아직 답변이 등록되지 않았습니다.</div>
                    )}
                </div>

                {/* 수정/삭제 버튼 (내 질문일 경우에만 보이도록) */}
                <button
                        onClick={() => onDelete(qna.qaid)} // 클릭 시 onDelete 함수 호출
                        className="px-4 py-2 text-sm font-semibold text-red-600 bg-red-100 hover:bg-red-200 rounded-lg transition-colors"
                    >
                        삭제하기
                    </button>
            </motion.div>
        </motion.div>
    );
}