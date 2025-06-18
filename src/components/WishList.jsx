// 훅 목록
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

// UI 목록
import TailButton from '../UI/TailButton';

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

export default function WishList() {
    const [items, setItems] = useState(initialItems);
    const [animate, setAnimate] = useState(false);

    useEffect(() => {
        setAnimate(true);

        const timer = (() => {
            setAnimate(false);
        }, 600);

        return () => clearTimeout(timer);
    }, []);

    return (
        <div className='w-10/12 ml-20'>
            <h1 id='font4' className='text-kalani-navy font-bold text-2xl pb-10'>위시리스트</h1>
            {items.length === 0 ? (
                <div className="text-center py-16 border-t border-gray-200">
                    <p className="text-gray-500">
                        위시리스트가 비어있어요.<br />
                        아직 발견하지 못한 보물들이 기다리고 있어요.</p>
                    <Link to="/" className="mt-4 inline-block text-kalani-gold font-medium text-sm hover:underline">
                        <p className={`${animate ? 'animate-[jelly_0.6s]' : ''}`}>쇼핑 계속하기</p>
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
                                <div className="flex justify-between h-full">
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
                                    <div className="flex flex-col items-end space-y-2 justify-center">
                                        <TailButton variant="selGhost" onClick={() => { }}>
                                            장바구니 담기
                                        </TailButton>
                                    </div>
                                </div>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    )
}
