// src/components/OrderCard.js

import React from 'react';

export default function OrderCard({ item }) {
    return (
        <div className="relative w-full h-full rounded-lg overflow-hidden shadow-lg select-none">
            {/* 배경 이미지 */}
            <img
                src={item.imageUrl}
                alt={item.name}
                className="absolute top-0 left-0 w-full h-full object-cover"
                draggable="false"
            />

            {/* 상단 상품명 오버레이 */}
            <div
                className="absolute top-0 left-0 w-full p-4 
                        bg-gradient-to-b from-black/70 to-transparent"
            >
                <h4 className="text-white text-lg font-bold truncate">
                    {item.name}
                </h4>
            </div>
        </div>
    );
}