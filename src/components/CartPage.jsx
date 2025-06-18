// 훅 목록
import { useState } from 'react';
import { Link } from 'react-router-dom';

// Icon 목록
import { FiMinus, FiPlus } from 'react-icons/fi';

const initialItems = [
    {
        id: 1,
        name: 'Raw Black T-Shirt',
        color: 'Green',
        size: 'M',
        price: 75000,
        quantity: 1,
        imageSrc: 'src/assets/items/0116379047.jpg',
        imageAlt: '검은색 티셔츠',
    },
    {
        id: 2,
        name: 'Essential Neutrals',
        color: 'Purple',
        size: 'M',
        price: 22000,
        quantity: 1,
        imageSrc: 'src/assets/items/0163734002.jpg',
        imageAlt: '흰색 티셔츠',
    },
];

export default function CartPage() {
    const [items, setItems] = useState(initialItems);

    const handleQuantityChange = (itemId, amount) => {
        setItems(prevItems =>
            prevItems.map(item =>
                item.id === itemId
                    ? { ...item, quantity: Math.max(1, item.quantity + amount) } // 수량은 최소 1
                    : item
            ).filter(item => item.quantity > 0) // 수량이 0이면 배열에서 제거 (필요시)
        );
    };

    const handleRemoveItem = (itemId) => {
        setItems(prevItems => prevItems.filter(item => item.id !== itemId));
    };

    // 주문 요약 계산
    const subtotal = items.reduce((total, item) => total + item.price * item.quantity, 0);
    const shippingFee = subtotal >= 50000 ? 0 : 3000; // 5만원 이상 무료배송
    // 상품이 있을 때만 배송비를 추가하고, 없으면 0으로 계산
    const total = subtotal > 0 ? subtotal + shippingFee : 0;

    // '15,000원' 형태로 변환하는 함수
    const formatToKRW = (price) => {
        if (typeof price !== 'number') return price;
        return price.toLocaleString('ko-KR') + '원';
    };

    return (
        <div className="bg-white">
            <main className="mx-auto max-w-screen-2xl px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
                <div>
                    <h1 id='font3' className="text-3xl lg:text-3xl tracking-tight text-kalani-navy mt-2">장바구니</h1>
                </div>

                {/* 메인 컨텐츠 영역 */}
                <div className="mt-12 lg:grid lg:grid-cols-12 lg:items-start lg:gap-x-12 xl:gap-x-16">
                    <section className="lg:col-span-8">
                        {items.length === 0 ? (
                            <div className="text-center py-16 border-y border-gray-300">
                                <p className="text-gray-500">장바구니에 담긴 상품이 없습니다.</p>
                                <Link to="/" className="mt-4 inline-block text-kalani-gold font-medium hover:underline">
                                    쇼핑 계속하기
                                </Link>
                            </div>
                        ) : (
                            <ul className="divide-y border-y border-gray-300 divide-gray-300">
                                {items.map((item) => (
                                    <li key={item.id} className="flex py-6 sm:py-8">
                                        <div className="flex-shrink-0">
                                            <Link to={`/detail/${item.id}`}>
                                                <img
                                                    src={item.imageSrc}
                                                    alt={item.imageAlt}
                                                    className="h-24 w-24 rounded-md object-cover object-center sm:h-32 sm:w-32"
                                                />
                                            </Link>
                                        </div>

                                        <div className="ml-4 flex flex-1 flex-col justify-between sm:ml-6">
                                            <div className="flex justify-between">
                                                {/* 왼쪽 섹션: 상품 정보 */}
                                                <div>
                                                    <h3 className="text-base font-medium">
                                                        <Link to={`/detail/${item.id}`} className="text-kalani-ash hover:text-kalani-gold">
                                                            {item.name}
                                                        </Link>
                                                    </h3>
                                                    <p className="mt-1 text-sm text-gray-500">
                                                        색상: {item.color}, 사이즈: {item.size}
                                                    </p>
                                                </div>

                                                {/* 오른쪽 섹션: 수량 및 가격 */}
                                                <div className="flex flex-col items-end space-y-2">
                                                    {/* 컴팩트한 아이콘 수량 조절 박스 */}
                                                    <div className="flex items-center border border-gray-200 rounded-md overflow-hidden">
                                                        {/* 빼기 버튼 */}
                                                        <button
                                                            onClick={() => handleQuantityChange(item.id, -1)}
                                                            type="button"
                                                            className="p-2 text-gray-600 hover:bg-gray-100 transition-colors duration-200"
                                                        >
                                                            <FiMinus className="w-4 h-4" />
                                                        </button>

                                                        {/* 수량 표시 (가운데 구분선 포함) */}
                                                        <div className="w-8 text-center border-x border-gray-200 font-medium text-kalani-ash">
                                                            {item.quantity}
                                                        </div>

                                                        {/* 더하기 버튼 */}
                                                        <button
                                                            onClick={() => handleQuantityChange(item.id, 1)}
                                                            type="button"
                                                            className="p-2 text-gray-600 hover:bg-gray-100 transition-colors duration-200"
                                                        >
                                                            <FiPlus className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                    {/* 가격 */}
                                                    <p className="text-base font-medium text-kalani-ash">
                                                        {formatToKRW(item.price * item.quantity)}
                                                    </p>
                                                </div>
                                            </div>

                                            <button onClick={() => handleRemoveItem(item.id)} type="button" className="mt-4 text-sm font-medium text-kalani-gold hover:text-kalani-navy self-start">
                                                삭제
                                            </button>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </section>

                    <section className="mt-16 rounded-lg bg-white border border-gray-300 lg:col-span-4 lg:mt-0 lg:p-8 p-6 shadow-nm">
                        <h2 id='font4' className="text-xl text-kalani-navy">구매 금액</h2>
                        <dl className="mt-6 space-y-4">
                            <div className="flex items-center justify-between">
                                <dt className="text-sm text-gray-600">상품금액</dt>
                                <dd className="text-sm font-medium text-kalani-ash">{formatToKRW(subtotal)}</dd>
                            </div>
                            <div className="flex items-center justify-between border-t border-kalani-stone pt-4">
                                <dt className="text-sm text-gray-600">배송비</dt>
                                <dd className="text-sm font-medium text-kalani-ash">{subtotal > 0 ? formatToKRW(shippingFee) : '무료'}</dd>
                            </div>
                            <div className="flex items-center justify-between border-t border-kalani-stone pt-4">
                                <dt className="text-base font-bold text-kalani-ash">총 구매 금액</dt>
                                <dd className="text-base font-bold text-kalani-ash">{formatToKRW(total)}</dd>
                            </div>
                        </dl>
                        <div className="mt-8">
                            <button type="submit"
                                    className="w-full rounded-md border-transparent bg-kalani-navy px-4 py-3 text-center font-bold
                                            text-white shadow-nm hover:bg-kalani-gold focus:outline-none focus:ring-2 focus:ring-offset-2
                                            focus:ring-kalani-gold focus:ring-offset-white transition-opacity disabled:bg-gray-400
                                            disabled:cursor-not-allowed" 
                                    disabled={items.length === 0}>
                                구매하기
                            </button>
                        </div>
                    </section>
                </div>
            </main>
        </div>
    );
}