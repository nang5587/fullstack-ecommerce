// src/components/MyReview.js

import React, { useState, useMemo, useEffect  } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// 더미 데이터 import
import reviewData from '../data/reviewData';

// 하위 컴포넌트들 (주석 처리된 컴포넌트는 별도 파일로 있다고 가정)
// import ReviewStatus from './ReviewStatus';
// import ReviewCard from './ReviewCard';
import ReviewWriteModal from './ReviewWriteModal';
import ReviewDetailModal from './ReviewDetailModal';


// (BackgroundLayers, Shell 컴포넌트는 변경 사항 없으므로 생략)
const Shell = ({ className, delay = 0 }) => (
    <motion.div
        className={`absolute w-24 h-24 ${className}`}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 0.5, y: 0, filter:'drop-shadow(0 0 8px rgba(173, 216, 230, 0.3))' }}
        transition={{ duration: 1, delay: delay, ease: 'easeOut' }}
        whileHover={{ opacity: 0.7, scale: 1.5, rotate: 7, filter: 'drop-shadow(0 0 20px rgba(173, 216, 230, 0.6))'}}
    >
        <img src="/clam.png" alt="decorative shell" className="w-full h-full" />
    </motion.div>
);

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

// 메인 컴포넌트
export default function MyReview() {
    // 1. 상태 관리
    const [allReviews, setAllReviews] = useState(reviewData);
    const [activeTab, setActiveTab] = useState('writable');
    
    const [searchTerm, setSearchTerm] = useState('');
    const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');

    const [selectedItem, setSelectedItem] = useState(null);
    const [isWriteModalOpen, setIsWriteModalOpen] = useState(false);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

    useEffect(() => {
        // 500ms(0.5초) 후에 검색어를 업데이트하는 타이머 설정
        const handler = setTimeout(() => {
            setDebouncedSearchTerm(searchTerm);
        }, 500);

        // 사용자가 다시 입력하면 이전 타이머를 취소하고 새 타이머를 설정
        return () => {
            clearTimeout(handler);
        };
    }, [searchTerm]);
    
    // ✅ 2. '작성 가능' 리뷰 필터링 로직 수정
    const writableReviews = useMemo(() =>
        allReviews
            .filter(review => !review.complete)
            .filter(review =>
                review.productName.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
            ),
        [allReviews, debouncedSearchTerm]); // debouncedSearchTerm에 의존

    const completedReviews = useMemo(() =>
        allReviews
            .filter(review => review.complete)
            .filter(review =>
                review.productName.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
                (review.reviewtext && review.reviewtext.toLowerCase().includes(debouncedSearchTerm.toLowerCase()))
            ),
        [allReviews, debouncedSearchTerm]);

    const totalReviews = allReviews.length;
    // 작성 완료된 리뷰의 '전체' 개수를 기준으로 작성률 계산
    const totalCompletedCount = useMemo(() => allReviews.filter(r => r.complete).length, [allReviews]);
    const completionRate = totalReviews > 0 ? (totalCompletedCount / totalReviews) * 100 : 100;

    // 3. 카드 클릭 핸들러
    const handleCardClick = (item) => {
        setSelectedItem(item);
        if (item.complete) {
            setIsDetailModalOpen(true);
        } else {
            setIsWriteModalOpen(true);
        }
    };

    // 4. 리뷰 제출 핸들러
    const handleReviewSubmit = (submittedReview) => {
        setAllReviews(prevReviews =>
            prevReviews.map(review =>
                review.optionId === submittedReview.optionId ? { ...review, ...submittedReview, complete: true } : review
            )
        );
        setIsWriteModalOpen(false);
    };

    return (
        <div className="w-11/12 ml-20">
            <div className="relative overflow-hidden min-h-screen">
                <BackgroundLayers />
                <div className="relative z-10 p-8">
                    <h2 id="font3" className="text-3xl text-white font-bold pb-6 border-b border-white/20">MY REVIEW</h2>
                    <ReviewStatus
                        rate={completionRate}
                        // 검색과 무관하게 전체 작성 가능 개수를 보여줌
                        writableCount={allReviews.filter(r => !r.complete).length}
                    />
                    <div className="flex mt-8">
                        <TabButton
                            // 탭에는 검색 결과 개수를 표시하여 사용자에게 피드백 제공
                            label={`작성 가능 (${writableReviews.length})`}
                            isActive={activeTab === 'writable'}
                            onClick={() => setActiveTab('writable')}
                        />
                        <TabButton
                            label={`작성 완료 (${completedReviews.length})`}
                            isActive={activeTab === 'completed'}
                            onClick={() => setActiveTab('completed')}
                        />
                    </div>

                    <div className='bg-white rounded-tr-xl rounded-b-xl'>
                        {/* ✅ 3. 검색창을 항상 표시하도록 수정 */}
                        <input
                            type="text"
                            // 작성 가능 탭은 리뷰 내용이 없으므로 placeholder 텍스트 수정
                            placeholder={
                                activeTab === 'writable'
                                    ? "상품명으로 검색..."
                                    : "상품명 또는 리뷰 내용으로 검색..."
                            }
                            className="w-full bg-white p-3 outline-none rounded-tr-xl border-b border-gray-200"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <div className="px-4 pt-4 pb-8 md:p-6 bg-white rounded-b-xl rounded-tr-xl grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                            {(activeTab === 'writable' ? writableReviews : completedReviews).map(review => (
                                <ReviewCard
                                    key={review.optionId}
                                    item={review}
                                    onCardClick={() => handleCardClick(review)}
                                />
                            ))}
                        </div>
                    </div>
                </div>
                {/* 모달 영역 */}
                <AnimatePresence>
                    {isWriteModalOpen && selectedItem && ( <ReviewWriteModal item={selectedItem} onClose={() => setIsWriteModalOpen(false)} onSubmit={handleReviewSubmit} /> )}
                    {isDetailModalOpen && selectedItem && ( <ReviewDetailModal item={selectedItem} onClose={() => setIsDetailModalOpen(false)} /> )}
                </AnimatePresence>
            </div>
        </div>
    );
}
// ----------------- 하위 UI 컴포넌트들 (별도 파일로 분리 추천) -----------------

