// src/components/OrderCarousel.js

// 1. Swiper 관련 컴포넌트와 모듈, CSS를 import 합니다.
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, A11y } from 'swiper/modules';

// 2. Swiper의 기본 CSS와 사용할 모듈(네비게이션, 페이지네이션)의 CSS를 import 합니다.
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

import React from 'react';
import DraggableCard from './DraggableCard'; // 카드 컴포넌트는 재사용

export default function OrderCarousel({ groupedItems }) {
    if (!groupedItems || groupedItems.length === 0) {
        return <div className="text-center p-10 bg-gray-100 rounded-lg">최근 주문 내역이 없습니다.</div>;
    }

    return (
        // Swiper 컴포넌트로 전체를 감쌉니다.
        <Swiper
            // 사용할 모듈들을 배열로 전달합니다.
            modules={[Navigation, Pagination, A11y]}
            spaceBetween={50} // 슬라이드 사이의 간격
            slidesPerView={1} // 한 번에 보여줄 슬라이드 개수
            navigation // 좌우 화살표 네비게이션 사용
            pagination={{ clickable: true }} // 하단 페이지네이션 버튼 사용
            className="w-full"
        >
            {/* 그룹화된 데이터를 map으로 순회하며 각 그룹을 SwiperSlide로 만듭니다. */}
            {groupedItems.map((group) => (
                <SwiperSlide key={group.date}>
                    <div className="p-4 bg-white rounded-lg shadow-md min-h-[300px]">
                        {/* 슬라이드(그룹)의 날짜를 제목으로 표시 */}
                        <h3 className="text-lg font-bold mb-4 text-center border-b pb-2">
                            {group.date} 주문
                        </h3>
                        
                        {/* 해당 날짜의 모든 아이템을 세로로 나열 */}
                        <div className="flex flex-col items-center gap-4">
                            {group.items.map((item) => (
                                <DraggableCard key={item.optionid} item={item} />
                            ))}
                        </div>
                    </div>
                </SwiperSlide>
            ))}
        </Swiper>
    );
}