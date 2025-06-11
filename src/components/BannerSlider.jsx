// swiper
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import './BannerSlider.css';

const images = [
    'src/assets/test_img.jpg',
    'src/assets/배너1.jpg',
    'src/assets/배너2.jpg',
    'src/assets/배너3.jpg',
    'src/assets/배너4.jpg',
    'src/assets/배너5.jpg',
];

export default function BannerSlider() {
    return (
        <div className="relative w-full h-[750px]">
            <Swiper
                modules={[Autoplay, Pagination]}
                slidesPerView={1}
                loop
                autoplay={{ delay: 3000, disableOnInteraction: false }}
                speed={1500}
                pagination={{
                    el: '.custom-pagination',
                    clickable: true,
                    renderBullet: (index, className) => (
                        `<span class="${className}"></span>`
                    ),
                }}
            >
                {images.map((src, idx) => (
                    <SwiperSlide key={idx}>
                        <img src={src} alt={`banner-${idx}`} className="w-full h-[710px] object-cover" />
                    </SwiperSlide>
                ))}
            </Swiper>

            {/* 하단 진행 바 */}
            <div className="custom-pagination absolute bottom-20 left-0 right-0 mx-auto flex justify-center z-10 w-[300px]"></div>
        </div>
    )
}
