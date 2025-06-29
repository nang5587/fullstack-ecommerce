import { useState } from 'react';

import TailButton from '../UI/TailButton';

// ✅ 1. props로 isSubmitting과 orderItem을 추가로 받습니다.
export default function ReviewWriteForm({ onSubmit, setErrorMsg, isSubmitting, orderItem }) {
    const [text, setText] = useState('');
    const [rating, setRating] = useState(5);

    const handleSubmit = () => {
        if (!text.trim()) {
            setErrorMsg('리뷰 내용을 입력하세요.');
            return;
        }
        if (rating < 1 || rating > 5) {
            setErrorMsg('별점을 선택하세요.');
            return;
        }

        // ✅ 2. 부모에게 전달할 데이터에 orderid와 optionid를 포함시킵니다.
        // orderItem 객체가 없다면 오류가 발생할 수 있으므로 방어 코드를 추가합니다.
        if (!orderItem || !orderItem.orderid || !orderItem.optionid) {
            setErrorMsg('리뷰를 작성할 상품 정보를 찾을 수 없습니다. 페이지를 새로고침 해주세요.');
            return;
        }
        
        onSubmit({ 
            text, 
            rating,
            orderid: orderItem.orderid,
            optionid: orderItem.optionid,
        });
        
        // 제출 후 폼 초기화는 부모 컴포넌트의 성공 로직에서 처리하는 것이 더 좋습니다.
        // 여기서는 그대로 두거나, 성공 시에만 초기화하도록 변경할 수 있습니다.
        // setText('');
        // setRating(5);
    };

    return (
        <div className="border border-gray-300 p-4 rounded mt-4">
            {/* ✅ 3. orderItem 정보를 활용하여 어떤 상품에 대한 리뷰인지 표시 (선택 사항) */}
            <div className="mb-2 p-2 bg-gray-50 rounded">
                <p className="text-sm font-semibold truncate">{orderItem?.productName}</p>
                <p className="text-xs text-gray-500">옵션 ID: {orderItem?.optionid}</p>
            </div>
            <textarea
                className="w-full border border-gray-200 p-2 rounded focus-within:outline-kalani-gold focus-within:outline-2"
                rows={4}
                placeholder="리뷰를 입력하세요"
                value={text}
                onChange={(e) => setText(e.target.value)}
            />
            <div className="flex items-center justify-between mt-2">
                <div className="text-yellow-500 text-lg">
                    {Array.from({ length: 5 }, (_, i) => (
                        <button
                            key={i}
                            type="button"
                            onClick={() => setRating(i + 1)}
                            className="focus:outline-none"
                        >
                            {i < rating ? '★' : '☆'}
                        </button>
                    ))}
                </div>
                <TailButton
                    onClick={handleSubmit}
                    variant="navy"
                    className="px-4 py-2 text-white rounded"
                    type="button"
                    // ✅ 4. isSubmitting 상태에 따라 버튼을 비활성화합니다.
                    disabled={isSubmitting}
                >
                    {isSubmitting ? '등록 중...' : '등록'}
                </TailButton>
            </div>
        </div>
    );
}