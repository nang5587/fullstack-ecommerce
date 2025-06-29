// 훅 목록
import { useCart } from "./CartContext"
import { useNavigate } from "react-router-dom"
import { useEffect, useState } from "react"

// UI 목록
import TailButton from "../UI/TailButton";

// component 목록
import AddressInput from "./AddressInput";
import ErrorMessage from "./ErrorMessage";
import Modal from "./Modal"; // ✅ 방금 만든 모달 컴포넌트
import EditAddressForm from './EditAddressForm';

import jwt_decode from "jwt-decode";

import api from '../api/axios'


export default function OrderPage() {
    const { removeItemsFromCart } = useCart();
    const navigate = useNavigate();

    const [orderItems, setOrderItems] = useState([]);
    const [newAddress, setNewAddress] = useState({
        name: '', phone: '', address1: '', address2: '', zip: '',
    });

    // 기존 배송지 목록
    const [existingAddresses, setExistingAddresses] = useState([]);
    const [selectedAddressId, setSelectedAddressId] = useState(null);

    const [payment, setPayment] = useState('');
    const [errorMsg, setErrorMsg] = useState('');

    const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    const isAddressValid = () => {
        return (
            address.name.trim() &&
            /^01[0-9]-\d{3,4}-\d{4}$/.test(address.phone) &&
            address.zip &&
            address.address1
        );
    };

    // --- 데이터 로드 및 UI 로직 ---
    const refetchAddresses = async () => {
        // api 인스턴스의 요청 인터셉터가 토큰을 자동으로 추가해주므로,
        // 여기서 토큰을 직접 확인하거나 헤더를 설정할 필요가 없습니다.
        try {
            // GET 요청을 보내고, 두 번째 인자로 config 객체를 전달합니다.
            // 만약 보낼 파라미터가 있다면 여기에 추가합니다. 예: { params: { type: 'all' } }
            const response = await api.get('/api/member/address');

            // ✅ axios는 응답 데이터를 response.data에 담아줍니다.
            const data = response.data;
            console.log("주소 목록 데이터:", data);

            // 서버 응답이 배열이 아닐 경우를 대비한 방어 코드
            const addresses = Array.isArray(data) ? data : [];
            setExistingAddresses(addresses);

            // 기본 배송지 또는 첫 번째 배송지 자동 선택 로직
            const mainAddress = addresses.find(addr => addr.isMain);
            if (mainAddress) {
                setSelectedAddressId(mainAddress.addressId);
            } else if (addresses.length > 0) {
                setSelectedAddressId(addresses[0].addressId);
            }

            return addresses; // 새로 불러온 주소 목록 반환

        } catch (err) {
            // ✅ axios는 4xx, 5xx 에러를 catch 블록으로 처리합니다.
            console.error("배송지 목록 로드 실패:", err.response?.data || err.message);
            setExistingAddresses([]); // 실패 시 상태를 확실히 비워줌
            return []; // 실패 시 빈 배열 반환
        }
    };

    useEffect(() => {
        // 주문할 상품 정보 로드
        const stored = localStorage.getItem('orderItems');
        if (stored) {
            setOrderItems(JSON.parse(stored));
        }

        // 컴포넌트 마운트 시 주소 목록 불러오기
        const initFetch = async () => {
            setIsLoading(true);
            const addresses = await refetchAddresses();
            setIsLoading(false);
            console.log(addresses)

            // ✅ 로딩이 끝났는데 주소가 하나도 없으면, 주소 추가 모달을 자동으로 엽니다.
            if (addresses.length === 0) {
                setIsAddressModalOpen(true);
            }
        };

        initFetch();
    }, []);

    // ✅ 주소 관리 모달에서 변경사항이 생겼을 때 호출될 함수
    const handleAddressDataChange = async () => {
        refetchAddresses(); // 주소 목록을 다시 불러와 화면을 최신 상태로 유지
        setIsAddressModalOpen(false); // 작업이 끝났으니 모달을 닫음
    };


    // --- 주문 처리 로직 ---
    const handleOrder = async () => {
        // 유효성 검사
        if (!selectedAddressId) {
            setErrorMsg('배송지를 선택해주세요. 배송지가 없다면 "배송지 관리"에서 추가해주세요.');
            return;
        }
        if (!payment) {
            setErrorMsg('결제 수단을 선택해주세요.');
            return;
        }

        const token = localStorage.getItem('accessToken');
        if (!token) {
            alert('로그인이 필요합니다.');
            navigate('/login?redirect=/order');
            return;
        }

        setErrorMsg('');

        try {
            // ✅ 선택된 주소 ID를 이용해 전체 주소 정보를 찾습니다.
            const chosenAddress = existingAddresses.find(addr => addr.addressId === selectedAddressId);
            if (!chosenAddress) {
                throw new Error("선택된 배송지 정보를 찾을 수 없습니다.");
            }

            const orderPayload =  // 1. 최상위 구조를 배열로 변경
                {
                    orderInfo: { // 2. orderInfo에는 주문 관련 정보만 포함
                        // username은 토큰에서 추출하므로 프론트에서 보낼 필요 없음
                        total: total,
                        orderstatus: "주문완료",
                        payment: payment,
                        // orderdate는 백엔드에서 생성하므로 보낼 필요 없음
                    },
                    address: { // 3. address 객체를 명시적으로 생성
                        // addressId는 기존 주소를 식별하기 위해 필요할 수 있습니다.
                        // 백엔드가 addressId만 받아서 처리하는지, 아니면 전체 주소 정보를 받는지 확인 필요
                        addressId: chosenAddress.addressId, // ★★★ 백엔드와 협의 필요 ★★★
                        name: chosenAddress.name,
                        zip: chosenAddress.zip,
                        address1: chosenAddress.address1,
                        address2: chosenAddress.address2,
                        phone: chosenAddress.phone,
                        main: chosenAddress.isMain, // isMain -> main으로 필드명 변경
                        // deleteAddr는 주문 시 보낼 필요 없음
                    },
                    items: orderItems.map(item => ({ // 4. items 구조는 그대로 사용
                        optionid: item.optionid,
                        quantity: item.quantity,
                        price: item.price
                    }))
                }
            ;

            console.log('📦 백엔드로 전송할 최종 주문 정보:', JSON.stringify(orderPayload, null, 2));

            // 이제 이 orderPayload를 보내면 됩니다.
            const response = await api.post('/api/member/orders', orderPayload);

            console.log('🎉 주문 성공! 서버 응답:', response.data);

            // ✅ 2. 주문 성공 후 로직은 그대로 유지합니다.
            await removeItemsFromCart(orderItems);

            localStorage.removeItem('orderItems');
            alert('주문이 완료되었습니다!');
            navigate('/');
        } catch (err) {
            setErrorMsg(err.message || '주문 처리 중 오류가 발생했습니다.');
        }
    };

    // --- 렌더링을 위한 계산 ---
    const subtotal = orderItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const shippingFee = subtotal >= 50000 ? 0 : 3000;
    const total = subtotal + shippingFee;
    const formatToKRW = (num) => num.toLocaleString() + '원';

    return (
        <>
            <div className="mx-auto max-w-screen-2xl px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
                <div className="mt-12 flex flex-col lg:flex-row gap-12">
                    <div className="lg:w-2/3 space-y-8">
                        {/* --- 배송지 선택 --- */}
                        <div>
                            <div className="flex justify-between items-center mb-4">
                                <h2 id='font3' className="text-2xl tracking-tight text-kalani-navy">배송지 정보</h2>
                                <TailButton onClick={() => setIsAddressModalOpen(true)}>
                                    배송지 관리
                                </TailButton>
                            </div>

                            {/* 주소 목록 */}
                            <div className="space-y-3">
                                {existingAddresses.length > 0 ? (
                                    existingAddresses.map(addr => (
                                        <div key={addr.addressId}
                                            onClick={() => setSelectedAddressId(addr.addressId)}
                                            className={`p-4 border rounded-md cursor-pointer transition-all ${selectedAddressId === addr.addressId ? 'border-kalani-gold bg-kalani-gold/10 shadow-md' : 'border-gray-200'}`}>
                                            <p className="font-semibold">
                                                {addr.name}
                                                {addr.isMain && <span className="text-xs font-bold text-kalani-gold ml-2">기본</span>}
                                            </p>
                                            <p className="text-sm text-gray-600 mt-1">[{addr.zip}] {addr.address1} {addr.address2}</p>
                                            <p className="text-sm text-gray-500">{addr.phone}</p>
                                        </div>
                                    ))
                                ) : (
                                    !isLoading && (
                                        <div className="text-center text-gray-500 p-8 border-2 border-dashed rounded-md">
                                            <p>저장된 배송지가 없습니다.</p>
                                            <p className="mt-2">오른쪽 위 '배송지 관리' 버튼을 눌러 첫 배송지를 추가해주세요.</p>
                                        </div>
                                    )
                                )}
                            </div>
                        </div>

                        {/* 결제 수단 선택 */}
                        <div
                            className={`overflow-hidden transition-all duration-500 ease-in-out transform ${
                                // 💡 showPayment 상태 대신 selectedAddressId를 직접 조건으로 사용합니다.
                                selectedAddressId
                                    ? 'max-h-[300px] opacity-100 translate-y-0'
                                    : 'max-h-0 opacity-0 -translate-y-3 pointer-events-none'
                                }`}
                        >
                            <h2 id="font3" className="text-2xl tracking-tight text-kalani-navy mt-2 mb-5">결제 수단 선택</h2>
                            <div className="flex gap-6">
                                <label className="flex items-center gap-2 cursor-pointer text-gray-700">
                                    <input
                                        type="radio"
                                        name="payment"
                                        value="card"
                                        checked={payment === 'card'}
                                        onChange={(e) => setPayment(e.target.value)}
                                        className="form-radio"
                                    />
                                    신용/체크 카드
                                </label>
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="radio"
                                        name="payment"
                                        value="bank"
                                        checked={payment === 'bank'}
                                        onChange={(e) => setPayment(e.target.value)}
                                        className="form-radio"
                                    />
                                    무통장 입금
                                </label>
                            </div>
                        </div>
                        <ErrorMessage errorMsg={errorMsg} />
                    </div>


                    {/* 주문 요약 */}
                    <div className="flex flex-col justify-between lg:w-1/3 border border-gray-200 rounded-md p-6 shadow-nm bg-white space-y-4">
                        <div>
                            <h2 className="text-lg font-semibold text-kalani-navy mb-4">주문 요약</h2>
                            <div className="text-sm text-gray-700 space-y-2">
                                <div className="flex justify-between">
                                    <span>상품 금액</span>
                                    <span>{formatToKRW(subtotal)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>배송비</span>
                                    <span>{shippingFee === 0 ? '무료' : formatToKRW(shippingFee)}</span>
                                </div>
                            </div>
                        </div>
                        <div>
                            <div className="border-t border-gray-300 pt-3 flex justify-between font-bold text-base text-kalani-ash">
                                <span>총 결제 금액</span>
                                <span>{formatToKRW(total)}</span>
                            </div>
                            <TailButton variant="navy" className="w-full mt-4 hover:bg-kalani-gold" onClick={handleOrder}>
                                결제하기
                            </TailButton>
                        </div>
                    </div>
                </div>
            </div>
            {/* --- 배송지 관리 모달 --- */}
            {isAddressModalOpen && (
                <Modal onClose={() => setIsAddressModalOpen(false)}>
                    <EditAddressForm
                        addresses={existingAddresses}
                        onDataChange={handleAddressDataChange}
                        onCancel={() => setIsAddressModalOpen(false)}
                    />
                </Modal>
            )}
        </>
    );
}
