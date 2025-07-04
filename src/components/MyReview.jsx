import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// ✅ api 인스턴스 import
import api from '../api/axios';

// 하위 컴포넌트들을 이 파일 안에 포함시킵니다.
// ----------------- 시작: 하위 컴포넌트 -----------------

function BackgroundLayers() {
    return (
        <>
            <div className="absolute inset-0 w-full h-full bg-[#001833]" />
            <div className="absolute inset-0 stars" />
            <div className="absolute inset-0 z-0">
                <Shell className="bottom-1/4 left-[10%]" delay={0.2} />
                <Shell className="top-1/3 right-[15%] rotate-12" delay={0.4} />
                <Shell className="bottom-[5%] right-[5%]" delay={0.6} />
                <Shell className="top-[15%] left-[20%] -rotate-15" delay={0.8} />
                <Shell className="top-[5%] right-[20%] rotate-15" delay={0.8} />
            </div>
        </>
    );
}

const Shell = ({ className, delay = 0 }) => (
    <motion.div
        className={`absolute w-24 h-24 ${className}`}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 0.5, y: 0, filter: 'drop-shadow(0 0 8px rgba(173, 216, 230, 0.3))' }}
        transition={{ duration: 1, delay: delay, ease: 'easeOut' }}
        whileHover={{ opacity: 0.7, scale: 1.5, rotate: 7, filter: 'drop-shadow(0 0 20px rgba(173, 216, 230, 0.6))' }}
    >
        <img src="/clam.png" alt="decorative shell" className="w-full h-full" />
    </motion.div>
);
const baseURL = import.meta.env.VITE_BACKEND_URL;

const ReviewCard = ({ item, onCardClick }) => (
    <motion.div
        onClick={onCardClick}
        className="w-9/12 bg-white rounded-2xl overflow-hidden cursor-pointer border border-transparent hover:border-kalani-gold shadow-kal"
        whileHover={{ y: -5 }}
    >
        <img src={`http://${baseURL}/api/public/img/goods/${item.imgUrl}`} alt={item.productName} className="w-full aspect-[4/3] object-cover" />
        <div className="p-4">
            <h4 className="font-bold text-gray-700 truncate">{item.productName}</h4>
            <p className="text-sm text-gray-400">{new Date(item.createdate).toLocaleDateString()}</p>
        </div>
    </motion.div>
);

// ReviewDetailModal 컴포넌트 (내용은 임시로 채워둡니다. 실제 구현에 맞게 수정 필요)
const ReviewDetailModal = ({ item, onClose }) => {
    return (
        <div 
            className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
            onClick={onClose}
        >
            <motion.div
                className="bg-white rounded-lg p-8 w-full max-w-lg"
                onClick={(e) => e.stopPropagation()} // 모달 내부 클릭 시 닫히지 않도록
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
            >
                <h3 className="text-xl font-bold mb-4">{item.productName}</h3>
                <div className="flex items-center mb-4">
                    <span className="text-yellow-500">{'★'.repeat(item.rating)}{'☆'.repeat(5 - item.rating)}</span>
                    <span className="ml-2 text-gray-600">({item.rating}.0)</span>
                </div>
                <p className="text-gray-700 mb-6">{item.reviewtext}</p>
                <p className="text-sm text-gray-400 text-right">{new Date(item.createdate).toLocaleDateString()} 작성</p>
                <button 
                    onClick={onClose}
                    className="mt-6 w-full bg-kalani-navy text-white py-2 rounded-md hover:bg-kalani-gold"
                >
                    닫기
                </button>
            </motion.div>
        </div>
    );
};

// ----------------- 끝: 하위 컴포넌트 -----------------


