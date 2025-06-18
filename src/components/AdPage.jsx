import { Link, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';

import { motion } from 'framer-motion';
import ModelViewer from './ModelViewer';

export default function AdPage() {
    const { productId } = useParams();
    const [product, setProduct] = useState(null);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        async function fetchProduct() {
            try {
                const response = await fetch('/data/products.json');
                if (!response.ok) throw new Error('상품 데이터를 불러오지 못했습니다.');
                const allProducts = await response.json();
                const found = allProducts.find((item) => item.imgname === productId);
                if (!found) throw new Error('해당 상품을 찾을 수 없습니다.');
                setProduct(found);
            } catch (err) {
                console.error(err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        }

        fetchProduct();
    }, [productId]);

    // 로딩중일 때
    if (loading) {
        return (
            <div className="w-full min-h-screen flex items-center justify-center bg-kalani-creme">
                <p className="text-kalani-navy text-xl font-medium">로딩 중...</p>
            </div>
        );
    }

    // 에러, 상품 없을 때
    if (error || !product) {
        return (
            <div className="w-full min-h-screen flex items-center justify-center bg-kalani-creme">
                <p className="text-red-600 text-xl font-medium">{error}</p>
            </div>
        );
    }

    return (
        <div className="w-full min-h-screen bg-kalani-creme flex flex-col lg:flex-row">

            {/* 왼쪽: 3D 모델 뷰어 영역 */}
            <div className="w-full lg:w-3/5 h-[50vh] lg:h-screen bg-gray-200">
                <ModelViewer imgname={product.imgname}/>
            </div>

            {/* 오른쪽: 광고 문구 및 정보 영역 */}
            <div className="w-full lg:w-2/5 flex items-center justify-center p-8 lg:p-16">
                <div className="max-w-md text-left">

                    {/* 애니메이션을 위한 컨테이너 */}
                    <motion.div
                        initial="hidden"
                        animate="visible"
                        variants={{
                            hidden: { opacity: 0 },
                            visible: {
                                opacity: 1,
                                transition: { staggerChildren: 0.2, delayChildren: 0.3 }
                            }
                        }}
                    >
                        {/* 텍스트 요소별로 애니메이션 적용 */}
                        <motion.p
                            className="text-sm font-medium text-kalani-gold tracking-widest mb-2"
                            variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
                        >
                            THE ESSENTIAL
                        </motion.p>

                        {/* 브랜드 이름 */}
                        <motion.h1
                            id="font"
                            className="text-5xl lg:text-6xl font-bold text-kalani-navy mb-6"
                            variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
                        >
                            {product.name}
                        </motion.h1>

                        {/* 광고 문구 */}
                        <motion.p
                            className="text-base text-kalani-ash leading-relaxed mb-8"
                            variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
                        >
                            {product.description}
                        </motion.p>

                        {/* 특징 리스트 */}
                        <motion.ul
                            className="space-y-3 text-sm text-kalani-ash border-t border-kalani-stone pt-6 mb-10"
                            variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
                        >
                            <li className="flex items-center">
                                <span className="font-semibold w-28">소재:</span>
                                <span>{product.material}</span>
                            </li>
                            <li className="flex items-center">
                                <span className="font-semibold w-28">안감:</span>
                                <span>{product.lining}</span>
                            </li>
                            <li className="flex items-center">
                                <span className="font-semibold w-28">제조:</span>
                                <span>{product.origin}</span>
                            </li>
                        </motion.ul>

                        {/* 구매 버튼 */}
                        <motion.div variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}>
                            <Link
                                to={`/detail/${productId}`}
                                className="inline-block w-full text-center px-8 py-4 bg-kalani-navy text-white font-semibold rounded-md shadow-nm hover:opacity-90 transition-opacity"
                            >
                                자세히 보기 & 구매하기
                            </Link>
                        </motion.div>
                    </motion.div>

                </div>
            </div>
        </div>
    );
}