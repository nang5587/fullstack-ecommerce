// swiper
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';

// component 목록
import ProductCard from "../components/ProductCard";

// test용 더미
const products = [
    { id: 1, name: '클래식 레더 자켓', price: 129000, image: '/src/data/imgs/1.jpg' },
    { id: 2, name: '오버핏 코튼 셔츠', price: 45000, image: '/src/data/imgs/2.jpg' },
    { id: 3, name: '데미지 워싱 데님', price: 78000, image: '/src/data/imgs/3.jpg' },
    { id: 4, name: '울 블렌드 스웨터', price: 89000, image: '/src/data/imgs/4.jpg' },
    { id: 5, name: '미니멀 스니커즈', price: 110000, image: '/src/data/imgs/5.jpg' },
    { id: 6, name: '코듀로이 와이드 팬츠', price: 65000, image: '/src/data/imgs/6.jpg' },
    { id: 7, name: '울 블렌드 스웨터', price: 89000, image: '/src/data/imgs/7.jpg' },
    { id: 8, name: '미니멀 스니커즈', price: 110000, image: '/src/data/imgs/8.jpg' },
    { id: 9, name: '코듀로이 와이드 팬츠', price: 65000, image: '/src/data/imgs/9.jpg' },
];

export default function ProductCarousel({title}) {
    return (
        <div className="ml-10 mb-50">
            <h2 className="text-xl font-bold mb-3">
                {title}
            </h2>
            <Swiper
                modules={[]}
                spaceBetween={24}
                // 'auto'로 설정하면 각 슬라이드의 너비를 그대로 유지합니다.
                slidesPerView={'auto'}
            >
                {products.map((product) => (
                    <SwiperSlide key={product.id} className="!w-auto"> {/* !w-auto: 카드 고유 너비 사용 */}
                        <ProductCard product={product} />
                    </SwiperSlide>
                ))}
            </Swiper>
        </div>
    )
}
