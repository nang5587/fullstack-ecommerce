// src/components/OrderCard.jsx
import React from 'react';
import { motion } from 'framer-motion';

// motion.div를 사용하지만, 아직 애니메이션 관련 props는 비워둡니다.
export default function OrderCard({ item }) {
    const { name, option, imageUrl, price, quantity } = item;
    const { orderstatus } = item.orderInfo;

    return (
        <motion.div
            className="w-64 h-96 rounded-2xl bg-white shadow-lg overflow-hidden flex flex-col cursor-grab active:cursor-grabbing"
        >
            {/* 이미지 영역 */}
            <div className="w-full h-2/3 relative">
                <img src={imageUrl} alt={name} className="w-full h-full object-cover" />
                <span className="absolute top-3 right-3 bg-kalani-navy text-white text-xs font-bold px-2 py-1 rounded-full">
                    {orderstatus}
                </span>
            </div>

            {/* 정보 영역 */}
            <div className="w-full h-1/3 p-4 flex flex-col justify-between bg-gray-50">
                <div>
                    <h3 className="font-bold text-lg truncate">{name}</h3>
                    <p className="text-sm text-gray-500">{option}</p>
                </div>
                <div className="text-right">
                    <p className="text-gray-600 text-sm">
                        {price.toLocaleString()}원 x {quantity}개
                    </p>
                    <p className="font-bold text-xl text-kalani-gold">
                        {(price * quantity).toLocaleString()}원
                    </p>
                </div>
            </div>
        </motion.div>
    );
}