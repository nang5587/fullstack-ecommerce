// src/components/DraggableCard.js

import React from "react";

export default function DraggableCard({ item }) {
    if (!item) return null;

    return (
        // 가로로 긴 형태의 카드로 변경하여 목록에 더 잘 어울리게 함
        <div
            className="
                flex items-center w-full max-w-md bg-gray-50 
                rounded-lg shadow-sm overflow-hidden transition-transform hover:shadow-md"
        >
            {/* 이미지 영역 */}
            <div className="w-24 h-24 flex-shrink-0">
                <img
                    src={item.imageUrl}
                    alt={item.name}
                    className="w-full h-full object-cover"
                    draggable={false}
                />
            </div>
            
            {/* 정보 영역 */}
            <div className="p-4 flex flex-col justify-center">
                <p className="font-semibold text-gray-800">{item.name}</p>
                <p className="text-sm text-gray-500">{item.option}</p>
                <p className="text-md font-bold text-gray-900 mt-1">
                    {item.price.toLocaleString()}원
                </p>
            </div>
        </div>
    );
}