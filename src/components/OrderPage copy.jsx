// 훅 목록
import { useCart } from "./CartContext"
import { useNavigate } from "react-router-dom"
import { useEffect, useState } from "react"

// UI 목록
import TailButton from "../UI/TailButton";

// component 목록
import AddressInput from "./AddressInput";
import ErrorMessage from "./ErrorMessage";


import jwt_decode from "jwt-decode";


export default function OrderPage() {
    const [orderItems, setOrderItems] = useState([]);
    const { cartItems, clearCart, removeItemsFromCart } = useCart();
    const navigate = useNavigate();

    const [newAddress, setNewAddress] = useState({
        name: '', phone: '', address1: '', address2: '', zip: '',
    });

    // 기존 배송지 목록
    const [existingAddresses, setExistingAddresses] = useState([]);
    const [selectedAddressId, setSelectedAddressId] = useState(null);

    const [payment, setPayment] = useState('');
    const [errorMsg, setErrorMsg] = useState('');
    const [showPayment, setShowPayment] = useState(false);

    const isAddressValid = () => {
        return (
            address.name.trim() &&
            /^01[0-9]-\d{3,4}-\d{4}$/.test(address.phone) &&
            address.zip &&
            address.address1
        );
    };

    // --- 데이터 로드 및 UI 로직 ---
    const token = localStorage.getItem('accessToken');
    useEffect(() => {
        // 주문할 상품 정보 로드
        const stored = localStorage.getItem('orderItems');
        if (stored) {
            setOrderItems(JSON.parse(stored));
        }

        // 로그인 상태라면, 기존 배송지 목록 불러오기
        // const token = localStorage.getItem('accessToken');
        if (token) {
            const fetchAddresses = async () => {
                try {
                    const baseUrl = import.meta.env.VITE_BACKEND_URL;

                    // ★★★ GET 메서드로 정확하게 수정 ★★★
                    const res = await fetch(`http://${baseUrl}/api/member/address`, {
                        method: 'GET', // GET 요청임을 명시 (사실 fetch의 기본값이 GET이라 생략 가능)
                        headers: {
                            'Authorization': `Bearer ${token}`
                            // GET 요청에는 'Content-Type': 'application/json' 이 필요 없습니다.
                        }
                    });

                    if (res.ok) {
                        const data = await res.json();
                        // 백엔드 응답이 { "addresses": [...] } 형태일 것으로 가정
                        setExistingAddresses(data.addresses || []);
                    } else {
                        // 서버에서 에러 응답을 보냈을 경우
                        console.error("서버에서 배송지 목록을 가져오는데 실패했습니다.", res.status);
                    }
                } catch (err) {
                    console.error("기존 배송지 목록 로드 중 네트워크 오류 발생:", err);
                }
            };
            fetchAddresses();
        }
    }, []);

    useEffect(() => {
        // isAddressValid 함수도 newAddress를 사용하도록 수정해야 합니다.
        const isNewAddressValid = () => {
            return (
                newAddress.name.trim() &&
                /^01[0-9]-\d{3,4}-\d{4}$/.test(newAddress.phone) &&
                newAddress.zip &&
                newAddress.address1
            );
        };

        // 기존 주소를 선택했거나, 새 주소가 유효할 때 결제 수단을 보여줍니다.
        setShowPayment(selectedAddressId || isNewAddressValid());

    }, [newAddress, selectedAddressId]);

    const handleNewAddressChange = (e) => {
        const { name, value } = e.target;
        let finalValue = value;
        if (name === 'phone') {
            const digits = value.replace(/\D/g, '');
            let formatted = digits;
            if (digits.length > 3 && digits.length <= 7) {
                formatted = `${digits.slice(0, 3)}-${digits.slice(3)}`;
            } else if (digits.length > 7) {
                formatted = `${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(7, 11)}`;
            }
            finalValue = formatted;
        }
        setNewAddress(prev => ({ ...prev, [name]: finalValue }));
        setSelectedAddressId(null); // 새 주소 입력 시, 선택된 기존 주소는 초기화
    };

    const handleSelectAddress = (addressId) => {
        setSelectedAddressId(addressId);
        // 기존 주소 선택 시, 새 주소 입력 폼은 비워주는 것이 사용자 경험에 좋음
        setNewAddress({ name: '', phone: '', address1: '', address2: '', zip: '' });
    };

    // --- 주문 처리 로직 ---
    const handleOrder = async () => {
        // 유효성 검사
        if (!payment) {
            setErrorMsg('결제 수단을 선택해주세요.');
            return;
        }
        // 기존 주소를 선택하지도, 새 주소를 제대로 입력하지도 않은 경우
        if (!selectedAddressId && (!newAddress.name.trim() || !newAddress.phone.trim() || !newAddress.zip || !newAddress.address1)) {
            setErrorMsg('배송지 정보를 입력하거나 선택해주세요.');
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
            const baseUrl = import.meta.env.VITE_BACKEND_URL;

            // ★★★ 핵심 분기 로직 ★★★
            // 서버로 보낼 데이터를 준비합니다.
            let orderPayload;
            let finalOrderInfo; // orderInfo 객체를 미리 선언

            if (selectedAddressId) {
                // --- 재주문 시나리오 ---
                // 기존 주소 목록에서 선택된 주소 정보를 찾습니다.
                const chosenAddress = existingAddresses.find(addr => addr.addressId === selectedAddressId);

                console.log("🚀 재주문 시나리오: 기존 주소 정보를 사용합니다.");

                // 찾은 주소 정보로 orderInfo 객체를 구성합니다.
                finalOrderInfo = {
                    zip: chosenAddress.zip,
                    address1: chosenAddress.address1,
                    address2: chosenAddress.address2,
                    phone: chosenAddress.phone,
                    // addressId는 백엔드가 요구하지 않으므로 포함하지 않습니다.
                    // 단, 백엔드가 주소 식별을 위해 필요로 한다면 추가해야 합니다.
                    // addressId: selectedAddressId,
                    payment: payment,
                    total: total,
                    orderstatus: "주문완료"
                };

            } else {
                // --- 첫 주문 시나리오 ---
                console.log("🚀 첫 주문 시나리오: 새로 입력한 주소 정보를 사용합니다.");

                // 새로 입력한 주소 정보로 orderInfo 객체를 구성합니다.
                finalOrderInfo = {
                    zip: newAddress.zip,
                    address1: newAddress.address1,
                    address2: newAddress.address2,
                    phone: newAddress.phone,
                    name: newAddress.name, // 이름도 orderInfo에 포함되어야 한다면 추가
                    payment: payment,
                    total: total,
                    orderstatus: "주문완료"
                };
            }

            // 최종 페이로드를 조립합니다.
            orderPayload = {
                orderInfo: finalOrderInfo,
                items: orderItems.map(item => ({
                    optionid: item.optionid,
                    quantity: item.quantity,
                    price: item.price
                }))
            };

            console.log('📦 백엔드로 전송할 최종 주문 정보:', JSON.stringify(orderPayload, null, 2));

            const orderResponse = await fetch(`http://${baseUrl}/api/member/orders`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify(orderPayload),
            });

            if (!orderResponse.ok) {
                const error = await orderResponse.json();
                throw new Error(error.message || '주문에 실패했습니다.');
            }

            const result = await orderResponse.json();
            console.log('🎉 주문 성공! 서버 응답:', result);

            // ★★★ clearCart() 대신 removeItemsFromCart() 호출 ★★★
            // 주문한 상품들(orderItems)의 정보를 넘겨줍니다.
            await removeItemsFromCart(orderItems);

            localStorage.removeItem('orderItems');
            alert('주문이 완료되었습니다!');
            navigate('/');
        } catch (err) {
            console.error("주문 처리 중 오류 발생:", err);
            setErrorMsg(err.message || '서버와의 통신 중 오류가 발생했습니다.');
        }
    };

    // --- 렌더링을 위한 계산 ---
    const subtotal = orderItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const shippingFee = subtotal >= 50000 ? 0 : 3000;
    const total = subtotal + shippingFee;
    const formatToKRW = (num) => num.toLocaleString() + '원';

    return (
        <div className="mx-auto max-w-screen-2xl px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
            <div className="mt-12 flex flex-col lg:flex-row gap-12">
                <div className="lg:w-2/3 space-y-8">
                    {/* --- 기존 배송지 선택 --- */}
                    {existingAddresses.length > 0 && (
                        <div>
                            <h2 id='font3' className="text-2xl tracking-tight text-kalani-navy mb-4">기존 배송지 선택</h2>
                            <div className="space-y-3">
                                {existingAddresses.map(addr => (
                                    <div key={addr.addressId}
                                        onClick={() => handleSelectAddress(addr.addressId)}
                                        className={`p-4 border rounded-md cursor-pointer transition-all ${selectedAddressId === addr.addressId ? 'border-kalani-gold bg-kalani-gold/10' : 'border-gray-200'}`}>
                                        <p className="font-semibold">{addr.name} ({addr.phone})</p>
                                        <p className="text-sm text-gray-600">[{addr.zip}] {addr.address1} {addr.address2}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* --- 새 배송지 입력 --- */}
                    <div>
                        <h2 id='font3' className="text-2xl tracking-tight text-kalani-navy mt-2 mb-4">
                            {existingAddresses.length > 0 ? '새 배송지 입력' : '배송지 정보'}
                        </h2>
                        <div className="space-y-4">
                            <input type="text" name="name" placeholder="이름" value={newAddress.name} onChange={handleNewAddressChange} className="w-full border border-gray-200 rounded-md px-4 py-2 focus-within:outline-kalani-gold" />
                            <input type="text" name="phone" placeholder="연락처" value={newAddress.phone} onChange={handleNewAddressChange} className="w-full border border-gray-200 rounded-md px-4 py-2 focus-within:outline-kalani-gold" />
                            <div className="flex gap-2">
                                <input name="zip" value={newAddress.zip} onChange={handleNewAddressChange} placeholder="우편번호" className="w-full border border-gray-200 rounded-md px-4 py-2" readOnly />
                                <div className="w-28">
                                    <AddressInput onComplete={({ zip, address1 }) => setNewAddress(prev => ({ ...prev, zip, address1, name: prev.name, phone: prev.phone }))} />
                                </div>
                            </div>
                            <input name="address1" value={newAddress.address1} onChange={handleNewAddressChange} placeholder="기본주소" className="w-full border border-gray-200 rounded-md px-4 py-2" readOnly />
                            <input name="address2" value={newAddress.address2} onChange={handleNewAddressChange} placeholder="상세주소" className="w-full border border-gray-200 rounded-md px-4 py-2 focus-within:outline-kalani-gold" />
                        </div>
                    </div>

                    {/* 결제 수단 선택 */}
                    <div
                        className={`overflow-hidden transition-all duration-500 ease-in-out transform ${showPayment
                            ? 'max-h-[300px] opacity-100 translate-y-0'
                            : 'max-h-0 opacity-0 -translate-y-3'
                            }`}
                    >
                        <h2 id="font3" className="text-3xl lg:text-3xl tracking-tight text-kalani-navy mt-2 mb-5">결제 수단 선택</h2>
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
            </div></div>
    );
}
