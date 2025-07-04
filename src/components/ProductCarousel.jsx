// swiper
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';

// 훅
import { useEffect, useState } from 'react';

// api 인스턴스
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

// 컴포넌트
import ProductCard from "../components/ProductCard";

import qs from 'qs';

export default function ProductCarousel({ title, column }) {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    const [wishMap, setWishMap] = useState({});
    const { isLoggedIn } = useAuth();

    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            try {
                // 로그인 없이 추천 요청 차단
                if (column === "recommend" && !localStorage.getItem('accessToken')) {
                    setProducts([]);
                    setLoading(false);
                    return;
                }

                const response = await api.get(`/api/public/${column}`);
                const items = column === "popular" ? response.data.popularItems : response.data.recommendedItems;
                const validItems = items || [];

                setProducts(prev => {
                    if (JSON.stringify(prev) !== JSON.stringify(validItems)) {
                        return validItems;
                    }
                    return prev;
                });

            } catch (err) {
                console.error(`[ProductCarousel - ${column}] 상품 로딩 실패:`, err.response?.data || err.message);
                setProducts([]);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, [column]);

    // 위시맵 조회
    useEffect(() => {
        if (!isLoggedIn || products.length === 0) {
            setWishMap({});
            return;
        }

        const imgnames = products.map(p => p.imgname).filter(Boolean);
        if (imgnames.length === 0) return;

        api.get('/api/member/heartOnList', {
            params: { imgnames },
            paramsSerializer: params => qs.stringify(params, { arrayFormat: 'repeat' }),
        })
            .then(res => setWishMap(res.data))
            .catch(() => setWishMap({}));
    }, [products, isLoggedIn]);

    if (loading || products.length === 0) return null;

    return (
        <div className="w-full px-4 md:px-10 mb-12 ml-10">
            <h2 className="text-2xl font-bold mt-10 mb-5">{title}</h2>
            <Swiper
                modules={[]}
                spaceBetween={16}
                slidesPerView="auto"
            >
                {products.map(product => (
                    <SwiperSlide key={product.fullcode || product.imgname} className="!w-[330px] h-auto">
                        <div className="h-full">
                            <ProductCard
                                product={product}
                                liked={wishMap[product.imgname] || false}
                            />
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>
        </div>
    );
}
