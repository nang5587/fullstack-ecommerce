import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Star } from 'lucide-react';

// 별점 표시를 위한 헬퍼 컴포넌트
const StarRating = ({ rating }) => {
    return (
        <div className="flex items-center">
            {[...Array(5)].map((_, index) => (
                <Star
                    key={index}
                    size={18}
                    className={index < rating ? 'text-yellow-400 fill-current' : 'text-gray-600'}
                />
            ))}
        </div>
    );
};

export default function ReviewCard({ review, isExpanded, onCardClick }) {
    const navigate = useNavigate();

    const handleProductLink = (e) => {
        // 카드가 열리고 닫히는 것을 방지 (이벤트 전파 중단)
        e.stopPropagation();
        navigate(`/product/${review.imgname}`);
    };

    return (
        <motion.div
            layout // 레이아웃 변경 시 부드러운 애니메이션을 자동으로 적용
            onClick={onCardClick}
            className="w-full bg-gray-50 rounded-2xl p-4 cursor-pointer overflow-hidden border border-white/10"
            transition={{ layout: { duration: 0.3, ease: "easeOut" } }}
        >
            {/* 항상 보이는 부분 */}
            <div className="flex items-start gap-4">
                <div className="flex-1">
                    <h4 className="font-bold text-gray-700 text-lg">{review.productName}</h4>
                    <StarRating rating={review.rating} />
                    {!isExpanded && (
                        <p className="text-gray-400 mt-2 line-clamp-2">{review.reviewtext}</p>
                    )}
                </div>
            </div>

            {/* 확장될 때만 보이는 부분 */}
            <AnimatePresence>
                {isExpanded && (
                    <motion.div
                        initial={{ opacity: 0, height: 0, marginTop: 0 }}
                        animate={{ opacity: 1, height: 'auto', marginTop: '1rem' }}
                        exit={{ opacity: 0, height: 0, marginTop: 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        <p className="text-gray-400 whitespace-pre-wrap">{review.reviewtext}</p>
                        <button
                            onClick={handleProductLink}
                            className="text-sm text-kalani-gold hover:underline mt-4"
                        >
                            상품 보러가기
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
}