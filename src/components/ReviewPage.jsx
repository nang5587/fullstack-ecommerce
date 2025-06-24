import { useEffect, useState, useMemo } from 'react';

import TailButton from '../UI/TailButton';

import ReviewWriteForm from './ReviewWriteForm';
import ErrorMessage from './ErrorMessage';

import api from '../api/axios';

const dummyReviews = [
    {
        username: "user",
        name: "김지은",
        date: "2025-06-18",
        content: "옷이 정말 편하고 예뻐요! 배송도 빨랐습니다.",
        rating: 5
    },
    {
        username: "user2",
        name: "박철수",
        date: "2025-06-17",
        content: "생각보다 재질이 두꺼워 여름엔 더울 것 같아요.",
        rating: 3
    },
    {
        username: "dummy",
        name: "lee_sunny",
        date: "2025-06-16",
        content: "핏이 예쁘고 컬러도 화면과 동일해서 만족했어요.",
        rating: 4
    },
    {
        username: "member",
        name: "Minkyu",
        date: "2025-06-15",
        content: "사이즈가 조금 작게 나왔어요. 한 사이즈 업 추천!",
        rating: 2
    },
    {
        username: "hong",
        name: "홍길동",
        date: "2025-06-14",
        content: "가성비 최고입니다. 다른 색상도 구매할 예정이에요.",
        rating: 5
    },
    {
        username: "sujin_park",
        name: "박수진",
        date: "2025-06-13",
        content: "핏이 예쁘고 세탁 후에도 형태가 잘 유지돼요.",
        rating: 4,
    },
    {
        username: "minjae_choi",
        name: "최민재",
        date: "2025-06-12",
        content: "배송이 빨랐고 색상이 화면과 똑같아요.",
        rating: 5,
    },
    {
        username: "hyeon_kim",
        name: "김현",
        date: "2025-06-11",
        content: "생각보다 얇아서 겨울엔 못 입을 것 같아요.",
        rating: 2,
    },
    {
        username: "sora_lee",
        name: "이소라",
        date: "2025-06-10",
        content: "디자인이 독특해서 마음에 들어요. 추천합니다!",
        rating: 5,
    },
    {
        username: "jaehyun_l",
        name: "이재현",
        date: "2025-06-09",
        content: "사이즈가 정사이즈보다 작게 나왔네요. 참고하세요.",
        rating: 3,
    },
    {
        username: "jiyoon_y",
        name: "윤지윤",
        date: "2025-06-08",
        content: "재질이 부드럽고 착용감이 좋아요.",
        rating: 5,
    },
    {
        username: "dongho_k",
        name: "김동호",
        date: "2025-06-07",
        content: "퀄리티는 괜찮은데 가격 대비 아쉬운 편입니다.",
        rating: 3,
    },
    {
        username: "eunji_h",
        name: "한은지",
        date: "2025-06-06",
        content: "여름용으로 딱이에요! 시원하고 가벼워요.",
        rating: 4,
    },
    {
        username: "yoonsu_p",
        name: "박윤수",
        date: "2025-06-05",
        content: "무난하게 입기 좋아요. 회사 출근룩으로 잘 입고 있어요.",
        rating: 4,
    },
    {
        username: "heesoo_c",
        name: "최희수",
        date: "2025-06-04",
        content: "바느질 마감이 살짝 아쉬웠지만 전체적으로 만족해요.",
        rating: 4,
    }
];


