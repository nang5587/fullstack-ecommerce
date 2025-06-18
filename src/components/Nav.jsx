// UI 목록
import TailSearch from "../UI/TailSearch";

// component 목록
import Category from './Category';

// Icon 목록
import { RiShoppingBagLine } from "react-icons/ri";
import { FiUser } from "react-icons/fi";
import { BiCategoryAlt } from "react-icons/bi";

// 훅 목록
import { useEffect, useState } from 'react';
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext"

export default function Nav() {
    // user 아이콘의 드롭다운 상태 관리 변수 선언
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    // 카테고리 랜더링
    const [isCateOpen, setIsCateOpen] = useState(false);

    const { isLoggedIn, logout } = useAuth();
    
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');
    }

    return (
        <>
            <div className="relative z-30 bg-white p-4">
                <div className='flex items-center justify-between px-10 gap-8'>
                    <div className='flex'>
                        <Link to="/" id="font" className="flex flex-row items-center gap-2 flex-shrink-0 text-4xl text-black hover:text-kalani-gold">
                            {/* 📢 스토어명 정하기 */}
                            <h1>KALANI</h1>
                            {/* <span>STORE</span> */}
                        </Link>

                        {/* 네비 */}
                        {/* 카테고리 아이콘 */}
                        <div className="flex items-center px-10 py-4">
                            <button className="px-4 py-2 text-2xl text-gray-700 hover:text-kalani-gold font-extralight hover:cursor-pointer"
                                onClick={() => setIsCateOpen(true)}>
                                <BiCategoryAlt />
                            </button>
                            <button
                                onClick={() => {
                                    navigate("/products?gender=f");
                                    setIsCateOpen(false);
                                }}
                                className="px-4 py-2 text-sm text-gray-700 font-bold hover:cursor-pointer hover:text-kalani-gold"
                            >
                                WOMAN
                            </button>
                            <button
                                onClick={() => {
                                    navigate("/products?gender=m");
                                    setIsCateOpen(false);
                                }}
                                className="px-4 py-2 text-sm text-gray-700 font-bold hover:cursor-pointer hover:text-kalani-gold"
                            >
                                MAN
                            </button>
                            <button
                                onClick={() => {
                                    navigate("/products?main=kids");
                                    setIsCateOpen(false);
                                }}
                                className="px-4 py-2 text-sm text-gray-700 font-bold hover:cursor-pointer hover:text-kalani-gold"
                            >
                                KIDS
                            </button>
                            <button
                                onClick={() => {
                                    navigate("/products?main=acc");
                                    setIsCateOpen(false);
                                }}
                                className="px-4 py-2 text-sm text-gray-700 font-bold hover:cursor-pointer hover:text-kalani-gold"
                            >
                                ACC
                            </button>
                        </div>
                    </div>

                    <div className="flex items-center gap-5">
                        <div className="w-full max-w-xs min-w-xs">
                            <TailSearch />
                        </div>

                        {/* 아이콘 그룹 */}
                        <div className="flex items-center text-2xl text-gray-700 gap-6">
                            <Link to="/cart" className="hover:text-kalani-gold block cursor-pointer"><RiShoppingBagLine /></Link>
                            <div className="relative" onMouseEnter={() => setIsDropdownOpen(true)} onMouseLeave={() => setIsDropdownOpen(false)}>
                                {/* 사용자 아이콘 */}
                                <Link to="/mypage" className="hover:text-kalani-gold block cursor-pointer">
                                    <FiUser />
                                </Link>

                                {/* 이게 핵심: hover 가능한 '버퍼' 공간을 추가 */}
                                {isDropdownOpen && (
                                    <div className="absolute top-full right-0 z-10 w-44 pl-5">
                                        {/* 버퍼 영역 (공간 유지용, height는 조절 가능) */}
                                        <div className="h-5"></div>

                                        {/* 실제 드롭다운 메뉴 */}
                                        <div className="bg-white rounded-md shadow-nm">
                                            <div className="py-3 text-center">
                                                { !isLoggedIn && <> <button
                                                    onClick={() => {
                                                        navigate("/login");
                                                        setIsDropdownOpen(false);
                                                    }}
                                                    className="block w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                                >
                                                    로그인
                                                </button>
                                                <Link to="/sign" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">회원가입</Link></>}
                                                <Link to="/" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">공지사항</Link>
                                                <Link to="/" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">F&Q</Link>
                                                <Link to="/" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">고객센터</Link>
                                                { isLoggedIn && <button
                                                    onClick={() => {
                                                        handleLogout();
                                                        setIsDropdownOpen(false);
                                                    }}
                                                    className="block w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                                >
                                                    로그아웃
                                                </button>}
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* 카테고리 창 */}
            <div
                className={`fixed inset-0 bg-gray-500/30 z-40 transition-opacity duration-300
                            ${isCateOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}
                        `}
                onClick={() => setIsCateOpen(false)}
            />

            <div
                className={`absolute left-0 top-0 z-50 w-[450px] bg-white shadow-xl transition-all duration-500 transform
                            ${isCateOpen ? "translate-x-0 opacity-100" : "-translate-x-10 opacity-0 pointer-events-none"}
                        `}
                style={{ transformOrigin: 'left top' }}
            >
                <Category isCateOpen={isCateOpen} onClose={() => setIsCateOpen(false)} />
            </div>
        </>
    );
}
