// components 목록
import ProductCarousel from "./ProductCarousel"
import BannerSlider from "./BannerSlider";
import LookBook from "./LookBook";

const model1Items = [
    {
        x: "120px", // 왼쪽에서의 거리
        y: "200px", // 위에서의 거리
        name: "화이트 크롭 자켓",
        price: 49900,
        fullcode: "1122414357LOPVJM",
    },
    {
        x: "130px",
        y: "500px",
        name: "하이웨이스트 와이드팬츠",
        price: 39900,
        fullcode: "1326444369FRVUFW",
    }
];

const model2Items = [
    {
        x: "100px", // 인물의 어깨 부근
        y: "180px",
        name: "코튼 베이지 오버셔츠",
        price: 45900,
        fullcode: "1224434351BKCHYA",
    },
    {
        x: "110px", // 허리 부근
        y: "450px",
        name: "슬림핏 데님 팬츠",
        price: 42900,
        fullcode: "1324444364GUVUTT",
    },
    {
        x: "130px", // 발 부근
        y: "700px",
        name: "화이트 로우탑 스니커즈",
        price: 36900,
        fullcode: "1122574370WFOZVM",
    }
];

export default function Home() {
    return (
        <>
            {/* 배너 */}
            <div className="w-full mb-20">
                <BannerSlider />
            </div>

            {/* 상품 */}
            <ProductCarousel title="추천 스타일" column="recommendedItems" />

            <div className="flex justify-between items-center w-full h-screen px-10 bg-white">
                <LookBook imageSrc="src/assets/model1.png" items={model1Items} />
                <LookBook imageSrc="src/assets/model2.png" items={model2Items} />
            </div>


            <ProductCarousel title="인기 상품" column="popularItems" />
        </>
    )
}
