// src/components/WishCard.jsx

import { FaHeart, FaThumbtack } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import TailButton from '../UI/TailButton';

import { useNavigate } from 'react-router-dom';

// ✨ 1. 애니메이션 Variants를 컴포넌트 외부에 정의하여 재사용성을 높입니다.
const containerVariants = {
    hidden: { opacity: 1 }, // 부모는 항상 보이지만, 자식들을 컨트롤합니다.
    visible: {
        opacity: 1,
        transition: {
            // 자식 애니메이션을 0.2초 간격으로 순차 실행
            staggerChildren: 0.2,
        },
    },
};

const textVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.6, ease: 'easeOut' },
    },
};


export default function WishCard({ imgname, imageUrl, productName, createdat, onFavoriteClick }) {
    // ✨ 2. useInView만 사용합니다. useAnimation은 더 이상 필요 없습니다.
    const [ref, inView] = useInView({
        threshold: 0.5, // 카드 전체의 50%가 보이면 실행
        triggerOnce: false,
    });

    const navigate = useNavigate();

    return (
        // ✨ 3. 감시 대상이 될 부모 motion.div
        <motion.div
            ref={ref}
            // inView 상태에 따라 'visible' 또는 'hidden' 상태를 animate prop에 직접 전달
            animate={inView ? 'visible' : 'hidden'}
            initial="hidden"
            variants={containerVariants} // 부모 Variants 적용
            className="flex flex-col items-center"
        >
            {/* ✅ 카드 본체 */}
            <div
                className="
                    bg-opacity-0
                    rounded-2xl 
                    shadow-lg 
                    overflow-hidden 
                    w-64 
                    flex flex-col 
                    h-[380px]
                "
            >
                <div className="w-full h-full relative group">
                    <img
                        src={imageUrl}
                        alt={productName}
                        className="
                            w-full h-full 
                            object-cover object-center 
                            transition-transform duration-500 ease-in-out 
                            group-hover:scale-105
                        "
                    />
                    <TailButton
                        className="
                            absolute bottom-4 left-[25%] -translate-x-1/2 mr-4
                            w-fit px-4 py-2 text-sm font-semibold 
                            shadow-lg border border-white text-white
                            bg-opacity-0 opacity-0 group-hover:opacity-100
                            transition-opacity duration-300 z-10 whitespace-nowrap
                        "
                        onClick={() => navigate(`/detail/${imgname}`)}
                    >
                        구매하러 가기
                    </TailButton>
                </div>
            </div>

            <motion.div
                variants={textVariants}
                className="
                    bg-opacity-0
                    w-64
                    h-[90px] 
                    flex flex-col justify-between 
                    px-4 py-3
                "
            >
                <p className="text-white font-semibold text-base line-clamp-2">
                    {productName}
                </p>
                <div className="flex items-center justify-between mt-2">
                    <span className="text-sm text-kalani-gold font-medium">{createdat}</span>
                    <div className="flex items-center gap-1">
                        {/* <button onClick={onFavoriteClick}
                            className="p-2 rounded-full text-kalani-taupe hover:bg-kalani-gold/20 hover:text-kalani-gold">
                            <FaHeart size={16} />
                        </button> */}
                        <button onClick={onFavoriteClick}
                            className="p-2 rounded-full text-kalani-taupe hover:bg-kalani-gold/20 hover:text-kalani-gold">
                            <FaHeart size={16} />
                        </button>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
}