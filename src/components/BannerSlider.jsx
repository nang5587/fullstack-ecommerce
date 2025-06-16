// swiper
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import './BannerSlider.css';

export default function BannerSlider() {
    const banners = [
        '배너0.jpg',
        '배너1.jpg',
        '배너2.jpg',
        '배너3.jpg',
        '배너4.jpg',
        '배너5.jpg',
    ];

    return (
        <div className="relative w-full" style={{ height: 'calc(100vh - 6rem)' }}>
            <Swiper
                modules={[Autoplay, Pagination]}
                slidesPerView={1}
                loop={banners.length >= 3}
                autoplay={{ delay: 3000, disableOnInteraction: false }}
                speed={1500}
                pagination={{
                    el: '.custom-progressbar',
                    type: 'progressbar',
                    clickable: true,
                }}
                style={{ height: 'calc(100vh - 6rem)' }}
            >
                {(banners.length >= 1 ? banners : []).map((src, idx) => (
                    <SwiperSlide key={idx} style={{ minHeight: 'calc(100vh - 6rem)' }}>
                        <img src={`src/assets/banners/${src}`}
                            alt={`banner-${idx}`} className="w-full h-full object-cover" style={{ height: 'calc(100vh - 6rem)' }} />
                    </SwiperSlide>
                ))}
            </Swiper>

            {/* 하단 진행 바 */}
            <div className="custom-progressbar absolute z-10 bg-[#444]"
                style={{
                    width: '300px',
                    height: '2.5px',
                    top: 'calc(100vh - 6rem - 60px)',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    overflow: 'hidden'
                }}>
            </div>
        </div>
    )
}