// 메인 컴포넌트
export default function MyReview() {
    // 1. 상태 관리: 작성 완료된 리뷰 목록만 관리합니다.
    const [completedReviews, setCompletedReviews] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const [searchTerm, setSearchTerm] = useState('');
    const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');

    const [selectedItem, setSelectedItem] = useState(null);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

    // 디바운스 useEffect: 사용자가 입력을 멈추면 검색 실행
    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedSearchTerm(searchTerm);
        }, 500);
        return () => clearTimeout(handler);
    }, [searchTerm]);

    // API 호출 로직: 작성 완료된 리뷰만 불러옵니다.
    useEffect(() => {
        const fetchCompletedReviews = async () => {
            setIsLoading(true);
            try {
                const res = await api.get('/api/member/reviewsList');
                // `remain: true`인 리뷰만 필터링합니다.
                const validReviews = Array.isArray(res.data) ? res.data.filter(r => r.remain) : [];
                setCompletedReviews(validReviews);
            } catch (err) {
                console.error("작성 완료 리뷰 로드 실패:", err.response?.data || err.message);
                setCompletedReviews([]);
            } finally {
                setIsLoading(false);
            }
        };

        fetchCompletedReviews();
    }, []); // 컴포넌트가 처음 마운트될 때 한 번만 실행

    // 필터링 로직: 작성 완료된 리뷰만 필터링합니다.
    const filteredCompletedReviews = useMemo(() =>
        completedReviews.filter(review =>
            review.productName.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
            (review.reviewtext && review.reviewtext.toLowerCase().includes(debouncedSearchTerm.toLowerCase()))
        ),
        [completedReviews, debouncedSearchTerm]
    );

    // 카드 클릭 핸들러: 이제 모든 카드는 상세 보기 모달만 엽니다.
    const handleCardClick = (item) => {
        setSelectedItem(item);
        setIsDetailModalOpen(true);
    };

    return (
        <div className="w-11/12 ml-20">
            <div className="relative overflow-hidden min-h-screen">
                <BackgroundLayers />
                <div className="relative z-10 p-8">
                    <h2 id="font3" className="text-3xl text-white font-bold pb-6 border-b border-white/20">MY REVIEW</h2>
                    
                    {/* 리뷰 현황판 UI 단순화 */}
                    <div className="my-6 p-6 rounded-lg text-center">
                        <p className="text-white text-lg">
                            총 <span className="font-bold text-[#E2E29D]">{completedReviews.length}</span>개의 소중한 리뷰를 남겨주셨습니다.
                        </p>
                        <p className="text-gray-400 mt-2">회원님의 경험은 다른 분들께 큰 도움이 됩니다.</p>
                    </div>

                    {/* 탭 기능 제거 및 고정 타이틀로 변경 */}
                    <div className="flex mt-8">
                        <div className="px-6 py-2 font-semibold text-base text-kalani-navy bg-white rounded-t-xl">
                            작성한 리뷰 ({filteredCompletedReviews.length})
                        </div>
                    </div>

                    <div className='bg-white rounded-tr-xl rounded-b-xl'>
                        <input
                            type="text"
                            placeholder="상품명 또는 리뷰 내용으로 검색..."
                            className="w-full bg-white p-3 outline-none rounded-tr-xl border-b border-gray-200"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <div className="px-4 pt-4 pb-8 md:p-6 bg-white rounded-b-xl rounded-tr-xl grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 min-h-[300px]">
                            {isLoading ? (
                                <div className="col-span-full text-center py-20">리뷰 목록을 불러오는 중...</div>
                            ) : filteredCompletedReviews.length > 0 ? (
                                filteredCompletedReviews.map(review => (
                                    <ReviewCard
                                        key={review.reviewid} // reviewid를 key로 사용
                                        item={review}
                                        onCardClick={() => handleCardClick(review)}
                                    />
                                ))
                            ) : (
                                <div className="col-span-full text-center py-20 text-gray-500">
                                    작성한 리뷰가 없습니다.
                                </div>
                            )}
                        </div>
                    </div>
                </div>
                
                {/* 모달 영역: 상세 보기 모달만 남깁니다. */}
                <AnimatePresence>
                    {isDetailModalOpen && selectedItem && ( <ReviewDetailModal item={selectedItem} onClose={() => setIsDetailModalOpen(false)} /> )}
                </AnimatePresence>
            </div>
        </div>
    );
}