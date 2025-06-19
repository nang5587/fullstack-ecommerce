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

    useEffect(() => {
        // API 호출 로직을 async 함수로 분리하여 가독성 향상
        const fetchProducts = async () => {
            try {
                const baseUrl = import.meta.env.VITE_BACKEND_URL;
                const url = `http://${baseUrl}/api/public/${column}`;

                // axios 요청 설정을 담을 객체
                const config = {
                    headers: {} // headers 객체 초기화
                };

                // 'popular'가 아닐 경우에만 인증 헤더를 추가
                if (column !== "popular") {
                    const token = localStorage.getItem('accessToken');
                    if (!token) {
                        console.log("추천 상품을 보려면 로그인이 필요합니다.");
                        // 로그인되지 않은 사용자는 추천 상품을 볼 수 없으므로, 여기서 데이터를 비우거나 기본값을 설정할 수 있습니다.
                        setProducts([]);
                        return; // 함수 실행 중단
                    }

                    // [수정] 표준 Authorization 헤더 형식으로 설정
                    config.headers['Authorization'] = `Bearer ${token}`;
                }

                // GET 요청을 한 번만 호출하고, 두 번째 인자로 config 객체를 전달
                const response = await axios.get(url, config);

                // [수정] axios는 .data로 이미 파싱된 JSON 데이터에 접근합니다.
                const data = response.data;
                console.log("서버로부터 받은 데이터:", data);

                // 'popular'일 때와 아닐 때를 구분하여 올바른 키의 데이터에 접근
                const items = column === "popular" ? data.popularItems : data.recommendedItems;
                setProducts(items);

            } catch (err) {
                // 에러 객체를 더 자세히 출력하여 디버깅 용이성 확보
                if (err.response) {
                    // 서버가 응답했으나, 상태 코드가 2xx가 아닐 때 (e.g., 401 Unauthorized, 404 Not Found)
                    console.error(`API 응답 에러 (${err.response.status}):`, err.response.data);
                } else if (err.request) {
                    // 요청이 이루어졌으나 응답을 받지 못했을 때
                    console.error("서버로부터 응답을 받지 못했습니다:", err.request);
                } else {
                    // 요청 설정 중 에러가 발생했을 때
                    console.error("상품 데이터를 불러오는 데 실패함:", err.message);
                }
                setProducts([]); // 에러 발생 시 상품 목록을 비웁니다.
            }
        };

        fetchProducts();

        // [수정] column 값이 변경될 때마다 effect가 다시 실행되도록 의존성 배열에 추가
    }, [column]);

    return (
        <div className="w-full px-4 md:px-10 mb-12 ml-10">
            <h2 className="text-xl font-bold mb-4">
                {title}
            </h2>
            <Swiper
                modules={[]}
                spaceBetween={16}
                // 'auto'로 설정하면 각 슬라이드의 너비를 그대로 유지합니다.
                slidesPerView="auto"
            >
                {products.map((product) => (
                    <SwiperSlide key={product.imgname} className="!w-[330px] h-auto"> {/* !w-auto: 카드 고유 너비 사용 */}
                        <div className="h-full">
                            <ProductCard product={product} />
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>
        </div>
    )

}