export default function ReviewPage({ isLoggedIn, productId, username }) {
    const [showForm, setShowForm] = useState(false);
    const [visibleCount, setVisibleCount] = useState(5);
    const [errorMsg, setErrorMsg] = useState('');

    // 리뷰 리스트 useEffect
    // useEffect(() => {
    //     const fetchReviews = async () => {
    //         try {
    //             setReviewLoading(true);
    //             const baseUrl = import.meta.env.VITE_BACKEND_URL;
    //             const res = await axios.get(`http://${baseUrl}/api/public/reviews/${productId}`);
    //             setReviews(res.data); // ← 서버 응답 형태에 따라 조정
    //         } catch (err) {
    //             console.error("리뷰 데이터를 불러오는 데 실패함: ", err);
    //             setReviewError(err);
    //         } finally {
    //             setReviewLoading(false);
    //         }
    //     };

    //     fetchReviews();
    // }, [productId]);

    const averageRating = (
        dummyReviews.reduce((sum, r) => sum + r.rating, 0) / dummyReviews.length
    ).toFixed(1);

    const handleReviewSubmit = async ({ text, rating }) => {
        try {
            const baseUrl = import.meta.env.VITE_BACKEND_URL;
            // ⭐
            await axios.post(`http://${baseUrl}/api/public/reviews`, {
                orderid,
                optionid,
                username,
                imgname: productId,
                reviewtext: text,
                rating
            });

            // ⭐
            const res = await axios.get(`http://${baseUrl}/api/public/reviewlist/${productId}`);
            setReviews(res.data);

            setShowForm(false);
        }
        catch (err) {
            console.error("리뷰 등록 실패:", err);
            // ⭐
            setErrorMsg("리뷰 등록에 실패했습니다.");
        }
    };

    useEffect(() => {
        // 페이지 진입 시 visibleCount 초기화
        setVisibleCount(5);
    }, [productId]);

    const handleLoadMore = () => {
        setVisibleCount(prev => prev + 5);
    };

    const visibleReviews = dummyReviews.slice(0, visibleCount);
    const hasMore = visibleCount < dummyReviews.length;

    useEffect(() => {
        if (errorMsg) {
            const timer = setTimeout(() => setErrorMsg(''), 3000);
            return () => clearTimeout(timer);
        }
    }, [errorMsg]);


    return (
        <div className="flex">
            {/* 리뷰 본문 */}
            <div className="flex-1 pl-8">
                <div>
                    <h2 className="text-xl font-bold">
                        리뷰 <span className="text-2xl ml-2">{averageRating}</span>
                        <span className="text-gray-500 ml-1">{`— ${dummyReviews.length} Reviews`}</span>
                    </h2>
                </div>
                <div className='flex justify-end items-center mb-10'>
                    {isLoggedIn && (
                        <TailButton
                            onClick={() => setShowForm(prev => !prev)}
                            className="border border-gray-300 px-4 py-2 rounded"
                        >
                            {showForm ? '닫기' : '리뷰 작성'}
                        </TailButton>
                    )}
                </div>

                {errorMsg && <ErrorMessage errorMsg={errorMsg} />}

                {/* 폼은 여기 아래에 나타나도록 위치 조정 */}
                {isLoggedIn && showForm && (
                    <div className="mb-8">
                        <ReviewWriteForm onSubmit={handleReviewSubmit} setErrorMsg={setErrorMsg} />
                    </div>
                )}

                {visibleReviews.map(review => (
                    <div key={review.username} className="border-b border-gray-300 py-6 flex gap-4">
                        <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-sm font-bold text-gray-600">
                            {review.username.split(' ').map(n => n[0]).join('').toUpperCase()}
                        </div>

                        <div className="flex-1">
                            <div className="flex justify-between items-center">
                                <div className="font-medium">{review.username}</div>
                                <div className="text-sm text-gray-400">{review.date}</div>
                            </div>
                            <p className="text-gray-700 mt-2">{review.content}</p>
                            <div className="text-yellow-500 mt-1">
                                {'★'.repeat(review.rating) + '☆'.repeat(5 - review.rating)}
                            </div>
                        </div>
                    </div>
                ))}

                {hasMore && (
                    <div className="mt-6 text-center">
                        <TailButton onClick={handleLoadMore} className="px-4 py-2 border border-gray-300 rounded">
                            리뷰 더 보기
                        </TailButton>
                    </div>
                )}
            </div>
        </div>
    );
}
