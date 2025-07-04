import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
// import { qnaData } from '../data/qnaData';
import QnaCard from '../components/QnaCard';

import QnaDetailModal from './QnaDetailModal';
import QnaWriteModal from '../components/QnaWriteModal';

import { FiMinus, FiPlus, FiCheck } from 'react-icons/fi';

import api from '../api/axios';

function SwayingCoral({ position = 'left' }) {
    const horizontalPosition = position === 'left' ? 'left-[-10%]' : 'right-[-10%]';
    // 왼쪽과 오른쪽 산호가 약간 다른 느낌을 주도록 회전 값을 다르게 설정
    const rotation = position === 'left' ? [-3, 3, -3] : [2, -4, 2];

    return (
        <motion.div
            className={`absolute bottom-[-2%] w-[400px] h-auto z-1 ${horizontalPosition}`}
            animate={{
                rotate: rotation, // 좌우로 천천히 흔들림
                y: ['0px', '-5px', '0px'] // 위아래로 살짝 떠오르는 느낌
            }}
            transition={{
                duration: 12, // 12초에 걸쳐 한 번 왕복
                ease: 'easeInOut',
                repeat: Infinity,
                repeatType: 'reverse'
            }}
        >
            <img
                src="/coral.png" // ✅ 여기에 준비하신 산호 png 파일 경로를 입력하세요.
                alt="Swaying Coral Silhouette"
                className="w-full h-full"
                style={{
                    filter: 'brightness(0)', // 그림자 효과
                    opacity: 0.08, // 거북이보다 더 은은하게
                    transform: position === 'right' ? 'scaleX(-1)' : 'scaleX(1)' // 오른쪽 산호는 좌우 반전
                }}
            />
        </motion.div>
    );
}

function SwimmingTurtle() {
    return (
        <motion.div
            // ✅ z-index를 조정하여 햇살 효과 '뒤'에 위치하도록 함
            className="absolute top-0 left-0 w-48 h-48 z-1"
            animate={{
                x: ['-20%', '100vw', '-20%'],
                y: ['20vh', '40vh', '20vh'],
                rotate: [-10, 15, -10],
            }}
            transition={{
                duration: 60,
                ease: 'easeInOut',
                repeat: Infinity,
                repeatType: 'reverse'
            }}
        >
            {/* ✅✅✅ img 태그에 filter와 opacity를 적용하여 그림자 효과 생성 ✅✅✅ */}
            <img
                src="/turtle.png"
                alt="Swimming Turtle Silhouette"
                className="w-full h-full"
                style={{
                    // 1. 이미지를 완전히 검게 만듭니다.
                    filter: 'brightness(0) invert(0)',
                    // 2. 투명도를 10%로 설정하여 은은한 그림자처럼 만듭니다.
                    opacity: 0.1,
                    // 3. (선택) 배경과 더 부드럽게 섞이도록 blur 효과를 살짝 줍니다.
                    // filter: 'brightness(0) invert(0) blur(1px)', 
                }}
            />
        </motion.div>
    );
}

function BackgroundLayers() {
    return (
        <>
            {/* 바다색 그라데이션 배경 */}
            {/* <div className="absolute inset-0 bg-gradient-to-br from-[#a0c3d2] via-[#507d91] to-[#345f6e]" /> */}
            {/* <div className="absolute inset-0 bg-gradient-to-br from-[#c4dfe6] via-[#4a8388] to-[#2e5053]" /> */}
            <div className="absolute inset-0 bg-[#fff3dd]" />

            {/* 햇살 효과 */}
            <div className="absolute inset-0 sunbeam-effect" />

            {/* 유영하는 거북이 */}
            <SwimmingTurtle />

            <SwayingCoral position="left" />
            <SwayingCoral position="right" />
        </>
    );
}

// ✅ 카테고리 분류 로직 (QnaCard에서도 사용되므로, 나중에는 별도 파일로 분리하는 것이 좋습니다)
const getCategoryFromQuestion = (questionText) => {
    if (!questionText) return '기타';
    const q = questionText.toLowerCase();
    if (q.includes('사이즈') || q.includes('키') || q.includes('핏') || q.includes('크기')) return '사이즈/핏';
    if (q.includes('배송') || q.includes('언제') || q.includes('출고') || q.includes('도착')) return '배송';
    if (q.includes('재입고') || q.includes('품절')) return '재입고';
    return '상품정보';
};

