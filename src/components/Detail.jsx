// css
import './Detail.css';

// 훅 목록
import { useEffect, useState, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { useCart } from './CartContext';
import { useAuth } from '../context/AuthContext';

// UI 목록
import TailButton from "../UI/TailButton"
import ColorSwatch from '../UI/ColorSwatch';

// component 목록
import CartPopup from './CartPopup';
import colorMap from '../local/colorMap';
import ReviewWriteForm from './ReviewWriteForm';

// 애니메이션 효과
import { AnimatePresence, motion } from 'framer-motion';

// 이미지 줌
import InnerImageZoom from 'react-inner-image-zoom';
import 'react-inner-image-zoom/src/styles.css';

// Icon 목록
import { FiMinus, FiPlus, FiX } from 'react-icons/fi';
import { BsHeart, BsHeartFill } from 'react-icons/bs';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleExclamation } from '@fortawesome/free-solid-svg-icons';


export default function Detail() {
    // url로 날아오는 이미지 번호 넣을 변수
    const { productId } = useParams();
    const { addToCart } = useCart();

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

    // 상품가져오는 변수
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    // 장바구니 팝업 변수
    const [isPopupVisible, setIsPopupVisible] = useState(false);

    const { isLoggedIn, username } = useAuth();

    const sizeOrder = ['xs', 's', 'm', 'l', 'xl'];
    const sortedOptions = useMemo(() => {
        if (!product?.options) return [];
        return [...product.options].sort(
            (a, b) => sizeOrder.indexOf(a.size.toLowerCase()) - sizeOrder.indexOf(b.size.toLowerCase())
        );
    }, [product]);

    // 상품정보 useEffect
    useEffect(() => {
        window.scrollTo(0, 0);
        const fetchProduct = async () => {
            setLoading(true);
            try {
                const baseUrl = import.meta.env.VITE_BACKEND_URL;
                const res = await axios.get(`http://${baseUrl}/api/public/detail/${productId}`);
                const data = res.data;
                setProduct(data);

                const imgs = data.imglist || [];
                const sortedImgs = [...imgs].sort((a, b) => b.ismain - a.ismain);

                const imagePairs = sortedImgs.map(img => {
                    const baseImageUrl = `http://${baseUrl}/api/public/img/goods/`;
                    return {
                        small: `${baseImageUrl}${img.imgUrl}`,
                        // 고화질 이미지는 다른 경로에 있다고 가정 (예: /large/ 폴더)
                        // 백엔드와 경로를 맞춰야 합니다.
                        large: `${baseImageUrl}${img.imgUrl}`
                    };
                });

                setThumbnails(imagePairs);

                if (imagePairs.length > 0) {
                    setMainImage(imagePairs[0]);
                }
            }
            catch (e) {
                setError(e);
            }
            finally {
                setLoading(false)
            }
        };

        fetchProduct();
    }, [productId]);

    // 구매 확인 useEffect
    useEffect(() => {
        const checkPurchased = async () => {
            if (!isLoggedIn || !username || !productId) return;
            try {
                const baseUrl = import.meta.env.VITE_BACKEND_URL;
                const res = await axios.get(`http://${baseUrl}/api/private/purchased/${username}/${productId}`);
                setIsPurchased(res.data === true); // 백엔드 응답 형태에 따라 조정
            } catch (err) {
                console.error('구매 여부 확인 실패:', err);
            }
        };
        checkPurchased();
    }, [isLoggedIn, username, productId]);

    // 리뷰 리스트 useEffect
    useEffect(() => {
        const fetchReviews = async () => {
            try {
                setReviewLoading(true);
                const baseUrl = import.meta.env.VITE_BACKEND_URL;
                const res = await axios.get(`http://${baseUrl}/api/public/reviews/${productId}`);
                setReviews(res.data); // ← 서버 응답 형태에 따라 조정
            } catch (err) {
                console.error("리뷰 데이터를 불러오는 데 실패함: ", err);
                setReviewError(err);
            } finally {
                setReviewLoading(false);
            }
        };

        fetchReviews();
    }, [productId]);


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
        selectedOptions.forEach((opt) => {
            addToCart({
                id: opt.optionid,
                name: product.productName,
                price: opt.price,
                color: product.color,
                size: opt.size,
                quantity: opt.quantity,
                imageSrc: thumbnails[0]?.small || '', // 대표 이미지 (없으면 공백)
                imageAlt: `${product.productName} - ${product.color}`,
            })
        })
        console.log('들어간거 : ', selectedOptions)
        setSelectedOptions([]);

        setIsPopupVisible(true);
        setTimeout(() => {
            setIsPopupVisible(false);
        }, 2000); // 2초 후 사라짐
    }

    const handleReviewSubmit = async ({ text, rating }) => {
        try {
            const baseUrl = import.meta.env.VITE_BACKEND_URL;
            // ⭐
            await axios.post(`http://${baseUrl}/api/public/reviews`, {
                orderid,
                optionid,
                username,
                imgname: productId,
                reviewtext: text,
                rating
            });

            // ⭐
            const res = await axios.get(`http://${baseUrl}/api/public/reviewlist/${productId}`); 
            setReviews(res.data);

            setShowForm(false);
        }
        catch(err){
            console.error("리뷰 등록 실패:", err);
            // ⭐
            alert("리뷰 등록에 실패했습니다.");
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
                                        key={opt.id}
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
                                onClick={(e) => {
                                    e.preventDefault(); // Link 클릭 방지
                                    setLiked((prev) => !prev);
                                }}
                                className='w-full rounded-md inline-flex justify-center items-center'
                            >위시리스트&nbsp;{liked ? (
                                <BsHeartFill className="text-rose-600 w-4 h-4 transition-colors duration-200" />
                            ) : (
                                <BsHeart className="text-gray-500 w-4 h-4 drop-shadow transition-colors duration-200" />
                            )}</TailButton>
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
                    </div>

                    {/* 오른쪽 내용 */}
                    <div className="flex-1 pl-8">
                        {selectedTab === 'description' ? (
                            <div className="space-y-3 text-sm leading-6 text-gray-700">
                                <p className="text-sm leading-6 text-gray-700 whitespace-pre-wrap">{product?.description}</p>
                            </div>
                        ) : (
                            // orderid, username, imgname, optionid, reviewtext, rating(별), createdat
                            <div className="flex">
                                {/* 리뷰 본문 */}
                                <div className="flex-1 pl-8">
                                    <div className="flex justify-between items-center mb-6">
                                        <div>
                                            <h2 className="text-xl font-bold">리뷰 <span className="text-2xl ml-2">4.2</span> <span className="text-gray-500 ml-1">— 54 Reviews</span></h2>
                                        </div>
                                        {isLoggedIn && isPurchased && (
                                            <>
                                                <button
                                                    onClick={() => setShowForm(prev => !prev)}
                                                    className="border border-gray-300 px-4 py-2 rounded hover:border-gray-700"
                                                >
                                                    {showForm ? '리뷰 삭제' : '리뷰 쓰기'}
                                                </button>
                                                {showForm && <ReviewWriteForm onSubmit={handleReviewSubmit} />}
                                            </>
                                        )}

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