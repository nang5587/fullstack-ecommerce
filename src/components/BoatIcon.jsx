import { motion } from 'framer-motion';
import { GiSailboat } from 'react-icons/gi'; // 1. 원하는 아이콘으로 교체

export default function BoatIcon({ progress, pathId }) {
    return (
        <motion.div
            style={{
                position: 'absolute',
                offsetPath: `url(#${pathId})`,
                offsetDistance: progress,
                offsetRotate: 'auto 90deg', // ✨ 'auto'로 설정하면 길의 방향에 따라 회전합니다. 90deg를 더해 배가 옆으로 눕지 않고 정면을 보도록 합니다.
                zIndex: 9,
                // ✨ 2. 회전의 기준점을 중앙으로 설정합니다. (안정성 향상)
                transformOrigin: 'center center',
            }}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
        >
            {/* 2. 아이콘 스타일링 변경 */}
            <div className="-rotate-90"> {/* 회전 보정을 위해 -90도 */}
                <GiSailboat size={50} className="text-kalani-gold" />
            </div>
        </motion.div>
    );
}