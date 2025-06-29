// swiper
import { Swiper, SwiperSlide } from 'swiper/react';

// 훅 목록
import { useEffect, useState } from 'react';

import 'swiper/css';

// ✅ 1. axios 직접 임포트 대신, 설정된 api 인스턴스를 임포트합니다.
import api from '../api/axios'; 

// component 목록
import ProductCard from "../components/ProductCard";

export default function ProductCarousel({ title, column }) {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            try {
                // ✅ 2. 'recommend'일 때 토큰이 없으면 아예 요청을 보내지 않고 종료합니다.
                // 인터셉터가 토큰을 자동으로 붙여주므로 여기서 수동으로 헤더를 설정할 필요가 없습니다.
                if (column === "recommend" && !localStorage.getItem('accessToken')) {
                    setProducts([]);
                    setLoading(false); // 로딩 상태도 종료
                    return;
                }

                // ✅ 3. axios.get 대신 api.get을 사용하고, baseURL 이후의 경로만 적습니다.
                const response = await api.get(`/api/public/${column}`);
                
                console.log(`[ProductCarousel - ${column}] 서버로부터 받은 데이터:`, response.data);

                // ✅ 4. axios는 데이터를 response.data에 담아주므로 바로 사용합니다.
                const items = column === "popular" ? response.data.popularItems : response.data.recommendedItems;
                const validItems = items || [];

                // 내용 비교 후 업데이트. 불필요한 리렌더링 방지.
                setProducts(prevProducts => {
                    if (JSON.stringify(prevProducts) !== JSON.stringify(validItems)) {
                        return validItems;
                    }
                    return prevProducts;
                });

            } catch (err) {
                // api 인스턴스를 사용하면 에러 객체 구조가 일관됩니다.
                console.error(`[ProductCarousel - ${column}] 상품 데이터를 불러오는 데 실패:`, err.response?.data || err.message);
                setProducts([]); // 에러 발생 시 확실하게 비워줌
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, [column]);

    // 로딩 중이거나, 로딩이 끝났는데 상품이 없는 경우 아무것도 렌더링하지 않음
    if (loading || products.length === 0) {
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