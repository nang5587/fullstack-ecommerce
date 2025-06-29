import React from 'react';
import { useState, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectCoverflow, Pagination } from 'swiper/modules';
import { motion, AnimatePresence } from 'framer-motion'; // 애니메이션을 위한 import
import { format } from 'date-fns';

import OrderCard from './OrderCard';
import ItemDetails from './ItemDetails'; // 새로 만들 상세정보 컴포넌트

import TailButton from '../UI/TailButton';

import 'swiper/css';
import 'swiper/css/effect-coverflow';
import 'swiper/css/pagination';

// 6. 부모로부터 props를 받도록 수정합니다.
export default function DateCarousel({ date, items, selectedItem, onItemSelect, onCancel, onReviewClick }) {
    const [swiperInstance, setSwiperInstance] = useState(null);

    // ✅ 현재 캐러셀에 속한 아이템이 선택되었는지 확인 (수정 없음)
    const isDetailsOpen = selectedItem && items.some(item => item.optionid === selectedItem.optionid);

    useEffect(() => {
        if (swiperInstance) {
            // 상세 정보가 열렸을 때/닫혔을 때 스와이프 기능 제어 (수정 없음)
            swiperInstance.allowTouchMove = !isDetailsOpen;
            swiperInstance.pagination.el.classList.toggle('swiper-pagination-lock', isDetailsOpen);
        }
    }, [isDetailsOpen, swiperInstance]);

    return (
        <div className="w-full">
            <h3 className="text-xl font-semibold mb-4 ml-2 text-gray-500 text-center">{date}</h3>
            {/* ✅ 주문 상태와 주문 취소 버튼 (items[0].orderInfo.orderid 로 수정) */}
            {items.length > 0 && items[0].orderInfo.orderstatus === '주문완료' && (
                <div className="flex justify-end mb-4">
                    <TailButton
                        onClick={() => onCancel(items[0].orderInfo.orderid)}
                        className="px-4 py-2 bg-opacity-0 border-gray-400"
                    >
                        주문 취소
                    </TailButton>
                </div>
            )}

            {items.length <= 1 ? (
                <div className="flex justify-center">
                    {items.length > 0 && (
                        <div
                            className="w-[600px] h-[600px] cursor-pointer" // 클릭 가능함을 나타내기 위해 cursor-pointer 추가
                            onClick={() => onItemSelect(items[0])}
                        >
                            <OrderCard item={items[0]} onReviewClick={onReviewClick} />
                        </div>
                    )}
                </div>
            ) : (
                <Swiper
                    onSwiper={setSwiperInstance}
                    modules={[EffectCoverflow, Pagination]}
                    effect={'coverflow'}
                    grabCursor={true}
                    centeredSlides={true}
                    slidesPerView={'auto'}
                    pagination={{ clickable: true }}
                    coverflowEffect={{
                        rotate: 0,
                        stretch: 0,
                        depth: 100,
                        modifier: 2,
                        slideShadows: false,
                    }}
                    className="mySwiper overflow-visible"
                >
                    {items.map((item) => (
                        <SwiperSlide key={item.optionid} style={{ width: '600px', height: '600px' }}>
                            <div
                                className="w-full h-full cursor-pointer" // 클릭 가능함을 나타내기 위해 cursor-pointer 추가
                                onClick={() => onItemSelect(item)}
                            >
                                {/* ✅ item[0]이 아닌 item을 전달 */}
                                <OrderCard item={item} onReviewClick={onReviewClick} />
                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>
            )}

            <AnimatePresence>
                {isDetailsOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0, marginTop: 0 }}
                        animate={{ height: 'auto', opacity: 1, marginTop: '2rem' }}
                        exit={{ height: 0, opacity: 0, marginTop: 0 }}
                        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                        className="overflow-hidden"
                    >
                        <ItemDetails
                            item={selectedItem}
                            onClose={() => onItemSelect(selectedItem)}
                        />
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}