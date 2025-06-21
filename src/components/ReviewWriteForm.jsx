import { useState } from 'react';

import TailButton from '../UI/TailButton';

export default function ReviewWriteForm({ onSubmit, setErrorMsg }) {
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
        onSubmit({ text, rating });
        setText('');
        setRating(5);
    };

    return (
        <div className="border border-gray-300 p-4 rounded mt-4">
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
                >
                    등록
                </TailButton>
            </div>
        </div>
    );
}
