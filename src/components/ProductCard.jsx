// 훅 목록
import { Link } from "react-router-dom";
import { useState } from 'react';

// Icon
import { BsHeart, BsHeartFill } from 'react-icons/bs';

import { motion } from 'framer-motion';

export default function ProductCard({ product }) {
    const [liked, setLiked] = useState(false);

    const productCode = product.imgname;
    const baseUrl = import.meta.env.VITE_BACKEND_URL;
    const imgUrl = `http://${baseUrl}/api/public/img/goods/${productCode}.jpg`;
    console.log(typeof product.price);
    return (
        <div className="group w-full flex-shrink-0"> {/* w-64: 너비 고정, flex-shrink-0: 줄어들지 않음 */}
            <Link to={`/detail/${productCode}`} className="block">
                {/* 상품 이미지 영역 */}
                <div className="w-full aspect-[3/4] overflow-hidden bg-gray-200 rounded-lg">
                    <img
                        src={imgUrl}
                        alt={product.productName}
                        onError={(e) => { e.target.src = 'src/assets/위츄.jpeg'; }}
                        className="h-full w-full object-cover object-center transition-transform duration-300 group-hover:scale-105 rounded"
                    />
                </div>

                {/* 상품 정보 영역 */}
                <div className="mt-4">
                    <h3 className="text-sm font-medium text-gray-800">{product.productName}</h3>
                    <p className="mt-1 text-base font-semibold text-gray-800">{product.price.toLocaleString('ko-KR')}원</p>
                </div>
                <motion.button
                    whileTap={{ scale: 1.3 }}
                    transition={{ duration: 0.2, ease: "easeInOut" }}
                    onClick={(e) => {
                        e.preventDefault(); // Link 클릭 방지
                        setLiked((prev) => !prev);
                    }}
                    className="absolute top-4 right-4 z-10 p-1"
                >
                    {liked ? (
                        <BsHeartFill className="text-rose-600 w-6 h-6 transition-colors duration-200" />
                    ) : (
                        <BsHeart className="text-gray-500 w-6 h-6 drop-shadow transition-colors duration-200" />
                    )}
                </motion.button>
            </Link>
        </div>
    )
}

