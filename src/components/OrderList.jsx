// src/components/OrderList.js

import React, { useMemo } from "react";
import orderListDummy from "../data/orderListDummy";
import DateCarousel from "./DateCarousel"; // 새로 만들 캐러셀 컴포넌트

export default function OrderList() {
    // 날짜별로 주문 아이템을 그룹화 (이전과 동일한 로직)
    const groupedByDate = useMemo(() => {
        const cutoffDate = new Date("2025-06-10");
        const groups = orderListDummy.reduce((acc, order) => {
            const orderDate = new Date(order.orderInfo.orderdate);
            if (orderDate < cutoffDate) return acc;
            const dateString = order.orderInfo.orderdate;

            if (!acc[dateString]) {
                acc[dateString] = {
                    date: dateString,
                    items: [],
                };
            }
            // 한 주문에 포함된 모든 상품을 해당 날짜 그룹에 추가
            acc[dateString].items.push(...order.items);
            return acc;
        }, {});

        // 최신 날짜 순으로 정렬된 배열로 변환
        return Object.values(groups).sort(
            (a, b) => new Date(b.date) - new Date(a.date)
        );
    }, []);

    return (
        <div className="p-4 md:p-6 max-w-5xl mx-auto space-y-12">
            <h2 className="text-3xl font-bold mb-6 text-center">주문 내역</h2>

            {/* 그룹화된 데이터를 순회하며 날짜별 캐러셀 생성 */}
            {groupedByDate.map((group) => (
                <DateCarousel
                    key={group.date}
                    date={group.date}
                    items={group.items}
                />
            ))}

            {groupedByDate.length === 0 && (
                <div className="text-center p-10 text-gray-500">최근 주문 내역이 없습니다.</div>
            )}
        </div>
    );
}