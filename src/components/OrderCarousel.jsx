// src/components/OrderCarousel.jsx

import React, { useState, useEffect } from 'react';
import { motion, useMotionValue, animate } from 'framer-motion';
import DraggableCard from './DraggableCard';

const CARD_WIDTH = 384; // 카드 너비 (w-96)
const MARGIN = 20; // 카드 간 간격
const OFFSET = CARD_WIDTH + MARGIN;

// 무한 캐러셀을 위한 "클론" 생성 함수
const createClones = (items) => {
    if (items.length <= 1) return items;
    // [ 마지막, ...전체, 첫번째 ] 형태로 배열을 만듭니다.
    return [items[items.length - 1], ...items, items[0]];
};

export default function OrderCarousel({ date, items }) {
    const isInfinite = items.length > 1;

    // 무한루프를 위해 아이템 클론 생성
    const displayItems = isInfinite ? createClones(items) : items;

    // 실제 데이터 기준의 인덱스를 관리 (0, 1, 2...)
    const [centerIndex, setCenterIndex] = useState(0);
    const dragX = useMotionValue(0);

    // ✨ 처음 로드 시 첫번째 '진짜' 아이템이 중앙에 오도록 위치 설정
    useEffect(() => {
        // isInfinite일 때, 첫번째 '진짜' 아이템은 displayItems의 1번 인덱스에 있습니다.
        const initialPosition = isInfinite ? -OFFSET : 0;
        dragX.set(initialPosition);
    }, [isInfinite, dragX]);


    const onDragEnd = (event, info) => {
        const { offset } = info;
        const currentPosition = dragX.get();

        // 드래그한 거리를 기반으로 가장 가까운 카드의 인덱스를 찾습니다.
        const nearestCardIndex = Math.round((currentPosition + offset.x) / -OFFSET);

        // 실제 데이터 인덱스로 변환 (0 ~ items.length - 1)
        const newCenterIndex = (nearestCardIndex) % items.length;
        setCenterIndex(newCenterIndex < 0 ? newCenterIndex + items.length : newCenterIndex);

        // 목표 위치로 부드럽게 애니메이션
        const targetPosition = -nearestCardIndex * OFFSET;
        animate(dragX, targetPosition, {
            type: 'spring',
            stiffness: 400,
            damping: 50,
            onComplete: () => {
                // ✨ 무한 루프의 핵심: 클론 위치에 도달하면 실제 위치로 순간이동
                if (isInfinite) {
                    const finalIndex = dragX.get() / -OFFSET;
                    // 첫번째 클론(맨 왼쪽)에 도달했다면
                    if (finalIndex === 0) {
                        dragX.set(-items.length * OFFSET, false);
                    }
                    // 마지막 클론(맨 오른쪽)에 도달했다면
                    if (finalIndex === displayItems.length - 1) {
                        dragX.set(-1 * OFFSET, false);
                    }
                }
            },
        });
    };

    const currentItem = items[centerIndex];

    return (
        <div className="mb-16">
            <div className="flex justify-between items-center mb-4 px-4">
                <h2 className="text-xl font-bold">{date}</h2>
                {items.length > 1 && (
                    <span className="text-sm text-gray-500">
                        {centerIndex + 1} / {items.length}
                    </span>
                )}
            </div>

            <div
                className="relative w-full overflow-hidden"
                style={{ height: '540px' }}
            >
                <motion.div
                    className="relative h-full"
                    style={{
                        width: displayItems.length * OFFSET,
                    }}
                    initial={{ x: isInfinite ? -OFFSET : 0 }}
                    animate={{ x: dragX }}
                    drag={isInfinite ? "x" : false}
                    dragConstraints={{
                        left: -(items.length) * OFFSET,
                        right: -1 * OFFSET,
                    }}
                    dragTransition={{ power: 0.1, timeConstant: 200 }}
                    onDragEnd={onDragEnd}
                >

                    {displayItems.map((item, i) => (
                        <DraggableCard
                            key={`${item.optionid}-${i}`} // 클론의 key가 겹치지 않도록 index 추가
                            item={item}
                            itemIndex={i}
                            dragX={dragX}
                        />
                    ))}
                </motion.div>
            </div>

            {/* 현재 선택된 아이템 정보 */}
            {currentItem && (
                <div className="mt-6 max-w-lg mx-auto px-4 py-3 bg-white rounded-lg shadow-md">
                    <div className="flex justify-between items-start">
                        <div>
                            <h3 className="font-bold text-lg">{currentItem.name}</h3>
                            <p className="text-sm text-gray-500">{currentItem.option}</p>
                        </div>
                        <div className="text-right flex-shrink-0">
                            <p className="font-bold text-xl text-kalani-gold">
                                {(currentItem.price * currentItem.quantity).toLocaleString()}원
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}