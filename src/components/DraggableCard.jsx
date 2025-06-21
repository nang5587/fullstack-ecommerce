// src/components/DraggableCard.jsx

import React from 'react';
import { motion, useTransform } from 'framer-motion';

// ✨ 새로운 디자인에 맞는 카드 크기 설정 (w-80)
const CARD_WIDTH = 320;
const MARGIN = 30; // 카드 간 간격을 조금 더 줍니다.
const OFFSET = CARD_WIDTH + MARGIN;

export default function DraggableCard({ item, itemIndex, dragX }) {
    const { name, imageUrl, option, price, quantity, orderInfo } = item;

    // 이 애니메이션 로직은 그대로 사용합니다. 완벽합니다.
    const scale = useTransform(
        dragX,
        [(-itemIndex - 1) * OFFSET, -itemIndex * OFFSET, (-itemIndex + 1) * OFFSET],
        [0.75, 1, 0.75] // 옆 카드를 조금 더 작게 만들어 입체감 강조
    );

    const opacity = useTransform(
        dragX,
        [(-itemIndex - 1) * OFFSET, -itemIndex * OFFSET, (-itemIndex + 1) * OFFSET],
        [0.4, 1, 0.4] // 옆 카드의 투명도를 더 낮춰 중앙 카드에 집중
    );

    return (
        // ✨ 1. 카드 외부 틀의 애니메이션 로직은 그대로 유지합니다.
        <motion.div
            style={{
                width: CARD_WIDTH,
                scale,
                opacity,
                x: itemIndex * OFFSET,
                position: 'absolute',
                top: 0,
                left: 0,
            }}
            className="h-[480px] rounded-2xl bg-white shadow-xl overflow-hidden cursor-grab active:cursor-grabbing"
        >
            {/* ✨ 2. 카드 내부 구조를 새 디자인에 맞게 완전히 변경합니다. */}

            {/* 이미지 영역 (카드의 60%) */}
            <div className="w-full h-3/5 bg-gray-100">
                <img src={imageUrl} alt={name} className="w-full h-full object-cover" />
            </div>

            {/* 텍스트 정보 영역 (카드의 40%) */}
            <div className="w-full h-2/5 p-6 flex flex-col justify-center items-center text-center">
                <span className="absolute top-4 right-4 bg-kalani-navy text-white text-xs font-bold px-2.5 py-1 rounded-full">
                    {orderInfo.orderstatus}
                </span>
                <h3 className="font-bold text-2xl text-gray-800 truncate w-full">{name}</h3>
                <p className="text-sm text-gray-500 mt-1">{option}</p>
                <p className="font-semibold text-lg text-kalani-gold mt-4">
                    {(price * quantity).toLocaleString()}원
                </p>
            </div>
        </motion.div>
    );
}