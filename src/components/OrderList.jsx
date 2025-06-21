import React, { useMemo } from 'react';
import orderListDummy from '../data/orderListDummy'; // 더미 데이터 import
import OrderCarousel from '../components/OrderCarousel';

// ✨ 데이터 가공 로직
function processOrderData(orders) {
    const itemsByDate = {};

    orders.forEach(order => {
        // 각 주문의 상품(items) 배열을 순회
        order.items.forEach(item => {
            // 상품 객체에 부모 주문 정보를 복사
            const itemWithOrderInfo = { ...item, orderInfo: order.orderInfo };

            const date = order.orderInfo.orderdate;

            if (!itemsByDate[date]) {
                itemsByDate[date] = []; // 해당 날짜의 배열이 없으면 새로 생성
            }
            itemsByDate[date].push(itemWithOrderInfo);
        });
    });

    return itemsByDate;
}


export default function OrderList() {
    // useMemo를 사용하여 데이터 가공이 최초 1회만 일어나도록 최적화
    const groupedItems = useMemo(() => processOrderData(orderListDummy), []);

    // 날짜를 최신순으로 정렬
    const sortedDates = Object.keys(groupedItems).sort((a, b) => new Date(b) - new Date(a));

    return (
        <div className="w-full bg-gray-100 min-h-screen">
            <div className="container mx-auto p-4 sm:p-8">
                <header className="mb-8">
                    <h1 className="text-4xl font-bold text-center">주문 목록</h1>
                    {/* ✨ 여기에 나중에 DateFilterTabs 컴포넌트가 들어갑니다. */}
                </header>

                <main>
                    {sortedDates.map(date => (
                        <OrderCarousel
                            key={date}
                            date={date}
                            items={groupedItems[date]}
                        />
                    ))}
                </main>
            </div>
        </div>
    );
}