// src/components/OrderCard.js

import React from 'react';
import { motion } from 'framer-motion';
import { MessageSquareText } from 'lucide-react'; 
import { useNavigate } from 'react-router-dom';

export default function OrderCard({ item }) {
    const navigate = useNavigate();
    const handleReviewClick = (e) => {
        // 중요: 이벤트 버블링 방지
        // 이 버튼을 클릭했을 때, 부모 div의 onClick(상세보기 열기)이 실행되지 않도록 막습니다.
        e.stopPropagation();

        navigate(`/detail/${item.imgname}`); // 리뷰 작성 페이지로 이동합니다.
        // TODO: 실제 리뷰 작성 페이지로 이동하거나 모달을 여는 로직을 여기에 추가합니다.
    };
    const baseUrl = import.meta.env.VITE_BACKEND_URL;

    return (
        // 1. 부모 div에 'group'과 'relative'가 이미 설정되어 있어 기준점으로 완벽합니다. 268/268450035_main.jpg
        <motion.div className="group relative w-full h-full rounded-[80px] overflow-hidden select-none shadow-kal">
            <img
                src={`http://${baseUrl}/api/public/img/goods/${item.imgUrl}`}
                alt={item.name}
                className="absolute top-0 left-0 w-full h-full object-cover object-center 
                            transition-transform duration-500 ease-in-out 
                            group-hover:scale-105"
                draggable="false"
            />

            <div className="absolute top-7 left-7 w-full p-4">
                {/* 제품 이름 등 다른 정보가 필요하면 여기에 추가 */}
            </div>

            {/* ✅ 2. 리뷰 쓰기 버튼 추가 */}
            <div className="absolute bottom-15 right-15">
                <button
                    onClick={handleReviewClick}
                    className="px-9 py-5 bg-black text-white text-sm font-semibold 
                                rounded-full shadow-kal
                                transform transition-all duration-300 ease-in-out
                                hover:bg-kalani-gold hover:scale-105
                                focus:outline-none focus:ring-2 focus:ring-kalani-gold focus:ring-offset-2"
                >
                    <MessageSquareText size={36} strokeWidth={2} />
                </button>
            </div>
        </motion.div>
    );
}