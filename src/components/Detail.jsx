// css
import './Detail.css';

// 훅 목록
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

// UI 목록
import TailButton from "../UI/TailButton"

// component 목록
import CartPopup from './CartPopup';

// 애니메 효과
import { AnimatePresence, motion } from 'framer-motion';

// 리뷰 더미
const dummyReviews = [
    {
        id: 1,
        name: "Customer name",
        date: "1 WEEK AGO",
        content: "This company always goes above and beyond to satisfy their customers.",
        rating: 4,
    },
    {
        id: 2,
        name: "Daniel Smith",
        date: "2 MONTH AGO",
        content: "I can't believe how affordable and high-quality this item is!",
        rating: 4,
    },
    {
        id: 3,
        name: "Benjamin Clark",
        date: "23 APRIL",
        content: "These guys know their stuff, and it shows in their products.",
        rating: 4,
    },
];

export default function Detail() {
    // url로 날아오는 이미지 번호 넣을 변수
    const { productId } = useParams();

    // 상품이미지 관련 변수
    const thumbnails = [
        'src/assets/banners/배너0.jpg',
        'src/assets/banners/배너1.jpg',
        'src/assets/banners/배너2.jpg',
        'src/assets/banners/배너3.jpg',
        'src/assets/banners/배너4.jpg',
        'src/assets/banners/배너5.jpg',
    ];
    const [mainImage, setMainImage] = useState(thumbnails[0]);
    const [selectedTab, setSelectedTab] = useState('description');

    // 상품가져오는 변수
    const [product, setProduct] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    // 장바구니 팝업 변수
    const [isPopupVisible, setIsPopupVisible] = useState(false);

    useEffect(() => {
        window.scrollTo(0, 0);
        const productFetch = async () => {
            try {
                const baseUrl = import.meta.env.VITE_BACKEND_URL;
                const res = await axios.get(`http://${baseUrl}/api/public/goods?${productId}`);
                setProduct(res);
            }
            catch (e) {
                setError(e);
            }
            finally {
                setLoading(false)
            }
        }

        productFetch();
    }, [productId]);

    const handleCartClick = () => {
        setIsPopupVisible(true);
        setTimeout(() => {
            setIsPopupVisible(false);
        }, 3000); // 3초 후 사라짐
    }

    return (
        <>
            <div className="w-10/12 mx-auto flex flex-col lg:flex-row gap-20 py-10">
                {/* 이미지 영역 */}
                <div className="flex flex-row lg:w-1/2">
                    {/* 썸네일 목록 */}
                    <div className="pr-4 hidden sm:flex flex-col gap-2 overflow-y-auto max-h-[100vh] scrollbar-hide">
                        {thumbnails.map((thumb, idx) => (
                            <div
                                key={idx}
                                className={`w-20 h-28 overflow-hidden cursor-pointer border 
                                ${mainImage === thumb ? 'border-black' : 'border-transparent'}
                            `}
                                onClick={() => setMainImage(thumb)}
                            >
                                <img
                                    src={thumb}
                                    alt={`thumb-${idx}`}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        ))}
                    </div>

                    {/* 메인 이미지 */}
                    <div className="flex-1">
                        <img
                            className="w-full max-h-[100vh] object-cover"
                            // src={mainImage}
                            src='src/assets/banners/배너0.jpg'
                            alt="main-product"
                        />
                    </div>
                </div>

                {/* 제품 정보 영역 */}
                <div className="lg:w-1/2 flex flex-col gap-6">
                    <h1 className="text-2xl font-semibold">나이키 스포츠웨어</h1>
                    <p className="text-xl font-bold mt-2">49,000 원</p>

                    {/* 사이즈 선택 */}
                    <div>
                        <h3 className="text-sm font-medium my-2">사이즈 선택</h3>
                        <div className="flex flex-row gap-7">
                            {['XS', 'S', 'M', 'L', 'XL'].map(size => (
                                <TailButton color="selGhost" onClick={() => { }}>
                                    {size}
                                </TailButton>
                            ))}
                        </div>
                    </div>

                    <div className='flex w-full items-center'>
                        <div className='w-1/2 pr-3'>
                            <TailButton
                                color="navy"
                                onClick={handleCartClick}
                            >장바구니</TailButton>
                        </div>
                        <div className='w-1/2 pl-3'>
                            <TailButton
                                color="selGhost"
                                onClick={() => { }}
                            >위시리스트 ♡</TailButton>
                        </div>
                    </div>

                    {/* 기타 정보 */}
                    <div className="mt-4 text-sm text-gray-500">
                        <p>50,000원 이상 구매 시 무료배송</p>
                        <p>7일 내 무료 반품 가능</p>
                    </div>

                    <AnimatePresence>
                        {isPopupVisible && (
                            <motion.div
                                className="absolute top-28 right-10 z-10" // 팝업 위치를 정보 영역 우측 상단으로
                                initial={{ opacity: 0, y: -20, scale: 0.95 }} // 초기 상태 (투명하고, 약간 위에 있고, 작은 상태)
                                animate={{ opacity: 1, y: 0, scale: 1 }}     // 나타날 때 상태 (불투명하고, 제자리로 오고, 원래 크기)
                                exit={{ opacity: 0, y: 10, scale: 0.9 }}      // 사라질 때 상태 (투명해지고, 약간 아래로 가고, 작아짐)
                                transition={{ duration: 0.3, ease: "easeInOut" }} // 애니메이션 지속 시간 및 효과
                            >
                                <CartPopup product={product} />
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            {/* 상품 설명 & 리뷰 탭 */}
            <div className="w-9/12 mx-auto border-t border-gray-300 my-10 pt-8">
                <div className="flex">
                    {/* 왼쪽 탭 메뉴 */}
                    <div className="w-40 flex flex-col gap-2 border-r border-gray-300 pr-4">
                        <button
                            onClick={() => setSelectedTab('description')}
                            className={`text-left px-3 py-2 rounded-md ${selectedTab === 'description' ? 'bg-gray-100 font-bold' : 'text-gray-500 hover:bg-gray-50'}`}
                        >
                            상품 설명
                        </button>
                        <button
                            onClick={() => setSelectedTab('review')}
                            className={`text-left px-3 py-2 rounded-md ${selectedTab === 'review' ? 'bg-gray-100 font-bold' : 'text-gray-500 hover:bg-gray-50'}`}
                        >
                            리뷰
                        </button>
                    </div>

                    {/* 오른쪽 내용 */}
                    <div className="flex-1 pl-8">
                        {selectedTab === 'description' ? (
                            <div className="space-y-3 text-sm leading-6 text-gray-700">
                                <p>
                                    Elevate your everyday style with our Men's Black T-Shirts, the ultimate wardrobe essential for modern men. Crafted with meticulous attention to detail and designed for comfort, these versatile black tees are a must-have addition to your collection.
                                </p>
                                <p>
                                    The classic black color never goes out of style. Whether you're dressing up for a special occasion or keeping it casual, these black t-shirts are the perfect choice, effortlessly complementing any outfit.
                                </p>
                                <ul className="list-disc list-inside mt-4 space-y-1 text-sm text-gray-600">
                                    <li>Premium Quality</li>
                                    <li>Versatile Wardrobe Staple</li>
                                    <li>Available in Various Sizes</li>
                                    <li>Tailored Fit</li>
                                </ul>
                            </div>
                        ) : (
                            <div className="flex">
                                {/* 리뷰 본문 */}
                                <div className="flex-1 pl-8">
                                    <div className="flex justify-between items-center mb-6">
                                        <div>
                                            <h2 className="text-xl font-bold">리뷰 <span className="text-2xl ml-2">4.2</span> <span className="text-gray-500 ml-1">— 54 Reviews</span></h2>
                                        </div>
                                        <button className="border border-gray-300 px-4 py-2 rounded hover:border-gray-700">리뷰 쓰기</button>
                                    </div>

                                    {dummyReviews.map(review => (
                                        <div key={review.id} className="border-b border-gray-300 py-6 flex gap-4">
                                            {/* 프로필 */}
                                            <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-sm font-bold text-gray-600">
                                                {review.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                                            </div>

                                            {/* 내용 */}
                                            <div className="flex-1">
                                                <div className="flex justify-between items-center">
                                                    <div className="font-medium">{review.name}</div>
                                                    <div className="text-sm text-gray-400">{review.date}</div>
                                                </div>
                                                <p className="text-gray-700 mt-2">{review.content}</p>
                                                <div className="text-yellow-500 mt-1">
                                                    {'★'.repeat(review.rating) + '☆'.repeat(5 - review.rating)}
                                                </div>
                                            </div>
                                        </div>
                                    ))}

                                    <div className="mt-6 text-center">
                                        <button className="px-4 py-2 border border-gray-300 rounded hover:border-gray-700">더 많은 리뷰 보기</button>
                                    </div>
                                </div>
                            </div>

                        )}
                    </div>
                </div>
            </div>
        </>
    );
}