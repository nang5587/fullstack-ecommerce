import { useAuth } from '../context/AuthContext';
import { useEffect, useState, useMemo } from 'react';
import axios from 'axios';

const dummyQnAList = [
    {
        imgname: "123456789",
        username: "user01",
        question: "이 제품 세탁기에 돌려도 되나요?",
        answer: "가능하지만 세탁망에 넣고 찬물 세탁을 권장드립니다.",
        answerusername: "staff01"
    },
    {
        imgname: "987654321",
        username: "sunnygirl",
        question: "168cm인데 M 사이즈 괜찮을까요?",
        answer: "조금 여유 있는 핏입니다. 정사이즈 추천드려요.",
        answerusername: "admin"
    },
    {
        imgname: "111222333",
        username: "minkyu92",
        question: "재입고 예정 있나요?",
        answer: "다음 주 중 소량 재입고될 예정입니다.",
        answerusername: "staff02"
    },
    {
        imgname: "555888999",
        username: "coffeeaddict",
        question: "배송은 얼마나 걸리나요?",
        answer: "주문일 기준 1~2일 내 출고됩니다.",
        answerusername: "manager01"
    },
    {
        imgname: "444777111",
        username: "eunji_lee",
        question: "모델이 입은 색상은 어떤 건가요?",
        answer: "모델 착용 색상은 '샌드베이지'입니다.",
        answerusername: "staff03"
    }
];

const handleQnASubmit = async ({ text, isPrivate }) => {
    try {
        const token = localStorage.getItem('accessToken');
        const baseUrl = import.meta.env.VITE_BACKEND_URL;
        // ⭐
        await axios.post(`http://${baseUrl}/api/public/qna`, {
            content: text,
            isPrivate,
        }, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        // ⭐
        // const res = await axios.get(`http://${baseUrl}/api/public/qnalist/${productId}`);
        // setQnas(res.data);
        setQnas(dummyQnAList);
        setShowForm(false);
    }
    catch (err) {
        console.error("Q&A 등록 실패:", err);
        // ⭐
        alert("Q&A 등록에 실패했습니다.");
    }
};

export default function QnA() {
    const { isLoggedIn, username } = useAuth();
    const [showForm, setShowForm] = useState(false);
    const [qnas, setQnas] = useState([]);

    return (
        <div className="flex">
            {/* 리뷰 본문 */}
            <div className="flex-1 pl-8">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h2 className="text-xl font-bold">Q&A</h2>
                    </div>
                    {isLoggedIn && (
                        <>
                            <button
                                onClick={() => setShowForm(prev => !prev)}
                                className="border border-gray-300 px-4 py-2 rounded hover:border-gray-700"
                            >
                                {showForm && 'Q&A 쓰기'}
                            </button>
                            {showForm && <QnAWriteForm onSubmit={handleQnASubmit} />}
                        </>
                    )}

                </div>

                {qnas.map(qna => (
                    <div key={review.id} className="border-b border-gray-300 py-6 flex gap-4">
                        {/* 프로필 */}
                        <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-sm font-bold text-gray-600">
                            {review.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                        </div>

                        {/* 내용 */}
                        <div className="flex-1">
                            <div className="flex justify-between items-center">
                                <div className="font-medium">{qna.username}</div>
                                <div className="text-sm text-gray-400">{qna.createdat}</div>
                            </div>
                            <p className="text-gray-700 mt-2">{qna.question}</p>
                        </div>
                    </div>
                ))}

                <div className="mt-6 text-center">
                    <button className="px-4 py-2 border border-gray-300 rounded hover:border-gray-700">더 많은 Q&A</button>
                </div>
            </div>
        </div>
    )
}
