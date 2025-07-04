// css
import './Detail.css';

// 훅 목록
import { useEffect, useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useCart } from './CartContext';
import { useAuth } from '../context/AuthContext';

// UI 목록
import TailButton from "../UI/TailButton"
import ColorSwatch from '../UI/ColorSwatch';

// component 목록
import CartPopup from './CartPopup';
import colorMap from '../local/colorMap';
import ReviewPage from './ReviewPage';

// 애니메이션 효과
import { AnimatePresence, isPrimaryPointer, motion } from 'framer-motion';

// 이미지 줌
import InnerImageZoom from 'react-inner-image-zoom';
import 'react-inner-image-zoom/src/styles.css';

// Icon 목록
import { FiMinus, FiPlus, FiX } from 'react-icons/fi';
import { BsHeart, BsHeartFill } from 'react-icons/bs';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleExclamation } from '@fortawesome/free-solid-svg-icons';

import api from '../api/axios';

export default function Detail() {
    // url로 날아오는 이미지 번호 넣을 변수
    const { productId } = useParams(); //imgname
    const { bulkAddToCart } = useCart();
    // useState
    const [mainImage, setMainImage] = useState(null);
    const [thumbnails, setThumbnails] = useState([]);
    const [product, setProduct] = useState(null);
    const [selectedSize, setSelectedSize] = useState(null);
    const [selectedOptions, setSelectedOptions] = useState([]);

    const [liked, setLiked] = useState(false);

    const [selectedTab, setSelectedTab] = useState('description');
    const [errorMsg, setErrorMsg] = useState('');

    // 리뷰 useState
    const [isPurchased, setIsPurchased] = useState(false);
    const [reviews, setReviews] = useState([]);
    const [reviewLoading, setReviewLoading] = useState(true);
    const [reviewError, setReviewError] = useState(null);
    const [showForm, setShowForm] = useState(false);

    // 상품가져오는 변수
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    // 장바구니 팝업 변수
    const [isPopupVisible, setIsPopupVisible] = useState(false);

    const { isLoggedIn, username } = useAuth();

    const navigate = useNavigate();
    const handleQnaClick = () => {
        // 실제 로그인 상태를 확인하는 로직으로 대체해야 합니다.
        const isLoggedIn = !!localStorage.getItem('accessToken');
        if (isLoggedIn) {
            // 1. 전달할 데이터를 sessionStorage에 저장합니다.
            // 키 이름은 일관성을 위해 'askAboutProductId'로 합니다.
            sessionStorage.setItem('askAboutProductId', productId);

            // 2. Q&A 페이지로 이동합니다.
            navigate('/mypage/myqna');
        } else {
            // 1. 로그인 후 돌아올 경로를 저장합니다.
            const redirectTo = '/mypage/myqna';
            sessionStorage.setItem('loginRedirectPath', redirectTo);

            // 2. Q&A 페이지로 전달해야 할 데이터도 함께 저장합니다.
            // 이 데이터는 로그인 성공 후 Q&A 페이지가 읽게 됩니다.
            sessionStorage.setItem('askAboutProductId', productId);

            // 3. 로그인 페이지로 이동합니다. 이제 state 객체는 필요 없습니다.
            navigate('/login');
        }
    };

    const sizeOrder = ['xs', 's', 'm', 'l', 'xl'];
    const sortedOptions = useMemo(() => {
        if (!product?.options) return [];
        return [...product.options].sort(
            (a, b) => sizeOrder.indexOf(a.size.toLowerCase()) - sizeOrder.indexOf(b.size.toLowerCase())
        );
    }, [product]);

    useEffect(() => {
        // 상품 정보가 로드된 후에, 그리고 로그인 상태일 때만 실행
        if (!product || !isLoggedIn) {
            // 비로그인 시에는 '좋아요'하지 않은 상태로 간주
            if (!isLoggedIn) setLiked(false);
            return;
        }

        const checkWishStatus = async () => {
            try {
                // ProductCard와 동일한 API를 호출
                const res = await api.get('/api/member/heartOn', {
                    params: { imgname: product.imgname }
                });
                setLiked(res.data === true);
            } catch (error) {
                console.error('위시리스트 상태 확인 실패:', error);
                setLiked(false);
            }
        };

        checkWishStatus();
    }, [product, isLoggedIn]);

    // 상품정보 useEffect
    // ✅ api 인스턴스를 사용하도록 수정한 useEffect
    useEffect(() => {
        window.scrollTo(0, 0);

        const fetchProduct = async () => {
            setLoading(true);
            setError(null); // 새로운 상품을 불러오기 전에 이전 에러 상태 초기화

            try {
                // 1. axios 직접 호출 대신, 설정된 api 인스턴스를 사용합니다.
                // baseURL은 자동으로 적용되므로 뒷부분 경로만 적어줍니다.
                const res = await api.get(`/api/public/detail/${productId}`);

                // 2. axios는 응답 데이터를 res.data에 담아줍니다.
                const data = res.data;
                setProduct(data);
                console.log("상품 상세 정보:", data);

                const imgs = data.imglist || [];
                const sortedImgs = [...imgs].sort((a, b) => b.ismain - a.ismain);

                // 3. 이미지 URL을 생성할 때도 하드코딩된 baseUrl 대신
                //    api 인스턴스의 기본 URL 설정을 활용하여 일관성을 유지합니다.
                const imagePairs = sortedImgs.map(img => {
                    const baseImageUrl = `${api.defaults.baseURL}/api/public/img/goods/`;
                    return {
                        small: `${baseImageUrl}${img.imgUrl}`,
                        large: `${baseImageUrl}${img.imgUrl}`
                    };
                });

                setThumbnails(imagePairs);

                if (imagePairs.length > 0) {
                    setMainImage(imagePairs[0]);
                }

            } catch (e) {
                // axios 에러 객체에서 더 자세한 정보를 얻을 수 있습니다.
                console.error("상품 정보를 불러오는 데 실패했습니다:", e.response?.data || e.message);
                setError(e);
            } finally {
                setLoading(false);
            }
        };

        // productId가 있을 때만 fetchProduct 함수를 호출합니다.
        if (productId) {
            fetchProduct();
        }
    }, [productId]);


    // 리뷰 리스트 useEffect
    // useEffect(() => {
    //     const fetchReviews = async () => {
    //         try {
    //             setReviewLoading(true);
    //             const baseUrl = import.meta.env.VITE_BACKEND_URL;
    //             const res = await axios.get(`http://${baseUrl}/api/public/reviews/${productId}`);
    //             setReviews(res.data); // ← 서버 응답 형태에 따라 조정
    //         } catch (err) {
    //             console.error("리뷰 데이터를 불러오는 데 실패함: ", err);
    //             setReviewError(err);
    //         } finally {
    //             setReviewLoading(false);
    //         }
    //     };

    //     fetchReviews();
    // }, [productId]);


    const handleSizeClick = (size) => {
        if (selectedOptions.find(opt => opt.size === size)) return;

        const optionData = product.options.find(opt => opt.size === size);
        if (!optionData) return;

        setSelectedOptions(prev => [
            ...prev,
            {
                size,
                quantity: 1,
                price: Number(product.price) || 0,
                optionid: optionData.optionid,
            }
        ]);
    };


    const handleCartClick = () => {
        console.log(product)
        if (selectedOptions.length === 0) {
            setErrorMsg('사이즈를 선택해주세요')

            setTimeout(() => {
                setErrorMsg('');
            }, 2000);
            return;
        }
        const itemsToAdd = selectedOptions.map((opt) => ({
            imgname: product.imgname,
            optionid: opt.optionid,
            productName: product.productName,
            price: opt.price,
            color: product.color,
            size: opt.size,
            quantity: opt.quantity,
            imgUrl: `${product.imgname.slice(0, 3)}/${product.imgname}_main.jpg`,  // 예: "300/300024063_main.jpg"
            imageAlt: `${product.productName} - ${product.color}`,
        })
        )
        console.log('itemsToAdd:', itemsToAdd);
        console.log('bulkAddToCart 직전 cartItems 타입:', Array.isArray(itemsToAdd), itemsToAdd);
        bulkAddToCart(itemsToAdd);
        console.log('bulkAddToCart 직전 cartItems 타입:', Array.isArray(itemsToAdd), itemsToAdd);

        console.log('들어간거 : ', itemsToAdd)
        setSelectedOptions([]);

        setIsPopupVisible(true);
        setTimeout(() => {
            setIsPopupVisible(false);
        }, 2000); // 2초 후 사라짐
    }

    const handleWishToggle = async (e) => {
        e.preventDefault();

        if (!isLoggedIn) {
            alert('로그인이 필요한 기능입니다.');
            return;
        }

        // 서버에서 상태 확인 중일 때는 클릭 방지
        if (liked === null || !product) return;

        const originalLiked = liked;
        const newLiked = !liked;
        setLiked(newLiked); // UI 즉시 업데이트 (낙관적 업데이트)

        try {
            if (newLiked) {
                await api.post('/api/member/addwish',
                    `${product.imgname}`
                );
            } else {
                await api.delete('/api/member/deletewish', {
                    params: {
                        imgname: product.imgname
                    }
                });
            }
        } catch (error) {
            console.error('위시리스트 업데이트 실패:', error);
            alert("요청 처리 중 오류가 발생했습니다.");
            setLiked(originalLiked); // 실패 시 UI 롤백
        }
    };

    if (loading) {
        return <div>로딩 스켈레톤 UI...</div>; // TODO: 스켈레톤 UI 컴포넌트로 교체
    }
    if (error || !product) {
        return <div>에러 발생: 상품 정보를 불러올 수 없습니다.</div>;
    }


    return (
        <>
            <div className="w-full max-w-7xl mx-auto flex flex-col lg:flex-row gap-12 lg:gap-20 px-4 sm:px-6 lg:px-8 py-10">
                {/* 이미지 영역 */}
                <div className="flex flex-row lg:w-1/2 lg:sticky lg:top-24 self-start">
                    {/* 썸네일 목록 */}
                    <div className="w-20 pr-4 flex-shrink-0">
                        <div className="flex flex-col gap-2">
                            {thumbnails.map((thumb, idx) => (
                                <div
                                    key={idx}
                                    className={`w-full aspect-[3/4] overflow-hidden cursor-pointer border-2
                                    ${mainImage?.small === thumb.small ? 'border-black' : 'border-transparent'}`}
                                    onClick={() => setMainImage(thumb)}
                                >
                                    <img src={thumb.small} alt={`thumb-${idx}`} className="w-full h-full object-cover" />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* 메인 이미지 */}
                    <div className="flex-1 w-full relative">
                        <div className="w-full max-w-2xl mx-auto aspect-[3/4] bg-gray-100">
                            {mainImage && (
                                <InnerImageZoom
                                    src={mainImage.small}
                                    zoomSrc={mainImage.large}
                                    fullscreenOnMobile={true}
                                    zoomScale={1.5}
                                    imgAttributes={{
                                        className: "w-full h-full object-cover"
                                    }}
                                />
                            )}
                        </div>
                    </div>
                </div>

                {/* 제품 정보 영역 */}
                <div className="lg:w-1/2 flex flex-col gap-4">
                    <h1 className="text-2xl font-semibold">{product?.productName}</h1>
                    <p className="text-xl font-bold mt-2">{product?.price.toLocaleString()}원</p>

                    {/* 컬러 선택 */}
                    <div className="flex items-center gap-4">
                        <div className="w-8 h-8">
                            <ColorSwatch colorCode={colorMap[product?.color]} selected={true} />
                        </div>
                        <span className="text-sm text-gray-600 capitalize">{product?.color}</span>
                    </div>

                    {/* 사이즈 선택 */}
                    <div>
                        <h3 className="text-sm font-medium my-2">사이즈</h3>
                        <div className="flex flex-row gap-7 justify-stretch">
                            {sortedOptions.map(opt => {
                                const isOutOfStock = opt.stock === 0;
                                return (
                                    <TailButton
                                        key={opt.optionid}
                                        onClick={() => handleSizeClick(opt.size)}
                                        disabled={opt.stock === 0}
                                        className={`flex-1 rounded-md ${opt.stock === 0 ? 'text-gray-400 cursor-not-allowed' : ''}`}
                                    >
                                        {opt.size.toUpperCase()} {isOutOfStock === 0 && '(품절)'}
                                    </TailButton>
                                );
                            })}
                        </div>
                    </div>

                    {selectedOptions.map((opt, idx) => (
                        <div
                            key={idx}
                            className="border border-gray-200 rounded-md p-4 flex justify-between items-center"
                        >
                            <div className="space-y-1">
                                <p className="font-medium">사이즈 {opt.size.toUpperCase()}</p>
                                <p className="text-sm text-gray-600">
                                    가격 {(opt.price * opt.quantity).toLocaleString()}원
                                </p>
                            </div>

                            <div className="flex items-center gap-2">
                                <button
                                    className="p-2 text-gray-600 hover:bg-gray-100 transition-colors duration-200"
                                    onClick={() =>
                                        setSelectedOptions(prev =>
                                            prev.map(o =>
                                                o.size === opt.size && o.quantity > 1
                                                    ? { ...o, quantity: o.quantity - 1 }
                                                    : o
                                            )
                                        )
                                    }
                                ><FiMinus className="w-4 h-4" /></button>
                                <span>{opt.quantity}</span>
                                <button
                                    className="p-2 text-gray-600 hover:bg-gray-100 transition-colors duration-200"
                                    onClick={() =>
                                        setSelectedOptions(prev =>
                                            prev.map(o =>
                                                o.size === opt.size
                                                    ? { ...o, quantity: o.quantity + 1 }
                                                    : o
                                            )
                                        )
                                    }
                                ><FiPlus className="w-4 h-4" /></button>
                                <button
                                    className="ml-4 text-gray-400 hover:text-kalani-gold"
                                    onClick={() =>
                                        setSelectedOptions(prev =>
                                            prev.filter(o => o.size !== opt.size)
                                        )
                                    }
                                >✕</button>
                            </div>
                        </div>
                    ))}
                    {selectedOptions.length > 0 && (
                        <div className="text-right mt-3 pr-2">
                            <span className="text-base font-semibold text-gray-800">
                                총 금액 {' '}
                                <span className="text-kalani-navy text-lg">
                                    {selectedOptions.reduce((sum, opt) => sum + opt.price * opt.quantity, 0).toLocaleString()}원
                                </span>
                            </span>
                        </div>
                    )}

                    <div className='flex w-full items-center'>
                        <div className='w-1/2 pr-3'>
                            <TailButton
                                variant="navy"
                                onClick={handleCartClick}
                                className='w-full rounded-md'
                            >장바구니</TailButton>
                        </div>
                        <div className='w-1/2 pl-3'>
                            <TailButton
                                variant="selGhost"
                                onClick={handleWishToggle}
                                disabled={liked === null} // 확인 중일 때 비활성화
                                className='w-full rounded-md inline-flex justify-center items-center'
                            >
                                위시리스트
                                {liked ? (
                                    <BsHeartFill className="text-rose-600 w-4 h-4 transition-colors duration-200" />
                                ) : (
                                    <BsHeart className="text-gray-500 w-4 h-4 drop-shadow transition-colors duration-200" />
                                )}
                            </TailButton>
                        </div>
                    </div>

                    {/* 기타 정보 */}
                    <div className="mt-4 text-sm text-gray-500">
                        <p>50,000원 이상 구매 시 무료배송</p>
                        <p>7일 내 무료 반품 가능</p>
                    </div>

                    <div className={`transition-all duration-300 ${errorMsg ? 'mt-6 opacity-100' : 'opacity-0 h-0'}`}>
                        {errorMsg && (
                            <div className="px-4 py-3 flex justify-between items-center gap-5 text-sm rounded-lg bg-kalani-creme text-gray-700">
                                <span>
                                    <FontAwesomeIcon icon={faCircleExclamation} />&nbsp;
                                    {errorMsg}
                                </span>
                            </div>
                        )}
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
                                <CartPopup product={product} selectedOptions={selectedOptions} />
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            {/* 상품 설명 & 리뷰 탭 */}
            <div className="w-full max-w-6xl mx-auto border-t border-gray-300 my-10 pt-8 px-4 sm:px-6 lg:px-8">
                <div className="flex">
                    {/* 왼쪽 탭 메뉴 */}
                    <div className="w-40 flex flex-col gap-2 border-r border-gray-300 pr-4">
                        <button
                            onClick={() => setSelectedTab('description')}
                            className={`text-left px-3 py-2 rounded-md ${selectedTab === 'description' ? 'bg-gray-100 font-semibold' : 'text-gray-500 hover:bg-gray-50 hover:text-kalani-gold'}`}
                        >
                            상품 설명
                        </button>
                        <button
                            onClick={() => setSelectedTab('review')}
                            className={`text-left px-3 py-2 rounded-md ${selectedTab === 'review' ? 'bg-gray-100 font-semibold' : 'text-gray-500 hover:bg-gray-50 hover:text-kalani-gold'}`}
                        >
                            리뷰
                        </button>
                        <button
                            onClick={handleQnaClick} // 새로 만든 핸들러 연결
                            className="text-left px-3 py-2 rounded-md text-gray-500 hover:bg-gray-50 hover:text-kalani-gold"
                        >
                            Q&A
                        </button>
                    </div>

                    {/* 오른쪽 내용 */}
                    <div className="flex-1 pl-8">
                        {selectedTab === 'description' ? (
                            <div className="space-y-3 text-sm leading-6 text-gray-700">
                                <p className="text-sm leading-6 text-gray-700 whitespace-pre-wrap">{product?.description}</p>
                            </div>
                        ) : selectedTab === 'review' ? (
                            // orderid, username, imgname, optionid, reviewtext, rating(별), createdat
                            <ReviewPage isLoggedIn={isLoggedIn} productId={productId} username={username} />
                        ) : null}
                    </div>
                </div>
            </div>
        </>
    );
}