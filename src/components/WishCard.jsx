// src/components/WishCard.jsx

import { FaHeart, FaThumbtack } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import TailButton from '../UI/TailButton';

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


export default function WishCard({ imageUrl, name, createdat, onFavoriteClick, onPinClick }) {
    // ✨ 2. useInView만 사용합니다. useAnimation은 더 이상 필요 없습니다.
    const [ref, inView] = useInView({
        threshold: 0.5, // 카드 전체의 50%가 보이면 실행
        triggerOnce: false,
    });

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
                {/* 이미지 + 구매버튼 (이 부분은 애니메이션이 없으므로 일반 div) */}
                <div className="w-full h-full relative group">
                    <img
                        src={imageUrl}
                        alt={name}
                        className="
                            w-full h-full 
                            object-cover object-center 
                            transition-transform duration-500 ease-in-out 
                            group-hover:scale-105
                        "
                    />
                    <TailButton
                        className="
                            absolute bottom-4 left-1/2 -translate-x-1/2
                            px-4 py-2 text-sm font-semibold 
                            shadow-lg border border-white text-white
                            bg-opacity-0 opacity-0 group-hover:opacity-100
                            transition-opacity duration-300 z-10
                        "
                        onClick={()=>{}}
                    >
                        구매하러 가기
                    </TailButton>
                </div>
            </div>

            {/* ✅ 텍스트 영역 (애니메이션이 적용될 자식 motion.div) */}
            {/* ✨ 4. 이 자식 motion.div는 부모의 animate 상태를 자동으로 상속받습니다. */}
            <motion.div
                variants={textVariants} // 자식 Variants 적용
                className="
                    bg-opacity-0
                    w-64
                    h-[90px] 
                    flex flex-col justify-between 
                    px-4 py-3
                "
            >
                <p className="text-white font-semibold text-base line-clamp-2">
                    {name}
                </p>
                <div className="flex items-center justify-between mt-2">
                    <span className="text-sm text-kalani-gold font-medium">{createdat}</span>
                    <div className="flex items-center gap-1">
                        {/* <button onClick={onFavoriteClick}
                            className="p-2 rounded-full text-kalani-taupe hover:bg-kalani-gold/20 hover:text-kalani-gold">
                            <FaHeart size={16} />
                        </button> */}
                        <button onClick={onPinClick}
                            className="p-2 rounded-full text-kalani-taupe hover:bg-kalani-gold/20 hover:text-kalani-gold">
                            <FaHeart size={16} />
                        </button>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
}