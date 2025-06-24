import React, { useState, useMemo, useEffect, useCallback } from "react";
import DateCarousel from "./DateCarousel";
import DateFilter from "./DateFilter";
import { format } from 'date-fns';
import api from '../api/axios'

// import orderListDummy from '../data/orderListDummy';

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

const getLocalDate = (isoDateStr) => {
    if (!isoDateStr || typeof isoDateStr !== 'string') return null;
    return isoDateStr.split('T')[0]; // 'T'를 기준으로 잘라 앞부분만 반환
};

export default function OrderList() {
    const [orders, setOrders] = useState([]);
    // 2. 선택된 아이템을 저장할 상태를 만듭니다.
    const [selectedItem, setSelectedItem] = useState(null);
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [activePreset, setActivePreset] = useState('전체');

    // 전체 목록 가져오기
    const fetchOrders = useCallback(async () => {
        try {
            const res = await api.get('/api/member/orderlist');
            // setOrders(res.data);
            setOrders(Array.isArray(res.data) ? res.data : []);
            console.log("백앤드로 받은 주문내역 : ", res.data);
        } catch (e) {
            console.error('주문 목록 불러오기 실패:', e);
            setOrders([]);
        }
    }, []);

    useEffect(() => {
        fetchOrders();
    }, [fetchOrders]);

    const dailyTotals = useMemo(() => {
        if (!Array.isArray(orders)) return {};
        
        return orders.reduce((acc, order) => {
            if (!order.orderInfo) return acc;
            
            const date = getLocalDate(order.orderInfo.orderdate);
            const total = order.orderInfo.total;
            
            if (date) {
                acc[date] = (acc[date] || 0) + total;
            }
            return acc;
        }, {});
    }, [orders]);

    const highlightedDates = useMemo(() => {
        // dailyTotals 객체의 모든 키(날짜 문자열)를 가져와서
        // 각 문자열을 new Date()를 통해 실제 Date 객체로 변환합니다.
        return Object.keys(dailyTotals).map(dateStr => new Date(dateStr));
    }, [dailyTotals]);

    const groupedByDate = useMemo(() => {
        if (!Array.isArray(orders)) return [];

        const filteredOrders = orders.filter(order => {
            if (!startDate || !endDate || !order.orderInfo?.orderdate) return true;
            
            const orderDate = new Date(getLocalDate(order.orderInfo.orderdate));
            return orderDate >= startOfDay(startDate) && orderDate <= endOfDay(endDate);
        });

        const groups = filteredOrders.reduce((acc, order) => {
            if (!order.orderInfo || !order.orderInfo.orderdate) return acc;

            const dateString = getLocalDate(order.orderInfo.orderdate);
            if (!acc[dateString]) {
                acc[dateString] = { date: dateString, items: [] };
            }

            // 이제 order.items에 이미 productName, imageUrl 등이 모두 포함되어 있으므로,
            // 추가 정보를 주입할 필요 없이 그대로 사용합니다.
            // 또한, orderInfo 전체를 넘겨주면 하위 컴포넌트에서 더 많은 정보를 활용할 수 있습니다.
            const itemsWithFullContext = order.items.map(item => ({
                ...item,
                orderInfo: order.orderInfo, // 주문 전체 정보
                deliveryAddress: order.address, // 배송지 정보
            }));
            
            acc[dateString].items.push(...itemsWithFullContext);
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
            await api.patch('/api/member/⭐', { orderid });
            await fetchOrders();
        } catch (error) {
            console.error('주문 취소 실패:', error);
        }
    };

    // 컴포넌트가 처음 렌더링될 때 '전체' 프리셋을 기본으로 설정
    useEffect(() => {
        handlePresetClick('전체');
    }, []);

    

    return (
        <div className="w-11/12 ml-20">
            <div className="relative overflow-hidden min-h-screen">
                <BackgroundLayers />
                <div className="relative z-10 p-8">
                    {/* 헤더 */}
                    <div className="flex justify-between items-center pb-6 border-b border-gray-400/30">
                        <h2 id="font3" className="text-3xl text-gray-700 font-bold">
                            ORDER LIST
                        </h2>
                        {/* 이 부분은 Q&A 페이지의 '+새 질문하기' 버튼이므로, 주문 목록에서는 필요 없을 수 있습니다. */}
                        {/* <button className="...">
                            ...
                        </button> */}
                    </div>

                    {/* 카테고리 필터 (DateFilter) */}
                    <div className="flex justify-center mt-6 py-2">
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
                    
                    {/* Q&A 카드 그리드 (DateCarousel) */}
                    <div className="p-4 md:p-6 max-w-5xl mx-auto space-y-12 mt-4">
                        {/* 필터링된 주문 목록을 날짜별로 렌더링 */}
                        {groupedByDate.map((group, index) => (
                            <DateCarousel 
                                key={`${group.date}-${index}`}
                                date={group.date}
                                items={group.items}
                                selectedItem={selectedItem}
                                onItemSelect={handleItemSelect}
                                onCancel={handleCancelOrder} // 주문 취소 핸들러 전달
                            />
                        ))}

                        {/* 필터링 결과가 없을 때 메시지 */}
                        {groupedByDate.length === 0 && (
                            <div className="text-center py-20 text-gray-500">
                                <p className="text-xl font-semibold">
                                    {activePreset === '전체' && !startDate
                                        ? '주문 내역이 없습니다.'
                                        : `'${activePreset || (startDate && endDate ? `${format(startDate, 'yyyy.MM.dd')} ~ ${format(endDate, 'yyyy.MM.dd')}` : '선택된 기간')}' 내 주문 내역이 없습니다.`
                                    }
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}