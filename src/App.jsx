// UI 목록
import TailSearch from "./UI/TailSearch";
// Icon 목록
import { BiCategoryAlt } from "react-icons/bi";
import { RiShoppingBagLine } from "react-icons/ri";
import { FiUser } from "react-icons/fi";

function App() {
  return (
    <div className="w-full min-h-screen flex flex-col bg-gray-50">

      <header className="w-full h-40 bg-white border-b border-gray-200 flex flex-col flex-shrink-0">
        
        {/* ----- 중간 섹션 (전체적인 레이아웃 재구성) ----- */}
        {/* 1. 세 개의 큰 덩어리(로고, 검색창, 사용자 메뉴)를 수평으로 배치하고 중앙 정렬 */}
        <div className="h-3/5 flex items-center justify-between px-20 gap-8">
          
          {/* 로고 (왼쪽) */}
          <a href="/" className="flex items-baseline gap-2 flex-shrink-0">
            <h1 className="text-4xl font-extrabold text-[#03C75A] font-aggro">NAVER</h1>
            <span className="text-3xl font-extrabold text-[#7346F3] font-aggro">스토어</span>
            <span className="text-2xl font-bold text-store font-aggro">패션/뷰티</span>
          </a>

          {/* 검색창 (중앙) */}
          <div className="w-full max-w-2xl">
            <TailSearch />
          </div>

          {/* 사용자 메뉴 (오른쪽) */}
          {/* 2. 아이콘과 텍스트 링크들을 하나의 그룹으로 묶고, 수직 중앙 정렬 */}
          <div className="flex items-center gap-6 flex-shrink-0">
            {/* 아이콘 그룹 */}
            <div className="flex items-center gap-5 text-3xl text-gray-700">
              <a href="#" className="hover:text-naver"><RiShoppingBagLine /></a>
              <a href="#" className="hover:text-naver"><FiUser /></a>
            </div>
            {/* 텍스트 링크 그룹 */}
            <div className="flex items-center gap-5 text-base text-gray-700 font-medium">
              <a href="#" className="hover:text-naver hover:underline">로그인</a>
              <a href="#" className="hover:text-naver hover:underline">고객센터</a>
            </div>
          </div>
        </div>

        {/* ----- 하단 섹션 (카테고리 메뉴) ----- */}
        {/* 3. 하단 섹션에 구분선을 주고, 메뉴들을 배치 */}
        <div className="h-2/5 flex items-center px-20 gap-8">
          <a href="#" className="flex items-center gap-1.5 font-bold text-3xl text-gray-700">
            <BiCategoryAlt />
          </a>
        </div>
      </header>

      <main className="w-full flex-1">
        <div className="p-8">
          <h2 className="text-2xl font-bold">메인 콘텐츠 영역</h2>
          <p>이곳에 상품 목록이나 다른 내용들이 표시됩니다.</p>
        </div>
      </main>

    </div>
  )
}

export default App;