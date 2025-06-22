import React, { useState, useMemo, useEffect, useCallback } from "react";
import orderListDummy from "../data/orderListDummy";
import DateCarousel from "./DateCarousel";
import DateFilter from "./DateFilter";
import { format } from 'date-fns';

import api from '../api/axios'

// 날짜 계산
import { subDays, startOfDay, endOfDay } from 'date-fns';

function BackgroundLayers() {
    return (
        <>
            {/* 하늘 그라데이션 배경 */}
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-orange-50 to-rose-100"></div>

            {/* 회전하는 태양 */}
            <img
                src="/wishImgs/sun.png"
                alt="Rotating sun"
                className="absolute -top-50 -right-50 w-[500px] h-[500px] opacity-70 animate-spin-slow z-10"
            />

            {/* 물결 SVG 레이어들 (흰색 계열로 색상 변경) */}
            <Wave className="absolute bottom-0 left-0 w-[200%] h-auto text-white/50 animate-wave-slow" style={{ bottom: '-10px' }} />
            <Wave className="absolute bottom-0 left-0 w-[200%] h-auto text-white/40 animate-wave-medium" style={{ bottom: '-5px' }} />
            <Wave className="absolute bottom-0 left-0 w-[200%] h-auto text-white/30 animate-wave-fast" />
        </>
    );
}

// Wave 컴포넌트는 그대로 사용합니다.
function Wave({ className, ...props }) {
    const wavePath = "M0,160L48,181.3C96,203,192,245,288,240C384,235,480,181,576,149.3C672,117,768,107,864,128C960,149,1056,203,1152,213.3C1248,224,1344,192,1392,176L1440,160L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z";
    return (
        <div className={className} {...props}>
            <svg className="w-1/2 h-auto inline-block" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320"><path fill="currentColor" fillOpacity="1" d={wavePath}></path></svg>
            <svg className="w-1/2 h-auto inline-block" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320"><path fill="currentColor" fillOpacity="1" d={wavePath}></path></svg>
        </div>
    );
}

