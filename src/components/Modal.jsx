// src/components/Modal.js
export default function Modal({ children, onClose }) {
    return (
        // 뒷 배경 (Backdrop)
        <div
            className="fixed inset-0 bg-gray-200 bg-opacity-50 z-40 flex justify-center items-center"
            onClick={onClose} // 뒷 배경 클릭 시 닫기
        >
            {/* 실제 모달 컨텐츠 */}
            <div
                className="relative bg-white rounded-2xl shadow-xl p-8 w-full max-w-lg h-[700px]"
                onClick={e => e.stopPropagation()} // 컨텐츠 클릭 시 이벤트 전파 방지
            >
                {children}
            </div>
        </div>
    );
}