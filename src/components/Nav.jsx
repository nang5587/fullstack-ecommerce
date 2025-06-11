// css
import '../react/style.css'

// UI 목록
import TailSearch from "../UI/TailSearch";

// Icon 목록
import { BiCategoryAlt } from "react-icons/bi";
import { RiShoppingBagLine } from "react-icons/ri";
import { FiUser } from "react-icons/fi";

// 훅 목록
import { useState } from 'react';

export default function Nav() {
    // user 아이콘의 드롭다운 상태 관리 변수 선언
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    return (
        <>
            <div className="h-3/5 flex items-center justify-between px-20 gap-8">
                <a href="/" id="test" className="flex flex-row items-baseline gap-2 flex-shrink-0 text-5xl text-black">
                    {/* 📢 스토어명 정하기 */}
                    <h1>NAVER</h1>
                    <span>STORE</span>
                </a>

                {/* 검색창 (중앙) */}
                <div className="w-full max-w-2xl">
                    <TailSearch />
                </div>

                {/* 사용자 메뉴 (오른쪽) */}
                <div className="flex items-center gap-6 flex-shrink-0">
                    {/* 아이콘 그룹 */}
                    <div className="flex items-center text-2xl text-gray-700">
                        <a href="#" className="hover:text-blue-500 block cursor-pointer"><RiShoppingBagLine /></a>
                        <div className="relative" onMouseEnter={() => setIsDropdownOpen(true)} onMouseLeave={() => setIsDropdownOpen(false)}>
                            {/* 사용자 아이콘 */}
                            <a href="#" className="hover:text-blue-500 block cursor-pointer px-7">
                                <FiUser />
                            </a>

                            {/* 이게 핵심: hover 가능한 '버퍼' 공간을 추가 */}
                            {isDropdownOpen && (
                                <div className="absolute top-full right-0 z-10 w-44">
                                    {/* 버퍼 영역 (공간 유지용, height는 조절 가능) */}
                                    <div className="h-5"></div>

                                    {/* 실제 드롭다운 메뉴 */}
                                    <div className="bg-white rounded-md shadow-xl">
                                        <div className="py-1 text-center">
                                            <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">로그인</a>
                                            <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">마이페이지</a>
                                            <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">주문조회</a>
                                            {/* <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">로그아웃</a> */}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

            </div>

            {/* 카테고리 배치 */}
            <div className="h-2/5 flex items-center px-20 gap-8">
                <button className="flex items-center gap-1.5 font-medium text-2xl text-gray-700 hover:cursor-pointer">
                    <BiCategoryAlt />
                </button>
            </div>
        </>
    )
}
