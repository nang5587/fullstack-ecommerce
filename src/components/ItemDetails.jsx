import React from 'react';
import { X } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function ItemDetails({ item, onClose }) {
    if (!item) return null;

    const detailLink = `/detail/${item.imgname}`;

    return (
        <div className="bg-white p-6 rounded-2xl shadow-nm relative">
            <button
                onClick={onClose}
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-900 transition-colors p-1 rounded-full bg-gray-100 hover:bg-gray-200"
                aria-label="닫기"
            >
                <X size={20} />
            </button>

            {/* --- 이 부분이 수정되었습니다 --- */}
            <h3 id="font3" className="text-2xl font-bold mb-6 pr-10">
                <Link
                    to={detailLink}
                    className="hover:underline cursor-pointer"
                >
                    {item.name}
                </Link>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 text-gray-700">
                <div className="space-y-2">
                    <p><span className="font-semibold text-gray-500 w-28 inline-block">선택 옵션</span> {item.option}</p>
                    <p><span className="font-semibold text-gray-500 w-28 inline-block">수량</span> {item.quantity}개</p>
                    <p><span className="font-semibold text-gray-500 w-28 inline-block">가격</span> {item.price.toLocaleString()}원</p>
                </div>
                <div className="space-y-2 border-t md:border-t-0 md:border-l border-gray-200 pt-4 md:pt-0 md:pl-8">
                    <p><span className="font-semibold text-gray-500 w-28 inline-block">주문 번호</span> {item.orderInfo.orderid}</p>
                    <p><span className="font-semibold text-gray-500 w-28 inline-block">주문 상태</span>
                        <span className="font-bold ml-2 text-kalani-gold">{item.orderInfo.orderstatus}</span>
                    </p>
                    <p><span className="font-semibold text-gray-500 w-28 inline-block">총 결제 금액</span> {item.orderInfo.total.toLocaleString()}원</p>
                </div>
            </div>
        </div>
    );
}