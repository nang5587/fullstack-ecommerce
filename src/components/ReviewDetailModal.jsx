// src/components/ReviewDetailModal.js

import React from 'react';
import { motion } from 'framer-motion';
import { Star, X, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';

// 별점 표시용 (읽기 전용)
const StarRatingDisplay = ({ rating }) => (
    <div className="flex items-center">
        {[...Array(5)].map((_, index) => (
            <Star key={index} size={20} strokeWidth={0.5} className={index < rating ? 'text-[#E2E29D] fill-current' : 'text-gray-600'} />
        ))}
    </div>
);

export default function ReviewDetailModal({ item, onClose }) {

    // TODO: 삭제 핸들러 구현
    const handleDelete = () => console.log('삭제 기능 구현 예정:', item.optionId);

    return (
        <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
        >
            <motion.div
                className="w-full max-w-lg bg-white border border-[#E2E29D] rounded-2xl shadow-2xl p-8 text-black relative flex flex-col"
                style={{ maxHeight: '85vh' }}
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
            >
                <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-black">
                    <X size={28} />
                </button>

                <h2 className="text-2xl font-bold mb-4 text-center">작성한 리뷰</h2>

                {/* 상품 정보 */}
                <Link to={`/datail/${item.imgname}`}>
                    <div className="flex items-center gap-4 p-4 bg-gray-100 rounded-lg mb-6 flex-shrink-0">
                        <img src={item.imageUrl} alt={item.productName} className="w-20 h-20 rounded-md object-cover" />
                        <div>
                            <h3 className="font-semibold text-lg">{item.productName}</h3>
                            <p className="text-sm text-gray-400">작성일 {new Date(item.createdAt).toLocaleDateString()}</p>
                        </div>
                    </div>
                </Link>

                {/* 리뷰 내용 */}
                <div className="flex-grow overflow-y-auto pr-2 scrollbar-hide">
                    <div className="flex justify-between items-center mb-4">
                        <span className="font-semibold">나의 별점</span>
                        <StarRatingDisplay rating={item.rating} />
                    </div>
                    <div className="bg-gray-100 p-4 rounded-lg">
                        <p className="whitespace-pre-wrap leading-relaxed">{item.reviewtext}</p>
                    </div>
                </div>

                {/* 수정/삭제 버튼 */}
                <div className="flex gap-4 mt-6 flex-shrink-0">
                    <button onClick={handleDelete} className="flex-1 p-3 bg-[#001833] text-white rounded-lg flex items-center justify-center gap-2 hover:bg-[#E2E29D]">
                        <Trash2 size={18} /> 삭제
                    </button>
                </div>
            </motion.div>
        </motion.div>
    );
}