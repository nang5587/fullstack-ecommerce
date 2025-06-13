// swiper
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import './BannerSlider.css';

// 훅 목록
import { useEffect, useState } from 'react';

export default function BannerSlider() {
    const [banners, setBanners] = useState([]);
    const baseUrl = import.meta.env.VITE_BACKEND_URL;

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const res = await fetch(`http://${baseUrl}/api/public/banner`);
                const data = await res.json();
                setBanners(data);
            }
            catch (err) {
                console.error("배너 이미지를 불러오는 데 실패함: ", err);
            }
        };
        fetchProducts()
    }, []);

    return (
        <div className="relative w-full h-[750px]">
            <Swiper
                modules={[Autoplay, Pagination]}
                slidesPerView={1}
                loop={banners.length >= 3}
                autoplay={{ delay: 2800, disableOnInteraction: false }}
                speed={1500}
                pagination={{
                    el: '.custom-progressbar',
                    type: 'progressbar',
                    clickable: true,
                }}
                className='h-[750px]'
            >
                {(banners.length >= 1 ? banners : []).map((src, idx) => (
                    <SwiperSlide key={idx} className='h-[750px]'>
                        <img src={`http://${baseUrl}/api/public/img/banner/${src.imagename}.jpg`} alt={`banner-${src.id}`} className="w-full h-[750px] object-cover" />
                    </SwiperSlide>
                ))}
            </Swiper>

            {/* 하단 진행 바 */}
            <div className="custom-progressbar absolute z-10 bg-[#444]"
                style={{
                    width: '300px',
                    height: '2.5px',
                    top: '690px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    overflow: 'hidden'
                }}>
            </div>
        </div>
    )
}
