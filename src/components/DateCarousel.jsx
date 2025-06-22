import React from 'react';
import { useState, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectCoverflow, Pagination } from 'swiper/modules';
import { motion, AnimatePresence } from 'framer-motion'; // 애니메이션을 위한 import
import OrderCard from './OrderCard';
import ItemDetails from './ItemDetails'; // 새로 만들 상세정보 컴포넌트

import 'swiper/css';
import 'swiper/css/effect-coverflow';
import 'swiper/css/pagination';

// 6. 부모로부터 props를 받도록 수정합니다.
export default function DateCarousel({ date, items, selectedItem, onItemSelect }) {
    const [swiperInstance, setSwiperInstance] = useState(null);

    // 7. 현재 이 캐러셀에 속한 아이템이 선택되었는지 확인합니다.
    const isDetailsOpen = selectedItem && items.some(item => item.optionid === selectedItem.optionid);

    useEffect(() => {
        if (swiperInstance) {
            if (isDetailsOpen) {
                // 상세 정보가 열리면 스와이프 기능을 비활성화합니다.
                swiperInstance.allowTouchMove = false;
                swiperInstance.pagination.el.classList.add('swiper-pagination-lock'); // 페이지네이션 클릭도 막기
            } else {
                // 상세 정보가 닫히면 스와이프 기능을 다시 활성화합니다.
                swiperInstance.allowTouchMove = true;
                swiperInstance.pagination.el.classList.remove('swiper-pagination-lock');
            }
        }
    }, [isDetailsOpen, swiperInstance]);

    date = date.replace(/-/g, '. '); // 날짜 형식 변경
    return (
        <div className="w-full">
            <h3 className="text-xl font-semibold mb-4 ml-2 text-gray-500 text-center">{date}</h3>
            
            {items.length <= 1 ? (
                <div className="flex justify-center">
                    {items.length > 0 && (
                        <div 
                            className="w-[600px] h-[600px]"
                            // 8. 클릭 핸들러를 연결합니다.
                            onClick={() => onItemSelect(items[0])}
                        >
                            <OrderCard item={items[0]} />
                        </div>
                    )}
                </div>
            ) :  (
                <Swiper
                    // 4. onSwiper prop을 통해 Swiper 인스턴스를 state에 저장합니다.
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
                                className="w-full h-full" 
                                onClick={() => onItemSelect(item)}
                            >
                                <OrderCard item={item} />
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