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
    const { cartItems, clearCart } = useCart();
    const navigate = useNavigate();

    const [address, setAddress] = useState({
        name: '',
        phone: '',
        address1: '',
        address2: '',
        zip: '',
    });
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

    // 결제 수단 
    useEffect(() => {
        setShowPayment(isAddressValid());
    }, [address, showPayment]);

    // 하이픈 처리
    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name === 'phone') {
            // 숫자만 추출
            const digits = value.replace(/\D/g, '');

            let formatted = digits;

            if (digits.length < 4) {
                formatted = digits;
            } else if (digits.length < 7) {
                formatted = digits.slice(0, 3) + '-' + digits.slice(3);
            } else if (digits.length <= 11) {
                formatted = digits.slice(0, 3) + '-' + digits.slice(3, 7) + '-' + digits.slice(7);
            }

            setAddress(prev => ({ ...prev, phone: formatted }));
        } else {
            setAddress(prev => ({ ...prev, [name]: value }));
        }
    };


    const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const shippingFee = subtotal >= 50000 ? 0 : 3000;
    const total = subtotal + shippingFee;

    const formatToKRW = (num) => num.toLocaleString() + '원';

    const handleOrder = async () => {
        console.log('cartItems:', cartItems);
        if (!address.name.trim()) {
            setErrorMsg('이름을 입력해주세요');
            return;
        }
        if (!address.phone.trim() || !/^01[0-9]-\d{3,4}-\d{4}$/.test(address.phone)) {
            setErrorMsg('연락처 형식을 확인해주세요 (예: 010-1234-5678)');
            return;
        }
        if (!payment) {
            setErrorMsg('결제 수단을 선택해주세요');
            return;
        }
        if (!address.zip || !address.address1) {
            setErrorMsg('주소를 입력해주세요');
            return;
        }

        setErrorMsg('');

        const isLoggedIn = Boolean(localStorage.getItem('accessToken'));
        if (!isLoggedIn) {
            alert('로그인이 필요합니다.'); // 바꾸기
            window.location.href = '/login?redirect=/order';
            return;
        }

        const token = localStorage.getItem('accessToken');
        if (!token) return;

        const decoded = jwt_decode(token); // 함수 호출
        console.log(decoded);

        // const decoded = jwt_decode(token);
        const username = decoded.username;
        
        const orderData = {
            username,
            orderstatus: '주문완료',
            items: cartItems.map(({ id, size, quantity, price }) => ({
                optionid: id,
                quantity,
                price,
            })),
            address: { ...address },
            payment,
            total,
        };
        
        console.log('백앤드로 보낸 주문정보 : ', orderData)
        try {
            const accessToken = localStorage.getItem('accessToken');
            const baseUrl = import.meta.env.VITE_BACKEND_URL;
            const response = await fetch(`http://${baseUrl}/api/orderlist`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${accessToken}`,
                },
                body: JSON.stringify(orderData),
            });

            if (!response.ok) {
                const error = await response.json();
                setErrorMsg(error.message || '주문에 실패했습니다.');
                return;
            }

            const result = await response.json();
            console.log('백앤드로 보낸 주문정보 2: ', result)
            clearCart();
            alert('주문이 완료되었습니다!')
            navigate('/cart');
        }
        catch (err) {
            setErrorMsg('서버와의 통신 중 오류가 발생했습니다.');
        }
    };

    return (
        <div className="mx-auto max-w-screen-2xl px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
            {/* 배송지 입력 */}
            <div>
                <h2 id='font3' className="text-3xl lg:text-3xl tracking-tight text-kalani-navy mt-2">배송지 정보</h2>
            </div>

            <div className="mt-12 flex flex-col lg:flex-row gap-12">
                <div className="lg:w-2/3 space-y-6">
                    <div className="flex flex-col justify-between w-full h-full">
                        <input type="text" name="name" placeholder="이름" value={address.name} onChange={handleChange} className="w-full border border-gray-200 rounded-md px-4 py-2 focus-within:outline-kalani-gold focus-within:outline-2" />
                        <input type="text" name="phone" placeholder="연락처" value={address.phone} onChange={handleChange} className="w-full border border-gray-200 rounded-md px-4 py-2 focus-within:outline-kalani-gold focus-within:outline-2" />
                        <div className="flex gap-2">
                            <input name="zip" value={address.zip} onChange={handleChange} placeholder="우편번호" className="w-full border border-gray-200 rounded-md px-4 py-2 focus-within:outline-kalani-gold focus-within:outline-2" readOnly />
                            <div className="w-28">
                                <AddressInput
                                    onComplete={({ zip, address1 }) => setAddress((prev) => ({ ...prev, zip, address1 }))}
                                />
                            </div>
                        </div>
                        <input name="address1" value={address.address1} onChange={handleChange} placeholder="기본주소" className="w-full border border-gray-200 rounded-md px-4 py-2 focus-within:outline-kalani-gold focus-within:outline-2" readOnly />
                        <input name="address2" value={address.address2} onChange={handleChange} placeholder="상세주소" className="w-full border border-gray-200 rounded-md px-4 py-2 focus-within:outline-kalani-gold focus-within:outline-2" />
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
