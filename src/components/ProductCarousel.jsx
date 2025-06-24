// swiper
import { Swiper, SwiperSlide } from 'swiper/react';

// 훅 목록
import { useEffect, useState } from 'react';

import 'swiper/css';

import axios from 'axios';

import jwt_decode from "jwt-decode";

// component 목록
import ProductCard from "../components/ProductCard";

export default function ProductCarousel({ title, column }) {
    const [products, setProducts] = useState([]);
    // ✅ 로딩 상태를 추가하여 데이터가 없을 때 바로 컴포넌트가 사라지는 것을 방지
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            try {
                const baseUrl = import.meta.env.VITE_BACKEND_URL;
                const url = `http://${baseUrl}/api/public/${column}`;
                const config = { headers: {} };

                // 'recommend' 캐러셀일 때만 인증 헤더 추가
                if (column === "recommend") {
                    const token = localStorage.getItem('accessToken');
                    // 토큰이 없으면 그냥 요청을 보내지 않고 함수를 종료.
                    // 어차피 Home.js에서 추천 상품이 없는 레이아웃을 보여주므로 여기서 아무것도 렌더링하지 않으면 됨.
                    if (!token) {
                        setProducts([]);
                        return;
                    }
                    config.headers['Authorization'] = `Bearer ${token}`;
                }

                const response = await axios.get(url, config);
                const data = response.data;
                console.log(`[ProductCarousel - ${column}] 서버로부터 받은 데이터:`, data);

                const items = column === "popular" ? data.popularItems : data.recommendedItems;
                const validItems = items || [];

                // ✅ 핵심: 내용 비교 후 업데이트. 불필요한 리렌더링 방지.
                setProducts(prevProducts => {
                    if (JSON.stringify(prevProducts) !== JSON.stringify(validItems)) {
                        return validItems;
                    }
                    return prevProducts;
                });

            } catch (err) {
                console.error(`[ProductCarousel - ${column}] 상품 데이터를 불러오는 데 실패:`, err.response?.data || err.message);
                setProducts([]); // 에러 발생 시 확실하게 비워줌
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();

        // ✅ 의존성 배열을 'column'으로 단순화.
        // 이 컴포넌트는 'column' prop이 바뀔 때만 데이터를 다시 가져와야 합니다.
    }, [column]);

    if (loading || products.length === 0) {
        // 단, 추천 상품 확인을 위해 로딩이 끝나고 상품이 없을 때까지 기다려야 하므로,
        // 로딩 상태를 체크하는 것이 중요합니다.
        // `column === 'recommend'`일 때는 렌더링을 하지 않더라도, useEffect는 실행되어 onDataLoaded를 호출합니다.
        return null;
    }

    return (
        <div className="w-full px-4 md:px-10 mb-12 ml-10">
            <h2 className="text-2xl font-bold mt-10 mb-5">
                {title}
            </h2>
            <Swiper
                modules={[]}
                spaceBetween={16}
                slidesPerView="auto"
            >
                {products.map((product) => (
                    // ✅ key는 고유해야 합니다. fullcode가 없다면 다른 고유값을 사용해야 합니다.
                    <SwiperSlide key={product.fullcode || product.imgname} className="!w-[330px] h-auto">
                        <div className="h-full">
                            <ProductCard product={product} />
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>
        </div>
    );
}