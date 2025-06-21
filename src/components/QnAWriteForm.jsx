import { useState } from 'react';

export default function QnAWriteForm({ onSubmit }) {
    const [text, setText] = useState('');
    const [isPrivate, setIsPrivate] = useState(false);

    const handleSubmit = () => {
        if (!text.trim()) {
            alert('Q&A 내용을 입력하세요.');
            return;
        }

        onSubmit({ text, isPrivate });
        setText('');
        setIsPrivate(false);
    };

    return (
        <div className="border p-4 rounded mt-4">
            <textarea
                className="w-full border p-2 rounded"
                rows={4}
                placeholder="문의 내용을 입력하세요"
                value={text}
                onChange={(e) => setText(e.target.value)}
            />
            <div className="flex items-center justify-between mt-2">
                {/* 🔹 비공개 체크박스 */}
                <label className="flex items-center gap-2 text-sm text-gray-700">
                    <input
                        type="checkbox"
                        checked={isPrivate}
                        onChange={(e) => setIsPrivate(e.target.checked)}
                    />
                    나만 볼 수 있게
                </label>
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
