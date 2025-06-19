import { useState } from 'react';

export default function ReviewWriteForm({ onSubmit }) {
    const [text, setText] = useState('');
    const [rating, setRating] = useState(5);

    const handleSubmit = () => {
        if (!text.trim()) {
            alert('리뷰 내용을 입력하세요.');
            return;
        }
        if (rating < 1 || rating > 5) {
            alert('별점을 선택하세요.');
            return;
        }
        onSubmit({ text, rating });
        setText('');
        setRating(5);
    };

    return (
        <div className="border p-4 rounded mt-4">
            <textarea
                className="w-full border p-2 rounded"
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
                <button
                    onClick={handleSubmit}
                    className="px-4 py-2 bg-black text-white rounded"
                    type="button"
                >
                    등록
                </button>
            </div>
        </div>
    );
}
