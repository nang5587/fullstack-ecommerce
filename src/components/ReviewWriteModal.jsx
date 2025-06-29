// src/components/ReviewWriteModal.jsx

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Star, X } from 'lucide-react';
import TailButton from '../UI/TailButton';
import { Link } from 'react-router-dom';
import api from '../api/axios'; // ✅ api 인스턴스 import

export default function ReviewWriteModal({ item, onClose, onSubmit }) {
    const [rating, setRating] = useState(0);
    const [reviewText, setReviewText] = useState('');
    const [hoverRating, setHoverRating] = useState(0);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (rating === 0) {
            alert('별점을 선택해주세요.');
            return;
        }

        // ✅ 1. 백엔드가 요구하는 형식에 맞춰 orderid를 추가합니다.
        const submittedReview = {
            orderid: item.orderInfo.orderid, // orderInfo 객체에서 orderid 가져오기
            optionid: item.optionid,       // optionid는 그대로 사용
            rating,
            reviewtext: reviewText,
        };
        onSubmit(submittedReview);
    };

    // ✅ 2. 이미지의 전체 URL을 생성합니다.
    const imageUrl = item.imgUrl ? `${api.defaults.baseURL}${item.imgUrl}` : '';

    return (
        <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
        >
            <motion.div
                className="w-full max-w-lg bg-white border border-[#E2E29D] rounded-2xl shadow-2xl p-8 text-black relative"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
            >
                <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-black">
                    <X size={28} />
                </button>

                <h2 className="text-2xl font-bold mb-4 text-center">리뷰 작성</h2>

                {/* ✅ 3. Link 경로와 이미지 소스, 상품명을 수정합니다. */}
                <Link to={`/detail/${item.imgname}`}>
                    <div className="flex items-center gap-4 p-4 bg-gray-100 rounded-lg mb-6">
                        <img src={imageUrl} alt={item.productName} className="w-20 h-20 rounded-md object-cover" />
                        <div>
                            <h3 className="font-semibold text-lg">{item.productName}</h3>
                        </div>
                    </div>
                </Link>
                
                <form onSubmit={handleSubmit}>
                    <div className="mb-6 text-center">
                        <p className="mb-2">상품은 어떠셨나요?</p>
                        <div className="flex justify-center items-center" onMouseLeave={() => setHoverRating(0)}>
                            {[...Array(5)].map((_, index) => {
                                const starValue = index + 1;
                                return (
                                    <Star
                                        key={starValue}
                                        size={36}
                                        strokeWidth={0.5}
                                        className={`cursor-pointer transition-colors ${starValue <= (hoverRating || rating) ? 'text-[#E2E29D] fill-current' : 'text-gray-600'}`}
                                        onClick={() => setRating(starValue)}
                                        onMouseEnter={() => setHoverRating(starValue)}
                                    />
                                );
                            })}
                        </div>
                    </div>

                    <textarea
                        value={reviewText}
                        onChange={(e) => setReviewText(e.target.value)}
                        placeholder="자세한 리뷰를 남겨주시면 다른 분들께 큰 도움이 됩니다. (최소 10자 이상)"
                        className="w-full h-40 p-3 bg-gray-100 rounded-lg resize-none outline-none focus:ring-2 focus:ring-kalani-gold"
                    />

                    <TailButton
                        type="submit"
                        disabled={rating === 0 || reviewText.trim().length < 10}
                        className="w-full mt-6 bg-black text-white hover:bg-[#E2E29D] font-bold disabled:bg-gray-600 disabled:cursor-not-allowed"
                    >
                        리뷰 등록하기
                    </TailButton>
                </form>
            </motion.div>
        </motion.div>
    );
}