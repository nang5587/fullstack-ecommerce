// components 목록
import ProductCarousel from "./ProductCarousel";
import BannerSlider from "./BannerSlider";
import LookBook from "./LookBook";

// UI 목록
import TailButton from "../UI/TailButton";

// 훅 목록
import { useRef, useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { useAuth } from '../context/AuthContext';

import Particle from "./Particle";

import axios from 'axios';

// 광고 항목
const banners = [
    '264713001',
    '920183745',
    '270381003',
    '194837261',
    '760394812',
    '241436006',
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
const LookBookSection = ({navigate}) => (
    <div className="relative z-10 isolate overflow-hidden flex justify-center items-center px-6 lg:px-40 w-full h-auto lg:min-h-[800px] my-30
    bg-[url('/beach.jpg')] bg-cover bg-center bg-no-repeat
    ">
        <div className="absolute inset-0 z-0">
            <Particle />
        </div>
        <div className="relative z-20 w-full flex flex-col 2xl:flex-row justify-between items-stretch gap-10 py-10">
            <div className="w-full xl:flex-1">
                <LookBook imageSrc="src/assets/model1.png" items={model1Items} infoPosition="right" />
            </div>
            <div className="w-full xl:w-[600px] max-w-full flex flex-col items-center justify-center text-center">
                <h2 id="font5" className="text-6xl font-bold mb-8 lg:mb-20 text-white text-glow">2025 S/S SWIMWEAR</h2>
                <p className="text-base lg:text-xl mb-8 lg:mb-20 text-white leading-relaxed whitespace-nowrap">
                    따사로운 햇살과 함께 시작되는 새로운 계절.<br />
                    2025 S/S LOOKBOOK은 간결함 속 디테일,<br />
                    클래식과 트렌드의 조화를 담아냈습니다.<br />
                    지금, 당신의 계절을 디자인하세요.
                </p>
                <div className="w-[160px] lg:w-1/4">
                    <TailButton
                        size='lg'
                        onClick={() => navigate('/products?main=swimwear&mid=bikini&mid=one_pice&page=1')}
                        // onClick={() => console.log("dks")}
                        className='font-bold shadow-nm rounded-sm py-2 bg-opacity-0 text-white whitespace-nowrap'
                    >
                        자세히 보기
                    </TailButton>
                </div>
            </div>
            <div className="w-full xl:flex-1">
                <LookBook imageSrc="src/assets/model2.png" items={model2Items} infoPosition="left" />
            </div>
        </div>
    </div>
);

export default function Home() {
    const { isLoggedIn } = useAuth();
    const bannerRef = useRef(null);
    const recommendRef = useRef(null);
    const popularRef = useRef(null);
    const [isScrolling, setIsScrolling] = useState(false);
    const [hasScrolled, setHasScrolled] = useState(false);

    const navigate = useNavigate();

    // 추천 상품 유무 추적
    const [hasRecommendations, setHasRecommendations] = useState(false);
    const [checkingRecs, setCheckingRecs] = useState(true);

    // ✅ 로그인 상태가 변경되면 추천 상품이 있는지 확인
    useEffect(() => {
        // 비로그인 상태면 확인할 필요 없음
        if (!isLoggedIn) {
            setHasRecommendations(false);
            setCheckingRecs(false); // 확인 완료
            return;
        }

        // 로그인 상태면 추천 상품 API 호출
        const checkRecommendations = async () => {
            setCheckingRecs(true); // 확인 시작
            try {
                const baseUrl = import.meta.env.VITE_BACKEND_URL;
                const url = `http://${baseUrl}/api/public/recommend`;
                const token = localStorage.getItem('accessToken');

                if (!token) {
                    setHasRecommendations(false);
                    return;
                }

                const config = { headers: { 'Authorization': `Bearer ${token}` } };
                const response = await axios.get(url, config);
                const items = response.data?.recommendedItems;

                // 상품이 하나라도 있으면 true
                setHasRecommendations(items && items.length > 0);

            } catch (error) {
                console.error("추천 상품 확인 중 에러:", error);
                setHasRecommendations(false); // 에러 시 추천 없음으로 처리
            } finally {
                setCheckingRecs(false); // 확인 완료
            }
        };

        checkRecommendations();
    }, [isLoggedIn]); // 로그인 상태가 바뀔 때만 실행

    const smoothScrollTo = useCallback((targetY, duration = 800) => {
        setIsScrolling(true); // 스크롤 시작 시 상태 업데이트
        const startY = window.scrollY;
        const distance = targetY - startY;
        const startTime = performance.now();

        const step = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const ease = 1 - Math.pow(1 - progress, 3);
            window.scrollTo(0, startY + distance * ease);
            if (elapsed < duration) {
                requestAnimationFrame(step);
            } else {
                setIsScrolling(false); // 스크롤 종료 시 상태 업데이트
            }
        };
        requestAnimationFrame(step);
    }, []); // 이 함수는 의존성이 없으므로 빈 배열


    // ✅ 2. handleWheel 이벤트 핸들러도 useCallback으로 감싸서 안정화시킵니다.
    const handleWheel = useCallback((e) => {
        const deltaY = e.deltaY;
        const scrollY = window.scrollY;
        const bannerHeight = bannerRef.current?.offsetHeight ?? 0;

        if (isScrolling) {
            e.preventDefault();
            return;
        }
        if (!hasScrolled && deltaY > 0 && scrollY < bannerHeight - 50) {
            e.preventDefault();
            setHasScrolled(true);
            const targetRef = isLoggedIn && hasRecommendations ? recommendRef : popularRef;
            if (targetRef.current) {
                const targetY = targetRef.current.offsetTop;
                smoothScrollTo(targetY, 1800);
            }
        }
    }, [isScrolling, hasScrolled, isLoggedIn, hasRecommendations, smoothScrollTo]);


    // ✅ 3. useEffect는 이제 이벤트 리스너를 등록하고 해제하는 역할만 담당하여 훨씬 깔끔해집니다.
    useEffect(() => {
        window.addEventListener("wheel", handleWheel, { passive: false });
        return () => {
            window.removeEventListener("wheel", handleWheel);
        };
    }, [handleWheel]); // handleWheel 함수가 변경될 때만 리스너를 재등록


    // 로딩 중일 때 표시할 레이아웃
    if (checkingRecs) {
        return (
            <>
                <div ref={bannerRef} style={{ height: 'calc(100vh - 6rem)' }}>
                    <BannerSlider banners={banners} />
                </div>
                <div className="flex flex-col gap-20">
                    <div className="my-30" ref={popularRef}>
                        <ProductCarousel title="인기 상품" column="popular" />
                    </div>
                    <LookBookSection navigate={navigate}/>
                </div>
            </>
        );
    }

    // 로딩 완료 후 최종 레이아웃
    const showRecommendFirst = isLoggedIn && hasRecommendations;
    return (
        <>
            <div ref={bannerRef} className="w-full mb-20" style={{ height: 'calc(100vh - 6rem)' }}>
                <BannerSlider banners={banners} />
            </div>
            <div className="flex flex-col gap-20">
                {showRecommendFirst ? (
                    <>
                        <div className="my-30" ref={recommendRef}><ProductCarousel title="최근 본 스타일" column="recommend" /></div>
                        <LookBookSection navigate={navigate} />
                        <div className="my-30"><ProductCarousel title="인기 상품" column="popular" /></div>
                    </>
                ) : (
                    <>
                        <div className="my-30" ref={popularRef}><ProductCarousel title="인기 상품" column="popular" /></div>
                        <LookBookSection navigate={navigate}/>
                    </>
                )}
            </div>
        </>
    );
}

