import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import ModelViewer from './ModelViewer';

export default function AdPage() {
    // 제품 ID는 실제 상품에 맞게 변경해야 합니다.
    const productId = 'SHOE-001';

    return (
        <div className="w-full min-h-screen bg-kalani-creme flex flex-col lg:flex-row">

            {/* 왼쪽: 3D 모델 뷰어 영역 */}
            <div className="w-full lg:w-3/5 h-[50vh] lg:h-screen bg-gray-200">
                <ModelViewer />
            </div>

            {/* 오른쪽: 광고 문구 및 정보 영역 */}
            <div className="w-full lg:w-2/5 flex items-center justify-center p-8 lg:p-16">
                <div className="max-w-md text-left">

                    {/* 애니메이션을 위한 컨테이너 */}
                    <motion.div
                        initial="hidden"
                        animate="visible"
                        variants={{
                            hidden: { opacity: 0 },
                            visible: {
                                opacity: 1,
                                transition: { staggerChildren: 0.2, delayChildren: 0.3 }
                            }
                        }}
                    >
                        {/* 텍스트 요소별로 애니메이션 적용 */}
                        <motion.p
                            className="text-sm font-medium text-kalani-gold tracking-widest mb-2"
                            variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
                        >
                            THE ESSENTIAL
                        </motion.p>

                        {/* 브랜드 이름 */}
                        <motion.h1
                            id="font"
                            className="text-5xl lg:text-6xl font-bold text-kalani-navy mb-6"
                            variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
                        >
                            TRACE No.01
                        </motion.h1>

                        {/* 광고 문구 */}
                        <motion.p
                            className="text-base text-kalani-ash leading-relaxed mb-8"
                            variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
                        >
                            가장 조용한 선언. TRACE는 불필요한 모든 것을 덜어내고 오직 본질에만 집중합니다. 당신의 모든 걸음이 쌓여 완성되는 유일한 흔적, 시간이 흘러도 변치 않는 가치를 경험하세요.
                        </motion.p>

                        {/* 특징 리스트 */}
                        <motion.ul
                            className="space-y-3 text-sm text-kalani-ash border-t border-kalani-stone pt-6 mb-10"
                            variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
                        >
                            <li className="flex items-center">
                                <span className="font-semibold w-28">소재:</span>
                                <span>이탈리안 스웨이드 & 풀-그레인 레더</span>
                            </li>
                            <li className="flex items-center">
                                <span className="font-semibold w-28">안감:</span>
                                <span>최고급 카프스킨 안감</span>
                            </li>
                            <li className="flex items-center">
                                <span className="font-semibold w-28">제조:</span>
                                <span>포르투갈 장인의 수작업</span>
                            </li>
                        </motion.ul>

                        {/* 구매 버튼 */}
                        <motion.div variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}>
                            <Link
                                to={`/detail/${productId}`}
                                className="inline-block w-full text-center px-8 py-4 bg-kalani-navy text-white font-semibold rounded-md shadow-md hover:opacity-90 transition-opacity"
                            >
                                자세히 보기 & 구매하기
                            </Link>
                        </motion.div>
                    </motion.div>

                </div>
            </div>
        </div>
    );
}