// 훅 목록
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from './CartContext';
import { useAuth } from '../context/AuthContext';

// Icon 목록
import { FiMinus, FiPlus, FiCheck } from 'react-icons/fi';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleExclamation } from '@fortawesome/free-solid-svg-icons';

// component 목록
import ErrorMessage from './ErrorMessage';

// UI 목록
import TailButton from '../UI/TailButton';

export default function CartPage() {
    const { isLoggedIn } = useAuth();
    const [errorMsg, setErrorMsg] = useState('');
    const { cartItems, updateQuantity, removeItem, clearCart, updatingItems } = useCart();

    const [selectedItems, setSelectedItems] = useState([]);

    // cartItems가 로딩된 이후에 selectedItems 초기화
    useEffect(() => {
        if (cartItems.length > 0) {
            const allKeys = cartItems.map(item => `${item.optionid}-${item.size}`);
            setSelectedItems(allKeys);
        } else {
            setSelectedItems([]);
        }
    }, [cartItems]);

    // 체크박스 토글 함수
    const toggleSelectItem = (optionid, size) => {
        const key = `${optionid}-${size}`;
        setSelectedItems(prev =>
            prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key]
        );
    };

    // 선택된 아이템만 필터링
    const selectedCartItems = Array.isArray(cartItems)
        ? cartItems.filter(item => selectedItems.includes(`${item.optionid}-${item.size}`))
        : [];

    // 구매하기 버튼 클릭 핸들러
    const handleOrder = () => {
        if (!isLoggedIn) {
            setErrorMsg('로그인이 필요합니다.');
            return;
        }
        if (selectedCartItems.length === 0) {
            setErrorMsg('하나 이상 선택해 주세요.');
            return;
        }
        // 예: 선택된 상품만 쿼리나 상태로 order 페이지에 전달
        // 여기선 간단히 로컬스토리지 저장 또는 라우터 state 활용 가능
        localStorage.setItem('orderItems', JSON.stringify(selectedCartItems));
        window.location.href = '/order';
    };

    useEffect(() => {
        if (errorMsg) {
            const timer = setTimeout(() => setErrorMsg(''), 3000);
            return () => clearTimeout(timer);
        }
    }, [errorMsg]);

    // 주문 요약 계산
    const subtotal = selectedCartItems.reduce((total, item) => total + item.price * item.quantity, 0);
    console.log(cartItems)
    const shippingFee = subtotal >= 50000 ? 0 : 3000; // 5만원 이상 무료배송
    // 상품이 있을 때만 배송비를 추가하고, 없으면 0으로 계산
    const total = subtotal > 0 ? subtotal + shippingFee : 0;

    // '15,000원' 형태로 변환하는 함수
    const formatToKRW = (price) => {
        if (typeof price !== 'number') return price;
        return price.toLocaleString('ko-KR') + '원';
    };

    const baseUrl = import.meta.env.VITE_BACKEND_URL;


    return (
        <div className="bg-white">
            <main className="mx-auto max-w-screen-2xl px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
                <div>
                    <h1 id='font3' className="text-3xl lg:text-3xl tracking-tight text-kalani-navy mt-2">장바구니</h1>
                </div>

                {/* 메인 컨텐츠 영역 */}
                <div className="mt-12 lg:grid lg:grid-cols-12 lg:items-start lg:gap-x-12 xl:gap-x-16">
                    <section className="lg:col-span-8">
                        {Array.isArray(cartItems) && cartItems.length > 0 ? (
                            <>

                                <div className='flex justify-end items-center'>
                                    <TailButton
                                        type="button"
                                        className="my-4"
                                        onClick={() => {
                                            if (window.confirm("장바구니를 모두 비우시겠습니까?")) {
                                                clearCart();
                                            }
                                        }}
                                    >
                                        전체 비우기
                                    </TailButton>
                                </div>
                                <ul className="divide-y border-y border-gray-300 divide-gray-300">
                                    {cartItems.map((item) => {

                                        const itemKey = `${item.optionid}-${item.size}`;
                                        const isLoading = !!updatingItems[itemKey];

                                        // 이제 isLoading은 절대 undefined가 아니고, 항상 true 또는 false 입니다.
                                        console.log(`아이템: ${itemKey}, 로딩중?: ${isLoading}`);

                                        return (
                                            <li key={`${item.optionid}-${item.size}`} className="flex py-6 sm:py-8 gap-4">
                                                <label className="relative inline-flex items-center cursor-pointer">
                                                    <input
                                                        type="checkbox"
                                                        checked={selectedItems.includes(`${item.optionid}-${item.size}`)}
                                                        onChange={() => toggleSelectItem(item.optionid, item.size)}
                                                        className="absolute w-0 h-0 peer opacity-0"
                                                    />
                                                    <div className="w-5 h-5 flex items-center justify-center border-2 border-gray-300 rounded-md peer-checked:bg-gray-300 peer-checked:border-gray-300 transition-colors duration-200">
                                                        <FiCheck className="w-4 h-4 text-white font-bold" />
                                                    </div>
                                                </label>

                                                <div className="flex-shrink-0">
                                                    <Link to={`/detail/${item.imgname}`}>
                                                        <img
                                                            src={`http://${baseUrl}/api/public/img/goods/${item.imgUrl}`}
                                                            alt={item.imageAlt}
                                                            className="h-24 w-24 sm:h-32 sm:w-32 rounded-md object-cover object-center hover-scale-image"
                                                        />
                                                    </Link>
                                                </div>

                                                <div className="ml-4 flex flex-1 flex-col justify-between sm:ml-6">
                                                    <div className="flex justify-between">
                                                        <div>
                                                            <h3 className="text-base font-medium">
                                                                <Link to={`/detail/${item.optionid}`} className="text-kalani-ash hover:text-kalani-gold font-bold">
                                                                    {item.productName}
                                                                </Link>
                                                            </h3>
                                                            <p className="mt-1 text-sm text-gray-500">
                                                                사이즈: {item.size}
                                                            </p>
                                                        </div>

                                                        <div className="flex flex-col items-end space-y-2">
                                                            <div className="flex items-center border border-gray-200 rounded-md overflow-hidden">
                                                                <button
                                                                    onClick={() => updateQuantity(item.optionid, item.size, -1)}
                                                                    disabled={isLoading || item.quantity <= 1} 
                                                                    type="button"
                                                                    className="p-2 text-gray-600 hover:bg-gray-100 transition-colors duration-200"
                                                                >
                                                                    <FiMinus className="w-4 h-4" />
                                                                </button>
                                                                <div className="w-8 text-center border-x border-gray-200 font-medium text-kalani-ash">
                                                                    {item.quantity}
                                                                </div>
                                                                <button
                                                                    onClick={() => updateQuantity(item.optionid, item.size, 1)}
                                                                    disabled={isLoading}
                                                                    type="button"
                                                                    className="p-2 text-gray-600 hover:bg-gray-100 transition-colors duration-200"
                                                                >
                                                                    <FiPlus className="w-4 h-4" />
                                                                </button>
                                                            </div>
                                                            <p className="text-base font-medium text-kalani-ash">
                                                                {formatToKRW(item.price * item.quantity)}
                                                            </p>
                                                        </div>
                                                    </div>

                                                    <div className="flex justify-end items-center">
                                                        <button
                                                            onClick={() => removeItem(item.optionid, item.size)}
                                                            type="button"
                                                            className="mt-4 text-sm font-medium text-kalani-gold hover:text-kalani-navy self-start"
                                                        >
                                                            삭제
                                                        </button>
                                                    </div>
                                                </div>
                                            </li>
                                        )
                                    })}
                                </ul>
                            </>
                        ) : (
                            <div className="text-center py-16 border-y border-gray-300">
                                <p className="text-gray-500">장바구니에 담긴 상품이 없습니다.</p>
                                <Link to="/" className="mt-4 inline-block text-kalani-gold font-medium hover:underline">
                                    쇼핑 계속하기
                                </Link>
                            </div>
                        )
                        }
                    </section>

                    <section
                        className="mt-16 rounded-lg bg-white border border-gray-300 lg:col-span-4 lg:mt-0 lg:p-8 p-6 shadow-nm sticky top-20"
                    >
                        <h2 id='font3' className="text-xl text-kalani-navy">구매 금액</h2>
                        <dl className="mt-6 space-y-4">
                            <div className="flex items-center justify-between">
                                <dt className="text-sm text-gray-600">상품금액</dt>
                                <dd className="text-sm font-medium text-kalani-ash">{formatToKRW(subtotal)}</dd>
                            </div>
                            <div className="flex items-center justify-between border-t border-kalani-stone pt-4">
                                <dt className="text-sm text-gray-600">배송비</dt>
                                <dd className="text-sm font-medium text-kalani-ash">{subtotal > 0 ? formatToKRW(shippingFee) : formatToKRW(0)}</dd>
                            </div>
                            <div className="flex items-center justify-between border-t border-kalani-stone pt-4">
                                <dt className="text-base font-bold text-kalani-ash">총 구매 금액</dt>
                                <dd className="text-base font-bold text-kalani-ash">{formatToKRW(total)}</dd>
                            </div>
                        </dl>

                        <div className="mt-8">
                            <TailButton type="submit" variant="navy" className="w-full mt-4 hover:bg-kalani-gold" onClick={handleOrder}>
                                구매하기
                            </TailButton>
                            <div className={`transition-all duration-300 ${errorMsg ? 'mt-6 opacity-100' : 'opacity-0 h-0'}`}>
                                {errorMsg && (
                                    <div className="p-3 flex flex-col justify-between items-center gap-5 text-sm rounded-lg bg-kalani-creme text-gray-700">
                                        <span>
                                            <FontAwesomeIcon icon={faCircleExclamation} />&nbsp;
                                            {errorMsg}
                                        </span>

                                        {!isLoggedIn && <TailButton
                                            variant="navy"
                                            onClick={() => {
                                                window.location.href = '/login?redirect=/cart';
                                            }}
                                            className="px-4 py-2 text-sm"
                                        >
                                            로그인하러 가기
                                        </TailButton>}
                                    </div>
                                )}

                            </div>
                        </div>
                    </section>
                </div>
            </main>
        </div>
    );
}