// 탭 버튼
const TabButton = ({ label, isActive, onClick }) => (
    <button
        onClick={onClick}
        className={`px-6 py-2 font-semibold text-base transition-colors duration-300 relative ${isActive ? "text-kalani-navy bg-white rounded-t-xl" : "rounded-t-xl text-gray-500 bg-white/70"}`}
    >
        {label}
        {/* {isActive && <motion.div layoutId="underline" className="absolute bottom-0 left-0 right-0 h-1 bg-[#FFFFB3]" />} */}
    </button>
);

// 리뷰 현황판
const ReviewStatus = ({ rate, writableCount }) => {
    const message = writableCount > 0
        ? `총 ${writableCount}개의 상품에 대한 소중한 의견을 기다리고 있어요!`
        : "모든 상품에 리뷰를 남겨주셨어요! 님의 경험은 다른 분들께 큰 도움이 됩니다.";

    return (
        <div className="my-6 p-6 rounded-lg">
            <div className="flex justify-between items-center mb-2">
                <span className="font-bold text-white">나의 리뷰 작성률</span>
                <span className="font-bold text-[#E2E29D]">{Math.round(rate)}%</span>
            </div>
            <div className="w-full bg-slate-700 rounded-full h-2.5">
                <motion.div
                    className="bg-[#E2E29D] h-2.5 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${rate}%` }}
                    transition={{ duration: 1, ease: 'easeOut' }}
                />
            </div>
            <p className="text-center text-gray-400 mt-4">{message}</p>
        </div>
    );
};

// 리뷰 카드
const ReviewCard = ({ item, onCardClick }) => (
    <motion.div
        onClick={onCardClick}
        className="w-9/12 bg-white rounded-2xl overflow-hidden cursor-pointer border border-transparent hover:border-kalani-gold shadow-kal"
        whileHover={{ y: -5 }}
    >
        <img src={item.imageUrl} alt={item.productName} className="w-full asoect-[4/3] object-cover" />
        <div className="p-4">
            <h4 className="font-bold text-gray-700 truncate">{item.productName}</h4>
            <p className="text-sm text-gray-400">{new Date(item.createdAt).toLocaleDateString()}</p>
        </div>
    </motion.div>
);