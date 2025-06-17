// CartPopup.jsx

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCartPlus, faCheckCircle } from '@fortawesome/free-solid-svg-icons'; // 체크 아이콘 추가

export default function CartPopup({ product }) {
    // 상품 정보를 실제 객체로 가정하고 구조분해 할당을 사용하면 더 좋습니다.
    // 예: const { name, color, price } = product;
    const productName = "나이키 스포츠웨어";
    const price = 49000;

    return (
        // 전체 컨테이너: 그림자, 둥근 모서리, 패딩으로 입체감과 여백 확보
        <div className="w-96 max-w-sm bg-white rounded-xl shadow-lg p-6 font-sans border border-gray-300">

            {/* 1. 상단 헤더: 성공 메시지와 아이콘 */}
            <div className="flex items-center text-kalani-gold mb-4">
                <FontAwesomeIcon icon={faCheckCircle} className="text-xl" />
                <span className="ml-3 font-semibold text-lg text-gray-800">장바구니에 상품을 담았습니다.</span>
            </div>

            <hr className="my-4 border-gray-200" />

            {/* 2. 상품 정보 섹션: key-value 형태의 정보들을 정돈 */}
            <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                    <span className="text-gray-500">상품명</span>
                    <span className="font-medium text-gray-900">{productName}</span>
                </div>
                <div className="flex justify-between">
                    <span className="text-gray-500">색상</span>
                    {/* product prop이 문자열일 경우를 대비 */}
                    <span className="font-medium text-gray-900">{typeof product === 'string' ? product : '선택한 색상'}</span>
                </div>
                <div className="flex justify-between">
                    <span className="text-gray-500">가격</span>
                    <span className="font-medium text-gray-900">{price.toLocaleString('ko-KR')}원</span>
                </div>
            </div>

            <hr className="my-4 border-gray-200" />

            {/* 3. 총 금액 섹션: 강조를 위해 더 큰 폰트와 굵은 스타일 적용 */}
            <div className="flex justify-between items-center">
                <span className="text-base font-semibold text-gray-700">총 금액</span>
                <span className="text-xl font-bold text-kalani-navy">{price.toLocaleString('ko-KR')}원</span>
            </div>

            {/* 4. 액션 버튼: 명확한 CTA(Call To Action) 버튼 스타일 */}
            <a
                href="#"
                className="mt-6 block w-full text-center bg-kalani-navy text-white font-bold py-2 rounded-lg hover:opacity-80 transition-colors duration-300"
            >
                장바구니 보기
            </a>

        </div>
    );
}