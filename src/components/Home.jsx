// components 목록
import ProductCarousel from "./ProductCarousel";
import BannerSlider from "./BannerSlider";
import LookBook from "./LookBook";

// UI 목록
import TailButton from "../UI/TailButton";

// 훅 목록
import { useRef, useEffect, useState } from "react";
import { Link } from "react-router-dom";

// 광고 항목
const banners = [
    '381720493',
    '920183745',
    '508172634',
    '194837261',
    '760394812',
    '239485170',
];

// test용 데이터
const model1Items = [
    {
        name: "화이트 크롭 자켓",
        price: 49900,
        fullcode: "1122414357LOPVJM",
    },
    {
        name: "하이웨이스트 와이드팬츠",
        price: 39900,
        fullcode: "1326444369FRVUFW",
    },
];

const model2Items = [
    {
        name: "화이트 크롭 자켓",
        price: 49900,
        fullcode: "1122414357LOPVJM",
    },
    {
        name: "하이웨이스트 와이드팬츠",
        price: 39900,
        fullcode: "1326444369FRVUFW",
    },
];

export default function Home() {
    const bannerRef = useRef(null);
    const recommendRef = useRef(null);
    const [isScrolling, setIsScrolling] = useState(false);
    const [hasScrolled, setHasScrolled] = useState(false);

    const smoothScrollTo = (targetY, duration = 800) => {
        const startY = window.scrollY;
        const distance = targetY - startY;
        const startTime = performance.now();

        const step = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1); // 0 ~ 1
            const ease = 1 - Math.pow(1 - progress, 3); // easeOutCubic

            window.scrollTo(0, startY + distance * ease);

            if (elapsed < duration) {
                requestAnimationFrame(step);
            } else {
                setIsScrolling(false);
            }
        };

        requestAnimationFrame(step);
    };

    useEffect(() => {
        const handleWheel = (e) => {
            const deltaY = e.deltaY;
            const scrollY = window.scrollY;
            const bannerHeight = bannerRef.current?.offsetHeight ?? 0;

            if (isScrolling) {
                e.preventDefault(); // 자동 스크롤 중일 때만 막기
                return;
            }

            // 자동 스크롤이 한 번도 실행 안됐고, 아래로 스크롤 중이며 배너 영역 내일 때만
            if (!hasScrolled && deltaY > 0 && scrollY < bannerHeight - 50) {
                e.preventDefault();
                setIsScrolling(true);
                setHasScrolled(true);

                const targetY = recommendRef.current.offsetTop;
                smoothScrollTo(targetY, 1800);
            }
        };

        window.addEventListener("wheel", handleWheel, { passive: false });
        return () => {
            window.removeEventListener("wheel", handleWheel);
        };
    }, [isScrolling, hasScrolled]);


    return (
        <>
            {/* 배너 */}
            <div ref={bannerRef} className="w-full mb-20"
                style={{ height: 'calc(100vh - 6rem)' }}>
                <BannerSlider banners={banners} />
            </div>
            {/* 추천 스타일 */}
            <div className="my-30" ref={recommendRef}>
                <ProductCarousel title="추천 스타일" column="recommend" />
            </div>

            {/* LOOKBOOK 섹션 */}
            <div className="flex flex-col xl:flex-row justify-between items-stretch px-6 lg:px-40 bg-white w-full h-auto lg:min-h-[800px] gap-10 mb-20">
                {/* 왼쪽 LookBook */}
                <div className="w-full xl:flex-1">
                    <LookBook imageSrc="src/assets/model1.png" items={model1Items} infoPosition="right" />
                </div>

                {/* 가운데 광고 문구 */}
                <div className="w-full xl:w-[600px] max-w-full flex flex-col items-center justify-center text-center py-10">
                    <h2 id="font2" className="text-4xl lg:text-5xl font-bold mb-8 lg:mb-20">2025 S/S LOOKBOOK</h2>
                    <p className="text-base lg:text-lg mb-8 lg:mb-20 text-gray-700 leading-relaxed">
                        따사로운 햇살과 함께 시작되는 새로운 계절.<br />
                        2025 S/S LOOKBOOK은 간결함 속 디테일,<br />
                        클래식과 트렌드의 조화를 담아냈습니다.<br />
                        지금, 당신의 계절을 디자인하세요.
                    </p>
                    <div className="w-[160px] lg:w-1/4">
                        <TailButton
                            variant="navy"
                            size='lg'
                            onClick={() => { }}
                            className='font-medium'
                        >
                            자세히 보기
                        </TailButton>
                    </div>
                </div>

                {/* 오른쪽 LookBook */}
                <div className="w-full xl:flex-1">
                    <LookBook imageSrc="src/assets/model2.png" items={model2Items} infoPosition="left" />
                </div>
            </div>

            <div className="my-30">
                <ProductCarousel title="인기 상품" column="popular" />
            </div>
        </>
    );
}
