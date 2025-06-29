import React from 'react';
import { motion } from 'framer-motion';
import { MessageSquareText } from 'lucide-react';
import api from '../api/axios'; // ✅ baseURL을 사용하기 위해 api 인스턴스 import

export default function OrderCard({ item, onReviewClick }) {

    const handleReviewClick = (e) => {
        e.stopPropagation();
        // ✅ item.imgname을 사용하여 상세 페이지로 이동
        onReviewClick(item);
    };

    // ✅ 이미지 URL을 안전하게 생성
    const imageUrl = `${api.defaults.baseURL}${item.imgUrl}`;

    return (
        <motion.div className="group relative w-full h-full rounded-[80px] overflow-hidden select-none shadow-kal">
            <img
                // ✅ 안전하게 생성된 이미지 URL 사용
                src={imageUrl}
                // ✅ item.name 대신 item.productName 사용
                alt={item.productName}
                className="absolute top-0 left-0 w-full h-full object-cover object-center 
                            transition-transform duration-500 ease-in-out 
                            group-hover:scale-105"
                draggable="false"
            />

            <div className="absolute top-7 left-7 w-full p-4">
                {/* 제품 이름 표시 */}
                <h3 className="text-white text-2xl font-bold text-shadow-lg">{item.productName}</h3>
            </div>

            {/* ✅ 리뷰 쓰기 버튼 위치 수정 (bottom-16, right-16) */}
            {(item.orderInfo.orderstatus === '주문완료' || item.orderInfo.orderstatus === '배송완료') && (
                <div className="absolute bottom-16 right-16">
                    <button onClick={handleReviewClick} className="px-9 py-5 bg-black text-white text-sm font-semibold 
                                rounded-full shadow-kal
                                transform transition-all duration-300 ease-in-out
                                hover:bg-kalani-gold hover:scale-105
                                focus:outline-none focus:ring-2 focus:ring-kalani-gold focus:ring-offset-2" title="리뷰 작성하기">
                        <MessageSquareText size={36} strokeWidth={2} />
                    </button>
                </div>
            )}
        </motion.div>
    );
}