// --- 메인 페이지 컴포넌트 ---
export default function MyQnaPage() {
    const [allMyQna, setAllMyQna] = useState([]);
    const [isLoading, setIsLoading] = useState(true); // 로딩 상태
    const [error, setError] = useState(null); // 에러 상태

    const [isWriteModalOpen, setIsWriteModalOpen] = useState(false);
    const [productIdToSubmit, setProductIdToSubmit] = useState(null);

    const [activeCategory, setActiveCategory] = useState('전체');
    const [selectedQna, setSelectedQna] = useState(null);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
    const [hoveredCardId, setHoveredCardId] = useState(null);


    const fetchQnaList = async () => {
        // 첫 로딩 시에만 isLoading을 true로 설정
        if (allMyQna.length === 0) {
            setIsLoading(true);
        }
        setError(null);
        try {
            const response = await api.get('/api/member/qnalist');
            setAllMyQna(response.data);
        } catch (err) {
            console.error("Failed to fetch Q&A list:", err);
            setError("데이터를 불러오는 데 실패했습니다.");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        const productIdFromState = sessionStorage.getItem('askAboutProductId');
        if (productIdFromState) {
            setProductIdToSubmit(productIdFromState);
            setIsWriteModalOpen(true);
            sessionStorage.removeItem('askAboutProductId');
        }
        fetchQnaList();
    }, []);

    // ✅ 2. useMemo 로직에 카테고리 필터링 추가
    const filteredQnaList = useMemo(() => {
        if (activeCategory === '전체') {
            return allMyQna; // 전체 목록을 반환
        }
        // 전체 목록에서 선택된 카테고리로 필터링
        return allMyQna.filter(q => getCategoryFromQuestion(q.question) === activeCategory);
    }, [allMyQna, activeCategory]); // activeCategory가 바뀔 때마다 재계산

    const handleCardClick = (qnaItem) => {
        setSelectedQna(qnaItem);
        setIsDetailModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsDetailModalOpen(false);
        setIsWriteModalOpen(false);
        setTimeout(() => setSelectedQna(null), 300);
    };

    const handleNewQnaClick = () => {
        setIsWriteModalOpen(true);
    };


    const handleQnaSubmit = async (newQuestionData) => {
        const payload = {
            imgname: productIdToSubmit,
            question: newQuestionData.question,
        };
        console.log("Submitting payload to /api/member/addqna:", payload);
        try {
            console.log("새 질문 제출:", payload);
            const response = await api.post('api/member/addqna', payload);
            console.log(response)
            setAllMyQna(response.data);
            // await fetchQnaList();
        } catch (err) {
            console.error("Failed to submit new question:", err);
            alert("질문 등록에 실패했습니다.");
        } finally {
            // 모달 닫기
            handleCloseModal();
        }
    };

    const handleQnaDelete = async (qaidToDelete) => {
        // 사용자에게 정말 삭제할 것인지 한 번 더 확인
        if (!window.confirm("이 질문을 정말 삭제하시겠습니까?")) {
            return;
        }

        console.log("Deleting QnA with qaid:", qaidToDelete);

        try {
            // 1. 백엔드로 보낼 요청 Body (또는 DTO) 구성
            const payload = { qaid: qaidToDelete };

            // 2. PATCH 요청으로 API 호출
            const response = await api.patch('/api/member/deleteqna', payload);

            // 3. 응답으로 받은 새로운 QnA 전체 목록으로 상태 업데이트
            console.log("Received updated QnA list after deletion:", response.data);
            setAllMyQna(response.data);

            // 4. 상세 모달 닫기
            handleCloseModal();

        } catch (err) {
            console.error("Failed to delete QnA:", err);
            alert("질문 삭제에 실패했습니다.");
        }
    };

    // 필터링 버튼에 사용할 카테고리 목록
    const categories = ['전체', '사이즈/핏', '배송', '재입고', '상품정보'];

    if (isLoading) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-[#fff3dd]">
                <p id="font3" className="text-xl text-[#806050]">Q&A 목록을 불러오는 중...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-[#fff3dd]">
                <p id="font3" className="text-xl text-red-500">{error}</p>
            </div>
        );
    }

    return (
        <div className="w-11/12 ml-20">
            <div className="relative overflow-hidden min-h-screen">
                <BackgroundLayers />
                <div className="relative z-10 p-8">
                    {/* 헤더 */}
                    <div className="flex justify-between items-center pb-6 border-b border-[#806050]">
                        <h2 id="font3" className="text-3xl text-[#806050] font-bold">
                            Q&A
                        </h2>
                        <button onClick={handleNewQnaClick} className="flex flex-row items-center justify-center px-4 py-2 bg-white text-black rounded-lg shadow-md 
                                            border border-gray-200 hover:bg-white/30 backdrop-blur-sm transition-colors font-bold">
                            <FiPlus />&nbsp;새 질문하기
                        </button>
                    </div>

                    {/* 카테고리 필터 (스타일 수정) */}
                    <div className="flex items-center gap-2 mt-6 py-2 overflow-x-auto">
                        {categories.map(category => (
                            <button
                                key={category}
                                onClick={() => setActiveCategory(category)} // ✅ onClick 핸들러 연결
                                className={`px-4 py-2 text-sm font-semibold rounded-full transition-colors whitespace-nowrap backdrop-blur-sm
                                    ${activeCategory === category
                                        ? 'text-kalani-navy font-bold underline underline-offset-3'
                                        : 'text-gray-700 hover:underline underline-offset-3'
                                    }`}
                            >
                                {`# ${category}`}
                            </button>
                        ))}
                    </div>

                    {/* Q&A 카드 그리드 */}
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 mt-4">
                        {filteredQnaList.map(qna => (
                            <QnaCard
                                key={qna.qnaId}
                                qna={qna}
                                isHovered={hoveredCardId === qna.qnaId}
                                onMouseEnter={() => setHoveredCardId(qna.qnaId)}
                                onMouseLeave={() => setHoveredCardId(null)}
                                onClick={() => handleCardClick(qna)}
                            />
                        ))}
                    </div>
                </div>
                <AnimatePresence>
                    {isDetailModalOpen && selectedQna && (
                        <QnaDetailModal qna={selectedQna} onClose={handleCloseModal} onDelete={handleQnaDelete}  />
                    )}
                    {/* ✅ 질문 작성 모달 렌더링 추가 */}
                    {isWriteModalOpen && (
                        <QnaWriteModal
                            onClose={handleCloseModal}
                            onSubmit={handleQnaSubmit}
                        />
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}