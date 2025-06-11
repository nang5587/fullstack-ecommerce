// components 목록
import Nav from "./components/Nav";
import ProductCarousel from "./components/ProductCarousel";
import BannerSlider from "./components/BannerSlider";

function App() {
  return (
    <div className="w-full min-h-screen flex flex-col bg-gray-50">
      <header className="w-full h-32 bg-white flex flex-col flex-shrink-0">
        <Nav />
      </header>

      <main className="w-full flex-1">
        {/* 배너 */}
        <div className="w-full mb-20">
          <BannerSlider />
        </div>

        {/* 상품 */}
        <ProductCarousel title="추천 스타일"/>
        <ProductCarousel title="인기 상품"/>
      </main>

      <footer className="w-full h-40 outline-2 outline-gray-300">
        <p>footer입니다.</p>
      </footer>
    </div>
  )
}

export default App;