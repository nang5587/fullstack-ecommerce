// src/components/QnaWriteModal.js

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';

export default function QnaWriteModal({ onClose, onSubmit }) {
    const [questionText, setQuestionText] = useState('');
    
    const handleSubmit = (e) => {
        e.preventDefault();
        if (questionText.trim().length < 10) {
            alert('질문 내용을 10자 이상 입력해주세요.');
            return;
        }
        
        // 부모에게 전달할 데이터
        onSubmit({
            question: questionText,
        });
    };

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
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 50, opacity: 0 }}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                onClick={e => e.stopPropagation()}
            >
                <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-black">
                    <X size={28} />
                </button>
                <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">새 질문하기</h2>
                
                <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                    {/* 질문 입력 */}
                    <div>
                        <label className="font-semibold text-gray-700 mb-2 block">질문 내용을 입력하세요.</label>
                        <textarea
                            value={questionText}
                            onChange={(e) => setQuestionText(e.target.value)}
                            placeholder="상품에 대해 궁금한 점을 자세히 적어주세요."
                            className="w-full h-40 p-3 bg-gray-100 rounded-lg resize-none outline-none focus:ring-2"
                        />
                    </div>
                    
                    <button 
                        type="submit"
                        className="w-full p-4 bg-[#806050] text-white font-bold rounded-lg transition-colors disabled:bg-gray-300"
                        disabled={questionText.trim().length < 10}
                    >
                        질문 등록하기
                    </button>
                </form>
            </motion.div>
        </motion.div>
    );
}