export default function OrderList() {
    const [orders, setOrders] = useState([]);
    // 2. 선택된 아이템을 저장할 상태를 만듭니다.
    const [selectedItem, setSelectedItem] = useState(null);
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [activePreset, setActivePreset] = useState('전체');

    // 전체 목록 가져오기
    // const fetchOrders = useCallback(async () => {
    //     try {
    //         const res = await api.get('/api/⭐');
    //         setOrders(res.data);
    //         console.log("백앤드로 받은 주문내역 : ", orders);
    //     } catch (e) {
    //         console.error('주문 목록 불러오기 실패:', e);
    //     }
    // }, []);

    // useEffect(() => {
    //     fetchOrders();
    // }, [fetchOrders]);

    const dailyTotals = useMemo(() => {
        return orderListDummy.reduce((acc, order) => { // ⭐ orderListDummy => orders
            const date = order.orderInfo.orderdate;
            const total = order.orderInfo.total;
            acc[date] = (acc[date] || 0) + total;
            return acc;
        }, {});
    }, []);

    const highlightedDates = useMemo(() => {
        // dailyTotals 객체의 모든 키(날짜 문자열)를 가져와서
        // 각 문자열을 new Date()를 통해 실제 Date 객체로 변환합니다.
        return Object.keys(dailyTotals).map(dateStr => new Date(dateStr));
    }, [dailyTotals]);

    const groupedByDate = useMemo(() => {
        // ✅ 4. 필터링 로직을 그룹화 이전에 먼저 적용합니다.
        const filteredOrders = orderListDummy.filter(order => { // ⭐ orderListDummy => orders
            // 시작일이나 종료일이 없으면 필터링하지 않음 (전체 보기)
            if (!startDate || !endDate) return true;

            const orderDate = new Date(order.orderInfo.orderdate);
            // 날짜 비교 시 시/분/초를 포함하여 정확하게 비교
            return orderDate >= startOfDay(startDate) && orderDate <= endOfDay(endDate);
        });

        // 필터링된 데이터를 기준으로 그룹화를 진행합니다.
        const groups = filteredOrders.reduce((acc, order) => {
            const dateString = order.orderInfo.orderdate;
            if (!acc[dateString]) {
                acc[dateString] = { date: dateString, items: [] };
            }
            const itemsWithOrderInfo = order.items.map(item => ({
                ...item,
                orderInfo: order.orderInfo,
            }));
            acc[dateString].items.push(...itemsWithOrderInfo);
            return acc;
        }, {});

        return Object.values(groups).sort(
            (a, b) => new Date(b.date) - new Date(a.date)
        );
    }, [orders, startDate, endDate]);

    // 4. 카드를 클릭했을 때 실행될 함수.
    const handleItemSelect = (item) => {
        // 함수형 업데이트를 사용하여 항상 최신 상태를 기준으로 판단합니다.
        setSelectedItem(currentItem => {
            // 1. 아무것도 선택되지 않았을 때 -> 클릭한 아이템을 선택한다.
            if (currentItem === null) {
                return item;
            }

            // 2. 무언가 선택되어 있을 때
            // 2-1. 현재 선택된 아이템과 같은 것을 클릭했을 때 -> 선택을 해제한다 (닫기).
            if (currentItem.optionid === item.optionid) {
                return null;
            }

            // 2-2. (핵심) 현재 선택된 아이템과 다른 것을 클릭했을 때 -> 아무것도 하지 않는다 (상태 유지).
            return currentItem;
        });
    };

    const handleDateChange = (start, end) => {
        setStartDate(start);
        setEndDate(end);
        setActivePreset(null); // 사용자 지정 범위 선택 시, 프리셋 활성화 해제
    };

    // ✅ 7. 프리셋 버튼을 클릭했을 때 호출될 함수
    const handlePresetClick = (preset) => {
        const today = new Date();

        // '전체'를 클릭했을 때의 로직을 가장 먼저 처리
        if (preset === '전체') {
            setStartDate(null);
            setEndDate(null);
            setActivePreset('전체');
            return; // 여기서 함수 실행을 종료
        }

        // 나머지 프리셋에 대한 처리
        let newStartDate = null;

        // ❗'1주일'로 텍스트를 통일합니다. (DateFilter의 presets 배열과 일치시키기)
        if (preset === '1주일') {
            newStartDate = subDays(today, 7);
        } else if (preset === '1개월') {
            newStartDate = subDays(today, 30);
        } else if (preset === '3개월') {
            newStartDate = subDays(today, 90);
        }

        setStartDate(newStartDate);
        setEndDate(today); // 종료일은 항상 오늘
        setActivePreset(preset);
    };

    const handleCancelOrder = async (orderid) => {
        try {
            console.log('백앤드로 보낼 주문취소건 : ', )
            await api.patch('/api/⭐', { orderid });
            await fetchOrders();
        } catch (error) {
            console.error('주문 취소 실패:', error);
        }
    };

    // 컴포넌트가 처음 렌더링될 때 '전체' 프리셋을 기본으로 설정
    React.useEffect(() => {
        handlePresetClick('전체');
    }, []);

    return (
        <div className="w-11/12 ml-20"> {/* 이 구조는 그대로 유지합니다. */}
            {/* 2. 메인 컨테이너에서 어두운 배경색을 제거합니다. */}
            <div className="relative overflow-hidden min-h-screen">

                {/* 3. 수정된 BackgroundLayers가 렌더링됩니다. */}
                <BackgroundLayers />

                {/* 콘텐츠 영역은 z-10으로 배경 위에 위치합니다. */}
                <div className="relative z-10 p-8">
                    {/* 4. 밝은 배경에 맞게 제목 텍스트 색상을 어둡게 변경합니다. */}
                    <h2 id="font3" className="text-3xl text-kalani-navy font-bold pb-6 border-b border-gray-400/30">ORDER LIST</h2>
                    <div className="relative z-10 flex justify-center">
                        <DateFilter
                            startDate={startDate}
                            endDate={endDate}
                            onDateChange={handleDateChange}
                            onPresetClick={handlePresetClick}
                            activePreset={activePreset}
                            dailyTotals={dailyTotals}
                            highlightDates={highlightedDates}
                        />
                    </div>

                    <div className="p-4 md:p-6 max-w-5xl mx-auto space-y-12">
                        {groupedByDate.map((group) => (
                            <DateCarousel
                                key={group.date}
                                date={group.date}
                                items={group.items}
                                selectedItem={selectedItem}
                                onItemSelect={handleItemSelect}
                                onCancel={handleCancelOrder}
                            />
                        ))}
                        {/* ✅ 8. 필터링 결과 주문이 없을 때 표시할 메시지 */}
                        {groupedByDate.length === 0 && (
                            <div className="text-center p-20 text-gray-500">
                                <p className="text-xl font-semibold">
                                    '{activePreset || (startDate && endDate ? `${format(startDate, 'yyyy.MM.dd')} ~ ${format(endDate, 'yyyy.MM.dd')}` : '선택된 기간')}' 내 주문 내역이 없습니다.
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}