// 훅 목록
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

// UI 목록
import TailButton from '../UI/TailButton';

// ✅ api 인스턴스를 import 합니다.
import api from '../api/axios';

export default function Orders() {
    // ✅ orders라는 이름으로 전체 주문 목록을 관리합니다. 초기값은 빈 배열입니다.
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true); // ✅ 로딩 상태 추가
    const [animate, setAnimate] = useState(false);

    // ✅ 컴포넌트가 마운트될 때 API를 호출하여 주문 목록을 가져옵니다.
    useEffect(() => {
        const fetchOrders = async () => {
            setLoading(true);
            try {
                const res = await api.get('/api/member/orderlist');
                // 백엔드에서 받은 데이터가 배열인지 확인하고 상태를 업데이트합니다.
                setOrders(Array.isArray(res.data) ? res.data : []);
            } catch (err) {
                console.error("주문 목록을 불러오는 데 실패했습니다:", err);
                setOrders([]); // 에러 발생 시 빈 배열로 설정
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, []);

    // ✅ 주문 내역이 없을 때 애니메이션을 위한 useEffect
    useEffect(() => {
        // 로딩이 끝났고 주문 내역이 없을 때만 애니메이션을 실행합니다.
        if (!loading && orders.length === 0) {
            setAnimate(true);
            const timer = setTimeout(() => {
                setAnimate(false);
            }, 600);
            return () => clearTimeout(timer);
        }
    }, [loading, orders]);

    // ✅ 백엔드 데이터 구조에 맞게 모든 주문의 모든 아이템을 하나의 리스트로 펼칩니다.
    // 각 아이템에 주문 날짜와 상태 정보를 추가합니다.
    const allItems = orders.flatMap(order => 
        order.items.map(item => ({
            ...item, // 기존 item 정보 (imgname, productName 등)
            orderdate: order.orderInfo.orderdate,
            orderstatus: order.orderInfo.orderstatus,
        }))
    );

    return (
        <div className='w-10/12 ml-20'>
            <h1 id='font4' className='text-kalani-navy font-bold text-2xl pb-10'>주문목록</h1>
            {loading ? (
                <div className="text-center py-16 border-t border-gray-200">
                    <p className="text-gray-500">주문 내역을 불러오는 중입니다...</p>
                </div>
            ) : allItems.length === 0 ? (
                <div className="text-center py-16 border-t border-gray-200">
                    <p className="text-gray-500">
                        아직 주문하신 내역이 없어요.<br />
                        맘에 드는 아이템을 지금 찾아보세요!
                    </p>
                    <Link to="/" className="mt-4 inline-block text-kalani-gold font-medium text-sm hover:underline">
                        <p className={`${animate ? 'animate-[jelly_0.6s]' : ''}`}>쇼핑 계속하기</p>
                    </Link>
                </div>
            ) : (
                <ul className="divide-y border-y border-gray-300 divide-gray-300">
                    {/* ✅ 펼쳐진 allItems를 map으로 렌더링합니다. */}
                    {allItems.map((item, index) => (
                        <li key={`${item.optionid}-${index}`} className="flex py-6 sm:py-8">
                            <div className="flex-shrink-0">
                                {/* ✅ imgname을 사용하여 상세 페이지로 이동합니다. */}
                                <Link to={`/detail/${item.imgname}`}>
                                    <img
                                        // ✅ 백엔드 baseURL과 imgUrl을 조합하여 이미지 경로를 만듭니다.
                                        src={`${api.defaults.baseURL}${item.imgUrl}`}
                                        alt={item.productName}
                                        className="h-24 w-24 rounded-md object-cover object-center sm:h-32 sm:w-32"
                                    />
                                </Link>
                            </div>

                            <div className="ml-4 flex flex-1 flex-col justify-between sm:ml-6">
                                <div className="flex justify-between h-full">
                                    {/* 왼쪽 섹션: 상품 정보 */}
                                    <div>
                                        <h3 className="text-base font-medium">
                                            <Link to={`/detail/${item.imgname}`} className="text-kalani-ash hover:text-kalani-gold">
                                                {item.productName}
                                            </Link>
                                        </h3>
                                        <p className="mt-1 text-sm text-gray-500">
                                            {/* ✅ optionid에서 사이즈와 색상 정보를 추출해야 합니다. 
                                                 백엔드에서 사이즈, 색상 정보를 직접 내려주는 것이 더 좋습니다. */}
                                            옵션 ID: {item.optionid} 
                                        </p>
                                        <p className="mt-1 text-sm text-gray-500">
                                            수량: {item.quantity}개
                                        </p>
                                        <p className="mt-1 text-sm font-semibold text-kalani-navy">
                                            {item.orderstatus}
                                        </p>
                                    </div>

                                    {/* 오른쪽 섹션: 리뷰 작성 버튼 등 */}
                                    <div className="flex flex-col items-end space-y-2 justify-center">
                                        <TailButton variant="selGhost" onClick={() => { /* 리뷰 작성 로직 */ }}>
                                            리뷰 작성
                                        </TailButton>
                                    </div>
                                </div>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}