import { useEffect, useState } from 'react';

import TailButton from '../UI/TailButton';
import ReviewWriteForm from './ReviewWriteForm';
import ErrorMessage from './ErrorMessage';

import api from '../api/axios';

export default function ReviewPage({ isLoggedIn, productId, username }) {
    const [reviews, setReviews] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false); // ✅ 리뷰 제출 중 로딩 상태
    const [reviewTarget, setReviewTarget] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [visibleCount, setVisibleCount] = useState(5);
    const [errorMsg, setErrorMsg] = useState('');

    // ✅ 리뷰 목록을 다시 불러오는 함수를 분리하여 재사용성을 높입니다.
    const fetchReviews = async () => {
        if (!productId) {
            setReviews([]);
            setIsLoading(false);
            return;
        }
        setIsLoading(true);
        try {
            const res = await api.get(`/api/public/reviews/product/${productId}`);
            const validReviews = Array.isArray(res.data) ? res.data.filter(r => r.remain) : [];
            setReviews(validReviews);
        } catch (err) {
            console.error("리뷰 데이터를 불러오는 데 실패함: ", err.response?.data || err.message);
            setReviews([]);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchReviews();
    }, [productId]);

    const averageRating = reviews.length > 0
        ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
        : '0.0';

    // ✅ 리뷰 제출 핸들러 수정
    const handleReviewSubmit = async (formData) => {
        // formData에는 { text, rating, orderid, optionid }가 들어올 것으로 가정합니다.
        // 이 값들은 ReviewWriteForm에서 받아와야 합니다.
        if (!formData.orderid || !formData.optionid) {
            setErrorMsg("리뷰를 작성할 주문 정보를 찾을 수 없습니다.");
            return;
        }

        setIsSubmitting(true);
        setErrorMsg('');

        try {
            // 1. 백엔드가 요구하는 데이터 형식에 맞춰 payload를 생성합니다.
            const payload = {
                orderid: formData.orderid,
                optionid: formData.optionid,
                reviewtext: formData.text,
                rating: formData.rating,
                // username과 imgname은 백엔드에서 토큰과 요청 경로로 알 수 있으므로
                // 보통 프론트에서 보낼 필요가 없습니다. (API 명세에 따라 조절)
            };

            console.log("리뷰 등록 요청 데이터:", payload);

            // 2. 백엔드 주소(@PostMapping("/addreviews"))에 맞게 API를 호출합니다.
            await api.post('/api/public/addreviews', payload);

            alert('리뷰가 성공적으로 등록되었습니다!');
            setShowForm(false); // 리뷰 작성 폼을 닫습니다.

            // 3. 리뷰 등록 성공 후, 리뷰 목록을 다시 불러와 화면을 갱신합니다.
            await fetchReviews();

        } catch (err) {
            console.error("리뷰 등록 실패:", err.response?.data || err.message);
            setErrorMsg(err.response?.data?.message || "리뷰 등록에 실패했습니다. 다시 시도해주세요.");
        } finally {
            setIsSubmitting(false);
        }
    };


    useEffect(() => {
        setVisibleCount(5);
    }, [productId]);

    const handleLoadMore = () => {
        setVisibleCount(prev => prev + 5);
    };

    const visibleReviews = reviews.slice(0, visibleCount);
    const hasMore = visibleCount < reviews.length;

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
                        <span className="text-gray-500 ml-1">{`— ${reviews.length} Reviews`}</span>
                    </h2>
                </div>

                {errorMsg && <ErrorMessage errorMsg={errorMsg} />}

                {isLoading && <div className="text-center py-10">리뷰를 불러오는 중...</div>}
                {!isLoading && reviews.length === 0 && (
                    <div className="text-center py-10 text-gray-500">작성된 리뷰가 없습니다.</div>
                )}

                {!isLoading && visibleReviews.map(review => (
                    <div key={review.reviewid} className="border-b border-gray-300 py-6 flex gap-4">
                        <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-sm font-bold text-gray-600">
                            {review.username.substring(0, 2).toUpperCase()}
                        </div>

                        <div className="flex-1">
                            <div className="flex justify-between items-center">
                                <div className="font-medium">{review.username}</div>
                                <div className="text-sm text-gray-400">{new Date(review.createdate).toLocaleDateString()}</div>
                            </div>
                            <p className="text-gray-700 mt-2">{review.reviewtext}</p>
                            <div className="text-yellow-500 mt-1">
                                {'★'.repeat(review.rating) + '☆'.repeat(5 - review.rating)}
                            </div>
                        </div>
                    </div>
                ))}

                {hasMore && !isLoading && (
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