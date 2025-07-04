import { Link } from "react-router-dom";
import { useState, useEffect, memo } from 'react';
import { BsHeart, BsHeartFill } from 'react-icons/bs';
import { motion } from 'framer-motion';
import api from '../api/axios'; // ← axios 인스턴스 import
import { useAuth } from '../context/AuthContext';

const ProductCard = memo(({ product, liked:initialLiked }) => {
    const [liked, setLiked] = useState(initialLiked);
    const { isLoggedIn } = useAuth();

    if (!product) return null;

    const productCode = product.imgname;
    const baseUrl = import.meta.env.VITE_BACKEND_URL;
    const imgUrl = `http://${baseUrl}/api/public/img/goods/${productCode}.jpg`;

    // useEffect(() => {
    //     // 로그인 상태가 아니면 '좋아요'가 아닌 상태로 확정
    //     if (!isLoggedIn) {
    //         setLiked(false);
    //         return;
    //     }

    //     const checkWishStatus = async () => {
    //         try {
    //             // ✅ 2. axios.get 사용법 수정: 파라미터를 params 객체로 전달
    //             const res = await api.get('/api/member/heartOn', {
    //                 params: { imgname: productCode }
    //             });
    //             setLiked(res.data === true);
    //         } catch (error) {
    //             console.error(`[ProductCard - ${productCode}] 위시리스트 상태 확인 실패:`, error);
    //             setLiked(false); // 에러 발생 시에도 '좋아요'가 아닌 것으로 간주
    //         }
    //     };

    //     checkWishStatus();
    // }, [productCode, isLoggedIn]);

    useEffect(() => {
        setLiked(initialLiked); // prop이 바뀔 때 상태 동기화
    }, [initialLiked]);


    const handleWishToggle = async (e) => {
        e.preventDefault();

        // 로그인 상태가 아니면 로그인 페이지로 유도
        if (!isLoggedIn) {
            alert('로그인이 필요한 기능입니다.');
            return;
        }

        // 서버에서 상태를 아직 확인 중일 때는 아무것도 하지 않음
        if (liked === null) return;

        const originalLiked = liked;
        setLiked(!originalLiked); // UI 즉시 업데이트

        try {
            if (!originalLiked) { // '좋아요'를 누른 경우
                console.log(productCode)
                console.log('좋아요진입')
                await api.post('/api/member/addwish',
                    `${productCode}`
                );
            } else {
                await api.delete('/api/member/deletewish', {
                params: {
                    imgname: productCode
                }
            });
            }
        } catch (error) {
            console.error(`[ProductCard - ${productCode}] 위시리스트 업데이트 실패:`, error);
            alert("요청 처리 중 오류가 발생했습니다.");
            setLiked(originalLiked); // 실패 시 원래 상태로 롤백
        }
    };

    return (
        <div className="group w-full flex-shrink-0 relative">
            <Link to={`/detail/${productCode}`} className="block">
                <div className="w-full aspect-[3/4] overflow-hidden bg-gray-200 rounded-lg">
                    <img
                        src={imgUrl}
                        alt={product.productName}
                        onError={(e) => { e.target.src = 'src/assets/위츄.jpeg'; }}
                        className="h-full w-full object-cover object-center transition-transform duration-300 group-hover:scale-105 rounded"
                    />
                </div>

                <div className="mt-4">
                    <h3 className="text-sm font-medium text-gray-800">{product.productName}</h3>
                    <p className="mt-1 text-base font-semibold text-gray-800">{product.price.toLocaleString('ko-KR')}원</p>
                </div>

                <motion.button
                    whileTap={{ scale: 1.3 }}
                    transition={{ duration: 0.2, ease: "easeInOut" }}
                    onClick={handleWishToggle}
                    className="absolute top-4 right-4 z-10 p-1"
                    disabled={liked === null}
                >
                    {liked ? (
                        <BsHeartFill className="text-rose-600 w-6 h-6 transition-colors duration-200" />
                    ) : (
                        <BsHeart className="text-gray-500 w-6 h-6 drop-shadow transition-colors duration-200" />
                    )}
                </motion.button>
            </Link>
        </div>
    );
});

export default ProductCard;