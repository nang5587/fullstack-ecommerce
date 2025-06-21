// src/components/DateCarousel.js

import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectCoverflow, Pagination, Navigation } from 'swiper/modules';
import OrderCard from './OrderCard';

// Swiper CSS import
import 'swiper/css';
import 'swiper/css/effect-coverflow';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

export default function DateCarousel({ date, items }) {
    // 상품이 하나뿐이면 캐러셀이 아닌 단일 카드로 표시
    if (items.length <= 1) {
        return (
            <div className="w-full">
                <h3 className="text-xl font-semibold mb-4 ml-2">{date}</h3>
                <div className="flex justify-center">
                    {items.length > 0 && <OrderCard item={items[0]} />}
                </div>
            </div>
        );
    }
    
    return (
        <div className="w-full">
            <h3 className="text-xl font-semibold mb-4 ml-2">{date}</h3>
            <Swiper
                modules={[EffectCoverflow, Pagination, Navigation]}
                effect={'coverflow'}
                grabCursor={true}
                centeredSlides={true}
                slidesPerView={'auto'}
                
                // ✅ loop 옵션을 완전히 제거했습니다.
                // loop={false} 로 명시적으로 적어도 동일하게 동작합니다.
                
                navigation={true}
                pagination={{ clickable: true }}
                coverflowEffect={{
                    rotate: 50,
                    stretch: 0,
                    depth: 100,
                    modifier: 1,
                    slideShadows: true,
                }}
                className="mySwiper"
            >
                {items.map((item) => (
                    <SwiperSlide key={item.optionid} style={{ width: '300px', height: '300px' }}>
                        <OrderCard item={item} />
                    </SwiperSlide>
                ))}
            </Swiper>
        </div>
    );
}